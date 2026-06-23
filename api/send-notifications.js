// api/send-notifications.js
// This is a Vercel Serverless Function. Vercel's cron job calls this URL
// automatically every day at the scheduled time (set in vercel.json).
//
// What it does:
// 1. Connects to Supabase
// 2. Finds all users who have NOT practiced today
// 3. For each of those users, looks up their push subscription
// 4. Sends them a push notification via the web-push library

const webpush = require("web-push");

// These come from Vercel Environment Variables (set in dashboard)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:you@example.com", // contact email, required by push services
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Helper: get today's date as YYYY-MM-DD in a given timezone offset
// (Vercel servers run in UTC, so we need to be careful here)
function getTodayStr() {
  const now = new Date();
  // Using UTC date is fine here since we compare against testHistory dates
  // which are already stored as the user's local date string
  return now.toISOString().slice(0, 10);
}

module.exports = async (req, res) => {
  // Optional: protect this endpoint so randoms can't trigger it
  const authHeader = req.headers["authorization"];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // 1. Fetch all users' progress
    const progressRes = await fetch(`${SUPABASE_URL}/rest/v1/progress?select=user_id,data`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    const allProgress = await progressRes.json();

    const todayStr = getTodayStr();

    // 2. Filter to users who haven't practiced today
    const usersToNotify = allProgress.filter((row) => {
      const history = row.data?.stats?.testHistory || [];
      const practicedToday = history.some((h) => h.date === todayStr);
      return !practicedToday;
    });

    console.log(`Found ${usersToNotify.length} users to notify`);

    // 3. For each user, fetch their push subscription and send notification
    const results = [];
    for (const user of usersToNotify) {
      const subRes = await fetch(
        `${SUPABASE_URL}/rest/v1/push_subscriptions?user_id=eq.${encodeURIComponent(user.user_id)}&select=subscription`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      const subs = await subRes.json();

      for (const subRow of subs) {
        try {
          await webpush.sendNotification(
            subRow.subscription,
            JSON.stringify({
              title: "يلا! 🔥 Time to practice",
              body: "Don't break your streak! Just 5 minutes keeps it alive.",
              url: "/",
            })
          );
          results.push({ user: user.user_id, status: "sent" });
        } catch (err) {
          console.error(`Failed to send to ${user.user_id}:`, err.message);
          results.push({ user: user.user_id, status: "failed", error: err.message });

          // If subscription is expired/invalid (410 Gone), delete it
          if (err.statusCode === 410) {
            await fetch(
              `${SUPABASE_URL}/rest/v1/push_subscriptions?user_id=eq.${encodeURIComponent(user.user_id)}`,
              {
                method: "DELETE",
                headers: {
                  apikey: SUPABASE_KEY,
                  Authorization: `Bearer ${SUPABASE_KEY}`,
                },
              }
            );
          }
        }
      }
    }

    return res.status(200).json({ checked: allProgress.length, notified: results.length, results });
  } catch (err) {
    console.error("send-notifications error:", err);
    return res.status(500).json({ error: err.message });
  }
};

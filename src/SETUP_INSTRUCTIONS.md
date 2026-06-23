# Push Notifications Setup — Step by Step

## What you're setting up
Real push notifications that work even when the app is closed. At 7pm EST every day, anyone who hasn't practiced gets a notification on their phone.

## Files in this package
- `App.jsx` → replaces `src/App.jsx`
- `public/sw.js` → NEW file, put in `public/sw.js`
- `api/send-notifications.js` → NEW file, put in `api/send-notifications.js`
- `vercel.json` → NEW file, put in project root (same level as package.json)
- `supabase_setup.sql` → run this in Supabase SQL Editor

## Step 1 — Supabase: create the subscriptions table
Open Supabase SQL Editor, paste and run the contents of `supabase_setup.sql`.

## Step 2 — Add files to your repo
In `~/Downloads/egyptian-arabic/`:
1. Replace `src/App.jsx` with the new one
2. Create `public/sw.js` with the service worker content
3. Create `api/send-notifications.js` (you'll need to create the `api` folder)
4. Create `vercel.json` in the root (next to package.json)

## Step 3 — Install web-push library
In Terminal:
```bash
cd ~/Downloads/egyptian-arabic
npm install web-push
```
This adds it to package.json so Vercel installs it automatically.

## Step 4 — Add environment variables in Vercel
Go to Vercel → your project → Settings → Environment Variables. Add:

| Name | Value |
|------|-------|
| `VAPID_PUBLIC_KEY` | `BDwu1C95RuRl7jLHzxzpk8YNwzAYhGo8wDzXNSWvLP_c8ME8vMUkuK2w2miArLjrlpPDyFrUMi_SxpaPXtfMiFM` |
| `VAPID_PRIVATE_KEY` | `_lnTs551eIcGyIa8m0CfIgcxs_x9FgklZIvkfpZoXaQ` |
| `CRON_SECRET` | (optional) any random string, e.g. `egy2026secret` |

⚠️ The PRIVATE key must stay secret — never put it in App.jsx or any client-side file. It only goes in Vercel's server-side environment variables, which is what `api/send-notifications.js` reads.

## Step 5 — Push everything to GitHub
```bash
cd ~/Downloads/egyptian-arabic
git add .
git commit -m "Add push notifications - service worker, cron job, VAPID keys"
git push origin main
```

## Step 6 — Verify the cron job
After deploying, go to Vercel → your project → Settings → Cron Jobs. You should see `/api/send-notifications` scheduled for `0 23 * * *` (7pm EST).

## Step 7 — Test on your phone
1. Open the app on your phone (must be added to home screen)
2. It will ask for notification permission — tap Allow
3. To test immediately without waiting for 7pm, visit this URL in your browser (replace with your domain):
   `https://egyptian-arabic.vercel.app/api/send-notifications`
4. If you set a CRON_SECRET, you'll need to call it with that header — for manual testing, you can temporarily remove the CRON_SECRET check or test via Vercel's function logs

## How to know it's working
- Vercel → your project → Deployments → Functions tab → you'll see logs each time the cron runs
- Check `push_subscriptions` table in Supabase — your user_id should appear after granting permission

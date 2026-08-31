# Cross-device sync setup

By default the tracker saves progress in the browser it's open in (`localStorage`).
That does not travel between computers. This optional setup adds a tiny backend on
**Google Apps Script** that keeps your progress in a single JSON file in **your
Google Drive**, so any computer you connect sees the same state.

No cost. No Google Cloud Console. No third-party service.

---

## 1. Create the script

1. Go to <https://script.google.com> and click **New project**.
2. Delete whatever is in the editor and paste the entire contents of
   [`apps-script/Code.gs`](apps-script/Code.gs).
3. Change this line to your own long random string:

   ```js
   const SECRET = 'REPLACE_WITH_A_LONG_RANDOM_STRING';
   ```

   Generate one however you like — a password manager, or paste this into a
   browser console:

   ```js
   crypto.randomUUID() + crypto.randomUUID()
   ```

   Keep a copy; you'll paste it into the tracker in step 3.
4. Give the project a name (e.g. `sotapatti-sync`) and save.

## 2. Deploy it as a Web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. Google will ask you to authorise the script — it needs
   permission to create/read one file in your Drive. Approve it. (You may see an
   "unverified app" screen because it's your own private script: **Advanced →
   Go to `<project>` (unsafe)** — this is your own code, it's fine.)
5. Copy the **Web app URL**. It looks like:

   ```
   https://script.google.com/macros/s/AKfy……/exec
   ```

If you edit `Code.gs` later, do **Deploy → Manage deployments → edit → Version:
New version** so the URL keeps working with the new code.

## 3. Connect the tracker

1. Open `sotapatti-practice-plan.html`.
2. In the footer, click **Set up sync**.
3. Paste the **Web app URL** and the **secret key** from step 1.
4. Click **Connect**. The status line should switch to **Synced**.

Repeat step 3 on every computer. The URL and key are stored only in that
browser's `localStorage` — they are never committed to this repo.

---

## How conflicts are handled

Each save is stamped with a timestamp. On connect or page load, whichever side
(this device vs. the stored file) was written **most recently** wins. It's a
single-user tool, so this is deliberately simple — if you tick boxes on two
machines while both are offline, the last one to sync overwrites the other.

## If sync fails

The page always keeps a local copy, so a failed sync never loses the current
session — the status line just shows "Sync failed — saved on this device" or
"Offline — using this device". Common causes:

- Wrong secret key → the endpoint returns `unauthorized`.
- Used the `/dev` URL instead of the `/exec` URL.
- Deployment access not set to **Anyone**.
- A new version of `Code.gs` was saved but not redeployed.

## Removing sync

Click **Set up sync → Disconnect** on a device to forget the URL and key there.
To shut it down entirely, delete the deployment in the Apps Script project (and
optionally delete `sotapatti-practice-plan.progress.json` from your Drive).

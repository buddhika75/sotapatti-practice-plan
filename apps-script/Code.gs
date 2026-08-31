/**
 * Sotapatti practice plan - sync backend (Google Apps Script)
 *
 * Stores the tracker's progress as a single JSON file in the Google Drive of
 * whoever deploys this script. The web page reads and writes that file over
 * HTTPS, so your checkboxes follow you between computers.
 *
 * See ../SYNC-SETUP.md for the full walkthrough. Short version:
 *
 *   1. https://script.google.com  ->  New project  ->  replace the default
 *      file's contents with this file.
 *   2. Change SECRET below to your own long random string.
 *   3. Deploy  ->  New deployment  ->  select type "Web app".
 *          Execute as:      Me
 *          Who has access:  Anyone
 *   4. Authorise when prompted (it needs Drive access to store the file).
 *   5. Copy the Web app URL (it ends in /exec).
 *   6. In the tracker, click "Set up sync" and paste the URL + the SECRET.
 *      Repeat step 6 once on every computer you use.
 *
 * The Web app URL is an unauthenticated endpoint, so the SECRET is what keeps
 * other people out. Treat it like a password: long, random, not reused.
 */

const SECRET = 'REPLACE_WITH_A_LONG_RANDOM_STRING';
const FILE_NAME = 'sotapatti-practice-plan.progress.json';

function doGet(e)  { return handle_(e); }
function doPost(e) { return handle_(e); }

function handle_(e) {
  const p = (e && e.parameter) || {};

  if (p.key !== SECRET) {
    return out_({ error: 'unauthorized' });
  }

  if (p.action === 'save') {
    const raw = (e.postData && e.postData.contents) || p.data || '{}';
    return out_({ ok: true, data: write_(raw) });
  }

  // default: load
  return out_({ ok: true, data: read_() });
}

function file_() {
  const it = DriveApp.getFilesByName(FILE_NAME);
  while (it.hasNext()) {
    const f = it.next();
    if (!f.isTrashed()) return f;
  }
  return DriveApp.createFile(FILE_NAME, '{}', 'application/json');
}

function read_() {
  try {
    return JSON.parse(file_().getBlob().getDataAsString() || '{}');
  } catch (err) {
    return {};
  }
}

function write_(raw) {
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch (err) {
    obj = {};
  }
  file_().setContent(JSON.stringify(obj));
  return obj;
}

function out_(o) {
  return ContentService
    .createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

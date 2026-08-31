# sotapatti-practice-plan

A single self-contained HTML file: a personal, step-by-step practice tracker.

It walks through four phases — **foundation**, **stability**, **investigation**,
and **integration** — and lets you check off steps as you go.

## Usage

Open `sotapatti-practice-plan.html` in a web browser and tick steps as you
complete them. The progress bar at the top tracks the overall count.

## Saving progress

- **By default:** progress is saved in that browser via `localStorage` — no
  server, no account. It persists across visits on the same browser and device,
  but does not travel to other computers.
- **Optional cross-device sync:** connect the tracker to a small Google Apps
  Script backend that stores progress as one JSON file in your Google Drive.
  Then every computer you connect shares the same state. See
  [`SYNC-SETUP.md`](SYNC-SETUP.md). The backend script is in
  [`apps-script/Code.gs`](apps-script/Code.gs); it's protected by a secret key
  that you set and that is never stored in this repo.

This is a personal project and is unrelated to any other work.

# All Blacks Matchday 23 website

This folder is ready to publish as a static website. It contains only the public HTML page and player portrait assets; the Excel tracker, PBIX files, backups, and project notes are not included.

## Preview locally

Open `index.html` in a browser. The match selector works without a server, and kick-off times are shown in the visitor's device timezone.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder so `index.html` is at the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. Open the Pages URL GitHub provides after the deployment finishes.

## Weekly updates

Update the fixture and lineup data inside `index.html`, then upload the changed `index.html` and any new files in `assets/players`. Keep player image filenames identical to their lowercase, hyphenated PlayerID.

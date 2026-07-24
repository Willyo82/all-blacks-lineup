# All Blacks Matchday 23 website

This folder is ready to publish as a static website. It contains only the public HTML page and player portrait assets; the Excel tracker, PBIX files, backups, and project notes are not included.

## Preview locally

Open `Match_Day.html` in a browser. The match selector works without a server, and kick-off times are shown in the visitor's device timezone. Opening `index.html` redirects to the Match Day view so the GitHub Pages root address continues to work.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder so `index.html` and `Match_Day.html` are at the repository root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. Open the Pages URL GitHub provides after the deployment finishes.

## Weekly updates

All editable match data is in `data/matches.js`. Do not edit the player comparisons or filter totals in `Match_Day.html`.

When a team is released:

1. Find the upcoming fixture in `data/matches.js`.
2. Change its `status` from `"upcoming"` to `"released"`.
3. Add `sourceUrl`, `unavailable`, and exactly 23 `lineup` records.
4. Each lineup record needs the jersey number (`n`), matching player ID (`id`), display name (`name`), and caps at selection (`caps`). Add `captain: true` or `debut: true` when applicable.
5. Add a new portrait to `assets/players` only when the player does not already have one. The PNG filename must exactly match the player ID.

The website automatically finds the previous released match and calculates retained starters, promotions from the bench, positional moves, new selections, players dropped to the bench, players dropped out of the 23, injury markers, filter counts, and the forwards/backs bench split.

When no match is specified in the address, the Match Day view sorts fixtures by date, finds the nearest fixture whose team is not released, and opens the released team immediately before it.

After the match, change `status` to `"completed"` and add the result as `score: { allBlacks: 00, opponent: 00 }`.

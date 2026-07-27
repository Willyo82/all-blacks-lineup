# All Blacks selection tracker

A fan-built visual tracker for understanding how the All Blacks matchday 23 and wider squad change from one selection to the next.

Built by [Willy (Willyo82)](https://github.com/Willyo82) and hosted on GitHub Pages.

## Open the tracker (BEST VIEWED BY CLICKING F11)

- [Match Day team](https://willyo82.github.io/all-blacks-lineup/Match_Day.html)
- [Latest squad](https://willyo82.github.io/all-blacks-lineup/squad.html)

The Match Day view compares each selected team with the previous released lineup, making retained players, positional moves, bench promotions, injuries and players leaving the 23 easy to see. The Squad view groups the wider squad by playing unit and is ready to highlight changes when touring squads are announced.

## Inspired by Rugby From The Stands

This project was inspired by [Rugby From The Stands](https://www.youtube.com/@RugbyFromTheStands), a fan-led rugby channel built around honest opinions, match breakdowns and community conversation.

- [Watch Rugby From The Stands](https://www.youtube.com/@RugbyFromTheStands)
- [Join the Rugby From The Stands community](https://www.youtube.com/@RugbyFromTheStands/community)

The tracker is an independently built fan project and is not owned by, operated by or published under the Rugby From The Stands brand.

## Run locally

Open `Match_Day.html` in a browser. The match selector works without a server, and kick-off times are shown in the visitor's device timezone. Opening `index.html` redirects to the Match Day view so old links and the GitHub Pages root address continue to work.

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

## Security and privacy

This is a static website with no server-side code, accounts, forms, cookies, analytics or payment processing. It does not collect personal information from visitors.

Only files intended for public display belong in this repository. Never commit passwords, API keys, private spreadsheets, PBIX files, backups or unpublished team information. If a sensitive value is committed accidentally, revoke it immediately and remove it from the repository history; deleting it in a later commit is not enough.

## Attribution and disclaimer

This is an independent, unofficial fan project. It is not affiliated with or endorsed by New Zealand Rugby, the All Blacks or Rugby From The Stands.

Player names, team marks and official player portraits remain the property of their respective rights holders. Match and squad information should be checked against official announcements before publication.

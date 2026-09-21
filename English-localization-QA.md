# English localization — 2026-09-21

The playable website now uses English throughout: desktop, Start menu, app windows, work documents, messages, notifications, calendar, default notes, photo captions, music, games, help, receipts and evening transitions. Names are localized consistently as Yuan, Lin and Manager. User-authored notes remain untouched.

Changed files: index.html, app.js, desktop.js, leisure.js, windows-shell.js, office.css; added english.js for existing-save text migration. No story expansion or scoring changes. Original archives and media remain unchanged.

Existing saves retain completed tasks, choices, event history and scores. Preset Chinese messages and work titles migrate once; the original v4 save is backed up under unsaved-work-log.act1.v4.before-english. Only the exact original default note is translated; custom notes are preserved.

## Actual browser verification

- All four regular tasks → agree to basketball → attend → Tuesday.
- Accept and submit overtime → Tuesday, both with advance notice and without notice after promising to attend.
- Leave before finishing regular work → rest → Tuesday.
- Defer a reply → change plans → attend → Tuesday.
- Repeated submission and reload do not duplicate scores; reading, replies, saving and switching apps do not advance time.
- Old Chinese save migration preserves progress, exact backup and authored notes.
- All ten apps, office tabs, Help and departure checked for preset Chinese text.
- Default W01 sound, preview, incoming-message playback and persistent manual mute verified.
- Screenshots reviewed at desktop and mobile sizes; small-screen confirmation footers adapted for English copy.
- No JavaScript exceptions in completed checks.

Evidence: ../output/english-build/ contains browser results and screenshots. Existing first-act screenshots/windows11/ contains updated English screenshots. No second-act work is implemented or claimed.

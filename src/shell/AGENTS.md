---
title: "easylm phone shell"
summary: "narrow glass. four tabs. desktop sidebar stays."
last_updated: "2026-09-18"
status: living · easylm
---

# shell

Phone layout for `max-width: 768px`. Desktop chrome is unchanged.

Tabs: Chat · Studio · Learn · Options. Persist `easylm_phone_tab`. First visit: Chat.

- `phone_tabs.ts` is the SoT for tab ids and storage.
- `PhoneShell` mounts all four pages and hides inactive ones. Do not unmount Learn/Studio on tab change.
- Chat on phone: thin bar + sheet. No header HUD.
- Learn/Studio on phone: `variant="page"`. Not overlays on chat.

## Word Fighter - Local Agent Notes

- Use `yarn` for all package operations.
- Prefer Tailwind utility classes directly in components; avoid creating new classes with `@apply` when a Tailwind utility exists.
- After each change that alters features/behavior, bump `package.json` version (semver), update `CHANGELOG.md`, and update the version line in `README.md`.
- After completing a user-requested change set, run `git add .` and create a commit with a concise message (do not push unless asked).
- If asked to finalize work, run `git add .`, create a git commit, and tag it with the new version (e.g. `v0.4.3`).
- Online lobby: keep per-room unique player ids using `sessionStorage` (keyed by room code) so multiple users don't overwrite each other. Store player name in `localStorage`.
- Supabase setup: `supabase/schema.sql` defines tables/policies; realtime requires `rooms` and `players` to be added to `supabase_realtime` publication.

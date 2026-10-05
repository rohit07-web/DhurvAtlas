# Verification checklist
## Local checks
- TypeScript compilation.
- Production build.
- Dependency audit.
- Policy tests in PostgreSQL/PGlite: anonymous draft denial, regular-user write denial, self-promotion denial, approved-admin writes, published reads, private AI drafts, quota enforcement, unpublishing and membership revocation.
The policy harness recreates minimal Supabase auth/storage schemas locally; it does not emulate the Supabase Storage service.

## Live acceptance test
Use a clearly labelled test file from sample_data and an approved administrator.
1. Open /admin signed out: expect /login.
2. POST upload or generate-summary without a session: expect 401.
3. Cross-origin upload/AI requests: expect 403.
4. Log in with an ordinary non-admin account: denied. Verify direct database/storage calls cannot write.
5. Sign in as admin. Upload DEMO workflow verification.txt with an explicit sample-data description.
6. Refresh Content Library: resource must persist as draft. Anonymous detail/file URLs must return 404.
7. Open resource, create/edit a manual summary, save, refresh and confirm persistence.
8. If Gemini is configured, generate a draft from the attached text/PDF. Verify its content against the source. Failure must not show fabricated success.
9. Submit for review; confirm unpublished publicly. Publish; reload public library and find it by title.
10. Open preview and download. Confirm downloaded bytes match the source.
11. Unpublish and refresh. Anonymous library, detail page and file endpoint must no longer expose it.
12. Sign out, revisit admin and refresh: access must be denied.
13. Revoke an admin membership and confirm that existing sessions lose write access.

Do not record a successful live AI test unless a real model response and saved draft were observed.

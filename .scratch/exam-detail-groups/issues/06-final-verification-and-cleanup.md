# 06 — Final verification & cleanup

**What to build:** A full cross-case pass over the reworked exam detail page
plus the shared-widget consumers, and the leftover housekeeping: sweep for
i18n keys that became unused across the whole feature (grep-verified), update
the PRD status, and append the dated "Implemented" comments with verification
evidence to the issue files. No new functionality.

**Blocked by:** 05 — Screen proctoring setting in the exam's BasicSettings.

**Status:** ready-for-agent

- [ ] Browser sweep (dev server, super-admin/admin123): exam 11 (proctored,
      APPLY_SEB_GROUPS), exam 4 (proctoring off), exam 5 (legacy EXAM
      strategy), and a finished/archived exam (controls disabled) all behave
      per the PRD; template detail page and template wizard groups step pass
      regression (access contract absent, new default active); prepare-exam
      groups step unaffected.
- [ ] No unused i18n keys remain from the removed copy flow or the reworked
      boxes; every remaining new key appears verbatim in the client source.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [ ] PRD status updated; each issue file carries a dated "Implemented"
      comment with its verification evidence; browser-tooling artifacts from
      the sessions are deleted.

# Electronics theme implementation guide

This repository is an independent Shopify theme derived from Skeleton. Read
`docs/DECISIONS.md` before changing architecture. The owner's approved commercial
scope supersedes the upstream release candidate's no-sections conventions.

- Use stable Online Store 2.0 JSON templates, sections and section groups.
- Do not introduce preview-only `block` or `partial` tags.
- Preserve LICENSE.md and upstream attribution. Never copy Dawn, Horizon or commercial theme source.
- Translate storefront strings; use Shopify routes and escape merchant plain text.
- Never infer specifications, compatibility, inventory or guarantees.
- Keep business logic progressive: native Shopify forms must remain usable.
- Test with `npm test` and `npm run check`; don't silence Theme Check rules.
- No main merges, production theme uploads, visibility changes, paid resources or submission.
- A passing local test is not proof of Shopify rendering, editor support or acceptance.

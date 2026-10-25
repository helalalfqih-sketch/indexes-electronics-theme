# Test report — first review slice, 2026-10-25

## Local evidence

- Node 24.22.1; Shopify CLI 4.9.4; LiquidJS 10.21.1 (test renderer only).
- `npm test`: 12 tests passed. Six render the actual facts snippet with fixtures
  (missing data, incomplete rows, Arabic/models/units, escaping, zero, independent
  box contents). Six check schema/JSON IDs, template references, locale parity,
  absence of preview tags, purchase/app-block composition and known secret/store
  patterns. A fixture renderer is NOT Shopify's rendering engine.
- `npm run check`: 45 files checked, zero offenses, with the recommended rules and
  warning-level failure threshold. No configuration suppressions.
- `git diff --check`: no whitespace errors.
- `shopify theme package --no-input`: package created; ZIP inspection confirmed
  58 entries: theme directories plus CLI-included AGENTS.md, no development
  dependencies/docs/tests, and byte-identical
  Skeleton license included as an asset. Package is a local test artifact, not uploaded.
- CLI packages AGENTS.md even when listed in .shopifyignore; it contains only public
  project guidance. The first strict folder-only assertion detected this and was
  revised to record actual CLI behavior; no package-upload claim is made.
- Earlier test runs exposed a test-file brace typo and inherited JSON trailing
  commas; both corrected and tests rerun. No hidden failing test waived.

## Shopify development-store evidence — 2026-10-25

Store: indexes-electronics-theme-lab.myshopify.com. New **unpublished** GitHub-connected theme ID **189902979293**, branch `codex/electronics-foundation`. Published test-data theme and other drafts were not modified. No checkout/order, publish or merge performed.

Implementation tested: d320d00536da05426099b5ceaf4b88fc1cfb9860 plus documentation 37457c3; editor saved product block reordering as Shopify commit **01801371644c8373f14cf475da74fbf851500bf6**. Local 12 tests and Theme Check were rerun after this editor commit.

Environment: cloud Chrome, Shopify theme editor desktop and mobile modes; existing generated Shopify test catalog (14 products), not representative electronics data.

| Check | Actual result |
| --- | --- |
| Render product | Inventory Not Tracked Snowboard rendered at $949.95 USD. |
| Change variant | Complete Snowboard Ice → Dawn via native select + Apply selection; URL variant=68278720561373, Dawn selected, $699.95 USD, Add to cart enabled. These variants share a price. |
| Price change | Gift Card $10 → $25 via Apply selection; rendered price changed to $25.00 USD and selected variant=68278721020125. |
| Unavailable purchase control | Gift Card variants labelled Sold out; purchase button disabled before and after selection. Mixed available/unavailable variants within one product were not available in this fixture. |
| Add selected variant | Complete Snowboard Dawn added; cart rendered Dawn, quantity 1, line and total $699.95 USD. |
| Cart update | UNRESOLVED: entered quantity 2 and clicked Update twice in editor; displayed total remained $699.95 and badge remained 1. Standalone reproduction blocked by storefront authentication. Do not mark passed or assume editor-only behavior. |
| Reorder blocks | Dragged Description before Price, saved, navigated/reloaded editor; order persisted. Shopify synchronized templates/product.json to branch in 0180137. |
| Mobile | Shopify mobile preview rendered product, price and variant controls without visible overlap in inspected viewport. Not a physical device test or exhaustive overflow/accessibility audit. |
| Arabic | BLOCKED for runtime: Languages settings lists only published English. Arabic locale file parity/fixture tests pass locally; Arabic storefront/RTL is NOT runtime verified. No language publication performed under the no-publish scope. |

Verified authenticated product preview:
https://admin.shopify.com/store/indexes-electronics-theme-lab/themes/189902979293/editor?previewPath=%2Fproducts%2Fgift-card%3Fvariant%3D68278721020125&previewMode=mobile

### Connection and standalone preview limits

- CLI `theme list --store indexes-electronics-theme-lab.myshopify.com --no-input` failed: `request to https://accounts.shopify.com/oauth/device_authorization failed, reason: Connection to establish proxy tunnel timed out after 5000ms`. This is a network/proxy failure, not evidence of missing Shopify permission.
- Browser admin session DID have sufficient access to connect the existing GitHub installation and create/edit the draft. No new permissions were granted.
- Editor's Preview action opened a standalone tab that redirected to /password. Secure credential handoff was submitted once, then Shopify displayed **Password incorrect, please try again.** No automatic retries, credentials recorded, password disabling or bypass attempted.
- A standalone product preview was therefore not verified. The link above requires Shopify admin access and opens the actual tested draft in the editor.
- To continue standalone testing, the correct **storefront password** must be entered securely in the browser, not in chat. Arabic also needs enabling in the lab before a genuine RTL runtime test.

## Not tested / no claims

Checkout, removal/error recovery, standalone cart update, app-block integration, variant image changes, mixed availability, Arabic storefront, real mobile devices, Safari/Firefox, screen reader, network audit, performance/LCP/CLS/INP and merchant usability sessions remain unverified. No runtime claim is inferred from CI. Additional competitor research deferred.

## Open blockers and known limits

- Full purchase-path verification remains blocked by standalone storefront authentication and the unresolved cart quantity update.
- Product variant selection is native GET + reload; not asynchronous. Large variant
  catalogs require a supported option-value strategy; no exhaustive variant claim.
- Gallery currently displays images only; video/3D/zoom and swipe remain pending.
- Comparison, predictive search, filters/sorting, mega menu and drawer cart remain
  pending. Product-level facts are not variant overrides.
- Contact template, complete accessibility, schema translations, final visual
  differentiation and other official checklist items remain open.
- Inherited starter sections still need commercial refinement. Presence of files
  does not imply completion or editor compatibility.
- No acceptance, sales, profit, production readiness or release date established.

## GitHub CI evidence

Implementation commit `d320d00536da05426099b5ceaf4b88fc1cfb9860`:
- [PR validation run](https://github.com/helalalfqih-sketch/indexes-electronics-theme/actions/runs/40219375029): success; npm ci, 12 tests and Theme Check all passed. Push run 40219371674 also passed.
- [Inherited CLA run](https://github.com/helalalfqih-sketch/indexes-electronics-theme/actions/runs/40219375194): failed with `Input required and not supplied: cla-token`.
- The CLA workflow runs from main via pull_request_target. Its removal is proposed in this draft, but main remains untouched. Do not invent a token or claim all checks are green. This is an inherited repository workflow issue, separate from theme validation.

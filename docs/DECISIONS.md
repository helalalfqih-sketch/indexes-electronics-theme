# Architecture decisions — 2026-10-25

## ADR-001: use section-based Skeleton, not the preview dialect

Observed main: `a7a655e79b21e68316c228dc7e437b0b32550888`. No other branches or PRs
existed at initial inspection. GitHub reported **public**, contrary to the brief's
historical private status. No visibility setting was changed.

Its AGENTS.md explicitly prohibits sections/JSON and states that `partial` needs
`shop.features.agentic_editor_enabled?` plus StorefrontRenderer. Shopify's
[July 21 changelog](https://shopify.dev/changelog/posts/developer-preview-liquid-block-and-partial-tags)
calls block/partial a developer preview. The current
[submission requirements](https://shopify.dev/docs/storefronts/themes/store/requirements)
continue to require JSON templates and section groups. No store runtime failure
has been observed: this is a documented compatibility risk, not an invented test result.

Decision: restore the section-based Skeleton parent
`a4f32d393b9eadf6c4403318ca39116832e5d1df`, independently verified in Shopify's
upstream repository, and build original code there. No Dawn/Horizon/commercial
source used. This is a deliberate whole-baseline migration, not arbitrary removal
of the partial demo. The old source remains in Git history. Update AGENTS.md to
reflect the authorized architecture. LICENSE.md remains unchanged.

Why now: portable component work and merchant reordering should not depend on an
unverified preview. Existing sections remain supported by the official changelog.
Eligibility of a starting codebase does not imply approval of this product.

## ADR-002: native forms before asynchronous commerce

First slice selects a variant using a GET form, then renders its price/image/stock
from Shopify; product and cart POST forms keep checkout native. No asynchronous
cart is claimed. A later progressive enhancement must preserve fallback behavior,
locale paths, error announcements, focus and history. High-variant products,
subscriptions, pickup availability and product video/model media remain open.

## ADR-003: merchant-authored facts

Use list.metaobject_reference for structured specifications, and text lists for
compatibility/package contents. No server, paid app or inferred compatibility.
Uploading a theme does not create definitions. Product-level facts must apply to
ALL variants; variant-scoped facts are future work.

## Tooling

Shopify CLI 4.9.4 is pinned; Node 24.22.1 used locally; CI requests Node 22.
Shopify documentation search was available. No Shopify App Builder tools/skill
were exposed by discovery in this session. No dedicated development store was
identified or selected; connected production/client stores were not modified.

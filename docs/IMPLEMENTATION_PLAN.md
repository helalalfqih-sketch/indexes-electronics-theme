# Implementation plan

1. **This review slice:** audit and source-pinned architecture migration; native
   product/variant/cart foundation; structured product facts; English/Arabic
   storefront keys; deterministic tests and local Theme Check.
2. **Purchase-path gate:** dedicated development-store preview; simple, variable,
   unavailable and high-variant products; native checkout, cart failures,
   collection/search/filter/sort; fix before expanding design.
3. **Electronics:** up-to-three comparison, stable keys/units and missing values,
   summary specs, variant facts and complementary products. No inferred matches.
4. **Design/editor:** original finished art direction; configurable motion,
   complete mobile/mega navigation, drawer cart, predictive search, sections,
   product video/model media, translations and editor lifecycle.
5. **Release gate:** complete official checklist, real content performance and
   accessibility measurements, browser/manual tests, five merchants, demo store,
   support and sales-page materials. No submission or deployment authorization.

Proposed useful merchandising sections: hero, featured collection, collection
list, featured product, specification highlights, complementary products, image
with text, gallery/video, rich text, FAQ, newsletter, contact, custom Liquid,
plus header/footer groups. Existing inherited sections are not considered a
finished commercial section library.

Needed to test runtime: URL of a dedicated development store, authorized account
access through official Shopify authentication, and consented test catalog data.
Do not reuse a production or client store. A transferable demo store is a separate
release task; official requirements specify a client transfer store for the demo.

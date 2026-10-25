# Product facts contract — v0.1

All fields are optional storefront data. Missing fields hide their UI. Never put
purchase cost, private supplier information or credentials in these definitions.

| Owner | Namespace/key or type | Shopify type | Meaning |
|---|---|---|---|
| Metaobject definition | electronics_specification | metaobject | One verified specification |
| Metaobject field | label | single_line_text_field | Display label, required |
| Metaobject field | value | single_line_text_field | Display value, required |
| Metaobject field | unit | single_line_text_field | Optional unit |
| Metaobject field | comparison_key | single_line_text_field | Proposed stable key, reserved for later comparison |
| Product | electronics.specifications | list.metaobject_reference | Ordered references restricted to electronics_specification |
| Product | electronics.compatible_devices | list.single_line_text_field | Exact merchant-confirmed devices |
| Product | electronics.box_contents | list.single_line_text_field | Actual included items |

Create definitions in Shopify custom data before entering values. Enable
storefront access for the metaobject definition and ensure referenced entries
are active if publishable capability is enabled. Labels and values require merchant
translation for each published locale. Theme locale files translate headings only.

These are PRODUCT facts: only enter values valid for every variant. Don't describe
one variant's capacity or compatibility as product-wide. Variant overrides and a
comparison engine have not been implemented. Later comparison must require the
same canonical comparison key/unit; no numeric conversion or compatibility guess.
Blank label/value rows are skipped; zero text/number values are retained; plain
text is escaped and bidirectional-isolated. No automatic definition provisioning.

Sources checked 2026-10-25:
- https://shopify.dev/docs/api/liquid/objects/metafield
- https://shopify.dev/docs/api/liquid/objects/metaobject

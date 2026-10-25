# Merchant guide — early development

Do not use this branch on a production store. Start only in a dedicated test store.

1. Create the definitions in DATA_MODEL.md under Shopify custom data. Create a
   specification entry with label/value and optional unit; enable storefront
   access and use active entries. Attach references to the product in the order
   you want displayed. Add only confirmed compatible devices and package items.
2. In the product template, the Product facts block shows existing data. Move or
   remove it like other main-product blocks. App and Custom Liquid blocks are
   supported in the section code; their editor behavior is still untested.
3. A blank field creates no fact/claim. Facts apply to every variant. Don't enter
   variant-dependent values until variant-specific support has been implemented.
4. Select a variant and press Apply selection. The page reloads with the selected
   price/image/availability. Add to cart uses that selected variant. The cart uses
   native update/remove/checkout. Async updates and a cart drawer are not included.
5. Choose a collection for the homepage Featured collection section and enter
   your own heading. Without a collection it displays an honest empty state.
6. Publish Arabic/English and translate product/custom data through Shopify's
   supported translation workflow in the dedicated test store. No language or
   store setting is changed automatically by this code.

Before accepting a release, test sold-out products, image-free products, missing
facts, Arabic mixed with device model names, keyboard interaction, editor reorder,
cart inventory errors and checkout. Report steps, URL, browser and expected/result;
never send passwords or tokens. Public support and documentation URLs are not yet
established and must be supplied before Theme Store submission.

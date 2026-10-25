# Electronics theme — development foundation

Independent electronics/tools theme. **Not ready for production or Theme Store submission.**

Based on Shopify Skeleton's section-based commit `a4f32d393b9eadf6c4403318ca39116832e5d1df`.
See [decisions](docs/DECISIONS.md), [plan](docs/IMPLEMENTATION_PLAN.md),
[test report](docs/TEST_REPORT.md), and [merchant guide](docs/MERCHANT_GUIDE.md).

```sh
npm ci
npm test
npm run check
# Only after identifying a dedicated development store:
npx shopify theme dev --store YOUR-DEVELOPMENT-STORE.myshopify.com
```

Dependencies are development-only and excluded from theme packaging. Shopify
CLI authentication happens in Shopify's official browser flow, never in chat.
No store has been uploaded to or tested by this implementation.

Original Skeleton copyright and license are retained in [LICENSE.md](LICENSE.md).

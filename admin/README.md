# Growiee Admin

Next.js 14 admin dashboard (static export), in `growiee/admin`, for Growiee's numbers: unit economics,
pricing, production runs, break-even and a monthly forecast. Built on the
same stack and structure as `gold-dashboard`, in the Growiee brand
(Royal Indigo, Soft Violet, Bright Sky, Petal Pink on Off-White Silk;
Google Sans, Nunito, Pacifico wordmark).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
```

## Where the numbers come from

- `src/lib/model.ts` holds every default and every calculation.
- Price, delivery fee and size mix are read from `../branding/tokens/*.tokens.json`,
  so changing a token changes the dashboard on the next build.
- Costs and CAC come from the business plan (section 4); anything the plan
  doesn't state (courier charge, COD fee, failed deliveries, fixed costs,
  growth, launch cash) is an assumption, labelled as such on the Assumptions page.
- Edits made in the app are saved in the browser and can be reset to defaults.

## Pages

Overview · Unit Economics · Pricing · Production · Break-even · Forecast · Assumptions

Keyboard: `⌘K` search, `G` then a letter to jump.

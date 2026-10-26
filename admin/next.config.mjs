/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSG: every page is prerendered to static HTML in out/ at build time, with
  // the defaults from branding/tokens baked in; no server needed. Edits made
  // in the browser recalculate on the client. Rebuild after changing tokens.
  output: "export",
  experimental: {
    // Import only the icons used from these large barrel packages.
    optimizePackageImports: [
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
      "recharts",
      "framer-motion",
    ],
  },
};

export default nextConfig;

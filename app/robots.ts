import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/checkout/",
        "/payment/",
      ],
    },

    sitemap: "https://www.sajangchance.com/sitemap.xml",

    host: "https://www.sajangchance.com",
  };
}
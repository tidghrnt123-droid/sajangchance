import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://sajangchance.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: "https://sajangchance.com/card-terminal",
      lastModified: new Date(),
      priority: 0.9,
    },

    {
      url: "https://sajangchance.com/front2",
      lastModified: new Date(),
      priority: 0.9,
    },

    {
      url: "https://sajangchance.com/front2-printer",
      lastModified: new Date(),
      priority: 0.9,
    },

    {
      url: "https://sajangchance.com/front2-terminal2",
      lastModified: new Date(),
      priority: 0.9,
    },

    {
      url: "https://sajangchance.com/wireless",
      lastModified: new Date(),
      priority: 0.9,
    },
  ];
}
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://surprisespark.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/birthday", "/templates", "/s/", "/privacy"],
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/create",
          "/create/*",
          "/api/*",
          "/preview/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@frontdeskhq" },
    { name: "twitter:site", content: "@frontdeskhq" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: "https://tryfrontdesk.app" },
    ...(image
      ? [
          {
            name: "twitter:image",
            content: `https://tryfrontdesk.app${image}`,
          },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:image:width", content: "1200" },
          { name: "twitter:image:height", content: "630" },
          { property: "og:image", content: `https://tryfrontdesk.app${image}` },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
        ]
      : []),
  ];

  return tags;
};

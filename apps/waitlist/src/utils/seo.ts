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
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    { name: "og:url", content: "https://tryfrontdesk.app" },
    ...(image
      ? [
          {
            name: "twitter:image",
            content: `https://tryfrontdesk.app${image}`,
          },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: `https://tryfrontdesk.app${image}` },
        ]
      : []),
  ];

  return tags;
};

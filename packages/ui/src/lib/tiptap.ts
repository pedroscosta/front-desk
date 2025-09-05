import { StarterKit as DefaultStarterKit } from "@tiptap/starter-kit";

export const StarterKit = DefaultStarterKit.configure({
  paragraph: {
    HTMLAttributes: {
      class: "leading-relaxed [&:not(:first-child)]:mt-2",
    },
  },
  bulletList: {
    HTMLAttributes: {
      class: "list-disc my-2 ml-6",
    },
  },
  listItem: {
    HTMLAttributes: {
      class: "mt-1.5",
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: "list-decimal my-2 ml-6",
    },
  },
  bold: {
    HTMLAttributes: {
      class: "font-semibold",
    },
  },
});

/** biome-ignore-all lint/style/noNonNullAssertion: Too much type work - PRs welcome */
import type { JSONContent } from "@tiptap/react";
import type {
  BlockContent,
  Blockquote,
  Code,
  Heading,
  InlineCode,
  Link,
  List,
  ListItem,
  Node,
  Paragraph,
  PhrasingContent,
  Root,
  Text,
  ThematicBreak,
} from "mdast";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

const markToMdastType: Record<string, PhrasingContent["type"]> = {
  bold: "strong",
  italic: "emphasis",
  strike: "delete",
  code: "inlineCode",
  link: "link",
};

const convertTextMarks = (
  marks: JSONContent["marks"],
  text: Text
): PhrasingContent => {
  if (!marks || !marks?.length) {
    return text;
  }

  const [mark, ...rest] = marks;

  const type = markToMdastType[mark!.type];

  if (!type) {
    return convertTextMarks(rest, text);
  }

  if (type === "inlineCode") {
    return {
      type,
      value: text.value,
    } satisfies InlineCode;
  }
  if (type === "link") {
    return {
      type,
      url: mark!.attrs?.href as string,
      children: [convertTextMarks(rest, text)],
    } satisfies Link;
  }

  return {
    type,
    children: [convertTextMarks(rest, text)],
  } as PhrasingContent;
};

const tipTapToMdast: Record<string, (node: JSONContent) => Node> = {
  paragraph: (node) =>
    ({
      type: "paragraph",
      children: (node.content?.map((child) =>
        tipTapToMdast[child.type!]?.(child)
      ) ?? []) as PhrasingContent[],
    } satisfies Paragraph),
  text: (node) =>
    convertTextMarks(node.marks, {
      type: "text",
      value: node.text!,
    } satisfies Text),
  heading: (node) =>
    ({
      type: "heading",
      depth: node.attrs?.level ?? 1,
      children: (node.content?.map((child) =>
        tipTapToMdast[child.type!]?.(child)
      ) ?? []) as PhrasingContent[],
    } satisfies Heading),
  blockquote: (node) =>
    ({
      type: "blockquote",
      children: (node.content?.map((child) =>
        tipTapToMdast[child.type!]?.(child)
      ) ?? []) as BlockContent[],
    } satisfies Blockquote),
  codeBlock: (node) =>
    ({
      type: "code",
      value: node.content?.[0]?.text ?? "",
    } satisfies Code),
  listItem: (node) =>
    ({
      type: "listItem",
      children: (node.content?.map((child) =>
        tipTapToMdast[child.type!]?.(child)
      ) ?? []) as BlockContent[],
    } satisfies ListItem),
  bulletList: (node) =>
    ({
      type: "list",
      ordered: false,
      children: (node.content?.map((child) =>
        tipTapToMdast[child.type!]?.(child)
      ) ?? []) as ListItem[],
    } satisfies List),
  orderedList: (node) =>
    ({
      type: "list",
      ordered: true,
      start: node.attrs?.start,
      children: (node.content?.map((child) =>
        tipTapToMdast[child.type!]?.(child)
      ) ?? []) as ListItem[],
    } satisfies List),

  horizontalRule: () =>
    ({
      type: "thematicBreak",
    } satisfies ThematicBreak),
};

export const stringify = (doc: JSONContent[] | JSONContent | string) => {
  const content: JSONContent[] = Array.isArray(doc)
    ? doc
    : typeof doc === "string"
    ? [{ type: "paragraph", content: [{ type: "text", text: doc }] }]
    : [doc];

  const mdast = content.flatMap((node) => {
    const mdastNode = tipTapToMdast[node.type!]?.(node);
    if (!mdastNode) {
      return [];
    }
    return [mdastNode];
  });

  return unified()
    .use(remarkStringify)
    .use(remarkGfm)
    .stringify({ type: "root", children: mdast } as Root);
};

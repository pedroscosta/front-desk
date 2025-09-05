import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { StarterKit } from "@workspace/ui/lib/tiptap";
import { cn } from "@workspace/ui/lib/utils";
import isHotkey from "is-hotkey";
import { ArrowUp } from "lucide-react";
import { Button } from "../button";

export function InputBox({
  className,
  value,
  onValueChange,
  initialValue,
  onSubmit,
  clearOnSubmit = true,
  ...props
}: Omit<React.ComponentProps<"div">, "value" | "onValueChange" | "onSubmit"> & {
  value?: JSONContent[];
  initialValue?: JSONContent[];
  onValueChange?: (value: JSONContent[]) => void;
  onSubmit?: (value: JSONContent[]) => void;
  clearOnSubmit?: boolean;
}) {
  const [_value, setValue] = useControllableState<JSONContent[]>({
    defaultProp: initialValue ?? [],
    prop: value,
    onChange: onValueChange,
  });

  const disableSend = !_value.length || !_value[0]?.content;

  // TODO add styles for StarterKit blocs
  // TODO add bubble menu
  // TODO copy as markdown
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a reply...",
      }),
    ],
    content: _value,
    onUpdate: ({ editor }) => {
      setValue(editor.getJSON().content);
    },
    editorProps: {
      handleKeyDown: (_view, event) => {
        if (isHotkey("mod+enter")(event)) {
          event.preventDefault();
          if (!disableSend) {
            handleSubmit();
          }
          return true;
        }
        return false;
      },
      attributes: {
        class: "",
        // "prose prose-no-margin prose-sm dark:prose-invert text-primary marker:text-neutral-800 dark:marker:text-neutral-300 prose-li:mt-1 prose-li:mb-0 prose-li:pl-0 prose-ul:pl-7 [&_li>p]:m-0",
      },
    },
  });

  const handleSubmit = () => {
    onSubmit?.(_value);
    if (clearOnSubmit) {
      editor.commands.setContent([]);
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: we are using the div to focus the editor
    <div
      className={cn(
        "border-input border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-md px-4 py-2 flex flex-col gap-2 cursor-text",
        className
      )}
      onClick={() => editor?.chain().focus()}
      onKeyUp={() => editor?.chain().focus()}
      {...props}
    >
      <EditorContent
        editor={editor}
        className="border max-h-96 overflow-y-auto placeholder:text-muted-foreground"
      />
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant={disableSend ? "secondary" : "default"}
          disabled={disableSend}
          onClick={handleSubmit}
        >
          <ArrowUp />
          Reply
        </Button>
      </div>
    </div>
  );
}

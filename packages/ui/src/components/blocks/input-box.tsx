import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowUp } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../button";

function InputBox({
  className,
  value,
  onValueChange,
  onSubmit,
  clearOnSubmit = true,
  ...props
}: Omit<React.ComponentProps<"div">, "value" | "onValueChange" | "onSubmit"> & {
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  clearOnSubmit?: boolean;
}) {
  const [_value, setValue] = useControllableState<string>({
    defaultProp: "",
    prop: value,
    onChange: onValueChange,
  });

  const disableSend = !_value || _value.trim() === "";

  const handleSubmit = () => {
    onSubmit?.(_value);
    if (clearOnSubmit) {
      setValue("");
    }
  };

  return (
    <div
      className={cn(
        "border-input border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-md px-4 py-2 flex flex-col gap-2",
        className
      )}
      {...props}
    >
      <TextareaAutosize
        data-slot="input"
        className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground text-base outline-none size-full resize-none max-h-full"
        minRows={1}
        maxRows={10}
        placeholder="Write a reply..."
        value={_value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
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

export { InputBox };

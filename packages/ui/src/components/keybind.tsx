import { useMemo } from "react";

const isMacPlatform = () =>
  typeof navigator !== "undefined" && /Mac|iPad/.test(navigator.platform);

export const Keybind = ({ keybind }: { keybind: string }) => {
  const keys = keybind.split("-");

  const isMac = isMacPlatform();

  const replacements = useMemo<Record<string, string>>(
    () => ({
      mod: isMac ? "⌘" : "ctrl",
      shift: "⇧",
      alt: isMac ? "⌥" : "alt",
      cmd: isMac ? "⌘" : "ctrl",
      option: isMac ? "⌥" : "alt",
      ctrl: "ctrl",
    }),
    [isMac]
  );

  return (
    <div className="flex items-center gap-0.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="text-xs border-muted-foreground/20 text-muted-foreground rounded-xs h-5 min-w-5 px-1 flex items-center justify-center border font-family"
        >
          {replacements[key] || key.toUpperCase()}
        </kbd>
      ))}
    </div>
  );
};

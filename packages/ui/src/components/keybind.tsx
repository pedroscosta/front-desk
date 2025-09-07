const replacements: Record<string, string> = {
  mod:
    typeof window !== "undefined" && /Mac|iPad/.test(navigator.platform)
      ? "⌘"
      : "ctrl",
  shift: "⇧",
  alt:
    typeof window !== "undefined" && /Mac|iPad/.test(navigator.platform)
      ? "⌥"
      : "alt",
};

export const Keybind = ({ keybind }: { keybind: string }) => {
  const keys = keybind.split("-");

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

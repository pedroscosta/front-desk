import { cn } from "@workspace/ui/lib/utils";

export const PriorityIndicator = ({ priority }: { priority: number }) => {
  return (
    <div
      className={cn(
        "h-4 w-[17px] p-px flex justify-between items-center",
        priority > 0 && "items-end"
      )}
    >
      <div
        className={cn(
          "w-[3px] h-1/3 rounded-full bg-primary/50",
          priority >= 1 && "bg-primary",
          priority === 0 && "h-1"
        )}
      />
      <div
        className={cn(
          "w-[3px] h-2/3 rounded-full bg-primary/50",
          priority >= 2 && "bg-primary",
          priority === 0 && "h-1"
        )}
      />
      <div
        className={cn(
          "w-[3px] h-full rounded-full bg-primary/50",
          priority >= 3 && "bg-primary",
          priority === 0 && "h-1"
        )}
      />
    </div>
  );
};

const priorityText: Record<number, string> = {
  0: "No priority",
  1: "Low",
  2: "Medium",
  3: "High",
  4: "Urgent",
};

export const PriorityText = ({ priority }: { priority: number }) => {
  return priorityText[priority];
};

import { motion } from "framer-motion";
import { ReactNode, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { fadeIn } from "./AnimationVariants";

// nice tab component that looks like shaddn's
export type Tab = {
  name: ReactNode;
  content: ReactNode;
  visible?: boolean;
};

export function Tabs({
  tabs,
  cornerAction,
  className
}: {
  tabs: Tab[];
  cornerAction?: ReactNode;
  className?: string;
}) {
  const [selected, setSelected] = useState(0);
  useLayoutEffect(() => {
    //console.log("run tabs fx")
    const visibleTabs = tabs.filter((t) => t.visible);
    if (selected >= visibleTabs.length) {
      const newSelected = visibleTabs.length - 1;
      setSelected(newSelected);
      //console.log("run effect on tabs ", newSelected);
      setSelected(0);
    }
  }, [selected, tabs.filter]);
  //console.log("selected", selected, tabs.length, tabs.filter(t => t.visible).length)
  const initialDelay = 0.2;
  const delayStep = 0.1;
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex gap-4 mb-3 items-center pr-2">
        {tabs
          .filter((t) => t.visible)
          .map((tab, i) => (
            <motion.div
              key={i}
              initial="hidden"
              variants={fadeIn(initialDelay + delayStep * i)}
              animate="visible"
              className={cn("whitespace-nowrap overflow-hidden text-ellipsis",
                "border-b px-4 pb-1 pt-2 min-w-[80px]",
                "text-center text-sm font-semibold cursor-pointer",
                selected === i ? "border-foreground text-foreground" : "border-b-transparent text-gray-400")}
              onClick={() => setSelected(i)}
            >
              {tab.name}
            </motion.div>
          ))}
        <div className="w-1 grow"></div>
        {cornerAction}
      </div>
      <div className="h-1 grow overflow-hidden flex flex-col">
        {tabs
          .filter((t) => t.visible)
          .map((tab, i) => (
            <motion.div
              key={i}
              initial="hidden"
              variants={fadeIn(initialDelay + delayStep * i)}
              animate="visible"
              className={`h-1 overflow-hidden flex flex-col ${i === selected ? "grow" : "hidden"}`}
            >
              {tab.content}
            </motion.div>
          ))}
      </div>
    </div>
  );
}

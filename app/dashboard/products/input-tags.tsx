"use client";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion"
import { Badge } from "@/components/ui/badge";
import {  XIcon } from "lucide-react";

type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const InputTags = ({ onChange, value, ...props }: InputTagsProps) => {
  const [focused, setFocused] = useState(false);
  const [pendingDataPoint, setPendingDataPoint] = useState('');



  function addPendingDataPoint () {
    if(pendingDataPoint) {
        const newDataPoint = new Set([...value, pendingDataPoint])
        onChange(Array.from(newDataPoint))
        setPendingDataPoint('')
    }
  }

  const {setFocus} = useFormContext()

  return (
    <div
      className={cn(
        "   min-h-[40px] w-full rounded-md border border-input bg-transparent px-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 ring-offset-background focus-visible:ring-ring disabled:cursor-not-allowed focus-visible:ring-offset-2 disabled:opacity-50 md:text-sm"
      , focused ? 
      ' ring-offset-2 outline-none ring-ring ring-2 ' :
       " ring-offset-0 outline-none ring-0 ring-ring")}
      onClick={() => setFocus("tags")}
    >
        <motion.div className="  rounded-md min-h-[2.5rem] flex gap-2 items-center flex-wrap ">
            <AnimatePresence>
        {value.map((tag) => ( 
            <motion.div animate={{scale:1}} initial={{scale:0}} exit={{scale:0}} key={ tag}>
                  <Badge variant={"secondary"}>
                  {tag}
                  <button
                    className="w-3 ml-1"
                    onClick={() => onChange(value.filter((i) => i !== tag))}
                  >
                    <XIcon className="w-3" />
                  </button>
                </Badge>
            </motion.div>
        ))}
            </AnimatePresence>

       
        <div className=" flex">
            <Input
            className=" border-transparent focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
             placeholder="Add tags"
            onKeyDown={(e) => {
                if(e.key === "Enter") {
                    e.preventDefault()
                    addPendingDataPoint()
                }
                if(e.key === "Backspace" && !pendingDataPoint && value.length > 0 ) {
                    e.preventDefault()
                    const newValue = [...value]
                    newValue.pop()
                    onChange(newValue)
                }
            }}
             
             value={pendingDataPoint}
             onFocus={() => setFocused(true)}
             onBlurCapture={() => setFocused(false)}
             onChange={(e) => setPendingDataPoint(e.target.value)}
             {...props}
             />
        </div>
        </motion.div>
    </div> 
  );
};

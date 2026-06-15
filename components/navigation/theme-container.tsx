"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);
  // Set the initial switch state based on the theme
  useEffect(() => {
    switch (theme) {
      case "dark":
        setChecked(true);
        break;
      case "light":
        setChecked(false);
        break;
      case "system":
        setChecked(true); // or true based on system preference if needed
        break;
    }
  }, [theme]);
  return (
    <div>
      {theme && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center group "
        >
          <div className="relative flex md:mr-3 mr-1">
            <Sun
              className="group-hover:text-yellow-600  absolute group-hover:rotate-180  dark:scale-0 dark:rotate-90 transition-all duration-750 ease-in-out"
              size={18}
            />
            <Moon
              className="group-hover:text-blue-400  scale-0 rotate-90 dark:rotate-0  dark:scale-100 transition-all ease-in-out duration-750"
              size={18}
            />
          </div>
          {/* <p className="dark:text-blue-400 mr-3 text-secondary-foreground/75   text-yellow-600">
                  {theme[0].toUpperCase() + theme.slice(1)} Mode
                </p> */}
          <Switch
            className="scale-75 "
            checked={checked}
            onCheckedChange={(e) => {
              setChecked((prev) => !prev);
              if (e) setTheme("dark");
              if (!e) setTheme("light");
            }}
          />
        </div>
      )}
    </div>
  );
}

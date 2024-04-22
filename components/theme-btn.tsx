"use client";

import { useEffect, useState } from "react";
import Spinner from "./spinner";

import { useTheme } from "next-themes";

import { Switch } from "./ui/switch";
import { BsFillSunFill, BsMoonStars } from "react-icons/bs";

export default function ThemeBtn() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), [isMounted]);

  if (!isMounted) return <Spinner />;

  return (
    <div className="flex items-center gap-2">
      <div>{theme === "dark" ? <BsMoonStars /> : <BsFillSunFill />}</div>
      <Switch
        className="text-4xl"
        checked={theme === "dark"}
        onCheckedChange={(val) => {
          setTheme(val ? "dark" : "light");
        }}
      />
    </div>
  );
}

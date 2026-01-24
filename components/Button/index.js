import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import data from "../../data/en.json";

const Button = ({ children, type, onClick, classes }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to dark theme if not mounted yet
  const currentTheme = mounted ? theme : "dark";

  if (type === "primary") {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`text-sm tablet:text-base px-6 py-3 rounded-full uppercase tracking-[0.2em] font-semibold ${
          currentTheme === "dark"
            ? "bg-white text-black"
            : "bg-black text-white"
        } transition-all duration-300 ease-out first:ml-0 hover:-translate-y-0.5 active:translate-y-0 link ${
          data.showCursor && "cursor-none"
        }  ${classes}`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      type="button"
      className={`text-sm tablet:text-base px-4 py-2 rounded-full flex items-center uppercase tracking-[0.2em] font-semibold transition-all ease-out duration-300 ${
        currentTheme === "dark"
          ? "hover:bg-slate-800 text-white"
          : "hover:bg-slate-100"
      } hover:-translate-y-0.5 active:translate-y-0  tablet:first:ml-0 link ${
        data.showCursor && "cursor-none"
      } ${classes}`}
    >
      {children}
    </button>
  );
};

export default Button;

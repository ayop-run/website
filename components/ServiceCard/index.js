import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const ServiceCard = ({ name, description, icon }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState();

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div
      className={`group w-full p-6 rounded-2xl border transition-all ease-out duration-300 ${
        mounted && theme === "dark"
          ? "border-slate-800/80 hover:border-slate-600"
          : "border-slate-200/80 hover:border-slate-300"
      } link`}
    >
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 text-lg dark:border-slate-700"
          aria-hidden="true"
        >
          {icon}
        </span>
        <p className="text-xs uppercase tracking-[0.3em]">Activity</p>
      </div>
      <h1 className="mt-4 text-2xl font-semibold">{name ? name : "Heading"}</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
        {description
          ? description
          : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "}
      </p>
      <div className="mt-6 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Learn more →
      </div>
    </div>
  );
};

export default ServiceCard;

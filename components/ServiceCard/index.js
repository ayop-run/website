import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import data from "../../data/en.json";

const iconMap = {
  track: (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-10 w-10 text-slate-900 dark:text-slate-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 36c6 0 10-4 14-8s8-8 14-8 8 2 8 2" />
      <path d="M6 24c6 0 10-4 14-8s8-8 14-8 8 2 8 2" />
      <path d="M6 12c6 0 10-4 14-8" />
    </svg>
  ),
  trail: (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-10 w-10 text-slate-900 dark:text-slate-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 34c6 0 10-4 14-8s8-8 14-8 8 2 8 2" />
      <path d="M10 40l6-12 6 12 6-12 6 12" />
    </svg>
  ),
  learn: (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-10 w-10 text-slate-900 dark:text-slate-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 16l18-8 18 8-18 8-18-8z" />
      <path d="M12 24v8c0 4 24 4 24 0v-8" />
      <path d="M42 24v10" />
    </svg>
  ),
  community: (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-10 w-10 text-slate-900 dark:text-slate-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="18" r="4" />
      <circle cx="32" cy="18" r="4" />
      <path d="M6 34c2-6 8-8 14-8" />
      <path d="M42 34c-2-6-8-8-14-8" />
      <path d="M18 30c2-3 6-4 6-4s4 1 6 4" />
    </svg>
  ),
};

const ServiceCard = ({ name, description, icon }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState();
  const iconElement = useMemo(() => iconMap[icon] || null, [icon]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "dark";

  return (
    <div
      className={`w-full h-full p-6 mob:p-8 rounded-xl border transition-[border,background-color,box-shadow,transform] ease-out duration-300 flex flex-col ${
        currentTheme === "dark"
          ? "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70"
          : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      } shadow-sm hover:shadow-lg hover:scale-[1.02] link`}
    >
      <div className="flex items-start gap-5 flex-1">
        {iconElement && (
          <div
            className={`flex-shrink-0 mt-1 rounded-xl p-4 transition-none ${
              currentTheme === "dark"
                ? "bg-slate-800 text-slate-100"
                : "bg-slate-100 text-slate-900"
            }`}
          >
            {iconElement}
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl tablet:text-2xl font-bold mb-3">
            {name ? name : "Heading"}
          </h3>
          <p
            className={`text-base tablet:text-lg leading-relaxed mb-4 flex-1 ${
              currentTheme === "dark" ? "opacity-80" : "opacity-70"
            }`}
          >
            {description
              ? description
              : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "}
          </p>
          {/* <span
            className={`inline-flex items-center text-sm tablet:text-base font-semibold transition-opacity duration-200 mt-auto ${
              currentTheme === "dark"
                ? "text-white opacity-90 hover:opacity-100"
                : "text-black opacity-80 hover:opacity-100"
            }`}
          >
            {data.learnMore}
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

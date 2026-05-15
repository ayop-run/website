import React from "react";

/**
 * Theme-aware logo without JS theme hook — avoids flash on refresh (SSR + first paint
 * match `html.dark` from next-themes before hydration completes).
 */
const Logo = ({ className = "", width = 120, height = "auto" }) => {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      <img
        src="/images/logo/logo-main-white.svg"
        alt="AYOP Logo"
        width={width}
        height={height}
        className="hidden h-full w-auto max-h-full object-contain object-center dark:block"
      />
      <img
        src="/images/logo/logo-main-dark.svg"
        alt=""
        width={width}
        height={height}
        className="block h-full w-auto max-h-full object-contain object-center dark:hidden"
        aria-hidden="true"
      />
    </span>
  );
};

export default Logo;

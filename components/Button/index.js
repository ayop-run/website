import React from "react";
import { Button as HeroButton } from "@heroui/react";

/**
 * Legacy wrapper: maps onClick → HeroUI / RAC `onPress`.
 * Styling uses `dark:` so SSR + first paint match `html` class (no next-themes hook flash).
 * @param {{ children: React.ReactNode; type?: "primary"; onClick?: () => void; classes?: string }} props
 */
const Button = ({ children, type, onClick, classes }) => {
  const variant = type === "primary" ? "primary" : "tertiary";

  return (
    <HeroButton
      type="button"
      variant={variant}
      size="sm"
      onPress={() => onClick?.()}
      className={`m-1 laptop:m-2 first:ml-0 transition-transform duration-300 ease-out hover:scale-105 active:scale-100 ${
        type === "primary"
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10"
      } ${classes || ""}`}
    >
      {children}
    </HeroButton>
  );
};

export default Button;

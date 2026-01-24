import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const Logo = ({ className = "", width = 120, height = "auto" }) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual theme, defaulting to dark if not mounted yet
  const currentTheme = mounted ? theme : "dark";
  const logoSrc =
    currentTheme === "dark"
      ? "/images/logo/logo-main-white.svg"
      : "/images/logo/logo-main-dark.svg";

  return (
    <img
      src={logoSrc}
      alt="AYOP Logo"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Logo;

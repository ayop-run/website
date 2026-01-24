import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../Button";
import Logo from "../Logo";
import data from "../../data/portfolio.json";

const Header = ({ handleWorkScroll, handleAboutScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { name, showBlog } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Mobile */}
      <Popover className="block tablet:hidden mt-5">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between p-2 laptop:p-0">
              {/* Only ONE h1 in the page */}
              <h1
                onClick={() => router.push("/")}
                className="cursor-pointer text-black dark:text-white"
              >
                <Logo width={100} />
              </h1>

              <div className="flex items-center">
                {data.darkMode && (
                  <Button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <Image
                      width={24}
                      height={24}
                      alt="Theme toggle"
                      src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                    />
                  </Button>
                )}

                <Popover.Button aria-label="Toggle menu">
                  <Image
                    width={20}
                    height={20}
                    alt="Menu"
                    src={`/images/${
                      !open
                        ? theme === "dark"
                          ? "menu-white.svg"
                          : "menu.svg"
                        : theme === "light"
                          ? "cancel.svg"
                          : "cancel-white.svg"
                    }`}
                  />
                </Popover.Button>
              </div>
            </div>

            <Popover.Panel
              className={`absolute right-0 z-10 w-11/12 p-4 ${
                theme === "dark" ? "bg-slate-800" : "bg-white"
              } shadow-md rounded-md`}
            >
              <div className="grid grid-cols-1">
                <Button onClick={() => router.push("/")} classes="no-cursor-link">Home</Button>
                <Button onClick={() => router.push("/about")} classes="no-cursor-link">About</Button>
                {showBlog && (
                  <Button onClick={() => router.push("/blog")} classes="no-cursor-link">Blog</Button>
                )}
                <Button onClick={() => router.push("/manifesto")} classes="no-cursor-link">
                  Manifesto
                </Button>
                <Button onClick={() => window.open("mailto:hello@ayop.run")} classes="no-cursor-link">
                  Contact
                </Button>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>

      {/* Desktop */}
      <div
        className={`mt-10 hidden tablet:flex items-center justify-between sticky top-0 z-10 ${
          theme === "light" ? "bg-white" : ""
        }`}
      >
        <h1
          onClick={() => router.push("/")}
          className="cursor-pointer text-black dark:text-white"
        >
          <Logo width={120} />
        </h1>

        <nav className="flex items-center gap-2">
          <Button onClick={() => router.push("/")}>Home</Button>
          <Button onClick={() => router.push("/about")}>About</Button>
          {showBlog && (
            <Button onClick={() => router.push("/blog")}>Blog</Button>
          )}
          <Button onClick={() => router.push("/manifesto")}>Manifesto</Button>
          <Button onClick={() => window.open("mailto:hello@ayop.run")}>
            Contact
          </Button>

          {mounted && theme && data.darkMode && (
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Image
                width={24}
                height={24}
                alt="Theme toggle"
                src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
              />
            </Button>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;

import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Button from "../Button";
import Logo from "../Logo";
import data from "../../data/en.json";

/** Default theme names on `<html>` when `attribute="class"` (must match ThemeProvider). */
const THEME_CLASSES = ["light", "dark"];

function toggleColorTheme(setTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const next = isDark ? "light" : "dark";

  // next-themes v0.2 applies the class in useEffect (after paint), which can flash one frame.
  // Apply the same class + color-scheme here so the first paint after click already matches.
  root.classList.remove(...THEME_CLASSES);
  root.classList.add(next);
  root.style.colorScheme = next;

  setTheme(next);
}

const Header = ({ handleWorkScroll, handleAboutScroll, isBlog }) => {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { showBlog } = data;

  return (
    <>
      {/* Mobile */}
      <Popover className="block tablet:hidden mt-5">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between p-2 laptop:p-0">
              {/* Only ONE h1 in the page */}
              <h1 className="m-0 leading-none">
                <Link href="/" className="inline-flex cursor-pointer items-center" aria-label="Home">
                  <Logo width={100} />
                </Link>
              </h1>

              <div className="flex items-center">
                {data.darkMode && (
                  <Button onClick={() => toggleColorTheme(setTheme)}>
                    <Image
                      width={24}
                      height={24}
                      alt=""
                      className="hidden dark:block"
                      src="/images/moon.svg"
                    />
                    <Image
                      width={24}
                      height={24}
                      alt=""
                      className="block dark:hidden"
                      src="/images/sun.svg"
                    />
                  </Button>
                )}

                <Popover.Button aria-label="Toggle menu">
                  {!open ? (
                    <>
                      <Image
                        width={20}
                        height={20}
                        alt=""
                        className="hidden dark:block"
                        src="/images/menu-white.svg"
                      />
                      <Image
                        width={20}
                        height={20}
                        alt=""
                        className="block dark:hidden"
                        src="/images/menu.svg"
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        width={20}
                        height={20}
                        alt=""
                        className="hidden dark:block"
                        src="/images/cancel-white.svg"
                      />
                      <Image
                        width={20}
                        height={20}
                        alt=""
                        className="block dark:hidden"
                        src="/images/cancel.svg"
                      />
                    </>
                  )}
                </Popover.Button>
              </div>
            </div>

            <Popover.Panel className="absolute right-0 z-10 w-11/12 rounded-md bg-white p-4 shadow-md dark:bg-slate-800">
              <div className="grid grid-cols-1">
                <Button onClick={() => router.push("/")} classes="no-cursor-link">Home</Button>
                <Button onClick={() => router.push("/about")} classes="no-cursor-link">About</Button>
                <Button onClick={() => router.push("/photos")} classes="no-cursor-link">Photos</Button>
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

      {/* Desktop — bar colors via dark: so first paint matches html class (no theme hook flash) */}
      <div className="mt-10 hidden tablet:flex items-center justify-between bg-white sticky top-0 z-10 dark:bg-transparent">
        <h1 className="m-0 leading-none">
          <Link href="/" className="inline-flex cursor-pointer items-center" aria-label="Home">
            <Logo width={120} />
          </Link>
        </h1>

        <nav className="flex items-center gap-2">
          <Button onClick={() => router.push("/")}>Home</Button>
          <Button onClick={() => router.push("/about")}>About</Button>
          <Button onClick={() => router.push("/photos")}>Photos</Button>
          {showBlog && (
            <Button onClick={() => router.push("/blog")}>Blog</Button>
          )}
          <Button onClick={() => router.push("/manifesto")}>Manifesto</Button>
          <Button onClick={() => window.open("mailto:hello@ayop.run")}>
            Contact
          </Button>

          {data.darkMode && (
            <Button onClick={() => toggleColorTheme(setTheme)}>
              <Image
                width={24}
                height={24}
                alt=""
                className="hidden dark:block"
                src="/images/moon.svg"
              />
              <Image
                width={24}
                height={24}
                alt=""
                className="block dark:hidden"
                src="/images/sun.svg"
              />
            </Button>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;

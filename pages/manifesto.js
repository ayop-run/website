import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import Socials from "../components/Socials";
import Button from "../components/Button";
import { useTheme } from "next-themes";
import Head from "next/head";
import { stagger } from "../animations";
import { useIsomorphicLayoutEffect } from "../utils";
// Data
import data from "../data/portfolio.json";

const Manifesto = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [mount, setMount] = useState(false);
  const headingRef = useRef();

  useEffect(() => {
    setMount(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (headingRef.current) {
      stagger(
        [headingRef.current],
        { y: 30, x: 0, transform: "scale(0.98)", opacity: 0 },
        { y: 0, x: 0, transform: "scale(1)", opacity: 1 },
      );
    }
  }, []);

  // Split manifesto into paragraphs (double newlines) and clean up single newlines
  const manifestoParagraphs = data.manifesto
    ? data.manifesto
        .split(/\n\n+/)
        .map((para) => para.replace(/\n/g, " ").trim())
        .filter((para) => para !== "")
    : [];

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => router.push("/edit")} type={"primary"}>
            Edit Manifesto
          </Button>
        </div>
      )}
      {data.showCursor && <Cursor />}
      <div
        className={`container mx-auto px-4 tablet:px-6 laptop:px-8 mb-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Head>
          <title>Manifesto - {data.name}</title>
        </Head>
        <Header isBlog />
        {mount && (
          <main className="mt-10 laptop:mt-20">
            <section className="p-2 laptop:p-0">
              <h1
                ref={headingRef}
                className="text-4xl tablet:text-5xl laptop:text-6xl font-bold mb-12 laptop:mb-16"
              >
                Manifesto
              </h1>

              <div className="max-w-4xl">
                <div className="space-y-6 laptop:space-y-8">
                  {manifestoParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base tablet:text-lg laptop:text-xl leading-relaxed opacity-90"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-16 laptop:mt-20 flex justify-center">
                <Socials />
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
};

export default Manifesto;

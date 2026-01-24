import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { useTheme } from "next-themes";
import { stagger } from "../animations";
import { useIsomorphicLayoutEffect } from "../utils";
import Layout from "../components/Layout";
// Data
import data from "../data/en.json";

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

  // Split manifesto into paragraphs (double newlines) and preserve single newlines for line breaks
  const manifestoParagraphs = data.manifesto
    ? data.manifesto
        .split(/\n\n+/)
        .map((para) => para.trim())
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
      <Layout title="Manifesto" isBlog>
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
                      className="text-base tablet:text-lg laptop:text-xl leading-relaxed opacity-90 whitespace-pre-line"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          </main>
        )}
      </Layout>
    </>
  );
};

export default Manifesto;

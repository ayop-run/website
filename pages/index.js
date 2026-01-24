import { useRef, useEffect } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
import Image from "next/image";

// Local Data
import data from "../data/en.json";

export default function Home() {
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();

  // Handling Scroll
  const handleWorkScroll = () => {
    if (workRef.current) {
      window.scrollTo({
        top: workRef.current.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    if (textOne.current && textTwo.current) {
      stagger(
        [textOne.current, textTwo.current],
        { y: 30, x: 0, transform: "scale(0.98)", opacity: 0 },
        { y: 0, x: 0, transform: "scale(1)", opacity: 1 },
      );
    }
  }, []);

  useEffect(() => {
    // Load Behold Instagram widget
    if (
      typeof window !== "undefined" &&
      !document.querySelector('script[src="https://w.behold.so/widget.js"]')
    ) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://w.behold.so/widget.js";
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="container mx-auto px-4 tablet:px-8 laptop:px-12 mb-16">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        {/* Hero Section */}
        <div className="laptop:mt-16 mt-10 grid grid-cols-1 laptop:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="mt-5 p-2 laptop:p-0">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Berlin running club
            </p>
            <h1
              ref={textOne}
              className="mt-4 text-4xl tablet:text-5xl laptop:text-6xl laptopl:text-7xl font-semibold leading-tight mb-6"
            >
              {data.headerTaglineOne}
            </h1>
            <h2
              ref={textTwo}
              className="text-lg tablet:text-2xl laptop:text-3xl font-normal text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl"
            >
              {data.headerTaglineTwo}
            </h2>
            <div className="mt-8 laptop:mt-10 flex flex-wrap items-center gap-4">
              <Button
                classes="px-8 py-3"
                type="primary"
                onClick={() => {
                  const stravaLink = data.socials.find(
                    (s) => s.title === "Strava",
                  )?.link;
                  if (stravaLink) window.open(stravaLink);
                }}
              >
                {data.headerTaglineThree || "Join the next session →"}
              </Button>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Calm, inclusive, and purposeful runs across city streets and
                trails.
              </div>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-slate-200/70 dark:border-slate-700 pt-6">
              <div>
                <p className="text-3xl font-semibold">4+</p>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Weekly sessions
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold">300+</p>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Community runners
                </p>
              </div>
            </div>
          </div>
          <div className="relative h-[420px] tablet:h-[520px] w-full overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1400&q=80"
              alt="Runners moving through the city at sunrise"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] opacity-80">
                Real moments, real pace
              </p>
              <p className="mt-2 text-2xl font-semibold">
                We run together, we run for ourselves.
              </p>
            </div>
          </div>
        </div>
        {/* <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-2xl text-bold">Work.</h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {data.projects.map((project) => (
              <WorkCard
                key={project.id}
                img={project.imageSrc}
                name={project.title}
                description={project.description}
                onClick={() => window.open(project.url)}
              />
            ))}
          </div>
        </div> */}

        {/* What We Do Section */}
        <div className="mt-16 laptop:mt-24 p-2 laptop:p-0">
          <div className="tablet:m-10 flex flex-col gap-3 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              The rhythm
            </p>
            <h1 className="text-3xl laptop:text-4xl font-semibold">
              Our Activities
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Clean structure, generous spacing, and a pace that meets you where
              you are.
            </p>
          </div>
          <div className="mt-8 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {data.activities.map((activity) => (
              <ServiceCard
                key={activity.id}
                name={activity.title}
                description={activity.description}
              />
            ))}
          </div>
        </div>

        {/* Instagram Feed Section */}
        <div className="mt-16 laptop:mt-24 p-2 laptop:p-0">
          <div className="tablet:m-10 flex flex-col gap-3 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Community
            </p>
            <h1 className="text-3xl laptop:text-4xl font-semibold">
              Instagram Feed
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Candid frames from city streets, trails, and the people who make
              this pace possible.
            </p>
          </div>
          <div
            className="tablet:m-10 rounded-3xl overflow-hidden border border-slate-200/70 dark:border-slate-700"
            data-behold-id="2RlhdlsMgEKlXqql4APL"
          ></div>
        </div>
        {/* This button should not go into production */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5">
            <Link href="/edit">
              <Button type="primary">Edit Data</Button>
            </Link>
          </div>
        )}
        {/* Why AYOP Section */}
        <div className="mt-16 laptop:mt-32 p-2 laptop:p-0" ref={aboutRef}>
          <div className="tablet:m-10 flex flex-col gap-3 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Our purpose
            </p>
            <h1 className="text-3xl laptop:text-4xl font-semibold">
              Why we run
            </h1>
          </div>
          <p className="tablet:m-10 mt-2 text-base laptop:text-xl text-slate-600 dark:text-slate-300 w-full laptop:w-3/5">
            {data.aboutpara}
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

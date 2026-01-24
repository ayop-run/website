import { useRef, useEffect } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";

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

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto px-4 tablet:px-6 laptop:px-8 mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        {/* Hero Section */}
        <div className="laptop:mt-20 mt-10">
          <div className="mt-5 p-2 laptop:p-0">
            <h1
              ref={textOne}
              className="text-4xl tablet:text-5xl laptop:text-6xl laptopl:text-7xl font-bold leading-tight mb-4 laptop:mb-6"
            >
              {data.headerTaglineOne}
            </h1>
            <h2
              ref={textTwo}
              className="text-xl tablet:text-2xl laptop:text-3xl laptopl:text-4xl font-normal opacity-90 leading-relaxed max-w-3xl"
            >
              {data.headerTaglineTwo}
            </h2>
          </div>

          <div className="mt-8 laptop:mt-10 p-2 laptop:p-0">
            <Button
              classes="px-6 laptop:px-8"
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
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="tablet:m-10 text-2xl text-bold">Our Activities</h1>
          <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
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
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="tablet:m-10 text-2xl text-bold mb-2">
            Instagram Feed
          </h1>
          <p className="tablet:m-10 text-lg laptop:text-xl opacity-80 mb-6">
            Here's what our community looks like in real life.
          </p>
          <div
            className="tablet:m-10"
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
        <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={aboutRef}>
          <h1 className="tablet:m-10 text-2xl text-bold">Why we run</h1>
          <p className="tablet:m-10 mt-2 text-base laptop:text-xl w-full laptop:w-3/5">
            {data.aboutpara}
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

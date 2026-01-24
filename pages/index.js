import { useRef, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Button from "../components/Button";
import Link from "next/link";
import Layout from "../components/Layout";

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
    <Layout
      handleWorkScroll={handleWorkScroll}
      handleAboutScroll={handleAboutScroll}
    >
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
            className="text-lg tablet:text-xl laptop:text-2xl laptopl:text-3xl font-normal opacity-90 leading-relaxed max-w-3xl"
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
      <div className="mt-16 laptop:mt-24 p-2 laptop:p-0">
        <h2 className="text-2xl tablet:text-3xl laptop:text-4xl font-bold mb-12 laptop:mb-16">
          {data.activitiesTitle}
        </h2>
        <p className="text-base tablet:text-lg laptop:text-xl w-full laptop:w-4/5 mb-8 laptop:mb-12 leading-relaxed opacity-80">
          {data.activitiesDescription}
        </p>
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-6 laptop:gap-8 auto-rows-fr">
          {data.activities.map((activity) => (
            <ServiceCard
              key={activity.id}
              name={activity.title}
              description={activity.description}
              icon={activity.icon}
            />
          ))}
        </div>
      </div>

      {/* Instagram Feed Section */}
      <div className="mt-16 laptop:mt-24 p-2 laptop:p-0">
        <h2 className="text-2xl tablet:text-3xl laptop:text-4xl font-bold mb-12 laptop:mb-16">
          {data.instagramTitle}
        </h2>
        <p className="text-base tablet:text-lg laptop:text-xl w-full laptop:w-4/5 mb-8 laptop:mb-12 leading-relaxed opacity-80">
          {data.instagramDescription}
        </p>
        <div data-behold-id="2RlhdlsMgEKlXqql4APL" />
      </div>
      {/* This button should not go into production */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-5 right-5">
          <Link href="/edit">
            <Button type="primary">{data.editDataButton}</Button>
          </Link>
        </div>
      )}
      {/* Why AYOP Section */}
      <div className="mt-16 laptop:mt-24 p-2 laptop:p-0" ref={aboutRef}>
        <h2 className="text-2xl tablet:text-3xl laptop:text-4xl font-bold mb-12 laptop:mb-16">
          {data.whyWeRunTitle}
        </h2>
        <p className="text-base tablet:text-lg laptop:text-xl w-full laptop:w-4/5 leading-relaxed opacity-90">
          {data.aboutpara}
        </p>
      </div>
    </Layout>
  );
}

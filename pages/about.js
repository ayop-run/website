import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cursor from "../components/Cursor";
import Header from "../components/Header";
import Socials from "../components/Socials";
import Button from "../components/Button";
import { useTheme } from "next-themes";
import Head from "next/head";

// Data
import data from "../data/en.json";

const About = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  // Collect tags dynamically from data
  const tags = Array.from(new Set(data.teams.map((member) => member.tag)));

  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => router.push("/edit")} type={"primary"}>
            Edit About
          </Button>
        </div>
      )}

      {data.showCursor && <Cursor />}

      <div
        className={`container mx-auto px-4 tablet:px-6 laptop:px-8 mb-10 ${data.showCursor && "cursor-none"}`}
      >
        <Head>
          <title>About - {data.name}</title>
        </Head>

        <Header isBlog />

        {mount && (
          <main className="mt-10 laptop:mt-20">
            {/* ABOUT SECTION */}
            <section className="p-2 laptop:p-0">
              <h1 className="tablet:m-10 text-4xl tablet:text-5xl laptop:text-6xl font-bold mb-6 laptop:mb-8">
                About.
              </h1>

              {data.aboutparaTwo && (
                <p className="tablet:m-10 mt-4 text-lg tablet:text-xl laptop:text-2xl w-full laptop:w-4/5 mb-16 laptop:mb-20 leading-relaxed opacity-90">
                  {data.aboutparaTwo}
                </p>
              )}
            </section>

            {/* TEAM SECTION */}
            {data.teams && data.teams.length > 0 && (
              <section className="mt-16 laptop:mt-24 p-2 laptop:p-0">
                <h2 className="tablet:m-10 text-3xl tablet:text-4xl laptop:text-5xl font-bold mb-12 laptop:mb-16">
                  Our Team
                </h2>

                {tags.map((tag) => {
                  const membersInTag = data.teams.filter(
                    (member) => member.tag === tag,
                  );
                  if (membersInTag.length === 0) return null;

                  return (
                    <div key={tag} className="tablet:m-10 mb-16 laptop:mb-20">
                      <h3 className="text-2xl tablet:text-3xl laptop:text-4xl font-bold mb-4 laptop:mb-6">
                        {tag === "Partnership" ? "Events & Partnerships" : tag}
                      </h3>

                      {data.teamMissions?.[tag] && (
                        <p className="text-base tablet:text-lg laptop:text-xl mb-10 laptop:mb-12 opacity-80 leading-relaxed max-w-4xl">
                          {data.teamMissions[tag]}
                        </p>
                      )}

                      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6 laptop:gap-8">
                        {membersInTag.map((member) => (
                          <div
                            key={member.id}
                            className={`p-6 laptop:p-8 rounded-lg shadow-sm transition-all hover:shadow-md ${
                              mount && theme === "dark"
                                ? "bg-slate-800 hover:bg-slate-700"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <h4 className="text-lg tablet:text-xl font-semibold mb-3 laptop:mb-4">
                              {member.name}
                            </h4>

                            {member.bio && (
                              <p className="text-sm tablet:text-base laptop:text-lg mb-5 laptop:mb-6 opacity-75 leading-relaxed">
                                {member.bio}
                              </p>
                            )}

                            {member.instagram && (
                              <a
                                href={member.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm tablet:text-base text-blue-500 hover:text-blue-600 underline transition-colors"
                              >
                                Instagram
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* SOCIALS */}
            <section className="mt-16 laptop:mt-24 p-2 laptop:p-0">
              <div className="flex justify-center">
                <Socials />
              </div>
            </section>
          </main>
        )}
      </div>
    </>
  );
};

export default About;

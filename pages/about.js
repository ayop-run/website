import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "../components/Button";
import { useTheme } from "next-themes";
import Layout from "../components/Layout";

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

      <Layout title="About" isBlog>
        {mount && (
          <main className="mt-10 laptop:mt-20">
            {/* ABOUT SECTION */}
            <section className="p-2 laptop:p-0">
              <h1 className="text-4xl tablet:text-5xl laptop:text-6xl laptopl:text-7xl font-bold mb-4 laptop:mb-6">
                About
              </h1>

              {data.aboutparaTwo && (
                <p className="mt-4 text-base tablet:text-lg laptop:text-xl w-full laptop:w-4/5 mb-16 laptop:mb-20 leading-relaxed opacity-90">
                  {data.aboutparaTwo}
                </p>
              )}
            </section>

            {/* TEAM SECTION */}
            {data.teams && data.teams.length > 0 && (
              <section className="mt-16 laptop:mt-24 p-2 laptop:p-0">
                <h2 className="text-2xl tablet:text-3xl laptop:text-4xl font-bold mb-12 laptop:mb-16">
                  Our Team
                </h2>

                {tags.map((tag) => {
                  const membersInTag = data.teams.filter(
                    (member) => member.tag === tag,
                  );
                  if (membersInTag.length === 0) return null;

                  return (
                    <div key={tag} className="mb-16 laptop:mb-20">
                      <h3 className="text-xl tablet:text-2xl laptop:text-3xl font-bold mb-4 laptop:mb-6">
                        {tag === "Partnership" ? "Events & Partnerships" : tag}
                      </h3>

                      {data.teamMissions?.[tag] && (
                        <p className="text-base tablet:text-lg laptop:text-xl mb-10 laptop:mb-12 opacity-80 leading-relaxed max-w-4xl">
                          {data.teamMissions[tag]}
                        </p>
                      )}

                      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-6 laptop:gap-8">
                        {membersInTag.map((member) => {
                          // Extract username from Instagram URL
                          const getInstagramUsername = (url) => {
                            if (!url) return "";
                            const match = url.match(
                              /instagram\.com\/([^\/\?]+)/,
                            );
                            return match ? `@${match[1]}` : "";
                          };

                          return (
                            <div
                              key={member.id}
                              className="flex flex-col items-center text-center"
                            >
                              <div className="relative w-20 h-20 laptop:w-24 laptop:h-24 mb-3 rounded-xl overflow-hidden">
                                {member.image ? (
                                  <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div
                                    className={`w-full h-full rounded-xl ${
                                      mount && theme === "dark"
                                        ? "bg-slate-700"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                )}
                              </div>
                              <h4 className="text-xl tablet:text-2xl font-semibold mb-1">
                                {member.name}
                              </h4>
                              {member.bio && (
                                <p
                                  className={`text-sm tablet:text-base mb-2 ${
                                    mount && theme === "dark"
                                      ? "opacity-70"
                                      : "opacity-70"
                                  } leading-relaxed whitespace-pre-line`}
                                >
                                  {member.bio}
                                </p>
                              )}
                              {member.instagram && (
                                <a
                                  href={member.instagram}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-sm tablet:text-base transition-opacity ${
                                    mount && theme === "dark"
                                      ? "opacity-70 hover:opacity-80"
                                      : "opacity-70 hover:opacity-80"
                                  }`}
                                >
                                  {getInstagramUsername(member.instagram)}
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </main>
        )}
      </Layout>
    </>
  );
};

export default About;

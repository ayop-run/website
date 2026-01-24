import Router, { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import Layout from "../../components/Layout";
import data from "../../data/en.json";
import { ISOToDate, useIsomorphicLayoutEffect } from "../../utils";
import { getAllPosts } from "../../utils/api";
const Blog = ({ posts }) => {
  const showBlog = useRef(data.showBlog);
  const text = useRef();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (text.current) {
      if (showBlog.current) {
        stagger(
          [text.current],
          { y: 30, x: 0, transform: "scale(0.98)", opacity: 0 },
          { y: 0, x: 0, transform: "scale(1)", opacity: 1 },
        );
      } else {
        router.push("/");
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const createBlog = () => {
    if (process.env.NODE_ENV === "development") {
      fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(() => {
        router.reload(window.location.pathname);
      });
    } else {
      alert("This thing only works in development mode.");
    }
  };

  const deleteBlog = (slug) => {
    if (process.env.NODE_ENV === "development") {
      fetch("/api/blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
        }),
      }).then(() => {
        router.reload(window.location.pathname);
      });
    } else {
      alert("This thing only works in development mode.");
    }
  };
  return (
    showBlog.current && (
      <>
        <Layout title="Blog" isBlog>
          <main className="mt-10 laptop:mt-20">
            <section className="p-2 laptop:p-0">
              <h1 className="text-4xl tablet:text-5xl laptop:text-6xl font-bold mb-12 laptop:mb-16">
                Blog
              </h1>

              <div className="mt-10 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-8 laptop:gap-10">
                {posts &&
                  posts.map((post) => (
                    <article
                      className="cursor-pointer relative group transition-all hover:scale-[1.02]"
                      key={post.slug}
                      onClick={() => Router.push(`/blog/${post.slug}`)}
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                        <div className="relative w-full h-64 laptop:h-72">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        {process.env.NODE_ENV === "development" && mounted && (
                          <div className="absolute top-2 right-2 z-10">
                            <Button
                              onClick={(e) => {
                                deleteBlog(post.slug);
                                e.stopPropagation();
                              }}
                              type={"primary"}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      <h2 className="mt-6 text-xl tablet:text-2xl laptop:text-3xl font-bold leading-tight">
                        {post.title}
                      </h2>
                      <p className="mt-3 opacity-70 text-base tablet:text-lg leading-relaxed line-clamp-3">
                        {post.preview}
                      </p>
                      <span className="block mt-4 text-sm opacity-50">
                        {ISOToDate(post.date)}
                      </span>
                    </article>
                  ))}
              </div>
            </section>
          </main>
        </Layout>
        {process.env.NODE_ENV === "development" && mounted && (
          <div className="fixed bottom-6 right-6">
            <Button onClick={createBlog} type={"primary"}>
              Add New Post +{" "}
            </Button>
          </div>
        )}
      </>
    )
  );
};

export async function getStaticProps() {
  const posts = getAllPosts([
    "slug",
    "title",
    "image",
    "preview",
    "author",
    "date",
  ]);

  return {
    props: {
      posts: [...posts],
    },
  };
}

export default Blog;

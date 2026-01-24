import React, { useRef, useState } from "react";
import { getPostBySlug, getAllPosts } from "../../utils/api";
import ContentSection from "../../components/ContentSection";
import { useIsomorphicLayoutEffect, ISOToDate } from "../../utils";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import BlogEditor from "../../components/BlogEditor";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const BlogPost = ({ post }) => {
  const [showEditor, setShowEditor] = useState(false);
  const textOne = useRef();
  const textTwo = useRef();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    stagger([textOne.current, textTwo.current], { y: 30 }, { y: 0 });
  }, []);

  return (
    <>
      <Layout title={`Blog - ${post.title}`} description={post.preview} isBlog>
        <div className="mt-10 flex flex-col">
          <img
            className="w-full h-96 rounded-lg shadow-lg object-cover"
            src={post.image}
            alt={post.title}
          ></img>
          <h1
            ref={textOne}
            className="mt-10 text-4xl tablet:text-5xl laptop:text-6xl font-bold mb-4"
          >
            {post.title}
          </h1>
          <p
            ref={textTwo}
            className="mt-2 text-xl max-w-4xl opacity-70 leading-relaxed"
          >
            {post.tagline}
          </p>
          {post.date && (
            <span className="block mt-4 text-sm opacity-50">
              {ISOToDate(post.date)}
            </span>
          )}
        </div>
        <ContentSection content={post.content}></ContentSection>
      </Layout>
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={() => setShowEditor(true)} type={"primary"}>
            Edit this blog
          </Button>
        </div>
      )}

      {showEditor && (
        <BlogEditor
          post={post}
          close={() => setShowEditor(false)}
          refresh={() => router.reload(window.location.pathname)}
        />
      )}
    </>
  );
};

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    "date",
    "slug",
    "preview",
    "title",
    "tagline",
    "preview",
    "image",
    "content",
  ]);

  return {
    props: {
      post: {
        ...post,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
export default BlogPost;

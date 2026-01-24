import React from "react";
import Head from "next/head";
import Header from "../Header";
import Footer from "../Footer";
import Cursor from "../Cursor";
import data from "../../data/en.json";

const Layout = ({
  children,
  title,
  description,
  isBlog = false,
  handleWorkScroll,
  handleAboutScroll,
}) => {
  const pageTitle = title ? `${title} - ${data.name}` : data.name;

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div
        className={`container mx-auto px-4 tablet:px-6 laptop:px-8 mb-10 ${
          data.showCursor && "cursor-none"
        }`}
      >
        <Header
          isBlog={isBlog}
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "next-themes";

const CodeBlock = ({ theme }) => {
  return {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const style = theme === "dark" ? dracula : oneLight;
      return !inline && match ? (
        <SyntaxHighlighter
          style={style}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };
};

const ContentSection = ({ content }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to dark theme if not mounted yet
  const currentTheme = mounted ? theme : "dark";

  return (
    <ReactMarkdown
      components={CodeBlock({ theme: currentTheme })}
      className="markdown-class"
    >
      {content}
    </ReactMarkdown>
  );
};

export default ContentSection;

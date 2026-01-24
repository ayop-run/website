import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/helvetica-neue-55"
          rel="stylesheet"
        />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default App;

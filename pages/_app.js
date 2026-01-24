import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/png"
          href="/images/logo/favicon.png"
        />
        <link
          rel="shortcut icon"
          type="image/png"
          href="/images/logo/favicon.png"
        />
        <link
          rel="apple-touch-icon"
          href="/images/logo/favicon.png"
        />
      </Head>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default App;

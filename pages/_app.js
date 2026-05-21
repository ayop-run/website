import "../app/globals.css";
import { ThemeProvider } from "next-themes";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/images/logo/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo/favicon.png" />
        <link rel="apple-touch-icon" href="/images/logo/favicon.png" />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default App;

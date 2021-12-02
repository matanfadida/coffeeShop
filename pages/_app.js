import { Fragment } from "react";
import Header from "../components/MainHeader/Header";
import { AuthContextProvider } from "../components/state/auth-context";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Header />
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </Fragment>
  );
}

export default MyApp;

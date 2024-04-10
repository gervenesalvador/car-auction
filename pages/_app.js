// import Head from 'next/head';
// import axios from "axios";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';

import AppContext from "@/context/app-context";
import buildClient from '@/utils/base-client';
import BootstrapClient from '@/components/BootstrapClient.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

function MyApp({ Component, pageProps, currentUser }) {
  const [auth, setAuth] = useState({
    isAuthenticated: !!currentUser,
    currentUser,
  });

  return (
    <>
      <AppContext.Provider
        value={{
          auth,
          setAuth,
        }}
      >
        <Component {...pageProps} />
        <BootstrapClient />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AppContext.Provider>
    </>
  )
}

MyApp.getInitialProps = async (appContext) => {
  let data = {};
  let pageProps = {};
  const client = buildClient(appContext.ctx);
  try {
    const currentUserResponse = await client.get('/api/auth/current-user');
    data = currentUserResponse.data;
  } catch (error) {
    // to catch the error if the user is not logged in
  }

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client
    );
  }

  return { ...data, pageProps };
};

export default MyApp;

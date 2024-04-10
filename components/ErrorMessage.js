import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const ErrorMessage = ({ error, message }) => {
  return (
    <>
      <Head>
        <title>{error} | Car Auction</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <section className="py-3">
        <div className="container px-4 mx-auto text-center">
          <img
            className="w-50"
            src="https://shuffle.dev/metis-assets/illustrations/error2.png"
            alt=""
          />
          <h2 className="fw-bold ">
            {error}
          </h2>
          <h2 className="mb-2 fw-bold">
            Something went wrong!
          </h2>
          <p className="mb-6 text-blueGray-400">{message}</p>
          <div>
            <Link href="/">Go back to Homepage</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ErrorMessage;

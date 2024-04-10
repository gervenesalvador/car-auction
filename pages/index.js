import Link from 'next/link';
import Head from 'next/head';
import { useContext } from 'react';
import Navbar from '@/components/Navbar';
import AppContext from '@/context/app-context';

export default function Homepage() {
  const { auth: { isAuthenticated} } = useContext(AppContext);

  return (
    <>
      <Head>
        <title>Home | Car Auction</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />

      <div className="container mt-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Ultimate Car Auction Experience!</h1>
        {isAuthenticated ? (
          <Link href="/listings" className="btn btn-primary mb-3">Browse Car Listings</Link>
        ) : (
          <Link href="/login" className="btn btn-primary mb-3">Login to Start Bidding</Link>
        )}
        <p>
          Discover a vast selection of cars up for grabs at our exciting online
          auctions. Find your dream car, place competitive bids, and experience
          the thrill of the chase.
        </p>
      </div>
    </>
  )
}

import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';

import AppContext from '@/context/app-context';
import Navbar from '@/components/Navbar';
import ErrorMessage from '@/components/ErrorMessage';
import numberWithCommas from '@/utils/number-with-commas';
import parseListingData from '@/utils/parse-listing-data';

export default function Listingpage() {
  const { auth: { isAuthenticated } } = useContext(AppContext);
  if (!isAuthenticated) {
    return (
      <ErrorMessage error="Error 401" message="You must be logged in to see the list." />
    );
  }

  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    try {
      const response = await axios.get('/api/~/listings');
      const data = await response.data.listings;
      const mapped_listings = data.map(listing => {
        const current_bid = listing.bids[0] && listing.bids[0].amount > listing.opening_price ? Number(listing.bids[0].amount) : Number(listing.opening_price);
        const parsed_listing = parseListingData(listing);
        return {...parsed_listing, current_bid: current_bid };
      });

      setListings(mapped_listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    fetchListings();

    const intervalParsingListings = setInterval(() => {
      setListings((prevListings) => prevListings.map(parseListingData));
    }, 1000);

    const intervalFetchData = setInterval(() => {
      fetchListings();
    }, 10000); // reload the listing list every 10 seconds

    return () => {
      clearInterval(intervalParsingListings);
      clearInterval(intervalFetchData);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Listings | Car Auction</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />

      <div className="container mt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Listing</li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold mb-4">Listings</h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {listings.map((listing) => (
            <div key={listing.id} className="col">
              <div className="card h-100 shadow-sm">
                <img
                  src={listing.image_link}
                  className="card-img-top img-fluid"
                  alt="Car Image"
                />
                <div className="card-body">
                  <h5 className="card-title">{listing.brand} {listing.type} • {listing.year}</h5>
                  {listing.is_close ? (
                    <p className="card-text mb-0 fw-bold text-danger">CLOSED</p>
                  ) : (
                    <p className="card-text mb-0">Ends in: {listing.days}d {listing.hours}h {listing.minutes}m {listing.seconds}s</p>
                  )}
                  <p className="card-text font-bold">Current Bid: &#8369;{numberWithCommas(listing.current_bid)}</p>
                  <Link href={`/listings/${listing.id}`} className="btn btn-primary text-center w-100">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

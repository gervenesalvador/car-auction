import Link from 'next/link';
import Head from 'next/head';
import router, {useRouter} from 'next/router';
import axios from "axios";
import { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';

import Navbar from '@/components/Navbar';
import AppContext from '@/context/app-context';
import ErrorMessage from '@/components/ErrorMessage';
import numberWithCommas from '@/utils/number-with-commas';
import parseListingData from '@/utils/parse-listing-data';

function ListingViewPage({ listingData }) {
  const { auth: { isAuthenticated, currentUser } } = useContext(AppContext);
  if (!isAuthenticated) {
    return (
      <ErrorMessage error="Error 401" message="You must be logged in" />
    );
  }
  if (!listingData) {
    return (
      <>
        <ErrorMessage error="Error 404" message="Our server couldn't find that listing. It may have been deleted or there is a mispelling in the URL" />
      </>
    );
  }

  const [listing, setListing] = useState(listingData);
  const clientRouter = useRouter();
  const openDeleteModalBtn = useRef();
  const openstatusModalBtn = useRef();

  const fetchListing = async () => {
    try {
      const listing_id = clientRouter.query.slug || router.query.listing_id;
      const res = await axios.get(`/api/~/listings/${listing_id}`);
      const car_listing = res.data.listing;
      const current_bid = car_listing.bids[0] && car_listing.bids[0].amount > car_listing.opening_price ? car_listing.bids[0].amount : car_listing.opening_price;
      const parsed_listing = parseListingData(car_listing);
      setListing({...parsed_listing, current_bid});
    } catch (error) {
      console.error(error)
    }
  };

  const handlePlaceBid = async (e) => {
    if (!currentUser) {
      return toast.error("Login Required: Please log in to place a bid");
    }
    try {
      e.target.classList.add("disabled");
      const response = await axios.post('/api/~/bid', {listing_id: listing.id});
      toast.success(response.data.message);
      fetchListing();
    } catch (error) {
      console.error("place bid", error);
      toast.warning(error.response?.data.message || "Something went wrong");
    } finally {
      e.target.classList.remove("disabled");
    }
  }

  const handleDeleteListing = async (e) => {
    try {
      e.target.classList.add("disabled");
      const response = await axios.post('/api/~/listings/delete', {listing_id: listing.id});
      toast.success(response.data.message);
      router.push('/');
    } catch (error) {
      console.error("delete listing", error);
      toast.warning(error.response?.data.message || "Something went wrong");
    } finally {
      e.target.classList.remove("disabled");
    }
  }

  const handleOpenDeleteModal = () => {
    openDeleteModalBtn.current.click()
  }

  const handleListingStatusToggle = async (e) => {
    try {
      e.target.classList.add("disabled");
      const response = await axios.post('/api/~/listings/modify', {listing_id: listing.id, status: !listing.status });
      toast.success(response.data.message);
      fetchListing();
    } catch (error) {
      console.error("manual close", error);
      toast.warning(error.response?.data.message || "Something went wrong");
    } finally {
      e.target.classList.remove("disabled");
    }
  }

  const handleOpenStatusModal = () => {
    openstatusModalBtn.current.click()
  }

  useEffect(() => {
    const intervalParsingListing = setInterval(() => {
      setListing(parseListingData);
    }, 1000);

    const intervalFetchData = setInterval(() => {
      fetchListing();
    }, 5000);

    return () => {
      clearInterval(intervalParsingListing);
      clearInterval(intervalFetchData);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{listingData.brand} {listingData.type} | Car Auction</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />

      <div className="container mt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item"><Link href="/listings">Listing</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{listing.brand} {listing.type}</li>
          </ol>
        </nav>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col">
            <h2>{listing.brand} {listing.type}</h2>
            <p>{listing.description}</p>
            {currentUser && currentUser.role.id === 1 && (
              <div className="d-flex justify-content-evenly my-3">
                <button className="btn btn-danger" onClick={handleOpenDeleteModal}>Delete Permanent</button>
                {!listing.is_close && (
                  <button className="btn btn-warning" onClick={handleOpenStatusModal}>Manually Closed</button>
                )}
                {listing.is_close && ((new Date(listing.expiry_date).getTime() - new Date().getTime()) > 0) && (
                  <button className="btn btn-warning" onClick={handleOpenStatusModal}>Open Listing</button>
                )}
              </div>
            )}
            <table className="table">
              <tbody>
                <tr>
                  <td className="fw-bold">Year</td>
                  <td className="text-right">{listing.year}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Seller</td>
                  <td className="text-right">{listing.owner_user.name}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Date posted</td>
                  <td className="text-right">{(new Date(listing.createdAt)).toUTCString()}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Time Left</td>
                  <td className="text-right">{listing.days}d {listing.hours}h {listing.minutes}m {listing.seconds}s</td>
                </tr>
                <tr>
                  <td className="fw-bold">Current Bid</td>
                  <td className="text-right">&#8369;{numberWithCommas(listing.current_bid)}</td>
                </tr>
                {listing.is_close && listing.bids.length > 0 && (
                  <tr>
                    <td className="fw-bold">Winner</td>
                    <td className="text-right">{listing.bids[0].user.name}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {listing.is_close && listing.bids[0].user_id === currentUser.id && (
              <h5 className="text-success text-center">Bidding successful! The car is yours!</h5>
            )}

            {!listing.is_close && (
              <>
                {currentUser && listing.bids[0] && listing.bids[0].user_id === currentUser.id ? (
                  <button type="button" className="btn btn-outline-primary text-center w-100 disabled">
                    Your are the Highest Bidder
                  </button>
                ) : (
                  <>
                    {(currentUser && currentUser.id == listing.user_id) ? (
                      <p className="text-warning text-center">You own this</p>
                    ) : (
                        <>
                          <p className="text-danger m-0 fw-bold">**Important Note:**</p>
                          <p className="text-danger"> The current bid is (&#8369;{numberWithCommas(listing.current_bid)}) and go up to &#8369;{numberWithCommas(listing.price_increment)} per bid. This means the bid you will place is <span className="fw-bold">&#8369;{numberWithCommas(listing.current_bid + listing.price_increment)}</span>.</p>
                          <button type="button" className="btn btn-primary text-center w-100" onClick={handlePlaceBid} >
                            Place Bid &#8369;{numberWithCommas(listing.current_bid + listing.price_increment)}
                          </button>
                        </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="col">
            <img src={listing.image_link} className="img-fluid"alt="Car Image" />
          </div>
        </div>
      </div>

      <div className="modal fade" id="deleteModal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteModalLabel">Delete Confirmation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure to delete this listing?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteListing}>Delete</button>
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="d-none" ref={openDeleteModalBtn} data-bs-toggle="modal" data-bs-target="#deleteModal" />

      <div className="modal fade" id="statusModal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="statusModalLabel">{listing.status ? 'Close' : 'Open'} Confirmation</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure to {listing.status ? 'Close' : 'Open'} this listing?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleListingStatusToggle}>
                Confirm
              </button>
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="d-none" ref={openstatusModalBtn} data-bs-toggle="modal" data-bs-target="#statusModal" />
    </>
  );
}

ListingViewPage.getInitialProps = async (context, client) => {
  try {
    const { listing_id } = context.query;
    const { data } = await client.get(`/api/~/listings/${listing_id}`);
    const listing = data.listing;
    const current_bid = listing.bids[0] && listing.bids[0].amount > listing.opening_price ? Number(listing.bids[0].amount) : Number(listing.opening_price);
    const parsed_listing = parseListingData(listing);
    return { listingData: {...parsed_listing, current_bid} };
  } catch (err) {
    console.error("getting a listing", err);
    return { listingData: null };
  }
}

export default ListingViewPage;

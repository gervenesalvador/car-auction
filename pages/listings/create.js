import Link from 'next/link';
import router from 'next/router';
import Head from 'next/head';
import axios from "axios";
import { useState, useContext } from 'react';
import DateTimePicker from 'react-datetime-picker';

import Navbar from '@/components/Navbar';
import ErrorMessage from '@/components/ErrorMessage';
import AppContext from '@/context/app-context';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function ListingCreatePage() {
  const { auth: { isAuthenticated } } = useContext(AppContext);

  if (!isAuthenticated) {
    return (
      <ErrorMessage error="Error 401" message="You must be logged in to auction a car." />
    );
  }

  const [formData, setFormData] = useState({
    brand: '',
    year: '',
    type: '',
    description: '',
    image_link: '',
    opening_price: '',
    price_increment: '',
    // expiry_date: '',
  });
  const [expiry_date, ExpiryDateonChange] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setErrorMessage("");
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    try {
      const combinedFormData = {...formData, expiry_date};
      const response = await axios.post('/api/~/listings/create', combinedFormData);

      router.push(`/listings/${response.data.listing.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      setErrorMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <Head>
        <title>Create Listing | Car Auction</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Navbar />

      <div className="container mt-4">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><Link href="/">Home</Link></li>
            <li class="breadcrumb-item"><Link href="/listings">Listing</Link></li>
            <li class="breadcrumb-item active" aria-current="page">Create Car Listing</li>
          </ol>
        </nav>
        <div className="card mb-3">
          <div className="card-header">
            Create a Car Listing
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <p className="text-danger text-center">{errorMessage}</p>
              )}
              <div className="row row-cols-1 row-cols-md-2 g-3 align-items-center">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="brand" className="form-label">Brand</label>
                    <input type="text" name="brand" className="form-control" id="brand" value={formData.brand} onChange={handleChange} required autoFocus />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="year" className="form-label">Year</label>
                    <input type="number" name="year" className="form-control" id="year" value={formData.year} onChange={handleChange} required />
                  </div>
                </div>
              </div>
              <div className="row row-cols-1 row-cols-md-2 g-3 align-items-center">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type</label>
                    <input type="text" name="type" className="form-control" id="year" value={formData.type} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="expiry_date" className="form-label">Expiry Date</label>
                    <DateTimePicker name="expiry_date" className="form-control" id="expiry_date" value={expiry_date} onChange={ExpiryDateonChange} />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea name="description" id="description" className="form-control" rows={5} value={formData.description} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="image_link" className="form-label">Image Link</label>
                <input type="url" name="image_link" className="form-control" id="image_link" value={formData.image_link} onChange={handleChange} required />
              </div>
              <div className="row row-cols-1 row-cols-md-2 g-3 align-items-center">
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="opening_price" className="form-label">Opening Price</label>
                    <input type="number" name="opening_price" className="form-control" id="opening_price" value={formData.opening_price} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col">
                  <div className="mb-3">
                    <label htmlFor="price_increment" className="form-label">Price Increment</label>
                    <input type="number" name="price_increment" className="form-control" id="price_increment" value={formData.price_increment} onChange={handleChange} required />
                  </div>
                </div>
              </div>
              <button className={`btn btn-primary w-100 ${isLoading ? 'disabled' : ''}`}>Save</button>
            </form>
          </div>
      </div>
      </div>
    </>
  );
}

export default ListingCreatePage;

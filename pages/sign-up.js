import Link from 'next/link';
import Head from 'next/head';
import router from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({name: "", email: "", password: "", phone_number: ""});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    try {
      const response = await axios.post('/api/auth/sign-up', formData);

      router.push('/login');
      toast.success("Registered Successfully");
    } catch (error) {
      console.error('Sign Up:', error);
      toast.warning(error.response?.data.message || "Something went wrong", {autoClose: 10000});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | Car Auction</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="container d-flex w-100 justify-content-center align-items-center" style={{ height: "100vh"}}>
        <div className="card shadow-sm p-4 auth-form">
          <h2 className="text-center mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full name</label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="phone_number" className="form-label">Phone number</label>
              <input type="text" className="form-control" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
            </div>
            <div className="mb-3 d-grid gap-2">
              <button type="submit" className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}>Sign Up</button>
            </div>
            <div className="text-center">
              Already have an account? <Link href="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

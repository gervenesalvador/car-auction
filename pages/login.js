import Link from 'next/link';
import Head from 'next/head';
import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import AppContext from '@/context/app-context';

export default function Login() {
  const { auth: { isAuthenticated} } = useContext(AppContext);
  if (isAuthenticated) {
    window.location = "/";
  }

  const [formValues, setFormValues] = useState({ email: "", password: ""});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formValues);
      document.cookie = `token=${response.data.token}; path=/`;
      window.location = "/";
    } catch (error) {
      console.error('Login:', error);
      toast.warning(error.response?.data.message || "Something went wrong", {autoClose: 10000});
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login | Car Auction</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="container d-flex w-100 justify-content-center align-items-center" style={{ height: "100vh"}}>
        <div className="card shadow-sm p-4 auth-form">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" name="email" className="form-control" id="email" onChange={(event) => handleInputChange(event)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" name="password" className="form-control" id="password" onChange={(event) => handleInputChange(event)} />
            </div>
            <div className="mb-3 d-grid gap-2">
              <button type="submit" className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}>Login</button>
            </div>
            <div className="text-center">
              Don't have an account? <Link href="/sign-up">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

import Link from 'next/link';
import { useContext } from "react";
import { useRouter } from 'next/router';

import AppContext from "@/context/app-context";

function Navbar() {
  const { auth: { currentUser } } = useContext(AppContext);
  const { asPath } = useRouter();

  const isLinkActive = (href) => {
    return asPath === href ? 'active' : ''
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary my-navbar">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">Car Auction</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {currentUser ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                  <Link className={`nav-link ${isLinkActive("/listings")}`} aria-current="page" href="/listings">Browse Listing</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isLinkActive("/listings/create")}`} aria-current="page" href="/listings/create">Create Car Listing</Link>
                </li>
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {currentUser.name}
                  </Link>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/logout">Logout</a></li>
                  </ul>
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" href="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/sign-up">Sign Up</Link>
                </li>
              </ul>
            </>
          ) }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

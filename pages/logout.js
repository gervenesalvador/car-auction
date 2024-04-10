import { useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

import AppContext from '@/context/app-context';

function LogoutPage() {
  const { setAuth } = useContext(AppContext);
  useEffect(() => {
    Cookies.remove('token');
    setAuth({ isAuthenticated: false, currentUser: null });
    window.location = "/";
  }, []);
}

export default LogoutPage;

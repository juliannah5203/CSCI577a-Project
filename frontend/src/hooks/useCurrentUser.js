import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useStoreUserCookie() {
  useEffect(() => {
    axios
      .get('http://localhost:5001/auth/current_user', { withCredentials: true })
      .then(({ data }) => {
        Cookies.set('mindcareUser', JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
        }), { expires: 7, sameSite: 'Lax' });
      })
      .catch(() => {
        // not logged in, clear cookie
        Cookies.remove('mindcareUser');
      });
  }, []);
}
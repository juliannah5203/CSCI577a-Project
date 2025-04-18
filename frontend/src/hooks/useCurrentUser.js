import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export function useStoreUserCookie() {
    useEffect(() => {
      axios
        .get('http://localhost:5001/api/users/profile', { withCredentials: true })
        .then(({ data }) => {
          Cookies.set('mindcareUser', JSON.stringify({
            id:    data.userId,
            name:  data.name,
            email: data.email,
            region: data.region,
            sex: data.sex
          }), { expires: 7, sameSite: 'Lax' });
        })
        .catch(() => {
          Cookies.remove('mindcareUser');
        });
    }, []);
  }
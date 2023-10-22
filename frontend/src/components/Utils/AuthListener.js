import { useEffect } from 'react';
import { auth } from "../../firebase"
import { useNavigate } from 'react-router-dom';

function AuthListener({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in. Redirect to the appropriate page.
        if (user.email === 'adminmaps@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        // User is not signed in. Redirect to the login page.
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return children;
}

export default AuthListener;

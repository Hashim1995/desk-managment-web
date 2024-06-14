/* eslint-disable no-unused-vars */
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import routesList from '@core/routes/routes';
import { useDispatch } from 'react-redux';
import { Spinner } from '@nextui-org/react';
import useDarkMode from 'use-dark-mode';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { fetchUserData } from './redux/auth/auth-slice';
import { AppDispatch } from './redux/store';
import 'animate.css';

function App() {
  const router = useRoutes(routesList);
  const dispatch = useDispatch<AppDispatch>();

  const userToken: any = JSON.parse(localStorage.getItem('userToken') || '{}');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const mode = import.meta.env.VITE_APP_MODE; // 'development' or 'production'
    document.title =
      mode === 'development' ? '(Dev) Desk booking' : 'Desk booking';

    if (!userToken?.token) {
      if (location?.pathname !== '/terms-conditions') {
        navigate('/sign-in');
      }
    } else {
      dispatch(fetchUserData());
    }
  }, []);

  const darkMode = useDarkMode(false);

  return (
    <main className={'dark gradient-bg min-h-screen '}>
      <Suspense
        fallback={
          <div className="min-h-screen">
            <Spinner className="absolute inset-0" />
          </div>
        }
      >
        <GoogleOAuthProvider clientId="519108931479-4kurpb50q090ram0ksgdd98bdsm864fp.apps.googleusercontent.com">
          {router}
        </GoogleOAuthProvider>
      </Suspense>
    </main>
  );
}

export default App;

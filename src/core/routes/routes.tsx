import { Spinner } from '@nextui-org/react';
import BookingReports from '@/modules/reports/booking-reports';
import { Suspense } from 'react';
import MainLayout from '../layout';
import Home from '../../modules/home/home';
import SignIn from '../sign-in';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <div className="min-h-screen">
                <Spinner className="absolute inset-0" />
              </div>
            }
          >
            <Home />
          </Suspense>
        )
      },
      {
        path: 'reports',
        element: (
          <Suspense
            fallback={
              <div className="min-h-screen">
                <Spinner className="absolute inset-0" />
              </div>
            }
          >
            <BookingReports />
          </Suspense>
        )
      },
      {
        path: 'sign-in',
        element: <SignIn />
      }
    ]
  },
  {
    path: '*',
    element: <h1>404</h1>
  }
];

export default routes;

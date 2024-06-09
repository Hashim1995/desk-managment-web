import { Spinner } from '@nextui-org/react';
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
          <Suspense fallback={<Spinner />}>
            <Home />
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

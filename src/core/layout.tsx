/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Outlet } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import AppNavbar from './navbar';
import MobileBottomNavigation from './mobile-bottom-bar';
import ReservationCircle from './example';

function MainLayout() {
  const { user } = useSelector((state: RootState) => state.user);
  const reservations = [
    { start: '2024-06-24T08:00:00Z', end: '2024-06-24T11:00:00Z' },
    { start: '2024-06-24T12:00:00Z', end: '2024-06-24T15:00:00Z' },
    { start: '2024-06-24T19:47:00Z', end: '2024-06-24T22:20:00Z' }
  ];

  const convertISOToHourFraction = (isoTime: string | number | Date) => {
    const date = new Date(isoTime);
    return (
      (date.getUTCHours() +
        date.getUTCMinutes() / 60 +
        date.getUTCSeconds() / 3600) /
      24
    );
  };

  const radius = 100;
  const centerX = 110;
  const centerY = 110;

  // Calculates coordinates on the circle for a given time fraction
  const getCoordinatesForTimeFraction = (timeFraction: number) => {
    const angle = 2 * Math.PI * timeFraction - Math.PI / 2; // Adjust for the circle to start at the top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Prepare paths for each reservation
  const reservationPaths = reservations.map((r, i) => {
    const startFraction = convertISOToHourFraction(r.start);
    const endFraction = convertISOToHourFraction(r.end);
    const start = getCoordinatesForTimeFraction(startFraction);
    const end = getCoordinatesForTimeFraction(endFraction);
    return (
      <path
        key={i}
        d={`M${centerX},${centerY} L${start.x},${start.y} A${radius},${radius} 0 0,1 ${end.x},${end.y} Z`}
        fill="red"
        stroke="black"
        strokeWidth="0.5"
      />
    );
  });

  return (
    <div>
      {/* <div className="flex flex-col items-center pt-5">
        <span className="mx-auto">00:00</span>
        <ReservationCircle reservations={reservations} />
        <span className="mx-auto">12:00</span>
      </div> */}
      {user?.id && <AppNavbar />}
      <main>
        <Outlet />
        {user?.id && <MobileBottomNavigation />}
      </main>
      {/* <footer className="z-10 flex justify-between items-center gap-5 bg-transparent px-12 py-3 w-full">
        <div>
          <p className="font-bold text-inherit">ACME</p>
        </div>

        <div className="flex justify-center gap-4">
          <div>Copyright</div>
        </div>
      </footer> */}
    </div>
  );
}

export default MainLayout;

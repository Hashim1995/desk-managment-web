/* eslint-disable jsx-a11y/anchor-is-valid */
import { Outlet } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import AppNavbar from './navbar';
import MobileBottomNavigation from './mobile-bottom-bar';

function MainLayout() {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div>
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

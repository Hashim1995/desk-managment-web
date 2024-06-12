/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './navbar';

function MainLayout() {
  return (
    <div className="h-full">
      <AppNavbar />
      <main className="flex-grow my-10 px-10">
        <Outlet />
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

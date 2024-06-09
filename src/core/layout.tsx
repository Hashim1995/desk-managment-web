/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './navbar';

function MainLayout() {
  return (
    <div className="h-full">
      <AppNavbar />
      <main className="flex-grow p-10">
        <Outlet />
      </main>
      <footer className="bg-gray-800 p-4 text-center text-white">
        &copy; {new Date().getFullYear()} Your Brand. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayout;

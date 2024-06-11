/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from '@nextui-org/react';
import { IoLogOutOutline } from 'react-icons/io5';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { AcmeLogo } from './logo';

export default function AppNavbar() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="z-10 flex justify-between items-center gap-5 bg-transparent px-12 py-3 w-full">
      <div>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </div>

      <div className="flex justify-center gap-4">
        <div>
          <Link href="/">Booking</Link>
        </div>
      </div>
      <div className="justify-center">
        {user?.id ? (
          <div className="flex items-center gap-2">
            <p>{user?.fullName}</p>
            <IoLogOutOutline
              className="text-default-900 dark:text-white cursor-pointer"
              size={20}
              onClick={() => {
                localStorage.removeItem('userToken');
                window.location.reload();
              }}
            />
          </div>
        ) : (
          <div className="flex">
            <Link href="/sign-in">LogOut</Link>
          </div>
        )}
      </div>
    </div>
  );
}

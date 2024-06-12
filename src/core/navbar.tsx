/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Button, ButtonGroup, useDisclosure, User } from '@nextui-org/react';
import { IoLogOutOutline } from 'react-icons/io5';
import { RootState } from '@/redux/store';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import from react-router-dom

import { BsTable } from 'react-icons/bs';
import { AcmeLogo } from './logo';
import MyDesksModal from './my-desks-modal';

export default function AppNavbar() {
  const { user } = useSelector((state: RootState) => state.user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="z-10 flex justify-between items-center gap-5 bg-transparent px-12 py-3 w-full">
        <div>
          <AcmeLogo />
          <p className="font-bold text-inherit">ACME</p>
        </div>

        <div className="flex justify-center gap-4">
          {user?.id ? (
            <ButtonGroup>
              <Button variant="light">
                <Link className="dark:text-white" to="/">
                  Booking
                </Link>
              </Button>
              <Button variant="light">
                <Link className="dark:text-white" to="/reports">
                  Reports
                </Link>
              </Button>
              <Button variant="light" onClick={onOpen}>
                My assigned desks
              </Button>
            </ButtonGroup>
          ) : (
            <></>
          )}
        </div>
        <div className="flex justify-center">
          {user?.id ? (
            <div className="flex items-center gap-2">
              <User
                name={user ? `${user.firstName} ${user.lastName}` : t('empty')}
                description={user.email || t('empty')}
                avatarProps={{
                  src: `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0D8ABC&color=fff`
                }}
                classNames={{
                  description: 'text-default-900 dark:text-white'
                }}
                className="sm:flex hidden text-default-800 dark:text-white"
              />
              {/* <p>{user?.fullName}</p> */}
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
              <Link to="/sign-in">Sign in</Link>
            </div>
          )}
        </div>
      </div>
      {isOpen && <MyDesksModal onOpenChange={onOpenChange} isOpen={isOpen} />}
    </>
  );
}

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
      <div className="z-10 max-w-6xl m-auto min-w-[320px] flex justify-between items-center gap-5 max-sm:gap-3 max-[350px]:gap-1 bg-transparent max-sm:px-2 px-12 py-3 w-full">
        <div className="flex items-center">
          <AcmeLogo />
          <p className="font-bold text-inherit text-lg max-sm:hidden">ACME</p>
        </div>

        <div className="flex justify-center gap-4 max-sm:gap-2">
          {user?.id ? (
            <ButtonGroup>
              <Button
                as={Link}
                to="/"
                className="dark:text-white max-sm:px-3 max-[350px]:px-2"
                variant="light"
              >
                Booking
              </Button>
              <Button
                as={Link}
                to="/reports"
                className="dark:text-white max-sm:px-3 max-[350px]:px-2"
                variant="light"
              >
                Reports
              </Button>
              <Button
                className="max-sm:px-3 max-[350px]:px-2"
                variant="light"
                onClick={onOpen}
              >
                Settings
              </Button>
            </ButtonGroup>
          ) : (
            <></>
          )}
        </div>
        <div className="flex justify-center">
          {user?.id && (
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
          )}
        </div>
      </div>
      {isOpen && <MyDesksModal onOpenChange={onOpenChange} isOpen={isOpen} />}
    </>
  );
}

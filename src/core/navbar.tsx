/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, useDisclosure, User } from '@nextui-org/react';
import { IoLogOutOutline } from 'react-icons/io5';
import { RootState } from '@/redux/store';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import from react-router-dom
import { tokenizeImage } from '@/utils/functions/functions';

import { BsTable } from 'react-icons/bs';
import { AcmeLogo } from './logo';
import MyDesksModal from './my-desks-modal';

export default function AppNavbar() {
  const { user } = useSelector((state: RootState) => state.user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [photoUrl, setPhotoUrl] = useState<string>('');

  const fetchTokenizedImage = async (id: number) => {
    try {
      const tokenizedFile = await tokenizeImage({
        url: '',
        fileUrl: `${import.meta.env.VITE_BASE_URL}Files/${id}`
      });

      setPhotoUrl(tokenizedFile?.url || '');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // if (!user?.id) {
    //   localStorage.removeItem('userToken');
    //   window.location.reload();
    // }
    fetchTokenizedImage(user?.photoFileId);
  }, [user]);
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
              <Button
                as={Link}
                to="/"
                className="dark:text-white"
                variant="light"
              >
                Booking
              </Button>
              <Button
                as={Link}
                to="/reports"
                className="dark:text-white"
                variant="light"
              >
                Reports
              </Button>
              <Button variant="light" onClick={onOpen}>
                Settings
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
                  src: photoUrl
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

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Avatar,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  useDisclosure,
  User
} from '@nextui-org/react';
import { IoLogOutOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { RootState } from '@/redux/store';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'; // Import from react-router-dom
import { tokenizeImage } from '@/utils/functions/functions';

import { AcmeLogo } from './logo';
import MyDesksModal from './my-desks-modal';

export default function AppNavbar() {
  const { user } = useSelector((state: RootState) => state.user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { pathname } = useLocation();
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
    <Navbar className="gradient-bg">
      <div className="z-10 max-w-6xl m-auto md:min-w-[320px] flex justify-between items-center gap-5 max-sm:gap-3 max-[350px]:gap-1 bg-transparent px-1 py-3 w-full">
        <div className="flex items-center ">
          <AcmeLogo />
          <p className="font-bold text-inherit text-lg max-sm:hidden">ACME</p>
        </div>

        <div className=" justify-center gap-4 max-sm:gap-2 hidden md:flex">
          <ButtonGroup>
            <Button
              as={Link}
              to="/"
              className={`${
                pathname === '/' && !isOpen ? 'bg-[#333a4a]' : 'bg-transparent'
              } dark:text-white max-sm:px-3 max-[350px]:px-2`}
              variant="light"
            >
              Booking
            </Button>
            <Button
              as={Link}
              to="/reports"
              className={`${
                pathname === '/reports' && !isOpen
                  ? 'bg-[#333a4a]'
                  : 'bg-transparent'
              } dark:text-white max-sm:px-3 max-[350px]:px-2`}
              variant="light"
            >
              Reports
            </Button>
            <Button
              className={`${
                isOpen ? 'bg-[#333a4a]' : 'bg-transparent'
              } max-sm:px-3 max-[350px]:px-2`}
              variant="light"
              onClick={onOpen}
            >
              Settings
            </Button>
          </ButtonGroup>
        </div>

        <div className="justify-center hidden md:flex">
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
        </div>

        <div className="block md:hidden">
          <Dropdown>
            <DropdownTrigger>
              <Avatar isBordered src="" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="new"
                onClick={() => {
                  localStorage.removeItem('userToken');
                  window.location.reload();
                }}
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {isOpen && <MyDesksModal onOpenChange={onOpenChange} isOpen={isOpen} />}
    </Navbar>
  );
}

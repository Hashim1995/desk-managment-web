/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { RootState } from '@/redux/store';
import { tokenizeImage } from '@/utils/functions/functions';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip
} from '@nextui-org/react';
import { format, parseISO } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { IDesk } from './types';

interface DeskItemProps {
  desk: IDesk;
  selectedDesk: IDesk;
  setSelectedDesk: Dispatch<SetStateAction<IDesk>>;
  // eslint-disable-next-line no-unused-vars
}

function DeskItem({ desk, setSelectedDesk, selectedDesk }: DeskItemProps) {
  const { user } = useSelector((state: RootState) => state.user);
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
    desk?.ownerPhotoFileId &&
      fetchTokenizedImage(
        desk?.isBookedByMe ? user?.photoFileId : desk?.ownerPhotoFileId
      );
  }, [desk]);

  const style = {
    backgroundColor:
      desk?.ownerId === user?.id
        ? '#9353d3'
        : desk?.isBookedByMe
        ? '#006FEE'
        : !desk?.isBookedByMe && desk?.bookings?.length
        ? '#f31260'
        : desk?.ownerId && !desk?.isBookingAllowedByOwner
        ? '#f31260'
        : desk?.ownerId && !desk?.bookings?.length
        ? '#f5a524'
        : '#17c964',
    width: `${desk?.width}px`,
    height: `${desk?.height}px`,
    opacity:
      desk?.isBookedByMe || desk?.clientId === selectedDesk?.clientId
        ? '100%'
        : `${desk?.opacity}%`,
    // opacity: `${desk?.opacity}%`,
    transform: `translate3d(${desk.positionX}px, ${desk.positionY}px, 0)`
  };

  return (
    <Tooltip
      content={
        <Card
          shadow="none"
          className="bg-transparent border-none max-w-[300px]"
        >
          <div className="flex gap-3 px-3 py-1">
            <p className="font-semibold text-default-600 text-small">Desk:</p>
            <p className="text-default-500 text-small">{desk?.name}</p>
          </div>
          <CardHeader className="justify-between">
            {desk?.bookings?.length ? (
              <div className="flex gap-3">
                <Avatar isBordered radius="full" size="md" src={photoUrl} />
                <div className="flex flex-col justify-center items-start">
                  <h4 className="font-semibold text-default-600 text-small leading-none">
                    {desk?.bookings[0]?.bookedByName || '-'} 🎉
                  </h4>
                </div>
              </div>
            ) : desk?.ownerId && !desk?.isBookingAllowedByOwner ? (
              <div className="flex gap-3">
                <Avatar isBordered radius="full" size="md" src={photoUrl} />
                <div className="flex flex-col justify-center items-start">
                  <h4 className="font-semibold text-default-600 text-small leading-none">
                    Reserved for {desk?.ownerName || '-'} 🎉
                  </h4>
                </div>
              </div>
            ) : desk?.ownerId && !desk?.bookings?.length ? (
              <div className="flex gap-3">
                <Avatar
                  isBordered
                  radius="full"
                  className="object-cover"
                  size="md"
                  src={photoUrl}
                />
                <div className="flex flex-col justify-center items-start">
                  <h4 className="font-semibold text-default-600 text-small leading-none">
                    Assigned for {desk?.ownerName || '-'} 🎉
                  </h4>
                </div>
              </div>
            ) : (
              'No Booking - Available'
            )}
          </CardHeader>

          {desk?.bookings?.length ? (
            <CardFooter className="gap-1">
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between">
                  <p className="font-semibold text-default-600 text-small">
                    Start
                  </p>
                  <p className="text-default-500 text-small">
                    {' '}
                    {format(
                      parseISO(desk?.bookings[0]?.startDate),
                      'dd.MM.yyyy HH:mm'
                    )}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold text-default-600 text-small">
                    End
                  </p>
                  <p className="text-default-500 text-small">
                    {format(
                      parseISO(desk?.bookings[0]?.endDate),
                      'dd.MM.yyyy HH:mm'
                    )}
                  </p>
                </div>
              </div>
            </CardFooter>
          ) : null}
        </Card>
      }
    >
      <div
        aria-hidden
        onClick={() => {
          const isAlreadyBooked =
            desk?.bookings?.length > 0 && !desk?.isBookedByMe;
          const isOwnedByMe = desk?.ownerId === user?.id; // user?.id, mevcut kullanıcının ownerId'si
          const isOwnedByAnother = desk?.ownerId && desk?.ownerId !== user?.id;
          const isBookingAllowedByOwner = Boolean(
            desk?.isBookingAllowedByOwner
          );
          const isSameDeskSelected = desk?.clientId === selectedDesk?.clientId;
          // If the desk is already selected, toggle the selection (cancel it)
          if (isSameDeskSelected) {
            setSelectedDesk(null);
            return;
          }
          // If the desk is owned by another person and booking is not allowed, it cannot be selected
          if (isOwnedByAnother && !isBookingAllowedByOwner) {
            return;
          }
          // If the desk is owned by me, or it is owned by another person but booking is allowed, it can be selected
          if (isOwnedByMe || (isOwnedByAnother && isBookingAllowedByOwner)) {
            setSelectedDesk(desk);
            return;
          }
          // If the desk is owned by no one and has not been booked by someone else, it can be selected
          if (!desk?.ownerId && !isAlreadyBooked) {
            setSelectedDesk(desk);
          }
        }}
        style={style}
        className={`absolute animate__animated     cursor-pointer   rounded-full hover:backdrop-blur-xl flex items-center justify-center shadow-md text-white `}
      >
        <BsInfoCircleFill color={'white'} size={25} />
        {/* {desk?.isBookedByMe ? (
          <img
            alt=""
            className="rounded-full w-[30px] h-[30px]"
            src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0D8ABC&color=fff`}
          />
        ) : (
          <BsInfoCircleFill className="  " size={25} />
        )} */}
      </div>
    </Tooltip>
  );
}

export default DeskItem;

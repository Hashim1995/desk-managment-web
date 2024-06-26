/* eslint-disable no-return-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
import { RootState } from '@/redux/store';
import { tokenizeImage } from '@/utils/functions/functions';
import {
  Avatar,
  Card,
  CardFooter,
  CardHeader,
  Tooltip
} from '@nextui-org/react';
import { format, parseISO } from 'date-fns';
import { FaClock } from 'react-icons/fa';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// import { BsInfoCircleFill } from 'react-icons/bs';
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
  const [imageUrls, setImageUrls] = useState<{
    [key: number]: string;
  }>({});

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
  const fetchImageForBooking = async (bookingId: number) => {
    try {
      const tokenizedFile = await tokenizeImage({
        url: '',
        fileUrl: `${import.meta.env.VITE_BASE_URL}Files/${bookingId}`
      });
      setImageUrls(prevUrls => ({
        ...prevUrls,
        [bookingId]: tokenizedFile?.url || ''
      }));
    } catch (err) {
      console.error(
        'Error fetching tokenized image for booking:',
        bookingId,
        err
      );
      setImageUrls(prevUrls => ({ ...prevUrls, [bookingId]: '' }));
    }
  };
  useEffect(() => {
    desk?.bookings?.forEach(booking => {
      fetchImageForBooking(booking?.bookedUserPhotoId);
    });

    const photoFileId = desk?.isBookedByMe
      ? user?.photoFileId
      : desk?.bookings?.length
      ? desk?.bookings[0]?.bookedUserPhotoId
      : desk?.ownerPhotoFileId;
    if (photoFileId) {
      fetchTokenizedImage(photoFileId);
    }
  }, [desk]);

  const getBackgroundColor = (status: number) => {
    switch (status) {
      case 1:
      case 2:
      case 5:
      case 8:
        return '#006FEE'; // Blue
      case 3:
        return '#3f3f46'; // Gray
      case 4:
      case 9:
        return '#17c964'; // Green
      case 6:
        return '#f31260'; // Red
      case 7:
        return '#9b59b6'; // Purple
      default:
        return '#3f3f46'; // Default Gray
    }
  };

  const style = {
    backgroundColor: getBackgroundColor(desk?.status),
    width: `${desk?.width}px`,
    height: `${desk?.height}px`,
    opacity:
      desk?.isBookedByMe || desk?.deskId === selectedDesk?.deskId
        ? '100%'
        : `${desk?.opacity}%`,
    // opacity: `${desk?.opacity}%`,
    transform: `translate3d(${desk.positionX}px, ${desk.positionY}px, 0)`
  };

  const isClickable = (status: number): boolean =>
    [2, 4, 5, 7, 8, 9].includes(status);

  return (
    <Tooltip
      content={
        <div className="max-h-[400px] overflow-y-auto">
          {desk?.bookings?.length > 1 ? (
            desk?.bookings
              ?.sort(
                (a, b) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              )
              .map(W => (
                <Card
                  key={W?.bookingId}
                  shadow="none"
                  className="bg-transparent border-none w-[300px]"
                >
                  <CardHeader className="justify-between">
                    <div className="flex gap-3">
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={imageUrls[W.bookedUserPhotoId] || ''}
                      />
                      <div className="flex flex-col justify-center items-start">
                        <h4 className="font-semibold text-default-600 text-small leading-none">
                          {W?.bookedByName || '-'} 🎉
                        </h4>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="gap-1">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between">
                        <p className="font-semibold text-default-600 text-small">
                          Start
                        </p>
                        <p className="text-default-500 text-small">
                          {' '}
                          {format(parseISO(W?.startDate), 'dd.MM.yyyy')}{' '}
                          <strong className="text-default-800">
                            {' '}
                            {format(parseISO(W?.startDate), 'HH:mm')}
                          </strong>
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-semibold text-default-600 text-small">
                          End
                        </p>
                        <p className="text-default-500 text-small">
                          <p className="text-default-500 text-small">
                            {' '}
                            {format(parseISO(W?.endDate), 'dd.MM.yyyy')}{' '}
                            <strong className="text-default-800">
                              {' '}
                              {format(parseISO(W?.endDate), 'HH:mm')}
                            </strong>
                          </p>
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
          ) : (
            <Card
              shadow="none"
              className="bg-transparent border-none min-w-[200px]"
            >
              <div className="flex gap-3 px-3 py-1">
                <p className="font-semibold text-default-600 text-small">
                  Desk:
                </p>
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
                        <p className="text-default-500 text-small">
                          {' '}
                          {format(
                            parseISO(desk?.bookings[0]?.startDate),
                            'dd.MM.yyyy'
                          )}{' '}
                          <strong className="text-default-800">
                            {' '}
                            {format(
                              parseISO(desk?.bookings[0]?.startDate),
                              'HH:mm'
                            )}
                          </strong>
                        </p>
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold text-default-600 text-small">
                        End
                      </p>
                      <p className="text-default-500 text-small">
                        <p className="text-default-500 text-small">
                          {' '}
                          {format(
                            parseISO(desk?.bookings[0]?.endDate),
                            'dd.MM.yyyy'
                          )}{' '}
                          <strong className="text-default-800">
                            {' '}
                            {format(
                              parseISO(desk?.bookings[0]?.endDate),
                              'HH:mm'
                            )}
                          </strong>
                        </p>
                      </p>
                    </div>
                  </div>
                </CardFooter>
              ) : null}
            </Card>
          )}
        </div>
      }
    >
      <div
        aria-hidden
        onClick={() => {
          if (isClickable(desk.status)) {
            if (desk.deskId === selectedDesk?.deskId) {
              // If the desk is already selected, toggle the selection (cancel it)
              setSelectedDesk(null);
            } else {
              setSelectedDesk(desk);
            }
          }
        }}
        style={style}
        className={`absolute animate__animated     cursor-pointer   rounded-full hover:backdrop-blur-xl flex items-center justify-center shadow-md text-white `}
      >
        <FaClock size={25} />
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

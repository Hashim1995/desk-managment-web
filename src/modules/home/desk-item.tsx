/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { RootState } from '@/redux/store';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip
} from '@nextui-org/react';
import { Dispatch, SetStateAction, useState } from 'react';
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

  const style = {
    backgroundColor: desk?.backgroundColor,
    width: `${desk?.width}px`,
    height: `${desk?.height}px`,
    opacity:
      desk?.isBookedByMe || desk?.clientId === selectedDesk?.clientId
        ? '100%'
        : `${desk?.opacity}%`,
    // opacity: `${desk?.opacity}%`,
    transform: `translate3d(${desk.positionX}px, ${desk.positionY}px, 0)`
  };
  const [isFollowed, setIsFollowed] = useState(false);

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
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                />
                <div className="flex flex-col justify-center items-start">
                  <h4 className="font-semibold text-default-600 text-small leading-none">
                    {desk?.bookings[0]?.bookedByName || '-'} 🎉
                  </h4>
                </div>
              </div>
            ) : desk?.ownerId && !desk?.bookings?.length ? (
              `Assigned to ${desk?.ownerName}`
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
                    {desk?.bookings[0]?.startDate}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold text-default-600 text-small">
                    End
                  </p>
                  <p className="text-default-500 text-small">
                    {' '}
                    {desk?.bookings[0]?.endDate}
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
          if (
            (!desk?.isBookedByMe && desk?.bookings?.length) ||
            desk?.ownerId
          ) {
            return;
          }
          desk?.clientId === selectedDesk?.clientId
            ? setSelectedDesk(null)
            : setSelectedDesk(desk);
        }}
        style={style}
        className={`absolute animate__animated     cursor-pointer   rounded-full hover:backdrop-blur-xl flex items-center justify-center shadow-md text-white `}
      >
        <BsInfoCircleFill
          color={
            desk?.isBookedByMe
              ? 'blue'
              : !desk?.isBookedByMe && desk?.bookings?.length
              ? 'red'
              : desk?.ownerId && !desk?.bookings?.length
              ? 'orange'
              : 'white'
          }
          size={25}
        />
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

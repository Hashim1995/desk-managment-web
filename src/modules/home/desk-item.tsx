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
import { IDesk } from './types';

interface DeskItemProps {
  desk: IDesk;
  selectedDesk: IDesk;
  setSelectedDesk: Dispatch<SetStateAction<IDesk>>;
  // eslint-disable-next-line no-unused-vars
}

function DeskItem({ desk, setSelectedDesk, selectedDesk }: DeskItemProps) {
  const style = {
    backgroundColor: desk?.backgroundColor,
    width: `${desk?.width}px`,
    height: `${desk?.height}px`,
    opacity: `${desk?.opacity}%`,
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
          <CardHeader className="justify-between">
            <div className="flex gap-3">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="https://i.pravatar.cc/150?u=a04258114e29026702d"
              />
              <div className="flex flex-col justify-center items-start">
                <h4 className="font-semibold text-default-600 text-small leading-none">
                  {desk?.ownerName}
                </h4>
                <h5 className="text-default-500 text-small tracking-tight">
                  {desk?.ownerName}
                </h5>
              </div>
            </div>
            <Button
              className={
                isFollowed
                  ? 'bg-transparent text-foreground border-default-200'
                  : ''
              }
              color="primary"
              radius="full"
              size="sm"
              variant={isFollowed ? 'bordered' : 'solid'}
              onPress={() => setIsFollowed(!isFollowed)}
            >
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
          </CardHeader>
          <CardBody className="px-3 py-0">
            <p className="pl-px text-default-500 text-small">
              Full-stack developer, @getnextui lover she/her
              <span aria-label="confetti" role="img">
                🎉
              </span>
            </p>
          </CardBody>
          <CardFooter className="gap-3">
            <div className="flex gap-1">
              <p className="font-semibold text-default-600 text-small">4</p>
              <p className="text-default-500 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-600 text-small">97.1K</p>
              <p className="text-default-500 text-small">Followers</p>
            </div>
          </CardFooter>
        </Card>
      }
    >
      <div
        aria-hidden
        onClick={() => setSelectedDesk(desk)}
        style={style}
        className={`absolute   cursor-pointer ${
          desk?.clientId === selectedDesk?.clientId
            ? 'border-2 border-blue-500'
            : ''
        }  rounded-full hover:backdrop-blur-xl flex items-center justify-center shadow-md text-white `}
      >
        <BsInfoCircleFill className="  " size={25} />
      </div>
    </Tooltip>
  );
}

export default DeskItem;

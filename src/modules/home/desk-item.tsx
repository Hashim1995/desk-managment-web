import { IDesk } from './types';

interface DeskItemProps {
  desk: IDesk;

  // eslint-disable-next-line no-unused-vars
}

function DeskItem({ desk }: DeskItemProps) {
  const style = {
    backgroundColor: desk?.backgroundColor,
    width: `${desk?.width}px`,
    height: `${desk?.height}px`,
    opacity: `${desk?.opacity}%`,
    transform: `translate3d(${desk.positionX}px, ${desk.positionY}px, 0)`
  };

  return (
    <div
      style={style}
      className={`absolute  rounded-full flex items-center justify-center shadow-md text-white `}
    />
  );
}

export default DeskItem;

import { CiViewList } from 'react-icons/ci';
import { FaChartLine } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@nextui-org/react';
import MyDesksModal from './my-desks-modal';

function MobileBottomNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const navbarLinks = [
    {
      id: 1,
      label: 'Booking',
      icon: (
        <CiViewList
          className={`w-6 h-6 ${
            pathname === '/' && !isOpen ? 'opacity-100' : 'opacity-60'
          }`}
        />
      ),
      link: '/'
    },
    {
      id: 2,
      label: 'Reports',
      icon: (
        <FaChartLine
          className={`w-6 h-6 ${
            pathname === '/reports' && !isOpen ? 'opacity-100' : 'opacity-60'
          }`}
        />
      ),
      link: '/reports'
    },
    {
      id: 3,
      label: 'Settings',
      icon: (
        <IoSettingsOutline
          className={`w-6 h-6 ${isOpen ? 'opacity-100' : 'opacity-60'}`}
        />
      ),
      link: null
    }
  ];

  return (
    <div className="bottom-0 z-10 sticky flex justify-between items-center gap-4 md:hidden bg-[#202735] px-8 py-2 border-t-1 border-blue200 w-full">
      {navbarLinks.map(item => (
        <div
          key={item?.id}
          aria-hidden
          className="flex flex-col items-center gap-1"
          onClick={() => {
            if (item?.link) {
              navigate(item?.link);
            } else {
              !isOpen && onOpen();
            }
          }}
        >
          {item?.icon}
          <span
            className={`text-xs select-none ${
              pathname === item?.link
                ? 'text-white'
                : 'text-[rgba(255,255,255,0.38)]'
            } `}
          >
            {item?.label}
          </span>
        </div>
      ))}
      {isOpen && <MyDesksModal onOpenChange={onOpenChange} isOpen={isOpen} />}
    </div>
  );
}

export default MobileBottomNavigation;

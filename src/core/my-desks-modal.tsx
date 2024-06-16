import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  Spinner,
  Listbox,
  ListboxItem,
  Switch
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { IOwnedDesks } from '@/modules/home/types';
import Empty from '@/components/layout/empty';

interface IMyDesksModal {
  isOpen: boolean;
  onOpenChange: () => void;
}

function MyDesksModal({ isOpen, onOpenChange }: IMyDesksModal) {
  const [loading, setLoading] = useState(true);
  const [myDesks, setMyDesks] = useState<IOwnedDesks[]>([]);

  async function getMyDesks() {
    try {
      const res = await RoomsService.getInstance().getMyDesks();
      if (res?.length) {
        setMyDesks(res);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  async function swtichStatus(id: number) {
    setLoading(true);
    try {
      await RoomsService.getInstance().switchMyDeskStatus(id);
      getMyDesks();
      window?.location?.reload();
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    getMyDesks();
  }, []);
  return (
    <div className="z-50">
      <Modal
        size="lg"
        isDismissable={false}
        backdrop="opaque"
        className="centerModalOnMobile"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1 pr-10 text-default-800 dark:text-white">
              Settings
            </ModalHeader>
            <Divider className="mb-6" />

            <ModalBody className="text-default-800 dark:text-white">
              {!loading ? (
                <div className="border-default-200 border-small dark:border-default-100 px-1 py-2 rounded-small w-full">
                  {myDesks?.length ? (
                    <Listbox aria-label="Actions">
                      {myDesks?.map((z: IOwnedDesks) => (
                        <ListboxItem key={z?.deskId}>
                          <div className="flex justify-between items-center gap-1">
                            <p className="w-1/2">Room name:</p>
                            <p className="w-1/2">{z?.roomName}</p>
                          </div>
                          <div className="flex justify-between items-center gap-1">
                            <p className="w-1/2">Desk name:</p>
                            <p className="w-1/2">{z?.name}</p>
                          </div>
                          <div className="flex justify-between items-center gap-1 mt-2">
                            <p className="w-1/2">Allow for book:</p>
                            <p className="w-1/2">
                              <Switch
                                size="sm"
                                onChange={() => swtichStatus(z?.deskId)}
                                defaultSelected={z?.isBookingAllowedByOwner}
                                aria-label="Automatic updates"
                              />
                            </p>
                          </div>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  ) : (
                    <Empty />
                  )}
                </div>
              ) : (
                <Spinner size="lg" />
              )}
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default MyDesksModal;

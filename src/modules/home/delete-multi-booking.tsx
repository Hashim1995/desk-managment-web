/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import { useTranslation } from 'react-i18next';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Card,
  CardFooter,
  CardHeader
} from '@nextui-org/react';
import { format, parseISO } from 'date-fns';
import AppHandledSolidButton from '@/components/forms/button/app-handled-solid-button';
import AppHandledBorderedButton from '@/components/forms/button/app-handled-bordered-button';
import { Dispatch, SetStateAction, useState } from 'react';
import { RoomsService } from '@/services/rooms-services/rooms-services';
import { IDesk } from './types';

interface IDeleteMultiBookingModal {
  isOpen: boolean;
  selectedDesk: IDesk;
  onOpenChange: () => void;
  setRefreshComponent: Dispatch<SetStateAction<boolean>>;
  deleteMultiBookingOnClose: () => void;
}

function DeleteMultiBookingModal({
  isOpen,
  onOpenChange,
  selectedDesk,
  setRefreshComponent,
  deleteMultiBookingOnClose
}: IDeleteMultiBookingModal) {
  const { t } = useTranslation();
  const [btnLoading, setbtnLoading] = useState(false);

  async function cancelDesk(cancelId: number) {
    setbtnLoading(true);
    try {
      const res = await RoomsService.getInstance().cancelDesk(cancelId);
      if (res) {
        setRefreshComponent(c => !c);
        deleteMultiBookingOnClose();
      }
    } catch (err) {
      console.log(err);
    }
    setbtnLoading(false);
  }

  return (
    <div>
      <Modal
        size="lg"
        isDismissable={false}
        backdrop="opaque"
        className="centerModalOnMobile"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1 pr-10 text-default-800 dark:text-white">
                Delete
              </ModalHeader>
              <Divider className="mb-6" />

              <ModalBody className="text-default-800 dark:text-white">
                {selectedDesk?.bookings?.length > 1
                  ? selectedDesk?.bookings?.map(W =>
                      W?.isBookedByMe ? (
                        <Card
                          key={W?.bookingId}
                          shadow="none"
                          className="bg-transparent border-none w-[300px]"
                        >
                          <CardHeader className="justify-between">
                            <div className="flex gap-3">
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
                                  {format(
                                    parseISO(W?.startDate),
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
                                    parseISO(W?.endDate),
                                    'dd.MM.yyyy HH:mm'
                                  )}
                                </p>
                              </div>

                              <AppHandledSolidButton
                                size="sm"
                                isLoading={btnLoading}
                                color="danger"
                                radius="none"
                                type="submit"
                                onClick={() => {
                                  cancelDesk(W?.bookingId);
                                }}
                              >
                                Cancel - {selectedDesk?.name}
                              </AppHandledSolidButton>
                            </div>
                          </CardFooter>
                        </Card>
                      ) : null
                    )
                  : null}
              </ModalBody>
              <ModalFooter>
                <AppHandledBorderedButton
                  buttonProps={{
                    title: 'Close Modal',
                    'aria-label': 'Close Modal'
                  }}
                  onPress={onClose}
                >
                  {t('closeBtn')}
                </AppHandledBorderedButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default DeleteMultiBookingModal;

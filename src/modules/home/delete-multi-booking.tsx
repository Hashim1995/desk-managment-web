import { useTranslation } from 'react-i18next';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider
} from '@nextui-org/react';
import AppHandledBorderedButton from '@/components/forms/button/app-handled-bordered-button';

interface IDeleteMultiBookingModal {
  isOpen: boolean;
  onOpenChange: () => void;
}

function DeleteMultiBookingModal({
  isOpen,
  onOpenChange
}: IDeleteMultiBookingModal) {
  const { t } = useTranslation();

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
                Delete booking
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

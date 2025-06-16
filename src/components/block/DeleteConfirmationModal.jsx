import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, description }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title || "Confirm Deletion"}</ModalHeader>
            <ModalBody>
              <p>{description || "Are you sure you want to delete this item? This action is permanent and cannot be undone."}</p>
            </ModalBody>
            <ModalFooter>
              <Button size="sm" className="bg-black text-white" onPress={close}>
                Cancel
              </Button>
              <Button isLoading={loading} onPress={handleConfirm} isDisabled={loading} size="sm" className="bg-red-600 text-white">
                Delete Permanently
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;

import React, { useState } from 'react';
import Modal from './Modal'; // Assuming Modal component is in the same directory

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmDisabled = confirmText.toLowerCase() !== 'delete';

  const handleConfirm = () => {
    if (confirmText.toLowerCase() === 'delete') {
      onConfirm();
      setConfirmText(''); // Clear input after confirmation
    }
  };

  const handleClose = () => {
    setConfirmText(''); // Clear input on close
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Konfirmasi Hapus ${itemName || 'Data'}`}>
      <div className="p-4">
        <p className="mb-4">
          Untuk mengonfirmasi penghapusan, ketik "delete" di bawah ini:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
          placeholder="ketik 'delete' di sini"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`px-4 py-2 rounded-md transition ${
              isConfirmDisabled
                ? 'bg-red-300 text-white cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;

// components/DialogBox/DialogBox.js
import React from 'react';
import InputForm from '../InputForm/InputForm';

const DialogBox = ({ isOpen, onClose, onSubmit }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="bg-white rounded-lg p-8 z-50">
        <InputForm onSubmit={onSubmit} />
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
          Close
        </button>
      </div>
    </div>
  );
};

export default DialogBox;

// client/src/components/MessageBox.jsx
import React from 'react';

function MessageBox({ title, message, onConfirm, onCancel, showCancel = true }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          {showCancel && (
            <button
              onClick={onCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className="btn btn-danger"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
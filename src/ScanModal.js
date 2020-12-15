import { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function ScanModal({ scan, header, isOpen, onSubmit, onClose }) {
  const [edited, setEdited] = useState(scan);

  useEffect(() => {
    setEdited(scan);
  }, [scan]);

  function handleValueChange(property) {
    return function (e) {
      const newScan = { ...edited };
      newScan[property] = e.target.value;
      setEdited(newScan);
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit && onSubmit(edited);
  }

  return (
    <Modal
      isOpen={isOpen}
      className="modal"
      onRequestClose={onClose}
      contentLabel="Example Modal"
    >
      <div className="modal__header">
        <h3 className="text-3xl font-semibold">
          {header}
        </h3>
        <button
          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          onClick={onClose}
        >
          <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
            ×
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="relative p-6 flex-auto">
          <input type="text" value={edited.title} className="input" onChange={handleValueChange('title')} /><br/>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
          <button
            className="btn btn-red mr-2"
            type="button"
            style={{ transition: "all .15s ease" }}
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="btn btn-green"
            type="submit"
            style={{ transition: "all .15s ease" }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}

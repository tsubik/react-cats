import { useState, useEffect } from 'react';
import Modal from 'react-modal';

import Button from './Button';

export default function CatModal({ cat, header, isOpen, onSubmit, onClose }) {
  const [edited, setEdited] = useState(cat);

  useEffect(() => {
    setEdited(cat);
  }, [cat]);

  function handleValueChange(property) {
    return function (e) {
      const newCat = { ...edited };
      newCat[property] = e.target.value;
      setEdited(newCat);
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
          <label className="block">
            <span className="text-gray-700">Name</span>
            <input type="text" value={edited.name} className="input block" onChange={handleValueChange('name')} /><br/>
          </label>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
          <Button
            color="red"
            type="button"
            className="mr-2"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            color="green"
            type="submit"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

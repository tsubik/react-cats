import { useState } from 'react';

export default function ScanForm({ scan, onSubmit }) {
  const [edited, setEdited] = useState(scan);

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
    <form onSubmit={handleSubmit} noValidate>
      <input type="text" value={edited.title} className="input" onChange={handleValueChange('title')} /><br/>

      <button type="submit" className="btn btn-blue">
        Save
      </button>
    </form>
  );
}

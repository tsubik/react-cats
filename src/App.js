import './index.css';

import { useEffect, useState } from 'react';
import Modal from 'react-modal';

function fetchScans(filter) {
  const searchParams = new URLSearchParams();
  if (filter) {
    searchParams.append('filter', JSON.stringify({ q: filter }));
  }
  console.log('searchParams', searchParams.toString());
  return fetch('http://localhost:3000/scans?' + searchParams).then(res => res.json());
}

function updateScan(scan) {
  return fetch(`http://localhost:3000/scans/${scan.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(scan)
  });
}

function createScan(scan) {
  return fetch(`http://localhost:3000/scans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(scan)
  });
}

Modal.setAppElement('#root');

function ScanForm({ scan, onSubmit }) {
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

function App() {
  const [filter, setFilter] = useState('');
  const [scans, setScans] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [newScan, setNewScan] = useState({});
  const [editedScan, setEditedScan] = useState();

  useEffect(() => {
    updateList();
  }, [])

  async function updateList(filter) {
    const data = await fetchScans(filter);
    setScans(data);
  }

  function closeModal(){
    setEditOpen(false);
    setNewOpen(false);
  }

  function openEditModal(scan) {
    setEditedScan(scan);
    setEditOpen(true);
  }

  function handleSearch(e) {
    e.preventDefault();
    updateList(filter);
  }

  async function handleEdit(scan) {
    await updateScan(scan);
    updateList();
    setEditOpen(false);
  }

  async function handleNew(scan) {
    await createScan(scan);
    updateList();
    setNewOpen(false);
  }

  async function handleAdd() {
    setNewScan({});
    setNewOpen(true);
  }

  return (
    <div className="container">
      <form onSubmit={handleSearch} noValidate className="p-2 bg-gray-300 rounded">
        <label>
          Filter:
        </label>
        <input type="text" className="ml-3 input" value={filter} onChange={(e) => setFilter(e.target.value)} />

        <button type="submit" className="ml-3 btn btn-blue">
          Search
        </button>
      </form>

      {scans.map((scan) => (
        <div className="p-2 my-2 border border-gray-700 shadow-lg rounded" onClick={openEditModal.bind(this, scan)}>
          {scan.title}
        </div>
      ))}

      <button type="button" className="btn btn-blue" onClick={handleAdd}>
        Add new
      </button>

      {editedScan && (
        <Modal
          isOpen={editOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
        >
          <h2>Edit Scan</h2>
          <button onClick={closeModal}>close</button>
          <ScanForm scan={editedScan} onSubmit={handleEdit} />
        </Modal>
      )}

      {newScan && (
        <Modal
          isOpen={newOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
        >
          <h2>New Scan</h2>
          <button onClick={closeModal}>close</button>
          <ScanForm scan={newScan} onSubmit={handleNew} />
        </Modal>
      )}
    </div>
  );
}

export default App;

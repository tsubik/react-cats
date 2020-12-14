import './index.css';

import { useEffect, useState } from 'react';
import Modal from 'react-modal';

function fixedEncode(str) {
  return str.replace('-', '%2C');
}

function fetchScans(filter, sortBy, page, perPage) {
  const searchParams = new URLSearchParams();
  if (filter) {
    searchParams.append('filter', JSON.stringify({ q: filter }));
  }
  if (sortBy) {
    searchParams.append('sort', JSON.stringify(sortBy.split('_')))
  }
  const headers = new Headers();
  if (page && perPage) {
    const rangeStart = (page - 1) * perPage;
    const rangeEnd = rangeStart + perPage - 1;
    const rangeString = `[${rangeStart}-${rangeEnd}]`;
    searchParams.append('range', rangeString);

    headers.append('Range', `scans=${rangeString}`)
  }
  const queryString = fixedEncode(searchParams.toString());
  console.log('searchParams', queryString);
  return fetch('http://localhost:3000/scans?' + queryString, { headers })
    .then(async res => {
      console.log('fetch response headers', res.headers);
      const data = await res.json();

      return {
        data
      };
    });
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

function removeScan(scanId) {
  return fetch(`http://localhost:3000/scans/${scanId}`, { method: 'DELETE' });
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

const sortOptions = {
  'title_desc': 'Title Descending',
  'title_asc': 'Title Ascending'
}

function App() {
  const [scans, setScans] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [newScan, setNewScan] = useState({});

  const [editedScan, setEditedScan] = useState();

  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('title_desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [showLoadMore, setShowLoadMore] = useState(true);

  useEffect(() => {
    updateList({ filter, sortBy, page, perPage });
  }, [])

  async function updateList({ filter, sortBy, page, perPage }) {
    const results = await fetchScans(filter, sortBy, page, perPage);
    setScans(results.data);
  }

  function refreshList() {
    updateList({ filter, sortBy, page, perPage })
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
    updateList({ filter, sortBy, page, perPage });
  }

  async function handleEdit(scan) {
    await updateScan(scan);
    refreshList();
    setEditOpen(false);
  }

  async function handleNew(scan) {
    await createScan(scan);
    refreshList();
    setNewOpen(false);
  }

  async function handleAdd() {
    setNewScan({});
    setNewOpen(true);
  }

  function handleSortByChange(e) {
    setSortBy(e.target.value);
  }

  function handlePerPageChange(e) {
    setPerPage(e.target.value);
  }

  async function handleScanRemove(scanId, e) {
    e.stopPropagation();
    await removeScan(scanId);
    setScans(scans.filter(s => s.id !== scanId));
  }

  return (
    <div className="container">
      <form
        onSubmit={handleSearch}
        noValidate
        className="p-2 bg-gray-300 rounded flex items-center space-x-3"
      >
        <label>
          Filter:
        </label>
        <input type="text" className="ml-3 input" value={filter} onChange={(e) => setFilter(e.target.value)} />

        <label htmlFor="sortby">
          Sort By:
        </label>
        <select name="sortby" id="sortby" value={sortBy} onChange={handleSortByChange}>
          {Object.keys(sortOptions).map((key) => (
            <option key={key} value={key}>{sortOptions[key]}</option>
          ))}
        </select>

        <label htmlFor="perpage">
          Per page:
        </label>
        <select name="perpage" id="perpage" value={perPage} onChange={handlePerPageChange}>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>

        <button type="submit" className="ml-3 btn btn-blue">
          Search
        </button>
      </form>

      <button type="button" className="btn btn-blue" onClick={handleAdd}>
        Add new
      </button>

      {scans.map((scan) => (
        <div key={scan.id} className="flex justify-between items-center p-2 my-2 border border-gray-700 shadow-lg rounded" onClick={openEditModal.bind(this, scan)}>
          <div>
            {scan.title}
          </div>
          <button type="button" className="btn btn-red" onClick={handleScanRemove.bind(this, scan.id)}>
            Remove
          </button>
        </div>
      ))}

      {showLoadMore && (
        <button type="button" className="btn btn-blue">
          Load more
        </button>
      )}

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

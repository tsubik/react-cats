import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Modal from 'react-modal';

import ScanForm from './ScanForm';

import scanService from './scan';

const sortOptions = {
  'title_desc': 'Title Descending',
  'title_asc': 'Title Ascending'
};

export default function List() {
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
    const results = await scanService.fetchAll(filter, sortBy, page, perPage);
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
    refreshList();
  }

  async function handleEdit(scan) {
    await scanService.updateScan(scan);
    refreshList();
    setEditOpen(false);
  }

  async function handleNew(scan) {
    await scanService.createScan(scan);
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
    await scanService.removeScan(scanId);
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

import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import ScanModal from './ScanModal';
import Button from './Button';
import Card from './Card';

import scanService from './scan';

const sortOptions = {
  'title_desc': 'Title Descending',
  'title_asc': 'Title Ascending',
  'id_asc': 'Id Ascending'
};

export default function List() {
  const [scans, setScans] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [newScan, setNewScan] = useState({});

  const [editedScan, setEditedScan] = useState();

  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('id_asc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [showLoadMore, setShowLoadMore] = useState(true);

  useEffect(() => {
    updateList({ filter, sortBy, page, perPage });
  }, [])

  useEffect(() => {
    setPage(1);
    updateList({ filter, sortBy, page: 1, perPage });
  }, [perPage]);

  async function updateList({ filter, sortBy, page, perPage }, reset = true) {
    const results = await scanService.fetchAll(filter, sortBy, page, perPage);

    if (reset) {
      setScans(results.data);
    } else {
      setScans((scans) => [...scans, ...results.data]);
    }

    setShowLoadMore(results.hasMore);
  }

  function refreshList() {
    const takePage = page === 1 ? page : 1;
    const takePerPage = page === 1 ? perPage : (page + 1) * perPage;

    updateList({ filter, sortBy, page: takePage, perPage: takePerPage })
  }

  function openEditModal(scan) {
    setEditedScan(scan);
    setEditOpen(true);
  }

  function handleSearch(e) {
    e.preventDefault();
    refreshList();
  }

  async function handleLoadMore() {

    updateList({ filter, sortBy, page: page + 1, perPage }, false);
    setPage((p) => p + 1);
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
    refreshList();
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

        <Button type="submit" color="blue" className="ml-3">
          Search
        </Button>
      </form>

      <button type="button" className="btn btn-blue" onClick={handleAdd}>
        Add new
      </button>

      <div className="grid grid-cols-3 gap-2">
        {scans.map((scan) => (
          <Card key={scan.id} onClick={openEditModal.bind(this, scan)}>
            <div>
              {scan.id}: {scan.title}
            </div>
            <button type="button" className="btn btn-red" onClick={handleScanRemove.bind(this, scan.id)}>
              Remove
            </button>
          </Card>
        ))}
      </div>

      {showLoadMore && (
        <button type="button" className="btn btn-blue" onClick={handleLoadMore}>
          Load more
        </button>
      )}

      {editedScan && <ScanModal header="Edit scan" isOpen={editOpen} scan={editedScan} onClose={() => setEditOpen(false)} onSubmit={handleEdit} />}
      {newScan && <ScanModal header="New scan" isOpen={newOpen} scan={newScan} onClose={() => setNewOpen(false)} onSubmit={handleNew} />}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

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
  const [editOpen, setEditOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [newScan, setNewScan] = useState({});

  const [editedScan, setEditedScan] = useState();

  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('id_asc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const queryClient = useQueryClient();

  const { data } = useQuery(
    ['scans', { filter, sortBy, page, perPage }],
    async () => {
      return scanService.fetchAll(filter, sortBy, page, perPage);
    }
  );
  const { data: scans, hasMore: showLoadMore } = data || {
    data: [],
    hasMore: false
  };

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  function openEditModal(scan) {
    setEditedScan(scan);
    setEditOpen(true);
  }

  async function handleLoadMore() {
    setPage((p) => p + 1);
  }

  function refreshList() {
    queryClient.invalidateQueries('scans');
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
      <div
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
      </div>

      <Button color="blue" onClick={handleAdd}>
        Add New
      </Button>

      <div className="grid grid-cols-2 gap-2">
        {scans.map((scan) => (
          <Card key={scan.id} onClick={openEditModal.bind(this, scan)}>
            <div>
              {scan.id}: {scan.title}
            </div>
            <Button color="red" onClick={handleScanRemove.bind(this, scan.id)}>
              Remove
            </Button>
          </Card>
        ))}
      </div>

      {showLoadMore && (
        <Button color="blue" onClick={handleLoadMore}>
          Load more
        </Button>
      )}

      {editedScan && <ScanModal header="Edit scan" isOpen={editOpen} scan={editedScan} onClose={() => setEditOpen(false)} onSubmit={handleEdit} />}
      {newScan && <ScanModal header="New scan" isOpen={newOpen} scan={newScan} onClose={() => setNewOpen(false)} onSubmit={handleNew} />}
    </div>
  );
}

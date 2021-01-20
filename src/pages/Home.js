import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useToasts } from 'react-toast-notifications';

import CatModal from 'components/CatModal';
import Button from 'components/Button';
import Card from 'components/Card';

import catService from 'cat';

import { useDebounce } from 'hooks';

const sortOptions = {
  'name_desc': 'Name Z-A Descending',
  'name_asc': 'Name A-Z',
  'id_desc': 'Newest first'
};

export default function Home() {
  const [editOpen, setEditOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [newCat, setNewCat] = useState({});

  const [editedCat, setEditedCat] = useState();

  const [filterValue, setFilterValue] = useState('');
  const [sortBy, setSortBy] = useState('id_desc');
  const [perPage, setPerPage] = useState(6);
  const [cats, setCats] = useState([]);

  const filter = useDebounce(filterValue, 500);

  const queryClient = useQueryClient();
  const { addToast } = useToasts()

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['cats', { filter, sortBy, perPage }], async ({ pageParam = 1 }) => {
    const data = await catService.fetchAll(filter, sortBy, pageParam, perPage);

    return {
      ...data,
      page: pageParam
    };
  }, {
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return; // no more pages

      return lastPage.page + 1;
    },
    onSuccess: (data) => {
      const s = (data && data.pages.reduce((acc, page) => [...acc, ...page.data], [])) || [];
      setCats(s);
    }
  })

  function openEditModal(cat) {
    setEditedCat(cat);
    setEditOpen(true);
  }

  async function handleLoadMore() {
    fetchNextPage();
  }

  function refreshList() {
    queryClient.invalidateQueries('cats');
  }

  async function handleEdit(cat) {
    await catService.updateCat(cat);
    refreshList();
    setEditOpen(false);
    addToast('Saved Successfully', { appearance: 'success' })
  }

  async function handleNew(cat) {
    await catService.createCat(cat);
    refreshList();
    setNewOpen(false);
    addToast('New Cat Saved Successfully', { appearance: 'success' })
  }

  async function handleAdd() {
    setNewCat({});
    setNewOpen(true);
  }

  async function handleCatRemove(catId, e) {
    e.stopPropagation();
    await catService.removeCat(catId);
    refreshList();
  }

  return (
    <div className="container">
      <div
        className="flex items-center space-x-3 my-5"
      >
        <label className="block">
          <span className="text-gray-700">Filter</span>
          <input type="text" className="input block" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-gray-700">Sort By</span>
          <select className="select block" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {Object.keys(sortOptions).map((key) => (
              <option key={key} value={key}>{sortOptions[key]}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">Per page</span>
          <select className="select block w-24" value={perPage} onChange={(e) => setPerPage(e.target.value)}>
            <option value="6">6</option>
            <option value="12">12</option>
          </select>
        </label>
      </div>

      <Button color="green" className="block mx-auto my-5" onClick={handleAdd}>
        Add New
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cats.map((cat) => (
          <Card className="cursor-pointer" key={cat.id} onClick={openEditModal.bind(this, cat)}>
            <img src={cat.image} className="object-cover rounded-full h-40 w-40" alt="Cat avatar" />
            <p>{cat.name}</p>
            <Button color="red" onClick={handleCatRemove.bind(this, cat.id)}>
              Remove
            </Button>
          </Card>
        ))}
      </div>

      {hasNextPage && (
        <Button color="blue" className="block mx-auto my-5" onClick={handleLoadMore}>
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </Button>
      )}

      {editedCat && <CatModal header="Edit cat" isOpen={editOpen} cat={editedCat} onClose={() => setEditOpen(false)} onSubmit={handleEdit} />}
      {newCat && <CatModal header="New cat" isOpen={newOpen} cat={newCat} onClose={() => setNewOpen(false)} onSubmit={handleNew} />}
    </div>
  );
}

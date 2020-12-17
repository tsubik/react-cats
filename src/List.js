import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';

import CatModal from './CatModal';
import Button from './Button';
import Card from './Card';

import catService from './cat';

import { useDebounce } from './hooks';

const sortOptions = {
  'title_desc': 'Title Descending',
  'title_asc': 'Title Ascending',
  'id_asc': 'Id Ascending'
};

export default function List() {
  const [editOpen, setEditOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [newCat, setNewCat] = useState({});

  const [editedCat, setEditedCat] = useState();

  const [filterValue, setFilterValue] = useState('');
  const [sortBy, setSortBy] = useState('id_asc');
  const [perPage, setPerPage] = useState(6);
  const [cats, setCats] = useState([]);

  const filter = useDebounce(filterValue, 500);

  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
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

  console.log('CATS', {
    cats,
    isFetching,
    status
  });

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
  }

  async function handleNew(cat) {
    await catService.createCat(cat);
    refreshList();
    setNewOpen(false);
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
        className="p-2 bg-gray-300 rounded flex items-center space-x-3"
      >
        <label>
          Filter:
        </label>
        <input type="text" className="ml-3 input" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />

        <label htmlFor="sortby">
          Sort By:
        </label>
        <select name="sortby" id="sortby" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {Object.keys(sortOptions).map((key) => (
            <option key={key} value={key}>{sortOptions[key]}</option>
          ))}
        </select>

        <label htmlFor="perpage">
          Per page:
        </label>
        <select name="perpage" id="perpage" value={perPage} onChange={(e) => setPerPage(e.target.value)}>
          <option value="6">6</option>
          <option value="12">12</option>
        </select>
      </div>

      <Button color="blue" onClick={handleAdd}>
        Add New
      </Button>

      <div className="grid grid-cols-3 gap-2">
        {cats.map((cat) => (
          <Card key={cat.id} onClick={openEditModal.bind(this, cat)}>
            <img src={cat.image} className="object-cover rounded-full h-40 w-40" alt="Cat avatar" />
            <p>{cat.name}</p>
            <Button color="red" onClick={handleCatRemove.bind(this, cat.id)}>
              Remove
            </Button>
          </Card>
        ))}
      </div>

      {hasNextPage && (
        <Button color="blue" onClick={handleLoadMore}>
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </Button>
      )}

      {editedCat && <CatModal header="Edit cat" isOpen={editOpen} cat={editedCat} onClose={() => setEditOpen(false)} onSubmit={handleEdit} />}
      {newCat && <CatModal header="New cat" isOpen={newOpen} cat={newCat} onClose={() => setNewOpen(false)} onSubmit={handleNew} />}
    </div>
  );
}

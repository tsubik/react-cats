function fixedEncode(str) {
  return str.replace('-', '%2C');
}

const cat = {
  fetchAll: function (filter, sortBy, page, perPage)  {
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

      headers.append('Range', `cats=${rangeString}`)
    }

    const queryString = fixedEncode(searchParams.toString());
    console.log('searchParams', queryString);
    return fetch('http://localhost:3000/cats?' + queryString, { headers })
      .then(async res => {
        const rangeString = res.headers.get('Content-Range').replace('items ', '');
        const [fetchedRange, totalCount] = rangeString.split('/');
        const data = await res.json();

        const results = {
          data,
          fetchedRange,
          totalCount,
          hasMore: Number(fetchedRange.split('-')[1]) + 1 < Number(totalCount)
        };
        return results;
      });
  },

  updateCat: function (cat) {
    return fetch(`http://localhost:3000/cats/${cat.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cat)
    });
  },

  createCat: function (cat) {
    return fetch(`http://localhost:3000/cats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cat)
    });
  },

  removeCat: function (catId) {
    return fetch(`http://localhost:3000/cats/${catId}`, { method: 'DELETE' });
  }
};

export default cat;

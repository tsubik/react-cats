function fixedEncode(str) {
  return str.replace('-', '%2C');
}

const scan = {
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

      headers.append('Range', `scans=${rangeString}`)
    }

    const queryString = fixedEncode(searchParams.toString());
    console.log('searchParams', queryString);
    return fetch('http://localhost:3000/scans?' + queryString, { headers })
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

        console.log('Fetching scans', results);

        return results;
      });
  },

  updateScan: function (scan) {
    return fetch(`http://localhost:3000/scans/${scan.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scan)
    });
  },

  createScan: function (scan) {
    return fetch(`http://localhost:3000/scans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scan)
    });
  },

  removeScan: function (scanId) {
    return fetch(`http://localhost:3000/scans/${scanId}`, { method: 'DELETE' });
  }
};

export default scan;

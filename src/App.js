import './index.css';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import Modal from 'react-modal';

import List from './List';

Modal.setAppElement('#root');

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <List />
    </QueryClientProvider>
  )
}

export default App;

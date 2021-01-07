import { QueryClient, QueryClientProvider } from 'react-query'

import Modal from 'react-modal';

import Home from 'pages/Home';

Modal.setAppElement('#root');

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}

export default App;

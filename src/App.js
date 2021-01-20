import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastProvider } from 'react-toast-notifications';

import Modal from 'react-modal';

import Home from 'pages/Home';

Modal.setAppElement('#root');

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider autoDismiss={true} autoDismissTimeout={3000}>
        <Home />
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App;

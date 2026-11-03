import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient({ defaultOptions: { queries: {
  retry: (count, error: any) => ![401, 403, 404].includes(error?.response?.status) && count < 1,
  refetchOnWindowFocus: false
} } });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary><App /></ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)

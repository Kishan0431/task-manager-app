import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import './index.css';

if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass', // or 'warn' or 'error'
  });
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
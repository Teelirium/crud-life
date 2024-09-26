import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from './App';
import { TaskView } from './components/TaskView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [{ path: ':taskId', element: <TaskView /> }],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

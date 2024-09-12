import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Manager from './pages/Manager';
import UserPage from './pages/User';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout headerText="graff.test">
        <UserPage />
      </Layout>
    ),
  },
  {
    path: '/manager',
    element: (
      <Layout headerText="graff.support">
        <Manager />
      </Layout>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

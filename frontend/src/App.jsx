import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PlansHistoryPage from './pages/PlansHistoryPage';
import PlanDetailPage from './pages/PlanDetailPage';
import NotFoundPage from './pages/NotFoundPage';

const PUBLIC_ROUTES = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
];

const PRIVATE_ROUTES = [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/plans', element: <PlansHistoryPage /> },
  { path: '/plans/:id', element: <PlanDetailPage /> },
];

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        {PUBLIC_ROUTES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        <Route element={<ProtectedRoute />}>
          {PRIVATE_ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

import { Routes, Route, Navigate } from 'react-router';
import DamPage from './pages/DamPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { useAppSelector } from './store/hooks';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/dam" replace /> : <SignInPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dam" replace /> : <SignUpPage />} />
      <Route path="/dam" element={<ProtectedRoute><DamPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dam' : '/signin'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

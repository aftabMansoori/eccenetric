import { Routes, Route, Navigate } from 'react-router';
import DamPage from './pages/DamPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DamPage />} />
      <Route path="/dam" element={<DamPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

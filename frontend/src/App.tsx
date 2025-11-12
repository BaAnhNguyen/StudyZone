import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import LoginPage from './page/Login';
import RegisterPage from './page/Register';
import HomePage from './page/HomePage';
import ForgotPassword from './page/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './page/Login'
import HomePage from './page/HomePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (usuario) => {
    login(usuario);
    navigate('/');
  };

  return <Login onLoginSuccess={handleLoginSuccess} onIrParaCadastro={() => navigate('/cadastro')} />;
}

export default LoginPage;
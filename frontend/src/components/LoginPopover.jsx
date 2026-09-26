import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPopover({ onFechar }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario } = response.data;
      localStorage.setItem('token', token);
      login(usuario);
      onFechar();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  const irParaCadastro = () => {
    onFechar();
    navigate('/cadastro');
  };

  return (
    <div className="dropdown-menu login-popover">
      <form onSubmit={handleSubmit} className="login-popover-form">
        <div className="campo">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="campo">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        {erro && <p className="msg-erro">{erro}</p>}
        <button type="submit" className="btn-primary" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <button type="button" className="dropdown-item dropdown-cadastro" onClick={irParaCadastro}>
        Ainda não tem conta? Cadastre-se
      </button>
    </div>
  );
}

export default LoginPopover;

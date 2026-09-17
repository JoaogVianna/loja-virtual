import { useState } from 'react';
import api from '../services/api';

function Login({ onLoginSuccess, onIrParaCadastro }) {
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
      onLoginSuccess(usuario, token);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="card card-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="campo">
          <label>Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        {erro && <p className="msg-erro">{erro}</p>}
        <button type="submit" className="btn-primary" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {onIrParaCadastro && (
        <p style={{ marginTop: '12px', textAlign: 'center' }}>
          Ainda não tem conta?{' '}
          <button type="button" className="btn-link" onClick={onIrParaCadastro}>Cadastre-se</button>
        </p>
      )}
    </div>
  );
}

export default Login;
import { useState, useEffect } from 'react';
import api from '../services/api';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const carregarCategorias = () => {
    api.get('/categorias')
      .then((response) => setCategorias(response.data))
      .catch((err) => console.error('Erro ao carregar categorias', err));
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      await api.post('/categorias', { nome });
      setNome('');
      carregarCategorias();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao criar categoria');
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir essa categoria?')) return;

    try {
      await api.delete(`/categorias/${id}`);
      carregarCategorias();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir categoria (pode haver produtos vinculados a ela)');
    }
  };

  return (
    <div className="card card-form">
      <h2>Categorias</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Nova categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" disabled={carregando} style={{ width: 'auto', padding: '10px 16px' }}>
          {carregando ? 'Criando...' : 'Adicionar'}
        </button>
      </form>

      {erro && <p className="msg-erro">{erro}</p>}

      {categorias.length === 0 ? (
        <p>Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categorias.map((cat) => (
            <li
              key={cat.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #2a2d38' }}
            >
              <span>{cat.nome}</span>
              <button className="btn-danger" onClick={() => handleExcluir(cat.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Categorias;
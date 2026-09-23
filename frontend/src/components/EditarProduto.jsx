import { useState, useEffect } from 'react';
import api from '../services/api';

function EditarProduto({ produto, onSalvo, onCancelar }) {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState(produto.nome);
  const [descricao, setDescricao] = useState(produto.descricao || '');
  const [preco, setPreco] = useState(produto.preco);
  const [categoriaId, setCategoriaId] = useState(produto.categoria_id || '');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    api.get('/categorias')
      .then((response) => setCategorias(response.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      await api.put(`/produtos/${produto.id}`, {
        nome,
        descricao,
        preco: parseFloat(preco),
        categoria_id: categoriaId ? parseInt(categoriaId) : null,
      });
      onSalvo();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao atualizar produto');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="card card-form">
      <h2>Editar Produto</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Nome *</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="campo">
          <label>Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <div className="campo">
          <label>Preço (R$) *</label>
          <input type="number" step="0.01" min="0" value={preco} onChange={(e) => setPreco(e.target.value)} required />
        </div>
        <div className="campo">
          <label>Categoria</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
            <option value="">Sem categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>
        {erro && <p className="msg-erro">{erro}</p>}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarProduto;
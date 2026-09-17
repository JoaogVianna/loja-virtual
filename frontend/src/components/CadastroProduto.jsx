import { useState, useEffect } from 'react';
import api from '../services/api';

function CadastroProduto({ onProdutoCriado }) {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [quantidadeInicial, setQuantidadeInicial] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    api.get('/categorias')
      .then((response) => setCategorias(response.data))
      .catch((err) => console.error('Erro ao carregar categorias', err));
  }, []);

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setPreco('');
    setCategoriaId('');
    setQuantidadeInicial('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    setCarregando(true);

    try {
      const response = await api.post('/produtos', {
        nome,
        descricao,
        preco: parseFloat(preco),
        categoria_id: categoriaId ? parseInt(categoriaId) : null,
        quantidade_inicial: quantidadeInicial ? parseInt(quantidadeInicial) : 0,
      });

      setSucesso(true);
      limparFormulario();
      onProdutoCriado(response.data);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar produto');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="card card-form">
      <h2>Cadastrar Produto</h2>
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
        <div className="campo">
          <label>Estoque inicial</label>
          <input type="number" min="0" value={quantidadeInicial} onChange={(e) => setQuantidadeInicial(e.target.value)} />
        </div>
        {erro && <p className="msg-erro">{erro}</p>}
        {sucesso && <p className="msg-sucesso">Produto cadastrado com sucesso!</p>}
        <button type="submit" className="btn-primary" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </form>
    </div>
  );
}

export default CadastroProduto;
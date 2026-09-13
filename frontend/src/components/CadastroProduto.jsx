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
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #444', borderRadius: '8px' }}>
      <h2>Cadastrar Produto</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label>Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Categoria</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            <option value="">Sem categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>Estoque inicial</label>
          <input
            type="number"
            min="0"
            value={quantidadeInicial}
            onChange={(e) => setQuantidadeInicial(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {sucesso && <p style={{ color: 'lightgreen' }}>Produto cadastrado com sucesso!</p>}

        <button type="submit" disabled={carregando} style={{ width: '100%', padding: '10px' }}>
          {carregando ? 'Cadastrando...' : 'Cadastrar Produto'}
        </button>
      </form>
    </div>
  );
}

export default CadastroProduto;
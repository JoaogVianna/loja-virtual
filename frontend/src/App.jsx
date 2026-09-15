import { useState, useEffect } from 'react';
import api from './services/api';
import Login from './components/Login';
import CadastroProduto from './components/CadastroProduto';
import MeusPedidos from './components/MeusPedidos';
import Carrinho from './components/Carrinho';
import { getIconePorCategoria } from './utils/icones';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [chaveMeusPedidos, setChaveMeusPedidos] = useState(0); // força recarregar pedidos

  const carregarProdutos = () => {
    api.get('/produtos')
      .then((response) => {
        setProdutos(response.data);
        setCarregando(false);
      })
      .catch((err) => {
        setErro('Não foi possível carregar os produtos.');
        setCarregando(false);
        console.error(err);
      });
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleLoginSuccess = (usuarioLogado) => {
    setUsuario(usuarioLogado);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const handleProdutoCriado = () => {
    carregarProdutos();
  };

  const adicionarAoCarrinho = (produto) => {
    setItensCarrinho((atual) => {
      const existente = atual.find((item) => item.id === produto.id);
      if (existente) {
        return atual.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...atual, { id: produto.id, nome: produto.nome, preco: parseFloat(produto.preco), quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (produtoId) => {
    setItensCarrinho((atual) => atual.filter((item) => item.id !== produtoId));
  };

  const handleCompraFinalizada = () => {
    setItensCarrinho([]);
    setChaveMeusPedidos((k) => k + 1); // força o MeusPedidos recarregar
  };

  if (carregando) return <p>Carregando produtos...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Loja Virtual</h1>
        {usuario ? (
          <div>
            <span>Olá, {usuario.nome}! </span>
            <button onClick={handleLogout}>Sair</button>
          </div>
        ) : null}
      </div>

      {!usuario && <Login onLoginSuccess={handleLoginSuccess} />}
      {usuario && <CadastroProduto onProdutoCriado={handleProdutoCriado} />}

      <Carrinho
        itens={itensCarrinho}
        onRemover={removerDoCarrinho}
        onFinalizado={handleCompraFinalizada}
        usuario={usuario}
      />

      {usuario && <MeusPedidos key={chaveMeusPedidos} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
    {produtos.map((produto) => {
  const Icone = getIconePorCategoria(produto.categoria_nome);
  return (
    <div key={produto.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
      <Icone size={32} style={{ marginBottom: '8px' }} />
      <h3>{produto.nome}</h3>
      <p>{produto.descricao}</p>
      <p><strong>R$ {produto.preco}</strong></p>
      <p style={{ fontSize: '0.85em', color: '#666' }}>{produto.categoria_nome}</p>
      <button onClick={() => adicionarAoCarrinho(produto)} style={{ width: '100%', padding: '8px', marginTop: '8px' }}>
        Adicionar ao carrinho
      </button>
    </div>
  );
})}
      </div>
    </div>
  );
}

export default App;
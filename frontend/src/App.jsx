import { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
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
  }, []);

  if (carregando) return <p>Carregando produtos...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Loja Virtual</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {produtos.map((produto) => (
          <div key={produto.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
            <h3>{produto.nome}</h3>
            <p>{produto.descricao}</p>
            <p><strong>R$ {produto.preco}</strong></p>
            <p style={{ fontSize: '0.85em', color: '#666' }}>{produto.categoria_nome}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
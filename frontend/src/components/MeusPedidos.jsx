import { useState, useEffect } from 'react';
import api from '../services/api';

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get('/pedidos')
      .then((response) => {
        setPedidos(response.data);
        setCarregando(false);
      })
      .catch((err) => {
        setErro('Não foi possível carregar seus pedidos.');
        setCarregando(false);
        console.error(err);
      });
  }, []);

  if (carregando) return <p>Carregando pedidos...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;
  if (pedidos.length === 0) return <p>Você ainda não fez nenhum pedido.</p>;

  return (
    <div style={{ margin: '20px 0' }}>
      <h2>Meus Pedidos</h2>
      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          style={{ border: '1px solid #444', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}
        >
          <p><strong>Pedido #{pedido.id}</strong></p>
          <p>Status: {pedido.status}</p>
          <p>Total: R$ {pedido.total}</p>
          <p style={{ fontSize: '0.85em', color: '#888' }}>
            {new Date(pedido.criado_em).toLocaleString('pt-BR')}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MeusPedidos;
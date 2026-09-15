import { useState } from 'react';
import api from '../services/api';

function Carrinho({ itens, onRemover, onFinalizado, usuario }) {
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  const finalizarCompra = async () => {
    setErro(null);
    setSucesso(null);
    setCarregando(true);

    try {
      const payload = {
        itens: itens.map((item) => ({
          produto_id: item.id,
          quantidade: item.quantidade,
        })),
      };
      const response = await api.post('/pedidos', payload);
      setSucesso(`Pedido #${response.data.id} confirmado! Total: R$ ${response.data.total}`);
      onFinalizado();
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao finalizar pedido');
    } finally {
      setCarregando(false);
    }
  };

  if (itens.length === 0 && !sucesso) {
    return null;
  }

  return (
    <div style={{ border: '1px solid #444', borderRadius: '8px', padding: '16px', margin: '20px 0' }}>
      <h2>Carrinho</h2>

      {itens.length > 0 && (
        <>
          {itens.map((item) => (
            <div
              key={item.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #333' }}
            >
              <span>{item.nome} x{item.quantidade}</span>
              <span>
                R$ {(item.preco * item.quantidade).toFixed(2)}
                <button onClick={() => onRemover(item.id)} style={{ marginLeft: '10px' }}>Remover</button>
              </span>
            </div>
          ))}
          <p style={{ marginTop: '10px' }}><strong>Total: R$ {total.toFixed(2)}</strong></p>

          {!usuario ? (
            <p style={{ color: 'orange' }}>Faça login para finalizar a compra.</p>
          ) : (
            <button onClick={finalizarCompra} disabled={carregando} style={{ width: '100%', padding: '10px' }}>
              {carregando ? 'Finalizando...' : 'Finalizar Compra'}
            </button>
          )}
        </>
      )}

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'lightgreen' }}>{sucesso}</p>}
    </div>
  );
}

export default Carrinho;
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
        itens: itens.map((item) => ({ produto_id: item.id, quantidade: item.quantidade })),
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

  if (itens.length === 0 && !sucesso) return null;

  return (
    <div className="card">
      <h2>Carrinho</h2>
      {itens.length > 0 && (
        <>
          {itens.map((item) => (
            <div key={item.id} className="carrinho-item">
              <span>{item.nome} x{item.quantidade}</span>
              <span>
                R$ {(item.preco * item.quantidade).toFixed(2)}
                <button className="btn-danger" onClick={() => onRemover(item.id)} style={{ marginLeft: '10px' }}>Remover</button>
              </span>
            </div>
          ))}
          <p className="carrinho-total">Total: R$ {total.toFixed(2)}</p>
          {!usuario ? (
            <p className="msg-erro">Faça login para finalizar a compra.</p>
          ) : (
            <button className="btn-primary" onClick={finalizarCompra} disabled={carregando}>
              {carregando ? 'Finalizando...' : 'Finalizar Compra'}
            </button>
          )}
        </>
      )}
      {erro && <p className="msg-erro">{erro}</p>}
      {sucesso && <p className="msg-sucesso">{sucesso}</p>}
    </div>
  );
}

export default Carrinho;
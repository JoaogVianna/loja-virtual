import { Link } from 'react-router-dom';

function Carrinho({ itens, onRemover, usuario }) {
  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  if (itens.length === 0) {
    return (
      <div className="card">
        <h2>Carrinho</h2>
        <p className="msg-erro" style={{ color: 'var(--text-muted)' }}>Seu carrinho está vazio.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Carrinho</h2>

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
        <Link to="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Ir para pagamento
        </Link>
      )}
    </div>
  );
}

export default Carrinho;

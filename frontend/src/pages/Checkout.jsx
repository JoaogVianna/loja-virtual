import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, QrCode } from 'lucide-react';
import api from '../services/api';
import { useCarrinho } from '../context/CarrinhoContext';
import { useToast } from '../context/ToastContext';

function Checkout() {
  const { itens, total, limpar } = useCarrinho();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [metodo, setMetodo] = useState('cartao');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState(null);

  if (itens.length === 0) {
    return (
      <div className="card">
        <h2>Checkout</h2>
        <p>Seu carrinho está vazio. <Link to="/" className="btn-link">Voltar às compras</Link></p>
      </div>
    );
  }

  const finalizarPedido = async () => {
    setErro(null);
    setProcessando(true);

    try {
      const payload = {
        itens: itens.map((item) => ({ produto_id: item.id, quantidade: item.quantidade })),
      };

      // Simula o tempo de processamento do pagamento
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const response = await api.post('/pedidos', payload);
      limpar();
      addToast(`Pagamento aprovado! Pedido #${response.data.id} confirmado.`, 'sucesso');
      navigate('/pedidos');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao processar pagamento');
    } finally {
      setProcessando(false);
    }
  };

  const handleSubmitCartao = (e) => {
    e.preventDefault();
    finalizarPedido();
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Finalizar Compra</h2>

      <div className="checkout-grid">
        <div className="card">
          <div className="checkout-metodos">
            <button
              type="button"
              className={`checkout-metodo-btn ${metodo === 'cartao' ? 'ativo' : ''}`}
              onClick={() => setMetodo('cartao')}
            >
              <CreditCard size={18} /> Cartão de crédito
            </button>
            <button
              type="button"
              className={`checkout-metodo-btn ${metodo === 'pix' ? 'ativo' : ''}`}
              onClick={() => setMetodo('pix')}
            >
              <QrCode size={18} /> PIX
            </button>
          </div>

          {metodo === 'cartao' ? (
            <form onSubmit={handleSubmitCartao}>
              <div className="campo">
                <label>Número do cartão</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(e.target.value)}
                  required
                />
              </div>
              <div className="campo">
                <label>Nome no cartão</label>
                <input
                  type="text"
                  placeholder="Como está impresso no cartão"
                  value={nomeCartao}
                  onChange={(e) => setNomeCartao(e.target.value)}
                  required
                />
              </div>
              <div className="checkout-linha">
                <div className="campo">
                  <label>Validade</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                    required
                  />
                </div>
                <div className="campo">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </div>

              {erro && <p className="msg-erro">{erro}</p>}

              <button type="submit" className="btn-primary" disabled={processando}>
                {processando ? 'Processando pagamento...' : `Pagar R$ ${total.toFixed(2)}`}
              </button>
            </form>
          ) : (
            <div className="pix-box">
              <div className="pix-qr">
                <QrCode size={100} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Escaneie o QR code com o app do seu banco
              </p>
              <div className="pix-codigo">
                00020126580014BR.GOV.BCB.PIX0136simulado-{Date.now()}
              </div>

              {erro && <p className="msg-erro">{erro}</p>}

              <button className="btn-primary" onClick={finalizarPedido} disabled={processando}>
                {processando ? 'Confirmando pagamento...' : 'Já paguei'}
              </button>
            </div>
          )}
        </div>

        <div className="card resumo-pedido">
          <h2>Resumo do pedido</h2>
          {itens.map((item) => (
            <div key={item.id} className="resumo-item">
              <span>{item.nome} x{item.quantidade}</span>
              <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
          ))}
          <div className="resumo-total">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

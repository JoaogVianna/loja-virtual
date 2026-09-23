import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { getIconePorCategoria } from '../utils/icones';
import CadastroProduto from '../components/CadastroProduto';
import EditarProduto from '../components/EditarProduto';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);

  const { usuario } = useAuth();
  const { adicionar } = useCarrinho();
  const { addToast } = useToast();

  const carregarProdutos = () => {
    api.get('/produtos')
      .then((response) => {
        setProdutos(response.data);
        setCarregando(false);
      })
      .catch(() => {
        setErro('Não foi possível carregar os produtos.');
        setCarregando(false);
      });
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleExcluir = (id) => {
    setConfirmacao({
      mensagem: 'Tem certeza que deseja excluir este produto?',
      aoConfirmar: async () => {
        try {
          await api.delete(`/produtos/${id}`);
          carregarProdutos();
          addToast('Produto removido.', 'sucesso');
        } catch (err) {
          addToast(err.response?.data?.erro || 'Erro ao excluir produto', 'erro');
        }
        setConfirmacao(null);
      },
    });
  };

  if (carregando) return <p>Carregando produtos...</p>;
  if (erro) return <p className="msg-erro">{erro}</p>;

  return (
    <>
      {usuario && <CadastroProduto onProdutoCriado={carregarProdutos} />}
      {produtoEditando && (
        <EditarProduto
          produto={produtoEditando}
          onSalvo={() => { setProdutoEditando(null); carregarProdutos(); }}
          onCancelar={() => setProdutoEditando(null)}
        />
      )}

      <div className="produtos-grid">
        {produtos.map((produto) => {
          const Icone = getIconePorCategoria(produto.categoria_nome);
          return (
            <div key={produto.id} className="produto-card">
              <Icone size={32} className="produto-icone" />
              <h3>{produto.nome}</h3>
              <p className="produto-descricao">{produto.descricao}</p>
              <p className="produto-preco">R$ {produto.preco}</p>
              <p className="produto-categoria">{produto.categoria_nome}</p>
              <button className="btn-primary" onClick={() => adicionar(produto)}>
                Adicionar ao carrinho
              </button>
              {usuario && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setProdutoEditando(produto)}>Editar</button>
                  <button className="btn-danger" style={{ flex: 1 }} onClick={() => handleExcluir(produto.id)}>Remover</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        mensagem={confirmacao?.mensagem}
        onConfirmar={confirmacao?.aoConfirmar}
        onCancelar={() => setConfirmacao(null)}
      />
    </>
  );
}

export default Produtos;

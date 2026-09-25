import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useCarrinho } from '../context/CarrinhoContext';
import { useToast } from '../context/ToastContext';
import { getIconePorCategoria } from '../utils/icones';

function ProdutoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const { adicionar } = useCarrinho();
  const { addToast } = useToast();

  useEffect(() => {
    setCarregando(true);
    api.get(`/produtos/${id}`)
      .then((response) => {
        setProduto(response.data);
        setCarregando(false);
      })
      .catch(() => {
        setErro('Produto não encontrado.');
        setCarregando(false);
      });

    api.get(`/produtos/${id}/relacionados`)
      .then((response) => setRelacionados(response.data))
      .catch(() => {});
  }, [id]);

  const handleAdicionar = () => {
    adicionar(produto);
    addToast(`${produto.nome} adicionado ao carrinho.`, 'sucesso');
  };

  if (carregando) return <p>Carregando produto...</p>;
  if (erro) return <p className="msg-erro">{erro}</p>;
  if (!produto) return null;

  const Icone = getIconePorCategoria(produto.categoria_nome);

  return (
    <>
      <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="produto-detalhe">
        <div className="produto-detalhe-imagem">
          {produto.imagem_url ? (
            <img src={produto.imagem_url} alt={produto.nome} />
          ) : (
            <Icone size={64} />
          )}
        </div>

        <div className="produto-detalhe-info">
          <p className="produto-categoria">{produto.categoria_nome}</p>
          <h1>{produto.nome}</h1>
          <p className="produto-detalhe-preco">R$ {produto.preco}</p>
          <p className="produto-detalhe-descricao">{produto.descricao}</p>
          <p className="produto-detalhe-estoque">
            {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Fora de estoque'}
          </p>
          <button className="btn-primary" onClick={handleAdicionar} disabled={produto.estoque <= 0}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2>Produtos relacionados</h2>
          <div className="produtos-grid">
            {relacionados.map((rel) => {
              const IconeRel = getIconePorCategoria(rel.categoria_nome);
              return (
                <Link key={rel.id} to={`/produtos/${rel.id}`} className="produto-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {rel.imagem_url ? (
                    <img src={rel.imagem_url} alt={rel.nome} className="produto-imagem" />
                  ) : (
                    <IconeRel size={32} className="produto-icone" />
                  )}
                  <h3>{rel.nome}</h3>
                  <p className="produto-preco">R$ {rel.preco}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default ProdutoDetalhes;
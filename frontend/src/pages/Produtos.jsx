import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';
import { useToast } from '../context/ToastContext';
import CadastroProduto from '../components/CadastroProduto';
import ConfirmModal from '../components/ConfirmModal';
import EditarProduto from '../components/EditarProduto';
import Hero from '../components/Hero';
import {
  CategoryShortcuts,
  PeripheralsBanner,
  ProductCard,
  ShopFooter,
} from '../components/HomeSections';

async function buscarProdutos() {
  const { data } = await api.get('/produtos');
  return data;
}

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [searchParams] = useSearchParams();
  const { usuario } = useAuth();
  const { adicionar } = useCarrinho();
  const { addToast } = useToast();

  const carregarProdutos = useCallback(async () => {
    try {
      setProdutos(await buscarProdutos());
      setErro('');
    } catch {
      setErro('Não foi possível carregar os produtos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let ativa = true;

    buscarProdutos()
      .then((data) => {
        if (ativa) setProdutos(data);
      })
      .catch(() => {
        if (ativa) setErro('Não foi possível carregar os produtos.');
      })
      .finally(() => {
        if (ativa) setCarregando(false);
      });

    return () => {
      ativa = false;
    };
  }, []);

  async function excluirProduto(id) {
    try {
      await api.delete(`/produtos/${id}`);
      await carregarProdutos();
      addToast('Produto removido.', 'sucesso');
    } catch (err) {
      addToast(err.response?.data?.erro || 'Erro ao excluir produto.', 'erro');
    } finally {
      setConfirmacao(null);
    }
  }

  function confirmarExclusao(id) {
    setConfirmacao({
      mensagem: 'Tem certeza que deseja excluir este produto?',
      aoConfirmar: () => excluirProduto(id),
    });
  }

  const categorias = [...new Set(produtos.map(({ categoria_nome }) => categoria_nome).filter(Boolean))];
  const termo = (searchParams.get('busca') || '').trim().toLocaleLowerCase('pt-BR');
  const produtosVisiveis = produtos.filter((produto) => {
    const texto = `${produto.nome} ${produto.descricao || ''} ${produto.categoria_nome || ''}`;
    const correspondeBusca = texto.toLocaleLowerCase('pt-BR').includes(termo);
    const correspondeCategoria = !categoriaAtiva || produto.categoria_nome === categoriaAtiva;
    return correspondeBusca && correspondeCategoria;
  });

  if (carregando) {
    return (
      <>
        <Hero produtos={produtos} />
        <p className="home-loading">Carregando produtos...</p>
      </>
    );
  }

  if (erro) {
    return (
      <>
        <Hero produtos={produtos} />
        <p className="msg-erro">{erro}</p>
      </>
    );
  }

  return (
    <main className="home-page">
      <Hero produtos={produtos} />

      {usuario && <CadastroProduto onProdutoCriado={carregarProdutos} />}

      {produtoEditando && (
        <EditarProduto
          produto={produtoEditando}
          onSalvo={() => {
            setProdutoEditando(null);
            carregarProdutos();
          }}
          onCancelar={() => setProdutoEditando(null)}
        />
      )}

      <CategoryShortcuts
        categorias={categorias}
        selecionada={categoriaAtiva}
        onSelecionar={setCategoriaAtiva}
      />

      <section className="produtos-destaque" id="produtos">
        <div className="secao-cabecalho">
          <div>
            <p className="secao-tag">{termo ? 'RESULTADOS DA BUSCA' : 'DESTAQUES'}</p>
            <h2>
              {categoriaAtiva || (termo
                ? `Resultados para “${searchParams.get('busca')}”`
                : 'Produtos em alta')}
            </h2>
          </div>
          <Link to="/categorias" className="ver-todos">
            Ver todos <span aria-hidden="true">→</span>
          </Link>
        </div>

        {produtosVisiveis.length ? (
          <div className="produtos-grid">
            {produtosVisiveis.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                favorito={favoritos.includes(produto.id)}
                podeEditar={Boolean(usuario)}
                onAdicionar={adicionar}
                onEditar={setProdutoEditando}
                onExcluir={confirmarExclusao}
                onFavoritar={() => setFavoritos((atuais) => (
                  atuais.includes(produto.id)
                    ? atuais.filter((id) => id !== produto.id)
                    : [...atuais, produto.id]
                ))}
              />
            ))}
          </div>
        ) : (
          <p className="sem-produtos">Nenhum produto encontrado.</p>
        )}
      </section>

      <PeripheralsBanner />
      <ShopFooter />

      <ConfirmModal
        mensagem={confirmacao?.mensagem}
        onConfirmar={confirmacao?.aoConfirmar}
        onCancelar={() => setConfirmacao(null)}
      />
    </main>
  );
}

export default Produtos;

import { useState, useEffect } from "react";
import api from "./services/api";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import CadastroProduto from "./components/CadastroProduto";
import MeusPedidos from "./components/MeusPedidos";
import Carrinho from "./components/Carrinho";
import { getIconePorCategoria } from "./utils/icones";
import Categorias from "./components/Categorias";
import EditarProduto from "./components/EditarProduto";
import "./App.css";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [chaveMeusPedidos, setChaveMeusPedidos] = useState(0);
  const [telaAuth, setTelaAuth] = useState("login");

  const carregarProdutos = () => {
    api
      .get("/produtos")
      .then((response) => {
        setProdutos(response.data);
        setCarregando(false);
      })
      .catch((err) => {
        setErro("Não foi possível carregar os produtos.");
        setCarregando(false);
        console.error(err);
      });
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleLoginSuccess = (usuarioLogado) => setUsuario(usuarioLogado);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  const handleCadastroSuccess = (email) => {
    setTelaAuth("login");
    alert(`Conta criada com sucesso para ${email}! Faça login.`);
  };

  const handleProdutoCriado = () => carregarProdutos();

  const adicionarAoCarrinho = (produto) => {
    setItensCarrinho((atual) => {
      const existente = atual.find((item) => item.id === produto.id);
      if (existente) {
        return atual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      }
      return [
        ...atual,
        {
          id: produto.id,
          nome: produto.nome,
          preco: parseFloat(produto.preco),
          quantidade: 1,
        },
      ];
    });
  };

  const removerDoCarrinho = (produtoId) => {
    setItensCarrinho((atual) => atual.filter((item) => item.id !== produtoId));
  };

  const handleCompraFinalizada = () => {
    setItensCarrinho([]);
    setChaveMeusPedidos((k) => k + 1);
  };

  const [produtoEditando, setProdutoEditando] = useState(null);
  const handleExcluirProduto = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao excluir produto");
    }
  };

  const handleProdutoEditado = () => {
    setProdutoEditando(null);
    carregarProdutos();
  };

  if (carregando) return <p className="container">Carregando produtos...</p>;
  if (erro) return <p className="container msg-erro">{erro}</p>;

  return (
    <div className="container">
      <div className="header">
        <h1>Loja Virtual</h1>
        {usuario && (
          <div className="usuario-info">
            <span>Olá, {usuario.nome}!</span>
            <button className="btn-secondary" onClick={handleLogout}>
              Sair
            </button>
          </div>
        )}
      </div>

      {!usuario && telaAuth === "login" && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onIrParaCadastro={() => setTelaAuth("cadastro")}
        />
      )}
      {!usuario && telaAuth === "cadastro" && (
        <Cadastro onCadastroSuccess={handleCadastroSuccess} />
      )}

      {usuario && <CadastroProduto onProdutoCriado={handleProdutoCriado} />}
      {usuario && <Categorias />}
      {produtoEditando && (
        <EditarProduto
          produto={produtoEditando}
          onSalvo={handleProdutoEditado}
          onCancelar={() => setProdutoEditando(null)}
        />
      )}

      <Carrinho
        itens={itensCarrinho}
        onRemover={removerDoCarrinho}
        onFinalizado={handleCompraFinalizada}
        usuario={usuario}
      />

      {usuario && <MeusPedidos key={chaveMeusPedidos} />}

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
              <button
                className="btn-primary"
                onClick={() => adicionarAoCarrinho(produto)}
              >
                Adicionar ao carrinho
              </button>
              {usuario && (
                <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                  <button
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setProdutoEditando(produto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    style={{ flex: 1 }}
                    onClick={() => handleExcluirProduto(produto.id)}
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  ArrowRight,
  Boxes,
  Plus,
  Package,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCarrinho } from "../context/CarrinhoContext";
import LoginPopover from "./LoginPopover";

function NavBar() {
  const { usuario, logout } = useAuth();
  const { quantidadeTotal } = useCarrinho();
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function fecharAoClicarFora(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);

    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setMenuAberto(false);
    navigate("/");
  };

  const handleBusca = (e) => {
    e.preventDefault();

    if (busca.trim()) {
      navigate(`/?busca=${encodeURIComponent(busca.trim())}`);
      setBusca("");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-mark">
            <Boxes size={20} strokeWidth={2.5} />
          </span>

          <span>VOLTARI</span>
        </NavLink>

        <div className="navbar-menu">
          <NavLink to="/" className="nav-link" end>
            Início
          </NavLink>

          <a href="/#produtos" className="nav-link">
            Produtos
          </a>

          <NavLink to="/categorias" className="nav-link">
            Categorias
          </NavLink>

          <a href="/#sobre" className="nav-link">
            Sobre
          </a>

          <a href="/#contato" className="nav-link">
            Contato
          </a>
        </div>

        <form className="navbar-busca" onSubmit={handleBusca}>
          <Search size={16} />

          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <button type="submit" aria-label="Buscar produtos">
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="navbar-acoes">
          <NavLink to="/carrinho" className="navbar-icone-btn">
            <ShoppingCart size={20} />

            {quantidadeTotal > 0 && (
              <span className="badge">{quantidadeTotal}</span>
            )}
          </NavLink>

          {usuario ? (
            /* USUÁRIO LOGADO */
            <div className="navbar-usuario-menu" ref={menuRef}>
              <button
                type="button"
                className="navbar-icone-btn"
                onClick={() => setMenuAberto((atual) => !atual)}
                aria-label="Menu do usuário"
              >
                <User size={20} />
              </button>

              {menuAberto && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">Olá, {usuario.nome}</div>

                  <NavLink
                    to="/produtos/novo"
                    className="dropdown-item"
                    onClick={() => setMenuAberto(false)}
                  >
                    <Plus size={16} />
                    Cadastrar produto
                  </NavLink>

                  <NavLink
                    to="/pedidos"
                    className="dropdown-item"
                    onClick={() => setMenuAberto(false)}
                  >
                    <Package size={16} />
                    Meus pedidos
                  </NavLink>

                  <NavLink
                    to="/relatorios"
                    className="dropdown-item"
                    onClick={() => setMenuAberto(false)}
                  >
                    <TrendingUp size={16} /> Relatórios
                  </NavLink>

                  <button
                    type="button"
                    className="dropdown-item dropdown-sair"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* USUÁRIO NÃO LOGADO */
            <div className="navbar-usuario-menu" ref={menuRef}>
              <button
                type="button"
                className="navbar-icone-btn"
                onClick={() => setMenuAberto((atual) => !atual)}
                aria-label="Entrar"
              >
                <User size={20} />
              </button>

              {menuAberto && (
                <LoginPopover onFechar={() => setMenuAberto(false)} />
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

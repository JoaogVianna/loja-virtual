import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, ArrowRight, Boxes } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

function NavBar() {
  const { usuario, logout } = useAuth();
  const { quantidadeTotal } = useCarrinho();
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBusca = (e) => {
    e.preventDefault();
    if (busca.trim()) {
      navigate(`/?busca=${encodeURIComponent(busca.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-mark"><Boxes size={20} strokeWidth={2.5} /></span>
          <span>VOLTARI</span>
        </NavLink>

        <div className="navbar-menu">
          <NavLink to="/" className="nav-link" end>Início</NavLink>
          <a href="/#produtos" className="nav-link">Produtos</a>
          <NavLink to="/categorias" className="nav-link">Categorias</NavLink>
          <a href="/#sobre" className="nav-link">Sobre</a>
          <a href="/#contato" className="nav-link">Contato</a>
        </div>

        <form className="navbar-busca" onSubmit={handleBusca}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit" aria-label="Buscar produtos"><ArrowRight size={16} /></button>
        </form>

        <div className="navbar-acoes">
          <NavLink to={usuario ? '/pedidos' : '/login'} className="navbar-icone-btn" aria-label="Minha conta">
            <User size={20} />
          </NavLink>
          <NavLink to="/carrinho" className="navbar-icone-btn">
            <ShoppingCart size={20} />
            {quantidadeTotal > 0 && <span className="badge">{quantidadeTotal}</span>}
          </NavLink>

          {usuario ? (
            <>
              <NavLink to="/pedidos" className="nav-link pedidos-link">Meus Pedidos</NavLink>
              <span className="navbar-usuario">Olá, {usuario.nome}</span>
              <button className="btn-secondary" onClick={handleLogout}>Sair</button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

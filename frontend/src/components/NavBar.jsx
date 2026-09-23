import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

function NavBar() {
  const { usuario, logout } = useAuth();
  const { quantidadeTotal } = useCarrinho();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <Store size={24} />
        <span>Loja Virtual</span>
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/carrinho" className="nav-link">
          <ShoppingCart size={18} />
          {quantidadeTotal > 0 && <span className="badge">{quantidadeTotal}</span>}
        </NavLink>

        {usuario ? (
          <>
            <NavLink to="/pedidos" className="nav-link">Meus Pedidos</NavLink>
            <NavLink to="/categorias" className="nav-link">Categorias</NavLink>
            <span className="navbar-usuario">Olá, {usuario.nome}</span>
            <button className="btn-secondary" onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <NavLink to="/login" className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }}>
            Entrar
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
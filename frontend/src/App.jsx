import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Produtos from './pages/Produtos';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import CarrinhoPage from './pages/CarrinhoPage';
import PedidosPage from './pages/PedidosPage';
import CategoriasPage from './pages/CategoriasPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <NavBar />
        <Routes>
          <Route path="/" element={<Produtos />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
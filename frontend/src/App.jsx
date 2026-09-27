import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import NovoProduto from './pages/NovoProduto';
import Produtos from './pages/Produtos';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import CarrinhoPage from './pages/CarrinhoPage';
import PedidosPage from './pages/PedidosPage';
import CategoriasPage from './pages/CategoriasPage';
import ProdutoDetalhes from './pages/ProdutoDetalhes';
import Checkout from './pages/Checkout';
import './App.css';
import Relatorios from './pages/Relatorios';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <NavBar />
        <Routes>
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/produtos/novo" element={<NovoProduto />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/" element={<Produtos />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
import { useNavigate } from 'react-router-dom';
import Carrinho from '../components/Carrinho';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

function CarrinhoPage() {
  const { usuario } = useAuth();
  const { itens, remover, limpar } = useCarrinho();
  const navigate = useNavigate();

  const handleFinalizado = () => {
    limpar();
    navigate('/pedidos');
  };

  return <Carrinho itens={itens} onRemover={remover} onFinalizado={handleFinalizado} usuario={usuario} />;
}

export default CarrinhoPage;
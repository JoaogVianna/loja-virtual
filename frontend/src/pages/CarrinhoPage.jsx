import Carrinho from '../components/Carrinho';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

function CarrinhoPage() {
  const { usuario } = useAuth();
  const { itens, remover } = useCarrinho();

  return <Carrinho itens={itens} onRemover={remover} usuario={usuario} />;
}

export default CarrinhoPage;

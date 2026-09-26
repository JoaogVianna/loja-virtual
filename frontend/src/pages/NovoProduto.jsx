import { useNavigate } from 'react-router-dom';
import CadastroProduto from '../components/CadastroProduto';
import { useToast } from '../context/ToastContext';

function NovoProduto() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleProdutoCriado = () => {
    addToast('Produto cadastrado com sucesso!', 'sucesso');
    navigate('/');
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Cadastrar Novo Produto</h2>
      <CadastroProduto onProdutoCriado={handleProdutoCriado} />
    </div>
  );
}

export default NovoProduto;

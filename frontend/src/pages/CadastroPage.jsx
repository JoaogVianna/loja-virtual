import { useNavigate } from 'react-router-dom';
import Cadastro from '../components/Cadastro';
import { useToast } from '../context/ToastContext';

function CadastroPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleCadastroSuccess = (email) => {
    addToast(`Conta criada para ${email}! Faça login.`, 'sucesso');
    navigate('/login');
  };

  return <Cadastro onCadastroSuccess={handleCadastroSuccess} />;
}

export default CadastroPage;
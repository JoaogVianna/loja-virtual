import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Users } from 'lucide-react';
import api from '../services/api';

function Relatorios() {
  const [resumo, setResumo] = useState(null);
  const [maisVendidos, setMaisVendidos] = useState([]);
  const [porUsuario, setPorUsuario] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/relatorios/resumo'),
      api.get('/relatorios/produtos-mais-vendidos'),
      api.get('/relatorios/vendas-por-usuario'),
    ])
      .then(([resResumo, resProdutos, resUsuarios]) => {
        setResumo(resResumo.data);
        setMaisVendidos(resProdutos.data);
        setPorUsuario(resUsuarios.data);
        setCarregando(false);
      })
      .catch(() => {
        setErro('Não foi possível carregar os relatórios.');
        setCarregando(false);
      });
  }, []);

  if (carregando) return <p>Carregando relatórios...</p>;
  if (erro) return <p className="msg-erro">{erro}</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Relatórios</h2>

      <div className="relatorio-cards">
        <div className="relatorio-card">
          <ShoppingBag size={22} />
          <div>
            <p className="relatorio-valor">{resumo.total_pedidos}</p>
            <p className="relatorio-label">Pedidos confirmados</p>
          </div>
        </div>
        <div className="relatorio-card">
          <DollarSign size={22} />
          <div>
            <p className="relatorio-valor">R$ {parseFloat(resumo.receita_total).toFixed(2)}</p>
            <p className="relatorio-label">Receita total</p>
          </div>
        </div>
        <div className="relatorio-card">
          <TrendingUp size={22} />
          <div>
            <p className="relatorio-valor">R$ {parseFloat(resumo.ticket_medio).toFixed(2)}</p>
            <p className="relatorio-label">Ticket médio</p>
          </div>
        </div>
        <div className="relatorio-card">
          <Users size={22} />
          <div>
            <p className="relatorio-valor">{porUsuario.length}</p>
            <p className="relatorio-label">Clientes ativos</p>
          </div>
        </div>
      </div>

      <div className="relatorio-secao">
        <h3>Produtos mais vendidos</h3>
        {maisVendidos.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Nenhuma venda registrada ainda.</p>
        ) : (
          <table className="tabela-relatorio">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Unidades vendidas</th>
                <th>Receita</th>
              </tr>
            </thead>
            <tbody>
              {maisVendidos.map((p) => (
                <tr key={p.id}>
                  <td className="produto-nome-cell">
                    {p.imagem_url && <img src={p.imagem_url} alt={p.nome} />}
                    {p.nome}
                  </td>
                  <td>{p.total_vendido}</td>
                  <td>R$ {parseFloat(p.receita_total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="relatorio-secao">
        <h3>Ranking de clientes</h3>
        {porUsuario.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Nenhum cliente com compras ainda.</p>
        ) : (
          <table className="tabela-relatorio">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Pedidos</th>
                <th>Total gasto</th>
              </tr>
            </thead>
            <tbody>
              {porUsuario.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.total_pedidos}</td>
                  <td>R$ {parseFloat(u.total_gasto).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Relatorios;

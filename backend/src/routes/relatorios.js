const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const autenticar = require('../middleware/auth');

// Produtos mais vendidos (quantidade total vendida, somando todos os pedidos)
router.get('/produtos-mais-vendidos', autenticar, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.nome,
        p.imagem_url,
        SUM(ip.quantidade) AS total_vendido,
        SUM(ip.quantidade * ip.preco_unitario) AS receita_total
      FROM itens_pedido ip
      JOIN produtos p ON p.id = ip.produto_id
      JOIN pedidos pe ON pe.id = ip.pedido_id
      WHERE pe.status = 'confirmado'
      GROUP BY p.id, p.nome, p.imagem_url
      ORDER BY total_vendido DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Total de vendas por dia
router.get('/vendas-por-periodo', autenticar, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        DATE(criado_em) AS data,
        COUNT(*) AS total_pedidos,
        SUM(total) AS total_vendido
      FROM pedidos
      WHERE status = 'confirmado'
      GROUP BY DATE(criado_em)
      ORDER BY data DESC
      LIMIT 30
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Total gasto por usuário (ranking de clientes)
router.get('/vendas-por-usuario', autenticar, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.nome,
        u.email,
        COUNT(pe.id) AS total_pedidos,
        SUM(pe.total) AS total_gasto
      FROM usuarios u
      JOIN pedidos pe ON pe.usuario_id = u.id
      WHERE pe.status = 'confirmado'
      GROUP BY u.id, u.nome, u.email
      ORDER BY total_gasto DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Resumo geral (cards do topo do dashboard)
router.get('/resumo', autenticar, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_pedidos,
        COALESCE(SUM(total), 0) AS receita_total,
        COALESCE(AVG(total), 0) AS ticket_medio
      FROM pedidos
      WHERE status = 'confirmado'
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;

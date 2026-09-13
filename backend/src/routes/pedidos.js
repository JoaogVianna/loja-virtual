const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const autenticar = require('../middleware/auth');

// Criar um pedido (com itens) - REQUER LOGIN
// Body esperado: { itens: [{ produto_id: 1, quantidade: 2 }, ...] }
router.post('/', autenticar, async (req, res) => {
  const { itens } = req.body;
  const usuario_id = req.usuario.id;

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ erro: 'itens (array não vazio) é obrigatório' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const pedidoResult = await client.query(
      `INSERT INTO pedidos (usuario_id, status, total) VALUES ($1, 'pendente', 0) RETURNING *`,
      [usuario_id]
    );
    const pedido = pedidoResult.rows[0];

    let total = 0;

    for (const item of itens) {
      const { produto_id, quantidade } = item;

      if (!produto_id || !quantidade || quantidade <= 0) {
        throw new Error(`Item inválido: ${JSON.stringify(item)}`);
      }

      const produtoResult = await client.query(
        `SELECT p.id, p.preco, e.quantidade AS estoque_atual
         FROM produtos p
         JOIN estoque e ON e.produto_id = p.id
         WHERE p.id = $1
         FOR UPDATE`,
        [produto_id]
      );

      if (produtoResult.rowCount === 0) {
        throw new Error(`Produto ${produto_id} não encontrado`);
      }

      const produto = produtoResult.rows[0];

      if (produto.estoque_atual < quantidade) {
        throw new Error(
          `Estoque insuficiente para o produto ${produto_id} (disponível: ${produto.estoque_atual}, pedido: ${quantidade})`
        );
      }

      await client.query(
        `UPDATE estoque SET quantidade = quantidade - $1 WHERE produto_id = $2`,
        [quantidade, produto_id]
      );

      await client.query(
        `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedido.id, produto_id, quantidade, produto.preco]
      );

      total += quantidade * parseFloat(produto.preco);
    }

    const pedidoAtualizado = await client.query(
      `UPDATE pedidos SET total = $1, status = 'confirmado' WHERE id = $2 RETURNING *`,
      [total, pedido.id]
    );

    await client.query('COMMIT');
    res.status(201).json(pedidoAtualizado.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ erro: err.message });
  } finally {
    client.release();
  }
});

// Listar pedidos com seus itens
router.get('/', async (req, res) => {
  try {
    const pedidos = await pool.query('SELECT * FROM pedidos ORDER BY id');
    res.json(pedidos.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Ver um pedido específico com seus itens detalhados
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    if (pedido.rowCount === 0) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }

    const itens = await pool.query(
      `SELECT ip.produto_id, p.nome, ip.quantidade, ip.preco_unitario
       FROM itens_pedido ip
       JOIN produtos p ON p.id = ip.produto_id
       WHERE ip.pedido_id = $1`,
      [id]
    );

    res.json({ ...pedido.rows[0], itens: itens.rows });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
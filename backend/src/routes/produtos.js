const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const autenticar = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.nome, p.descricao, p.preco, p.categoria_id, c.nome AS categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/', autenticar, async (req, res) => {
  const { nome, descricao, preco, categoria_id, quantidade_inicial } = req.body;

  if (!nome || preco === undefined) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const produtoResult = await client.query(
      `INSERT INTO produtos (nome, descricao, preco, categoria_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome, descricao || null, preco, categoria_id || null]
    );
    const produto = produtoResult.rows[0];

    await client.query(
      `INSERT INTO estoque (produto_id, quantidade) VALUES ($1, $2)`,
      [produto.id, quantidade_inicial || 0]
    );

    await client.query('COMMIT');
    res.status(201).json(produto);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ erro: err.message });
  } finally {
    client.release();
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, categoria_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE produtos SET nome = $1, descricao = $2, preco = $3, categoria_id = $4
       WHERE id = $5 RETURNING *`,
      [nome, descricao, preco, categoria_id, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json({ mensagem: 'Produto removido', produto: result.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.json({ mensagem: 'API da loja virtual funcionando!' });
});

app.get('/teste-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ conectado: true, hora: result.rows[0] });
  } catch (err) {
    res.status(500).json({ conectado: false, erro: err.message });
  }
});


const produtosRoutes = require('./routes/produtos');
app.use('/produtos', produtosRoutes);

const categoriasRoutes = require('./routes/categorias');
app.use('/categorias', categoriasRoutes);

const pedidosRoutes = require('./routes/pedidos');
app.use('/pedidos', pedidosRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


const PORT = 3002   ;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
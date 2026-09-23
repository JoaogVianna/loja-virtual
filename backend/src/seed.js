const pool = require('./db/pool');

async function popularBanco() {
  console.log('Buscando produtos da FakeStoreAPI...');

  const response = await fetch('https://fakestoreapi.com/products');
  const produtosApi = await response.json();

  console.log(`${produtosApi.length} produtos encontrados.`);

  // 1. Extrai categorias únicas
  const nomesCategorias = [...new Set(produtosApi.map((p) => p.category))];
  const mapaCategorias = {};

  for (const nome of nomesCategorias) {
    // Verifica se já existe
    const existente = await pool.query('SELECT id FROM categorias WHERE nome = $1', [nome]);

    if (existente.rowCount > 0) {
      mapaCategorias[nome] = existente.rows[0].id;
    } else {
      const result = await pool.query(
        'INSERT INTO categorias (nome) VALUES ($1) RETURNING id',
        [nome]
      );
      mapaCategorias[nome] = result.rows[0].id;
      console.log(`Categoria criada: ${nome}`);
    }
  }

  // 2. Insere os produtos
  for (const produto of produtosApi) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const produtoResult = await client.query(
        `INSERT INTO produtos (nome, descricao, preco, categoria_id)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [produto.title, produto.description, produto.price, mapaCategorias[produto.category]]
      );

      const produtoId = produtoResult.rows[0].id;

      await client.query(
        `INSERT INTO estoque (produto_id, quantidade) VALUES ($1, $2)`,
        [produtoId, Math.floor(Math.random() * 50) + 10] // estoque aleatório entre 10 e 60
      );

      await client.query('COMMIT');
      console.log(`Produto criado: ${produto.title}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`Erro ao criar produto ${produto.title}:`, err.message);
    } finally {
      client.release();
    }
  }

  console.log('Povoamento concluído!');
  process.exit(0);
}

popularBanco().catch((err) => {
  console.error('Erro geral:', err);
  process.exit(1);
});

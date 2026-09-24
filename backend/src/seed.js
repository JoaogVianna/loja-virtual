const pool = require('./db/pool');

const CATEGORIAS_ELETRONICOS = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];

async function popularBanco() {
  console.log('Buscando produtos da DummyJSON...');

  const mapaCategorias = {};

  for (const categoriaApi of CATEGORIAS_ELETRONICOS) {
    const response = await fetch(`https://dummyjson.com/products/category/${categoriaApi}`);
    const data = await response.json();
    const produtosApi = data.products;

    console.log(`\nCategoria "${categoriaApi}": ${produtosApi.length} produtos`);

    // Cria a categoria se não existir
    if (!mapaCategorias[categoriaApi]) {
      const nomeExibicao = categoriaApi
        .replace('-', ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      const result = await pool.query(
        'INSERT INTO categorias (nome) VALUES ($1) RETURNING id',
        [nomeExibicao]
      );
      mapaCategorias[categoriaApi] = result.rows[0].id;
      console.log(`Categoria criada: ${nomeExibicao}`);
    }

    for (const produto of produtosApi) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const nomeCompleto = produto.brand ? `${produto.brand} ${produto.title}` : produto.title;

        const produtoResult = await client.query(
          `INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem_url)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [nomeCompleto, produto.description, produto.price, mapaCategorias[categoriaApi], produto.thumbnail]
        );

        const produtoId = produtoResult.rows[0].id;

        await client.query(
          `INSERT INTO estoque (produto_id, quantidade) VALUES ($1, $2)`,
          [produtoId, produto.stock || 10]
        );

        await client.query('COMMIT');
        console.log(`  Produto criado: ${nomeCompleto} - $${produto.price}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  Erro ao criar produto ${produto.title}:`, err.message);
      } finally {
        client.release();
      }
    }
  }

  console.log('\nPovoamento concluído!');
  process.exit(0);
}

popularBanco().catch((err) => {
  console.error('Erro geral:', err);
  process.exit(1);
});

import { Link } from 'react-router-dom';
import { createElement } from 'react';
import {
  ArrowRight,
  Heart,
  Headphones,
  Laptop,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { getIconePorCategoria } from '../utils/icones';

const iconesCategoria = [Smartphone, Laptop, Tablet, Headphones];
const formatoPreco = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function CategoryShortcuts({ categorias, selecionada, onSelecionar }) {
  return (
    <section className="categorias-atalhos" aria-label="Categorias de produtos">
      {categorias.slice(0, 9).map((categoria, index) => {
        const Icone = iconesCategoria[index % iconesCategoria.length];
        const ativa = categoria === selecionada;

        return (
          <button
            key={categoria}
            className={`categoria-atalho ${ativa ? 'selecionada' : ''}`}
            onClick={() => onSelecionar(ativa ? '' : categoria)}
          >
            <Icone size={27} />
            <span>{categoria}</span>
          </button>
        );
      })}
    </section>
  );
}

export function ProductCard({
  produto,
  favorito,
  podeEditar,
  onAdicionar,
  onEditar,
  onExcluir,
  onFavoritar,
}) {
  return (
    <article className="produto-card">
      <button
        className={`produto-favorito ${favorito ? 'ativo' : ''}`}
        aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        onClick={onFavoritar}
      >
        <Heart size={17} fill={favorito ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/produtos/${produto.id}`} className="produto-link">
        <div className="produto-visual">
          {produto.imagem_url ? (
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              className="produto-imagem"
              loading="lazy"
            />
          ) : (
            createElement(getIconePorCategoria(produto.categoria_nome), {
              size: 32,
              className: 'produto-icone',
            })
          )}
        </div>
        <h3>{produto.nome}</h3>
        <p className="produto-descricao">{produto.descricao}</p>
        <p className="produto-preco">{formatoPreco.format(Number(produto.preco))}</p>
        <p className="produto-categoria">{produto.categoria_nome}</p>
      </Link>

      <button className="btn-primary" onClick={() => onAdicionar(produto)}>
        Adicionar ao carrinho
      </button>

      {podeEditar && (
        <div className="produto-admin-acoes">
          <button className="btn-secondary" onClick={() => onEditar(produto)}>
            Editar
          </button>
          <button className="btn-danger" onClick={() => onExcluir(produto.id)}>
            Remover
          </button>
        </div>
      )}
    </article>
  );
}

export function PeripheralsBanner() {
  return (
    <section className="banner-perifericos" id="sobre">
      <div className="banner-teclas" aria-hidden="true">⌨</div>
      <div>
        <span>PERIFÉRICOS</span>
        <h2>Mais desempenho<br />para o seu setup.</h2>
        <p>Teclados, mouses, headsets e muito mais.</p>
      </div>
      <Link to="/categorias" className="btn-outline">
        Ver periféricos <ArrowRight size={15} />
      </Link>
      <div className="banner-mouse" aria-hidden="true">◉</div>
    </section>
  );
}

export function ShopFooter() {
  return (
    <footer className="site-footer" id="contato">
      <div className="footer-top">
        <div>
          <a href="/" className="footer-brand">
            <span className="brand-mark"><Smartphone size={18} /></span>
            VOLTARI
          </a>
          <p>Tecnologia que te acompanha.</p>
        </div>

        <div>
          <strong>Institucional</strong>
          <a href="#sobre">Sobre nós</a>
          <a href="#contato">Política de privacidade</a>
          <a href="#contato">Termos de uso</a>
        </div>

        <div>
          <strong>Ajuda</strong>
          <a href="#contato">Fale conosco</a>
          <a href="#contato">Trocas e devoluções</a>
          <a href="#contato">Perguntas frequentes</a>
        </div>

        <form className="newsletter" onSubmit={(event) => event.preventDefault()}>
          <strong>Receba novidades</strong>
          <p>Cadastre seu e-mail e fique por dentro das nossas ofertas.</p>
          <label>
            <input
              type="email"
              placeholder="Seu e-mail"
              aria-label="Seu e-mail"
              required
            />
            <button aria-label="Inscrever-se"><ArrowRight size={16} /></button>
          </label>
        </form>
      </div>

      <div className="footer-bottom">
        <span>© 2026 VOLTARI. Todos os direitos reservados.</span>
        <span className="pagamentos">VISA　●●　elo　◆ pix</span>
      </div>
    </footer>
  );
}

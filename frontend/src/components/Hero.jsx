import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard } from 'lucide-react';

function Hero({ produtos = [] }) {
  const destaques = produtos.filter((produto) => produto.imagem_url).slice(0, 4);

  return (
    <section className="hero">
      <div>
        <p className="hero-tag">Tecnologia sem limites</p>
        <h1 className="hero-titulo">
          Os melhores eletrônicos, em um <span>só lugar.</span>
        </h1>
        <p className="hero-descricao">
          Smartphones, notebooks, acessórios e muito mais, com qualidade e entrega rápida.
        </p>
        <Link to="/#produtos" className="btn-primary hero-cta">
          Ver produtos <ArrowRight size={18} />
        </Link>

        <div className="hero-beneficios">
          <div className="hero-beneficio">
            <Truck size={22} />
            <div>
              <strong>Frete rápido</strong>
              para todo o Brasil
            </div>
          </div>
          <div className="hero-beneficio">
            <ShieldCheck size={22} />
            <div>
              <strong>Compra segura</strong>
              seus dados protegidos
            </div>
          </div>
          <div className="hero-beneficio">
            <CreditCard size={22} />
            <div>
              <strong>Diversas formas</strong>
              de pagamento
            </div>
          </div>
        </div>
      </div>

      <div className="hero-imagem" aria-label="Produtos eletrônicos em destaque">
        {destaques.length ? (
          destaques.map((produto, index) => (
            <img
              key={produto.id}
              className={`hero-produto hero-produto-${index + 1}`}
              src={produto.imagem_url}
              alt=""
            />
          ))
        ) : (
          <div className="hero-fallback">VOLTARI<span>TECH</span></div>
        )}
        <span className="hero-glow" />
        <div className="hero-slider-dots" aria-hidden="true">
          <i /><i /><i />
        </div>
      </div>
    </section>
  );
}

export default Hero;

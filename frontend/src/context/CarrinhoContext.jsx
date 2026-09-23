import { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  const adicionar = (produto) => {
    setItens((atual) => {
      const existente = atual.find((item) => item.id === produto.id);
      if (existente) {
        return atual.map((item) =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...atual, { id: produto.id, nome: produto.nome, preco: parseFloat(produto.preco), quantidade: 1 }];
    });
  };

  const remover = (produtoId) => {
    setItens((atual) => atual.filter((item) => item.id !== produtoId));
  };

  const limpar = () => setItens([]);

  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  const quantidadeTotal = itens.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, remover, limpar, total, quantidadeTotal }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) throw new Error('useCarrinho precisa estar dentro de um CarrinhoProvider');
  return context;
}

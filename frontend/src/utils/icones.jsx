import {
  Smartphone,
  Shirt,
  UtensilsCrossed,
  Home,
  Book,
  Dumbbell,
  Gamepad2,
  Package,
} from 'lucide-react';

// Mapeia palavras-chave da categoria para um ícone
const mapa = [
  { palavras: ['eletr', 'tech', 'celular', 'informática'], icone: Smartphone },
  { palavras: ['roupa', 'moda', 'vestuário'], icone: Shirt },
  { palavras: ['aliment', 'comida', 'cozinha'], icone: UtensilsCrossed },
  { palavras: ['casa', 'decoração', 'móve'], icone: Home },
  { palavras: ['livro', 'papelaria'], icone: Book },
  { palavras: ['esporte', 'fitness', 'academia'], icone: Dumbbell },
  { palavras: ['jogo', 'game'], icone: Gamepad2 },
];

export function getIconePorCategoria(nomeCategoria) {
  if (!nomeCategoria) return Package;

  const nomeLower = nomeCategoria.toLowerCase();
  const encontrado = mapa.find(({ palavras }) =>
    palavras.some((palavra) => nomeLower.includes(palavra))
  );

  return encontrado ? encontrado.icone : Package;
}

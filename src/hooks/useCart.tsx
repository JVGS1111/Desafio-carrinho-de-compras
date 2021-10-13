import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      api.get(`products?id=${productId}`)
        .then(res => {
          if (!localStorage.getItem('@RocketShoes:cart')) {
            //caso localsotage nao exista cai nesta consdicao para crialo e evitar erro 
            localStorage.setItem('@RocketShoes:cart', JSON.stringify(res.data))

            setCart(res.data);
          } else {
            var cache = JSON.parse(localStorage.getItem('@RocketShoes:cart')!);
            //com o localstorage criado salva seus elementos ee intera com a resposta da api
            let localCache = [...cache, ...res.data];

            localStorage.setItem('@RocketShoes:cart', JSON.stringify(localCache))

            setCart(localCache);
          }
        })

      toast.success('Item adicionado com sucesso')

    } catch {
      toast.error('Não foi possivel salvar o item no carrinho')
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

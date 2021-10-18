
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { consultStock, getProduct } from '../services/useApi';
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
      const updateCart = [...cart];
      const productExists = updateCart.find(product => product.id === productId)

      const stock = await consultStock(productId)
      const stockAmount = stock.data.amount;
      const currentAmount = productExists ? productExists.amount : 0;
      const amount = currentAmount + 1

      if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if (productExists) {
        productExists.amount = amount;
      } else {
        const product = await getProduct(productId);
        const newProduct = {
          ...product.data,
          amount: 1
        }
        updateCart.push(newProduct);
      }
      setCart(updateCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart))
    } catch {

      toast.error('Erro na adição do produto');

    }
  };

  const removeProduct = (productId: number) => {
    try {
      let newCart = [...cart];
      const productExists = newCart.find(product => product.id === productId)

      if (!productExists) {
        toast.error('Erro na remoção do produto');
        return
      }
      const data = newCart.filter(item => {
        if (item.id != productId) {
          return item
        }
      })

      setCart(data);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(data));
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      let stock = await consultStock(productId);
      const stockAmount = stock.data.amount;
      let newCart = [...cart];
      const productExists = newCart.find(product => product.id === productId)

      if (!productExists) {
        toast.error('Erro na alteração de quantidade do produto');
        return
      }

      if (amount <= 0) {
        toast.error('Erro na adição do produto');
        return
      }

      if (stockAmount < amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      } else {
        newCart.map(item => {
          if (item.id === productId) {
            item.amount = amount;
          }
          return item
        })
      }

      setCart(newCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart));
    } catch {
      toast.error('Erro na alteração de quantidade do produto');

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

import { api } from "./api";


export async function consultStock(productId: number) {
    const stock = await api.get(`stock/${productId}`)

    return stock;
}

export async function getProduct(productId: number) {
    const product = await api.get(`products/${productId}`)

    return product;
}
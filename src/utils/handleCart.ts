import { ICart } from "@/common/types/cart.interface";

export const addToCartFc = ( carts : ICart[], itemCart : ICart) => {
   
  if(carts.some(item => item.id == itemCart.id)){
     return carts.map((item) => {
        if(item.id == itemCart.id){
            return {
                ...item,
                quantity : item.quantity + 1
            }
        }else {
            return item;
        }
     })
  }else {
    return [...carts, itemCart];
  }

}
export const getTotalIconCart = (carts : ICart[]) => {
    if(!carts) return 0;
  return carts.reduce((accumulator : number, item : ICart) => accumulator + item.quantity, 0);
}
export const getTotalPriceCart = (carts : ICart[]) => {
     return carts.reduce((accumulator, item) => accumulator + (item.quantity * Number(item.price_sale ?? item.price)), 0);
}
export const deleteCart = (carts : ICart[], id : number) => {
     return carts.filter((item) => item.id != id);
}

export const setQuantityCart = (carts : ICart[], id : number, quantity : number) => {
    return carts.map((item) => {
        if(item.id == id){
            return {
                ...item,
                quantity : quantity
            }
        }else {
            return item;
        }
     })
}
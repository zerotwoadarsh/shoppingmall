import { useState } from "react"
import { useQuery } from "react-query"
import axios from "axios"
import { Drawer, LinearProgress, Grid, Badge } from "@mui/material"
import { AddShoppingCart, Style } from "@mui/icons-material"
import { Wrapper, StyledButton } from "./App.styles"
import Items from "./components/Items/Items"
import Cart from "./components/Cart/Cart"

export type CartItemType = {
  id: number,
  category: string,
  description: string,
  image: string,
  price: number,
  title: string,
  amount: number,
}

const getProduct = async (): Promise<CartItemType[]> => {
  return (
    await (await fetch("https://fakestoreapi.com/products")).json()

  )
}

const getProduct1 = async (): Promise<CartItemType[]> => {
  return (
    await axios.get('https://fakestoreapi.com/products')
  )
  // console.log(getProduct1);
}
function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([] as CartItemType[])

  const { data, isLoading, error } = useQuery('products', getProduct);
  console.log(data);

  const totalItems = (items: CartItemType[]) => 
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id)

      if (isItemInCart) {
        return prev.map(item => (
          item.id === clickedItem.id
          ? { ...item, amount: item.amount + 1 }
          : item
        ))
      }
      return [...prev, { ...clickedItem, amount: 1 }]
    
    })
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => (
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }]
        } else {
          return [...ack, item]
        }
      }, [] as CartItemType[])
    ))
  };

  if (isLoading) {
    return <LinearProgress />
  }
  if (error) {
    return
    <div>Something went wrong</div>
  }


  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart cartItems={cartItems } addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart}>

        </Cart>
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={totalItems(cartItems)} color='error'>
          <AddShoppingCart />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item: CartItemType) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Items item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  )
}

export default App

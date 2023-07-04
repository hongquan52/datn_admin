import React from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import MainDash from '../components/MainDash/MainDash'
import Orders from '../components/Orders/Orders.'
import Review from '../components/Review/Review'
import Product from '../components/Products/Product'
import OrderDetail from '../components/Orders/OrderDetail'
import Customer from '../components/Customer/Customer'
import Statics from '../components/Statics/Statics'
import Login from '../components/Login/Login'
import NewCustomer from '../components/Customer/NewCustomer'
import ProductDetail from '../components/Products/ProductDetail'
import NewProduct from '../components/Products/NewProduct'
const Routers = () => {
  const orderId = useParams();
  console.log(orderId);
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<Login />} />
      <Route path='/home' element={<MainDash />} />
      <Route path='/order' element={<Orders />} />
      <Route path='order/:orderId' element={<OrderDetail />} />
      <Route path='/review' element={<Review />} />
      <Route path='/product' element={<Product />} />
      <Route path='/new-product' element={<NewProduct />} />
      <Route path='/product/:productId' element={<ProductDetail />} />
      <Route path='/customer' element={<Customer />} />
      <Route path='/new-customer' element={<NewCustomer />} />
      <Route path='/static' element={<Statics />} />
      
    </Routes>

  )
}

export default Routers
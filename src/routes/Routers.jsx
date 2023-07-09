import React, {Suspense} from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
// import MainDash from '../components/MainDash/MainDash'
// import Orders from '../components/Orders/Orders'
// import Review from '../components/Review/Review'
// import Product from '../components/Products/Product'
// import OrderDetail from '../components/Orders/OrderDetail'
// import Customer from '../components/Customer/Customer'
// import Statics from '../components/Statics/Statics'
// import Login from '../components/Login/Login'
// import NewCustomer from '../components/Customer/NewCustomer'
// import ProductDetail from '../components/Products/ProductDetail'
// import NewProduct from '../components/Products/NewProduct'

const Login = React.lazy(() => import('../components/Login/Login'));
const MainDash = React.lazy(() => import('../components/MainDash/MainDash'));
const Orders = React.lazy(() => import('../components/Orders/Orders.'));
const Review = React.lazy(() => import('../components/Review/Review'));
const Product = React.lazy(() => import('../components/Products/Product'));
const OrderDetail = React.lazy(() => import('../components/Orders/OrderDetail'));
const Customer = React.lazy(() => import('../components/Customer/Customer'));
const Statics = React.lazy(() => import('../components/Statics/Statics'));
const NewCustomer = React.lazy(() => import('../components/Customer/NewCustomer'));
const ProductDetail = React.lazy(() => import('../components/Products/ProductDetail'));
const NewProduct = React.lazy(() => import('../components/Products/NewProduct'));


const Routers = () => {
  const orderId = useParams();
  console.log(orderId);
  return (
    <Suspense fallback={<p>Loading.....</p>}>
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
    </Suspense>

  )
}

export default Routers
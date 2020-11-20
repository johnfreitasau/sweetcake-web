import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';

import ListCustomers from '../pages/Customers/ListCustomers';
import CreateCustomer from '../pages/Customers/CreateCustomer';
import EditCustommer from '../pages/Customers/EditCustomer';

import ListCategories from '../pages/Categories/ListCategories';
import CreateCategory from '../pages/Categories/CreateCategory';
import EditCategory from '../pages/Categories/EditCategory';

import ListProducts from '../pages/Products/ListProducts';
import CreateProduct from '../pages/Products/CreateProduct';
import EditProduct from '../pages/Products/EditProduct';

import ListOrders from '../pages/Orders/ListOrders';
import CreateOrder from '../pages/Orders/CreateOrder';
import CloseOrder from '../pages/Orders/CloseOrder';

import Settings from '../pages/Settings';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      <Route path="/customers" exact component={ListCustomers} isPrivate />
      <Route path="/customers/register" component={CreateCustomer} isPrivate />
      <Route path="/customers/edit/:id" component={EditCustommer} isPrivate />

      <Route path="/categories" exact component={ListCategories} isPrivate />
      <Route path="/categories/register" component={CreateCategory} isPrivate />
      <Route path="/categories/edit/:id" component={EditCategory} isPrivate />

      <Route path="/products" exact component={ListProducts} isPrivate />
      <Route path="/products/register" component={CreateProduct} isPrivate />
      <Route path="/products/edit/:id" component={EditProduct} isPrivate />

      <Route path="/orders" exact component={ListOrders} isPrivate />
      <Route path="/orders/register" component={CreateOrder} isPrivate />
      <Route path="/orders/details/:id" component={CloseOrder} isPrivate />

      <Route path="/settings" exact component={Settings} isPrivate />
      <Route path="/settings/signup" component={SignUp} isPrivate />

      <Route path="/profile" component={Profile} isPrivate />
    </Switch>
  );
};

export default Routes;

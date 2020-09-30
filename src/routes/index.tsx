import React from 'react';
import { Switch } from 'react-router-dom';

import { FiDownload } from 'react-icons/fi';
import Route from './Route';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

import ListCustomers from '../pages/Customers/ListCustomers';
import CreateCustomer from '../pages/Customers/CreateCustomer';
import EditCustommer from '../pages/Customers/EditCustomer';

import ListProducts from '../pages/Products/ListProducts';
import CreateProduct from '../pages/Products/CreateProduct';
import EditProduct from '../pages/Products/EditProduct';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />

      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />

      <Route path="/customers" exact component={ListCustomers} isPrivate />
      <Route path="/customers/register" component={CreateCustomer} isPrivate />
      <Route path="/customers/edit/:id" component={EditCustommer} isPrivate />

      <Route path="/products" exact component={ListProducts} isPrivate />
      <Route path="/products/register" component={CreateProduct} isPrivate />
      <Route path="/products/edit/:id" component={EditProduct} isPrivate />
    </Switch>
  );
};

export default Routes;

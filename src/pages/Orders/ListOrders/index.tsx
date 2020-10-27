import React, { useState, useCallback, useEffect } from 'react';
// import { Ring } from 'react-awesome-spinners';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import { useHistory } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Header from '../../../components/Header';
import api from '../../../services/api';

import ChangePageButton from '../../../components/ChangePageButton';
import { useToast } from '../../../hooks/toast';

import * as S from './styles';
// import Button from '../../../components/Button';

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  paymentMethod: string;
  paid: string;
  total: string;
}

interface SearchFormData {
  name: string;
}

const ListOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '123',
      customerName: 'John',
      orderDate: '24/10/2020 - 12:00PM',
      deliveryDate: '24/10/2020 - 12:00PM',
      status: 'Delivered',
      paymentMethod: 'Bank deposit',
      paid: 'OK',
      total: 'AU$ 34.56',
    },
    {
      id: '123',
      customerName: 'John',
      orderDate: '24/10/2020 - 12:00PM',
      deliveryDate: '24/10/2020 - 12:00PM',
      status: 'Delivered',
      paymentMethod: 'Bank deposit',
      paid: 'OK',
      total: 'AU$ 34.56',
    },
    {
      id: '123',
      customerName: 'John',
      orderDate: '24/10/2020 - 12:00PM',
      deliveryDate: '24/10/2020 - 12:00PM',
      status: 'Delivered',
      paymentMethod: 'Bank deposit',
      paid: 'OK',
      total: 'AU$ 34.56',
    },
    {
      id: '123',
      customerName: 'John',
      orderDate: '24/10/2020 - 12:00PM',
      deliveryDate: '24/10/2020 - 12:00PM',
      status: 'Delivered',
      paymentMethod: 'Bank deposit',
      paid: 'OK',
      total: 'AU$ 34.56',
    },
    {
      id: '123',
      customerName: 'John',
      orderDate: '24/10/2020 - 12:00PM',
      deliveryDate: '24/10/2020 - 12:00PM',
      status: 'Delivered',
      paymentMethod: 'Bank deposit',
      paid: 'OK',
      total: 'AU$ 34.56',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [pagesAvailable, setPagesAvailable] = useState(0);
  const [queryPage, setQueryPage] = useQueryParam('page', NumberParam);
  const [queryName, setQueryName] = useQueryParam('name', StringParam);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSearchSubmit = useCallback(
    ({ name }: SearchFormData) => {
      setQueryPage(1);
      setQueryName(name);
    },
    [setQueryName, setQueryPage],
  );

  const handleEditButton = useCallback(
    (order) => {
      history.push({
        pathname: `/orders/edit/${order.id}`,
        state: order,
      });
    },
    [history],
  );

  const handleDeleteButton = useCallback(
    (id) => {
      api.delete(`/orders/${id}`);

      // reload list
      async function loadOrders(): Promise<void> {
        try {
          setLoading(true);
          const response = await api.get<Order[]>('/orders', {
            params: {
              page: queryPage || 1,
              name: queryName || undefined,
            },
          });

          const totalCount = response.headers['x-total-count'];

          setPagesAvailable(Math.ceil(totalCount / 7));
          setOrders(response.data);
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Fetch error',
          });
        } finally {
          setLoading(false);
        }
      }
      loadOrders();
      // setCustomers(customers.filter((customer) => customer.id !== id));
    },
    [addToast, queryName, queryPage],
  );

  const incrementPage = useCallback(() => {
    setQueryPage((state) => (state || 1) + 1);
  }, [setQueryPage]);

  const decrementPage = useCallback(() => {
    setQueryPage((state) => (state || 2) - 1);
  }, [setQueryPage]);

  useEffect(() => {
    async function loadCustomers(): Promise<void> {
      try {
        setLoading(true);
        const response = await api.get<Order[]>('/orders', {
          params: {
            page: queryPage || 1,
            name: queryName || undefined,
          },
        });

        const totalCount = response.headers['x-total-count'];

        setPagesAvailable(Math.ceil(totalCount / 7));
        setOrders(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Fetch error',
        });
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [addToast, queryName, queryPage]);

  if (loading) {
    return (
      <S.Container>
        <S.Content>
          <S.MessageContainer>
            {/* <Ring size={100} color="#FBC131" /> */}
          </S.MessageContainer>
        </S.Content>
      </S.Container>
    );
  }

  if (orders.length === 0) {
    return (
      <S.Container>
        <S.Content>
          <Header
            initialName={queryName}
            onSubmit={handleSearchSubmit}
            createPage="/orders/register"
            title="Orders"
            placeholder="Search for the order"
          />
          <S.MessageContainer>
            <span>No orders found.</span>
          </S.MessageContainer>
        </S.Content>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Content>
        <Header
          initialName={queryName}
          onSubmit={handleSearchSubmit}
          createPage="/orders/register"
          title="Orders"
          placeholder="Search for the order"
        />
        <S.Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Payment Method</th>
              <th>Paid</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <S.CustomerRow key={order.id} orderStatus={order.status}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.orderDate}</td>
                <td>{order.deliveryDate}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.paid}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
                <td>
                  <div>
                    <FiEdit
                      size={20}
                      onClick={() => handleEditButton(order)}
                      title="Edit"
                    />

                    <FiTrash2
                      size={20}
                      title="Delete"
                      onClick={() => {
                        handleDeleteButton(order.id);
                      }}
                    />
                  </div>
                </td>
              </S.CustomerRow>
            ))}
          </tbody>
        </S.Table>

        <S.Pagination>
          {!(queryPage === 1 || !queryPage) && (
            <ChangePageButton
              changePageTo="decrement"
              onClick={decrementPage}
            />
          )}
          {!(pagesAvailable <= 1 || queryPage === pagesAvailable) && (
            <ChangePageButton
              changePageTo="increment"
              onClick={incrementPage}
              style={{ marginLeft: 'auto' }}
            />
          )}
        </S.Pagination>
      </S.Content>
    </S.Container>
  );
};

export default ListOrders;

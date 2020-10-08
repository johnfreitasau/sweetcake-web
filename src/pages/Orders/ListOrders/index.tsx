import React, { useState, useCallback, useEffect } from 'react';
// import { Ring } from 'react-awesome-spinners';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import { useHistory } from 'react-router-dom';
import { FiCheckCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import Header from '../../../components/Header';
import api from '../../../services/api';

import ChangePageButton from '../../../components/ChangePageButton';
import { useToast } from '../../../hooks/toast';

import * as S from './styles';
import Button from '../../../components/Button';

interface Order {
  id: string;
  CustomerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  orderTotal: string;
  orderStatus: string;
  orderDate: string;
  paid: boolean;
}

interface SearchFormData {
  name: string;
}

const ListOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '123',
      CustomerName: 'John',
      email: 'john.freitasau@gmail.com',
      phoneNumber: '333-444',
      address: '31 Sherwin Ave, Castle Hill',
      city: 'Sydney',
      postalCode: '2154',
      orderTotal: 'AU$ 34.56',
      orderStatus: 'Ready to pick-up',
      orderDate: '24/10/2020 - 12:00PM',
      paid: true,
    },
    {
      id: '123',
      CustomerName: 'John',
      email: 'john.freitasau@gmail.com',
      phoneNumber: '333-444',
      address: '31 Sherwin Ave, Castle Hill',
      city: 'Sydney',
      postalCode: '2154',
      orderTotal: 'AU$ 34.56',
      orderStatus: 'Ready to deliver',
      orderDate: '24/10/2020 - 12:00PM',
      paid: true,
    },
    {
      id: '123',
      CustomerName: 'John',
      email: 'john.freitasau@gmail.com',
      phoneNumber: '333-444',
      address: '31 Sherwin Ave, Castle Hill',
      city: 'Sydney',
      postalCode: '2154',
      orderTotal: 'AU$ 34.56',
      orderStatus: 'In progress',
      orderDate: '24/10/2020 - 12:00PM',
      paid: true,
    },
    {
      id: '123',
      CustomerName: 'John',
      email: 'john.freitasau@gmail.com',
      phoneNumber: '333-444',
      address: '31 Sherwin Ave, Castle Hill',
      city: 'Sydney',
      postalCode: '2154',
      orderTotal: 'AU$ 34.56',
      orderStatus: 'In progress',
      orderDate: '24/10/2020 - 12:00PM',
      paid: true,
    },
    {
      id: '123',
      CustomerName: 'John',
      email: 'john.freitasau@gmail.com',
      phoneNumber: '333-444',
      address: '31 Sherwin Ave, Castle Hill',
      city: 'Sydney',
      postalCode: '2154',
      orderTotal: 'AU$ 34.56',
      orderStatus: 'To be started',
      orderDate: '24/10/2020 - 12:00PM',
      paid: false,
    },
    {
      id: '123',
      CustomerName: 'John',
      email: 'john.freitasau@gmail.com',
      phoneNumber: '333-444',
      address: '31 Sherwin Ave, Castle Hill',
      city: 'Sydney',
      postalCode: '2154',
      orderTotal: 'AU$ 34.56',
      orderStatus: 'Completed',
      orderDate: '24/10/2020 - 12:00PM',
      paid: false,
    },
    {
      id: '123',
      CustomerName: 'John',
      email: 'john.freitasau@gmail.com',
      phoneNumber: '333-444',
      address: '31 Sherwin Ave, Castle Hill',
      city: 'Sydney',
      postalCode: '2154',
      orderTotal: 'AU$ 34.56',
      orderStatus: 'Completed',
      orderDate: '24/10/2020 - 12:00PM',
      paid: false,
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
              <th>&nbsp;</th>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Total</th>
              <th>Order Status</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <S.CustomerRow key={order.id} orderStatus={order.orderStatus}>
                <td>
                  {order.paid && (
                    <div>
                      <FiCheckCircle size={20} color="#39B60C" title="Paid" />
                    </div>
                  )}
                </td>
                <td>{order.id}</td>
                <td>{order.CustomerName}</td>
                <td>{order.email}</td>
                <td>{order.phoneNumber}</td>
                <td>{order.orderTotal}</td>
                <td>{order.orderStatus}</td>
                <td>{order.orderDate}</td>
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

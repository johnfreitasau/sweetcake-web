import React, { useState, useCallback, useEffect } from 'react';
import { Ellipsis } from 'react-awesome-spinners';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import { useHistory } from 'react-router-dom';
import { AiOutlineDollarCircle, AiFillDollarCircle } from 'react-icons/ai';
import { FiHome, FiTruck } from 'react-icons/fi';

import { format, parseISO } from 'date-fns';
import { formatPrice } from '../../../utils/format';
import Header from '../../../components/Header';
import api from '../../../services/api';

import ChangePageButton from '../../../components/ChangePageButton';
import { useToast } from '../../../hooks/toast';

import * as S from './styles';

interface Order {
  id: string;
  number: string;
  customer: Customer;
  customerId: string;
  created_at: string;
  orderDateFormatted: string;
  deliveryDate: string;
  deliveryDateFormatted: string;
  deliveryFee?: string;
  finalPrice: number;
  finalPriceFormatted: string;
  paymentMethod: string;
  isPaid: boolean;
  isPickup: boolean;
  status: string;
}

interface Customer {
  name: string;
}

interface SearchFormData {
  name: string;
}

const ListOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagesAvailable, setPagesAvailable] = useState(0);
  const [queryPage, setQueryPage] = useQueryParam('page', NumberParam);
  const [queryName, setQueryName] = useQueryParam('name', StringParam);

  const { addToast } = useToast();
  const history = useHistory();

  useEffect(() => {
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

        const formattedOrders = response.data.map((order) => {
          return {
            ...order,
            orderDateFormatted: format(
              parseISO(order.created_at),
              'dd/MM/yyyy hh:mm bb',
            ),
            deliveryDateFormatted: format(
              parseISO(order.deliveryDate),
              'dd/MM/yyyy hh:mm bb',
            ),
            finalPriceFormatted: formatPrice(order.finalPrice),
          };
        });

        setPagesAvailable(Math.ceil(totalCount / 7));
        setOrders(formattedOrders);
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
  }, [addToast, queryName, queryPage]);

  const handleSearchSubmit = useCallback(
    ({ name }: SearchFormData) => {
      setQueryPage(1);
      setQueryName(name);
    },
    [setQueryName, setQueryPage],
  );

  const incrementPage = useCallback(() => {
    setQueryPage((state) => (state || 1) + 1);
  }, [setQueryPage]);

  const decrementPage = useCallback(() => {
    setQueryPage((state) => (state || 2) - 1);
  }, [setQueryPage]);

  if (loading) {
    return (
      <S.Container>
        <S.Content>
          <S.MessageContainer>
            <Ellipsis size={100} color="#c8db37" />
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
              <th>Customer</th>
              <th>Order Date</th>
              <th>Due Date</th>
              <th>Payment Method</th>
              <th>Paid</th>
              <th>Pick-up</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <S.OrderRow
                key={order.id}
                orderStatus={order.status}
                onClick={() => {
                  history.push(`/orders/details/${order.id}`);
                }}
              >
                <td>{order.number}</td>
                <td>{order.customer.name}</td>
                <td>{order.orderDateFormatted}</td>
                <td>{order.deliveryDateFormatted}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  {order.isPaid === true && (
                    <div>
                      <AiFillDollarCircle size={20} title="Paid" />
                    </div>
                  )}
                  {order.isPaid === false && (
                    <div>
                      <AiOutlineDollarCircle size={20} title="Not Paid" />
                    </div>
                  )}
                </td>
                <td>
                  {order.isPickup === true && (
                    <div>
                      <FiHome size={20} title="Pickup" />
                    </div>
                  )}
                  {order.isPickup === false && (
                    <div>
                      <FiTruck size={20} title="Delivery" />
                    </div>
                  )}
                </td>
                <td>{order.finalPriceFormatted}</td>
                <td>
                  <div>{order.status}</div>
                </td>
              </S.OrderRow>
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

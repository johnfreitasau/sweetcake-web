import React, { useState, useCallback, useEffect } from 'react';
// import { Ring } from 'react-awesome-spinners';
import {
  NumberParam,
  useQueryParam,
  StringParam,
  BooleanParam,
} from 'use-query-params';
import { useHistory } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import {
  FcPaid,
  FcPodiumWithoutSpeaker,
  FcShipped,
  FcShop,
} from 'react-icons/fc';
import { format, parseISO } from 'date-fns';
import { formatPrice } from '../../../utils/format';
import Header from '../../../components/Header';
import api from '../../../services/api';

import ChangePageButton from '../../../components/ChangePageButton';
import { useToast } from '../../../hooks/toast';

import * as S from './styles';
// import Button from '../../../components/Button';

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

  const [queryCompleted, setQueryCompleted] = useQueryParam(
    'completed',
    BooleanParam,
  );

  const { addToast } = useToast();
  const history = useHistory();

  const handleDeleteButton = useCallback(
    async (id) => {
      await api.delete(`/orders/${id}`);

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
            };
          });

          setPagesAvailable(Math.ceil(totalCount / 7));
          setOrders(formattedOrders);
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Error',
            description: 'Error has ocurred. Please try again.',
          });
        } finally {
          setLoading(false);
        }
      }

      loadOrders();
    },
    [addToast, queryName, queryPage],
  );

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      try {
        // console.log('useEffect Started');
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

        // console.log('response.data:', response.data);
        // console.log('formattedResponse:', formattedOrders);

        setPagesAvailable(Math.ceil(totalCount / 7));
        setOrders(formattedOrders);
        // console.log('RESULT:', formattedOrders);
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

  // const handleEditButton = useCallback(
  //   (order) => {
  //     history.push({
  //       pathname: `/orders/edit/${order.id}`,
  //       state: order,
  //     });
  //   },
  //   [history],
  // );

  const incrementPage = useCallback(() => {
    setQueryPage((state) => (state || 1) + 1);
  }, [setQueryPage]);

  const decrementPage = useCallback(() => {
    setQueryPage((state) => (state || 2) - 1);
  }, [setQueryPage]);

  const handleToggleCompleted = useCallback(
    async (completed: boolean) => {
      if (queryCompleted === completed) return;

      setQueryPage(1);
      setQueryCompleted((state) => !state);
    },
    [setQueryCompleted, setQueryPage, queryCompleted],
  );

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
                  history.push(`/order/details/${order.id}`);
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
                      <FcPaid size={20} title="Paid" />
                    </div>
                  )}
                  {order.isPaid === false && (
                    <div>
                      <FcPodiumWithoutSpeaker size={20} title="Not Paid" />
                    </div>
                  )}
                </td>
                <td>
                  {order.isPickup === true && (
                    <div>
                      <FcShop size={20} title="Pickup" />
                    </div>
                  )}
                  {order.isPickup === false && (
                    <div>
                      <FcShipped size={20} title="Delivery" />
                    </div>
                  )}
                </td>
                <td>{order.finalPriceFormatted}</td>
                <td>{order.status}</td>
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
        <div>
          <S.CompletedFilterButton
            isSelected={!queryCompleted}
            onClick={() => handleToggleCompleted(false)}
          >
            Open
          </S.CompletedFilterButton>
          <S.CompletedFilterButton
            isSelected={!!queryCompleted}
            onClick={() => handleToggleCompleted(true)}
          >
            Closed
          </S.CompletedFilterButton>
        </div>
        ; ;{/* NEW */}
        {/* <S.Pagination>
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
        </S.Pagination> */}
        {/* {!(queryPage === 1 || !queryPage) && (
            <ChangePageButton
              changePageTo="decrement"
              onClick={decrementPage}
            />
          )} */}
        {/* {!(pagesAvailable <= 1 || queryPage === pagesAvailable) && (
            <ChangePageButton
              changePageTo="increment"
              onClick={incrementPage}
              style={{ marginLeft: 'auto' }}
            />
          )} */}
        {/* NEW END */}
      </S.Content>
    </S.Container>
  );
};

export default ListOrders;

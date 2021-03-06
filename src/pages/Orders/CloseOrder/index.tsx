import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Ellipsis } from 'react-awesome-spinners';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { FormHandles } from '@unform/core';

import { format, parseISO } from 'date-fns';
import api from '../../../services/api';

import { BackButton, DeleteButton } from '../../../components/Form';
import { currencyFormat } from '../../../utils/currencyFormat';
import CloseOrderButton from '../../../components/Form/CompleteOrderButton';
import { useToast } from '../../../hooks/toast';

import {
  Container,
  Content,
  MessageContainer,
  CustomerList,
  OrderList,
  ProductTable,
  ProductRow,
  FinalInformation,
} from './styles';

interface OrderData {
  id: string;
  number: number;

  paymentMethod: string;

  isPaid: boolean;
  isPaidFormatted: string;

  isPickup: boolean;
  isPickupFormatted: string;

  status: string;

  collect_price: number | null;
  collect_price_formatted: string;

  deliveryFee?: number;
  deliveryFeeFormatted?: string;

  finalPrice: number;
  finalPriceFormatted: string;

  unitPrice: number;
  unitPriceFomatted: number;

  created_at: string;
  createAtFormatted: string;

  deliveryDate: string;
  deliveryDateFormatted: string;

  customer: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
  };

  orderItems: Array<{
    id: string;
    quantity: number;
    qtyPrice: number;
    qtyPriceFormatted: string;

    product: {
      id: string;
      name: string;
      category: string;

      unitPrice: number;
      unitPriceFormatted: string;

      notes: string;
    };
  }>;
}

interface FormData {
  collect_price: number;
}

const CloseOrder: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [showForm, setShowForm] = useState(false);

  const theme = useTheme();
  const history = useHistory();
  const { id } = useParams();
  const { addToast } = useToast();

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    await api.put(`/orders/${id}/close`);
    setIsLoading(true);
    addToast({
      type: 'success',
      title: 'order closed successfully!',
    });
    history.goBack();
  }, [addToast, history, id]);

  useEffect(() => {
    async function loadOrder(): Promise<void> {
      try {
        const response = await api.get<OrderData>(`/orders/${id}`);
        const { data } = response;

        const createdAtDate = new Date(data.created_at);
        const dateFormated = createdAtDate.toLocaleDateString('en-AU');
        const timeFormated = createdAtDate.toLocaleTimeString('en-AU');
        const createAtFormatted = `${dateFormated} at ${timeFormated}`;

        const orderItems = data.orderItems.map((item) => ({
          ...item,
          qtyPriceFormatted: currencyFormat(item.qtyPrice),
          product: {
            ...item.product,
            unitPriceFormatted: currencyFormat(item.product.unitPrice),
          },
        }));

        setOrder({
          ...data,
          finalPriceFormatted: currencyFormat(data.finalPrice),
          createAtFormatted,
          orderItems,
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Order details error',
          description:
            'Error trying to load the order details. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [id, addToast]);

  const createdAtFormatted = useMemo(() => {
    return order?.deliveryDate
      ? format(parseISO(order?.created_at), 'dd/MM/yyyy hh:mm bb')
      : undefined;
  }, [order]);

  const deliveryDateFormatted = useMemo(() => {
    return order?.deliveryDate
      ? format(parseISO(order?.deliveryDate), 'dd/MM/yyyy hh:mm bb')
      : undefined;
  }, [order]);

  const deliveryFeeFormatted = useMemo(() => {
    return order?.deliveryFee ? currencyFormat(order?.deliveryFee) : undefined;
  }, [order]);

  const isPaidFormatted = useMemo(() => {
    return order?.isPaid === true ? 'YES' : 'NO';
  }, [order]);

  const isPickupFormatted = useMemo(() => {
    return order?.isPickup === true ? 'Pick-up' : 'Delivery';
  }, [order]);

  if (isLoading) {
    return (
      <Container>
        <Content>
          <header>
            <h1>ORDER</h1>

            <section>
              <BackButton />

              <CloseOrderButton
                disabled={!!order?.deliveryDate}
                isLoading={isLoading}
              />
            </section>
          </header>
        </Content>
        <MessageContainer>
          <Ellipsis size={100} color={theme.colors.orange} />
        </MessageContainer>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Content>
          <header>
            <h1>Order Details</h1>

            <section>
              <BackButton />

              <CloseOrderButton isLoading={isLoading} />
            </section>
          </header>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <header>
          <h1>{`${isPickupFormatted}  Order [#${order.number}]`}</h1>

          <section>
            <BackButton />
            {order.status !== 'Closed' && (
              <>
                <DeleteButton path={`/orders/${id}`} />
                <CloseOrderButton
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  showForm={showForm}
                />
              </>
            )}
          </section>
        </header>

        <CustomerList>
          <h1>Customer Details</h1>
          <tbody>
            <tr>
              <td>Name: </td>
              <td>{order.customer.name}</td>
            </tr>
            <tr>
              <td>EMail: </td>
              <td>{order.customer.email}</td>
            </tr>
            <tr>
              <td>Phone: </td>
              <td>{order.customer.phoneNumber}</td>
            </tr>
            <tr>
              <td>Address: </td>
              <td>{order.customer.address}</td>
            </tr>
            <tr>
              <td>City: </td>
              <td>{order.customer.city}</td>
            </tr>
            <tr>
              <td>Postal Code: </td>
              <td>{order.customer.postalCode}</td>
            </tr>
            <tr />
            {order.customer.notes && (
              <tr>
                <td>Notes: </td>
                <td>{order.customer.notes}</td>
              </tr>
            )}
          </tbody>
        </CustomerList>

        <OrderList>
          <h1>Order Details</h1>
          <tbody>
            <tr>
              <td>Created at: </td>
              <td>{createdAtFormatted}</td>
            </tr>
            <tr>
              <td>Due date: </td>
              <td>{deliveryDateFormatted}</td>
            </tr>
            <tr>
              <td>Paid: </td>
              <td>{isPaidFormatted}</td>
            </tr>
            <tr>
              <td>Payment Method: </td>
              <td>{order.paymentMethod}</td>
            </tr>
            <tr>
              <td>Delivery Fee: </td>
              <td>{deliveryFeeFormatted}</td>
            </tr>
          </tbody>
        </OrderList>

        <ProductTable>
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => (
              <ProductRow key={item.id}>
                <td>{item.product.name}</td>
                <td>{item.product.unitPriceFormatted}</td>
                <td>{item.quantity}</td>
                <td>{item.qtyPriceFormatted}</td>
              </ProductRow>
            ))}
          </tbody>
        </ProductTable>
        <FinalInformation>
          <span>
            {`TOTAL: ${
              order.finalPrice
                ? order.finalPriceFormatted
                : order.finalPriceFormatted
            }`}
          </span>
        </FinalInformation>
      </Content>
    </Container>
  );
};

export default CloseOrder;

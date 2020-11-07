import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Ring } from 'react-awesome-spinners';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { FormHandles } from '@unform/core';

import api from '../../../services/api';

import { BackButton, InputCurrency } from '../../../components/Form';
import { formatPrice } from '../../../utils/format';
import FinishOrderButton from '../../../components/FinishOrderButton';
import orderFinalPrice from '../../../utils/orderFinalPrice';
import { useToast } from '../../../hooks/toast';

import {
  Container,
  Content,
  MessageContainer,
  Customer,
  Line,
  Order,
  ProductTable,
  ProductRow,
  FinalInformation,
  Form,
  FinishButton,
} from './styles';

interface OrderData {
  id: string;
  number: number;

  collect_price: number | null;
  collect_price_formatted: string;

  deliveryFee?: number;
  deliveryFeeFormatted?: string;

  finalPrice: number;
  finalPriceFormatted: string;

  unitPrice: number;
  unitPriceFomatted: number;

  // final_price: number;
  // final_price_formatted: string;

  deliveryDate: Date | null;
  deliveryDateFormatted: string;

  created_at: string;
  created_at_formatted: string;

  customer: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    notes: string;
  };

  orderItems: Array<{
    id: string;
    quantity: number;
    qtyPrice: number;
    qtyPriceFormatted: string;
    finalPrice: number;
    finalPriceFormatted: string;

    product: {
      id: string;
      name: string;
      category: string;

      unitPrice: number;
      unitPriceFormatted: string;

      qtyDiscount: number;
      discount: number;
      notes: string;
    };
  }>;
}

interface FormData {
  collect_price: number;
}

const OrderDetails: React.FC = () => {
  console.log('Chamou OrdersDetails component');

  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { addToast } = useToast();
  const history = useHistory();

  const handleCollectPriceChange = useCallback(() => {
    const finalPrice = orderFinalPrice({
      // deliveryF: formRef.current?.getFieldValue('collect_price'),
      created_at: order?.created_at || '',
      unitPrice: order?.unitPrice || 0,
      deliveryFee: order?.deliveryFee || 0,
    });

    formRef.current?.setFieldValue('finalPrice', finalPrice);
  }, [order]);

  const theme = useTheme();
  const { id } = useParams();
  console.log('ID:', id);
  const toggleShowForm = useCallback(() => {
    setShowForm((state) => !state);
  }, []);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        setIsLoading(true);
        await api.put(`/orders/${id}/finish`, {
          collect_price: Number(data.collect_price),
        });
        setIsLoading(false);

        addToast({
          type: 'success',
          title: 'order completed successfully!',
        });
        history.goBack();
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Error to complete order.',
        });
      }
    },
    [id, addToast, history],
  );

  useEffect(() => {
    async function loadOrder(): Promise<void> {
      try {
        console.log('ORDERS DETAILS - useEffect');
        const response = await api.get<OrderData>(`/orders/${id}`);
        console.log(response);
        const { data } = response;
        console.log('DATA:', data);
        const createdAtDate = new Date(data.created_at);
        let dateFormated = createdAtDate.toLocaleDateString('en-AU');
        let timeFormated = createdAtDate.toLocaleTimeString('en-AU');
        const created_at_formatted = `${dateFormated} às ${timeFormated}`;

        const collectAt = new Date(data.deliveryDate || 0);
        dateFormated = collectAt.toLocaleDateString('en-AU');
        timeFormated = collectAt.toLocaleTimeString('en-AU');
        const collect_at_formatted = `${dateFormated} às ${timeFormated}`;

        const orderItems = data.orderItems.map((item) => ({
          ...item,
          qtyPriceFormatted: formatPrice(item.qtyPrice),
          product: {
            ...item.product,
            unitPriceFormatted: formatPrice(item.product.unitPrice),
          },
        }));

        setOrder({
          ...data,
          // deliveryFeeFormatted: formatPrice(data.deliveryFeeFormatted),
          // daily_total_price_formatted: formatPrice(data.),
          // collect_price_formatted: formatPrice(data.collect_price || 0),
          finalPriceFormatted: formatPrice(data.finalPrice),
          created_at_formatted,
          orderItems,
          // deliveryDateFormatted,
        });

        console.log('ORDER DETAILS - RESPONSE:', response);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Order details error',
          description:
            'Error trying to load the order details. Please try again.',
        });

        console.log('finished useEffect');
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [id, addToast]);

  if (isLoading) {
    return (
      <Container>
        <Content>
          <header>
            <h1>ORDER DETAILS</h1>

            <section>
              <BackButton />

              <FinishOrderButton
                disabled={!!order?.deliveryDate}
                isLoading={isLoading}
              />
            </section>
          </header>
        </Content>
        <MessageContainer>
          <Ring size={100} color={theme.colors.yellow} />
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

              <FinishOrderButton disabled={!order} isLoading={isLoading} />
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
          <h1>{`Order details - #${order.number}`}</h1>

          <section>
            <BackButton />
            <FinishOrderButton
              onClick={toggleShowForm}
              isLoading={isLoading}
              disabled={!!order.deliveryDate}
              showForm={showForm}
            />
          </section>
        </header>

        {showForm && (
          <Form ref={formRef} onSubmit={handleSubmit}>
            <InputCurrency disabled name="final_price" label="VALOR FINAL" />
            <InputCurrency
              name="collect_price"
              label="VALOR DE COLETA"
              placeholder="R$ 0,00"
              onKeyUp={handleCollectPriceChange}
              onFocus={handleCollectPriceChange}
              autoFocus
            />

            <FinishButton>Confirm</FinishButton>
          </Form>
        )}

        <Customer>
          <h1>Customer Details</h1>
          <section>
            <h2>{order.customer.name}</h2>
            {/* <Line /> */}
            <h2>{order.customer.email}</h2>
          </section>
          <section>
            <h2>{order.customer.phoneNumber}</h2>
            {/* <Line /> */}
            <h2>{order.customer.notes}</h2>
          </section>
        </Customer>

        <Order>
          <h1>Order Items</h1>
          <section>
            <h2>Delivery Fee</h2>
            {/* <Line /> */}
          </section>
          {/* {order.deliveryDate && (
            <section>
              <h2>Valor de coleta</h2>
              <Line />
              <h2>{order.collect_price_formatted}</h2>
            </section>
          )} */}
          <section>
            <h2>Pickup / Delivery Date</h2>
            {/* <Line /> */}
            <h2>{order.created_at_formatted}</h2>
          </section>
          {/* {order.deliveryDate && (
            <section>
              <h2>Data de devolução</h2>
              <Line />
              <h2>{order.deliveryDateFormatted}</h2>
            </section>
          )} */}
        </Order>

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
                <td>{item.finalPrice}</td>
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

export default OrderDetails;

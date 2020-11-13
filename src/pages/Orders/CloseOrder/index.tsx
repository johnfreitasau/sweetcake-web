import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Ellipsis } from 'react-awesome-spinners';
import { FiTrash2 } from 'react-icons/fi';
import { useParams, useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { FormHandles } from '@unform/core';

import api from '../../../services/api';

import {
  BackButton,
  DeleteButton,
  InputCurrency,
} from '../../../components/Form';
import { formatPrice } from '../../../utils/format';
import CloseOrderButton from '../../../components/CompleteOrderButton';
import orderFinalPrice from '../../../utils/orderFinalPrice';
import { useToast } from '../../../hooks/toast';

import {
  Container,
  Content,
  MessageContainer,
  CustomerList,
  Line,
  OrderList,
  ProductTable,
  ProductRow,
  FinalInformation,
  Form,
  CloseButton,
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

  // final_price: number;
  // final_price_formatted: string;

  createdAt: string;
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

      qtyDiscount: number;
      discount: number;
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

  const handleCollectPriceChange = useCallback(() => {
    const finalPrice = orderFinalPrice({
      // deliveryF: formRef.current?.getFieldValue('collect_price'),
      createdAt: order?.createdAt || '',
      unitPrice: order?.unitPrice || 0,
      deliveryFee: order?.deliveryFee || 0,
    });

    formRef.current?.setFieldValue('finalPrice', finalPrice);
  }, [order]);

  const handleSubmit = useCallback(
    async () => {
      setIsLoading(true);
      await api.put(`/orders/${id}/close`);
      setIsLoading(true);
      addToast({
        type: 'success',
        title: 'order closed successfully!',
      });
      history.goBack();
    },
    [addToast, history, id],
    // async (data: FormData) => {
    //   try {
    //     setIsLoading(true);
    //     await api.put(`/orders/${id}/close`, {
    //       collect_price: Number(data.collect_price),
    //     });
    //     setIsLoading(false);

    //     addToast({
    //       type: 'success',
    //       title: 'order completed successfully!',
    //     });
    //     history.goBack();
    //   } catch (err) {
    //     addToast({
    //       type: 'error',
    //       title: 'Error to complete order.',
    //     });
    //   }
    // },
    // [id, addToast, history],
  );

  // const handleDeleteButton = useCallback(async () => {
  //   await api.delete(`/orders/${id}`);

  //   history.goBack();

  //   // async function loadOrders(): Promise<void> {
  //   //   try {
  //   //     setLoading(true);
  //   //     const response = await api.get<Order[]>('/orders', {
  //   //       params: {
  //   //         page: queryPage || 1,
  //   //         name: queryName || undefined,
  //   //       },
  //   //     });

  //   //     const totalCount = response.headers['x-total-count'];

  //   //     const formattedOrders = response.data.map((order) => {
  //   //       return {
  //   //         ...order,
  //   //         orderDateFormatted: format(
  //   //           parseISO(order.created_at),
  //   //           'dd/MM/yyyy hh:mm bb',
  //   //         ),
  //   //         deliveryDateFormatted: format(
  //   //           parseISO(order.deliveryDate),
  //   //           'dd/MM/yyyy hh:mm bb',
  //   //         ),
  //   //         finalPriceFormatted: formatPrice(order.finalPrice),
  //   //       };
  //   //     });

  //   //     setPagesAvailable(Math.ceil(totalCount / 7));
  //   //     setOrders(formattedOrders);
  //   //   } catch (err) {
  //   //     addToast({
  //   //       type: 'error',
  //   //       title: 'Error',
  //   //       description: 'Error has ocurred. Please try again.',
  //   //     });
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }
  //   // }

  //   // loadOrders();
  // }, [addToast]);

  useEffect(() => {
    async function loadOrder(): Promise<void> {
      try {
        // console.log('ORDERS DETAILS - useEffect');
        const response = await api.get<OrderData>(`/orders/${id}`);
        // console.log(response);
        const { data } = response;
        console.log('DATA:', data);
        const createdAtDate = new Date(data.createdAt);
        let dateFormated = createdAtDate.toLocaleDateString('en-AU');
        let timeFormated = createdAtDate.toLocaleTimeString('en-AU');
        const createAtFormatted = `${dateFormated} at ${timeFormated}`;

        const deliveryDate = new Date(data.deliveryDate || 0);
        dateFormated = deliveryDate.toLocaleDateString('en-AU');
        timeFormated = deliveryDate.toLocaleTimeString('en-AU');
        const deliveryDateFormatted = `${dateFormated} at ${timeFormated}`;

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
          createAtFormatted,
          orderItems,
          // deliveryDateFormatted,
        });

        // console.log('ORDER DETAILS - RESPONSE:', response);
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

  const isPickupFormatted = useMemo(() => {
    return order?.isPickup === true ? 'Pick-up order' : 'Delivery';
  }, [order]);

  const isPaidFormatted = useMemo(() => {
    return order?.isPaid === true ? 'YES' : 'NO';
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
          <Ellipsis size={100} color={theme.colors.yellow} />
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

        {/* {showForm && (
          <Form ref={formRef} onSubmit={handleSubmit}>
            <InputCurrency disabled name="final_price" label="VALOR FINAL" />
            <InputCurrency
              name="collect_price"
              label="Total collect"
              placeholder="$ 0,00"
              onKeyUp={handleCollectPriceChange}
              onFocus={handleCollectPriceChange}
              autoFocus
            />

            <CloseButton>Confirm</CloseButton>
          </Form>
        )} */}

        <CustomerList>
          <h1>Customer Details</h1>
          <table>
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
          </table>
        </CustomerList>

        <OrderList>
          <h1>Order Details ({isPickupFormatted})</h1>
          <table>
            <tr>
              <td>Created at: </td>
              <td>{order.createAtFormatted}</td>
            </tr>
            <tr>
              <td>Due date: </td>
              <td>{order.deliveryDateFormatted}</td>
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
              <td>{order.deliveryFee}</td>
            </tr>
          </table>
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

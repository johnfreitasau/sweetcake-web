import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';

import api from '../../../services/api';
import { BackButton, RegisterButton } from '../../../components/Form';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import OrderForm from './components/OrderForm';
import ItemsForm from './components/ItemsForm';
import ItemsAddedCard from './components/ItemsAddedCard';
import { Container, Content } from './styles';

interface Product {
  id: string;
  name: string;
  category: number;
  quantity: string;
  unitPrice: number;
  unitPriceFormatted: string;
  notes: string;
}

interface OrderFormData {
  customerId: string;
  deliveryFee?: string;
  deliveryDate: string;
  paymentMethod: string;
  delivery_price?: string;
  isPaid: string;
  isPickup: string;
  checkboxOptions: string[];
}

const CreateOrder: React.FC = () => {
  const orderFormRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [itemsAdded, setItemsAdded] = useState<Product[]>([]);

  const handleButtonSubmit = useCallback(() => {
    orderFormRef.current?.submitForm();
  }, []);

  const handleRemoveMaterial = useCallback((id: string) => {
    setItemsAdded((state) => state.filter((product) => product.id !== id));
  }, []);

  const handleSubmit = useCallback(
    async (data: OrderFormData) => {
      try {
        orderFormRef.current?.setErrors({});

        const schema = Yup.object().shape({
          customerId: Yup.string().required('Customer is required'),
          delivery_price: Yup.string().default('0'),
          deliveryFee: Yup.string().default('0'),
          deliveryDate: Yup.string(),
          paymentMethod: Yup.string(),
          isPaid: Yup.string(),
          isPickup: Yup.string(),
          checkboxOptions: Yup.array(),
        });

        await schema.validate(data, { abortEarly: false });

        if (itemsAdded.length === 0) {
          addToast({
            title: 'You need to add items to this order.',
            type: 'error',
          });
          return;
        }

        const {
          customerId,
          deliveryFee,
          deliveryDate,
          paymentMethod,
          checkboxOptions,
        } = data;

        setSubmitIsLoading(true);
        await api.post('/orders', {
          customerId,
          deliveryFee,
          deliveryDate,
          paymentMethod,
          isPaid: checkboxOptions.indexOf('paid') > -1,
          isPickup: checkboxOptions.indexOf('pickup') > -1,
          products: itemsAdded.map((product) => ({
            id: product.id,
            quantity: product.quantity,
          })),
        });

        orderFormRef.current?.reset();
        setItemsAdded([]);

        history.goBack();

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'Order has been created.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          orderFormRef.current?.setErrors(errors);
        }
      } finally {
        setSubmitIsLoading(false);
      }
    },
    [itemsAdded, addToast, history],
  );

  return (
    <Container>
      <Content>
        <header>
          <h1>Create Order</h1>

          <section>
            <BackButton />

            <RegisterButton
              isLoading={submitIsLoading}
              onClick={handleButtonSubmit}
              label="Create"
            />
          </section>
        </header>

        <OrderForm onSubmit={handleSubmit} formRef={orderFormRef} />
        <ItemsForm addProduct={setItemsAdded} />
        {itemsAdded.length !== 0 && (
          <ItemsAddedCard
            products={itemsAdded}
            onClickRemoveButton={handleRemoveMaterial}
          />
        )}
      </Content>
    </Container>
  );
};

export default CreateOrder;

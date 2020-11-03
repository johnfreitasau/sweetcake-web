import React, { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';

import api from '../../../services/api';
import { BackButton, RegisterButton } from '../../../components/Form';
import { useToast } from '../../../hooks/toast';
import getValidationErrors from '../../../utils/getValidationErrors';
import ContractForm from './components/ContractForm';
import ItemsForm from './components/ItemsForm';
import ItemsAddedCard from './components/ItemsAddedCard';
import { Container, Content } from './styles';

// interface Product {
//   id: string;
//   quantity: string;
//   name: string;
//   daily_price: number;
//   quantity_daily_price_formatted: string;
// }

interface Product {
  id: string;
  name: string;
  category: number;
  quantity: string;
  unitPrice: number;
  unitPriceFormatted: string;
  qtyDiscount: number;
  discount: number;
  notes: string;
}

interface ContractFormData {
  customerId: string;
  delivery_price?: string;
}

const CreateOrder: React.FC = () => {
  const contractFormRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [itemsAdded, setItemsAdded] = useState<Product[]>([]);

  const handleButtonSubmit = useCallback(() => {
    contractFormRef.current?.submitForm();
  }, []);

  const handleRemoveMaterial = useCallback((id: string) => {
    setItemsAdded((state) => state.filter((product) => product.id !== id));
  }, []);

  const handleSubmit = useCallback(
    async (data: ContractFormData) => {
      try {
        contractFormRef.current?.setErrors({});

        const schema = Yup.object().shape({
          customerId: Yup.string().required('Customer is required'),
          delivery_price: Yup.string().default('0'),
        });

        await schema.validate(data, { abortEarly: false });

        if (itemsAdded.length === 0) {
          addToast({
            title: 'You need to add items to this order.',
            type: 'error',
          });
          return;
        }

        const { customerId, delivery_price = 0 } = data;

        setSubmitIsLoading(true);
        await api.post('/orders', {
          customerId,
          paymentMethod: 'Cash',
          isPaid: true,
          isPickup: false,
          deliveryFee: '2',
          deliveryDate: new Date(),
          products: itemsAdded.map((product) => ({
            id: product.id,
            quantity: product.quantity,
          })),
        });

        contractFormRef.current?.reset();
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

          contractFormRef.current?.setErrors(errors);
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
          <h1>Add new Order</h1>

          <section>
            <BackButton />

            <RegisterButton
              isLoading={submitIsLoading}
              onClick={handleButtonSubmit}
            />
          </section>
        </header>

        <ContractForm onSubmit={handleSubmit} formRef={contractFormRef} />

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

import React, { useCallback, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../../utils/getValidationErrors';
import { BackButton, RegisterButton } from '../../../components/Form';

import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';
import Input from '../../../components/Form/Input';
import { Container, Content } from './styles';

interface IProductFormData {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  qtyDiscount: number;
  discount: number;
  notes: string;
}

const CreateProduct: React.FC = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleSubmitButton = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: IProductFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          category: Yup.string().required(),
          unitPrice: Yup.number().required(),
          quantityDiscount: Yup.number().optional(),
          discount: Yup.number().optional(),
          notes: Yup.string().optional(),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          id,
          name,
          category,
          unitPrice,
          qtyDiscount,
          discount,
          notes,
        } = data;

        const formData = {
          id,
          name,
          category,
          unitPrice,
          qtyDiscount,
          discount,
          notes,
        };
        await api.post('/products', formData);
        // updateProduct(response.data);

        history.push('/products');

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'New product has been added.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
        addToast({
          type: 'error',
          title: 'Error',
          description:
            'Error ocurred while adding the new product. Please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Content>
        <header>
          <h1>Add a new Product</h1>

          <section>
            <BackButton />
            <RegisterButton
              isLoading={isLoading}
              onClick={handleSubmitButton}
            />
          </section>
        </header>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" placeholder="Product Name" />
          <Input name="category" placeholder="Category" />
          <Input name="unitPrice" placeholder="Unit price" />
          <Input name="qtyDiscount" placeholder="Quantity Discount" />
          <Input name="discount" placeholder="Discount" />
          <Input name="notes" placeholder="Notes" />
        </Form>
      </Content>
    </Container>
  );
};

export default CreateProduct;

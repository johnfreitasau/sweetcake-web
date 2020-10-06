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
  productName: string;
  category: string;
  unitPrice: string;
  quantityDiscount: string;
  discount: string;
  notes: string;
}

const CreateCustomer: React.FC = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleSubmitButton = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: IProductFormData) => {
      // formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          productName: Yup.string().required(),
          category: Yup.string().required(),
          unitPrice: Yup.string().required(),
          quantityDiscount: Yup.string(),
          discount: Yup.string(),
          notes: Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          id,
          productName,
          category,
          unitPrice,
          quantityDiscount,
          discount,
          notes,
        } = data;

        const formData = {
          id,
          productName,
          category,
          unitPrice,
          quantityDiscount,
          discount,
          notes,
        };
        const response = await api.post('/customers', formData);
        // updateCustomer(response.data);

        history.push('/customers');

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'New customer has been added.',
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
            'Error ocurred while adding the new customer. Please try again.',
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
          <Input name="productName" icon={FiUser} placeholder="Product Name" />
          <Input name="category" icon={FiMail} placeholder="Category" />
          <Input name="unitPrice" icon={FiPhone} placeholder="Unit Price" />
          <Input
            name="quantityDiscount"
            icon={FiMapPin}
            placeholder="Quantity Discount"
          />
          <Input name="discount" icon={FiMapPin} placeholder="Discount" />
          <Input name="notes" icon={FiMapPin} placeholder="Notes" />
        </Form>
      </Content>
    </Container>
  );
};

export default CreateCustomer;

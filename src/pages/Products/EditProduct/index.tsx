import React, { useCallback, useState, useRef, ChangeEvent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../../utils/getValidationErrors';
import { BackButton, SaveButton } from '../../../components/Form';

import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';
import Input from '../../../components/Form/Input';
import { Container, Content } from './styles';

interface IProductFormData {
  id: string;
  name: string;
  category: string;
  unitPrice: string;
  qtyDiscount: string;
  discount: string;
  notes: string;
}

const EditProduct: React.FC = () => {
  const productFormData = useLocation<IProductFormData>();

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
          notes: Yup.string().optional(),
        });

        await schema.validate(data, { abortEarly: false });

        const { id, name, category, unitPrice, notes } = data;

        const formData = {
          id,
          name,
          category,
          unitPrice,
          notes,
        };
        await api.put(`/products/${productFormData.state.id}`, formData);

        history.goBack();

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'Product has been saved.',
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
          <h1>Edit Product</h1>

          <section>
            <BackButton />
            <SaveButton isLoading={isLoading} onClick={handleSubmitButton} />
          </section>
        </header>

        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={productFormData.state}
        >
          <Input name="name" placeholder="Product Name" />
          <Input name="category" placeholder="Category" />
          <Input name="unitPrice" placeholder="Unit Price" />
          <Input name="notes" placeholder="Notes" />
        </Form>
      </Content>
    </Container>
  );
};

export default EditProduct;

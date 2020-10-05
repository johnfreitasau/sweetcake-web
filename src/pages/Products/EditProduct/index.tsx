import React, { useCallback, useState, useRef } from 'react';
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
  productName: string;
  category: string;
  unitPrice: string;
  quantityDiscount: string;
  discount: string;
  recipe: string;
  discontinued: string;
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
          productName: Yup.string().required(),
          category: Yup.string().required(),
          unitPrice: Yup.string().required(),
          quantityDiscount: Yup.string(),
          discount: Yup.string(),
          recipe: Yup.string(),
          discontinued: Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          id,
          productName,
          category,
          unitPrice,
          quantityDiscount,
          discount,
          recipe,
          discontinued,
        } = data;

        const formData = {
          id,
          productName,
          category,
          unitPrice,
          quantityDiscount,
          discount,
          recipe,
          discontinued,
        };
        const response = await api.put(
          `/products/${productFormData.state.id}`,
          formData,
        );

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
          <Input name="name" icon={FiUser} placeholder="Name" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input
            containerStyle={{ marginTop: 24 }}
            name="phoneNumber"
            icon={FiPhone}
            placeholder="Phone Number"
          />
          <Input name="address" icon={FiMapPin} placeholder="Address" />
          <Input name="city" icon={FiMapPin} placeholder="City" />
          <Input name="postalCode" icon={FiMapPin} placeholder="Portal Code" />
          <Input name="notes" icon={FiEdit} placeholder="Notes" />
        </Form>
      </Content>
    </Container>
  );
};

export default EditProduct;

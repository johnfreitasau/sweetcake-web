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

interface ICustomerFormData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

const EditCustomer: React.FC = () => {
  const customerFormData = useLocation<ICustomerFormData>();

  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleSubmitButton = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: ICustomerFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          email: Yup.string().required().email('Digit a valid e-mail.'),
          address: Yup.string(),
          phoneNumber: Yup.string(),
          city: Yup.string(),
          postalCode: Yup.string(),
          notes: Yup.string(),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          phoneNumber,
          address,
          city,
          postalCode,
          notes,
        } = data;

        const formData = notes
          ? {
              name,
              email,
              phoneNumber,
              address,
              city,
              postalCode,
              notes,
            }
          : {
              name,
              email,
              phoneNumber,
              address,
              city,
              postalCode,
            };
        const response = await api.put(
          `/customers/${customerFormData.state.id}`,
          formData,
        );

        history.goBack();

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'Customer has been saved.',
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
          <h1>Edit Customer</h1>

          <section>
            <BackButton />
            <SaveButton isLoading={isLoading} onClick={handleSubmitButton} />
          </section>
        </header>

        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={customerFormData.state}
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

export default EditCustomer;

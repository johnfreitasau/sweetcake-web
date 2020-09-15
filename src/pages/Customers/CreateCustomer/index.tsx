import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit,
  FiLock,
  FiCamera,
  FiArrowLeft,
  FiChevronLeft,
} from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';
import Input from '../../../components/Form/Input';
import Button from '../../../components/Button';
import { Container, Content, AvatarInput } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CreateCustomer: React.FC = () => {
  const { addToast } = useToast();

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      // formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),

          email: Yup.string()
            .required('Name is required.')
            .email('Digit a valid e-mail.'),

          oldPassword: Yup.string(),

          password: Yup.string().when('oldPassword', {
            is: (val) => !!val.length,
            then: Yup.string().required('Field is required.'),
            otherwise: Yup.string(),
          }),

          password_confirmation: Yup.string()
            .when('oldPassword', {
              is: (val) => !!val.length,
              then: Yup.string().required('Field is required.'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password')], 'The confirmation is incorrect.'),
        });

        await schema.validate(data, { abortEarly: false });

        const { name, email, phone, address } = data;

        const formData = {
          name,
          email,
          phone,
          address,
        };

        const response = await api.post('/customer', formData);

        // updateCustomer(response.data);

        // history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Success!.',
          description: 'Your profile has been updated.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          // const errors = getValidationErrors(err);

          // formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'Error',
          description:
            'Error ocurred with the Profile update. Please try again.',
        });
      }
    },
    [addToast],
  );

  return (
    <Content>
      <h1>New customer</h1>
      <Form
        // ref={formRef}
        // initialData={{
        //   name: user.name,
        //   email: user.email,
        // }}
        onSubmit={handleSubmit}
      >
        <Input name="name" icon={FiUser} placeholder="Name" />
        <Input name="email" icon={FiMail} placeholder="E-mail" />
        <Input
          containerStyle={{ marginTop: 24 }}
          name="phone"
          icon={FiPhone}
          placeholder="Phone"
        />
        <Input name="address" icon={FiMapPin} placeholder="Address" />
        <Input name="notes" icon={FiEdit} placeholder="Notes" />

        <Button type="submit">Add Customer</Button>
      </Form>
      <FiChevronLeft size={30} onClick={() => history.push(`/customers`)} />
    </Content>
  );
};

export default CreateCustomer;

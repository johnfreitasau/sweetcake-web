import React, { useCallback, useRef, useState } from 'react';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Form/Input';

import { Content, Container } from './styles';
import { useAuth } from '../../hooks/auth';
import { RegisterButton } from '../../components/Form';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmitButton = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      formRef.current?.setErrors({});

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

        const {
          name,
          email,
          oldPassword,
          password,
          password_confirmation,
        } = data;

        console.log('DATA:', data);
        console.log(
          'DATA DETAILED:',
          name,
          email,
          oldPassword,
          password,
          password_confirmation,
        );

        const formData = {
          name,
          email,
          ...(oldPassword
            ? {
                oldPassword,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        console.log('RESPONSE', response);

        updateUser(response.data);

        history.push('/orders');

        addToast({
          type: 'success',
          title: 'Success!.',
          description: 'Your profile has been updated.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

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
    [addToast, history, updateUser],
  );

  return (
    <>
      <Container>
        <Content>
          <header>
            <h1>My Profile</h1>

            <section>
              <RegisterButton
                isLoading={isLoading}
                onClick={handleSubmitButton}
                label="Update"
              />
              {/* <Button type="button" onClick={handleSubmitButton}>
                <FiUserCheck size={20} />
                Update Profile
              </Button> */}
            </section>
          </header>

          <Form
            ref={formRef}
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}
          >
            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              containerStyle={{ marginTop: 24 }}
              name="oldPassword"
              icon={FiLock}
              type="password"
              placeholder="Current Password"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="New Password"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Password Confirmation"
            />

            {/* <Button type="submit">Update Profile</Button> */}
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Profile;

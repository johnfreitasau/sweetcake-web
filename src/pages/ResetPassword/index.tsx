import React, { useRef, useCallback } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, useLocation } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Password required.'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password')],
            'Passwords must match',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const { password, password_confirmation } = data;

        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'Password Reset Error',
          description:
            'Error ocurred when trying to reset your password. Please try again.',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber Logo" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Reset Password</h1>

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
              <Button type="submit">Change Password</Button>
            </Form>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ResetPassword;

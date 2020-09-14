import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Form/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      formRef.current?.setErrors({});

      try {
        setLoading(true);

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Name is required.')
            .email('Digit a valid e-mail.'),
        });

        await schema.validate(data, { abortEarly: false });

        // recuperacao de senha
        await api.post('/password/forgot', { email: data.email });

        addToast({
          type: 'success',
          title: 'Password reset e-mail has been sent',
          description:
            'We have sent you an email to confirm complete your password reset. Please check your mailbox.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'Error in the password reset',
          description: 'Error in the password reset. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logoImg} alt="GoBarber Logo" />

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Forgot Password</h1>
              <Input name="email" icon={FiMail} placeholder="E-mail" />

              <Button loading={loading} type="submit">
                Reset
              </Button>
            </Form>

            <Link to="/">
              <FiLogIn />
              Back to Login page
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ForgotPassword;

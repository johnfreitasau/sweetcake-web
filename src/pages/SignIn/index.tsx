import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/cupcake-img.svg';

import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';

import { Container, FormContainer, AnimationContainer } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Name is required.')
            .email('Digit a valid e-mail.'),
          password: Yup.string().required('Password required.'),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/orders');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'Authentication error',
          description: 'Authentication error. Please check Credentials.',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <h1>cupcakes.co</h1>
      <FormContainer>
        <AnimationContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h2>Login</h2>
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Sign In</Button>
            <Link to="/forgot-password">Forgot my password</Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Create account
          </Link>
        </AnimationContainer>
      </FormContainer>
    </Container>
  );
};

export default SignIn;

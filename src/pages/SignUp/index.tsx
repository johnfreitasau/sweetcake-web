import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/cupcake-img.svg';

import Input from '../../components/Form/Input';
import Button from '../../components/Button';

import {
  Container,
  ImageContainer,
  Content,
  AnimationContainer,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          email: Yup.string()
            .required('Name is required.')
            .email('Digit a valid e-mail.'),
          password: Yup.string().required('Password required.'),
          // password: Yup.string().min(6, 'Password must be 6 characters long.'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'SignUp completed successfully.',
          description: 'You can now log on to the application.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'SignUp Error',
          description: 'Authentication error. Please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <Container>
        <ImageContainer>
          <img src={logoImg} alt="JustCupcakes" />
        </ImageContainer>

        <Content>
          <AnimationContainer>
            <h1>JustCupcakes</h1>

            <Form ref={formRef} onSubmit={handleSubmit}>
              <h2>Registration</h2>

              <Input name="name" icon={FiUser} placeholder="Name" />
              <Input name="email" icon={FiMail} placeholder="E-mail" />
              <Input
                name="password"
                icon={FiLock}
                type="password"
                placeholder="Password"
              />

              <Button type="submit">Sign Up</Button>
            </Form>

            <Link to="/">
              <FiArrowLeft />
              Back to the Login page
            </Link>
          </AnimationContainer>
        </Content>
      </Container>
    </>
  );
};

export default SignUp;

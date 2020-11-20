import React, { useCallback, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../../utils/getValidationErrors';
import { BackButton, RegisterButton } from '../../../components/Form';

import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';
import Input from '../../../components/Form/Input';
import { Container, Content } from './styles';

interface ICategoryFormData {
  id: string;
  name: string;
}

const CreateCategory: React.FC = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleSubmitButton = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: ICategoryFormData) => {
      formRef.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
        });

        await schema.validate(data, { abortEarly: false });

        const { id, name } = data;

        const formData = {
          id,
          name,
        };
        await api.post('/categories', formData);

        history.push('/categories');

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'New category has been added.',
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
            'Error ocurred while creating a new category. Please try again.',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Content>
        <header>
          <h1>Create Category</h1>

          <section>
            <BackButton />
            <RegisterButton
              isLoading={isLoading}
              onClick={handleSubmitButton}
              label="Create"
            />
          </section>
        </header>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" placeholder="Category Name" />
        </Form>
      </Content>
    </Container>
  );
};

export default CreateCategory;

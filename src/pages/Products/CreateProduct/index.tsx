import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../../utils/getValidationErrors';
import {
  BackButton,
  InputCurrency,
  RegisterButton,
  SelectAsyncInput,
} from '../../../components/Form';
import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';
import Input from '../../../components/Form/Input';
import { Container, Content } from './styles';

interface ICategoryOptions {
  value: string;
  label: string;
}

interface Category {
  id: string;
  name: string;
}

interface IProductFormData {
  id: string;
  name: string;
  categoryId: string;
  unitPrice: number;
  notes: string;
}

const CreateProduct: React.FC = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [categoriesPagesAvailable, setCategoriesPagesAvailable] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState<ICategoryOptions[]>([
    { value: '0015aeb4-3ee4-45c3-9dd9-5f8b30df6a0e', label: 'Sweets' },
  ]);
  const [optionsIsLoading, setOptionsIsLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleSubmitButton = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: IProductFormData) => {
      formRef.current?.setErrors({});
      console.log('Chegou AQUI1!');
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          categoryId: Yup.string().required(),
          unitPrice: Yup.number().required(),
          notes: Yup.string().optional(),
        });
        console.log('Chegou AQUI2!');
        await schema.validate(data, { abortEarly: false });

        const { id, name, categoryId, unitPrice, notes } = data;

        console.log('DATA:', id, name, categoryId, unitPrice, notes);

        const formData = {
          id,
          name,
          categoryId,
          unitPrice,
          notes,
        };
        await api.post('/products', formData);

        history.push('/products');

        addToast({
          type: 'success',
          title: 'Success!',
          description: 'New product has been added.',
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

  const handleLoadCategoryOptions = useCallback(
    async (inputValue: string, callback) => {
      const data = categoryOptions.filter((category) =>
        category.label.includes(inputValue),
      );

      if (data.length === 0) {
        setOptionsIsLoading(true);
        const response = await api.get<Category[]>('/categories', {
          params: {
            name: inputValue,
          },
        });

        setOptionsIsLoading(false);

        callback(
          response.data.map((category) => ({
            label: category.name,
            value: category.id,
          })),
        );
        return;
      }

      callback(data);
    },
    [categoryOptions],
  );

  const handleCategoriesMenuScrollToBottom = useCallback(async () => {
    if (categoriesPage === categoriesPagesAvailable) return;

    setOptionsIsLoading(true);
    const response = await api.get<Category[]>('/categories', {
      params: {
        page: categoriesPage + 1,
      },
    });

    setCategoryOptions((state) => [
      ...state,
      ...response.data.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ]);
    setCategoriesPage(categoriesPage + 1);
    setOptionsIsLoading(false);
  }, [categoriesPage, categoriesPagesAvailable]);

  useEffect(() => {
    // async function loadCategories(): Promise<void> {
    //   const response = await api.get('/categories');
    //   // categories.setCategories(categoriesResult.data);
    //   console.log('CATEGORY:', id, name);
    // }
    // loadCategories();

    async function loadCategoryOptions(): Promise<void> {
      const response = await api.get<Category[]>('/categories');

      const customersTotalCount = response.headers['x-total-count'];

      setCategoriesPagesAvailable(Math.ceil(customersTotalCount / 7));

      setCategoryOptions(
        response.data.map((category) => ({
          label: category.name,
          value: category.id,
        })),
      );

      setOptionsIsLoading(false);
    }
    // console.log('loaded UseEffect');

    loadCategoryOptions();
  }, []);

  return (
    <Container>
      <Content>
        <header>
          <h1>Create Product</h1>

          <section>
            <BackButton />
            <RegisterButton
              isLoading={isLoading}
              onClick={handleSubmitButton}
            />
          </section>
        </header>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" placeholder="Product Name" />
          {/* <Input name="category" placeholder="Category" /> */}
          <SelectAsyncInput
            placeholder="Category"
            label=""
            name="categoryId"
            defaultOptions={categoryOptions}
            loadOptions={handleLoadCategoryOptions}
            onMenuScrollToBottom={handleCategoriesMenuScrollToBottom}
            noOptionsMessage={() => 'Category not found'}
            isLoading={optionsIsLoading}
            select
          />
          {/* <Input name="unitPrice" placeholder="Unit price" /> */}
          <InputCurrency
            name="unitPrice"
            label=""
            placeholder="$ 0.00"
            autoFocus
          />

          <Input name="notes" placeholder="Notes" />
        </Form>
      </Content>
    </Container>
  );
};

export default CreateProduct;

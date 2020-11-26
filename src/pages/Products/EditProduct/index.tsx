import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../../utils/getValidationErrors';
import {
  BackButton,
  InputCurrency,
  SaveButton,
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
  categoryFormatted: string[];
  categoryId: string;
  unitPrice: string;
  notes: string;
}

const EditProduct: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [categoriesPagesAvailable, setCategoriesPagesAvailable] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState<ICategoryOptions[]>(
    [],
  );
  const [optionsIsLoading, setOptionsIsLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const productFormData = useLocation<IProductFormData>();
  const { addToast } = useToast();

  const handleSubmitButton = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: IProductFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          categoryId: Yup.string().optional(),
          unitPrice: Yup.number().required(),
          notes: Yup.string().optional(),
        });

        await schema.validate(data, { abortEarly: false });

        const { id, name, categoryId, unitPrice, notes } = data;
        const formData = {
          id,
          name,
          categoryId,
          unitPrice,
          notes,
        };
        await api.put(`/products/${productFormData.state.id}`, formData);
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
    [addToast, history, productFormData.state.id],
  );

  const handleLoadCategoryOptions = useCallback(
    async (inputValue: string, callback) => {
      const data = categoryOptions.filter((category) =>
        category.label.includes(inputValue),
      );

      if (data.length === 0) {
        setOptionsIsLoading(true);
        const response = await api.get<Category[]>('/categories', {});

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
    async function loadCategoryOptions(): Promise<void> {
      const response = await api.get<Category[]>('/categories');

      const customersTotalCount = response.headers['x-total-count'];

      setCategoriesPagesAvailable(Math.ceil(customersTotalCount / 10));

      setCategoryOptions(
        response.data.map((category) => ({
          label: category.name,
          value: category.id,
        })),
      );

      formRef.current?.setFieldValue('categoryId', {
        label: productFormData.state.categoryFormatted[0],
        value: productFormData.state.categoryId,
      });

      setOptionsIsLoading(false);
    }

    loadCategoryOptions();
  }, []);

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
          <Input name="name" placeholder="Product Name" />
          <div>
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
          </div>
          <div>
            <InputCurrency
              name="unitPrice"
              label=""
              placeholder="$ 0.00"
              autoFocus
            />
          </div>
          <Input name="notes" placeholder="Notes" />
        </Form>
      </Content>
    </Container>
  );
};

export default EditProduct;

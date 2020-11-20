import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import * as Yup from 'yup';
import { FiPlus } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import api from '../../../../../services/api';

import { SelectAsyncInput } from '../../../../../components/Form';
import getValidationErrors from '../../../../../utils/getValidationErrors';
import { currencyFormat } from '../../../../../utils/currencyFormat';

import { ProductsForm, QuantityInput, AddButton } from './styles';
import { useToast } from '../../../../../hooks/toast';

interface Product {
  id: string;
  name: string;
  category: number;
  quantity: string;
  unitPrice: number;
  unitPriceFormatted: string;
  notes: string;
}

interface Option {
  value: string;
  label: string;
}

interface FormData {
  id: string;
  quantity: string;
}

interface ItemsFormProps {
  addProduct: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ItemsForm: React.FC<ItemsFormProps> = ({ addProduct }) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const [productsPagesAvailable, setProductsPagesAvailable] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsPage, setProductsPage] = useState(1);
  const [optionsIsLoading, setOptionsIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const response = await api.get<Product[]>('/products');

      const productsTotalCount = response.headers['x-total-count'];

      setProductsPagesAvailable(Math.ceil(productsTotalCount / 10));
      setProducts(response.data);
      setOptionsIsLoading(false);
    }
    loadProducts();
  }, []);

  const productOptions = useMemo<Option[]>(() => {
    return products.map((product) => ({
      value: product.id,
      label: `${product.name} - ${currencyFormat(product.unitPrice)}`,
    }));
  }, [products]);

  const handleLoadProductsOptions = useCallback(
    async (inputValue: string, callback) => {
      const data = productOptions.filter((product) =>
        product.label.includes(inputValue),
      );

      if (data.length === 0) {
        setOptionsIsLoading(true);
        const response = await api.get<Product[]>('/products', {
          params: {
            name: inputValue,
          },
        });

        setOptionsIsLoading(false);

        callback(
          response.data.map((product) => ({
            label: product.name,
            value: product.id,
          })),
        );
        return;
      }

      callback(data);
    },
    [productOptions],
  );

  const handleProductsMenuScrollToBottom = useCallback(async () => {
    if (productsPage === productsPagesAvailable) return;

    setOptionsIsLoading(true);

    const response = await api.get<Product[]>('/products', {
      params: {
        page: productsPage + 1,
      },
    });

    setProducts((state) => [...state, ...response.data]);
    setProductsPage(productsPage + 1);
    setOptionsIsLoading(false);
  }, [productsPage, productsPagesAvailable]);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          id: Yup.string().required('Product is required.'),
          quantity: Yup.string().required('Quantity is required.'),
        });

        await schema.validate(data, { abortEarly: false });

        const { id, quantity } = data;

        const productFind = products.find(
          (product) => product.id === id,
        ) as Product;

        const addedProduct = {
          ...productFind,
          unitPriceFormatted: currencyFormat(
            Number(data.quantity) * productFind.unitPrice,
          ),
          quantity,
        } as Product;

        addProduct((state) => [...state, addedProduct]);
        formRef.current?.reset();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          addToast({
            title: 'You need to add items to this order.',
            type: 'error',
          });
        }
      }
    },
    [addProduct, products, addToast],
  );

  return (
    <ProductsForm ref={formRef} onSubmit={handleSubmit}>
      <SelectAsyncInput
        name="id"
        label="Product"
        placeholder="Choose the product"
        noOptionsMessage={() => 'No product found.'}
        defaultOptions={productOptions}
        loadOptions={handleLoadProductsOptions}
        onMenuScrollToBottom={handleProductsMenuScrollToBottom}
        isLoading={optionsIsLoading}
      />
      <QuantityInput
        name="quantity"
        label="Quantity"
        placeholder="Enter the quantity"
        type="number"
        showErro="border"
        min={1}
      />
      <AddButton type="submit">
        <FiPlus size={24} />
      </AddButton>
    </ProductsForm>
  );
};

export default ItemsForm;

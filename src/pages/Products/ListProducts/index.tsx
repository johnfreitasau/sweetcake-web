import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Ellipsis } from 'react-awesome-spinners';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import { useHistory } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Header from '../../../components/Header';
import api from '../../../services/api';

import ChangePageButton from '../../../components/Form/ChangePageButton';
import { useToast } from '../../../hooks/toast';

import * as S from './styles';
import { currencyFormat } from '../../../utils/currencyFormat';

interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryFormatted: string;
  unitPrice: number;
  unitPriceFormatted: string;
  notes: string;
}

interface Category {
  id: string;
  name: string;
}

interface SearchFormData {
  name: string;
}

const ListProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagesAvailable, setPagesAvailable] = useState(0);
  const [queryPage, setQueryPage] = useQueryParam('page', NumberParam);
  const [queryName, setQueryName] = useQueryParam('name', StringParam);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSearchSubmit = useCallback(
    ({ name }: SearchFormData) => {
      setQueryPage(1);
      setQueryName(name);
    },
    [setQueryName, setQueryPage],
  );

  const handleEditButton = useCallback(
    (product) => {
      history.push({
        pathname: `/products/edit/${product.id}`,
        state: product,
      });
    },
    [history],
  );

  const handleDeleteButton = useCallback(
    async (id) => {
      await api.delete(`/products/${id}`);

      async function loadProducts(): Promise<void> {
        try {
          setLoading(true);
          const response = await api.get<Product[]>('/products', {
            params: {
              page: queryPage || 1,
              name: queryName || undefined,
            },
          });

          const totalCount = response.headers['x-total-count'];

          setPagesAvailable(Math.ceil(totalCount / 10));
          setProducts(response.data);
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Fetch error',
          });
        } finally {
          setLoading(false);
        }
      }
      loadProducts();
    },
    [addToast, queryName, queryPage],
  );

  const incrementPage = useCallback(() => {
    setQueryPage((state) => (state || 1) + 1);
  }, [setQueryPage]);

  const decrementPage = useCallback(() => {
    setQueryPage((state) => (state || 2) - 1);
  }, [setQueryPage]);

  const formattedProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      unitPriceFormatted: currencyFormat(product.unitPrice),
      categoryFormatted: categories
        .filter((category) => {
          return category.id === product.categoryId;
        })
        .map((category) => category.name),
    }));
  }, [products, categories]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      try {
        setLoading(true);
        const response = await api.get<Product[]>('/products', {
          params: {
            page: queryPage || 1,
            name: queryName || undefined,
          },
        });

        const totalCount = response.headers['x-total-count'];

        setPagesAvailable(Math.ceil(totalCount / 10));
        setProducts(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Fetch error',
        });
      } finally {
        setLoading(false);
      }
    }

    loadProducts();

    async function getCategories(): Promise<void> {
      const categoriesResult = await api.get('/categories');

      setCategories(categoriesResult.data);
    }

    getCategories();
  }, [addToast, queryName, queryPage]);

  if (loading) {
    return (
      <S.Container>
        <S.Content>
          <S.MessageContainer>
            <Ellipsis size={100} color="#E67E22" />
          </S.MessageContainer>
        </S.Content>
      </S.Container>
    );
  }

  if (formattedProducts.length === 0) {
    return (
      <S.Container>
        <S.Content>
          <Header
            initialName={queryName}
            onSubmit={handleSearchSubmit}
            createPage="/products/register"
            title="Products"
            placeholder="Search for the product"
          />
          <S.MessageContainer>
            <span>No products found.</span>
          </S.MessageContainer>
        </S.Content>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Content>
        <Header
          initialName={queryName}
          onSubmit={handleSearchSubmit}
          createPage="/products/register"
          title="Products"
          placeholder="Search for the product"
        />
        <S.Table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formattedProducts.map((product) => (
              <S.CustomerRow key={product.id}>
                <td>{product.name}</td>
                <td>{product.categoryFormatted}</td>
                <td>{product.unitPriceFormatted}</td>
                <td>{product.notes}</td>
                <td>
                  <div>
                    <FiEdit
                      size={20}
                      onClick={() => handleEditButton(product)}
                    />

                    <FiTrash2
                      size={20}
                      onClick={() => {
                        handleDeleteButton(product.id);
                      }}
                    />
                  </div>
                </td>
              </S.CustomerRow>
            ))}
          </tbody>
        </S.Table>

        <S.Pagination>
          {!(queryPage === 1 || !queryPage) && (
            <ChangePageButton
              changePageTo="decrement"
              onClick={decrementPage}
            />
          )}
          {!(pagesAvailable <= 1 || queryPage === pagesAvailable) && (
            <ChangePageButton
              changePageTo="increment"
              onClick={incrementPage}
              style={{ marginLeft: 'auto' }}
            />
          )}
        </S.Pagination>
      </S.Content>
    </S.Container>
  );
};

export default ListProducts;

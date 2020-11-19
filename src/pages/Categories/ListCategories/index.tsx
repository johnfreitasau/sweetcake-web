import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Ellipsis } from 'react-awesome-spinners';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import { useHistory } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Header from '../../../components/Header';
import api from '../../../services/api';

import ChangePageButton from '../../../components/ChangePageButton';
import { useToast } from '../../../hooks/toast';

import * as S from './styles';
import Button from '../../../components/Button';
import { formatPrice } from '../../../utils/format';

interface Category {
  id: string;
  name: string;
}

interface SearchFormData {
  name: string;
}

const ListCategories: React.FC = () => {
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
    (category) => {
      history.push({
        pathname: `/categories/edit/${category.id}`,
        state: category,
      });
    },
    [history],
  );

  const handleDeleteButton = useCallback(
    async (id) => {
      await api.delete(`/categories/${id}`);

      async function loadCategories(): Promise<void> {
        try {
          setLoading(true);
          const response = await api.get<Category[]>('/categories', {
            params: {
              page: queryPage || 1,
              name: queryName || undefined,
            },
          });

          const totalCount = response.headers['x-total-count'];

          setPagesAvailable(Math.ceil(totalCount / 7));
          setCategories(response.data);
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Fetch error',
          });
        } finally {
          setLoading(false);
        }
      }
      loadCategories();
    },
    [addToast, queryName, queryPage],
  );

  const incrementPage = useCallback(() => {
    setQueryPage((state) => (state || 1) + 1);
  }, [setQueryPage]);

  const decrementPage = useCallback(() => {
    setQueryPage((state) => (state || 2) - 1);
  }, [setQueryPage]);

  useEffect(() => {
    async function loadCustomers(): Promise<void> {
      try {
        setLoading(true);
        const response = await api.get<Category[]>('/categories', {
          params: {
            page: queryPage || 1,
            name: queryName || undefined,
          },
        });

        const totalCount = response.headers['x-total-count'];

        setPagesAvailable(Math.ceil(totalCount / 7));
        setCategories(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Fetch error',
        });
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
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

  if (categories.length === 0) {
    return (
      <S.Container>
        <S.Content>
          <Header
            initialName={queryName}
            onSubmit={handleSearchSubmit}
            createPage="/categories/register"
            title="Categories"
            placeholder="Search for the Category"
          />
          <S.MessageContainer>
            <span>No Categories found.</span>
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
          createPage="/categories/register"
          title="Categories"
          placeholder="Search for the category"
        />
        <S.Table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <S.CustomerRow key={category.id}>
                <td>{category.name}</td>
                <td>
                  <div>
                    <FiEdit
                      size={20}
                      onClick={() => handleEditButton(category)}
                    />

                    <FiTrash2
                      size={20}
                      onClick={() => {
                        handleDeleteButton(category.id);
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

export default ListCategories;

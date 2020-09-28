import React, { useState, useCallback, useEffect } from 'react';
// import { Ring } from 'react-awesome-spinners';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import { useHistory } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Header from '../../../components/Header';
import api from '../../../services/api';

import ChangePageButton from '../../../components/ChangePageButton';
import { useToast } from '../../../hooks/toast';

import * as S from './styles';
import Button from '../../../components/Button';

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  notes: string;
}

interface SearchFormData {
  name: string;
}

const ListCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
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
    (customer) => {
      history.push({
        pathname: `/customers/edit/${customer.id}`,
        state: customer,
      });
    },
    [history],
  );

  const handleDeleteButton = useCallback(
    (id) => {
      api.delete(`/customers/${id}`);

      // reload list
      async function loadCustomers(): Promise<void> {
        try {
          setLoading(true);
          const response = await api.get<Customer[]>('/customers', {
            params: {
              page: queryPage || 1,
              name: queryName || undefined,
            },
          });

          const totalCount = response.headers['x-total-count'];

          setPagesAvailable(Math.ceil(totalCount / 7));
          setCustomers(response.data);
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
      // setCustomers(customers.filter((customer) => customer.id !== id));
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
        const response = await api.get<Customer[]>('/customers', {
          params: {
            page: queryPage || 1,
            name: queryName || undefined,
          },
        });

        const totalCount = response.headers['x-total-count'];

        setPagesAvailable(Math.ceil(totalCount / 7));
        setCustomers(response.data);
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
            {/* <Ring size={100} color="#FBC131" /> */}
          </S.MessageContainer>
        </S.Content>
      </S.Container>
    );
  }

  if (customers.length === 0) {
    return (
      <S.Container>
        <S.Content>
          <Header
            initialName={queryName}
            onSubmit={handleSearchSubmit}
            createPage="/customers/register"
            title="Customers"
            placeholder="Search for the customer"
          />
          <S.MessageContainer>
            <span>No customers found.</span>
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
          createPage="/customers/register"
          title="Customers"
          placeholder="Search for the customer"
        />
        <S.Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Notes</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <S.CustomerRow key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.notes}</td>
                <td>
                  <div>
                    <FiEdit
                      size={20}
                      onClick={() => handleEditButton(customer)}
                    />

                    <FiTrash2
                      size={20}
                      onClick={() => {
                        handleDeleteButton(customer.id);
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

export default ListCustomers;

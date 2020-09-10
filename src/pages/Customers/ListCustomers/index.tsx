import React, { useState, useCallback, useEffect } from 'react';
// import { Ring } from 'react-awesome-spinners';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params';
import { useHistory } from 'react-router-dom';
import Header from '../../../components/Header';

import api from '../../../services/api';

// import ChangePageButton from '../../../components/ChangePageButton';
import { useToast } from '../../../hooks/toast';

import * as S from './styles';
import Button from '../../../components/Button';

interface Client {
  id: string;
  name: string;
  cpf: string;
  phone_number: string;
}

interface SearchFormData {
  name: string;
}

const ListCustomers: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    { id: '123', name: 'John', cpf: '1234', phone_number: '041378744' },
    { id: '123', name: 'John', cpf: '1234', phone_number: '041378744' },
    { id: '123', name: 'John', cpf: '1234', phone_number: '041378744' },
    { id: '123', name: 'John', cpf: '1234', phone_number: '041378744' },
  ]);
  const [loading, setLoading] = useState(true);
  const [pagesAvailable, setPagesAvailable] = useState(0);
  const [queryPage, setQueryPage] = useQueryParam('page', NumberParam);
  const [queryName, setQueryName] = useQueryParam('name', StringParam);

  const { addToast } = useToast();
  const history = useHistory();

  const handleSearchSubmit = useCallback(
    ({ name }: SearchFormData) => {
      setQueryPage(1);
      setQueryName(name || undefined);
    },
    [setQueryName, setQueryPage],
  );

  const incrementPage = useCallback(() => {
    setQueryPage((state) => (state || 1) + 1);
  }, [setQueryPage]);

  const decrementPage = useCallback(() => {
    setQueryPage((state) => (state || 2) - 1);
  }, [setQueryPage]);

  useEffect(() => {
    async function loadClients(): Promise<void> {
      try {
        setLoading(true);
        const response = await api.get<Client[]>('/clients', {
          params: {
            page: queryPage || 1,
            name: queryName || undefined,
          },
        });

        const totalCount = response.headers['x-total-count'];

        setPagesAvailable(Math.ceil(totalCount / 7));
        setClients(response.data);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na busca',
        });
      } finally {
        setLoading(false);
      }
    }

    loadClients();
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

  if (clients.length === 0) {
    return (
      <S.Container>
        <S.Content>
          <S.MessageContainer>
            <span>Nenhum cliente foi encontrado.</span>
          </S.MessageContainer>
        </S.Content>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Content>
        <Button>Create</Button>
        <S.Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>address</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <S.ClientRow
                onClick={() => history.push(`/clients/edit/${client.id}`)}
                key={client.id}
              >
                <td>{client.name}</td>
                <td>{client.cpf}</td>
                <td>{client.phone_number}</td>
              </S.ClientRow>
            ))}
          </tbody>
        </S.Table>

        <S.Pagination>
          {!(queryPage === 1 || !queryPage) && (
            <h1>Hello</h1>
            //   <ChangePageButton
            //     changePageTo="decrement"
            //     onClick={decrementPage}
            //   />
            // )}
            // {!(pagesAvailable <= 1 || queryPage === pagesAvailable) && (
            //   <ChangePageButton
            //     changePageTo="increment"
            //     onClick={incrementPage}
            //     style={{ marginLeft: 'auto' }}
            //   />
          )}
        </S.Pagination>
      </S.Content>
    </S.Container>
  );
};

export default ListCustomers;

import React from 'react';
import { FiX } from 'react-icons/fi';

import { Container, Content, Table, MaterialRow, RemoveButton } from './styles';

interface Props {
  products: {
    id: string;
    name: string;
    category: number;
    quantity: string;
    unitPrice: number;
    unitPriceFormatted: string;
    notes: string;
  }[];
  onClickRemoveButton(id: string): void;
}

const ItemsAddedCard: React.FC<Props> = ({ products, onClickRemoveButton }) => {
  return (
    <Container>
      <span>Products Added</span>
      <Content>
        <Table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <MaterialRow key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.unitPriceFormatted}</td>
                <td>
                  <RemoveButton onClick={() => onClickRemoveButton(product.id)}>
                    <FiX size={20} />
                  </RemoveButton>
                </td>
              </MaterialRow>
            ))}
          </tbody>
        </Table>
      </Content>
    </Container>
  );
};

export default ItemsAddedCard;

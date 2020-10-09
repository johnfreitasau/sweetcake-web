import React from 'react';
import { FiX } from 'react-icons/fi';

import { Container, Content, Table, MaterialRow, RemoveButton } from './styles';

interface Props {
  products: {
    // id: string;
    // quantity: string;
    // name: string;
    // daily_price: number;
    // quantity_daily_price_formatted: string;

    id: string;
    productName: string;
    unitPrice: number;
    quantity: string;
    UnitPriceQuantityFormatted: string;
    discontinued: boolean;
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
                <td>{product.productName}</td>
                <td>{product.quantity}</td>
                <td>{product.UnitPriceQuantityFormatted}</td>
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

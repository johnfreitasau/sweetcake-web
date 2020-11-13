interface Data {
  createdAt: string;
  unitPrice: number;
  deliveryFee: number;
  // collect_price: number;
}

export default function orderFinalPrice(order: Data): number {
  const final_price = order.unitPrice * order.deliveryFee;

  return final_price;
}

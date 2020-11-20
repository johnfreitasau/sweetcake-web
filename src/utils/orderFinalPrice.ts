interface Data {
  created_at: Date;
  unitPrice: number;
  deliveryFee: number;
}

export default function orderFinalPrice(order: Data): number {
  const final_price = order.unitPrice * order.deliveryFee;

  return final_price;
}

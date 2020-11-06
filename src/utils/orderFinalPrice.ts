import { differenceInCalendarDays, parseISO } from 'date-fns';

interface Data {
  created_at: string;
  unitPrice: number;
  deliveryFee: number;
  // collect_price: number;
}

export default function contractFinalPrice(order: Data): number {
  const timeOffRent = differenceInCalendarDays(
    new Date(),
    parseISO(order.created_at),
  );

  const final_price = order.unitPrice * timeOffRent + order.deliveryFee;

  return final_price;
}

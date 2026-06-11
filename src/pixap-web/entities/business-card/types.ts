export type BusinessCardType = "featured" | "recommended";

export interface BusinessCard {
  id: string;
  name: string;
  image: string | null;
  category_id: string | null;
  address: string | null;
  rating: number | null;
  tags: string[] | null;
  description: string | null;
  booking_price: number | null;
  type: BusinessCardType;
  phone: string | null;
}

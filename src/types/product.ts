export interface Product {
  id: number;
  itemNumber?: number | null;
  description: string;
  brand?: string | null;
  model?: string | null;
  code?: string | null;
  tags: string[];
  imageUrl?: string | null;
  isAvailable: boolean;
}

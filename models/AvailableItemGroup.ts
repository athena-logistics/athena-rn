import { StockEntryStatus } from '../apollo/schema';

export interface AvailableItemGroup {
  id: string;
  name: string;
  children: AvailableItem[];
}

export interface AvailableItem {
  id: string;
  name: string;
  stock: number;
  status: StockEntryStatus;
}

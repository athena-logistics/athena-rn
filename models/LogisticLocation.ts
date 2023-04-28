import { StockItem } from './StockItem';

export interface LogisticLocation {
  id: string;
  name: string;
  status: string;
  stockItems: StockItem[];
}

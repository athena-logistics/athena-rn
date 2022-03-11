import { StockEntryStatus } from '../apollo/schema';

export interface LogisticLocation {
  id: string;
  name: string;
  status: StockEntryStatus;
}

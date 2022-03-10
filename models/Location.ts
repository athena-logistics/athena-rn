import { StockEntryStatus } from '../apollo/schema';

interface LogisticLocation {
  id: string;
  name: string;
  status: StockEntryStatus;
}

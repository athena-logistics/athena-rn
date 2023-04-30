import { StockEntry } from '../apollo/schema';

export type StockItem = Pick<
  StockEntry,
  'consumption' | 'movementIn' | 'movementOut' | 'status' | 'stock' | 'supply'
> & {
  name: string;
  id: string;
  itemGroupId: string;
  itemGroupName: string;
  locationId: string;
  locationName: string;
  unit: string;
  inverse: boolean;
  missingCount: number;
};

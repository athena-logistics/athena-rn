import { Item } from './Item';
import { StockItem } from './StockItem';

export interface AvailableItemGroup<Entry extends StockItem | Item> {
  id: string;
  name: string;
  children: Entry[];
}

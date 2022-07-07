export interface AvailableItemGroup {
  id: string;
  name: string;
  children: (StockItem | Item)[];
}

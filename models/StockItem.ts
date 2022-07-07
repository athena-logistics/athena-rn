interface StockItem {
  consumption: number;
  id: string;
  name: string;
  itemGroupId: string;
  itemGroupName: string;
  locationId: string;
  locationName: string;
  movementIn: number;
  movementOut: number;
  status: string;
  stock: number;
  supply: number;
  unit: string;
  inverse: boolean;
}

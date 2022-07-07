interface Item {
  id: string;
  name: string;
  unit: string;
  inverse: boolean;
  itemGroupId: string;
  itemGroupName: string;
  stock?: number;
}

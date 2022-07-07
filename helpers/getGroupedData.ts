import { AvailableItemGroup } from '../models/AvailableItemGroup';

export const getGroupedData = (itemList: (StockItem | Item)[]) => {
  let uniqueItemGroups: { [key: string]: ItemGroup } = {};
  itemList.forEach((d) => {
    uniqueItemGroups[d.itemGroupId] = {
      id: d.itemGroupId,
      name: d.itemGroupName,
    };
  });

  const availableItems: AvailableItemGroup[] = Object.values(uniqueItemGroups)
    .map((itemGroup) => ({
      name: itemGroup.name,
      id: itemGroup.id,
      children: itemList
        .filter((item) => item.itemGroupId === itemGroup.id)
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
        .sort((row1, row2) => row1.stock! - row2.stock!)
        .sort((row1, row2) => (row1.inverse ? -1 : 1)),
    }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  return availableItems;
};

import { AvailableItemGroup } from '../models/AvailableItemGroup';
import { Item } from '../models/Item';
import { ItemGroup } from '../models/ItemGroup';
import { StockItem } from '../models/StockItem';

export const getGroupedData = <Entry extends StockItem | Item>(
  itemList: Entry[]
) => {
  const uniqueItemGroups: { [key: string]: ItemGroup } = {};
  itemList.forEach((d) => {
    uniqueItemGroups[d.itemGroupId] = {
      id: d.itemGroupId,
      name: d.itemGroupName,
    };
  });

  const availableItems: AvailableItemGroup<Entry>[] = Object.values(
    uniqueItemGroups
  )
    .map((itemGroup) => ({
      name: itemGroup.name,
      id: itemGroup.id,
      children: itemList
        .filter((item) => item.itemGroupId === itemGroup.id)
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        ),
      // .sort((row1, row2) => row1.stock! - row2.stock!)
      // .sort((row1, row2) => (row1.inverse ? -1 : 1)),
    }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  return availableItems;
};

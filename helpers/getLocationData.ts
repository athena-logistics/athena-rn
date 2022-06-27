import { StockEntryStatus } from '../apollo/schema';
import { LogisticLocation } from '../models/LogisticLocation';

export const getLocationData = (allStock: StockItem[]) => {
  const locationData: LogisticLocation[] = [];

  allStock.forEach((stock) => {
    const index = locationData.findIndex(
      (location) => location.id === stock.locationId
    );
    if (index < 0) {
      locationData.push({
        id: stock.locationId,
        name: stock.locationName,
        status: stock.status,
      });
    } else {
      locationData[index].status = getNewStatus(
        locationData[index].status,
        stock.status
      );
    }
  });

  locationData.sort(
    (row1, row2) =>
      // @ts-ignore
      RowOrder.indexOf(row1.status) - RowOrder.indexOf(row2.status)
  );

  return locationData;
};

const RowOrder = [
  StockEntryStatus.Important,
  StockEntryStatus.Warning,
  StockEntryStatus.Normal,
];

const getNewStatus = (oldStatus: string, newStatus: string) => {
  if (
    oldStatus === StockEntryStatus.Important ||
    newStatus === StockEntryStatus.Important
  ) {
    return StockEntryStatus.Important;
  }
  if (
    oldStatus === StockEntryStatus.Warning ||
    newStatus === StockEntryStatus.Warning
  ) {
    return StockEntryStatus.Warning;
  }
  return StockEntryStatus.Normal;
};

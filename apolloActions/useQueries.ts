import { useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import {
  GET_ALL_LOCATION_STOCK,
  GET_EVENT_LOCATIONS,
  GET_LOCATION_STOCK,
} from '../apollo/queries';
import {
  GetAllLocationStockQuery,
  GetEventLocationsQuery,
  GetLocationStockQuery,
  StockEntryStatus,
} from '../apollo/schema';
import { getNodes } from '../helpers/apollo';
import { LogisticLocation } from '../models/LogisticLocation';
import {
  setAllLocationDataByLocation,
  setAllLocationDataByStuff,
  setLocationStockData,
} from '../store/actions/global.actions';

const RowOrder = [
  StockEntryStatus.Important,
  StockEntryStatus.Warning,
  StockEntryStatus.Normal,
];

const getNewStatus = (
  oldStatus: StockEntryStatus,
  newStatus: StockEntryStatus
) => {
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

export const useAllLocationStockQuery = (eventId: string) => {
  const dispatch = useDispatch();
  return useLazyQuery<GetAllLocationStockQuery>(GET_ALL_LOCATION_STOCK, {
    variables: { id: eventId },
    onCompleted: (data) => {
      if (data && data.event?.__typename === 'Event') {
        const rowData: OverviewRow[] = getNodes(data.event.stock)
          .map((stock) => ({
            id: stock.item.id + stock.location.id,
            itemName: stock.item.name,
            itemGroupName: stock.itemGroup.name,
            locationId: stock.location.id,
            locationName: stock.location.name,
            stock: stock.stock,
            supply: stock.supply,
            consumption: stock.consumption,
            movementIn: stock.movementIn,
            movementOut: stock.movementOut,
            status: stock.status,
          }))
          // .sort(
          //   (row1, row2) =>
          //     RowOrder.indexOf(row1.status) - RowOrder.indexOf(row2.status)
          .sort((row1, row2) => row1.stock - row2.stock);

        const locationData: LogisticLocation[] = [];

        getNodes(data.event.stock).forEach((stock) => {
          const index = locationData.findIndex(
            (location) => location.id === stock.location.id
          );
          if (index < 0) {
            locationData.push({
              id: stock.location.id,
              name: stock.location.name,
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
            RowOrder.indexOf(row1.status) - RowOrder.indexOf(row2.status)
        );

        dispatch(setAllLocationDataByLocation(locationData));
        dispatch(setAllLocationDataByStuff(rowData));
      }
    },
  });
};

export const useLocationStockQuery = (to: string | undefined) => {
  const dispatch = useDispatch();

  return useLazyQuery<GetLocationStockQuery>(GET_LOCATION_STOCK, {
    variables: { id: to },
    onCompleted: (data) => {
      if (data && data.node?.__typename === 'Location') {
        const itemGroupsById: { [key: string]: ItemGroup } = {};
        const itemById: { [key: string]: Item } = {};

        getNodes(data.node.stock).forEach((stock) => {
          itemGroupsById[stock.itemGroup.id] = stock.itemGroup;
          itemById[stock.item.id] = {
            ...stock.item,
            stock: stock.stock,
            requiredStock: '0',
            status: stock.status,
            itemGroupId: stock.itemGroup.id,
          };
        });

        const availableItems = Object.values(itemGroupsById)
          .map((itemGroup) => ({
            name: itemGroup.name,
            id: itemGroup.id,
            children: Object.values(itemById)
              .filter((item) => item.itemGroupId === itemGroup.id)
              .map((item) => ({
                id: item.id,
                name: `${item.name}`,
                stock: item.stock,
                status: item.status,
              }))
              .sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
              ),
          }))
          .sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );
        dispatch(
          setLocationStockData(to!, {
            itemById,
            itemGroupsById,
            availableItems,
          })
        );
      }
    },
  });
};

export const useLocationQuery = (eventId: string) => {
  return useQuery<GetEventLocationsQuery>(GET_EVENT_LOCATIONS, {
    variables: { id: eventId },
    skip: !eventId,
  });
};

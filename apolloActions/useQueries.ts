import { useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import {
  GET_ALL_STOCK,
  GET_EVENT_LOCATIONS,
  GET_LOCATION_STOCK,
} from '../apollo/queries';
import {
  GetAllStockQuery,
  GetEventLocationsQuery,
  GetLocationStockQuery,
} from '../apollo/schema';
import { getNodes } from '../helpers/apollo';
import {
  setAllStock,
  setLocationStockData,
} from '../store/actions/global.actions';

export const useAllStockQuery = (eventId: string) => {
  const dispatch = useDispatch();
  return useLazyQuery<GetAllStockQuery>(GET_ALL_STOCK, {
    variables: { id: eventId },
    onCompleted: (data) => {
      if (data && data.event?.__typename === 'Event') {
        const rowData: StockItem[] = getNodes(data.event.stock)
          .map((stock) => ({
            id: stock.item.id + stock.location.id,
            name: stock.item.name,
            itemGroupId: stock.itemGroup.id,
            itemGroupName: stock.itemGroup.name,
            locationId: stock.location.id,
            locationName: stock.location.name,
            stock: stock.stock,
            supply: stock.supply,
            consumption: stock.consumption,
            movementIn: stock.movementIn,
            movementOut: stock.movementOut,
            status: stock.status,
            unit: stock.item.unit,
          }))
          // .sort(
          //   (row1, row2) =>
          //     RowOrder.indexOf(row1.status) - RowOrder.indexOf(row2.status)
          .sort((row1, row2) => row1.stock - row2.stock);

        dispatch(setAllStock(rowData));
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
        const itemById: { [key: string]: StockItem } = {};

        getNodes(data.node.stock).forEach((stock) => {
          itemById[stock.item.id] = {
            id: stock.item.id,
            unit: stock.item.unit,
            stock: stock.stock,
            status: stock.status,
            itemGroupId: stock.itemGroup.id,
            itemGroupName: stock.itemGroup.name,
            name: stock.item.name,
            locationId: stock.location.id,
            locationName: stock.location.name,
            supply: stock.supply,
            consumption: stock.consumption,
            movementIn: stock.movementIn,
            movementOut: stock.movementOut,
          };
        });

        dispatch(
          setLocationStockData(to!, {
            itemById,
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

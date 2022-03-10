import { useLazyQuery, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import {
  GET_ALL_LOCATION_STOCK,
  GET_EVENT_LOCATIONS,
  GET_LOCATION_STOCK,
} from '../apollo/queries';
import {
  GetAllLocationStockQuery,
  GetEventQuery,
  GetLocationStockQuery,
  StockEntryStatus,
} from '../apollo/schema';
import { getNodes } from '../helpers/apollo';
import {
  setAllLocationData,
  setLocationStockData,
} from '../store/actions/global.actions';

const RowOrder = [
  StockEntryStatus.Important,
  StockEntryStatus.Warning,
  StockEntryStatus.Normal,
];

export const useAllLocationStockQuery = (eventId: string) => {
  const dispatch = useDispatch();
  console.log(eventId);
  return useLazyQuery<GetAllLocationStockQuery>(GET_ALL_LOCATION_STOCK, {
    variables: { id: eventId },
    onCompleted: (data) => {
      console.log('oncompleted');
      if (data && data.event?.__typename === 'Event') {
        const rowData: OverviewRow[] = getNodes(data.event.stock)
          .map((stock) => ({
            id: stock.item.id + stock.location.id,
            itemName: stock.item.name,
            itemGroupName: stock.itemGroup.name,
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

        dispatch(setAllLocationData(rowData));
      }
    },
  });
};

export const useLocationStockQuery = (to: string | undefined) => {
  const dispatch = useDispatch();

  return useQuery<GetLocationStockQuery>(GET_LOCATION_STOCK, {
    variables: { id: to },
    skip: !to,
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
            itemGroupId: stock.itemGroup.id,
          };
        });

        const availableItems = Object.values(itemGroupsById).map(
          (itemGroup) => ({
            name: itemGroup.name,
            id: itemGroup.id,
            children: Object.values(itemById)
              .filter((item) => item.itemGroupId === itemGroup.id)
              .map((item) => ({
                id: item.id,
                name: `${item.name}`,
                stock: item.stock,
              })),
          })
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
  return useQuery<GetEventQuery>(GET_EVENT_LOCATIONS, {
    variables: { id: eventId },
    skip: !eventId,
  });
};

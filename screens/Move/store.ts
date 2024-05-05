import { useReducer } from 'react';
import { ItemFragment } from '../../apollo/schema';

export interface ItemState {
  amount: number;
  item: ItemFragment | null;
}

interface MoveState {
  stuff: ItemState[];
}

export enum MoveActionType {
  Add,
  Change,
  Delete,
  Initialize,
  ResetTo,
}

export type AddStuffAction = {
  type: MoveActionType.Add;
};

export type ChangeStuffAction = {
  type: MoveActionType.Change;
  payload: {
    item: ItemState['item'];
    amount: ItemState['amount'];
    index: number;
  };
};

export type DeleteStuffAction = {
  type: MoveActionType.Delete;
  payload: {
    index: number;
  };
};
export type InitializeAction = {
  type: MoveActionType.Initialize;
};
export type ResetToAction = {
  type: MoveActionType.ResetTo;
  payload: MoveState;
};

export type MoveAction =
  | AddStuffAction
  | ChangeStuffAction
  | DeleteStuffAction
  | InitializeAction
  | ResetToAction;

export const defaultItem: ItemState = { item: null, amount: 1 };

function moveReducer(state: MoveState, action: MoveAction): MoveState {
  switch (action.type) {
    case MoveActionType.Add:
      return {
        ...state,
        stuff: state.stuff.concat(defaultItem),
      };

    case MoveActionType.Change:
      // eslint-disable-next-line no-case-declarations
      const stuffs1 = [...state.stuff];
      stuffs1.splice(action.payload.index, 1, {
        item: action.payload.item,
        amount: action.payload.amount,
      });
      return {
        ...state,
        stuff: stuffs1,
      };
    case MoveActionType.Delete:
      // eslint-disable-next-line no-case-declarations
      const stuffs2 = [...state.stuff];
      stuffs2.splice(action.payload.index, 1);
      return {
        ...state,
        stuff: stuffs2,
      };
    case MoveActionType.Initialize:
      return {
        ...state,
        stuff: [defaultItem],
      };
    case MoveActionType.ResetTo:
      return action.payload;
    default:
      return state;
  }
}

export function useItemStore(
  initialState: MoveState = {
    stuff: [{ ...defaultItem }],
  },
) {
  return useReducer(moveReducer, initialState);
}

import { REHYDRATE } from 'redux-persist/lib/constants';
import { accountActionTypes } from 'src/app/actions/accountAction';
import { getWalletByType } from "src/app/utils/helpers";

const initialState = {
  address: '',
  type: '',
  wallet: null
};

export default function accountReducer(state = initialState, action: any) {
  switch (action.type) {
    case REHYDRATE: {
      const lastData = action.payload;

      if (action.key === 'account' && lastData && lastData.type) {
        const wallet = getWalletByType(lastData.address, lastData.type);
        if (wallet) return {...state, wallet};
        return initialState;
      }

      return {...state}
    }
    case accountActionTypes.IMPORT_ACCOUNT: {
      const { address, wallet, type } = action.payload;

      return {
        ...state,
        address: address,
        wallet: wallet,
        type: type
      }
    }
    case accountActionTypes.CLEAR_ACCOUNT: {
      return initialState;
    }
    default:
      return state;
  }
}

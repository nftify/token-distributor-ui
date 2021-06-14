import { globalActionTypes } from 'src/app/actions/globalAction';

const initialState = {
  data: {},
  message: {
    isOpen: false,
    value: '',
    type: ''
  },
  contracts: [],
  selectedContract: {}
};

export default function globalReducer(state = initialState, action: any) {
  switch (action.type) {
    case globalActionTypes.SET_MESSAGE: {
      const { isOpen, message, type } = action.payload;

      return {
        ...state,
        message: {
          isOpen: isOpen,
          value: message ? message : state.message.value,
          type: type ? type : state.message.type
        }
      }
    }
    case globalActionTypes.SET_DATA: {
      return {
        ...state,
        data: action.payload
      }
    }
    case globalActionTypes.SET_CONTRACTS: {
      return {
        ...state,
        contracts: action.payload
      }
    }
    case globalActionTypes.SET_SELECTED_CONTRACT: {
      return {
        ...state,
        selectedContract: action.payload
      }
    }
    default:
      return state;
  }
}

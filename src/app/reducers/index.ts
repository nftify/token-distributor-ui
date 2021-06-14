import { combineReducers } from 'redux'
import { persistReducer } from "redux-persist";
import localStorage from 'redux-persist/lib/storage'
import accountReducer from "src/app/reducers/accountReducer";
import globalReducer from "src/app/reducers/globalReducer";

const rootReducer = combineReducers({
  global: persistReducer({
    key: 'global',
    storage: localStorage,
    whitelist: ['contracts', 'selectedContract']
  }, globalReducer),
  account: persistReducer({
    key: 'account',
    storage: localStorage,
    whitelist: ['address', 'type']
  }, accountReducer),
});

export default rootReducer

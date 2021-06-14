import { ContractType } from "src/app/types/tx-type";

export const globalActionTypes = {
  SET_MESSAGE: 'GLOBAL.SET_MESSAGE',
  SET_DATA: 'GLOBAL.SET_DATA',
  SET_CONTRACTS: 'GLOBAL.SET_CONTRACTS',
  SET_SELECTED_CONTRACT: 'GLOBAL.SET_SELECTED_CONTRACT',
};

export function setGlobalMessage(isOpen: boolean, message: string, type: string) {
  return {
    type: globalActionTypes.SET_MESSAGE,
    payload: { isOpen, message, type }
  }
}

export function setGlobalData(data: any) {
  return {
    type: globalActionTypes.SET_DATA,
    payload: data
  }
}

export function setContracts(contracts: ContractType[]) {
  return {
    type: globalActionTypes.SET_CONTRACTS,
    payload: contracts
  }
}

export function setSelectedContract(contract: ContractType) {
  return {
    type: globalActionTypes.SET_SELECTED_CONTRACT,
    payload: contract
  }
}
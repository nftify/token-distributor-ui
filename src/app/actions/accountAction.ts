export const accountActionTypes = {
  IMPORT_ACCOUNT: 'ACCOUNT.IMPORT_ACCOUNT',
  CLEAR_ACCOUNT: 'ACCOUNT.CLEAR_ACCOUNT',
};

export function importAccount(address: string, wallet: any, type: string) {
  return {
    type: accountActionTypes.IMPORT_ACCOUNT,
    payload: { address, wallet, type }
  }
}

export function clearAccount() {
  return {
    type: accountActionTypes.CLEAR_ACCOUNT
  }
}
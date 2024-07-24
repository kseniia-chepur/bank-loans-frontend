export enum ErrorMsg {
  FAILED_TO_CREATE = 'Failed to create new entity',
  FAILED_TO_LOGIN = 'Login failed. Please check your credentials',
  FAILED_TO_FETCH = 'Failed to fetch data',
  FAILED_TO_FETCH_BY_ID = 'Failed to fetch entity with id',
  FAILED_TO_UPDATE_BY_ID = 'Failed to update entity with id',
  FAILED_TO_DELETE_BY_ID = 'Failed to delete entity with id',
  DELETE_CLIENT_INFO = ' Please make sure that you have administrative rights and client has no existing loans',
  DELETE_LOANTYPE_INFO = 'Please make sure that you have administrative rights and there are no existing loans referencing to the selected type',
  DELETE_LOAN_INFO = 'Please make sure that selected loan has no debt obligations',
}

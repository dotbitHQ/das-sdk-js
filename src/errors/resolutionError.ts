import {ResolutionMethod} from '../types/publicTypes';
/**
 * Alias for Resolution error handler function
 * @internal
 */
type ResolutionErrorHandler = (error: ResolutionErrorOptions) => string;
/** Explains Resolution Error options */
type ResolutionErrorOptions = {
  providerMessage?: string;
  method?: ResolutionMethod;
  methodName?: string;
  account?: string;
  accountId?: string;
  currencyTicker?: string;
  recordName?: string;
  namingService?: string;
};

export enum ResolutionErrorCode {
  UnregisteredAccount = 'UnregisteredAccount',
  UnsupportedAccount = 'UnsupportedAccount',
  UnsupportedService = 'UnsupportedService',
  UnsupportedMethod = 'UnsupportedMethod',
  UnsupportedCurrency = 'UnsupportedCurrency',
  RecordNotFound = 'RecordNotFound',
  ServiceProviderError = 'ServiceProviderError',
}

/**
 * @internal
 * Internal Mapping object from ResolutionErrorCode to a ResolutionErrorHandler
 */
const HandlersByCode: Record<ResolutionErrorCode, (params: ResolutionErrorOptions) => string> = {
  [ResolutionErrorCode.UnregisteredAccount]: (params: ResolutionErrorOptions) =>
    `Account ${params.account} is not registered`,
  [ResolutionErrorCode.UnsupportedAccount]: (params: ResolutionErrorOptions) =>
    `Account ${params.account} is not supported`,
  [ResolutionErrorCode.UnsupportedMethod]: (params: ResolutionErrorOptions) => `Method ${params.methodName} is not supported for ${params.account}`,

  [ResolutionErrorCode.UnsupportedCurrency]: (params: ResolutionErrorOptions) => `${params.currencyTicker} is not supported`,
  [ResolutionErrorCode.RecordNotFound]: (params: ResolutionErrorOptions) => `No ${params.recordName} record found for ${params.account}`,
  [ResolutionErrorCode.ServiceProviderError]: (params: ResolutionErrorOptions) => `< ${params.providerMessage} >`,
  [ResolutionErrorCode.UnsupportedService]: (params: ResolutionErrorOptions) =>
    `Naming service ${params.namingService} is not supported`,
};

/**
 * Resolution Error class is designed to control every error being thrown by Resolution
 * @param code - Error Code
 * - UnsupportedAccount - account is not supported by current Resolution instance
 * - UnregisteredAccount - account is not owned by any address
 * - UnspecifiedResolver - account has no resolver specified
 * - UnspecifiedCurrency - account resolver doesn't have any address of specified currency
 * - UnsupportedCurrency - currency is not supported
 * - IncorrectResolverInterface - ResolverInterface is incorrected
 * - RecordNotFound - No record was found
 * @param account - Account that was being used
 * @param method
 */
export class ResolutionError extends Error {
  readonly code: ResolutionErrorCode;
  readonly account?: string;
  readonly method?: string;
  readonly currencyTicker?: string;

  constructor(code: ResolutionErrorCode, options: ResolutionErrorOptions = {}) {
    const resolutionErrorHandler: ResolutionErrorHandler = HandlersByCode[code];
    const {account, method, currencyTicker} = options;
    const message = resolutionErrorHandler(options);

    super(message);
    this.code = code;
    this.account = account;
    this.method = method;
    this.currencyTicker = currencyTicker;
    this.name = 'ResolutionError';
    Object.setPrototypeOf(this, ResolutionError.prototype);
  }
}
export default ResolutionError;

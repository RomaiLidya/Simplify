class ErrorBase extends Error {
  private errorCode: number;
  private httpStatusCode: number;

  public constructor(message: string, errorCode: number, httpStatusCode: number) {
    super(message);

    this.errorCode = errorCode;
    this.httpStatusCode = httpStatusCode;
  }

  public getMessage() {
    return this.message;
  }

  public getErrorCode() {
    return this.errorCode;
  }

  public getHttpStatusCode() {
    return this.httpStatusCode;
  }
}

export default ErrorBase;

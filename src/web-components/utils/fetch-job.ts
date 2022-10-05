import { withMinLoadTime } from "./with-min-load-time";

type FetchJobResponse = {
  data: string;
  response: Response;
};

export class FetchCancelledError extends Error {
  static is(error: Error): error is FetchCancelledError {
    return "_isCancelledError" in error;
  }
  _isCancelledError = true;
}

export class FetchJob {
  private _promise?: Promise<FetchJobResponse>;
  private _result?: FetchJobResponse | Error;
  private _abort = new AbortController();
  private _isCancelled = false;
  private _isFinished = false;

  constructor(
    public readonly url: string,
    public readonly options: RequestInit,
    public readonly minimumLoadTime?: number
  ) {}

  private getResult(): FetchJobResponse {
    if (this._isCancelled) {
      throw new FetchCancelledError("FetchJob cancelled");
    }

    if (!this._result) {
      throw new Error("FetchJob not finished.");
    }

    if (this._result instanceof Error) {
      throw this._result;
    }

    return this._result;
  }

  public async start(): Promise<FetchJobResponse> {
    if (!this._promise) {
      this._promise = withMinLoadTime(
        () =>
          fetch(this.url, {
            ...this.options,
            signal: this._abort.signal,
          }).then(
            async (response): Promise<FetchJobResponse> => ({
              data: await response.text(),
              response,
            })
          ),
        this.minimumLoadTime
      );
    } else {
      throw new Error("FetchJob already started");
    }

    await this._promise
      .then((r) => {
        this._result = r;
      })
      .catch((e) => {
        this._result = e;
      });

    this._isFinished = true;

    return this.getResult();
  }

  public async cancel() {
    if (!this._isFinished) {
      this._isCancelled = true;
      this._abort.abort();
    }
  }
}

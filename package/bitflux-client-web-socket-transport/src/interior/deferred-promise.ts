export class DeferredPromise<TResult = unknown> {
  public promise: Promise<TResult>

  public resolve: (value: PromiseLike<TResult> | TResult) => void

  public reject: (reason?: unknown) => void

  public constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

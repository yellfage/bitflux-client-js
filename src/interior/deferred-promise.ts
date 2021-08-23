export class DeferredPromise<TResult = any> {
  public promise: Promise<TResult>

  public resolve: (value: TResult | PromiseLike<TResult>) => void
  public reject: (reason?: any) => void

  public constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

declare module 'promise-throttle' {
  export default class PromiseThrottle {
    constructor(options: any)
    add(promise: any, options?: any): any
    addAll(promises: any, options?: any): any
    dequeue(): void
  }
}

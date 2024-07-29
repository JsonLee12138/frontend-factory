import { Interceptor, InterceptorManagerInstance } from "./types";

class InterceptorManager<T = any> implements InterceptorManagerInstance<T> {
  private handlers: Interceptor<T>[] = [];
  constructor(){
    this.use = this.use.bind(this);
    this.run = this.run.bind(this);
  }
  use<R = any>(interceptor: Interceptor<T, R>) {
    this.handlers.push(interceptor);
  }

  async run(config: T): Promise<any> {
    for (const handler of this.handlers) {
      config = await handler(config);
    }
    return config;
  }
}

export default InterceptorManager;

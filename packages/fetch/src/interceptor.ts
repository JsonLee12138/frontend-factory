import { Interceptor, InterceptorManagerInstance } from "./types";

class InterceptorManager<T = any> implements InterceptorManagerInstance<T> {
  private handlers: Interceptor<T>[] = [];
  constructor(){
    this.use = this.use.bind(this);
    this.run = this.run.bind(this);
  }
  use(interceptor: Interceptor<T>) {
    this.handlers.push(interceptor);
  }

  async run(config: T): Promise<T> {
    for (const handler of this.handlers) {
      config = await handler(config);
    }
    return config;
  }
}

export default InterceptorManager;

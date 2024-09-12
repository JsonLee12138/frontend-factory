export interface KeyConfig {
  source: string;
  target: string;
}

export type ArrTransformFormat<T = AnyObject> = Record<string, string | ((item: T) => any)>;

export interface GroupOptions {
  groupBy?: string;
  keyIsObject?: boolean;
}

export interface FlatEachOptions {
  childrenKey: string;
}

export interface FlatFilterByChildrenOptions {
  childrenKey?: string;
  deep?: boolean;
}

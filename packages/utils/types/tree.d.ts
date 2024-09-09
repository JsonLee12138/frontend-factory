export interface TreeBindingOptions {
  idKey: string;
  parentKey: string;
  childrenKey: string;
}

export interface TreeFlattenOptions {
  childrenKey: string;
  keepChildren: boolean;
}

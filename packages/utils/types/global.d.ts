export type PropertyKey = string | number | symbol;

export type AnyObject<T extends PropertyKey = PropertyKey> = Record<T, any>;

export type BaseType = string | number | boolean | null | undefined;

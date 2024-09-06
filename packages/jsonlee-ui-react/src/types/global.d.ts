import type { ReactNode, RefAttributes } from "react";

export type PropertyKey = string | number | symbol;

export type AnyObject<T extends PropertyKey = PropertyKey> = Record<T, any>;

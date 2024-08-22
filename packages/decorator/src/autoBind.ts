import {Constructor} from "./types";

export const autoBind = <T extends Constructor<T>>(target: any, context?: any) => {
    const originPrototype = target.prototype;
    const propertyNames = Object.getOwnPropertyNames(originPrototype).filter((name)=> name !== 'constructor')
    for (const propertyName of propertyNames) {
        const descriptor = Object.getOwnPropertyDescriptor(
            originPrototype,
            propertyName,
        );
        if(descriptor && typeof descriptor.value === 'function') {
            const originalMathod = descriptor.value;
            Object.defineProperty(originPrototype, propertyName, {
                configurable: true,
                get() {
                    return originalMathod.bind(this);
                },
            });
        }
    }
}

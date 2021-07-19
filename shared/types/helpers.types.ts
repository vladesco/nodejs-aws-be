export type RecursivePartial<T extends object> = {
    [key in keyof T]?: T[key] extends object ? RecursivePartial<T[key]> : T[key];
};

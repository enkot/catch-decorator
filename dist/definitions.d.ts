export interface ErrorObject<T> {
    constructor: T;
    name: string;
    message: string;
}

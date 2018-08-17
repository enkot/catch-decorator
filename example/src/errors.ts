export interface ServerErrorObject {
    name: string
    message: string
}

export class ServerError extends Error {
    constructor(message: string = 'Oops, something wrong') {
        super(message)
        this.name = 'ServerError'

        Object.setPrototypeOf(this, ServerError.prototype)
    }
}

export class ServerError extends Error {
    constructor(message: string = 'Oops, something wrong') {
        super(message)
        this.name = 'ServerError'

        // ServerError should be instance of Error
        Object.setPrototypeOf(this, ServerError.prototype)
    }
}

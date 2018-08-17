import { ServerError } from './errors'

export default {
    getData() {
        return Promise.reject(new ServerError(`Can't get data`))
    },
}

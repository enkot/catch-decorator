import Catch from '../src/index'
import { ServerError } from './errors'

const handler = (error: any, ctx: any) => console.log(error.message, ctx)
const CatchAll = Catch(Error, (error: any) => console.log(error.message))

class TestClass {
    @Catch(Error, error => console.log('Handler for any error'))
    @Catch(ServerError, handler)
    @Catch(ReferenceError, handler)
    methodFoo() {
        throw new ServerError('ServerError here!') // ServerError will be catched

        return Promise.reject(new ReferenceError('ReferenceError here!')) // comment line above, ReferenceError will be catched
    }

    @CatchAll
    methodBar() {
        throw new TypeError('TypeError here!') // TypeError will be catched
    }
}

const testInstance = new TestClass()
testInstance.methodFoo()
testInstance.methodBar()
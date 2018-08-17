import { ErrorObject } from './definitions'
import EntityMap from './EntityMap'

const LIB_NAME = 'Catch Decorator'

// store all global error handlers here
const handlerStore: EntityMap = new EntityMap()

function log(message: string, errorObject: any) {
    /* tslint:disable */
    console.warn(`${LIB_NAME}: ${message}`)
    console.error(errorObject)
    /* tslint:enable */
}

// run handler if it exists
// and error class equals error constructor
function runHandler(
    ctx: any,
    methodName: string,
    errorObject: ErrorObject<any>,
    errorClass: any = errorObject.constructor,
): void {
    let handler = null

    if (errorObject.constructor === errorClass) {
        // get handler mapped to passed error class
        handler = handlerStore.get(errorClass)
    }

    if (handler && typeof handler === 'function') {
        handler(errorObject, ctx)
    } else {
        log(`Unhandled exception in ${methodName} method`, errorObject)
    }
}

// wrap method with decorator function,
// and run original method wrapped with try/catch block
export const Catch = (catchArg?: any): any => {
    return (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>,
    ) => {
        // save a reference to the original method
        const originalMethod = descriptor.value

        descriptor.value = async function(...args: any[]) {
            try {
                return await originalMethod.apply(this, args)
            } catch (error) {
                if (!catchArg) {
                    // automatically runs registered handler for thrown exception
                    return runHandler(this, propertyKey, error)
                }

                if (typeof catchArg === 'function') {
                    // run callback function if it passed
                    catchArg.call(this, error, this)
                } else if (typeof catchArg === 'string') {
                    const classMethod = target[catchArg]

                    if (!classMethod) {
                        return console.warn(`There is no class method with name "${catchArg}"`)
                    }

                    // run class method if it name passed
                    classMethod.call(this, error)
                } else if (catchArg.length) {
                    // else run handlers for passed error classes
                    catchArg.forEach((value: any) => {
                        runHandler(this, propertyKey, error, value)
                    })
                }
            }
        }

        return descriptor
    }
}

// map error classes to handlers
export default handlerStore

type HandlerFunction = (error: any, ctx: any) => void;

function handleError(
    ctx: any, 
    errorClass: any, 
    handler: HandlerFunction, 
    error: any
) {
    // check if error is instance of passed error class
    if (typeof handler === 'function' && error instanceof errorClass) {
        // run handler with error object 
        // and class context as second argument
        handler.call(null, error, ctx)
    } else {
        // throw error further,
        // next decorator in chain can catch it
        throw error
    }
}

// decorator factory function
export default (errorClass: any, handler: HandlerFunction): any => {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        // save a reference to the original method
        const originalMethod = descriptor.value

        // rewrite original method with custom wrapper
        descriptor.value = function(...args: any[]) {
            try {
                const result = originalMethod.apply(this, args)
                
                // check if method is asynchronous
                if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
                    // return promise
                    return result.catch((error: any) => {
                        handleError(this, errorClass, handler, error)
                    })
                }

                // return actual result
                return result
            } catch (error) {
               handleError(this, errorClass, handler, error)
            }
        }

        return descriptor
    }
}
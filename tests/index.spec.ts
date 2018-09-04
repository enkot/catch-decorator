import Catch from '../src'

describe('catch-decorator', () => {
    let handler

    beforeEach(() => {
        handler = jest.fn()
    })
    
    it('calls handler with error object and context object arguments', () => {        
        class TestClass {
            @Catch(ReferenceError, handler)
            testMethod() {
                throw new ReferenceError("Error here")
                
                return 'Test'
            }
        }
        new TestClass().testMethod()

        expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass))
    })

    it('handle errors in async methods', async () => {        
        class TestClass {
            @Catch(ReferenceError, handler)
            async testMethod() {
                await Promise.reject(new ReferenceError("Error here"))
                
                return 'Test'
            }
        }
        await new TestClass().testMethod()

        expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass))
    })

    it('handle correct error with chained decorators', async () => {    
        class TestClass {
            @Catch(ReferenceError, handler)
            @Catch(TypeError, handler)
            testMethod() {
                throw new ReferenceError("Error here")
                throw new TypeError("Error here")

                return 'Test'
            }
        }
        new TestClass().testMethod()

        expect(handler).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass))
    })

    it('run "Error" handler if specific handler not registered', () => {        
        const handlerError = jest.fn()

        class TestClass {
            @Catch(Error, handlerError)
            @Catch(TypeError, handler)
            testMethod() {
                throw new ReferenceError("Error here")
                
                return 'Test'
            }
        }
        new TestClass().testMethod()

        expect(handlerError).toBeCalledWith(expect.any(ReferenceError), expect.any(TestClass))
    })

    it('handle errors in static methods', () => {        
        class TestClass {
            @Catch(ReferenceError, handler)
            static testMethod() {
                throw new ReferenceError("Error here")
                console.log('Test')
            }
        }
        TestClass.testMethod()

        expect(handler).toBeCalledWith(expect.any(ReferenceError), TestClass)
    })
})
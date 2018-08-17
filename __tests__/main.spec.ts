import catchDecorator, { Catch } from '../src'

describe('catch-decorator', () => {
    let called
    let param
    let handler

    beforeEach(() => {
        called = false
        param = null

        handler = (error: any) => { 
            called = true 
            param = error
        }

        catchDecorator.set(Error, handler)
    })

    afterEach(async () => {
        expect(called).toBe(true)
        expect(param).toBeInstanceOf(Error)
    })

    it('calls callback with error argument when callback passed directly', async () => {
        catchDecorator.keys = []
        catchDecorator.values = []
        
        class TestClass {
            @Catch(handler)
            async testMethod() {
                await Promise.reject(new Error())
            }
        }
        await new TestClass().testMethod()
    })
    it('calls callback with error argument when class method passed', async () => {
        const classMethod = 'handleError'

        class TestClass {
            @Catch(classMethod)
            async testMethod() {
                await Promise.reject(new Error())
            }
        }
        TestClass.prototype[classMethod] = handler

        await new TestClass().testMethod()
    })
    it('calls callback with error argument when errors classes passed', async () => {
        class TestClass {
            @Catch([Error])
            async testMethod() {
                await Promise.reject(new Error())
            }
        }

        await new TestClass().testMethod()
    })
    it('calls callback with error argument when nothing passed', async () => {
        class TestClass {
            @Catch()
            async testMethod() {
                await Promise.reject(new Error())
            }
        }

        await new TestClass().testMethod()
    })
})
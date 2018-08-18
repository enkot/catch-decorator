# 🎣 catch-decorator
[![Build Status](https://travis-ci.org/enkot/catch-decorator.svg?branch=master)](https://travis-ci.org/enkot/catch-decorator)

Allows you to handle exceptions in class methods with only one annotation
 (decorator). Idea of errors handling taken from Java.

## Install

```bash
npm install catch-decorator
```

## Why?
The main problem of handling errors are using "try/catch" blocks or "catch" methods for Promises. 
But if we use classes, for example for Vue components, why can't we use method decorators for handling errors? 

So, for example, instead of this:
```js
export default class Messenger {
    async getMessages() {
        try
            await api.getData() // <-- can throw error
        } catch(e) {
            ...
        }   
    }
}
```
we can write this:
```js
import { Catch } from 'catch-decorator'

export default class Messenger {
    @Catch()
    async getMessages() {
        await api.getData() // <-- can throw error
    }
}
```
much prettier, isn't it?


## How to use?
> All examples shown in case of VueJS class components. But it works with any ES6/Typescript classes. 

For example, if you want to show toast notification on every exception, you should register your handlers first: 

```js
// main.ts
import catchDecorator from 'catch-decorator'
import { ServerError } from './errors' // custom error

catchDecorator.set(Error, (e: any) => Toast.error(e.message))
catchDecorator.set(ServerError, (e: any) => Toast.error('Server error!'))
```
and then in class/component:
```js
@Component
export default class Messenger extends Vue {
    @Catch()
    async getMessages() {
        const data = await api.getData() // <-- can throw Error
        ...
    }
}
```
In this case catch-decorator will use globaly registered handlers.

You can also specify exact errors to handle:
```js
@Component
export default class Messenger extends Vue {
    @Catch([Error, ServerError])
    async getMessages() {
        const data = await api.getData() // <-- can throw ServerError
        ...
    }
}
```

As option, you can pass callback. In this case current object (context) will be passed as second argument.
```js
@Component
export default class Messenger extends Vue {
    errorMessage = ''

    @Catch((err, ctx) => ctx.errorMessage = err.message)
    async getMessages() {
        const data = await api.getData()
        ...
    }
}
```
or class method name, which will be used as handler:
```js
@Component
export default class Messenger extends Vue {
    errorMessage = ''

    @Catch('handleError')
    async getMessages() {
        const data = await api.getData()
        ...
    }

    handleError(err) {
        this.errorMessage = err.message
    }
}
```

## License:
MIT
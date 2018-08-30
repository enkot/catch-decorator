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
import Catch from 'catch-decorator'

export default class Messenger {
    @Catch(Error)
    async getMessages() {
        await api.getData() // <-- can throw error
    }
}
```
much prettier, isn't it?


## How to use?
> All examples shown in case of VueJS class components. But it works with any ES/Typescript classes.

For example, if you want to show toast notification on every exception:

```js
@Component
export default class Messenger extends Vue {
    @Catch(Error, (e: any) => Toast.error(e.message))
    @Catch(ServerError, (e: any) => Toast.error('Server error!'))
    async getMessages() {
        const data = await api.getData() // <-- can throw Error
        ...
    }
}
```

Be aware as unhandled errros may be thrown:
```js
export class Messenger {

    @Catch(SyntaxError, yourErrorHandler)
    @Catch(ReferenceError, yourErrorHandler)
    static stuff() {
        // throws a TypeError
    }
}
```
In order to catch any exception you should do:
```js
@Catch(Error, () => {})
```
In fact, you can create your own super decorator that catches anything:
```js
const UltimateCatch = Catch(Error, e => console.warn(e));

export class Messenger {
    @UltimateCatch
    static stuff() {
      // all errors will be handled
    }
}

```


## License:
MIT

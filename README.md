# 🎣 catch-decorator
[![Build Status](https://travis-ci.org/enkot/catch-decorator.svg?branch=master)](https://travis-ci.org/enkot/catch-decorator)

Allows you to handle exceptions in class methods with only one annotation
 (decorator). Idea of errors handling taken from Java.

 > *UPDATE* from v2: refactored to use stacked decorators style. Thx to @k1r0s :)  

## Install

```bash
npm install catch-decorator
```

## Why?
The main problem of handling errors are using "try/catch" blocks or "catch" methods for Promises. 
But if we use classes, for example for Vue components, why can't we use method decorators for handling errors? 

So, for example, instead of this:
```js
class Messenger {
    async getMessages() {
        try
            await api.getData() // <-- can throw ServerError
        } catch(err) {
            ...
        }   
    }
}
```
we can write this:
```js
import Catch from 'catch-decorator'

class Messenger {
    @Catch(ServerError, handler)
    async getMessages() {
        await api.getData() // <-- can throw custom ServerError
    }
}
```
much prettier, isn't it?


## How to use?
> `catch-decorator` works with any ECMAScript/Typescript classes. If you use Babel, [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) is needed. If you use TypeScript, enable `--experimentalDecorators` flag.

You can handle any thrown error:

```js
import Catch from 'catch-decorator'

const CatchAll = Catch(Error, (err: any) => console.log(err.message))

class Messenger {
    @CatchAll
    getMessages() {
        throw new TypeError('ReferenceError here!')
        ...
    }
}
```

or write decorators in stack to handle more than one errors type. In callback as second argument will be passed current instance object (context):
```js
class Messenger {
    @Catch(TypeError, (err, ctx) => {...})
    @Catch(ReferenceError, (err, ctx) => {...})
    getMessages() {
        throw new ReferenceError('ReferenceError here!')
        ...
    }
}
```

It also works with async methods:
```js
class Messenger {
    errorMessage = null

    @Catch(ServerError, (err, ctx) => ctx.errorMessage = err.message)
    getMessages() {
        return fetch(myRequest).then(response => { // can throw ServerError
            ...
        })
    }
}
```

## License:
MIT

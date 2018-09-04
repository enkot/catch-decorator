/**
 * MIT License
 *
 * Copyright (c) 2018 Enkot
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global['catch-decorator'] = factory());
}(this, (function () { 'use strict';

    function handleError(ctx, errorClass, handler, error) {
        // check if error is instance of passed error class
        if (typeof handler === 'function' && error instanceof errorClass) {
            // run handler with error object 
            // and class context as second argument
            handler.call(null, error, ctx);
        }
        else {
            // throw error further,
            // next decorator in chain can catch it
            throw error;
        }
    }
    // decorator factory function
    var index = (errorClass, handler) => {
        return (target, propertyKey, descriptor) => {
            // save a reference to the original method
            const originalMethod = descriptor.value;
            // rewrite original method with custom wrapper
            descriptor.value = function (...args) {
                try {
                    const result = originalMethod.apply(this, args);
                    // check if method is asynchronous
                    if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
                        // return promise
                        return result.catch((error) => {
                            handleError(this, errorClass, handler, error);
                        });
                    }
                    // return actual result
                    return result;
                }
                catch (error) {
                    handleError(this, errorClass, handler, error);
                }
            };
            return descriptor;
        };
    };

    return index;

})));

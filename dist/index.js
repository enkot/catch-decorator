(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['catch-decorator'] = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class EntityMap {
        constructor() {
            this.keys = [];
            this.values = [];
        }
        set(key, value) {
            const index = this.keys.indexOf(key);
            if (index >= 0) {
                return this.values[index] = value;
            }
            this.keys.push(key);
            this.values.push(value);
        }
        get(key) {
            return this.values[this.keys.indexOf(key)];
        }
    }

    const LIB_NAME = 'Catch Decorator';
    // store all global error handlers here
    const handlerStore = new EntityMap();
    function log(message, errorObject) {
        /* tslint:disable */
        console.warn(`${LIB_NAME}: ${message}`);
        console.error(errorObject);
        /* tslint:enable */
    }
    // run handler if it exists
    // and error class equals error constructor
    function runHandler(ctx, methodName, errorObject, errorClass = errorObject.constructor) {
        let handler = null;
        if (errorObject.constructor === errorClass) {
            // get handler mapped to passed error class
            handler = handlerStore.get(errorClass);
        }
        if (handler && typeof handler === 'function') {
            handler(errorObject, ctx);
        }
        else {
            log(`Unhandled exception in ${methodName} method`, errorObject);
        }
    }
    // wrap method with decorator function,
    // and run original method wrapped with try/catch block
    const Catch = (catchArg) => {
        return (target, propertyKey, descriptor) => {
            // save a reference to the original method
            const originalMethod = descriptor.value;
            descriptor.value = function (...args) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        return yield originalMethod.apply(this, args);
                    }
                    catch (error) {
                        if (!catchArg) {
                            // automatically runs registered handler for thrown exception
                            return runHandler(this, propertyKey, error);
                        }
                        if (typeof catchArg === 'function') {
                            // run callback function if it passed
                            catchArg.call(this, error, this);
                        }
                        else if (typeof catchArg === 'string') {
                            const classMethod = target[catchArg];
                            if (!classMethod) {
                                return console.warn(`There is no class method with name "${catchArg}"`);
                            }
                            // run class method if it name passed
                            classMethod.call(this, error);
                        }
                        else if (catchArg.length) {
                            // else run handlers for passed error classes
                            catchArg.forEach((value) => {
                                runHandler(this, propertyKey, error, value);
                            });
                        }
                    }
                });
            };
            return descriptor;
        };
    };

    exports.Catch = Catch;
    exports.default = handlerStore;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

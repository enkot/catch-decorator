(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('kaop-ts')) :
  typeof define === 'function' && define.amd ? define(['kaop-ts'], factory) :
  (global.catchDecorator = factory(global.kaopTs));
}(this, (function (kaopTs) { 'use strict';

  var index = (function (errorType) {
    var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    return kaopTs.afterMethod(function (meta) {
      if (meta.exception && meta.exception instanceof errorType) {
        var exception = meta.handle();
        meta.result = fn(exception);
      } else if (meta.result && typeof meta.result.catch === "function") {
        meta.result = meta.result.catch(function (exception) {
          if (exception instanceof errorType) {
            return fn(exception);
          } else {
            throw exception;
          }
        });
      }
    });
  });

  return index;

})));

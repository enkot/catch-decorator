import { afterMethod } from "kaop-ts";

export default (errorType, fn = () => {}) => afterMethod(meta => {
  if (meta.exception && meta.exception instanceof errorType) {
    const exception = meta.handle();
    meta.result = fn(exception);
  } else if(meta.result && typeof meta.result.catch === "function") {
    meta.result = meta.result.catch(exception => {
      if (exception instanceof errorType) {
        return fn(exception);
      } else {
        throw exception;
      }
    });
  }
});

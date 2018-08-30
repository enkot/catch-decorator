const Catch = require("..");
const sinon = require("sinon");
const assert = require("assert");

const decorateMethod = (target, method, decorator) => {
  const descriptor = Object.getOwnPropertyDescriptor(target.prototype, method);
  Object.defineProperty(target.prototype, method, decorator(target.prototype, method, descriptor));
  return target;
}

describe("general test suite", () => {

  class Dummy {
    far() {
      return new Promise(() => {
        zz()
      })
    }

    bar() {
      zz()
    }

    foo() {
      zz()
    }

    boo() {
      JSON.parse(",,,,,aaa")
    }
  }

  let handlerStub1, handlerStub2;

  beforeEach(() => {
    handlerStub1 = sinon.stub();
    handlerStub2 = sinon.stub();
  })

  it("should be able to capture specific errors in rejections", done => {

    const DecoratedClass = decorateMethod(Dummy, "far", Catch(ReferenceError, handlerStub1));

    const inst = new DecoratedClass();

    inst.far();

    setTimeout(() => {
      sinon.assert.called(handlerStub1);
      sinon.assert.pass(handlerStub1.returnsArg(0) instanceof ReferenceError);
      done();
    }, 10)
  });

  it("should be able to capture specific errors (synchronous)", () => {
    const DecoratedClass = decorateMethod(Dummy, "bar", Catch(ReferenceError, handlerStub1));

    const inst = new DecoratedClass();

    inst.bar();

    sinon.assert.called(handlerStub1);
    sinon.assert.pass(handlerStub1.returnsArg(0) instanceof ReferenceError);
  });

  it("should throw the exception if no matching type is defined", () => {
    const DecoratedClass = decorateMethod(Dummy, "foo", Catch(TypeError, handlerStub1));

    const inst = new DecoratedClass();

    assert.throws(inst.foo, ReferenceError);
    sinon.assert.notCalled(handlerStub1);
  });

  it("handler result will be used as method result", () => {
    handlerStub1.returns({});
    const DecoratedClass = decorateMethod(Dummy, "boo", Catch(SyntaxError, handlerStub1));

    const inst = new DecoratedClass();
    const result = inst.boo();
    sinon.assert.called(handlerStub1);
    sinon.assert.pass(typeof result === "object");
  });

  it("decorator should be able to stack on top of others to cover exception types", () => {
    let DecoratedClass = decorateMethod(Dummy, "boo", Catch(TypeError, handlerStub1));
    DecoratedClass = decorateMethod(Dummy, "boo", Catch(SyntaxError, handlerStub2));

    const inst = new DecoratedClass();

    inst.boo();

    sinon.assert.notCalled(handlerStub1);
    sinon.assert.called(handlerStub2);
    sinon.assert.pass(handlerStub2.returnsArg(0) instanceof SyntaxError);
  });
});

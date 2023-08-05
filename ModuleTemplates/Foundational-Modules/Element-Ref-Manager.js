export class ElementRefManager {
  //acts as a means of managing all element references supplied to the class instance
  //highly reuseable as it can be applied to pretty much any front end feature

  #cache = new Map();

  //will be what actually manipulates the cache based on the instructions given, also returns any errors that it comes across when doing so
  #cacheManipulator(methodType, key, value) {
    const errors = [];

    if (typeof key === "string") {
      switch (methodType) {
        case "set":
          if (value instanceof Element) {
            this.#cache.set(key, value);
          } else {
            errors.push(
              new TypeError(
                `Supplied value to be stored within the element cache manager is not an element, received '${value}' as the value corresponding to the supplied key '${key}'`
              )
            );
          }
        case "get":
          return this.#cache.get(key);
        case "delete":
          this.#cache.delete(key);
          break;
        default:
          errors.push(
            new SyntaxError(
              `Supplied 'methodType' argument value does not match any of the valid methods available to enact on the cache within '${this.constructor.name}', received '${methodType}' as the supplied method type`
            )
          );
      }
    } else {
      errors.push(
        new TypeError(
          `Supplied 'key' argument value is an incorrect data type, must be a string, received '${key}'`
        )
      );
    }

    this.#throwFoundErrors(errors);
  }

  //for throwing multiple errors found within an operation, so
  //that a try/catch can potentially handle multiple errors as opposed to say only one error at a time if needed
  #throwFoundErrors(errorArr) {
    if (errorArr.length > 0) {
      throw errorArr;
    }
  }

  //APIs for adding, removing, or retrieving stored element refs
  addRef(key, value) {
    try {
      this.#cacheManipulator("set", key, value);
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  deleteRef(key) {
    try {
      this.#cacheManipulator("delete", key);
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  retrieveRef(key) {
    try {
      return this.#cacheManipulator("get", key);
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

export class LocalStorageCacheManager {
  //will be used to initialize a specific cache within the local storage,
  //but will do nothing if it already exists
  constructor(cacheName) {
    if (!localStorage.getItem(cacheName)) {
      localStorage.setItem(cacheName, {}); //defines the cache equal to an empty object if it didn't already exist within the local storage
    }

    this.#cacheName = cacheName; //saves the cache name to be used later
  }

  #cacheName = null; // name of the specific cache within local storage, which is defined with the direct local storage methods
  //its the value stored that functions as the complex data structure for the caching of information within this class instance

  //parses supplied values as json, for when you pull from the local storage
  #parser(value) {
    return JSON.parse(value);
  }

  //stringifies supplied value, for when you want to save to the local storage
  #stringify(value) {
    return JSON.stringify(value);
  }

  //retrieves the cache from the local storage
  #fetchCache() {
    return this.#parser(localStorage.getItem(this.#cacheName));
  }

  //stores the cache after it was received and manipulated back into storage
  #storeCache(newCache) {
    localStorage.setItem(this.#cacheName, this.#stringify(newCache));
  }

  //adds a value to the cache
  addValue(key, value) {
    try {
      const cache = this.#fetchCache(); //get the cache from local

      //attempt to add a new key value pair to said cache retrieved
      if (!cache.hasOwnProperty(key)) {
        cache[key] = value;
      } else {
        throw new ReferenceError(
          `Failed to add key value pair to a specific cache within local storage, the key already exists within the cache and a value is associated with such, received '${key}' as the key for the cache '${
            this.#cacheName
          }'`
        );
      }

      this.#storeCache(cache); //update the cache after the changes are made
    } catch (error) {
      console.error(error.error.stack);
    }
  }

  //removes a value from the cache
  removeValue(key) {
    try {
      const cache = this.#fetchCache(); //get the cache from local

      //attempt to delete the supplied key
      if (cache.hasOwnProperty(key)) {
        delete cache[key];
      } else {
        throw new ReferenceError(
          `Failed to remove a key value pair from a specific cache within local storage, they key supplied does not exist within the cache, received '${key}' as the key for the cache '${
            this.#cacheName
          }'`
        );
      }

      this.#storeCache(cache); //update cache after changes are made
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //retrieves a value from the cache
  retrieveValue(key) {
    try {
      const cache = this.#fetchCache(); //get the cache from local

      //attempt to retrieve the value associated with the supplied key
      if (cache.hasOwnProperty(key)) {
        return cache[key];
      } else {
        throw new ReferenceError(
          `Failed to retrieve a value associated with the supplied key from the specific cache, the key value pair does not exist within it, received '${key}' as the key for the cache '${
            this.#cacheName
          }'`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //retrieves all existing values from the cache
  retrieveAllValues() {
    try {
      const cache = this.#fetchCache(); //get the cache from local

      return cache; //return the entire cache which in turn returns all of the values essentially
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //clears the entire cache of all key value pairs
  clearAllValues() {
    try {
      const cache = {}; //no need to get cache from local, just set it equal to an empty object

      this.#storeCache(cache); //update cache after changes are made
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

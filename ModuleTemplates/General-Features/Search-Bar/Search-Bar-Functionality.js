//--------*BEST IF USED IN TANDEM WITH THE SEARCHBARCONSTRUCTOR HELPER CLASS*--------//

//A HELPER CLASS DESIGNED TO FACILITATE SEARCH BAR FUNCTIONALITY FOR FETCHING DATA BASED ON THE INPUT
//FIELD VALUE. THE CLASS TAKES AN API INSTANCE IN THE FORM OF A CLASS THAT REPRESENTS A WAY TO COMMUNICATE WITH A
//SPECIFIC API INSTANCE. THIS CLASS ALSO TAKES A MEDIATOR METHOD IN ORDER TO LINK THE INTERACTION BETWEEN THIS
//CLASS INSTANCE FUNCTIONALITY, THAT BEING THE SEARCH QUERY FUNCTIONALITY, AND THE SUPPLIED API INSTANCE.

//THE MEDIATOR METHOD TO SUPPLY MUST TAKE TWO ARGUMENTS IN THIS ORDER: (input, apiInstance).
//THE MEDIATOR METHOD SHOULD USE THESE TWO ARGUMENTS TO PERFORM THE CORRESPONDING FUNCTIONALITY
//FOR FETCHING DATA FROM THE SUPPLIED API, WHICH THE METHOD SHOULD BE CATERED TO THE INTERFACE OF
//SAID API INSTANCE. THE MEDIATOR METHOD SHOULD ALWAYS AND ONLY RETURN A PROMISE INSTANCE THAT WILL EVENTUALLY
//RETURN THE DATA FROM THE API REQUEST. KNOWING THIS, THE MEDIATOR METHOD SHOULD ALWAYS LOOK SOMETHING LIKE THESE EXAMPLES

//EXAMPLE 1: (input, apiInstance) =>
//{
//   //logic for making an api request using the input information from the search bar
//
//    return requestPromise;
//}

//EXAMPLE 2: async (input, apiInstance) =>
//{
//   //logic for making an api request using the input information from the search bar using perhaps an await keyword for the data
//
//    return data;
//}

//THE REASON THE MEDIATOR METHOD NEEDS TO ALWAYS RETURN SOME SORT OF PROMISE ON INVOCATION IS SO THAT THE DATA THAT IS RETURNED
//FROM SAID PROMISE FOR THE API REQUEST CAN BE EMITTED TO ALL OF THE SUBSCRIBERS OF A CORRESPONDING CLASS INSTANCE.

//THE ARGUMENTS ARE:
// apiInstance - A CLASS INSTANCE THAT WILL SERVE AS THE INTERFACE TO COMMUNICATE WITH A THIRD PARTY API OF SOME SORT, SHOULD RETURN A FETCH PROMISE OF SOME SORT
// mediatorMethod - A CALLBACK THAT WILL LINK THE CLASS INSTANCE TO THE API INSTANCE
// searchBarForm - A REFERENCE TO THE CORRESPONDING FORM ELEMENT OF THE SEARCH BAR FRAGMENT BEING USED
// searchBarInput- A REFERENCE TO THE CORRESPONDING INPUT ELEMENT THAT IS THE ACTUAL SEARCH BAR FIELD, SHOULD BE FROM WITHIN THE FORM ELEMENT PREVIOUSLY SUPPLIED

//THIS CLASS WILL ONLY PROVIDE BASIC SEARCH QUERYING LOGIC TO THE SUPPLIED ELEMENT REFERENCES, AND DO SO BASED ON THE API INSTANCE AND MEDIATOR METHOD SUPPLIED
//IT WILL ONLY TAKE THE CURRENT INPUT VALUE OF THE CORRESPONDING INPUT REFERENCE, AND EXECUTE A QUERY WITH SAID DATA ON THE API INSTANCE USING THE MEDIATOR METHOD TO FACILITATE
//THE ACTUAL API INTERACTION. IF THE PROMISE INSTANCE FROM THE API RESOLVES, THE DATA RECEIVED WILL BE EMITTED TO THOSE THAT ARE SUBSCRIBED TO THE SPECIFIC CLASS INSTANCE.

export class SearchBarFunctionality {
  constructor(argsObj) {
    try {
      this.#argValidator("constructor", argsObj);

      //apply args to state and config
      const { apiInstance, mediatorMethod, searchBarForm, searchBarInput } =
        argsObj;

      this.#helperClasses.apiInstance = apiInstance; //api for the search bar to use for search querying

      this.#configData.mediatorMethod = mediatorMethod; //used to connect this class with the supplied api

      //save some important references to state
      this.#elementReferences.searchBarForm = searchBarForm;
      this.#elementReferences.searchBarInput = searchBarInput;
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //------------------ARGUMENT-VALIDATION-----------------------//

  #argValidationData = {
    //methods
    constructor: {
      //args
      apiInstance: {
        //properties
        instanceof: Object,
      },
      mediatorMethod: {
        type: "function",
      },
      searchBarForm: {
        instanceof: Element,
      },
      searchBarInput: {
        instanceof: Element,
      },
    },
    subscribe: {
      subName: {
        type: "string",
      },
      entryPointMethod: {
        type: "function",
      },
    },
    unsubscribe: {
      subName: {
        type: "string",
      },
    },
  };

  #validate = {
    type: (suppliedArg, argName, methodOrigin, correctType) => {
      if (typeof suppliedArg !== correctType) {
        throw new Error(
          `Argument '${argName}' for method '${methodOrigin}' failed type validation,
             received '${suppliedArg}' which has a type of '${typeof suppliedArg}',
              needs to have the type '${correctType}'`
        );
      }
    },
    instanceof: (suppliedArg, argName, methodOrigin, correctInstance) => {
      if (!(suppliedArg instanceof correctInstance)) {
        throw new Error(
          `Argument '${argName}' for method '${methodOrigin}' failed instance validation,
             received '${suppliedArg}' which is not an instance of '${correctInstance}'`
        );
      }
    },
  };

  #argValidator(methodName, argsObj) {
    if (this.#argValidationData.hasOwnProperty(methodName)) {
      const methodValidationData = this.#argValidationData[methodName];

      for (let arg in argsObj) {
        const argValue = argsObj[arg];

        //check if a supplied arg is a valid arg to supply
        if (!methodValidationData.hasOwnProperty(arg)) {
          throw new ReferenceError(
            `Unrecognized argument for a specific method, received '${arg}' with a value of '${argsObj[arg]}'`
          );
        }

        //go down the list of properties to check for on the specific arg
        for (let property in methodValidationData[arg]) {
          const correctValue = methodValidationData[arg][property]; //retrieve the data that will be used as a reference for validating the arg

          this.#validate[property](argValue, arg, methodName, correctValue); //validate the arg based on the property being checked currently
        }
      }
    } else {
      throw new ReferenceError(
        `Failed to validate the supplied arguments for a specific method, validation data
           corresponding to this method does not exist, received '${methodName}' as the method being validated`
      );
    }
  }

  //------------------STATE-AND-CONFIG-DATA----------------------//

  #configData = {
    mediatorMethod: null,
    //used to connect the search query functionality of this class to the api instance supplied,
    // the args for this method should be this (input, apiInstance). This method should
    //return a promise instance that will eventually return the data behind the api get request
  };

  #stateData = {
    functionalityActive: false,
    requestInProgress: false,
  };

  #helperClasses = {
    apiInstance: null,
  };

  #elementReferences = {
    searchBarForm: null,
    searchBarInput: null,
  };

  //-------------------FUNCTIONALITIES---------------------------//

  #makeApiRequest(searchInputValue) {
    const { mediatorMethod } = this.#configData,
      { apiInstance } = this.#helperClasses,
      searchQueryPromise = mediatorMethod(searchInputValue, apiInstance);
    //the mediator method is meant to take the search input and make a corresponding
    //request desired on the supplied api, the api should return a promise, and thus the mediator will
    //return this promise

    return searchQueryPromise;
  }

  #handleSearchQuery() {
    if (!this.#stateData.requestInProgress) {
      this.#stateData.requestInProgress = true;

      const { searchBarInput } = this.#elementReferences,
        searchQueryPromise = this.#makeApiRequest(searchBarInput.value), //get a promise for an api response using the input value of the search
        classScope = this;

      searchQueryPromise
        .then((data) => {
          this.#emitSearchQueryData.bind(classScope)(data);
          //emit the query data, have to bind it to this class instance, because otherwise the method scope will point to the promise
          //and the method wont be able to access this class's private variables within the private method invocation
        })
        .catch((error) => {
          console.error(error, error.stack);
        })
        .finally(() => {
          this.#stateData.requestInProgress = false; //reset the class state so another request can be made
        });
    } else {
      console.warn(
        `Attempting to make another search query while another is still in progress, please wait until it resolves or rejects.`
      );
    }
  }

  //-------------------EVENT-LISTENERS---------------------------//

  #submitFunc = (event) => {
    event.preventDefault(); //prevent regular form submit behavior
    this.#handleSearchQuery(); //start the search functionality
  };

  #addEventListeners() {
    this.#elementReferences.searchBarForm.addEventListener(
      "submit",
      this.#submitFunc
    ); //use the unique as the event listener callback
  }

  #removeEventListeners() {
    this.#elementReferences.searchBarForm.removeEventListener(
      "submit",
      this.#submitFunc
    ); //use it to remove the submit event listener
  }

  //--------------------FETCH-DATA-PUB-SUB-----------------------//

  #emitSearchQueryData = async (fetchedData) => {
    const numOfSubscribers = Object.keys(this.#subscribers).length;

    //check for subscribers
    if (numOfSubscribers > 0) {
      for (let subscriber in this.#subscribers) {
        this.#subscribers[subscriber](fetchedData);
      }
    }
  }; //emits the received data to all of the present subscribers

  #subscribers = {};

  subscribe(subName, entryPointMethod) {
    try {
      this.#argValidator("subscribe", { subName, entryPointMethod });

      if (!this.#subscribers.hasOwnProperty(subName)) {
        this.#subscribers[subName] = entryPointMethod;
      } else {
        throw new ReferenceError(`Failed to add a subscriber to the search bar functionality publisher, as the
          subscriber seems to already exist, received '${subName}' as the subscriber being added`);
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  unsubscribe(subName) {
    try {
      this.#argValidator("unsubscribe", { subName });

      if (this.#subscribers.hasOwnProperty(subName)) {
        delete this.#subscribers[subName];
      } else {
        throw new ReferenceError(`Failed to remove a subscriber from the search bar functionality publisher, as the
          subscriber attempting to be removed does not exist, received '${subName}' as the subscriber being removed`);
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //-------------------------APIs--------------------------------//

  //activate or deactivate the functionality of the search bar instance

  activate() {
    try {
      if (!this.#stateData.functionalityActive) {
        this.#addEventListeners(); //append the event listeners to the target form element

        this.#stateData.functionalityActive = true;
      } else {
        throw new Error(
          `Failed to activate the functionality on a specific search bar instance, it appears to already be on`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  deactivate() {
    try {
      if (this.#stateData.functionalityActive) {
        this.#removeEventListeners(); //remove the event listeners from the target form element

        this.#stateData.functionalityActive = false;
      } else {
        throw new Error(
          `Failed to deactivate the functionality on a specific search bar instance, it appears to already be off`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

export class EventDrivenFunctionalityManager {
  //basically initializes the class instance, takes an argument that represents the element to append all event listeners to
  //which are created within this class instance. Also initializes data structures important for facilitating the functionalities
  //of the various private and public methods within said class
  constructor(targetElement) {
    try {
      if (targetElement instanceof Element) {
        this.#targetElement = targetElement;
        this.#initEventListenerDataStructures();
      } else {
        throw new ReferenceError(
          `Supplied target element for this class instance is not an element, received '${targetElement}'`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //holds an array full of the valid event listeners that you can add/remove and
  //control functionalities with
  #validEventListeners = [
    "input",
    "submit",
    "focus",
    "blur",
    "click",
    "mousedown",
    "mouseup",
    "mouseover",
  ];

  //holds references to valid event listeners, and holds
  //data to represent what to initialize every
  //added property to equal by default
  #eventListenerDataStructures = {
    active: () => {
      return false;
    },
    entryPointRefs: () => {
      return null;
    },
    functionalities: () => {
      return new Object();
    },
  };

  //basically sets up the data structures to incorporate some default properties an values necessary
  //to facilitate the other functionality within the class. This way, for instance in the future that I
  //add another valid event listener, I can simply just add it to the valid event listeners array and
  //everything will work with it, all without having to edit the already present functionality too much
  //if necessary
  #initEventListenerDataStructures() {
    if (this.#validEventListeners.length > 0) {
      for (let dataStructure in this.#eventListenerDataStructures) {
        //for retrieving the actual reference to a specific data structure that will be initialized internally based
        //on valid event listener types
        const dataStructureRef = this.#eventListenerData[dataStructure];

        for (let eventListenerType of this.#validEventListeners) {
          if (typeof eventListenerType === "string") {
            //for setting the internal properties of the corresponding data structures to their
            //default property values. This way it will account for any new event listener types
            //automatically in the future
            dataStructureRef[eventListenerType] =
              this.#eventListenerDataStructures[dataStructure]();
          } else {
            throw new TypeError(
              `Current event listener type being referenced within validEventListeners is not a correct data type, should be a string, received '${eventListenerType}'`
            );
          }
        }
      }
    } else {
      throw new ReferenceError(
        `Could not initialize necessary data structures within the class instance, as there are not any valid event listeners to add to any corresponding data structure, validEventListeners is empty`
      );
    }
  }

  //the target element to append all of these event listeners to
  #targetElement = null;

  #eventListenerData = {
    //an easy storage for keeping track of already initialized event listeners
    //each property is a unique event listener type set to a boolean
    active: {},

    //holds key value pairs to the callbacks used to catch any events
    //from corresponding event listeners based on their type. If
    //the corresponding event listener isn't active, their corresponding
    //value is equal to null
    entryPointRefs: {},

    //will hold key value pairs for corresponding event types, and
    //and object holding all of the callbacks to execute upon each
    //event caught pertaining to said event type
    functionalities: {},
  };

  //holds reference data to validate arguments supplied to the various apis
  #validatorReferenceData = {
    addFunctionalityToEvent: {
      eventListenerType: {
        type: "string",
        validInputs: this.#validEventListeners,
      },
      uniqueIdentifier: {
        type: "string",
      },
      callback: { type: "function" },
    },
    removeFunctionalityFromEvent: {
      eventListenerType: {
        type: "string",
        validInputs: this.#validEventListeners,
      },
      uniqueIdentifier: {
        type: "string",
      },
    },
    eventListenerOn: {
      eventListenerType: {
        type: "string",
        validInputs: this.#validEventListeners,
      },
    },
    eventListenerOff: {
      eventListenerType: {
        type: "string",
        validInputs: this.#validEventListeners,
      },
    },
  };

  //conducts validation on supplied args and compares them to the validation reference data
  #argValidatorForApis(method, argsObj) {
    if (method in this.#validatorReferenceData) {
      const validationRefs = this.#validatorReferenceData[method];
      for (let methodArg in validationRefs) {
        //iterate through all of the corresponding arguments based on the selected method

        const methodArgValidProps = validationRefs[methodArg];

        //checks if type is a property to validate against the corresponding argument
        if (methodArgValidProps.hasOwnProperty("type")) {
          //check the typing
          if (typeof argsObj[methodArg] !== methodArgValidProps["type"]) {
            throw new TypeError(
              `Value of received argument for a corresponding api is not the correct data type, received '${
                argsObj[methodArg]
              }' as the value with a data type of '${typeof argsObj[
                methodArg
              ]}' for the argument '${methodArg}' for the method '${method}', needs to be a(n) '${
                methodArgValidProps["type"]
              }'`
            );
          }

          if (methodArgValidProps["type"] === "string") {
            //if the corresponding argument didn't fail its typing test, and it's supposed to be a string, validate the string
            const stringPassed = this.#stringValidator(argsObj[methodArg]);

            if (!stringPassed) {
              throw new ReferenceError(
                `Value of a received argument for a corresponding api is a string that is invalid, most likely empty or contains spaces, received '${argsObj[methodArg]}' for the argument '${methodArg}' for the method '${method}'`
              );
            }
          }
        }

        //checks if validInputs is a property to validate against the corresponding argument
        if (
          methodArgValidProps.hasOwnProperty("validInputs") &&
          !methodArgValidProps["validInputs"].includes(argsObj[methodArg])
        ) {
          throw new ReferenceError(
            `Value of received argument for a corresponding api is not valid because it does not match one of the valid
             parameters to accept for the specific argument, received '${
               argsObj[methodArg]
             }' as the value with a data type of '${typeof argsObj[
              methodArg
            ]}' for the argument '${methodArg}' for the method '${method}', needs to be a(n) '${
              methodArgValidProps["type"]
            }' as well as match one of these valid inputs '${
              methodArgValidProps["validInputs"]
            }'`
          );
        }
      }
    } else {
      throw new ReferenceError(
        `Failed to perform validation on a specific apis input arguments, the reference data for the corresponding api 
        does not exist within 'validatorReferenceData', received '${method}' as the method attempting to be validated`
      );
    }
  }

  //makes sure that a supplied string for what ever reason isn't empty
  //or contains any spaces
  #stringValidator(string) {
    //checking for if the string is just an empty string
    if (string === "") {
      return false;
    }

    const sanitizedString = string.replace(/\s/g, "");

    //checking for any spaces within the string
    return string === sanitizedString;
  }

  //will be supplied to each event listener creation in order
  //to serve as the entry point to execute the appended functionality
  //for the specific event listener type, so that all associated functionality
  //is executed every event caught
  #eventFunctionalityEntryPoint(event, eventListenerType) {
    if (eventListenerType in this.#eventListenerData.functionalities) {
      //checks for the existence of the event listener type, as well as whether the associated functionality reference has methods to execute
      const functionalityObj =
          this.#eventListenerData.functionalities[eventListenerType],
        hasMethodsToExecute = Object.keys(functionalityObj).length > 0;

      if (hasMethodsToExecute) {
        for (let method in functionalityObj) {
          functionalityObj[method](event); //executes every existing method within the corresponding event type functionality object, and does so with the supply of the event
        }
      } else {
        //simple warning for user when they have an event listener running but its not actually executing any functionality
        console.warn(
          `Functionality for a corresponding event type is attempting to execute, but there isn't any methods to execute for said event type within 'eventListenerFunctionality', received '${eventListenerType}' as the type of event that is on, but doesn't have actual functionality associated with it`
        );
      }
    } else {
      throw new ReferenceError(
        `Could not execute associated event functionality, as the property that represents the event type within 'eventListenerFunctionality' does not exist, received ${eventListenerType} for the event listener type`
      );
    }
  }

  //will add the target event listener from the target element if it is not active as well as check if the
  //event listener type exists within the functionality data structure
  #eventListenerInitializer(eventListenerType) {
    if (
      this.#validEventListeners.includes(eventListenerType) &&
      this.#eventListenerData.active[eventListenerType] === false
    ) {
      //have to make a separate callback to supply to the event listener, so that I can have the reference to it
      //in the future in order to be able to remove said event listener when needed
      const { active, entryPointRefs } = this.#eventListenerData;

      const listenerEntryPoint = (e) => {
        this.#eventFunctionalityEntryPoint(e, eventListenerType);
      };

      this.#targetElement.addEventListener(
        eventListenerType,
        listenerEntryPoint
      ); //create event listener and append it to target element

      entryPointRefs[eventListenerType] = listenerEntryPoint; //store the callback to be used later if needed

      active[eventListenerType] = true; //toggle the specific event listener as active
    } else {
      throw new Error(
        `Cannot add specific event listener, as the target event listener is already active, or is not a valid event listener to initialized, received '${eventListenerType}' as the event listener trying to be initialized, here are some valid event listeners to create '${Object.values(
          this.#validEventListeners
        )}'`
      );
    }
  }

  //will remove the target event listener from the target element if it is active as well as check if
  //the evet listener type exists within the existing
  #eventListenerRemover(eventListenerType) {
    if (
      this.#validEventListeners.includes(eventListenerType) &&
      this.#eventListenerData.active[eventListenerType] === true
    ) {
      const { active, entryPointRefs } = this.#eventListenerData;

      const listenerEntryPointRef = entryPointRefs[eventListenerType]; //have to retrieve the exact callback that was used when creating the event listener from before

      this.#targetElement.removeEventListener(
        eventListenerType,
        listenerEntryPointRef
      ); //remove the event listener from the target element

      entryPointRefs[eventListenerType] = null; //reset the callback reference back to null since the event listener was removed

      active[eventListenerType] = false; //toggle the specific event listener as inactive
    } else {
      throw new Error(
        `Cannot remove specific event listener, as the target event listener is not currently active, received ${eventListenerType}`
      );
    }
  }

  //will add a callback to perhaps a list of callbacks to execute to
  //pertaining to the specific event listener type. This callback is managed by
  //assigning it an identifier as its key, and the callback is the value of said key
  addFunctionalityToEvent(eventListenerType, uniqueIdentifier, callback) {
    try {
      this.#argValidatorForApis("addFunctionalityToEvent", {
        eventListenerType,
        callback,
        uniqueIdentifier,
      });

      //make sure that the unique identifier for the supplied callback to be
      //executed isn't already present in the corresponding event functionalities
      const functionalitiesForSpecificEvent =
        this.#eventListenerData.functionalities[eventListenerType];

      if (!functionalitiesForSpecificEvent.hasOwnProperty(uniqueIdentifier)) {
        //adds a new method to the object that holds all of the methods to execute everytime the corresponding event is caught
        functionalitiesForSpecificEvent[uniqueIdentifier] = callback;
      } else {
        throw new Error(
          `Failed to add functionality to a specific event listener, as the supplied unique identifier already matches an existing callback within said specific event listener functionality, received '${uniqueIdentifier}' for the callback '${callback}'`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //will remove a callback from perhaps a list of callbacks to execute to
  //pertaining to the specific event listener type. Finds the corresponding functionality
  //using the supplied key
  removeFunctionalityFromEvent(eventListenerType, uniqueIdentifier) {
    try {
      this.#argValidatorForApis("removeFunctionalityFromEvent", {
        eventListenerType,
        uniqueIdentifier,
      }); //validate input

      //make sure that a callback with the unique identifier as its key exists within the
      //corresponding functionality

      const functionalitiesForSpecificEvent =
        this.#eventListenerData.functionalities[eventListenerType];

      if (functionalitiesForSpecificEvent.hasOwnProperty(uniqueIdentifier)) {
        delete functionalitiesForSpecificEvent[uniqueIdentifier]; //deletes the target method entirely if it exists within the target event listener functionality
      } else {
        throw new Error(
          `Failed to remove a specific functionality associated with the supplied unique identifier from the corresponding event listener functionality, the method was not found, received '${uniqueIdentifier}' as the unique identifier for the corresponding event listener '${eventListenerType}'`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //turns an an event listener by adding it from the target element
  eventListenerOn(eventListenerType) {
    try {
      this.#argValidatorForApis("eventListenerOn", { eventListenerType }); //validate input
      this.#eventListenerInitializer(eventListenerType); //initialize the event listener corresponding to the supplied type
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //turns off an event listener by removing it from the target element
  eventListenerOff(eventListenerType) {
    try {
      this.#argValidatorForApis("eventListenerOff", { eventListenerType }); //validate input
      this.#eventListenerRemover(eventListenerType); //remove the event listener corresponding to the supplied type
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //a simple api to get the data on currently existing methods per event type
  getExistingFunctionalities() {
    return this.#eventListenerData.functionalities;
  }

  //a simple api to get the data representing whether each specific event listener is on or off
  getActiveEventListeners() {
    return this.#eventListenerData.active;
  }
}

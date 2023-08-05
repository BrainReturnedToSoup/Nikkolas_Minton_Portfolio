class FormValidator {
  constructor(
    formControlElementArr,
    elementRefManager,
    eventDrivenFunctionalityManager
  ) {
    try {
      if (
        //make a simple validation of the constructor args
        elementRefManager instanceof ElementRefManager &&
        eventDrivenFunctionalityManager instanceof
          EventDrivenFunctionalityManager &&
        Array.isArray(formControlElementArr) &&
        formControlElementArr.length > 0
      ) {
        this.#configData.formControlElementArr = formControlElementArr; // will be used to determine which elements to apply validation to

        this.#helperClasses.elementRefManager = elementRefManager; // will be used to pull the references of said elements
        this.#helperClasses.eventDrivenFunctionalityManager =
          eventDrivenFunctionalityManager; // will be used to catch the various events needed in order to facilitate the needed functionality

        this.#fetchRequiredElementRefs(); // fetch all of the required element references in order to facilitate the validation based on the constructed form
      } else {
        throw new ReferenceError(
          `Failed to apply various configuration data to the class instance state data, one of the supplied arguments fails to meet a requirement defined by the constructor, received '${formControlElementArr}' as the supplied array to contain form control elements, '${elementRefManager}' as the supplied element reference manager class, and "${eventDrivenFunctionalityManager}" as the supplied event driven functionality manager class`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //holds data pertaining to configuring the behavior of this class
  //which is supplied by the constructor arguments mostly
  #configData = {
    formControlElementArr: null,
    validationOn: false,
  };

  //holds data that is important to facilitate the functionality of this class
  //but is not necessarily derived directly from the constructor arguments
  #refData = {
    retrievedElementRefs: {},
    elementsRetrieved: false,
  };

  //holds values to important class instances that help facilitate specific functionality within the class
  //through their interfaces
  #helperClasses = {
    elementRefManager: null,
    eventDrivenFunctionalityManager: null,
  };

  //holds the text data relating to a specific validation failure based on the corresponding form control element, which will
  //be used mainly by the check validity method in order to facilitate the basic validity check using the constraint api
  #validationFailureText = {
    email: {
      valueMissing: "Please enter a valid email address.",
      typeMismatch:
        "The supplied information for this field is not a valid email address.",
    },
    zipCode: {
      valueMissing: "Please enter a valid ZIP Code.",
      patternMismatch:
        "The supplied information for this field is not a valid ZIP Code.",
    },
    password: {
      valueMissing: "Please enter your password.",
      patternMismatch:
        "The supplied information for this field is not a valid password.",
    },
    confirmPassword: {
      valueMissing: "Please repeat your password.",
      customError: "These passwords do not match.",
    },
  };

  #getValidationFailureMessage(formControlElement, validityStateObj) {
    //checks for the existence of the corresponding form control element within validationFailureText,
    //as well as whether validityStateObj is in fact an object
    //Then it checks all properties within the validityStateObj and checks for any true boolean value on
    //the various validation failure properties, if this happens, return the corresponding text to represent
    //the validation failure message to the user
    if (formControlElement in this.#validationFailureText) {
      switch (true) {
        case validityStateObj.valueMissing:
          return this.#validationFailureText[formControlElement].valueMissing;
        case validityStateObj.typeMismatch:
          return this.#validationFailureText[formControlElement].typeMismatch;
        case validityStateObj.tooLong:
          return this.#validationFailureText[formControlElement].tooLong;
        case validityStateObj.tooShort:
          return this.#validationFailureText[formControlElement].tooShort;
        case validityStateObj.rangeOverflow:
          return this.#validationFailureText[formControlElement].rangeOverflow;
        case validityStateObj.stepMismatch:
          return this.#validationFailureText[formControlElement].stepMismatch;
        case validityStateObj.patternMismatch:
          return this.#validationFailureText[formControlElement]
            .patternMismatch;
        case validityStateObj.customError:
          return this.#validationFailureText[formControlElement].customError;
      }
    } else {
      throw new Error(
        `Failed to retrieve text to display corresponding to the validation that a specific input failed, the supplied form control element does not exist within the validation failure text data, received '${formControlElement}' as the supplied form control element `
      );
    }
  }

  #fetchRequiredElementRefs() {
    //iterates over every element in the supplied form control element array, and retrieves their corresponding
    //reference in the element ref manager
    const retrievedForm =
      this.#helperClasses.elementRefManager.retrieveRef("formElement"); //for retrieving the form tag reference so to speak

    if (retrievedForm !== null) {
      this.#refData.retrievedElementRefs["formElement"] = retrievedForm; //stores it in the local cache if successfully retrieved
    }

    for (let element of this.#configData.formControlElementArr) {
      const retrievedElement =
        this.#helperClasses.elementRefManager.retrieveRef(element);

      //if a form control element reference is successfully retrieved, add it to the retrievedElementRefs property in the config data
      if (retrievedElement !== null) {
        this.#refData.retrievedElementRefs[element] = retrievedElement;
      }
    }
  }

  #eventFunctionalities = {
    input: {
      email: (event) => {
        //checks for the existence of the retrieved property, if the property was retrieved,
        //the associated functionality can commence
        if ("email" in this.#refData.retrievedElementRefs) {
          const emailInput =
              this.#refData.retrievedElementRefs.email.querySelector("input"),
            validationFailureTextElement = emailInput.nextElementSibling;

          if (event && event !== null && event.target !== emailInput) {
            return; //instant return if an event was supplied, and it wasn't representing this specific input
          }

          //display the validation failure message or delete all of the text if the input passed
          if (emailInput.validity.valid === false) {
            const validationFailureMessage = this.#getValidationFailureMessage(
              "email",
              emailInput.validity
            );
            validationFailureTextElement.textContent = validationFailureMessage;
          } else {
            validationFailureTextElement.textContent = "";
          }
        }
      },
      zipCode: (event) => {
        //checks for the existence of the retrieved property, if the property was retrieved,
        //the associated functionality can commence
        if ("zipCode" in this.#refData.retrievedElementRefs) {
          const zipCodeInput =
              this.#refData.retrievedElementRefs.zipCode.querySelector("input"),
            validationFailureTextElement = zipCodeInput.nextElementSibling;

          if (event && event !== null && event.target !== zipCodeInput) {
            return; //instant return if an event was supplied, and it wasn't representing this specific input
          }

          //display the validation failure message or delete all of the text if the input passed
          if (zipCodeInput.validity.valid === false) {
            const validationFailureMessage = this.#getValidationFailureMessage(
              "zipCode",
              zipCodeInput.validity
            );
            validationFailureTextElement.textContent = validationFailureMessage;
          } else {
            validationFailureTextElement.textContent = "";
          }
        }
      },
      password: (event) => {
        //checks for the existence of the retrieved property, if the property was retrieved,
        //the associated functionality can commence
        if ("password" in this.#refData.retrievedElementRefs) {
          const passwordInput =
            this.#refData.retrievedElementRefs.password.querySelector("input");

          //check if there is also a retrieved confirm password, if so activate the specific functionality
          //that exists when there is also a confirm password field, which essentially disables the
          //password field if you are adding data to the confirm password field
          if ("confirmPassword" in this.#refData.retrievedElementRefs) {
            const confirmPasswordInput =
              this.#refData.retrievedElementRefs.confirmPassword.querySelector(
                "input"
              );

            if (confirmPasswordInput.value !== "") {
              passwordInput.disabled = true;
              return;
            } else {
              passwordInput.disabled = false;
            }
          }

          if (event && event !== null && event.target !== passwordInput) {
            return; //instant return if an event was supplied, and it wasn't representing this specific input
          }

          //retrieve the reference to the validation failure element that will display the relevant messages
          //to the user on what caused the failure, and then check the validity of the target form control element
          const validationFailureTextElement = passwordInput.nextElementSibling;

          //display the validation failure message or delete all of the text if the input passed
          if (passwordInput.validity.valid === false) {
            const validationFailureMessage = this.#getValidationFailureMessage(
              "password",
              passwordInput.validity
            );
            validationFailureTextElement.textContent = validationFailureMessage;
          } else {
            validationFailureTextElement.textContent = "";
          }
        }
      },
      confirmPassword: (event) => {
        if (
          "password" in this.#refData.retrievedElementRefs &&
          "confirmPassword" in this.#refData.retrievedElementRefs
        ) {
          //only activates the functionality if a password and confirm password reference was successfully retrieved
          const passwordInput =
              this.#refData.retrievedElementRefs.password.querySelector(
                "input"
              ),
            confirmPasswordInput =
              this.#refData.retrievedElementRefs.confirmPassword.querySelector(
                "input"
              );

          //if the password field either doesn't possess a value within it or fails its own validation check,
          //keep the confirm password field disabled, otherwise enable the user to add info to such
          if (
            passwordInput.value === "" ||
            passwordInput.validity.valid === false
          ) {
            confirmPasswordInput.disabled = true;
            return;
          } else {
            confirmPasswordInput.disabled = false;
          }

          if (
            event &&
            event !== null &&
            event.target !== confirmPasswordInput
          ) {
            return; //instant return if an event was supplied, and it wasn't representing this specific input
          }

          const validationFailureTextElement =
            confirmPasswordInput.nextElementSibling;

          //if the confirm password input value does not match the regular password input,
          //make it manually fail validation, change its validity state manually, and display
          //the corresponding message due to this specific failure. Otherwise pass the confirm password
          //field if it's the same value as the password field
          if (confirmPasswordInput.value !== passwordInput.value) {
            //have to use setCustomValidity with a non empty string to
            //toggle the property customError as a true value, otherwise,
            //that property is read only and I cant directly modify it
            if (!confirmPasswordInput.validity.customError) {
              confirmPasswordInput.setCustomValidity(
                "placeholder to toggle customError validity property"
              );
            }

            const validationFailureMessage = this.#getValidationFailureMessage(
              "confirmPassword",
              confirmPasswordInput.validity
            );

            validationFailureTextElement.textContent = validationFailureMessage;
          } else {
            if (confirmPasswordInput.validity.customError) {
              confirmPasswordInput.setCustomValidity("");
            }
            validationFailureTextElement.textContent = "";
          }
        }
      },
    },
    submit: {
      checkFormValidity: (event) => {
        //do one last check on the validity of individual input fields
        for (let functionality of Object.values(
          this.#eventFunctionalities.input
        )) {
          //special situation where there is not a specific input event supplied, rather
          // the validity of the target input is simply read for all instances of functionality
          functionality(null);
        }

        //if a specific form control element fails to be valid, prevent the submission of the form
        for (let formControlElement of Object.values(
          this.#refData.retrievedElementRefs
        )) {
          const inputElement = formControlElement.querySelector("input");
          if (!inputElement.checkValidity()) {
            event.preventDefault();
          }
        }
      },
    },
  };

  //will hold functions that will be supplied to the event driven functionality manager
  //class when adding a sort of functionality, this way the manager only needs to accept
  //one functionality to execute corresponding to the event listener, and the supplied
  //function will execute all of the necessary functionality from the validator scope
  #createFunctionalitiesEntryPoint(eventType) {
    const methodName = `formValidation${eventType}`, //creates the unique method name
      assembledMethodArr = [
        methodName,
        (event) => {
          for (let method in this.#eventFunctionalities[eventType]) {
            this.#eventFunctionalities[eventType][method](event);
          }
        },
      ];

    //creates a 2 element array that contains the method name as the first element,
    //and a function as the actual method being implemented
    return assembledMethodArr;
  }

  #eventDrivenFunctionalityManagerMethods = {
    addFunctionalities: () => {
      //will add entrypoint functions to the event driven functionality manager class instance to all of the
      //necessary event listeners, so that upon every time that event is caught, this entry point function will execute,
      //which it will execute all of the functions from the form validator scope, which each individual functionality will be supplied the event caught
      const { eventDrivenFunctionalityManager } = this.#helperClasses,
        inputMethodArr = this.#createFunctionalitiesEntryPoint("input"),
        submitMethodArr = this.#createFunctionalitiesEntryPoint("submit");

      eventDrivenFunctionalityManager.addFunctionalityToEvent(
        "input",
        inputMethodArr[0],
        inputMethodArr[1]
      );

      eventDrivenFunctionalityManager.addFunctionalityToEvent(
        "submit",
        submitMethodArr[0],
        submitMethodArr[1]
      );
    },
    removeFunctionalities: () => {
      //removes all of the added entrypoints from the event driven functionality manager
      const { eventDrivenFunctionalityManager } = this.#helperClasses;

      eventDrivenFunctionalityManager.removeFunctionalityFromEvent(
        "formValidationInput"
      );

      eventDrivenFunctionalityManager.removeFunctionalityFromEvent(
        "formValidationSubmit"
      );
    },
    turnOnEventListeners: () => {
      //turns on event listeners through the manager
      const { eventDrivenFunctionalityManager } = this.#helperClasses;

      eventDrivenFunctionalityManager.eventListenerOn("input");
      eventDrivenFunctionalityManager.eventListenerOn("submit");
    },
    turnOffEventListeners: () => {
      //turns off event listeners through the manager
      const { eventDrivenFunctionalityManager } = this.#helperClasses;

      eventDrivenFunctionalityManager.eventListenerOff("input");
      eventDrivenFunctionalityManager.eventListenerOff("submit");
    },
  };

  //turn on the validation of the corresponding form for this class instance
  activate() {
    try {
      if (!this.#configData.validationOn) {
        const { addFunctionalities, turnOnEventListeners } =
          this.#eventDrivenFunctionalityManagerMethods;

        addFunctionalities();
        turnOnEventListeners();

        this.#configData.validationOn = true;
      } else {
        throw new Error(
          `Failed to turn validation on because it's already on for this specific class instance`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  //turn off the validation of the corresponding form for this class instance
  deactivate() {
    try {
      if (this.#configData.validationOn) {
        const { removeFunctionalities, turnOffEventListeners } =
          this.#eventDrivenFunctionalityManagerMethods;

        removeFunctionalities();
        turnOffEventListeners();

        this.#configData.validationOn = false;
      } else {
        throw new Error(
          `Failed to turn validation off because it's already off for this specific class instance`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

class EventDrivenFunctionalityManager {
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

class ElementRefManager {
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

class FormConstructor {
  constructor(
    formControlElementArr,
    action,
    method,
    submitButtonText,
    elementRefManager
  ) {
    if (elementRefManager instanceof ElementRefManager) {
      this.#helperClasses.elementRefManager = elementRefManager; //add the element ref manager class instance to the state of the class
    }

    //add necessary properties supplied by the constructor argument to the configuration data of this class
    //This will make the class create the form desired based on the supplied configuration so to speak
    if (
      Array.isArray(formControlElementArr) &&
      formControlElementArr.length > 0
    ) {
      this.#configData.formControlElementArr = formControlElementArr;
    } else {
      throw new Error(
        `ERROR: FAILED TO APPLY ARGUMENT TO '${this.constructor.name}' CLASS STATE : SUPPLIED ARGUMENT 'formControlElementArr' MUST BE AN ARRAY AND CONTAIN ELEMENTS : RECEIVED ${formControlElementArr}`
      );
    }

    if (typeof action === "string") {
      this.#configData.action = action;
    } else {
      throw new Error(
        `ERROR: FAILED TO APPLY ARGUMENT TO '${this.constructor.name}' CLASS STATE : SUPPLIED ARGUMENT 'action' MUST BE A STRING : RECEIVED ${action}`
      );
    }

    if (typeof method === "string") {
      this.#configData.method = method;
    } else {
      throw new Error(
        `ERROR: FAILED TO APPLY ARGUMENT TO '${this.constructor.name}' CLASS STATE : SUPPLIED ARGUMENT 'method' MUST BE A STRING : RECEIVED ${method}`
      );
    }

    if (typeof submitButtonText === "string") {
      this.#configData.submitButtonText = submitButtonText;
    }
  }

  //configuration data that the builder methods reference when executing
  #configData = {
    formControlElementArr: null,
    action: null,
    method: null,
    submitButtonText: "Submit",
  };

  //contains references to class instances that will help this class
  //facilitate its functionality in some way
  #helperClasses = {
    elementRefManager: null,
  };

  //contains predefined templates in order to make the creation of specific form control
  //elements straight forward through the script, as well as easy to maintain and add more
  //templates
  #formControlElementTemplates = {
    email: `
    <div class="email-input-container">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
        <div class="email-validation-failure"></div>
    </div>
    `,
    zipCode: `
    <div class="zipcode-input-container">
        <label for="zipcode">ZIP Code</label>
        <input type="text" id="zipcode" name="zipcode" pattern="[0-9]{5}" inputmode="numeric" minlength="5" maxlength="5" required>
        <div class="zipcode-validation-failure"></div>
    </div>
    `,
    password: ` 
    <div class="password-input-container">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" pattern="^[^\\s]*$" required>
        <div class="password-validation-failure"></div>
    </div>
    `,
    confirmPassword: `
    <div class="confirm-password-input-container">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" name="confirmPassword" disabled="true" required>
        <div class="confirm-password-validation-failure"></div>
    </div>
    `,
  };

  //holds methods that are capable of building all of the necessary elements
  //within a form, which can be configured to include specific form control elements
  //of choice
  #elementBuilders = {
    form: (action, method) => {
      const formElement = document.createElement("form"); //create the form tag itself

      formElement.classList.add(`form-element`); //add a base class

      //add important specific to form elements as listed below, or use default values if they aren't supplied
      if (typeof action === "string") {
        formElement.setAttribute("action", action);
      } else {
        formElement.setAttribute("action", "#");
      }

      if (typeof method === "string") {
        formElement.setAttribute("method", method);
      } else {
        formElement.setAttribute("method", "get");
      }

      formElement.setAttribute("novalidate", "");

      //stores it as a reference in the ref manager if such is being used
      //Defines explicitly the key of the pair since its not pulled from a template name
      //rather its created explicitly itself
      if (this.#helperClasses.elementRefManager !== null) {
        this.#helperClasses.elementRefManager.addRef(
          "formElement",
          formElement
        );
      }

      return formElement;
    },
    formControl: (formControlElement) => {
      if (formControlElement in this.#formControlElementTemplates) {
        //create the corresponding form control element fragment if an existing template is found
        const range = document.createRange(),
          elementFrag = range.createContextualFragment(
            this.#formControlElementTemplates[formControlElement]
          ),
          containerRef = elementFrag.firstElementChild;

        //stores it as a reference in the ref manager if such is being used
        //Uses the ref of the container element in the value of the saved key value pair
        if (this.#helperClasses.elementRefManager !== null) {
          this.#helperClasses.elementRefManager.addRef(
            formControlElement,
            containerRef
          );
        }

        return containerRef;
      } else {
        throw new Error(
          `ERROR: COULD NOT CONSTRUCT FORM CONTROL ELEMENT : SUPPLIED FORM CONTROL ELEMENT NOT FOUND WITHIN TEMPLATE DATA : RECEIVED ${formControlElement}`
        );
      }
    },
    submitButton: () => {
      const submitButton = document.createElement("button");
      return submitButton;
    },
  };

  #buildCompleteFormElement(formControlElementArr, action, method) {
    //create the form element and the submit button element as they are mandatory
    //features when creating a form
    const formElement = this.#elementBuilders.form(action, method),
      submitButtonElement = this.#elementBuilders.submitButton();

    //adds text to submit button
    submitButtonElement.textContent = this.#configData.submitButtonText;

    //iterate over the existing form control elements and create them based on existing templates
    for (let formControlElement of formControlElementArr) {
      //if the current form control element listed in the config array exists within the templates, create it and append it to the form element
      if (formControlElement in this.#formControlElementTemplates) {
        const builtformControlElement =
          this.#elementBuilders.formControl(formControlElement);

        formElement.append(builtformControlElement);
      }
    }

    formElement.append(submitButtonElement);

    //return complete form
    return formElement;
  }

  //single api to return the corresponding form element based on the supplied arguments to the class constructor
  createForm() {
    const { formControlElementArr, action, method } = this.#configData,
      assembledFormElement = this.#buildCompleteFormElement(
        formControlElementArr,
        action,
        method
      );

    return assembledFormElement;
  }
}

export class UserDataForm {
  //creates unique class instances of all the sub classes, which
  //may or may not use the supplied configuration from this main constructor
  constructor(formControlElementArr, action, method, submitButtonText) {
    //unique ERM
    this.#subClasses.elementRefManager = new ElementRefManager();

    //unique form constructor
    this.#subClasses.formConstructor = new FormConstructor(
      formControlElementArr,
      action,
      method,
      submitButtonText,
      this.#subClasses.elementRefManager
    );

    //create the form
    this.#formElement = this.#subClasses.formConstructor.createForm();

    //unique EDFM
    this.#subClasses.eventDrivenFunctionalityManager =
      new EventDrivenFunctionalityManager(
        this.#subClasses.elementRefManager.retrieveRef("formElement")
      );

    //unique validator
    this.#subClasses.formValidator = new FormValidator(
      formControlElementArr,
      this.#subClasses.elementRefManager,
      this.#subClasses.eventDrivenFunctionalityManager
    );
  }

  //holds values of specific sub class references
  #subClasses = {
    elementRefManager: null,
    formConstructor: null,
    formValidator: null,
    eventDrivenFunctionalityManager: null,
  };

  #formElement = null; //holds a reference to the actual form that was created using the supplied args

  #formAppended = false; //data to use as a reference so that the form cannot be appended more than once

  #validationOn = false; //data to represent whether the validation is taking place on the form

  toggleValidation() {
    if (!this.#validationOn) {
      this.#subClasses.formValidator.activate();
      this.#validationOn = true;
    } else {
      this.#subClasses.formValidator.deactivate();
      this.#validationOn = false;
    }
  }

  appendForm(parentElement) {
    try {
      if (
        parentElement instanceof Element &&
        this.#formElement instanceof Element &&
        !this.#formAppended
      ) {
        //checks that the supplied parent element is actually an element so the form can be appended to it

        this.#subClasses.formValidator.activate(); //initializes the form validation feature of the form which uses the constraint api

        parentElement.append(this.#formElement); //append the form to a target parent element

        this.#formAppended = true; //saves to state that the form created was appended so that this method won't successfully work more than once
      } else {
        throw new Error(
          `Failed to append form to a target element, either the supplied target element is not an element, the constructed form is not an element, or the form was already appended once before, received '${parentElement}' as the target element to append the form to`
        );
      }
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

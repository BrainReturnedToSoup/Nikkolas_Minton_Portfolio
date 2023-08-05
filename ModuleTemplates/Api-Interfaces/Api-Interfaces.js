//API INTERFACES THAT EXTEND FROM THE TEMPLATE SHOULD ALWAYS RETURN THE FETCH PROMISE FOR THEIR APIS
//THIS WAY THE API INTERACTION CAN BE MODULARIZED AND WHOEVER USES THE API INSTANCE CAN CONFIGURE THEIR OWN
//FUNCTIONALITY RELATING TO THE API REQUEST PROMISE. ALL THESE CLASSES DO IS PROVIDE A STRAIGHT FORWARD
//WAY TO MAKE FETCH REQUESTS TO SPECIFIC APIS, THATS IT.

class ApiInterface {
  //the purpose of this class is to act as a generic template that specific api
  //interfacing classes can extend to and create their specific functionalities with
  //using the general fetch methods within this template

  //--------------------STATE-AND-CONFIG-DATA----------------------//

  configData = {
    apiKey: null,
    apiName: null,
  };

  defaultOptions = {
    get: {
      method: "get",
    },
    post: {
      method: "post",
      //part of sending data to the server
      headers: {
        "Content-Type": "application/json",
      },
      body: null, //should be JSON data
    },
    put: {
      method: "put",
      //part of sending data to the server
      headers: {
        "Content-Type": "application/json",
      },
      body: null, //should be JSON data
    },
    delete: {
      method: "delete",
    },
  };

  //-----------------------HELPER-METHODS---------------------------//

  addPayload(options, payload) {
    const convertedPayload = this.convertPayloadToJSON(payload);
    options.body = convertedPayload;

    return options;
  }

  convertPayloadToJSON(payload) {
    const convertedPayload = JSON.stringify(payload);
    return convertedPayload;
  }

  processResponseAsJSON = async (response) => {
    const processedResponse = await response.json();
    return processedResponse;
  };

  //------------------------API-INTERACTION--------------------------/

  requestMethods = {
    get: async (url, options = this.defaultOptions.get) => {
      try {
        const resp = await fetch(url, options); //await a response first

        //if the request was successful
        if (resp.ok === true) {
          const parsedData = await this.processResponseAsJSON(resp);
          return parsedData;
        } else {
          //if the request failed for some reason
          throw new Error(
            `GET Request to the desired api failed, target api is '${this.configData.apiName}', '${resp.status}: ${resp.statusText}'`
          );
        }
      } catch (error) {
        console.error(error, error.stack);
      }
    },
    post: async (url, options = this.defaultOptions.post, payload) => {
      try {
        const finalOptions = this.addPayload(options, payload);

        const resp = await fetch(url, finalOptions);
        //if the request was successful
        if (resp.ok === true) {
          const parsedData = await this.processResponseAsJSON(resp);
          return parsedData;
        } else {
          //if the request failed for some reason
          throw new Error(
            `POST Request to the desired api failed, target api is '${this.configData.apiName}', '${resp.status}: ${resp.statusText}'`
          );
        }
      } catch (error) {
        console.error(error, error.stack);
      }
    },
    put: async (url, options = this.defaultOptions.put, payload) => {
      try {
        const finalOptions = this.addPayload(options, payload);

        const resp = await fetch(url, finalOptions);
        //if the request was successful
        if (resp.ok === true) {
          const parsedData = await this.processResponseAsJSON(resp);
          return parsedData;
        } else {
          //if the request failed for some reason
          throw new Error(
            `PUT Request to the desired api failed, target api is '${this.configData.apiName}', '${resp.status}: ${resp.statusText}'`
          );
        }
      } catch (error) {
        console.error(error, error.stack);
      }
    },
    delete: async (url, options = this.defaultOptions.delete) => {
      try {
        const resp = await fetch(url, options); //await a response first

        //if the request was successful
        if (resp.ok === true) {
          const parsedData = await this.processResponseAsJSON(resp);
          return parsedData;
        } else {
          //if the request failed for some reason
          throw new Error(
            `DELETE Request to the desired api failed, target api is '${this.configData.apiName}', '${resp.status}: ${resp.statusText}'`
          );
        }
      } catch (error) {
        console.error(error, error.stack);
      }
    },
  };
}

class WeatherApi extends ApiInterface {
  constructor(apiKey) {
    super(); //call parent constructor

    this.#argValidator("constructor", { apiKey });

    //define the configuration for the weather api instance
    this.configData.apiName = "WeatherApi";
    this.configData.apiKey = apiKey;
  }

  //---------------------STATE-AND-CONFIG-DATA------------------//

  //the base template string, at which to add parameters, they are concatenated at the end of the string
  #urlTemplate = `http://api.weatherapi.com/v1/current.json?key=${this.configData.apiKey}`;

  //---------------------ARGUMENT-VALIDATION--------------------//

  #argValidationData = {
    constructor: {
      apiKey: { type: "string" },
    },
    getCurrentWeather: {
      loc: { type: "string" },
    },
    getForecast: {
      loc: { type: "string" },
      days: { type: "number", posOrNeg: "positive" },
    },
  };

  //holds methods that actually do the validation of a specific supplied argument on one of its properties
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
    posOrNeg: (suppliedArg, argName, methodOrigin, correctInstance) => {
      if (correctInstance === "positive") {
        if (suppliedArg !== Math.abs(suppliedArg)) {
          throw new Error(`Argument '${argName}' for method '${methodOrigin}' failed integer validation,
          received '${suppliedArg}' which is negative, but it needs to be positive`);
        }
      } else if (correctInstance === "negative") {
        if (suppliedArg === Math.abs(suppliedArg)) {
          throw new Error(`Argument '${argName}' for method '${methodOrigin}' failed integer validation,
          received '${suppliedArg}' which is positive, but it needs to be negative`);
        }
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

  //------------------------HELPER-METHODS-----------------------//

  #urlParams = {
    location: (location) => {
      return `q=${location}`;
    },
    numOfDays: (numOfDays) => {
      return `days=${numOfDays}`;
    },
    airQuality: (boolean) => {
      let yesOrNo;

      if (boolean) {
        yesOrNo = "yes";
      } else {
        yesOrNo = "no";
      }
      return `aqi=${yesOrNo}`;
    },
    weatherAlerts: (boolean) => {
      let yesOrNo;

      if (boolean) {
        yesOrNo = "yes";
      } else {
        yesOrNo = "no";
      }
      return `alerts=${yesOrNo}`;
    },
  };

  //------------------------API-INTERFACE------------------------//

  //location method is the method to use to retrieve current weather data. Example: IP, city, etc.
  //location value is the corresponding value, so say the corresponding IP, or city, etc.
  getCurrentWeather(loc) {
    try {
      //validate input
      this.#argValidator("getCurrentWeather", { loc });

      //get the base url and the parameter string constructors
      const baseUrl = this.#urlTemplate,
        { location, airQuality, weatherAlerts } = this.#urlParams,
        { get } = this.requestMethods;

      //build the necessary parameters
      const locString = location(loc),
        airQualityString = airQuality(false),
        weatherAlertsString = weatherAlerts(false);

      //concat into the final url string
      const finalUrl =
        baseUrl + locString + airQualityString + weatherAlertsString;

      //make a get request that returns a promise instance
      const requestPromise = get(finalUrl);

      return requestPromise;
    } catch (error) {
      console.error(error, error.stack);
    }
  }

  getForecast(loc, days) {
    try {
      //validate input
      this.#argValidator("getForecast", { loc, days });

      //get the base url and the parameter string constructors
      const baseUrl = this.#urlTemplate,
        { location, numOfDays, airQuality, weatherAlerts } = this.#urlParams,
        { get } = this.requestMethods;

      //build the necessary parameters
      const locString = location(loc),
        numOfDaysString = numOfDays(days),
        airQualityString = airQuality(false),
        weatherAlertsString = weatherAlerts(false);

      //concat into the final url string
      const finalUrl =
        baseUrl +
        locString +
        numOfDaysString +
        airQualityString +
        weatherAlertsString;

      //make a get request that returns a promise instance
      const requestPromise = get(finalUrl);

      return requestPromise;
    } catch (error) {
      console.error(error, error.stack);
    }
  }
}

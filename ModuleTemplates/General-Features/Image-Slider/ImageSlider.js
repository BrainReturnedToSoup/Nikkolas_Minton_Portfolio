export class ImageSlider {
  constructor(
    uniqueIdentifier,
    numOfImages = 2,
    intervalTime = 1000,
    resetIntervalTime = 150
  ) {
    if (numOfImages >= 2 && intervalTime >= 1000 && resetIntervalTime >= 25) {
      this.#stateData.uniqueIdentifier = uniqueIdentifier;
      this.#stateData.numOfImages = numOfImages;
      this.#stateData.intervalTime = intervalTime;
      this.#stateData.resetIntervalTime = resetIntervalTime;
      //attributes that will dictate certain behaviors of this image slider instance
    }
  }
  #DOMcache = {};
  //for saving all created elements in the DOM cache when it's convenient to minimize long run element querying
  #DOMtemplates = {
    sliderContainer: `
      <div class="Image-Slider-Container"></div>
    `,
    sliderDisplay: `
      <div class="Image-Slider-Display"></div>
    `,
    sliderImage: `
    <div class="Image-Slider-Image"></div>
    `,
    sliderButtons: `
      <div class="Image-Slider-Buttons">
        <button class="Image-Slider-Button Left"></button>
        <button class="Image-Slider-Button Center"></button>
        <button class="Image-Slider-Button Right"></button>
      </div>
    `,
  };
  //various string templates used to create the foundation of the image slider

  #stateData = {
    DOMSliderImageClasses: [],
    arrCurrentKeySIC: 0,
    autoTransitionInterval: null,
    intervalTime: 2000,
    resetIntervalTime: 150,
    numOfImages: 2,
    uniqueIdentifier: "",
    sliderButtonClicked: false,
    sliderDirection: "Right",
    resetIntervalIndex: 0,
    resetIntervalRef: null,
  };

  //used to manage important data in terms of defining the behavior of the image slider as a whole
  //as well as used as a data reference in order to facilitate specific logic in various methods within
  //this class

  #initSliderAutoTransition() {
    if (!this.#stateData.autoTransitionInterval) {
      this.#stateData.autoTransitionInterval = setInterval(() => {
        this.#moveSliderRight();
      }, this.#stateData.intervalTime);
    }
  }
  //method for initializing the automatic image sliding animation, which will always slide right on the set interval
  //unless interupted by event logic

  #moveSliderRight() {
    const currentSelectedImage =
      this.#stateData.DOMSliderImageClasses[this.#stateData.arrCurrentKeySIC];

    let previousUnselectedImage;

    if (this.#stateData.arrCurrentKeySIC - 1 < 0) {
      previousUnselectedImage =
        this.#stateData.DOMSliderImageClasses[
          this.#stateData.DOMSliderImageClasses.length - 1
        ];
    } else {
      previousUnselectedImage =
        this.#stateData.DOMSliderImageClasses[
          this.#stateData.arrCurrentKeySIC - 1
        ];
    }

    if (this.#stateData.sliderDirection !== "Right") {
      this.#DOMcache[currentSelectedImage].classList.remove("Selected-Left");
      this.#DOMcache[
        this.#stateData.DOMSliderImageClasses[
          this.#stateData.arrCurrentKeySIC ===
          this.#stateData.DOMSliderImageClasses.length - 1
            ? 0
            : this.#stateData.arrCurrentKeySIC + 1
        ]
      ].classList.remove("Unselected-Left");

      this.#stateData.sliderDirection = "Right";
    }

    this.#stateData.arrCurrentKeySIC++;

    if (
      this.#stateData.arrCurrentKeySIC >
      this.#stateData.DOMSliderImageClasses.length - 1
    ) {
      this.#stateData.arrCurrentKeySIC = 0;
    }

    const nextSelectedImage =
      this.#stateData.DOMSliderImageClasses[this.#stateData.arrCurrentKeySIC];

    this.#DOMcache[previousUnselectedImage].classList.remove(
      "Unselected-Right"
    );
    this.#DOMcache[currentSelectedImage].classList.remove("Selected-Right");
    this.#DOMcache[currentSelectedImage].classList.add("Unselected-Right");
    this.#DOMcache[nextSelectedImage].classList.add("Selected-Right");
  }
  //used to facilitate the concept of moving the current viewed image to the next image
  //Which the way to create this animation using this logic is to utilize the various selected/unselected
  //classes, which all this method does is label the next image with the corresponding selected class in order
  //to animate it on screen, and label the image that was replaced with the corresponding unselected class
  //in order to animate it off screen. This method will always assign these classes in a fixed order.

  #moveSliderLeft() {
    const currentSelectedImage =
      this.#stateData.DOMSliderImageClasses[this.#stateData.arrCurrentKeySIC];

    if (this.#stateData.sliderDirection !== "Left") {
      this.#DOMcache[currentSelectedImage].classList.remove("Selected-Right");
      this.#DOMcache[
        this.#stateData.DOMSliderImageClasses[
          this.#stateData.arrCurrentKeySIC === 0
            ? this.#stateData.DOMSliderImageClasses.length - 1
            : this.#stateData.arrCurrentKeySIC - 1
        ]
      ].classList.remove("Unselected-Right");

      this.#stateData.sliderDirection = "Left";
    }

    let previousUnselectedImage;

    if (
      this.#stateData.arrCurrentKeySIC + 1 >
      this.#stateData.DOMSliderImageClasses.length - 1
    ) {
      previousUnselectedImage = this.#stateData.DOMSliderImageClasses[0];
    } else {
      previousUnselectedImage =
        this.#stateData.DOMSliderImageClasses[
          this.#stateData.arrCurrentKeySIC + 1
        ];
    }

    this.#stateData.arrCurrentKeySIC--;

    if (this.#stateData.arrCurrentKeySIC < 0) {
      this.#stateData.arrCurrentKeySIC =
        this.#stateData.DOMSliderImageClasses.length - 1;
    }

    const nextSelectedImage =
      this.#stateData.DOMSliderImageClasses[this.#stateData.arrCurrentKeySIC];

    this.#DOMcache[previousUnselectedImage].classList.remove("Unselected-Left");
    this.#DOMcache[currentSelectedImage].classList.remove("Selected-Left");
    this.#DOMcache[currentSelectedImage].classList.add("Unselected-Left");
    this.#DOMcache[nextSelectedImage].classList.add("Selected-Left");
  }

  //works the same way that the moveSliderRight does, but instead of using the necessary classes to facilitate the
  //animation for going right, it's for going left

  #resetSliderPositionInterval(directionMethodString, numberOfIntervals) {
    let directionMethod;

    if (directionMethodString === "Right") {
      directionMethod = this.#moveSliderRight;
    } else if (directionMethodString === "Left") {
      directionMethod = this.#moveSliderLeft;
    }

    this.#stateData.resetIntervalRef = setInterval(() => {
      this.#stateData.resetIntervalIndex++;
      directionMethod.bind(this)();
      if (this.#stateData.resetIntervalIndex === numberOfIntervals) {
        clearInterval(this.#stateData.resetIntervalRef);
        this.#stateData.resetIntervalRef = null;
        this.#stateData.resetIntervalIndex = 0;
        this.#stateData.sliderButtonClicked = false;
        this.#initSliderAutoTransition();
      }
    }, this.#stateData.resetIntervalTime);
  }
  #resetSliderPosition() {
    if (this.#stateData.arrCurrentKeySIC > 0) {
      if (
        this.#stateData.arrCurrentKeySIC >=
        Math.floor((this.#stateData.DOMSliderImageClasses.length - 1) / 2)
      ) {
        const numOfTimesGoRight =
          this.#stateData.DOMSliderImageClasses.length -
          Math.floor(this.#stateData.arrCurrentKeySIC - 1);
        clearInterval(this.#stateData.autoTransitionInterval);
        this.#stateData.autoTransitionInterval = null;
        this.#resetSliderPositionInterval("Right", numOfTimesGoRight);
        //go right until reset
      } else if (
        this.#stateData.arrCurrentKeySIC <
        Math.floor((this.#stateData.DOMSliderImageClasses.length - 1) / 2)
      ) {
        const numOfTimesGoLeft = this.#stateData.arrCurrentKeySIC;
        clearInterval(this.#stateData.autoTransitionInterval);
        this.#stateData.autoTransitionInterval = null;
        this.#resetSliderPositionInterval("Left", numOfTimesGoLeft);
        //go left until reset
      }
    } else if (this.#stateData.arrCurrentKeySIC === 0) {
      clearInterval(this.#stateData.autoTransitionInterval);
      this.#stateData.autoTransitionInterval = null;
      this.#initSliderAutoTransition();
      //if already on the first image
      return;
    }
  }

  //utilizes the moveSliderRight and moveSliderLeft methods in order to essentially cycle through the entire
  //image slider back to the starting point, that being image 1. It will find the shortest distance there,
  //and then use that to calculate the amount of intervals to execute the corresponding move right or move left method
  //to reach the starting point as efficiently as possible. This method also restarts the automatic image cycling if
  //it were otherwise disabled because the user clicked on one of the other buttons to interact with the slider

  #sliderButtonLogic(event) {
    const {
      sliderButtonLeftElement,
      sliderButtonCenterElement,
      sliderButtonRightElement,
    } = this.#DOMcache;

    switch (event.target) {
      case sliderButtonLeftElement:
        if (!this.#stateData.sliderButtonClicked) {
          clearInterval(this.#stateData.autoTransitionInterval);
          this.#stateData.autoTransitionInterval = null;
          this.#stateData.sliderButtonClicked =
            !this.#stateData.sliderButtonClicked;
        }
        this.#moveSliderLeft();
        break;
      case sliderButtonRightElement:
        if (!this.#stateData.sliderButtonClicked) {
          clearInterval(this.#stateData.autoTransitionInterval);
          this.#stateData.autoTransitionInterval = null;
          this.#stateData.sliderButtonClicked =
            !this.#stateData.sliderButtonClicked;
        }
        this.#moveSliderRight();
        break;
      case sliderButtonCenterElement:
        this.#resetSliderPosition();
        break;
      default:
        return;
    }
  }
  //logic behind each of the 3 buttons that exist for the image slider, either to move right, move left, or reset the slider

  #removeAllEventListeners() {
    this.#DOMcache.sliderButtonsContainerElement.removeEventListener(
      "click",
      (e) => {
        this.#sliderButtonLogic(e);
      }
    );
  }

  //removes all event listeners being used in this module

  #addAllEventListeners() {
    this.#DOMcache.sliderButtonsContainerElement.addEventListener(
      "click",
      (e) => {
        this.#sliderButtonLogic(e);
      }
    );
  }

  //adds all event listeners where necessary in this module

  initializeEventListeners() {
    this.#removeAllEventListeners();
    this.#addAllEventListeners();
  }

  //initializes the event listeners in a way to prevent extra event listeners

  #buildCompleteSlider() {
    this.#buildContainer();
    this.#buildDisplay();
    this.#buildButtons();

    const {
      sliderContainerElement,
      sliderDisplayContainerElement,
      sliderButtonsContainerElement,
    } = this.#DOMcache;

    sliderContainerElement.appendChild(sliderDisplayContainerElement);
    sliderContainerElement.appendChild(sliderButtonsContainerElement);

    return sliderContainerElement;
  }

  //responsible for facilitating the construction of the image slider, which calls
  //various methods to build their own parts and add them to the DOM cache for later referencing in other parts of the class.
  //These references are used to append each piece in the correct spot, which the output of this method
  //is the entire constructed image slider but without the actual image elements, these image elements are 
  //constructed and appended after this method is invoked naturally

  #buildContainer() {
    const SCrange = document.createRange(),
      sliderContainerFrag = SCrange.createContextualFragment(
        this.#DOMtemplates.sliderContainer
      );
    this.#DOMcache.sliderContainerElement = sliderContainerFrag.querySelector(
      ".Image-Slider-Container"
    );

    this.#DOMcache.sliderContainerElement.classList.add(
      this.#stateData.uniqueIdentifier
    );
  }

  //builds the main container of the image slider, which houses the display and the buttons containers
  //The DOM ref for this container is stored in the DOM cache

  #buildDisplay() {
    const SDrange = document.createRange(),
      sliderDisplayFrag = SDrange.createContextualFragment(
        this.#DOMtemplates.sliderDisplay
      );

    this.#DOMcache.sliderDisplayContainerElement =
      sliderDisplayFrag.querySelector(".Image-Slider-Display");

    this.#DOMcache.sliderDisplayContainerElement.classList.add(
      this.#stateData.uniqueIdentifier
    );
  }
  //builds the display container for the image slider, doesn't come with the image elements already inside
  //these are added afterwards utilizing the DOM reference to this element after being stored in the DOM cache in this
  //instance

  #buildButtons() {
    const SBrange = document.createRange(),
      sliderButtonsFrag = SBrange.createContextualFragment(
        this.#DOMtemplates.sliderButtons
      );

    this.#DOMcache.sliderButtonsContainerElement =
      sliderButtonsFrag.querySelector(".Image-Slider-Buttons");

    this.#DOMcache.sliderButtonLeftElement = sliderButtonsFrag.querySelector(
      ".Image-Slider-Button.Left"
    );
    this.#DOMcache.sliderButtonCenterElement = sliderButtonsFrag.querySelector(
      ".Image-Slider-Button.Center"
    );
    this.#DOMcache.sliderButtonRightElement = sliderButtonsFrag.querySelector(
      ".Image-Slider-Button.Right"
    );
    const {
      sliderButtonsContainerElement,
      sliderButtonLeftElement,
      sliderButtonCenterElement,
      sliderButtonRightElement,
    } = this.#DOMcache;

    [
      sliderButtonsContainerElement,
      sliderButtonLeftElement,
      sliderButtonCenterElement,
      sliderButtonRightElement,
    ].forEach((element) => {
      element.classList.add(this.#stateData.uniqueIdentifier);
    });
  }

  //builds the buttons container as well as the buttons and stored a reference for each element in the DOM cache

  #buildImage() {
    const SIrange = document.createRange(),
      sliderImageFrag = SIrange.createContextualFragment(
        this.#DOMtemplates.sliderImage
      ),
      sliderImageElement = sliderImageFrag.querySelector(".Image-Slider-Image");

    sliderImageElement.classList.add(this.#stateData.uniqueIdentifier);

    return sliderImageElement;
  }

  //generic constructor for the display images, which will build one image on a single method call, but is
  //used in conjuction with the addImageElements the construct the correct amount of images that you want and
  //then append them to the display container

  #mapImageIdentifiers(imageSet) {
    imageSet.forEach((imageElement, index = 0) => {
      const imageIdentifier = `Image-${index + 1}`;

      if (index === 0) {
        imageElement.classList.add("Selected-Right");
      }

      imageElement.classList.add(imageIdentifier);

      this.#DOMcache[imageIdentifier] = imageElement;
      this.#stateData.DOMSliderImageClasses.push(imageIdentifier);
    });
  }

  //takes an array of the image elements created and assigns some unique identifiers and default selected values
  //so that the image elements are easy to reference. Each image element has some sort of unique identifier in the
  //pattern of 'Image-#'. Also their assigned image identifier is added to the DOMSliderImageClasses which is used
  //to facilitate the interactive logic of the image slider

  #addImageElements(numOfImages) {
    const createdImageElements = [];

    if (numOfImages >= 2) {
      const { sliderDisplayContainerElement } = this.#DOMcache;
      sliderDisplayContainerElement.innerHTML = "";

      for (let i = 0; i < numOfImages; i++) {
        const imageElement = this.#buildImage();
        createdImageElements.push(imageElement);
        sliderDisplayContainerElement.appendChild(imageElement);
      }
    }

    if (createdImageElements.length > 0) {
      this.#mapImageIdentifiers(createdImageElements);
    }
  }

  //creates image elements based on the number of image elements defined by the instance of the class
  //Sends the image elements off to be mapped and identified in the class state as well as the DOM
  //then all of the image elements are appended to the display container afterwards

  #appendSlider(parentElement, assembledSlider) {
    parentElement.append(assembledSlider);
  }

  //used to append the completely constructed and initialized image slider to a target element

  init(parentElement) {
    if (
      parentElement &&
      typeof this.#stateData.uniqueIdentifier === "string" &&
      this.#stateData.numOfImages >= 2 &&
      !this.#stateData.init
    ) {
      const assembledSlider = this.#buildCompleteSlider();
      this.initializeEventListeners();

      this.#addImageElements(this.#stateData.numOfImages);

      this.#appendSlider(parentElement, assembledSlider);
      this.#initSliderAutoTransition();

      this.#stateData.init = !this.#stateData.init;
    }
  }

  //the only API of this class, which allows you to create and append the customized image slider to a target
  //element, which this method can only be invoked once per class instance in order to avoid potential conflicts
  //in regards to element references
}

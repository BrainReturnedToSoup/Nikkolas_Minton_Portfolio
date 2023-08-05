import "../stylesheets/navbar-styling.css";

export class Navbar {
  #DOMtemplates = {
    navBar: `
    <nav>
      <div class="Header-Container"></div>
      <div class="Nav-Buttons-Container">
        <div class="Home-Button Nav-Button">
          <h3 class="Home-Button-Text Nav-Button-Text">HOME</h3>
          <ul class="Home-Button-Dropdown Nav-Button-List">
            <li class="Nav-Button-List-Item">item 1</li>
            <li class="Nav-Button-List-Item">item 2</li>
            <li class="Nav-Button-List-Item">item 3</li>
          </ul>
        </div>
        <div class="About-Button Nav-Button">
          <h3 class="About-Button-Text Nav-Button-Text">ABOUT</h3>
          <ul class="About-Button-Dropdown Nav-Button-List">
            <li class="Nav-Button-List-Item">item 1</li>
            <li class="Nav-Button-List-Item">item 2</li>
            <li class="Nav-Button-List-Item">item 3</li>
          </ul>
        </div>
        <div class="Contact-Button Nav-Button">
          <h3 class="Contact-Button-Text Nav-Button-Text">CONTACT</h3>
          <ul class="Contact-Button-Dropdown Nav-Button-List">
            <li class="Nav-Button-List-Item">item 1</li>
            <li class="Nav-Button-List-Item">item 2</li>
            <li class="Nav-Button-List-Item">item 3</li>
          </ul>
        </div>
      </div>
    </nav>
        `,
  };
  #DOMcache = {
    bodyElement: document.body,
  };
  #buildNavBar() {
    const range = document.createRange(),
      navBarFrag = range.createContextualFragment(this.#DOMtemplates.navBar);

    this.#DOMcache.navBarElement = navBarFrag.querySelector("nav");

    this.#DOMcache.navBarButtonContainerElement =
      this.#DOMcache.navBarElement.querySelector(".Nav-Buttons-Container");

    this.#DOMcache.homeButtonElement =
      this.#DOMcache.navBarButtonContainerElement.querySelector(".Home-Button");
    this.#DOMcache.aboutButtonElement =
      this.#DOMcache.navBarButtonContainerElement.querySelector(
        ".About-Button"
      );
    this.#DOMcache.contactButtonElement =
      this.#DOMcache.navBarButtonContainerElement.querySelector(
        ".Contact-Button"
      );

    return navBarFrag;
  }
  #appendNavBar(frag) {
    const { bodyElement } = this.#DOMcache;
    if (!bodyElement.querySelector("nav")) {
      bodyElement.append(frag);
    }
  }

  #closeAllDropdownMenus() {
    const { homeButtonElement, aboutButtonElement, contactButtonElement } =
      this.#DOMcache;
    [homeButtonElement, aboutButtonElement, contactButtonElement].forEach(
      (element) => {
        element.classList.remove("Selected");
      }
    );
  }

  #activateDropdownMenu(targetButton) {
    this.#closeAllDropdownMenus();
    targetButton.classList.add("Selected");
  }

  #mouseOverFunctionality(event) {
    const targetButton = event.target.closest(".Nav-Button"),
      { homeButtonElement, aboutButtonElement, contactButtonElement } =
        this.#DOMcache;
    switch (targetButton) {
      case homeButtonElement:
        this.#activateDropdownMenu(homeButtonElement);
        break;
      case aboutButtonElement:
        this.#activateDropdownMenu(aboutButtonElement);
        break;
      case contactButtonElement:
        this.#activateDropdownMenu(contactButtonElement);
        break;
      default:
        this.#closeAllDropdownMenus();
    }
  }

  #clickedFunctionality(event) {}

  init_eventListeners() {
    const { navBarElement } = this.#DOMcache;

    if (navBarElement) {
      this.#removeAllEventListeners();
      this.#addAllEventListeners();
    }
  }

  #removeAllEventListeners() {
    const { navBarButtonContainerElement, bodyElement } = this.#DOMcache;

    navBarButtonContainerElement.removeEventListener("click", (e) =>
      this.#clickedFunctionality(e)
    );
    bodyElement.removeEventListener("mouseover", (e) =>
      this.#mouseOverFunctionality(e)
    );
  }

  #addAllEventListeners() {
    const { navBarButtonContainerElement, bodyElement } = this.#DOMcache;

    navBarButtonContainerElement.addEventListener("click", (e) =>
      this.#clickedFunctionality(e)
    );

    bodyElement.addEventListener("mouseover", (e) =>
      this.#mouseOverFunctionality(e)
    );

  }

  init() {
    if (this.#DOMcache.bodyElement && !this.#DOMcache.navBarElement) {
      const navBarFrag = this.#buildNavBar();
      this.init_eventListeners();
      this.#appendNavBar(navBarFrag);
    }
  }
}

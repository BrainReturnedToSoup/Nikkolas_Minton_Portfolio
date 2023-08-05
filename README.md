# Nikkolas_Minton_Portfolio

# Basic Front End Modules Library

This is a collection of reusable front-end JavaScript modules designed to simplify web development and streamline common tasks.
These modules serve as building blocks that you can easily incorporate into your projects, saving time and effort, as well as providing 
robustness and a level of efficiency through some of the techniques their functionalities apply.

## Foundational Modules

- **Element Reference Manager**: Manage element references efficiently without querying them repeatedly.

- **Local Storage Cache Manager**: Simplify data caching and retrieval using the browser's local storage.

- **Event-Driven Functionality Manager**: Create interactive user interfaces with ease through event handling.

- **API Interfaces**: Holds a set of various API interface classes in order to easily create instances to directly interact with a target API.
- 
## General Features
 
 Holds a list of higher level helper classes that use these foundational modules in order to achieve a specific functionality.
 This can be things such as search bar feature helper classes, etc.

## Usage

1. Clone or download this repository.

2. In your project, include the relevant module script files you need.

3. Utilize the modules in your JavaScript code by referencing their functions.

4. Best used when you inject the various modules as dependencies in order to use them as tools within higher level features/functionalities.

## Example of Usage

```javascript
// Example: Using the Element Reference Manager
import { ElementReferenceManager } from './path/to/element-reference-manager.js';
import { SearchBar } from './path/to/search-bar.js';
import { NavBar } from './path/to/nav-bar.js';

const ERM = new ElementReferenceManager();

const pageFeatures = {
  searchBar: new SearchBar(ERM),
  navBar: new NavBar(ERM),
}

```

## Description of Example

As you can see, two separate web feature class instances were able to use the same element reference manager to store all of
the element references within the cache it provides. Any time some part of the application needs a reference to an element, they can use
this specific reference manager instance to access the specific reference instead of having to make a DOM query everytime or make a DOM query
and store the reference within their own states. The element reference manager uses a Map structure to store the references,
thus the time of retrieval should be roughly the same no matter the amount of references stored.
































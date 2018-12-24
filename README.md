# About

NYC public Wifi hotspot finder. User may enter a NYC-based zip code to find the five closest hotspots based that the inputted zip code. Closest is defined as the closest five hotspots from the centroid of the geographic area covered by the zip code.

Simons Foundation UX Engineer coding challenge.

## How to Run the Project

To run the project, open a bash terminal, change directories to the root directory of the project, and start a local http server. Some possible bash incantations for doing this on OSX include `php -S localhost:8080` (PHP) and `python3 -m http.server 8080` (Python 3). Open your browser and navigate to localhost:8080 (or what ever port you started the local server on).

For local development, follow the development instructions below on how to install and start a dev build.

## How to install for local development

### Requirements
* Node.js verison > 6
* npm or yarn
* Gulp 3

### Instructions
1. Start a terminal and change directories into the root directory of this project.
2. Install gulp and it's dependencies using `npm install` or `yarn install`.
3. From the root directory, run `gulp` in your terminal to start the browser-snyc server. (Browser should launch automatically. If it does not, go to `localhost:3000` in your browser.)

## Design Choices


## Library/Frameworks Options
If I had the option, I would consider using React to manage the UI for this app. Currently, each time the app receives data from the API, I need to write logic that searches for each DOM node that needs to change states and assign the new markup via `.innerHTML`. I could avoid this using React by writing presentation logic in components that checks on the app's state and react to the data changes. This avoids the need to worry about manually finding and update nodes, which is more error-prone. Additionally React's component-based strategy would allow me to break up the different pieces of the UI, such as the search bar and the result cards, into separate components to get a more organized view of the interface.
# Picture Puzzle

Split pictures into pieces and shuffle them.
After shuffle you can drag each piece and replace it with an other piece.
If the user wins, the function can send back statistics of the game.
It is working with mouse events and touch events as well.
You can easily implement this to your site.

[Demo Here](https://codepen.io/Balint_Gacsfalvy/pen/rNxYQog)

## Setup
### html
Add the js file into the head section:
```html
<head>
    <script src="js/img_puzzle.min.js"></script>
    <!--<script src="js/img_puzzle.js"></script>-->
</head>
```
In the body create one div where the game will be created.
```html
<div class="PlayGround"></div>
```
### Javascript

You have to pass the ```options``` object to the function with the image(s) and the main holder div's selector where the game will be placed.
If you want, you can pass an array with the paths of the images what you want to shuffle. The function will select random image from the array each time you call the function.

```javascript
let images = [
    "https://path/to/image7.jpg",
    "https://path/to/image5.jpg",
    "https://path/to/image4.jpg",
    "https://path/to/image3.jpg"
];
	
img_pzl(options = {
	image: images,
	holder: ".PlayGround"
});
```
## Options
Here is the list for all the useable options:
- image: ```{string|Array}``` Contains the path of image(s).
- holder: ```{string}``` Contains the selector to where to put the game.
- difficulty: ```{string}``` Can be : ```default: medium```
  - **easy**: columns: 5, rows: 2
  - ***medium***: columns: 7, rows: 2
  - **hard**: columns: 7, rows: 3
  - **nightmare**: columns: 8, rows: 4
- delay: ```{number}``` Milliseconds to wait to start shuffle after the image is loaded. ```default: 3000```
- shuffle: ```{number}``` The number that tells how many times do shuffle the pieces. ```default: 1```
- transition: ```{number}``` CSS ```transition``` number in ***milliseconds***. ```default: 300```
- shadow: ```{string}``` CSS ```box-shadow```. When the game is ready to play, box-shadow will appear on each element. ```default: "inset 1px 1px 3px #ccc"```
- hintSwap: ```{boolean}``` Swap two elements or not when hint. If false, ```.hint``` will only return the two elements index but not swapping them. ```default: true```

## Events

### *.onShuffle*

Function that will run when the shuffle has begun.

### *.onShuffleEnd*

Function that will run when the shuffle has ended.

### *.gameOver*

This function will fire when the puzzle was solved.
You can get all the game statistics from the ```.results``` property which contains:
- moves: All moves that the user did. In other words the number when two elements has been swapped.

- cancelled_moves: All moves that did not end in a swap, the user changed his or her mind.

- time_ms: The time in milliseconds that the user played.

- time_s: The time in seconds that the user played.

- time_m: The time in minutes that the user played.

- time_formatted: It is an object. It contains **minutes** and the rest of the **seconds**. So you can output like: ``` you did it in 1 minute and 25 seconds.```
[See more](https://github.com/Balintgacsf/picture_puzzle#examples) about that in the examples section below.

- total_shuffle: The number of shuffle that has been done.

- played_difficulty: The difficulty that the user played.

### *.state*

Returns the current state of the game. Use it like the ```.gameOver``` function, they have the same property. When the game has ended the ```.state``` function will return false. The ```.results``` object will be only accessable in the ```.gameOver``` function.

### *.hint*

Finds two elements which are not on their original position and swap them if ```hintSwap``` is true. Otherwise it will return the two elements indexes.

### *.mark*

Returns all elements index which are on their original positions.

## Get Informations

### *.img*

Get the current image src.

### *.elements*

Returns a node list of all element inside the game.

[Demo Here](https://codepen.io/Balint_Gacsfalvy/pen/rNxYQog)

### Examples:

**Calling the function with one image source**
```javascript
// here calling the function with a string
// telling to make the image into the .PlayGround div

img_pzl({
	image: "https://i.ibb.co/cTDp6mh/hatter6.jpg",
	holder: ".PlayGround"
});
```

**Calling the function with an array of image sources**
```javascript
// the function will select one random path of the array

let images = [
    "https://path/to/image7.jpg",
    "https://path/to/image5.jpg",
    "https://path/to/image4.jpg",
    "https://path/to/image3.jpg"
];
	
img_pzl({
	image: images,
	holder: ".PlayGround"
});
```
**Working with statics of the play when the user wins**
```javascript
// array of image sources
let images = [
    "https://path/to/image7.jpg",
    "https://path/to/image5.jpg",
    "https://path/to/image4.jpg",
    "https://path/to/image3.jpg"
];

img_pzl.gameOver = function() {
	let moves = img_pzl.gameOver.results.moves; // all moves with hint included
	let f_minutes = img_pzl.gameOver.results.time_formatted.minutes; // formatted minutes
	let f_seconds = img_pzl.gameOver.results.time_formatted.seconds; // fromatted seconds
	let difficulty = img_pzl.gameOver.results.played_difficulty; // played difficulty
	
	alert("You win! You did it in "+moves+" moves and "+f_minutes+" minute(s) and "+f_seconds+" seconds. The difficulty was "+ difficulty);
};
	
// setting up the puzzle
img_pzl({
	image: images,
	holder: ".PlayGround"
});
```
	
**Get notify when the game started to shuffle**
```javascript
let images = [
	"https://path/to/image7.jpg",
	"https://path/to/image5.jpg",
	"https://path/to/image4.jpg",
	"https://path/to/image3.jpg"
];

// this function will run when the image is loaded and the swapping has begun
img_pzl.onShuffle = function() {
	alert("Shuffle have just begun!");
}
	
// setting up the puzzle
img_pzl({
	image: images,
	holder: ".PlayGround"
});
```

# Picture Puzzle

Split pictures into pieces and shuffle them.
After shuffle you can drag each piece and replace it with an other piece.
If the user wins, the function can send back statistics of the game.
It is working with mouse events and touch events as well.

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
In the body just add one div with class you choose. In this example we are gonna use ```PlayGround```.
```html
<div class="PlayGround"></div>
```
### Javascript

You have to pass the ```settings``` object to the function with the image(s), the main holder div's selector where the game will be placed and a function which will run when the player wins.
If you want, you can create an array with the paths of the images what you want to shuffle and pass it to the function. The function will select random image from the array each time you call the function.

```javascript
let images = [
    "https://path/to/image7.jpg",
    "https://path/to/image5.jpg",
    "https://path/to/image4.jpg",
    "https://path/to/image3.jpg",
];
	
get_img_puzzle(settings = {
		image: images,
		holder_div: ".PlayGround",
		after_win: won
		});
```

The ``` get_img_puzzle() ``` function is waiting for three arguments in the settings object. The other six is optional: 
```javascript
// here are listed the parameters and the default values of the settings
get_img_puzzlesettings = {
		image: images, // needed
		holder_div: ".PlayGround", // needed
		after_win: won, // needed
		difficulty: "regular", // optional
		shuffle_delay: 3000, // optional
		shuffle_integer: 50, // optional
		elem_shadow: true, // optional
		on_shuffle: false, // optional
		until_shuffle: false // optional
		}); 
```

**image**: ```string || array``` the string or array which are contains the images sources.

**holder_div**: ``` string ``` the selector of the main holder div where the image will be displayed.

**after_win**: ``` function ``` the function which will run when the player wins. Remember to **not** to invoke the function so do not put the ```()```.

**difficulty**: ``` string ``` the difficulty of the game. Can be **regular** which means 14 pieces in 2 rows or **hard** which means 21 pieces in 3 rows.

**shuffle_delay**: ``` number ``` The time in miliseconds to wait before shuffleing the image. (3000 by Default).

**shuffle_integer**: ``` number ``` Every shuffle swaps two elements positions. You can set how many shuffle you want. (50 by Default)

**elem_shadow**: ```boolean``` Control the box-shadow on all element (```inset 1px 1px 3px #ccc```). True by default.

**on_shuffle**: ```function``` the function which will run when the image is loaded and the shuffle function started to swap the elements.

**until_shuffle**: ```function``` the function which will run two times:

- First time when the image is loaded and the shuffle function started to swap the elements.
- Second time when the shuffle is done (including animations), but this time your function will get an argument (a ```true```)
[See the examples](https://github.com/Balintgacsf/picture_puzzle#examples)


### After win

After the game finished, so when the user solved the puzzle, the function can send you statics of the play. Like moves, time etc..
It gives your function (what you passed in the ```after_win```) one object called **results** and an array of the function created elements.

The **Results object** returns:

**moves**: All moves that the user did. In other words the number when two elements has been swapped.

**cancelled_moves**: All moves that then did not end in a swap, so the user changed his or her mind.

**time_ms**: The time in milliseconds that the user played.

**time_s**: The time in seconds that the user played.

**time_m**: The time in minutes that the user played.

**time_formatted**: It is an object. It contains **minutes** and the rest of the **seconds**. So you can output like: ``` you did it in 1 minute and 25 seconds.```
[See more](https://github.com/Balintgacsf/picture_puzzle#examples) about that in the examples section below.

**total_shuffle**: The number of the elements that has been swapped before the game.

**played_difficulty**: The difficulty that the user played. Can be **regular** or **hard**.

[Demo Here](https://codepen.io/Balint_Gacsfalvy/pen/rNxYQog)

### Examples:

**Calling the function with one image source**
```javascript
// here calling the function with a string
// telling to make the image into the .PlayGround div
// and setting a function to alert when the player wins

get_img_puzzle(settings = {
		image: "https://i.ibb.co/cTDp6mh/hatter6.jpg",
		holder_div: ".PlayGround",
		after_win: won
	});

// Function that runs after win
function won() {
    alert("you win");
}
```

**Calling the function with an array of image sources**
```javascript
// the function will select one random path of the array
// also setting the difficulty to hard
// and setting a function to alert when the player wins
// after the images loaded the function will wait only 1 second
// then 10 shuffle runs

let images = [
    "https://path/to/image7.jpg",
    "https://path/to/image5.jpg",
    "https://path/to/image4.jpg",
    "https://path/to/image3.jpg",
];
	
get_img_puzzle(settings = {
		image: images,
		holder_div: ".PlayGround",
		after_win: won,
		difficulty: "hard",
		shuffle_delay: 1000,
		shuffle_integer: 10
		});

// Function that runs after win
function won() {
    alert("you win");
}
```
**Working with statics of the play when the user wins**
```javascript
// array of image sources
let images = [
	"https://i.ibb.co/VBNcJBr/hatter7.jpg",
	"https://i.ibb.co/dL0rjZb/hatter5.jpg",
	"https://i.ibb.co/1MkR9LN/hatter4.jpg",
	"https://i.ibb.co/mhhKxP5/hatter3.jpg"
	];
	
	// passing this function to run when the player wins
	// note that the function is waiting for two arguments: results and element
	function won(results, element) {
		let moves = results.moves;
		// the time_formatted is an object and it has two values: minutes and the rest of the seconds
		let f_minutes = results.time_formatted.minutes;
		let f_seconds = results.time_formatted.seconds;
		let difficulty = results.played_difficulty;
		
		// output the personalized message
		console.log("You win! You did it in "+moves+" moves and "+f_minutes+" minute(s) and "+f_seconds+" seconds. The difficulty was "+ difficulty);
		// removing the box-shadow of all elements
		for(let i = 0; i < element.length; i++ ) {
			element[i].style.boxShadow = "inset 0px 0px 0px #ccc";
		}
	}
	
	// setting up the puzzle
	get_img_puzzle({
		image: images,
		holder_div: ".PlayGround",
		after_win: won
	});
```
	
**Get notify when the game started to shuffle**
```javascript
let images = [
	"https://i.ibb.co/VBNcJBr/hatter7.jpg",
	"https://i.ibb.co/dL0rjZb/hatter5.jpg",
	"https://i.ibb.co/1MkR9LN/hatter4.jpg",
	"https://i.ibb.co/mhhKxP5/hatter3.jpg"
	];

// afer the player wins
function won() {
	alert("You win!");
}

// this function will run when the image is loaded and the swapping has begun
function started() {
	console.log("Started to swap the elements");
}
	
// setting up the puzzle
// passing the function to get_img_puzzle
	get_img_puzzle({
		image: images,
		holder_div: ".PlayGround",
		after_win: won,
		on_shuffle: started
	});
```

**Get notify when the game started to shuffle and also get notify when the game finished the shuffle**
```javascript
let images = [
	"https://i.ibb.co/VBNcJBr/hatter7.jpg",
	"https://i.ibb.co/dL0rjZb/hatter5.jpg",
	"https://i.ibb.co/1MkR9LN/hatter4.jpg",
	"https://i.ibb.co/mhhKxP5/hatter3.jpg"
	];

// afer the player wins
function won() {
	alert("You win!");
}

// this function will be passed to the until_shuffle
// the function will run two times:
// first when the image is loaded and the shuffle function started to swap the elements
// second time when the shuffle function is finished, but this time your function will get an argument
function isShuffle(state) {
	// argument arrived, the shuffle is finished
	if(state === true) {
		console.log("I'm done with the shuffle");
	}
	// the function is runned without the argument so the shuffle begun but not finished
	else {
		console.log("I just started to swap the elements");
	}
}

// setting up the puzzle
// passing the function to get_img_puzzle
	get_img_puzzle({
		image: images,
		holder_div: ".PlayGround",
		after_win: won,
		until_shuffle: isShuffle
	});

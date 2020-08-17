# Picture Puzzle

Split pictures into 14 pieces and shuffle them.
After shuffle you can drag each piece and replace it with an other piece.
If the user wins, the function can send back statistics of the game.
It is working with mouse events and touch events as well.

## Setup
### html
Add the css file and the js file into the head section:
```html
<head>
    <link rel="stylesheet" href="css/img_puzzle.css" type="text/css">
    <script src="js/img_puzzle.min.js"></script>
    <!--<script src="js/img_puzzle.js"></script>-->
</head>
```
In the body just add one div with class you choose. In this example I'm gonna use ```PlayGround```.
```html
<div class="PlayGround"></div>
```
### Javascript

You have to pass the ```settings``` object to the function with the image(s), the main holder div where the game will be placed and a function which will run when the player wins.
If you want, you can create an array with the paths of the images you want to shuffle and pass it to the function. The function will select random image from the array each time you call the function.

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

The ``` get_img_puzzle() ``` function is waiting for three arguments in the settings object. The other three is optional: 
```javascript
get_img_puzzlesettings = {
		image: images, // needed
		holder_div: ".PlayGround", // needed
		after_win: won, // needed
		difficulty: "regular", //optional
		shuffle_delay: 3000, //optional
		shuffle_integer: 50 //optional
		}); 
```

**image**: the string or array which are contains the images sources. ```string || array```

**holder_div**: the selector of the main holder div where the image will be displayed. ``` string ```

**after_win**: the function which will run when the player wins. Remember to **not** to invoke the function so do not put the ```()```. ``` function ```

**difficulty**: the difficulty of the game. Can be **regular** which means 14 pieces in 2 rows or **hard** which means 21 pieces in 3 rows. ``` string ```

**shuffle_delay**: The time in miliseconds to wait before shuffleing the image. (3000 by Default) ``` integer ```

**shuffle_integer**: Every shuffle swaps two elements positions. You can set how many shuffle you want. (50 by Default) ``` integer ```

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


### Additional information:
In the css file I disable chrome's 'pull to refresh' function by setting ``` overscroll-behavior-y: contain; ```for the html and body.

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
**Working with statics of the play if the user wins**
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


# Picture Puzzle

Split pictures into 14 pieces and shuffle them.
After shuffle you can drag each piece and replace it with an other piece.
Also checking if you replace all elements to the original position.
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

You have to pass the ```settings``` object to the function with the image(s), the main holder div and a function which will run when the player wins.
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
		after_win: won,);
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

**after_win**: the function which will run when the player wins. ``` function ```

**difficulty**: the difficulty of the game. Can be **regular** which means 14 pieces in 2 rows or **hard** which means 20 pieces in 3 rows. ``` string ```

**shuffle_delay**: The time in miliseconds to wait before shuffleing the image. (3000 by Default) ``` integer ```

**shuffle_integer**: Every shuffle change two elements positions. You can set how many shuffle you want. (50 by Default) ``` integer ```

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


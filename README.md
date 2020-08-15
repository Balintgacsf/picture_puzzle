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

If you want you can create an array with the path of the images you want to shuffle and pass it to the function. The function will select random image from the array each time you call the function.

```javascript
let images = [
    "https://path/to/image7.jpg",
    "https://path/to/image5.jpg",
    "https://path/to/image4.jpg",
    "https://path/to/image3.jpg",
];
	
get_img_puzzle(images, ".PlayGround");
```
The ``` get_img_puzzle() ``` function is waiting for two arguments. The other three is optional: ``` get_img_puzzle(images, div_holder, difficulty, shuffle_delay, shuffle_int) ```

**Images**: the string or array which are contains the images sources. ```string || array```

**Div Holder**: the selector of the main holder div where the image will be displayed. ``` string ```

**Difficulty**: the difficulty of the game. Can be **regular** which means 14 pieces in 2 rows or **hard** which means 20 pieces in 3 rows. ``` string ```

**Shuffle Delay**: The time in miliseconds to wait before shuffleing the image. (3000 by Default) ``` integer ```

**Shuffle integer**: Every shuffle change two elements positions. You can set how many shuffle you want. (50 by Default) ``` integer ```

### Additional information:
In the css file I disable chrome's 'pull to refresh' function by setting ``` overscroll-behavior-y: contain; ```for the html and body.

[Demo Here](https://codepen.io/Balint_Gacsfalvy/pen/rNxYQog)

### Examples:

**Calling the function with one image source**
```javascript
// here calling the function with a string
// telling to make the image into the .PlayGround div
// and setting the difficulty to regular

let image = "https://i.ibb.co/cTDp6mh/hatter6.jpg";
get_img_puzzle(image, ".PlayGround", "regular");
```

**Calling the function with an array of image sources**
```javascript
// the function will select random one of the array
// also setting the difficulty to hard
// after the images loaded the function will wait only 1 second
// then shuffle 10 random elements

let images = [
    "https://path/to/image7.jpg",
    "https://path/to/image5.jpg",
    "https://path/to/image4.jpg",
    "https://path/to/image3.jpg",
];
	
get_img_puzzle(images, ".PlayGround", "hard", 1000, 10);
```


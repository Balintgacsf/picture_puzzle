# Picture Puzzle

Split pictures into 14 pieces and shuffle them.
After shuffle you can drag each piece and replace it with an other piece.
It is working with mouse events and touch events as well.

## Setup
### html
Add the css file and the js file into the head section:
```html
<head>
    <link rel="stylesheet" href="css/img_puzzle.css" type="text/css">
    <script src="js/img_puzzle.js"></script>
</head>
```
In the body just add one div with class ``` PlayGround ```
```html
<div class="PlayGround"></div>
```
### Javascript

Create an array with the path of the images you want to shuffle and pass it to the function. The function will select random image from the array each time you call the function.

```javascript
let images = [
    "https://path/to/image7.jpg",
    "https://path/to/image5.jpg",
    "https://path/to/image4.jpg",
    "https://path/to/image3.jpg",
];
	
get_img_puzzle(images);
```
The ``` get_img_puzzle() ``` function is waiting for one argument. The other two is optional: ``` get_img_puzzle(images, shuffle_delay, shuffle_int)```

**Images**: the array wich contains the images sources.

**Shuffle Delay**: The time in miliseconds to wait before shuffleing the image. (3000 by Default)

**Shuffle integer**: Every shuffle change two elements position. You can set how many shuffle you want. (50 by Default)

### Additional information:
In the css file I disable chrome's 'pull to refresh' function by setting ``` overscroll-behavior-y: contain; ```for the html and body.

[Demo Here](https://codepen.io/Balint_Gacsfalvy/pen/rNxYQog)

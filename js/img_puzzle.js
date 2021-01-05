function img_pzl(options) {

	// accepting options
	try{
		if(typeof options !== "object") throw "An object must be passed to the function! Now it is: "+ typeof options;
	}
	catch(err) {
		console.error("img_pzl : "+err);
		return;
	}

	// options
	let images = options.image;
	let div_holder = options.holder;
	let difficulty = options.difficulty || "medium";
	let shuffle_delay = options.delay || 3000;
	let shuffle_int = options.shuffle || 1;
	let transition = options.transition;
	let box_shadow = options.shadow;
	let on_hint_swap = options.hintSwap;

	// events
	let on_shuffle = img_pzl.onShuffle;
	let on_shuffle_end = img_pzl.onShuffleEnd;
	let win_function = img_pzl.gameOver;


	// error messages
	// checking each option that they are the right type
	/*
	OPTIONS
		image : string || Array
		holder : string
		difficulty : string [easy, medium, hard, nightmare]
		delay : number
		shuffle : number
		transition : number
		shadow : string
		hintSwap : boolean

	EVENTS
		onShuffle : function
		onShuffleEnd : function
		gameOver : function
	*/
	try{
		if(typeof images !== "string" && (!Array.isArray(images)))
			throw "images expecting to be a string or an array, "+typeof images+" given";

		if(typeof div_holder !== "string")
			throw "holder expecting to be a string, "+typeof div_holder+" given";
		
		if(typeof transition !== "number" && typeof transition !== "undefined")
			throw "transition expecting to be a number, "+typeof transition+" given";
		
		if(!document.querySelector(div_holder))
			throw "holder ( \" "+div_holder+" \" ) cannot be found";

		if(typeof win_function !== "function" && typeof win_function !== "undefined")
			throw "img_pzl.gameOver expecting to be a function, "+typeof win_function+" given";

		if(typeof shuffle_delay !== "number")
			throw "delay expecting to be a number, "+typeof shuffle_delay+" given";

		if(typeof shuffle_int !== "number")
			throw "shuffle expecting to be a number, "+typeof shuffle_int+" given";

		if(typeof box_shadow !== "string" && typeof box_shadow !== "undefined")
			throw "shadow expecting to be a string, "+typeof box_shadow+" given";

		if(typeof difficulty !== "string")
			throw "difficulty expecting to be a string, "+typeof difficulty+" given";

		if(difficulty !== "easy" && difficulty !== "medium" && difficulty !== "hard" && difficulty !== "nightmare")
			throw "difficulty can be easy, medium, hard or nightmare";

		if(typeof on_shuffle !== "function" && typeof on_shuffle !== "undefined")
			throw "onShuffle expecting to be a function, "+ typeof on_shuffle+ " given";
		
		if(typeof on_shuffle_end !== "function" && typeof on_shuffle_end !== "undefined")
			throw "onShuffleEnd expecting to be a function, "+ typeof on_shuffle_end+ " given";
		
		if(typeof on_hint_swap !== "boolean" && typeof on_hint_swap !== "undefined")
			throw "hintSwap expecting to be a boolean, "+ typeof on_hint_swap+ " given";

		// checking if the main holder div's height and width has been set
		if(document.querySelector(div_holder).offsetHeight == 0 || document.querySelector(div_holder).offsetWidth == 0)
			throw "The main holder's ( "+div_holder+" ) width or height has been set to 0. It cannot be seen";
	}
	catch(err) {
		console.error("img_pzl : "+err+ "!");
		return;
	}

	// creating default gameOver function
	// gameOver has a "results" property with all the statics of the game
	if(typeof img_pzl.gameOver === "undefined") {
		img_pzl.gameOver = function() {
			let moves = img_pzl.gameOver.results.moves; // all moves with hint included
			let f_minutes = img_pzl.gameOver.results.time_formatted.minutes; // formatted minutes
			let f_seconds = img_pzl.gameOver.results.time_formatted.seconds; // fromatted seconds
			let difficulty = img_pzl.gameOver.results.played_difficulty; // played difficulty

			alert("You win! You did it in "+moves+" moves and "+f_minutes+" minute(s) and "+f_seconds+" seconds. The difficulty was "+ difficulty);
		};
	}

	// adding default values
	if(typeof box_shadow === "undefined") {
		box_shadow = "inset 1px 1px 3px #ccc";
	}
	if(typeof on_hint_swap === "undefined") {
		on_hint_swap = true;
	}
	if(typeof transition === "undefined") {
		transition = 300;
	}

	//GLOBALS
	// for .gameOver.results / .state.results
	// moves
	let mov = 0;
	// cancelled moves
	let canc_mov = 0;
	// time
	let time, fin_time;

	// individual elements width and height
	let element_height = "";
	let element_width = "";

	let game_holder;

	// all element left and top positions
	// first element can be reached like: LEFT[0]+"px"
	let LEFT = [];
	let TOP = [];

	// creating transition seconds and milliseconds
	// sometimes we need transition in seconds sometimes milliseconds
	transition_s = transition/1000;
	transition_ms = transition;
	
	// creating image object
	let img = new Image();

	// this variable helps us define can we play the game or not
	// if it is false, afterall no action is enabled on the game
	let check_playable = false;

	// checking if there is any problem with the image load
	img.onerror = function() {
		console.error("img_pzl : Image could not be loaded");
		return;
	}

	// the image is ready, we can start working
	img.onload = function() {

		// when the image is loaded, save the image's src to a propertie
		img_pzl.img = img.src;

		// image width and height
		let imgwidth = img.width, imgheight = img.height;

		// holder div width and height
		let winheight = document.querySelector(div_holder).offsetHeight;
		let winwidth = document.querySelector(div_holder).offsetWidth;

		// count ratio
		let ratio = Math.min(winwidth / imgwidth, winheight / imgheight);
		// creating variables for new sizes(they must be numbers)
		let new_width = 0, new_height = 0;
		// column and row numbers are depending on which difficulty is the game on
		let columns = 0, rows = 0;

		// this variable will hold the number of how many elements we will have
		// depend on difficulty
		let elem_piece = 0;

		function getSizes(column, row) {
			// divide new_height and new_width with the number of column / row before using them
			// when use it, it will give back a round pixel number
			new_width = Math.round(imgwidth * ratio / column)*column;
			new_height = Math.round(imgheight * ratio / row)*row;

			// setting how many elemnt going to be created depends on the difficulty
			elem_piece = column * row - 1;

			// individual elements height and width
			element_height = new_height / row;
			element_width = new_width / column;
		}

		switch(difficulty) {
			case "easy":
				columns = 5;
				rows = 2;
			break;
			case "medium":
				columns = 7;
				rows = 2;
			break;
			case "hard":
				columns = 7;
				rows = 3;
			break;
			case "nightmare":
				columns = 8;
				rows = 4;
			break;
		}

		getSizes(columns,rows);
		
		// if there was an other game before, we should clean it up before we create another game
		// first remove event listeners
		if(document.querySelectorAll(div_holder+" ._game_output .bg-elem")) {
			let element = document.querySelectorAll(div_holder+" ._game_output .bg-elem");
			for(let i = 0; i < element.length; i++) {
				element[i].removeEventListener("touchstart", event_function);
				element[i].removeEventListener("mousedown", event_function);
				element[i].removeEventListener("touchend", event_function);
				element[i].removeEventListener("mouseup", event_function);
			}
		}
		// then empty the main holder div
		let main_holder = document.querySelector(div_holder);
		while(main_holder.firstChild) {
			main_holder.removeChild(main_holder.firstChild);
		}

		// if the puzzle was made in the same div as before, clear alredy running timeouts
		// it can be possibble that the old timeout was like 5s but the function was recalled with 10s time out
		// so the new function will be shuffled in 5s...
		if(img_pzl.oldHolder === div_holder) {
			clearTimeout(img_pzl.wait);
		}

		// update the holder div
		img_pzl.oldHolder = div_holder;

		// creating game holder div
		// this div will have the exact width and height what the game takes
		// named _game_output
		game_holder = document.createElement("DIV");
		game_holder.classList.add("_game_output");
		document.querySelector(div_holder).appendChild(game_holder);

		// the div will be positioned to the center of the page (horizontally)
		game_holder = document.querySelector("._game_output");
		game_holder.style.position = "absolute";
		game_holder.style.width = new_width+'px';
		game_holder.style.height = new_height+'px';
		game_holder.style.left = "50%";
		game_holder.style.marginLeft = -new_width/2+'px';
		game_holder.style.overflow = "hidden";
		
		// each individual element will have a identifier number
		// we store these number in an Array (seq_array)
		let seq_array = [];

		for (let i = 0; i <= elem_piece; i++) {
			/* 
				random numbers as indentifier is harder to figure out what is the sequence of the lements with naked eye,
				so if inspecting the lements in the browser, the user wont see the solution in the data-sequence!
				but one number can be once only. So generating random numbers to the elements so all numbers are different
			*/
			let randnum = Math.floor(getRandom(0,100));
			if(seq_array.includes(randnum)) {
				let exist = true;
				while(exist === true){
					randnum = Math.floor(getRandom(0,100));
					if(seq_array.includes(randnum)) {
						exist = true;
					} else {
						exist = false;
					}
				}
			}
			seq_array.push(randnum);
			// adding elements to html
			game_holder.innerHTML += "<div data-sequence="+seq_array[i]+" class='bg-elem'></div>\n";
		}
		
		// storing all elements in this constant
		const element = document.querySelectorAll(div_holder+" ._game_output .bg-elem");

		// the elements are accessable from outside the function
		img_pzl.elements = element;
		
		// setting elemnts positions and background positions
		let row = 0;
		let column = 0;
		for (let i = 0; i < element.length; i++) {

			element[i].style.position = "absolute";
			// setting background image and size
			element[i].style.backgroundImage = "url('"+img.src+"')";
			element[i].style.backgroundSize = new_width+'px '+new_height+'px';

			// setting new height and width
			element[i].style.height = element_height+'px';
			element[i].style.width = element_width+'px';

			// positioning
			element[i].style.left = element_width*column+'px';

			if(row === 0) { // first row
				element[i].style.top = '0px';
				column++;
			} else { // any other row
				element[i].style.top = element_height*row+'px';
				column++;
			}
			if(column === columns) { // if last column, go to the next row
				column = 0;
				row++;
			}

			// setting background-position of each element
			let leftPos = element[i].offsetLeft;
			let topPos = element[i].offsetTop;
			element[i].style.backgroundPosition = -leftPos+'px '+ -topPos+'px';

			// store all element positions in arrays
			// these positions are the original first generated positions
			// we will use these in future
			LEFT.push(leftPos);
			TOP.push(topPos);
		}
		
		// listening to mouse and touch events
		for(let i = 0; i < element.length; i++) {
			element[i].addEventListener("touchstart", event_function);
			
			element[i].addEventListener("mousedown", event_function);
			
			element[i].addEventListener("touchend", event_function);
			
			element[i].addEventListener("mouseup", event_function);
		}

		function event_function(event) {
			if(check_playable === false) {
				return;
			}

			// MOUSEDOWN AND TOUCHSTART
			if(event.type === "mousedown" || event.type === "touchstart") {
				
				// turning off transition until drag
				for(let i = 0; i < element.length; i++) {
					element[i].style.transition = "all 0s";
				}

				// the active element must be visible all time
				// (the other elements zIndex is 1)
				event.target.style.zIndex = "2";

				// starting the timer on first move
				if(mov === 0) {
					time = new Date();
				}
			}

			// MOUSEUP AND TOUCHEN
			if(event.type === "touchend" || event.type === "mouseup") {
				// turning on transition after drag
				for(let i = 0; i < element.length; i++) {
					element[i].style.transition = "all "+transition_s+"s";
				}

				// get the game's position
				let holder_pos = game_holder.getBoundingClientRect();
				let left = holder_pos.left;
				let top = holder_pos.top;

				let mouse_pos = [];
				let x,y;

				// MOUSE
				if(event.type === "mouseup") {
					x = event.clientX;
					y = event.clientY;
					mouse_pos.push(x-left, y-top);
				}
				// TOUCH
				if(event.type === "touchend") {
					x = event.changedTouches[0].clientX;
					y = event.changedTouches[0].clientY;
					mouse_pos.push(x-left, y-top);
				}

				// checking all the elements, if our finger or mouse is on them
				for(let i = 0; i < element.length; i++) {
					// we have to make sure that our element is not the one we dragging
					if(element[i] === event.target) {
						// if the current element is not the last one, move to the next element
						if(i !== element.length-1) {
							continue;
						}
					}
					// if the mouse or the finger is in the area of an other element
					if(mouse_pos[0] > element[i].offsetLeft && mouse_pos[0] < element[i].offsetLeft+element_width && mouse_pos[1] > element[i].offsetTop && mouse_pos[1] < element[i].offsetTop+element_height) {
						swap_elem(get_elem_number(event.target),i);
						break;
					}
					// if we do not hit other element, go back to our original position
					if(i == element.length-1) {
						event.target.style.top = TOP[get_elem_number(event.target)]+"px";
						event.target.style.left  = LEFT[get_elem_number(event.target)]+'px';
						canc_mov++;
					}
				}

				event.target.style.zIndex = "1";

				// turn off playeable until the swap animation is running
				pause_playeable();
			}

		}

		function get_elem_number(searchedElem) {
			for(let i = 0; i < element.length; i++) {
				if(element[i] === searchedElem) {
					return i;
				}
			}
		}

		function swap_elem(elem1, elem2) {

			let num1 = parseInt(elem1), num2 = parseInt(elem2);

			let temp = element[num1].getAttribute("data-sequence");
			element[num1].setAttribute("data-sequence", element[num2].getAttribute("data-sequence"));
			element[num2].setAttribute("data-sequence", temp);
			
			temp = TOP[num1];
			TOP[num1] = TOP[num2];
			TOP[num2] = temp;
			
			element[num1].style.top = TOP[num1]+"px";
			element[num2].style.top = TOP[num2]+"px";
			
			temp = LEFT[num1];
			LEFT[num1] = LEFT[num2];
			LEFT[num2] = temp;
			
			element[num1].style.left = LEFT[num1]+"px";
			element[num2].style.left = LEFT[num2]+"px";
			if(check_playable === true) {
				if(!time) {
					time = new Date();
				}
				check_win();
				mov++;
			}

		}

		// Marks all the elements which are the right place
		// nums must be an Array
		img_pzl.mark = function() {
			let marked = [];
			for(let i = 0; i < element.length; i++) {
				let data = parseInt(element[i].getAttribute("data-sequence"));
				if(data === seq_array[i]) {
					marked.push(i);
				}
			}
			return marked;
		}

		img_pzl.hint = function() {
			let match = [];
			if(check_playable === false) {
				return;
			}
			let random, help = false;
			while(help === false) {
				random = Math.floor(Math.random() * seq_array.length);
				let number = parseInt(element[random].getAttribute("data-sequence"));
				if(seq_array[random] !== number) {
					for(let i = 0; i < element.length; i++) {
						if(parseInt(element[i].getAttribute("data-sequence")) === seq_array[random]) {
							
							if(on_hint_swap) {
								swap_elem(i, random);
							}
							match.push(i);
							match.push(random);

						}
					}
					help = true;
					return match;
				}
			}
		}
		
		// reading all element data-sequence attribute and push it to an Array
		// if the this Array is equal to the old original sequence Array than its a win
		function check_win() {
			let data_sequence = [];
			for (let i = 0; i < element.length; i++) {
			data_sequence.push(parseInt(element[i].getAttribute('data-sequence')));
				if(i === element.length-1) {
					if(arrayEquals(seq_array, data_sequence)) {
						check_playable = false;
						setTimeout(function() {
							img_pzl.state(true);
						}, transition_ms+1);
					} else {
						data_sequence = [];
					}
				}
			}
		}

		// WIN_FUNCTION
		img_pzl.state = function(win = false) {
			if(!time) {
				return false;
			}
			// counting the played time
			fin_time = new Date();
			// counting minutes and seconds together
			let total_time = fin_time - time;
			let time_format = {
				minutes: Math.floor(total_time/1000/60),
				seconds: Math.floor(total_time/1000 % 60)
			};
			// setting the result object
			let results = {
				// Moves
				moves: mov,
				cancelled_moves: canc_mov,
				// Milliseconds
				time_ms: total_time,
				// Seconds
				time_s: Math.floor(total_time/1000),
				// Minutes
				time_m: total_time/1000/60,
				// Formatted time (minutes and seconds)
				time_formatted: time_format,
				// Difficulty
				total_shuffle: shuffle_int,
				played_difficulty: difficulty
			};

			if(win === true) {
				// passing the results and the element array
				img_pzl.gameOver.results = results;
				img_pzl.gameOver();
				time = false;
				check_playable = false;

				// removing the box-shadow of all elements
				if(box_shadow) {
					for(let i = 0; i < element.length; i++ ) {
						element[i].style.boxShadow = "inset 0 0 0 transparent";
					}
				}
			} else {
				return results;
			}
		}

		// if box-shadow is set, then apply it on all element
		// the default box-shadow is : "inset 1px 1px 3px #ccc"
		function get_shadow(box_shadow) {
			for(let i = 0; i < element.length; i++) {
				element[i].style.boxShadow = box_shadow;
			}
		}
		
		// mixing the elemnts
		function shuffle() {
			// shuffle begined
			if(on_shuffle) {
				img_pzl.onShuffle();
			}
			for(let i = 0; i < element.length; i++) {
				element[i].style.transition = "all "+transition_s+"s";
			}
			let i = element.length, random;
			while(0 !== i) {
				random = Math.floor(Math.random() * i);
				i--;
				swap_elem(i, random);
			}
		}
		
		// waiting for shuffle
		// adding setTimeout to the function
		let shuffle_interval;
		img_pzl.wait = setTimeout(function() {
			let k = 1;
			shuffle_interval = setInterval(function() {
				// shuffle is over
				if(k === shuffle_int) {
					clearInterval(shuffle_interval);
					check_playable = true;
					get_shadow(box_shadow);
					draggable_elements(element); // Enabling draggable
					if(on_shuffle_end) {
						on_shuffle_end();
					}
					return;
				}
				// keep shuffle
				k++;
				shuffle();
			}, transition_ms+1);
			shuffle();
		}, shuffle_delay);

		function pause_playeable() {
			if(check_playable === false) {
				return;
			} else {
				check_playable = false;
				setTimeout(function() {
					check_playable = true;
				},transition_ms);
			}
		}
	}

	// if the images variable is an array, I choose one random src of the array
	if(Array.isArray(images)) {
		let random_img = Math.floor(getRandom(0,images.length-1));
		img.src = images[random_img];
	}
	// String
	if(typeof images === "string") {
		img.src = images;
	}

	function getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	// Draggable
	let initX, initY, firstX, firstY;
	function draggable_elements(drg_elem) {
		if(check_playable === false) {
			return;
		}
		for(let i = 0; i < drg_elem.length; i++) {
			drg_elem[i].addEventListener('mousedown', function(e) {
				
				e.preventDefault();
				if(check_playable === false) {
					return;
				}
				initX = this.offsetLeft;
				initY = this.offsetTop;
				firstX = e.pageX;
				firstY = e.pageY;
				
				this.addEventListener('mousemove', dragIt);
				this.addEventListener('mouseleave', dragIt);
				
				game_holder.addEventListener('mouseup', function() {
					drg_elem[i].removeEventListener('mousemove', dragIt);
					drg_elem[i].removeEventListener('mouseleave', dragIt);
				});

				// if the element leaves the game area, put it back to its original position and remove drag event listener from it
				game_holder.addEventListener('mouseleave', function() {
					drg_elem[i].style.top = TOP[i]+"px";
					drg_elem[i].style.left  = LEFT[i]+'px';
					drg_elem[i].removeEventListener('mousemove', dragIt);
					drg_elem[i].removeEventListener('mouseleave', dragIt);
					drg_elem[i].style.zIndex = "1";
				});
			
			});
			
			drg_elem[i].addEventListener('touchstart', function(e) {
				
				e.preventDefault();
				if(check_playable === false) {
					return;
				}
				initX = this.offsetLeft;
				initY = this.offsetTop;
				let touch = e.touches;
				firstX = touch[0].pageX;
				firstY = touch[0].pageY;
				
				this.addEventListener('touchmove', swipeIt);
				
				game_holder.addEventListener('touchend', function(e) {
					e.preventDefault();
					drg_elem[i].removeEventListener('touchmove', swipeIt);
				});
			
			});
		
		}
	}
	
	function dragIt(e) {
		this.style.left = initX+e.pageX-firstX + 'px';
		this.style.top = initY+e.pageY-firstY + 'px';
	}
	
	function swipeIt(e) {
		var contact = e.touches;
		this.style.left = initX+contact[0].pageX-firstX + 'px';
		this.style.top = initY+contact[0].pageY-firstY + 'px';
	}

	// is array equal to another one
	function arrayEquals(a, b) {
		return Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((val, index) => val === b[index]);
	}
}

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
	let difficulty = options.difficulty || "normal";
	let shuffle_delay = options.delay || 3000;
	let shuffle_int = options.shuffle || 50;
	let box_shadow = options.shadow;
	let is_shuffle_animation = options.animation || false;

	// events
	let on_shuffle = img_pzl.onShuffle;
	let on_shuffle_end = img_pzl.onShuffleEnd;
	let win_function = img_pzl.gameOver;


	// error messages
	try{
		if(typeof images !== "string" && (!Array.isArray(images)))
			throw "images expecting to be a string or an array, "+typeof images+" given";

		if(typeof div_holder !== "string")
			throw "holder expecting to be a string, "+typeof div_holder+" given";
		
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

		if(difficulty !== "easy" && difficulty !== "normal" && difficulty !== "hard" && difficulty !== "nightmare")
			throw "difficulty can be easy, normal, hard or nightmare";

		if(typeof on_shuffle !== "function" && typeof on_shuffle !== "undefined")
			throw "onShuffle expecting to be a function, "+ typeof on_shuffle+ " given";
		
		if(typeof on_shuffle_end !== "function" && typeof on_shuffle_end !== "undefined")
			throw "onShuffleEnd expecting to be a function, "+ typeof on_shuffle_end+ " given";

		if(typeof is_shuffle_animation !== "boolean")
			throw "animation expecting to be a boolean, "+typeof is_shuffle_animation+" given";

		// checking if the main holder div's height and width has been set
		if(document.querySelector(div_holder).offsetHeight == 0 || document.querySelector(div_holder).offsetWidth == 0)
			throw "The main holder's ( "+div_holder+" ) width or height has been set to 0. It cannot be seen.";
	}
	catch(err) {
		console.error("img_pzl : "+err+ "!");
		return;
	}

	// adding default value to win_function
	if(typeof img_pzl.gameOver === "undefined") {
		img_pzl.gameOver = function() {
			let moves = img_pzl.gameOver.results.moves;
			let f_minutes = img_pzl.gameOver.results.time_formatted.minutes;
			let f_seconds = img_pzl.gameOver.results.time_formatted.seconds;
			let difficulty = img_pzl.gameOver.results.played_difficulty;
			alert("You win! You did it in "+moves+" moves and "+f_minutes+" minute(s) and "+f_seconds+" seconds. The difficulty was "+ difficulty);
		};
	}

	// setting box_shadow to true if undefined
	if(typeof box_shadow === "undefined") {
		box_shadow = false;
	}

	// variables which are will be passed to the win_function
	// moves
	let mov = 0;
	// cancelled moves
	let canc_mov = 0;
	// time
	let time;
	let fin_time;

	let element_height = "";
	let element_width = "";
	
	let img = new Image();
	let check_playable = false;

	// checking if there is any problem with the image load
	img.onerror = img_load_failed;
	function img_load_failed() {
		console.error("img_pzl : Image could not be loaded");
		return;
	}

	let game_holder = "";

	img.onload = function() {

		// when the image is loaded, save the image's src to a propertie
		img_pzl.img = img.src;

		let original_sequence = "", sequence = "";
		let imgwidth = img.width;
		let imgheight = img.height;
		let winheight = document.querySelector(div_holder).offsetHeight;
		let winwidth = document.querySelector(div_holder).offsetWidth;
		let ratio = Math.min(winwidth / imgwidth, winheight / imgheight);
		let new_width = 0, new_height = 0;
		let columns = 0, rows = 0;

		let elem_piece = 0;
		function getSizes(column, row) {
			// divide new_height and new_width with the number of pieces before using them
			// when use it, it will give back a round pixel number
			new_width = Math.round(imgwidth * ratio / column)*column;
			new_height = Math.round(imgheight * ratio / row)*row;

			// setting how many elemnt going to be created depends on the difficulty
			elem_piece = column * row - 1;

			// setting elements height and width
			element_height = new_height / row;
			element_width = new_width / column;
		}

		if(difficulty === "easy") {
			columns = 5;
			rows = 2;
		}
		if(difficulty === "normal") {
			columns = 7;
			rows = 2;
		}
		if(difficulty === "hard") {
			columns = 7;
			rows = 3;
		}
		if(difficulty === "nightmare") {
			columns = 8;
			rows = 4;
		}

		getSizes(columns,rows);
		
		// empty the main holder div and if there are ".bg-elem"-s then remove their the eventListenres too
		if(document.querySelectorAll(div_holder+" ._game_output .bg-elem")) {
			let element = document.querySelectorAll(div_holder+" ._game_output .bg-elem");
			for(let i = 0; i < element.length; i++) {
				element[i].removeEventListener("touchstart", event_function);
				element[i].removeEventListener("mousedown", event_function);
				element[i].removeEventListener("touchend", event_function);
				element[i].removeEventListener("mouseup", event_function);
			}
		}
		let main_holder = document.querySelector(div_holder);
		while(main_holder.firstChild) {
			main_holder.removeChild(main_holder.firstChild);
		}

		// if the puzzle was made in the same div as before, clear alredy running timeouts
		if(img_pzl.holder === div_holder) {
			clearTimeout(img_pzl.wait);
		}

		// update the holder div
		img_pzl.holder = div_holder;

		// creating game holder div
		let gameHolder = document.createElement("DIV");
		gameHolder.classList.add("_game_output");
		document.querySelector(div_holder).appendChild(gameHolder);
		game_holder = document.querySelector("._game_output");
		game_holder.style.overflow = "hidden";
		
		// Adding pieces to html
		// and adding data attribute to them, this will be useful when checking the win
		for (let i = 0; i <= elem_piece; i++) {
			let randseq = Math.floor(getRandom(0,elem_piece-1));
			game_holder.innerHTML += "<div data-sequence="+randseq+" class='bg-elem'></div>\n";
		}

		game_holder.style.position = "absolute";
		game_holder.style.width = new_width+'px';
		game_holder.style.height = new_height+'px';
		game_holder.style.left = "50%";
		game_holder.style.marginLeft = -new_width/2+'px';
		
		let element = document.querySelectorAll(div_holder+" ._game_output .bg-elem");
		
		// setting elemnts positions and background positions
		//let piece = 0;
		let row = 0;
		let column = 0;
		for (let i = 0; i < element.length; i++) {

			// creating a string with the original sequence of elements
			// in the end the function check this string for get know did we win
			let elem_data = element[i].getAttribute('data-sequence');
			original_sequence = original_sequence + elem_data;

			element[i].style.position = "absolute";
			// setting background image and size
			element[i].style.backgroundImage = "url('"+img.src+"')";
			element[i].style.backgroundSize = new_width+'px '+new_height+'px';

			// setting new height and width
			element[i].style.height = element_height+'px';
			element[i].style.width = element_width+'px';

			// positioning
			element[i].style.left = element_width*column+'px';

			if(row === 0) {
				element[i].style.top = '0px';
				column++;
			} else {
				element[i].style.top = element_height*row+'px';
				column++;
			}
			if(column === columns) {
				column = 0;
				row++;
			}

			// setting background-position of each element
			let leftPos = element[i].offsetLeft;
			let topPos = element[i].offsetTop;
			element[i].style.backgroundPosition = -leftPos+'px '+ -topPos+'px';
		}

		let overlay = "";
		if(is_shuffle_animation === true) {
			// creating the overlay element and setting the css
			let overlayCreate = document.createElement("DIV");
			overlayCreate.classList.add("overlay_div");
			game_holder.appendChild(overlayCreate);
			overlay = document.querySelector(".overlay_div");
			overlay.setAttribute("style",
			"position: relative;"+
			"width: 100%;"+
			"height: 100%;"+
			"left: 0px;"+
			"top: 0px;"+
			"background-image: url(\'"+img.src+"\');"+
			"background-size: "+new_width+"px "+new_height+"px;"+
			"background-position: -"+overlay.offsetLeft+"px "+"-"+overlay.offsetTop+"px;"+
			"z-index: 3;"+
			"transition: all .3s linear;"
			);
		}
		
		let original_pos = [];
		
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

			let all_elem = document.querySelectorAll(div_holder+" ._game_output ."+event.target.classList);

			// MOUSEDOWN AND TOUCHSTART
			if(event.type === "mousedown" || event.type === "touchstart") {
				
				// turning off transition until drag
				for(let i = 0; i < all_elem.length; i++) {
					all_elem[i].style.transition = "all 0s";
				}
				original_pos.push(event.target.offsetTop);
				original_pos.push(event.target.offsetLeft);
				event.target.style.zIndex = "2";
				// starting the timer on first move
				if(mov === 0) {
					time = new Date();
				}
			}

			// MOUSEUP AND TOUCHEN
			if(event.type === "touchend" || event.type === "mouseup") {
				// turning on transition after drag
				for(let i = 0; i < all_elem.length; i++) {
					all_elem[i].style.transition = "all 0.3s";
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
				for(let i = 0; i < all_elem.length; i++) {
					// we have to make sure that our element is not the one we dragging
					if(all_elem[i] === event.target) {
						// if the current element is not the last one, move to the next element
						if(i !== all_elem.length-1) {
							continue;
						}
					}
					// if the mouse or the finger is in the area of an other element
					if(mouse_pos[0] > all_elem[i].offsetLeft && mouse_pos[0] < all_elem[i].offsetLeft+element_width && mouse_pos[1] > all_elem[i].offsetTop && mouse_pos[1] < all_elem[i].offsetTop+element_height) {
						shuffle_elem(event.target,all_elem[i]);
						mov++;
						break;
					}
					// if we do not hit other element, go back to our original position
					if(i == all_elem.length-1) {
						event.target.style.top = original_pos[0]+'px';
						event.target.style.left  = original_pos[1]+'px';
						original_pos = [];
						canc_mov++;
					}
				}
				event.target.style.zIndex = "1";

				check_for_playeable();
			}

		}
		
		// changing data attribute and positions
		function shuffle_elem(elem1, elem2) {
			let elem1_data = elem1.getAttribute('data-sequence');
			let elem2_data = elem2.getAttribute('data-sequence');
			elem1.setAttribute('data-sequence', elem2_data);
			elem2.setAttribute('data-sequence', elem1_data);
			elem1.style.left = elem2.offsetLeft+'px';
			elem1.style.top = elem2.offsetTop+'px';
			elem2.style.top = original_pos[0]+'px';
			elem2.style.left  = original_pos[1]+'px';
			original_pos = [];
			if(check_playable === true) {
				setTimeout(function() {
					check_win();
				},350);
			}
		}
		
		// reading all element data-sequence attribute and add it to a new string
		// if the new string is equal to the old string than its a win
		function check_win() {
			for (let i = 0; i < element.length; i++) {
			let data_sequence = element[i].getAttribute('data-sequence');
			sequence = sequence + data_sequence;
				if(i === element.length-1) {
					if (sequence === original_sequence) {
						check_playable = false;
						img_pzl.state(true);
					} else {
						sequence = "";
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

				// removing the box-shadow of all elements
				if(box_shadow) {
					for(let i = 0; i < element.length; i++ ) {
						element[i].style.boxShadow = "inset 0px 0px 0px #ccc";
					}
				}
			} else {
				return results;
			}
		}

		// if box-shadow is set, then apply it on all element
		// the default box-shadow is : "inset 1px 1px 3px #ccc"
		function get_shadow(box_shadow) {
			if(box_shadow) {
				if(box_shadow === "default") {
					for(let i = 0; i < element.length; i++) {
						element[i].style.boxShadow = "inset 1px 1px 3px #ccc";
					}
				} else {
					for(let i = 0; i < element.length; i++) {
						element[i].style.boxShadow = box_shadow;
					}
				}
			}
		}
		
		// mixing the elemnts
		function shuffle() {
			// shuffle begined
			if(on_shuffle) {
				img_pzl.onShuffle();
			}
			let random_elem = document.querySelectorAll(div_holder+" ._game_output .bg-elem");
			for(let i = 0; i < shuffle_int; i++) {
				let random_num = Math.floor(Math.random() * random_elem.length);
				let random_num2 = Math.floor(Math.random() * random_elem.length);
				original_pos.push(random_elem[random_num].offsetTop);
				original_pos.push(random_elem[random_num].offsetLeft);
				shuffle_elem(random_elem[random_num],random_elem[random_num2]);
				// the shuffle is finsihed
				if(i == shuffle_int-1) {
					if(is_shuffle_animation === true) {
						animate_shuffle();
					} else {
						check_playable = true;
						get_shadow(box_shadow);
						draggable_elements(element); // Enabling draggable
						if(on_shuffle_end) {
							img_pzl.onShuffleEnd();
						}
					}
				}
			}
		}

		function animate_shuffle() {
			// saving all elements positions
			let elemTopPositions = [];
			let elemLeftPositions = [];
			for(let i = 0; i < element.length; i++) {
				elemTopPositions.push(element[i].offsetTop);
				elemLeftPositions.push(element[i].offsetLeft);
			}
			// setting elements new temporary positions (center of the game)
			let top =  new_height/2-element_height/2;
			let left = new_width/2-element_width/2;
			for(let i = 0; i < element.length; i++) {
				element[i].style.top = top+'px';
				element[i].style.left = left+'px';
			}

			// setting the overlay as big as one element and placing exactly the center of the game
			overlay.style.top = top+'px';
			overlay.style.left = left+'px';
			overlay.style.width = element_width+'px';
			overlay.style.height = element_height+'px';
			overlay.style.backgroundPosition = "-"+left+'px '+ "-"+top+'px';

			// the setTimeout function is waiting for 400 ms because the transition on the element is 300 ms
			setTimeout(function() {
				// turning on transition until shuffle animation
				for(let i = 0; i < element.length; i++) {
					element[i].style.transition = "all 0.3s";
				}

				// dropping elements to new positions
				for(let i = 0; i < element.length; i++) {
					setTimeout(function() {
						element[i].style.top = elemTopPositions[i]+'px';
						element[i].style.left = elemLeftPositions[i]+'px';
					},i*100);
					if(i === element.length-1) {
						setTimeout(function() {
							check_playable = true;
							get_shadow(box_shadow);
							draggable_elements(element); // Enabling draggable
							if(on_shuffle_end) {
								setTimeout(function() {
									img_pzl.onShuffleEnd();
								}, 301);
							}
						},1+i*100);
					}
				}
				overlay.remove();
			},400);
		}
		
		// waiting for shuffle
		// adding setTimeout to the function
		img_pzl.wait = setTimeout(shuffle, shuffle_delay);

		function check_for_playeable() {
			if(check_playable === false) {
				return;
			} else {
				check_playable = false;
				setTimeout(function() {
					check_playable = true;
				},310);
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
}

function get_img_puzzle(settings) {

	// accepting settings
	let images = settings.image;
	let div_holder = settings.holder_div;
	let win_function = settings.after_win;
	let difficulty = settings.difficulty || "regular";
	let shuffle_delay = settings.shuffle_delay || 3000;
	let shuffle_int = settings.shuffle_integer || 50;

	try{
		if(typeof images !== "string" && (!Array.isArray(images))) throw "images must be a string or an array";
		if(typeof div_holder !== "string") throw "div_holder is not a string";
		if(typeof win_function !== "function") throw "win_function is not a function";
		if(typeof shuffle_delay !== "number") throw "shuffle_delay is not a number";
		if(typeof shuffle_int !== "number") throw "shuffle_integer is not a number"
		if(typeof difficulty !== "string") throw "difficulty is not a string";
		if(difficulty !== "regular" && difficulty !== "hard") throw "difficulty can be regular or hard";
	}
	catch(err) {
		console.log(err);
	}
	
	let img = new Image();
	let check_playable = false;

	document.querySelector(div_holder).style.position = "relative";
	document.querySelector(div_holder).style.overflow = "hidden";
	
	img.onload = function() {
		let original_sequence = "", sequence = "";
		let imgwidth = img.width;
		let imgheight = img.height;
		let winheight = window.innerHeight;
		let winwidth = window.innerWidth;
		let ratio = Math.min(winwidth / imgwidth, winheight / imgheight);
		let new_width = 0, new_height = 0;
		if(difficulty === "regular") {
			// divide new_height and new_width with the number of pieces before using them
			// when you use it, it will give back a round pixel number
			new_width = Math.round(imgwidth * ratio / 7)*7;
			new_height = Math.round(imgheight * ratio / 2)*2;
		}
		if(difficulty === "hard") {
			new_width = Math.round(imgwidth * ratio / 7)*7;
			new_height = Math.round(imgheight * ratio / 3)*3;
		}
		
		// empty the main holder div
		let main_holder = document.querySelector(div_holder);
		while(main_holder.firstChild) {
			main_holder.removeChild(main_holder.firstChild);
		}
		
		// setting how many elemnt going to be created depends on the difficulty
		let elem_piece = 0;
		if(difficulty === "regular") {
			elem_piece = 13;
		}
		if(difficulty === "hard") {
			elem_piece = 20;
		}
		// Adding pieces to html
		// and adding data attributes to them. The data-piece is always the same, but the data-sequence will be changed
		for (let i = 0; i <= elem_piece; i++) {
			main_holder.innerHTML += "<div data-piece='"+i+"' data-sequence="+i+" class='bg-elem'></div>\n";
		}
		
		main_holder.style.width = new_width+'px';
		main_holder.style.height = new_height+'px';
		main_holder.style.left = "50%";
		main_holder.style.marginLeft = -new_width/2+'px';
		
		let element = document.querySelectorAll(".bg-elem");
		
		// creating a string with the original sequence of elements
		// we will check this string for get know did we win
		for (let i = 0; i < element.length; i++) {
			let elem_data = element[i].getAttribute('data-sequence');
			original_sequence = original_sequence + elem_data;
		}
		
		// setting background and setting elements height and width
		for(let i = 0; i < element.length; i++) {
			element[i].style.backgroundImage = "url('"+img.src+"')";
			element[i].style.backgroundSize = new_width+'px '+new_height+'px';
			element[i].style.width = new_width/7+'px';
			if(difficulty === "regular") {
				element[i].style.height = new_height/2+'px';
			}
			if(difficulty === "hard") {
				element[i].style.height = new_height/3+'px';
			}
		}
		
<<<<<<< HEAD
		// setting elemnts positions
		let piece = 0;
		for (let i = 0; i < element.length; i++) {
			element[i].style.left = new_width/7*piece+'px';
=======
		//setting elemnts positions and background positions
		let piece = 0;
		for (let i = 0; i < element.length; i++) {
>>>>>>> ffa45cd0b636d8b2bb68526f531086a943b01fd9
			// REGULAR
			if(difficulty === "regular") {
				// fisrt row
				if (i <= 6) {
					element[i].style.top = '0px';
				}
				// second row
				if (i > 6) {
					element[i].style.top = new_height/2+'px';
				}
			}
			// HARD
			if(difficulty === "hard") {
				// fisrt row
				if (i <= 6) {
					element[i].style.top = '0px';
				}
				// second row
				if (i > 6 && i < 14) {
					element[i].style.top = new_height/3+'px';
				}
				// third row
				if (i >= 14) {
					element[i].style.top = new_height/3+new_height/3+'px';
				}
			}

			// setting background-position of each element
			let leftPos = element[i].offsetLeft;
			let topPos = element[i].offsetTop;
			element[i].style.backgroundPosition = -leftPos+'px '+ -topPos+'px';

			// counting pieces
			piece++;
			if (piece == 7) {
				piece = 0;
			}
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

			let all_elem = document.querySelectorAll("."+event.target.classList);

			// MOUSEDOWN AND TOUCHSTART
			if(event.type === "mousedown" || event.type === "touchstart") {
				event.target.addEventListener('mouseleave', event_function);
				
				// turning off transition until drag
				for(let i = 0; i < all_elem.length; i++) {
					all_elem[i].style.transition = "all 0s";
				}
				original_pos.push(event.target.offsetTop);
				original_pos.push(event.target.offsetLeft);
				event.target.style.zIndex = "999";
			}

			// MOUSEUP AND TOUCHEN
			if(event.type === "touchend" || event.type === "mouseup") {
				// turning on transition after drag
				for(let i = 0; i < all_elem.length; i++) {
					all_elem[i].style.transition = "all 0.3s";
				}

				let holder_pos = document.querySelector(div_holder).getBoundingClientRect();
				let left = window.innerWidth - holder_pos.right;
				let top = window.innerHeight - holder_pos.bottom;
				let mouse_pos = [];
				let x,y;

				// MOUSE
				if(event.type === "mouseup") {
					x = event.clientX;
					y = event.clientY;
					mouse_pos.push(x-left, y+top);
				}
				// TOUCH
				if(event.type === "touchend") {
					top = holder_pos.top;
					left = holder_pos.left;
					x = event.changedTouches[0].clientX;
					y = event.changedTouches[0].clientY;
					mouse_pos.push(x-left, y-top);
				}

				// checking all the elements, if our finger or mouse is on them
				let data_actual_piece = event.target.getAttribute('data-piece');
				for(let i = 0; i < all_elem.length; i++) {
					// we have to make sure that our element is not the one we dragging
					if(i == data_actual_piece) {
						continue;
					}
					// if the mouse or the finger is in the area of an other element
					if(mouse_pos[0] > all_elem[i].offsetLeft && mouse_pos[0] < all_elem[i].offsetLeft+all_elem[i].offsetWidth && mouse_pos[1] > all_elem[i].offsetTop && mouse_pos[1] < all_elem[i].offsetTop+all_elem[i].offsetHeight) {
						shuffle_elem(event.target,all_elem[i]);
						break;
					}
					// if we do not hit other element, go back to our original position
					if(i == all_elem.length-1) {
						event.target.style.top = original_pos[0]+'px';
						event.target.style.left  = original_pos[1]+'px';
						original_pos = [];
					}
				}
				event.target.style.zIndex = "1";

				check_for_playeable();
			}
			
			// MOUSELEAVE
			if(event.type === "mouseleave") {
				event.target.removeEventListener('mouseleave', event_function);
				event.target.style.top = original_pos[0]+'px';
				event.target.style.left  = original_pos[1]+'px';
				original_pos = [];
				return;
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
				if(i == element.length-1) {
					if (sequence == original_sequence) {
						check_playable = false;
						win();
					} else {
						sequence = "";
					}
				}
			}
		}
		
		function win() {
			// passing the all elements array
			win_function(element);
		}
		
		// mixing the elemnts
		function shuffle() {
			let random_elem = document.querySelectorAll(".bg-elem");
			for(let i = 0; i <= shuffle_int; i++) {
				let random_num = Math.floor(Math.random() * random_elem.length);
				let random_num2 = Math.floor(Math.random() * random_elem.length);
				original_pos.push(random_elem[random_num].offsetTop);
				original_pos.push(random_elem[random_num].offsetLeft);
				shuffle_elem(random_elem[random_num],random_elem[random_num2]);
				if(i == shuffle_int) {
					check_playable = true;
					for(let i = 0; i < element.length; i++) {
						element[i].style.boxShadow = "inset 1px 1px 3px #ccc";
					}
					draggable_elements(element); // Enabling draggable
				}
			}
		}
		
		setTimeout(function() {
			shuffle();
		},shuffle_delay);

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
				this.addEventListener('mouseleave', function() {
					this.removeEventListener('mousemove', dragIt);
				});
				
				document.querySelector(div_holder).addEventListener('mouseup', function() {
					drg_elem[i].removeEventListener('mousemove', dragIt);
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
				
				document.querySelector(div_holder).addEventListener('touchend', function(e) {
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

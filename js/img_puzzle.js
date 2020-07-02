function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function get_img_puzzle(images, shuffle_int = 50) {
	
	let img = new Image();
	
	img.onload = function() {
		let check_playable = false;
		let original_sequence = "", sequence = "";
		let imgwidth = img.width;
		let imgheight = img.height;
		let winheight = window.innerHeight;
		let winwidth = window.innerWidth;
		let ratio = Math.min(winwidth / imgwidth, winheight / imgheight);
		// divide new_height and new_width with the number of pieces before using them
		// when you use it, it will give back a round pixel number
		let new_width = Math.round(imgwidth * ratio / 7)*7;
		let new_height = Math.round(imgheight * ratio / 2)*2;
		
		// empty the main holder div
		let main_holder = document.querySelector(".PlayGround");
		while(main_holder.firstChild) {
			main_holder.removeChild(main_holder.firstChild);
		}
		
		// Adding pieces to html
		// and adding data attributes to them. The data-piece is always the same, but the data-sequence will be changed
		for (let i = 0; i <= 13; i++) {
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
		
		// setting bg and elements height and width
		for(let i = 0; i < element.length; i++) {
			element[i].style.backgroundImage = "url('"+img.src+"')";
			element[i].style.backgroundSize = new_width+'px '+new_height+'px';
			element[i].style.width = new_width/7+'px';
			element[i].style.height = new_height/2+'px';
		}
		
		//setting elemnts position and bg position
		let piece = 0;
		for (let i = 0; i < element.length; i++) {
			element[i].style.left = new_width/7*piece+'px';
			// fisrt row
			if (i <= 6) {
				element[i].style.top = '0px';
			}
			// second row
			if (i > 6) {
				element[i].style.top = new_height/2+'px';
			}
			
			let leftPos = element[i].offsetLeft;
			let topPos = element[i].offsetTop;
			element[i].style.backgroundPosition = -leftPos+'px '+ -topPos+'px';
			
			piece++;
			if (piece == 7) {
				piece = 0;
			}
		}
		
		let original_pos = [];
		
		// listening to mouse and touch events
		for(let i = 0; i < element.length; i++) {
			element[i].addEventListener("touchstart", function(event) {
				mouse_Down(element, element[i]);
			});
			
			element[i].addEventListener("mousedown", function(event) {
				mouse_Down(element, element[i]);
			});
			
			// mouse_up() function needs the event to get the position of touch or mouse,
			// and we manually pass a boolean that tells, is this a touch
			element[i].addEventListener("touchend", function(event) {
				mouse_Up(event, element, element[i], true);
			});
			
			element[i].addEventListener("mouseup", function(event) {
				mouse_Up(event, element, element[i], false);
			});
		}
		
		// MOUSE DOWN
		function mouse_Down(all_elem, this_elem) {
			if(check_playable == false) {
				return;
			}
			// turning off transition until drag
			for(let i = 0; i < all_elem.length; i++) {
				all_elem[i].style.transition = "all 0s";
			} // pushing the active element original position to the array
			original_pos.push(this_elem.offsetTop);
			original_pos.push(this_elem.offsetLeft);
			this_elem.style.zIndex = "999";
		}
		
		// MOUSE UP
		function mouse_Up(e, all_elem, this_elem, touch) {
			if(check_playable == false) {
				return;
			}
			// turning on transition after drag
			for(let i = 0; i < all_elem.length; i++) {
				all_elem[i].style.transition = "all 0.3s";
			}
			let left = window.innerWidth - document.querySelector(".PlayGround").getBoundingClientRect().right;
			let top = window.innerHeight - document.querySelector(".PlayGround").getBoundingClientRect().bottom;
			let mouse_pos = [];
			let x,y;
			// mouse
			if(touch == false) {
				x = e.clientX;
				y = e.clientY;
				mouse_pos.push(x-left, y+top);
			// tuch
			} if(touch == true) {
				top = document.querySelector(".PlayGround").getBoundingClientRect().top;
				left = document.querySelector(".PlayGround").getBoundingClientRect().left;
				x = e.changedTouches[0].clientX;
				y = e.changedTouches[0].clientY;
				mouse_pos.push(x-left, y-top);
			}
			// checking all the elements, if our finger or mouse is on them
			let data_piece = this_elem.getAttribute('data-piece');
			for(let i = 0; i < all_elem.length; i++) {
				// we have to make sure that our element is not the one we dragging
				if(i == data_piece) {
					continue;
				}
				if(mouse_pos[0] > all_elem[i].offsetLeft && mouse_pos[0] < all_elem[i].offsetLeft+all_elem[i].offsetWidth && mouse_pos[1] > all_elem[i].offsetTop && mouse_pos[1] < all_elem[i].offsetTop+all_elem[i].offsetHeight) {
					shuffle_elem(this_elem,all_elem[i]);
					break;
				}
				// if we do not hit other element, go back to our original position
				if(i == all_elem.length-1) {
					this_elem.style.top = original_pos[0]+'px';
					this_elem.style.left  = original_pos[1]+'px';
					original_pos = [];
				}
			}
			this_elem.style.zIndex = "1";
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
			if(check_playable == true) {
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
			for(let i = 0; i < element.length; i++ ) {
				element[i].classList.add("win_anim");
				element[i].style.boxShadow = "inset 0px 0px 0px #ccc";
			}
			setTimeout(function () {
				document.getElementById("before_win").style.display = "none";
				document.getElementById("after_win").style.display = "block";
				document.querySelector(".overlay-shuffle").classList.add("active");
			}, 2200);
		}
		
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
					document.querySelector(".overlay-shuffle").classList.remove("active");
				}
			}
		}
		
		// setting the help image
		document.querySelector(".help_menu img").setAttribute("src", img.src);
		
		
		setTimeout(function() {
			document.getElementById("before_win").style.display = "block";
			document.getElementById("after_win").style.display = "none";
			document.querySelector(".overlay-shuffle").classList.add("active");
		},2500);
		
		setTimeout(function() {
			shuffle();
		},3000);
	}
	let random_img = Math.floor(getRandom(0,images.length-1));
	img.src = images[random_img];
}

// Draggable
let initX, initY, firstX, firstY;
function draggable_elements(object) {
	for(let i = 0; i < object.length; i++) {
		object[i].addEventListener('mousedown', function(e) {
	
		e.preventDefault();
		initX = this.offsetLeft;
		initY = this.offsetTop;
		firstX = e.pageX;
		firstY = e.pageY;
	
		this.addEventListener('mousemove', dragIt, false);
	
		document.querySelector(".PlayGround").addEventListener('mouseup', function() {
			object[i].removeEventListener('mousemove', dragIt, false);
		}, false);
	
		}, false);
		
		object[i].addEventListener('touchstart', function(e) {
	
		e.preventDefault();
		initX = this.offsetLeft;
		initY = this.offsetTop;
		let touch = e.touches;
		firstX = touch[0].pageX;
		firstY = touch[0].pageY;
	
		this.addEventListener('touchmove', swipeIt, false);
	
		document.querySelector(".PlayGround").addEventListener('touchend', function(e) {
			e.preventDefault();
			object[i].removeEventListener('touchmove', swipeIt, false);
		}, false);
	
		}, false);
	
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

// settig the UI
document.addEventListener('DOMContentLoaded', function() {

	let other_img = document.querySelectorAll(".other_img");
	for(let i = 0; i < other_img.length; i++) {
		other_img[i].addEventListener("click", function() {
			let elements = document.querySelectorAll(".bg-elem");
			for(let i = 0; i < elements.length; i++) {
				elements[i].style.boxShadow = "inset 0px 0px 0px #ccc";
			}
			let ui_elements = document.querySelectorAll(".overlay-shuffle, .help_menu, #menu_opener");
			for(let i = 0; i < ui_elements.length; i++) {
				ui_elements[i].classList.remove("active");
			}
			get_img_puzzle(images);
		});
	}
	
	document.getElementById("menu_opener").addEventListener("click", function() {
		document.querySelector(".help_menu").classList.toggle("active");
		document.getElementById("menu_opener").classList.toggle("active");
	});
});
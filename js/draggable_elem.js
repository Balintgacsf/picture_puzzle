var initX, initY, firstX, firstY;
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
		var touch = e.touches;
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
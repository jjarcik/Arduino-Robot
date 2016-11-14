var playzone = document.getElementsByTagName("body")[0],
controlPad = document.getElementById("controlPad"),
joystick = document.getElementById("joystick"),
buttons = document.getElementById("auto"),
indicators = {
	left: [
	document.querySelector('#left .indicator .plus'),
	document.querySelector('#left .indicator .minus'),
	],
	right: [
	document.querySelector('#right .indicator .plus'),
	document.querySelector('#right .indicator .minus'),
	]
},
prevbutton = null

var state = {
	mouseDown: false
}

function ontouchmove(data) {
	setValues({
		x: data.changedTouches[0].pageX - controlPad.getBoundingClientRect().left,
		y: data.changedTouches[0].pageY - controlPad.getBoundingClientRect().top,
		w: controlPad.offsetWidth,
		h: controlPad.offsetHeight
	})
}

function onmousemove(data) {
	data.preventDefault()	
	if (state.mouseDown) {
		setValues({
			x: data.clientX - controlPad.getBoundingClientRect().left,
			y: data.clientY - controlPad.getBoundingClientRect().top,
			w: controlPad.offsetWidth,
			h: controlPad.offsetHeight
		})
	}
}


function onmousedown(data) {
	state.mouseDown = true;
	data.preventDefault()	
}

function onmouseup(data) {
	state.mouseDown = false;
	data.preventDefault()	
}

function normalisePercentage(data) {
	return ({
		left: 1 - (data.x / data.w),
		right: (data.x / data.w),
		speed:  1 - (data.y / data.h),
	})
}

function minZero(data) {
	return ({
		left: Math.max(data.left, 0),
		right: Math.max(data.right, 0),
		speed: Math.max(data.speed, 0),
	})
}

function max255(data) {
	return ({
		left: Math.min(data.left, 255),
		right: Math.min(data.right, 255)
	})
}

function min255(data) {
	return ({
		left: Math.max(data.left, -255),
		right: Math.max(data.right, -255)
	})
}

function floor(data) {
	return ({
		left: Math.floor(data.left),
		right: Math.floor(data.right)
	})
}

function distributSpeed(data){
	return ({
		left: data.left * 4*255 * (data.speed - .5),
		right: data.right * 4*255 * (data.speed - .5),
	})
}

function setToZone(data, zone) {
	var left = data.x
	var top = data.y

	left = Math.min(left, zone.offsetWidth + zone.offsetLeft)
	top = Math.min(top, zone.offsetHeight + zone.offsetTop)
	left = Math.max(left, zone.offsetLeft)
	top = Math.max(top, zone.offsetTop)

	return {
		x: left,
		y: top
	}
}

function setJoyStick(data) {
	var left = data.x - joystick.offsetWidth / 2;
	var top = data.y  - joystick.offsetHeight / 2;

	joystick.style.left = left
	joystick.style.top = top
}

function setValues(data) {
	document.getElementById("debug").innerHTML = Math.floor(data.x) + ", " + Math.floor(data.y)
	
	var inzone = setToZone(data, controlPad)
	setJoyStick(inzone)
	
	data.x = inzone.x - controlPad.offsetLeft;
	data.y = inzone.y - controlPad.offsetTop;;

	var trans = floor(min255(max255(distributSpeed(minZero(normalisePercentage(data))))))
	values2html(trans)	
	
}

function values2html(data){
	var L1 = Math.max(100 * data.left / 255, 0) / 2
	var L2 = Math.abs(Math.min(100 * data.left / 255, 0)) / 2
	
	var R1 = Math.max(100 * data.right / 255, 0) / 2
	var R2 = Math.abs(Math.min(100 * data.right / 255, 0)) / 2

	indicators.left[0].style.height = L1 + "%"
	indicators.left[1].style.height = L2 + "%"
	indicators.right[0].style.height = R1 + "%"
	indicators.right[1].style.height = R2 + "%"

	/*
	document.getElementById("left_pwd").innerHTML = Math.abs(data.left)
	document.getElementById("left_direction").innerHTML = data.left > 0 ? "+" : "-"
	document.getElementById("right_pwd").innerHTML = Math.abs(data.right)
	document.getElementById("right_direction").innerHTML = data.right > 0 ? "+" : "-"
	/**/

}

function onbuttonclick(event) {	

	if (prevbutton == event.target) {		
		if (prevbutton.classList.contains('selected')) {
			prevbutton.classList.remove("selected")	
		} else {			
			prevbutton.classList.add("selected")		
		}
	} else {
		if (prevbutton) {
			prevbutton.classList.remove("selected")
		}
		prevbutton = event.target
		event.target.classList.add("selected")	
	}
	
	switch (event.target.dataset.id) {
		case "up":
			callRobot(3)
			break
		case "down":
			callRobot(4)
			break
		case "left":
			callRobot(1)
			break
		case "right":
			callRobot(2)
			break
		case "rotate":
			callRobot(5)
			break
	}
	//callRobot()

	
}

function callRobot(pin){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://10.0.0.6/?pin=' + pin);
	xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.addEventListener("load", function(){
		console.log(this.responseText);
	});
	xhr.send(null)
}

function init() {
	playzone.addEventListener("touchmove", ontouchmove);
	playzone.addEventListener("mousedown", onmousedown);
	playzone.addEventListener("mouseup", onmouseup);
	playzone.addEventListener("mousemove", onmousemove);
	buttons.addEventListener("click", onbuttonclick);
}

init()
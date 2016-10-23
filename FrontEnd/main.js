var playzone = document.getElementsByTagName("body")[0],
controlPad = document.getElementById("controlPad")
joystick = document.getElementById("joystick")

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
	document.getElementById("left_pwd").innerHTML = Math.abs(data.left)
	document.getElementById("left_direction").innerHTML = data.left > 0 ? "+" : "-"
	document.getElementById("right_pwd").innerHTML = Math.abs(data.right)
	document.getElementById("right_direction").innerHTML = data.right > 0 ? "+" : "-"

}

function init() {

	var el = document.getElementsByTagName("body")[0];
	console.log("init")

	playzone.addEventListener("touchmove", ontouchmove);
	playzone.addEventListener("mousedown", onmousedown);
	playzone.addEventListener("mouseup", onmouseup);
	playzone.addEventListener("mousemove", onmousemove);

}

init()
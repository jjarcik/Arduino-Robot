var state = {
	mouseDown: false
}

function ontouchmove(data) {
	setValues({
		x: data.changedTouches[0].pageX,
		y: data.changedTouches[0].pageY,
		w: window.innerWidth,
		h: window.innerHeight
	})
}

function onmousedown(data) {
	state.mouseDown = true;
}


function onmouseup(data) {
	state.mouseDown = false;
}


function onmousemove(data) {
	if (state.mouseDown) {
		setValues({
			x: data.clientX,
			y: data.clientY,
			w: window.innerWidth,
			h: window.innerHeight
		})
	}
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

function floor(data) {
	return ({
		left: Math.floor(data.left),
		right: Math.floor(data.right)
	})
}

function distributSpeed(data){
	return ({
		left: data.left * 2*255 * (data.speed - .5),
		right: data.right * 2*255 * (data.speed - .5),
	})
}

function setValues(data) {
	var data = floor(max255(distributSpeed(minZero(normalisePercentage(data)))))
	values2html(data)
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

	el.addEventListener("touchmove", ontouchmove);
	el.addEventListener("mousedown", onmousedown);
	el.addEventListener("mouseup", onmouseup);
	el.addEventListener("mousemove", onmousemove);

}

init()
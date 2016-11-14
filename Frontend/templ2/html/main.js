var playzone = document.getElementsByTagName("body")[0],
controlPad = document.getElementById("controlPad"),
debug = document.getElementById("debug"),
state = {
	mouseDown: false
},
path = [],
blockWidth = 10 // 10%

function optimizePath(path){
	if (path.length <= 1) {
		return path
	}

	var result = [];

	for (var i = 0; i < path.length - 1; i++){
			if (path[i + 1].x === path[i].x || path[i + 1].y === path[i].y){
				continue
			}
			
			if (path[i + 1].x === path[i].x - 1) {
				if (path[i + 1].y === path[i].y - 1 || path[i + 1].y === path[i].y + 1) {
					result[i] = {
						i: i,
						x: path[i].x - 1,
						y:path[i].y
					}
				}				
			}

			if (path[i + 1].x === path[i].x + 1) {
				if (path[i + 1].y === path[i].y - 1 || path[i + 1].y === path[i].y + 1) {
					result[i] = {
						i: i,
						x: path[i].x + 1,
						y: path[i].y
					}
				}				
			}
	}
	console.log(result)
	var final_path = [], x = 0;
	for (var i = 0; i < path.length; i++){
		var found = false;
		for (var j in result){
			if (result[j].i === i) {
				found = j;
				break
			}
		}	
		final_path[x] = path[i];
		x++;	
		if (found) {						
			final_path[x] = result[found]
			final_path[x].added = true
			x++
		} 
	}

	return final_path;
}

function directPath(path) {
	
	for (var i = 0; i < path.length-1; i++) {
		if (path[i].y < path[i + 1].y) {
			path[i].direct = 'down'
		}
		if (path[i].y > path[i + 1].y) {
			path[i].direct = 'up'
		}

		if (path[i].x < path[i + 1].x) {
			path[i].direct = 'right'
		}

		if (path[i].x > path[i + 1].x) {
			path[i].direct = 'left'
		}
	}

	path[path.length-1].direct = ""
	return path
}

function clearMatrix() {
	path = []
	controlPad.innerHTML = "";

	for (var i = 0; i < blockWidth; i++) {		
		for (var j = 0; j < blockWidth; j++) {
			var div = document.createElement('div');
			div.id = i + "_" + j
			controlPad.appendChild(div)
		}
	}
}


function onmousedown(data) {
	clearMatrix();
	state.mouseDown = true;
	data.preventDefault()	
}

function onmouseup(data) {
	state.mouseDown = false;	
	data.preventDefault();
	var new_path = directPath(optimizePath(path));
	showPath(new_path)

}

function showPath(path)  {
	//controlPad.innerHTML = "";
	for (var i = 0; i < path.length; i++){
		var selected =  document.getElementById(path[i].y + "_" + path[i].x);
		var className = "selected"		

		
		if (path[i].added) {
			className += " selected2"
		}

		if (i === 0) {
			className += " first"
		}

		if (i === path.length - 1) {
			className += " last"
		}

		className += " " + path[i].direct

		selected.className = className
	}
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

function setValues(data) {
	

	var inzone = setToZone(data, controlPad)
	var one = controlPad.offsetHeight * blockWidth / 100
	var m = {
		y: Math.floor(inzone.y / one),
		x: Math.floor(inzone.x / one),
	}

	// test if is selected
	for (var i in path) {
		if (path[i].x === m.x && path[i].y === m.y) {
			return;
		}
	}

	path.push({
		x: m.x,
		y: m.y
	})

	var selected =  document.getElementById(m.y + "_" + m.x);
	selected.className = "selected "

	debug.innerHTML = m.x + ", " + m.y
	/*
	setJoyStick(inzone)
	
	data.x = inzone.x - controlPad.offsetLeft;
	data.y = inzone.y - controlPad.offsetTop;;

	var trans = floor(min255(max255(distributSpeed(minZero(normalisePercentage(data))))))
	values2html(trans)	
	/**/
	
}


function ontouchmove(data) {
	setValues({
		x: data.changedTouches[0].pageX - controlPad.getBoundingClientRect().left,
		y: data.changedTouches[0].pageY - controlPad.getBoundingClientRect().top,
		w: controlPad.offsetWidth,
		h: controlPad.offsetHeight
	})
}


function init() {
	playzone.addEventListener("touchmove", ontouchmove);
	playzone.addEventListener("mousedown", onmousedown);
	playzone.addEventListener("mouseup", onmouseup);
	playzone.addEventListener("mousemove", onmousemove);
	clearMatrix()
}

init()
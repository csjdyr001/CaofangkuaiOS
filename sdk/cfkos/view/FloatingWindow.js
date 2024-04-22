class FloatingWindow {
    constructor(layout, canTouch = true, canMove = true, onclickCallBack = null, x = 0, y = 0, zIndex = 9999999) {
        this.fw = document.createElement('div');
        this.fw.innerHTML = layout;
        this.fw.style.position = "absolute";
        this.setX(x);
        this.setY(y);
        this.fw.style.zIndex = zIndex;
        if (canTouch == false) {
            this.fw.style.pointerEvents = 'none';
        }
        if (canMove == true) {
            setFloatingWindowMove(this.fw,onclickCallBack || (()=>{}));
        }
        document.body.appendChild(this.fw);
        this.hide();
    }

    setX(x) {
        this.fw.style.left = x + "px";
    }

    setY(y) {
        this.fw.style.top = y + "px";
    }

    hide() {
        this.fw.style.display = "none";
    }

    show() {
        this.fw.style.display = "block";
    }

    remove() {
        document.body.removeChild(this.fw);
    }
    
    getDiv(){
        return this.fw;
    }
}
function setFloatingWindowMove(oDiv, onclickCallBack) {
	// Tag is drag or click.
	var disX, moveX, L, T, starX, starY, starXEnd, starYEnd;

	let beforeX, beforeY; // Mouse click coordinates.

	oDiv.addEventListener('touchstart', function(e) {

		beforeX = this.offsetLeft;
		beforeY = this.offsetTop;

		e.preventDefault();
		// Prevents pages from scrolling or zooming when touched.
		disX = e.touches[0].clientX - this.offsetLeft;
		disY = e.touches[0].clientY - this.offsetTop;
		// The coordinates when the finger is down.
		starX = e.touches[0].clientX;
		starY = e.touches[0].clientY;
	});

	oDiv.addEventListener('touchmove', function(e) {
		L = e.touches[0].clientX - disX;
		T = e.touches[0].clientY - disY; // The difference between the current position and the starting position when moving.
		starXEnd = e.touches[0].clientX - starX;
		starYEnd = e.touches[0].clientY - starY;
		if (L < 0) {
			// Limit drag X range, can not drag out of the screen.
			L = 0;
		} else if (L > document.documentElement.clientWidth - this.offsetWidth) {
			L = document.documentElement.clientWidth - this.offsetWidth;
		}
		if (T < 0) {
			// Limit drag Y range, can not drag out of the screen.
			T = 0;
		} else if (T > document.documentElement.clientHeight - this.offsetHeight) {
			T = document.documentElement.clientHeight - this.offsetHeight;
		}
		moveX = L + 'px';
		moveY = T + 'px';
		this.style.left = moveX;
		this.style.top = moveY;
	});

	oDiv.addEventListener('touchend', function() {
		// The coordinate of the mouse click and the coordinate of the lift is the click event.
		if (beforeX === this.offsetLeft && beforeY === this.offsetTop) {
			//onclick
			onclickCallBack();
		}
	});
}

function changeFractalType()
{
	var select = document.getElementById( "fractalType" );
	fractalParams.type = select.options[ select.selectedIndex ].value;
}


function changeColorMode()
{
	var select = document.getElementById( "colorMode" );
	fractalParams.color = select.options[ select.selectedIndex ].value;
}


function changePixelSize()
{
	fractalParams.pixelSize = document.getElementById( "pixelSize" ).value;
	document.getElementById( "pixelSizeValue" ).innerHTML = fractalParams.pixelSize + "px";
}


function changeMaxiter()
{
	fractalParams.maxiter = Math.round( document.getElementById( "maxiter" ).value );
	document.getElementById( "maxiterValue" ).innerHTML = fractalParams.maxiter;
}


function changeSmoothing()
{
	fractalParams.smoothing = document.getElementById( "smoothing" ).checked;
}


function changeBailout()
{
	fractalParams.bailoutThreshold = document.getElementById( "bailout" ).value;
}


function focusOutViewport( event )
{
	alert( event.currentTarget.id );
}


function focusOutParamC()
{
	var re = parseFloat( document.getElementById( "re" ).value );
	if ( isNaN( re ) )
	{
		alert( "Param real part is not valid" );
		return;
	}
	var im = parseFloat( document.getElementById( "im" ).value );
	if ( isNaN( im ) )
	{
		alert( "Param imaginary part is not valid" );
		return;
	}
	
	fractalParams.C = { re: re, im: im };
	
	updateFractal();
}


function clickCaptureParamC()
{
	var button = document.getElementById( "captureParamC" );
	
	if ( button.style.borderStyle == "inset" )
	{
		button.style.borderStyle = "outset";
		canvas.style.cursor = "move";
	}
	else
	{
		button.style.borderStyle = "inset";
		canvas.style.cursor = "crosshair";
	}
}

function clickNavigator( event )
{ 
	var target = event.currentTarget;
	var factor = 0.25;

	switch ( target.id )
	{
		case "reset": viewport = new Viewport( -2, 2, -2 * canvas.height / canvas.width, 2 *  canvas.height / canvas.width ); break;
		case "up": viewport = new Viewport( viewport.xmin, viewport.xmax, viewport.ymin + viewport.height * factor, viewport.ymax + viewport.height * factor ); break;
		case "down": viewport = new Viewport( viewport.xmin, viewport.xmax, viewport.ymin - viewport.height * factor, viewport.ymax - viewport.height * factor ); break;
		case "right": viewport = new Viewport( viewport.xmin + viewport.width * factor, viewport.xmax + viewport.width * factor, viewport.ymin, viewport.ymax ); break;
		case "left": viewport = new Viewport( viewport.xmin - viewport.width * factor, viewport.xmax - viewport.width * factor, viewport.ymin, viewport.ymax ); break;
		case "topleft": viewport = new Viewport( viewport.xmin - viewport.width * factor, viewport.xmax - viewport.width * factor, viewport.ymin + viewport.height * factor, viewport.ymax + viewport.height * factor ); break;
		case "topright": viewport = new Viewport( viewport.xmin + viewport.width * factor, viewport.xmax + viewport.width * factor, viewport.ymin + viewport.height * factor, viewport.ymax + viewport.height * factor ); break;
		case "bottomright": viewport = new Viewport( viewport.xmin + viewport.width * factor, viewport.xmax + viewport.width * factor, viewport.ymin - viewport.height * factor, viewport.ymax - viewport.height * factor ); break;
		case "bottomleft": viewport = new Viewport( viewport.xmin - viewport.width * factor, viewport.xmax - viewport.width * factor, viewport.ymin - viewport.height * factor, viewport.ymax - viewport.height * factor ); break;
	}
	
	updateViewportDiv();
	updateFractal();
}
	

function updateViewportDiv()
{
	document.getElementById( "xmin" ).value = viewport.xmin;
	document.getElementById( "xmax" ).value = viewport.xmax;
	document.getElementById( "ymin" ).value = viewport.ymin;
	document.getElementById( "ymax" ).value = viewport.ymax;
	document.getElementById( "width" ).value = viewport.width;
	document.getElementById( "height" ).value = viewport.height;
	document.getElementById( "area" ).value = viewport.area;
}


function updateParamC()
{
	document.getElementById( "re" ).value = fractalParams.C.re;
	document.getElementById( "im" ).value = fractalParams.C.im;
}


// -------- CANVAS FRACTAL ----------

var dragging = false;
var mouseX, mouseY

function mouseDownFractal( event )
{
	if ( event.button == 0 )
	{
		var x = event.pageX - this.offsetLeft;
		var y = event.pageY - this.offsetTop;	
		var coords = coordToViewport( this.width, this.height, viewport, x, y );	
		mouseX = coords.x;
		mouseY = coords.y;

		if ( document.getElementById( "captureParamC" ).style.borderStyle == "inset" )
		{
			fractalParams.C = { re: mouseX, im: mouseY };
			clickCaptureParamC();
			updateParamC();
			updateFractal();
		}
		else
		{
			dragging = true;
		}
	}
}


function mouseMoveFractal( event )
{
	var x = event.pageX - this.offsetLeft; 
	var y = event.pageY - this.offsetTop;
	var coords = coordToViewport( this.width, this.height, viewport, x, y );	
	
	document.getElementById( "x" ).innerHTML = coords.x;
	document.getElementById( "y" ).innerHTML = coords.y;
	document.getElementById( "iter" ).innerHTML = generatorMap[ fractalParams.type ]( coords.x, coords.y, fractalParams );
}


function mouseUpFractal( event )
{
	if ( dragging )
	{
		dragging = false;

		var x = event.pageX - this.offsetLeft;
		var y = event.pageY - this.offsetTop;
		var coords = coordToViewport( this.width, this.height, viewport, x, y );	
		var distX = coords.x - mouseX;
		var distY = coords.y - mouseY;
		if ( distX == 0 && distY == 0 )  // same position
			return;
		viewport = new Viewport( viewport.xmin - distX, viewport.xmax - distX, viewport.ymin - distY, viewport.ymax - distY );

		updateFractal();
		updateViewportDiv();
	}
}


// Zoom over fractal
function mouseWheelFractal( event )
{
	// avoid scroll on browser
	event.preventDefault();

	// zoom factor
	var factor = event.deltaY > 0 ? 1.2 : 1 / 1.2;
	
	// mouse viewport position
	var x = event.pageX - this.offsetLeft;
	var y = event.pageY - this.offsetTop;
	var coords = coordToViewport( this.width, this.height, viewport, x, y );
	x = coords.x;
	y = coords.y;
	
	// update viewport
	var nWidth = viewport.width * factor, nHeight = viewport.height * factor;
	var nxmin = x - ( x - viewport.xmin ) * nWidth / viewport.width;
	var nymin = y - ( y - viewport.ymin ) * nHeight / viewport.height;

	viewport = new Viewport( nxmin, nxmin + nWidth, nymin, nymin + nHeight );
	
	// redraw
	updateFractal();
	updateViewportDiv();
}


var canvas, canvasBuffer;
var context, contextBuffer;
var workers;

var fractalParams;

var viewport;

var timestamp;


window.onload = function() {

	// setup graphics
	canvas = document.getElementById( "canvas" );
	context = canvas.getContext( "2d" );

	// set workers data
	workers = {
		array: [],
		jobDone: 0,
		maxworkers: 16
	}
		
	// initial fractal basic params
	fractalParams = {
		fractalColor: new Color( 0, 0, 0, 255 ),
		color: "logCyclicHSV",
		C: { re: 0.285, im: -0.01 }/*,
		maxiter: document.getElementById( "maxiter" ).value,
		pixelSize: Math.round( Math.sqrt( document.getElementById( "pixelSize" ).value ) )*/
	}
	
	// initial viewport
	viewport = new Viewport( -2, 2, -2 * canvas.height / canvas.width, 2 *  canvas.height / canvas.width );

	// assign events
	document.getElementById( "bailout" ).onchange = function() { changeBailout(); updateFractal() };
	document.getElementById( "pixelSize" ).onchange = function() { changePixelSize(); updateFractal() };
	document.getElementById( "pixelSize" ).oninput = function() { changePixelSize(); updateFractal() };
	document.getElementById( "maxiter" ).onchange = function() { changeMaxiter(); updateFractal() };
	document.getElementById( "maxiter" ).oninput = function() { changeMaxiter(); updateFractal() };
	document.getElementById( "smoothing" ).onchange = function() { changeSmoothing(); updateFractal() };
	document.getElementById( "fractalType" ).onchange = function() { changeFractalType(); updateFractal() };
	document.getElementById( "colorMode" ).onchange = function() { changeColorMode(); updateFractal() };
	document.getElementById( "xmin" ).onfocusout = focusOutViewport;
	document.getElementById( "xmin" ).onblur = focusOutViewport;
	document.getElementById( "xmax" ).onfocusout = focusOutViewport;
	document.getElementById( "xmax" ).onblur = focusOutViewport;
	document.getElementById( "ymin" ).onfocusout = focusOutViewport;
	document.getElementById( "ymin" ).onblur = focusOutViewport;
	document.getElementById( "ymax" ).onfocusout = focusOutViewport;
	document.getElementById( "ymax" ).onblur = focusOutViewport;
	document.getElementById( "captureParamC" ).onclick = clickCaptureParamC;
	document.getElementById( "re" ).onfocusout = focusOutParamC;
	document.getElementById( "re" ).onblur = focusOutParamC;
	document.getElementById( "im" ).onfocusout = focusOutParamC;
	document.getElementById( "im" ).onblur = focusOutParamC;
	
	
	var navbuttons = document.querySelectorAll( "#navigator input[type='button']" );
	for ( var i = 0; i < navbuttons.length; i++ )
		navbuttons[i].onclick = clickNavigator;

	canvas.onmousedown = mouseDownFractal;
	canvas.onmouseup = mouseUpFractal;
	canvas.onmousemove = mouseMoveFractal;
	canvas.onwheel = mouseWheelFractal;
	
	
	// set initial values
	changeFractalType();
	changeColorMode();
	changePixelSize();
	changeMaxiter();
	changeSmoothing();
	changeBailout();

	updateViewportDiv();
	updateParamC();

	// first fractal updata
	updateFractal();
}


function updateFractal()
{
	timestamp = Date.now();
	
	context.font = "22px Arial";
	context.textAlign = "center";
	context.fillStyle = "black";
	context.fillText( "Updating...", canvas.width / 2, canvas.height / 2 );
	context.fillStyle = "white";
	context.fillText( "Updating...", canvas.width / 2 - 1, canvas.height / 2 - 1 );
	
	// kill previous workers
	if ( workers.array.length > 0 )
		for ( var i = 0; i < workers.array.length; i++ )
			workers.array[i].terminate();
	
	// restart workers object
	workers.array = [];
	workers.jobDone = 0;
	
	// physical size of the image workers
	var workerWidth = Math.ceil( canvas.width / fractalParams.pixelSize );
	var workerHeight = Math.ceil( canvas.height / ( fractalParams.pixelSize * workers.maxworkers ) );
	
	// create new canvas buffer
	canvasBuffer = document.createElement( "canvas" );
	canvasBuffer.width = workerWidth;
	canvasBuffer.height = workerHeight * workers.maxworkers;
	contextBuffer = canvasBuffer.getContext( "2d" );
	
	// create workers
	var viewportHeight = ( viewport.ymax - viewport.ymin ) / workers.maxworkers;
	for ( var i = 0; i < workers.maxworkers; i++ )
	{
		var worker = new Worker( "worker.js" );
		worker.onmessage = workersJobDone;
		workers.array.push( worker );
		worker.postMessage( { 
			width: workerWidth,
			height: workerHeight,
			params: fractalParams,
			viewport: new Viewport( viewport.xmin, viewport.xmax, viewport.ymax - viewportHeight * ( i + 1 ), viewport.ymax - viewportHeight * i ),
			id: i
		});
	}
}


function workersJobDone( event )
{
	var data = event.data;
	
	var imageData = contextBuffer.createImageData( data.width, data.height );
	imageData.data.set( data.imageArray );
	contextBuffer.putImageData( imageData, 0, canvasBuffer.height / workers.maxworkers * data.id );
	
	workers.jobDone++;
	
	if ( workers.jobDone == workers.maxworkers )
	{
		smoothing( context, fractalParams.smoothing );
		context.drawImage( canvasBuffer, 0, 0, canvas.width, canvas.height );
		workers.jobDone = 0;
		document.getElementById( "time" ).innerHTML = ( Date.now() - timestamp ) / 1000;
	}
}

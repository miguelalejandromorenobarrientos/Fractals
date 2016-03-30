
importScripts( "FractalGenerator.js", "fractals_lib.js", "colorFunctions.js" );


self.onmessage = function( event ) {
	
	var data = event.data;
	
	var generatorFunction = generatorMap[ data.params.type ];
	var colorFunction = colorFunctions[ data.params.color ];
	var imageArray = new Uint8ClampedArray( data.width * data.height * 4 );

	for ( var row = 0; row < data.height; row++ )
		for ( var col = 0; col < data.width; col++ )
		{
			var coords = coordToViewport( data.width, data.height, data.viewport, col, row );
			var iters = generatorFunction( coords.x, coords.y, data.params );
			var color = data.params.fractalColor;
			if ( isFinite( iters ) )
				color = colorFunction( iters, data.params.maxiter );
			setPixel( imageArray, data.width, col, row, color );
		}
	
	self.postMessage( { id: data.id, width: data.width, height: data.height, imageArray: imageArray } );
	
	self.close();
}


function setPixel( imageArray, rowWidth, x, y, color )
{
	var index = ( rowWidth * y + x ) * 4;
	imageArray[ index ] = color.red;
	imageArray[ index + 1 ] = color.green;
	imageArray[ index + 2 ] = color.blue;
	imageArray[ index + 3 ] = color.alpha;
}

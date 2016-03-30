
function Color( red, green, blue, alpha )
{
	this.red = red;
	this.green = green;
	this.blue = blue;
	this.alpha = alpha;	
}


function HSVtoRGB( h, s, v, a )
{
	s = s / 100;
	v = v / 100;
	
	var c = v * s;
	var x = c * ( 1 - Math.abs( ( h / 60 ) % 2 - 1 ) );
	var m = v - c;
	var red, green, blue;
	
	switch ( Math.floor( h / 60 ) )
	{
		case 0: red = c, green = x, blue = 0; break;
		case 1: red = x, green = c, blue = 0; break;
		case 2: red = 0, green = c, blue = x; break;
		case 3: red = 0, green = x, blue = c; break;
		case 4: red = x, green = 0, blue = c; break;
		case 5: red = c, green = 0, blue = x; break;
	}
	
	return new Color( parseInt( ( red + m ) * 255 ), parseInt( ( green + m ) * 255 ), parseInt( ( blue + m ) * 255 ), 255 );
}


//============= DRAW FUNCTIONS =============

function cyclicHSV( iters, maxiter )
{
	var h = ( iters / maxiter * 359 * 3 ) % 360;
	var s = 100;
	var v = ( iters / maxiter * 99 * 5 ) % 100;

	return HSVtoRGB( h, s, v, 255 );
}


function logCyclicHSV( iters, maxiter )
{
	var h = ( Math.log( iters + 1 ) / Math.log( maxiter + 1 ) * 359 * Math.PI ) % 360;
	var s = 100;
	var v = ( Math.log( iters + 1 ) / Math.log( maxiter + 1 ) * 99 * Math.E ) % 100;
	
	return HSVtoRGB( h, s, v, 255 );
}


function cyclicRGB( iters, maxiter )
{
	var red = ( iters / maxiter * 255 * Math.E ) % 256;
	var green = ( iters / maxiter * 255 * Math.PI ) % 256;
	var blue = ( iters / maxiter * 255 * Math.SQRT2 ) % 256;
	
	return new Color( red, green, blue, 255 );
}


function twoColors()
{
	return new Color( 255, 255, 255, 255 );
}


/////////////////////
var colorFunctions = {
	cyclicHSV: cyclicHSV,
	logCyclicHSV: logCyclicHSV,
	cyclicRGB: cyclicRGB,
	twoColors: twoColors
};

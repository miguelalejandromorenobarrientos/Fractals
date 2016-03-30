
function mandelbrotGenerator( x, y, params )
{
	var zRe = zIm = 0;
	
	for ( var iter = 0; iter <= params.maxiter; iter++ )
	{
		if ( zRe * zRe + zIm * zIm > params.bailoutThreshold * params.bailoutThreshold )
			return iter;
			
		var re = zRe, im = zIm;
		// z_n_1 = z_n^2+(x,y)
		zRe = x + re * re - im * im;
		zIm = y + 2 * re * im;
	}
	
	return Infinity;
}


function juliaGenerator( x, y, params )
{
	var zRe = x, zIm = y;
	
	for ( var iter = 0; iter <= params.maxiter; iter++ )
	{
		if ( zRe * zRe + zIm * zIm > params.bailoutThreshold * params.bailoutThreshold )
			return iter;
			
		var re = zRe, im = zIm;
		// z_n_1 = z_n^2+C
		zRe = params.C.re + re * re - im * im;
		zIm = params.C.im + 2 * re * im;
	}
	
	return Infinity;
}



/////////////////////////////

var generatorMap = {
	mandelbrot: mandelbrotGenerator,
	julia: juliaGenerator
}

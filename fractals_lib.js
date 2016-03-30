
function Viewport( xmin, xmax, ymin, ymax )
{
	this.xmin = xmin;
	this.xmax = xmax;
	this.ymin = ymin;
	this.ymax = ymax;
	this.width = Math.abs( xmax - xmin );
	this.height = Math.abs( ymax - ymin );
	this.centerX = ( xmax + xmin ) / 2;
	this.centerY = ( ymax + ymin ) / 2;
	this.area = this.width * this.height;
}


function coordToViewport( width, height, viewport, x, y )
{
	var vx = x / ( width - 1 ) * viewport.width + viewport.xmin;
	var vy = ( height - 1 - y ) / ( height - 1 ) * viewport.height + viewport.ymin;
	
	return { x: vx, y: vy };
}


// smooth image when scaling
function smoothing( context, enabled )
{
    context.imageSmoothingEnabled = enabled;
    context.mozImageSmoothingEnabled = enabled;
    context.webkitImageSmoothingEnabled = enabled;
    context.msImageSmoothingEnabled = enabled;
}

class Fire {
    //const columns;
    constructor (elementID, canvasWidth, canvasHeight, columns, rows) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.columns = columns;
        this.rows = rows;

        this.canvasDrawn = false;
        this.elementID = elementID;
        this.ctx;

        this.frameRate = 25;

        this.firePixels;
        this.pixelWidth = canvasWidth / columns;
		this.pixelHeight = canvasHeight / rows;
		this.colorsPalette = ['rgb(7, 7, 7)', 'rgb(31, 7, 7)', 'rgb(47, 15, 7)', 'rgb(71, 15, 7)', 'rgb(87, 23, 7)', 'rgb(103, 31, 7)', 'rgb(119, 31, 7)', 'rgb(143, 39, 7)', 'rgb(159, 47, 7)', 'rgb(175, 63, 7)', 'rgb(191, 71, 7)', 'rgb(199, 71, 7)', 'rgb(223, 79, 7)', 'rgb(223, 87, 7)', 'rgb(223, 87, 7)', 'rgb(215, 95, 7)', 'rgb(215, 95, 7)', 'rgb(215, 103, 15)', 'rgb(207, 111, 15)', 'rgb(207, 119, 15)', 'rgb(207, 127, 15)', 'rgb(207, 135, 23)', 'rgb(199, 135, 23)', 'rgb(199, 143, 23)', 'rgb(199, 151, 31)', 'rgb(191, 159, 31)', 'rgb(191, 159, 31)', 'rgb(191, 167, 39)', 'rgb(191, 167, 39)', 'rgb(191, 175, 47)', 'rgb(183, 175, 47)', 'rgb(183, 183, 47)', 'rgb(183, 183, 55)', 'rgb(207, 207, 111)', 'rgb(223, 223, 159)', 'rgb(239, 239, 199)', 'rgb(255, 255, 255)']

        this.debug = false;

        this.init();
    }

    init () {
        this.createFirePixels();
        this.createFireSource();
        this.createCanvas();
        this.draw();
    }

    createFirePixels () {
        let fire = Array();
        for (let i=0; i<this.columns*this.rows; i++) {
            fire[i] = 0;
        }

        this.firePixels = fire;
    }

    createFireSource() {
        for (let column=0; column<this.columns; column++) {
            let pixelIndex = (this.columns * this.rows ) - this.columns + column;
            let maxIntencity = 36;
            this.firePixels[pixelIndex] = maxIntencity;
        }
    }

    createCanvas() {
        if (!this.canvasDrawn) {
            var canvas = document.createElement("canvas");
            canvas.id = "fire_canvas";
            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
            document.getElementById(this.elementID).appendChild(canvas);

            this.canvas = canvas;

            if (this.canvas.getContext) {
                this.ctx = this.canvas.getContext("2d");
            } else {
                console.error('Canvas sem contexto');
            }

            this.canvasDrawn = true;
        }
    }

    setBackground () {
        if (!this.debug) {
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect (0, 0, this.canvas.width, this.canvas.height);
        }
    }

    calculatePixelsIntencity () {
        let pixelIndex;
        for (let column=0; column<this.columns; column++) {
            
            for (let row=0; row<this.rows; row++) {
                pixelIndex = column + ( row * this.columns );
                this.updatePixelIntecity (pixelIndex) ;
                
            }
        }
	}
	
	updatePixelIntecity (pixelIndex)  {
		const belowPixelIndex = pixelIndex + this.columns;
        const belowPixelIntecity = this.firePixels[belowPixelIndex];

		if (belowPixelIndex >= this.rows * this.columns || belowPixelIntecity == 0) return;

		const decay = 1 + Math.floor(Math.random()*2);
		
		const intencity = belowPixelIntecity - decay > 0 ? belowPixelIntecity - decay : 0;
		
		this.firePixels[pixelIndex - Math.floor(Math.random()*2)] = intencity;
	}

    renderFire () {
        let offsetX = 0;
        let offsetY = 0;
        let pixel, pixelIndex;

        for (let row=0; row<this.rows; row++) {
            
            offsetY = this.pixelHeight * row;

            for (let column=0; column<this.columns; column++) {

                offsetX = this.pixelWidth*column;

                pixelIndex = column + ( row * this.columns );
                pixel = this.firePixels[pixelIndex];

                this.rederFirePixel(pixel, pixelIndex, offsetX, offsetY);
            }
        }
    }
    
    rederFirePixel (pixelIntencity, pixelIndex, offsetX, offsetY) {
        if (this.debug) {
            this.ctx.strokeStyle = "#000";
            this.ctx.strokeRect (offsetX, offsetY, this.pixelWidth, this.pixelHeight);

            //INTENCITY
            this.ctx.font = '16px sans-serif';
            this.ctx.fillStyle = '#000';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            this.ctx.fillText(pixelIntencity, offsetX+this.pixelWidth/2, offsetY+2+this.pixelHeight/2);

            //PIXEL INDEX
            this.ctx.font = '10px sans-serif';
            this.ctx.fillStyle = '#999';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'hanging';
    
            this.ctx.fillText(pixelIndex, offsetX+(this.pixelWidth-5), offsetY+5);
        } else {
			this.ctx.fillStyle = this.colorsPalette[pixelIntencity];
			this.ctx.fillRect (offsetX, offsetY, this.pixelWidth, this.pixelHeight);
        }
    }

    clear () {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height); 
    }

    draw () {
        this.clear();
        this.calculatePixelsIntencity();
        this.setBackground();
        this.renderFire();
		
		setTimeout((function () {
			window.requestAnimationFrame(this.draw.bind(this));
		}).bind(this), 1000/this.frameRate);
    }
}
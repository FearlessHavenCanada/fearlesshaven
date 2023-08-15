class ArtworkEditor {
    constructor(){

		console.log("Welcome to FearlessHaven!")

    	this.app = new PIXI.Application({ width: window.screen.width, height: window.screen.height, backgroundColor: 0xFFFFFF})
      	this.graphics = new PIXI.Graphics();
      	this.app.stage.addChild(this.graphics);
      
      	this.toolOverlay = new PIXI.Graphics();
      	this.app.stage.addChild(this.toolOverlay);

      	document.body.appendChild(this.app.view);

		this.currentTool = new LineTool(this.toolOverlay, this.graphics);
		this.mouseDown = false;
    }

	submit(app){
		const imageData = app.renderer.extract.base64(this.graphics);

		imageData.then(
			result => {
				console.log(imageData)

				fetch("/submitArtwork", {
					method: 'POST',
					headers: {
						'Content-Type': 'text/plain', // Set the content type to plain text
					},
					body: result,
				})
					.then(response => response.json())
					.then(data => {
						console.log('Response from server:', data);
					})
					.catch(error => {
						console.error('Error:', error);
					});
			},
			error => console.log(error)

		)
	}

    run(){


		var self = this;
		function onKeyDown(event) {
			if (event.key === 'd') {
				self.currentTool = new DrawTool(self.toolOverlay, self.graphics)
			} 
			else if (event.key === 'r') {
				self.currentTool = new RectTool(self.toolOverlay, self.graphics)
			}
			else if (event.key === 'l') {
				self.currentTool = new LineTool(self.toolOverlay, self.graphics)
			}
			else if (event.key === 'c') {
				self.currentTool = new CircleTool(self.toolOverlay, self.graphics)
			}
			else if (event.key === 's') {
				self.submit(self.app)
			}
		
			console.log(self.toolOverlay)
			self.toolOverlay.clear()


		
		}
		  
		  // Add key event listeners
		window.addEventListener('keydown', onKeyDown);
		  

		this.app.view.addEventListener('mousedown', event => { 
			const mouseX = event.clientX - this.app.view.getBoundingClientRect().left;
			const mouseY = event.clientY - this.app.view.getBoundingClientRect().top;
		
			this.currentTool.mouseDown(mouseX, mouseY);
		
			this.mouseDown = true; 
		});
		this.app.view.addEventListener('mouseup', event => { 
		
			const mouseX = event.clientX - this.app.view.getBoundingClientRect().left;
			const mouseY = event.clientY - this.app.view.getBoundingClientRect().top;
		
			this.currentTool.mouseUp(mouseX, mouseY);
		
			this.mouseDown = false;
		});
		this.app.view.addEventListener('mousemove', event => {
			if(this.mouseDown){
				const mouseX = event.clientX - this.app.view.getBoundingClientRect().left;
				const mouseY = event.clientY - this.app.view.getBoundingClientRect().top;
		
				this.currentTool.mouseMove(mouseX, mouseY);
		
			}
		
			
		});
    }
}

new ArtworkEditor().run()

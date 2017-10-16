(function() {
	'use strict';
	
	var Carousel = ctme.Carousel = function () { },
		caro = document.getElementById('opinions');
		
	Carousel.prototype.init = function() {
		var action = function() {

			var result = ctme.Helper.isInView(caro);
		
			if (result) {
				ctme.Carousel.opinions();
				window.removeEventListener('scroll', action);
			}			
		};

		window.addEventListener('scroll', action);
	};


	Carousel.prototype.opinions = function() {	
		var mySwiper = new Swiper (caro, {
			autoplay: true,
			loop: true,
			speed: 400
		});	
		
	};

	ctme.Carousel = new Carousel();	


}(window.ctme = window.ctme || {}));


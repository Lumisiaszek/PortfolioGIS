const coordsElement = document.getElementById('cursor-coords');
const contactLinks = document.querySelectorAll('.contacto-item, a');

window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  
  const splashAlreadyPlayed = sessionStorage.getItem('splashPlayed');

  if (splashAlreadyPlayed) {
    splash.style.display = 'none';
  } else {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.transition = 'opacity 0.8s ease';

      setTimeout(() => {
        splash.style.display = 'none';
        sessionStorage.setItem('splashPlayed', 'true');
      }, 800); 
      
    }, 1800); 
  }
});


document.addEventListener('mousemove', (e) => {
    coordsElement.style.display = 'block';
    coordsElement.style.left = `${e.clientX}px`;
    coordsElement.style.top = `${e.clientY}px`;

    const lat = (-27.4500 - (e.clientY / 10000)).toFixed(4);
    const lon = (-58.9800 + (e.clientX / 10000)).toFixed(4);
    
    coordsElement.innerText = `${lat}, ${lon}`;
});


contactLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        coordsElement.classList.add('active');
    });

    link.addEventListener('mouseleave', () => {
        coordsElement.classList.remove('active');
    });
});

document.addEventListener('mouseleave', () => {
    coordsElement.style.display = 'none';
});




class AccordionSlider {
	constructor() {
		this.slides = document.querySelectorAll(".slide");
		this.prevBtn = document.querySelector(".nav-prev");
		this.nextBtn = document.querySelector(".nav-next");
		this.currentIndex = -1;

		this.init();
	}

	init() {
		this.slides.forEach((slide, index) => {
			slide.addEventListener("click", () => this.setActiveSlide(index));
		});

		this.prevBtn.addEventListener("click", () => this.previousSlide());
		this.nextBtn.addEventListener("click", () => this.nextSlide());

		document.addEventListener("keydown", (e) => {
			if (e.key === "ArrowLeft") this.previousSlide();
			if (e.key === "ArrowRight") this.nextSlide();
		});
	}

	setActiveSlide(index) {
		if (this.currentIndex === index) {
			this.slides.forEach((slide) => slide.classList.remove("active"));
			this.currentIndex = -1;
		} else {
			this.slides.forEach((slide) => slide.classList.remove("active"));
			this.slides[index].classList.add("active");
			this.currentIndex = index;
		}
	}

	nextSlide() {
		const nextIndex =
			this.currentIndex === -1 ? 0 : (this.currentIndex + 1) % this.slides.length;
		this.setActiveSlide(nextIndex);
	}

	previousSlide() {
		const prevIndex =
			this.currentIndex === -1
				? this.slides.length - 1
				: (this.currentIndex - 1 + this.slides.length) % this.slides.length;
		this.setActiveSlide(prevIndex);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new AccordionSlider();
});





const btn = document.getElementById("btnArriba");

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

btn.onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' 
  });
};



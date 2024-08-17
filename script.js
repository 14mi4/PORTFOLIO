// script.js


// read more / close
function toggleText() {
  const hiddenText = document.querySelector(".hidden-text");
  const btnText = document.getElementById("toggleBtn");

  if (hiddenText.style.maxHeight) {
    hiddenText.style.maxHeight = null;
    btnText.textContent = "Read More";
  } else {
    hiddenText.style.maxHeight = hiddenText.scrollHeight + "px";
    btnText.textContent = "Close";
  }
}

// Back to top
document.addEventListener("DOMContentLoaded", function() {
  // Récupère le bouton et la section scrollable
  let backToTopBtn = document.getElementById("back-to-top");
  let projectsSection = document.getElementById("projects");

  // Vérifie si le bouton et la section ont bien été trouvés
  if (backToTopBtn && projectsSection) {
    // Affiche ou cache le bouton selon la position de défilement dans la section
    projectsSection.addEventListener("scroll", function() {
      if (projectsSection.scrollTop > 100) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    // Lorsque l'utilisateur clique sur le bouton, il remonte en haut de la section
    backToTopBtn.addEventListener("click", function(event) {
      event.preventDefault();
      projectsSection.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } else {
    console.error("Le bouton 'back-to-top' ou la section 'projects' n'ont pas été trouvés dans le DOM.");
  }
});




// Carousel
// DOM utility functions:

const el = (sel, par) => (par || document).querySelector(sel);
const els = (sel, par) => (par || document).querySelectorAll(sel);
const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);

// Helper functions:

const mod = (n, m) => (n % m + m) % m;

// Task: Carousel:

const carousel = (elCarousel) => {

  const animation = 500;
  const pause = 5000;

  const elCarouselSlider = el(".carousel-slider", elCarousel);
  const elsSlides = els(".carousel-slide", elCarouselSlider);
  const elsBtns = [];

  let itv; // Autoslide interval
  let tot = elsSlides.length; // Total slides
  let c = 0;

  if (tot < 2) return; // Not enough slides. Do nothing.

  // Methods:
  const anim = (ms = animation) => {
    const cMod = mod(c, tot);
    // Move slider
    elCarouselSlider.style.transitionDuration = `${ms}ms`;
    elCarouselSlider.style.transform = `translateX(${(-c - 1) * 100}%)`;
    // Handle active classes (slide and bullet)
    elsSlides.forEach((elSlide, i) => elSlide.classList.toggle("is-active", cMod === i));
    elsBtns.forEach((elBtn, i) => {
      elBtn.classList.toggle("is-active", cMod === i);
      elBtn.setAttribute('aria-disabled', cMod === i);
    });
  };

  const prev = () => {
    if (c <= -1) return; // prevent blanks on fast prev-click
    c -= 1;
    anim();
  };

  const next = () => {
    if (c >= tot) return; // prevent blanks on fast next-click
    c += 1;
    anim();
  };

  const goto = (index) => {
    c = index;
    anim();
  };

  const play = () => {
    elCarouselSlider.setAttribute("aria-live", "off");
    itv = setInterval(next, pause + animation);
  };

  const stop = () => {
    clearInterval(itv);
    elCarouselSlider.setAttribute("aria-live", "polite");
  };

  // Events:

  // Infinite slide effect:
  elCarouselSlider.addEventListener("transitionend", () => {
    if (c <= -1) c = tot - 1;
    if (c >= tot) c = 0;
    anim(0); // quickly switch to "c" slide (with animation duration 0)
  });

  // Change cursor based on hover position:
  elCarousel.addEventListener("mousemove", (event) => {
    const rect = elCarousel.getBoundingClientRect();
    const middleX = rect.width / 2;
    if (event.clientX - rect.left < middleX) {
      elCarousel.classList.add("left-hover");
      elCarousel.classList.remove("right-hover");
    } else {
      elCarousel.classList.add("right-hover");
      elCarousel.classList.remove("left-hover");
    }
  });

  // Change slide on click:
  elCarousel.addEventListener("click", (event) => {
    const rect = elCarousel.getBoundingClientRect();
    const middleX = rect.width / 2;
    if (event.clientX - rect.left < middleX) {
      prev();
    } else {
      next();
    }
  });

  // Pause on pointer enter:
  elCarousel.addEventListener("pointerenter", () => stop());
  elCarousel.addEventListener("pointerleave", () => play());

  // Pause on focus:
  elCarousel.addEventListener("focus", () => stop(), true);
  elCarousel.addEventListener("blur", () => play(), true);

  // Init:

  // Navigation bullets:

  const elNavigation = elNew("div", {
    className: "carousel-navigation",
    role: "group"
  });
  elNavigation.setAttribute("aria-label", "Choose slide to display");

  for (let i = 0; i < tot; i++) {
    const elBtn = elNew("button", {
      type: "button",
      className: "carousel-bullet",
      onclick: () => goto(i)
    });
    elBtn.setAttribute("aria-labelledby", `slide${i+1}`)
    elsBtns.push(elBtn);
  }

  // Insert bullets UI element:
  elNavigation.append(...elsBtns);
  elCarousel.append(elNavigation);

  // Clone first and last slides (for "infinite" slider effect)
  elCarouselSlider.prepend(elsSlides[tot - 1].cloneNode(true));
  elCarouselSlider.append(elsSlides[0].cloneNode(true));

  // Initial slide
  anim(0);

  // Start autoplay
  play();
};

// Allows to use multiple carousels on the same page:
els(".carousel").forEach(carousel);

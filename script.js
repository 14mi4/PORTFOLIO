
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

// back to top
document.addEventListener("DOMContentLoaded", function() {
  // bouton
  let backToTopBtn = document.getElementById("back-to-top");
  let projectsSection = document.getElementById("projects");

  if (backToTopBtn && projectsSection) {
    // show
    projectsSection.addEventListener("scroll", function() {
      if (projectsSection.scrollTop > 100) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    // function
    backToTopBtn.addEventListener("click", function(event) {
      event.preventDefault();
      projectsSection.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } else {
    console.error("Le bouton 'back-to-top' ou la section 'projects' n'ont pas été trouvés dans le DOM.");
  }
});


// carousel

// DOM
const el = (sel, par) => (par || document).querySelector(sel);
const els = (sel, par) => (par || document).querySelectorAll(sel);
const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);

// Hhlper
const mod = (n, m) => (n % m + m) % m;

// task
const carousel = (elCarousel) => {

  const animation = 500;
  const pause = 5000;

  const elCarouselSlider = el(".carousel-slider", elCarousel);
  const elsSlides = els(".carousel-slide", elCarouselSlider);
  const elsBtns = [];

  let itv; // autoslide interval
  let tot = elsSlides.length; // tptal slides
  let c = 0;

  if (tot < 2) return; // not enough slides -> do nothing.

  // methods
  const anim = (ms = animation) => {
    const cMod = mod(c, tot);
    // move slider
    elCarouselSlider.style.transitionDuration = `${ms}ms`;
    elCarouselSlider.style.transform = `translateX(${(-c - 1) * 100}%)`;
    // handle active classes (slide and bullet)
    elsSlides.forEach((elSlide, i) => elSlide.classList.toggle("is-active", cMod === i));
    elsBtns.forEach((elBtn, i) => {
      elBtn.classList.toggle("is-active", cMod === i);
      elBtn.setAttribute('aria-disabled', cMod === i);
    });
  };

  const prev = () => {
    if (c <= -1) return;
    c -= 1;
    anim();
  };

  const next = () => {
    if (c >= tot) return;
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

  // events:

  // infinite slide effect:
  elCarouselSlider.addEventListener("transitionend", () => {
    if (c <= -1) c = tot - 1;
    if (c >= tot) c = 0;
    anim(0);
  });

  // change cursor based on hover position:
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

  // change slide on click:
  elCarousel.addEventListener("click", (event) => {
    const rect = elCarousel.getBoundingClientRect();
    const middleX = rect.width / 2;
    if (event.clientX - rect.left < middleX) {
      prev();
    } else {
      next();
    }
  });

  // pause on pointer enter:
  elCarousel.addEventListener("pointerenter", () => stop());
  elCarousel.addEventListener("pointerleave", () => play());

  // pause on focus:
  elCarousel.addEventListener("focus", () => stop(), true);
  elCarousel.addEventListener("blur", () => play(), true);

  // init:

  // navigation bullets:
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

  // UI elements:
  elNavigation.append(...elsBtns);
  elCarousel.append(elNavigation);

  // clone first and last slides (for "infinite" slider effect)
  elCarouselSlider.prepend(elsSlides[tot - 1].cloneNode(true));
  elCarouselSlider.append(elsSlides[0].cloneNode(true));

  // initial slide
  anim(0);

  // start autoplay
  play();
};

// allows to use multiple carousels on the same page:
els(".carousel").forEach(carousel);

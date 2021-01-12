/*********
Global required variables: 
*********/
var galery = new Map();
var slideIndex = 1;

/*********
On ready-event IMPORTANT!
And resize event
*********/
$(document).ready(function () {
  // saveImgScales();
  // scaleImgHeight();
  videoHover();
  initHamburger();
  modifyPlaceholders();
  setupSlides();
});

window.onresize = function () {
  scaleImgHeight();
}

/*********
Image Scaling: 
*********/
function saveImgScales() {
  $('#galery').children().each(function () {
    galery.set(this, {
      width: $(this).width(),
      height: $(this).height()
    });
  });
}

function scaleImgHeight() {
  let size = $('#galery').width();
  let sizet = 0;
  let scale = [];
  $('#galery').children().each(function () {
    let width = galery.get(this).width;
    sizet += width;
    // console.log("i: " + sizet);
    if (sizet >= size) {
      // console.log(sizet);
      sizet = width;
      updateScale(scale);
      scale = [];
    }
    scale.push(this);
  });
  updateScale(scale);
}

function updateScale(scale) {
  let width = 0; // width of all unscaled images in one row
  scale.forEach(element => {
    let wid = galery.get(element).width;
    width += wid;
  });
  if (scale.length == 0) return;
  let height = galery.get(scale[0]).height; //Height of the individual images
  let gal_width = $('#galery').width();
  let ratio = height / width; // ratio of all the images together to the height
  let gal_ratio = height / gal_width; // ratio of the gallery
  let new_height = Math.floor(gal_width * ratio); // the updated height

  // console.log("Elements: " + scale.length + ", Width: " + width + ", Height: " + height + ", Ratio: " + ratio + ", GalRatio: " + gal_ratio + ", GalWidth: " + gal_width + ", NewHeight: " + new_height);

  let total = 0;
  scale.forEach(element => {
    let old_width = galery.get(element).width; // the width of each individual element
    let ind_ratio = old_width / height; // the ratio each element has

    let new_width = Math.floor(ind_ratio * new_height);

    $(element).width(new_width);
    $(element).height(new_height);
    total += new_width;
  });
  // console.log("1: " + total + ", compare: " + (total == gal_width));
  if (total != gal_width) {
    let difference = parseFloat((gal_width - total).toFixed(2));
    let adjust = difference / scale.length;
    // console.log("diff: " + difference);
    total = 0;
    scale.forEach(element => {
      let new_width = $(element).width() + adjust;
      $(element).width(new_width);
      total += new_width;
    });
    // console.log("2: " + total + ", compare: " + (total == gal_width));
  }
}

function getHeight(e) {
  let h = $(e).css('height');
  return parseInt(h.slice(0, h.length - 2));
}

function getWidth(e) {
  let w = $(e).css('width');
  return parseInt(w.slice(0, w.length - 2));
}

/*********
Video Play/Pause
*********/
function videoHover() {
  $('#galery video').each(
    function () {
      $(this).hover(
        function () {
          this.paused ? this.play() : this.pause();
        }
      )
    }
  )
}

/*********
Handle the below 680px Navbar hamburger:
*********/
function initHamburger() {
  const burger = $('nav .hamburger')
  let menuOpen = false;
  burger.click(function () {
    if (!menuOpen) {
      burger.addClass('open');
      menuOpen = true;
    } else {
      burger.removeClass('open');
      menuOpen = false;
    }
  })
}

/*********
Modify PlaceHolders:
*********/
function modifyPlaceholders() {
  $('.ph_my_age').each(function (i) {
    $(this).text(_calculateAge(new Date(2002, 03, 30)));
  })
  $('.ph_code_age').each(function (i) {
    $(this).text(_calculateAge(new Date(2018, 11, 29)));
  })
}

function _calculateAge(date) { // birthday is a date
  let ageDifMs = Date.now() - date.getTime();
  let ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/*********
Slideshow:
*********/

function setupSlides() {
  $('.slideshow-container').each(function () {
    let i = 0;
    let len = $(this).find('.mySlides').length;
    $(this).find('.mySlides').each(function (e) {
      i++;
      $(this).parent().parent().find('.dotainer').append(`<span class="dot" onclick="currentSlide(this, ${i})"></span>`);
      $(this).append(`<div class="numbertext">${i} / ${len}</div>`);
    });
  });
  document.querySelectorAll('.slideshow-loader').forEach(function (e) { showSlides(e, slideIndex) });
}

// Next/previous controls
function plusSlides(e, n) {
  showSlides(e, slideIndex += n);
}

// Thumbnail image controls
function currentSlide(e, n) {
  showSlides(e, slideIndex = n);
}

function showSlides(e, n) {
  let i;
  let slides = e.parentElement.parentElement.getElementsByClassName("mySlides");
  let dots = e.parentElement.parentElement.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
} 
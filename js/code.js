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
  initHamburger();
  modifyPlaceholders();
  setupSlides();
  addGaleryClick();
});

window.onresize = function () {
  if (isItSingleOpen()) {
    // console.log($('.it-article:visible').get(0).scrollHeight)
    $('.cover-background-it').each(function() {
      // console.log($(this).get(0))
      $(this).height($('.it-article:visible').get(0).scrollHeight);
    });
  } else if (isGallerySingleOpen()) {
      $('#cover-background-galery').height($('#galery-single-container').get(0).scrollHeight);
  }
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
  $('.ph_year').each(function (i) {
    $(this).text(new Date().getFullYear());
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

let gallery_single_arrow_cooldown = 0;
/*********
Art Portfolio Image:
*********/
function addGaleryClick() {
  let container = $('#galery-single-container');
  $('.galery-card').click(function() {
    container.css('display','inline');
    let el = $(this).children('img');
    let src = el.attr('src').replace('/preview', '').replace('_preview', '');
    openGalerySingle($(this).hasClass('galery-card-video'), src);
    lockScroll();
    $('.cover-background').height(container.get(0).scrollHeight);
    container.focus();
  })

  $('#galery-single-close').click(function() {
    closeContainer();
  })

  $('#galery-single-artist-name').click(function() {
    closeContainer();
  })

  container.keydown(function (evt) {//27
    if (evt.which === 27) {
      closeContainer()
    }
    if (evt.which === 39) { // ->
      switchGalerySingle(true);
    } else if (evt.which === 37) { // <-
      switchGalerySingle(false);
    }
  })
  //Swipeing:
  let initialX = 0;
  let initialY = 0;
  let moveX = 0;
  let moveY = 0;

  container.on('touchstart', evt => {
    initialX = evt.touches[0].pageX;
    initialY = evt.touches[0].pageY;
  });

  container.on('touchmove', evt => {
    let currentX = evt.touches[0].pageX;
    let currentY = evt.touches[0].pageY;
    moveX = currentX - initialX;
    moveY = currentY - initialY;
  });

  container.on('touchend', evt => {
    if (moveY < 100 && moveY > -100) {
      if (moveX < -100) { // <-
        switchGalerySingle(true);
      } else if (moveX > 100) { // ->
        switchGalerySingle(false);
      }
    }
  });
}

function switchGalerySingle(right) {
  if (isGallerySingleOpen()) {
    let src = $('.galery-single').attr('src');
    let el_count = $('#galery').children().length - 1;
    let id = parseInt(src.match('(?<=portfolio_).+?(?=[\_.])')[0]);
    let id_next;
    if (gallery_single_arrow_cooldown < Date.now()) {
       if (right) { // ->
        id_next = id + 1;
        if (id_next > el_count) id_next = 1;
        $(`#galery-card-${id_next}`).hasClass('galery-card-video')
        removeGalleryInfo();
        openGalerySingle($(`#galery-card-${id_next}`).hasClass('galery-card-video'), 
        src.replace(id, id_next))
      } else if (!right) { // <-
        id_next = id - 1;
        if (id_next < 1) id_next = el_count;
        removeGalleryInfo();
        openGalerySingle($(`#galery-card-${id_next}`).hasClass('galery-card-video'),
        src.replace(id, id_next))
      }
      gallery_single_arrow_cooldown = Date.now() + 300; //0.3 second cooldown for the arrows.
    }
  }
}

function openGalerySingle(isVideo, src) {
  let container = $('#galery-single-container');
  if (isVideo) {
    container.append(`<video src="${src.replace('png', 'webm')}" 
    class="galery-single galery-single-video" loop autoplay></video>`)[0];
    $('.galery-single-video').get(0).load();
    $('.galery-single-video').ready(function () {
      document.querySelector('.galery-single-video').play();
    })
  } else {
    container.append(`<img src="${src.replace('webm', 'png')}" class="galery-single galery-single-img"></img>`); 
  }
  // Add the additional information
  let id = src.match('(?<=portfolio_).+?(?=[\_.])')[0];
  // console.log(id)
  container.append(`<h3 class=galery-single-title>
    ${$(`#galery-card-${id} .galery-card-title`).get(0).innerHTML}</h3>`);
}

function isGallerySingleOpen() {
  return $('#galery-single-container:visible').length > 0;
}

function closeContainer() {
  unlockScroll();
  $('#galery-single-container').css('display','none');
  $('.it-article').css('display','none');
  removeGalleryInfo();
  $('.cover-background').each(function() {
    $(this).height('1vh');
  });
}

function removeGalleryInfo() {
  $('.galery-single').remove();
  $('.galery-single-title').remove();
}

function openItExperienceSingle(event) {
  if (!event) {
    event = window.event;
  };
  var el = (event.target || event.srcElement);
  //get the article:
  var art = $(el.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[3]);
  lockScroll();
  art.css('display','inline');
  art.focus();
  $('.cover-background-it').each(function() {
    $(this).height(art.get(0).scrollHeight);
  });

  art.keydown(function (evt) {//27
    if (evt.which === 27) {
      closeContainer();
    }
  });
  $(art.get(0)).find('.cover-background-it').click(function (evt) {
    closeContainer();
  });
}

function isItSingleOpen() {
  return $('.it-article:visible').length > 0;
}

function lockScroll () {
  // lock scroll position, but retain settings for later
  var scrollPosition = [
    self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
    self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
  ];
  var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
  html.data('scroll-position', scrollPosition);
  html.data('previous-overflow', html.css('overflow'));
  html.css('overflow', 'hidden');
  window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

function unlockScroll() {
  // un-lock scroll position
  var html = jQuery('html');
  var scrollPosition = html.data('scroll-position');
  html.css('overflow', html.data('previous-overflow'));
  window.scrollTo(scrollPosition[0], scrollPosition[1])
}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  let totop = document.getElementById("totop");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    totop.style.display = "block";
  } else {
    totop.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  if (isGallerySingleOpen()) {
    document.querySelector('#galery-single-container').scrollTop = 0;
    $('#galery-single-container').focus();
  } else if (isItSingleOpen()) {
    $('.it-article').each(function() {
      if ($(this).css('display') === 'inline') {
        $(this).scrollTop(0);
        $(this).focus();
      }
    });
  } else {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
} 
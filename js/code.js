/*********
Global required variables: 
*********/
var gallery = new Map();
var slideIndex = 1;
var menuOpen = false;

/*********
On ready-event IMPORTANT!
And resize event
*********/
$(document).ready(function () {
  initHamburger();
  modifyPlaceholders();
  setupSlides();
  addGalleryClick();
  addSettingsClick();
  loadTheme();
});

window.onresize = function () {
  if (isItSingleOpen()) {
    // console.log($('.it-article:visible').get(0).scrollHeight)
    $('.cover-background-it').each(function() {
      // console.log($(this).get(0))
      $(this).height($('.it-article:visible').get(0).scrollHeight);
    });
  } else if (isGallerySingleOpen()) {
      $('#cover-background-gallery').height($('#gallery-single-container').get(0).scrollHeight);
  }
}

/*********
Handle the below 680px Navbar hamburger:
*********/
function initHamburger() {
  const burger = $('nav .hamburger')
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
function addGalleryClick() {
  let container = $('#gallery-single-container');
  $('.gallery-card').click(function() {
    container.css('display','inline');
    let el = $(this).children('img');
    let src = el.attr('src').replace('/preview', '').replace('_preview', '');
    opengallerySingle($(this).hasClass('gallery-card-video'), src);
    lockScroll();
    $('.cover-background').height(container.get(0).scrollHeight);
    container.focus();
  })

  $('#gallery-single-close').click(function() {
    closeContainer();
  })

  $('#gallery-single-artist-name').click(function() {
    closeContainer();
  })

  container.keydown(function (evt) {//27
    if (evt.which === 27) {
      closeContainer()
    }
    if (evt.which === 39) { // ->
      switchgallerySingle(true);
    } else if (evt.which === 37) { // <-
      switchgallerySingle(false);
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
        switchgallerySingle(true);
      } else if (moveX > 100) { // ->
        switchgallerySingle(false);
      }
    }
  });
}

function switchgallerySingle(right) {
  if (isGallerySingleOpen()) {
    let src = $('.gallery-single').attr('src');
    if (src === undefined) {
      src = $($('.gallery-single source')[1]).attr('src');
    }
    let el_count = $('#gallery').children().length - 1;
    let id = parseInt(src.match('(?<=portfolio_).+?(?=[\_.])')[0]);
    let id_next;
    if (gallery_single_arrow_cooldown < Date.now()) {
       if (right) { // ->
        id_next = id + 1;
        if (id_next > el_count) id_next = 1;
        $(`#gallery-card-${id_next}`).hasClass('gallery-card-video')
        removeGalleryInfo();
        opengallerySingle($(`#gallery-card-${id_next}`).hasClass('gallery-card-video'), 
        src.replace(id, id_next))
      } else if (!right) { // <-
        id_next = id - 1;
        if (id_next < 1) id_next = el_count;
        removeGalleryInfo();
        opengallerySingle($(`#gallery-card-${id_next}`).hasClass('gallery-card-video'),
        src.replace(id, id_next))
      }
      gallery_single_arrow_cooldown = Date.now() + 300; //0.3 second cooldown for the arrows.
    }
  }
}

function opengallerySingle(isVideo, src) {
  let container = $('#gallery-single-container');
  if (isVideo) {
    container.append(`<video controls class="gallery-single gallery-single-video" loop autoplay>
      <source src="${src.replace('png', 'mv4')}" type='video/webm' codecs="H.264 (x264)">
      <source src="${src.replace('png', 'webm')}" type='video/mp4' codecs="vp9">
    </video>`)[0];
    $('.gallery-single-video').get(0).load();
    $('.gallery-single-video').ready(function () {
      document.querySelector('.gallery-single-video').play();
    })
  } else {
    container.append(`<img src="${src.replace('webm', 'png')}" class="gallery-single gallery-single-img"></img>`); 
  }

  //Set the background to default height
  $('#cover-background-gallery').css('height', '100vh');

  // Add the additional information
  let id = src.match('(?<=portfolio_).+?(?=[\_.])')[0]; //get the id
  container.append(`<h3 class=gallery-single-title>
    ${$(`#gallery-card-${id} .gallery-card-title`).get(0).innerHTML}</h3>`); //title
  container.find('.gallery-single-txt').remove(); //remove previous texts
  
  container.find('#gallery-single-txt-pointer').remove(); //remove scroll down button
  if ($(`#gallery-card-${id} .gallery-single-txt`).length != 0) { //add scroll down button
    container.append(
      '<a id="gallery-single-txt-pointer""><i class="fas fa-arrow-circle-down"></i></a>')
    $('#gallery-single-txt-pointer').click(function() {
      bottomFunction();
      setTimeout(function() {
        container.focus(); //give the new scroll button a click event to focus the main container again (arrow buttons)
      }, 100);
    });
  }
  $(`#gallery-card-${id} .gallery-single-txt`).clone().appendTo(container).toggleClass('hidden'); //add text
  $(`#gallery-single-container .gallery-single-txt .gallery-single-txt-header`)
    .removeClass('gallery-single-txt-header').attr('id', 'gallery-single-txt-header'); //remove class & add id (anchor)
  $('#cover-background-gallery').css('height', container.get(0).scrollHeight); //set the scroll to needed value
}

function isGallerySingleOpen() {
  return $('#gallery-single-container:visible').length > 0;
}

function closeContainer() {
  unlockScroll();
  $('#gallery-single-container').css('display','none');
  $('.it-article').css('display','none');
  removeGalleryInfo();
  $('.cover-background').each(function() {
    $(this).height('1vh');
  });
}

function removeGalleryInfo() {
  $('.gallery-single').remove();
  $('.gallery-single-title').remove();
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
document.addEventListener('scroll', function (event) {
  scrollFunction();
}, true /*Capture event*/);

function scrollFunction() {
  let totop = document.getElementById("totop");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    totop.style.display = "block";
  } else {
    totop.style.display = "none";
  }
  if (isGallerySingleOpen()) {
    let container = $('#gallery-single-container');
    if (container.scrollTop() > 20) {
      totop.style.display = "block";
    } else {
      totop.style.display = "none";
    }
  } else if (isItSingleOpen()) {
    let container = $('.it-article:visible');
    if (container.scrollTop() > 20) {
      totop.style.display = "block";
    } else {
      totop.style.display = "none";
    }
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  if (isGallerySingleOpen()) {
    document.querySelector('#gallery-single-container').scrollTop = 0;
    $('#gallery-single-container').focus();
  } else if (isItSingleOpen()) {
    $('.it-article:visible').get(0).scrollTop = 0;
    $('.it-article:visible').focus();
  } else {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}

function bottomFunction() {
  if (isGallerySingleOpen()) {
    console.log('x')
    $('#gallery-single-container').animate({ scrollTop: $('#gallery-single-container').height() }, 200);
  }
}

/*******
Settings
*******/

function addSettingsClick() {
  let body = $('body');
  $('.settings').click(function() {
    if ($(this).hasClass('setting-open')) {
      $(this).removeClass('setting-open');
      $(this).addClass('setting-close');
    } else if ($(this).hasClass('setting-close')) {
      $(this).removeClass('setting-close');
      $(this).addClass('setting-open');
    } else {
      $(this).addClass('setting-open');
    }
    $(this).parent().find('.settings-dropdown').toggleClass('hidden');
    $(this).parent().find('.settings-dropdown').focus();
    $('nav .hamburger').removeClass('open');
    menuOpen = false;
  });
  $('#themes').click(function() {
    let icon = $(this).find('.fas');
    if (icon.hasClass('fa-moon')) {
      icon.removeClass('fa-moon');
      icon.addClass('fa-sun');
      body.removeClass('dark');
      body.addClass('light');
      localStorage.setItem('theme', 'light');
    } else if (icon.hasClass('fa-sun')) {
      icon.removeClass('fa-sun');
      icon.addClass('fa-moon');
      body.removeClass('light');
      body.addClass('dark');
      localStorage.setItem('theme', 'dark');
    }
  });
  $('#animations').click(function() {
    let icon = $(this).find('.fas');
    if (icon.hasClass('fa-play')) {
      icon.removeClass('fa-play');
      icon.addClass('fa-pause');
      localStorage.setItem('animations', 'false');
      $('video').each(function() {
        this.pause();
      });
      body.toggleClass('pauseanim');
    } else if (icon.hasClass('fa-pause')) {
      icon.removeClass('fa-pause');
      icon.addClass('fa-play');
      localStorage.setItem('animations', 'true');
      $('video').each(function() {
        this.play();
      });
      body.toggleClass('pauseanim');
    }
  });
  $(document).mousedown(function(evt) {
    let gear = $('.settings');
    let settings = $('.settings-dropdown');
    if ((!settings.is(evt.target) && settings.has(evt.target).length === 0)
    && (!gear.is(evt.target) && gear.has(evt.target).length === 0)) {
      $('.settings').removeClass('setting-open');
    $('.settings').addClass('setting-close');
    $('.settings-dropdown').addClass('hidden');
    }
  })
}

function loadTheme() {
  let body = $('body');
  let icon = $('#themes .fas');
  if (localStorage.getItem('theme') === 'light') {
    body.addClass('light');
    icon.removeClass('fa-moon');
    icon.addClass('fa-sun');
  } else {
    body.addClass('dark');
  }
  //Animation Setting too in here
  if (localStorage.getItem('animations') === 'false') {
    icon = $('#animations .fas');
    icon.removeClass('fa-play');
    icon.addClass('fa-pause');
    $('video').each(function() {
      this.pause();
    });
    body.toggleClass('pauseanim');
  }
  
}
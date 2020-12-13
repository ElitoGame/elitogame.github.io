var galery = new Map();
$(document).ready(function(){
  saveImgScales();
  scaleImgHeight();
});

window.onresize =  function(){
  scaleImgHeight();
}

function saveImgScales() {
  $('#galery').children().each(function () {
    galery.set( this, {
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
  let height = galery.get(scale[0]).height; //Height of the individual images
  let gal_width = $('#galery').width();
  let ratio =  height / width; // ratio of all the images together to the height
  let gal_ratio =  height / gal_width; // ratio of the gallery
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
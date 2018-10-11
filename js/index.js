$(document).ready(function() {
  initTabs();
  setSharpOrFlat(getChordRoot());
  var deferred = loadDropDowns(); // fetch JSON data
  $.when(deferred).done(function() { // wait until dropdowns are loaded
    update();
  });
});

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


function initTabs() {
  // get element from CSS
  var element = document.getElementById('tab-block'),
    style = window.getComputedStyle(element),
    width = style.getPropertyValue('width');

  var tabWrapper = $('#tab-block'),
    tabMnu = tabWrapper.find('.tab-mnu  li'),
    tabContent = tabWrapper.find('.tab-cont > .tab-pane');

  tabContent.not(':first-child').hide();

  tabMnu.each(function(i) {
    $(this).attr('data-tab', 'tab' + i);
  });
  tabContent.each(function(i) {
    $(this).attr('data-tab', 'tab' + i);
  });

  tabMnu.click(function() {
    var tabData = $(this).data('tab');
    tabWrapper.find(tabContent).hide();
    tabWrapper.find(tabContent).filter('[data-tab=' + tabData + ']').show();
  });

  $('.tab-mnu > li').click(function() {
    var before = $('.tab-mnu li.active');
    before.removeClass('active');
    $(this).addClass('active');
  });
}

function loadDropDowns(){
	return $.getJSON("datajson/data.json", function(data) {
		var vals = [];
    vals = data.info;

		var $secondChoice = $("#scale");
		$secondChoice.empty();
		$.each(vals, function(index, value) {
        $secondChoice.append("<option value=" + value.scale + ">" + value.description + "</option>");
		});
    $('#scale').attr('selectedIndex', 0);
	});
}

function printCanvas() {
  var canvas = document.getElementById("canvasAll");
  var image = canvas.toDataURL();

  // to set background pixels to white in PDF
  // var ctx = canvas.getContext('2d');
  // var imgData=ctx.getImageData(0,0,canvas.width,canvas.height);
  // var data=imgData.data;
  // for(var i=0;i<data.length;i+=4){
  //     if(data[i+3]<255){
  //         data[i]=255;
  //         data[i+1]=255;
  //         data[i+2]=255;
  //         data[i+3]=255;
  //     }
  // }
  // ctx.putImageData(imgData,0,0);
  var ImgPDF = canvas.toDataURL("image/jpeg", 1.0);

  var pdf = new jsPDF();
  pdf.addImage(ImgPDF, 'JPEG', 0, 0);
  pdf.addPage();
  pdf.text(20, 20, 'Do you like that?');

  pdf.save("download.pdf");

  w=window.open(image, '_blank');
  w.focus();
}

function getScaleDegrees(){
  var z = document.getElementById("scale");
  if (z.selectedIndex == 0)
    return value = z.options[0].value;
  else
    return value = z.options[z.selectedIndex].value;
}

function getScaleLabel(){
  var z = document.getElementById("scale");
  if (z.selectedIndex == 0)
    return value = z.options[0].label;
  else
    return value = z.options[z.selectedIndex].label;
}

function getChordRoot(){
  var z = document.getElementById("chordroot");
  return rootIndex = Number(z.options[z.selectedIndex].value) - 1;
}

function getChordLabel(canvasname, rootIndex, degree){
  var scaleRoot = getChordRoot();
  var keyNotes = getScaleArray(getScaleDegrees());
  var scaleRootNoteName = DictionaryNoteName[scaleRoot]; //C - 0

  if (scaleRootNoteName.length == 1) //is scale root
    column = 2;
  else {
    if (getSharpFlat() == "sharp")
      column = 3;
    else
      column = 1;
  }

  for (var f = 0; f < NoteValue.length; f++) {
    if ((scaleRoot + 1) == NoteValue[f][column])
      scalerootrow = f;
  }
  degreerootrow = scalerootrow + degree;
  if (degreerootrow > 6) degreerootrow -= 7;

  for (var g = 0; g < 5; g++) {
    if ((rootIndex + 1) == NoteValue[degreerootrow][g])
      degreecolumn = g;
  }

  return Notes[degreerootrow][degreecolumn];
}

function updateTabLabel(degree, rootLabel, scaleLabel) {
  var tabNum = Number(degree+1)
  var tabID = "tab" + tabNum;

  if (degree == KeyTab)
    document.getElementById("tab8").innerHTML = scaleLabel;
  else
    document.getElementById(tabID).innerHTML = "(" + tabNum + ") " + rootLabel + scaleLabel;

  // var symbol = ""; //TODO substitute flat and sharp characters
  // if (rootLabel[1] == "b")
  //   symbol = "&#9837";
  // if (rootLabel[1] == "#")
  //   symbol = "&#9839";
  //document.getElementById(tabID).innerHTML = tabNum + "-" + rootLabel[0] + symbol + scaleLabel;
}

function getScaleIndex(){
  var z = document.getElementById("scale");
  return scaleIndex = Number(z.options[z.selectedIndex].value) - 1;
}

// function getScaleLabel(scaleIndex = 0){
//   var z = document.getElementById("scale");
//   return scaleLabel = z.options[scaleIndex].label;
// }

function getScaleArray(scalestring){
  //cast as a Number?
  return scale = scalestring.toString().split(",");
  //return scale = scalestring.toString().split(",");map(function(t){return parseInt(t)});
}

function getSharpFlat(){
  var z = document.getElementById("sharpOrFlat");

  if (Number(z.options[z.selectedIndex].value) == 1)
    return sharporflat = "sharp";
  else
    return sharporflat = "flat";
}

function getNoteDegree(){
  var z = document.getElementById("nameOrDegree");

  if (Number(z.options[z.selectedIndex].value) == 1)
    return noteordegree = "sharp";
  else
    return noteordegree = "degree";
}

function getTuning(){
  var z = document.getElementById("tuning");
  var selTuning = Number(z.options[z.selectedIndex].value);
  if (selTuning == 2)
    return Tuning = [5, 12, 8, 3, 10, 3];
  else
    return Tuning = [5, 12, 8, 3, 10, 5];
}

function getRatio(){
  var z = document.getElementById("size");
  return ratio = Number(z.options[z.selectedIndex].value);
}

function getWindowWidth(){
  return window.innerWidth;
}

function calcChord(scalestring, degree) {
  var keyNotes = getScaleArray(scalestring);

  var len = keyNotes.length - 1; // = [0,2,4,5,7,9,11];
  var add3 = 0;
  var add5 = 0;
  var add7 = 0;
  if (degree + 2 > len) {
    var val3 = degree - 5;
    add3 = 12;
  }
  else
    var val3 = degree + 2;
  if (degree + 4 > len) {
    var val5 = degree - 3;
    add5 = 12;
  }
  else
    var val5 = degree + 4;
  if (degree + 6 > len) {
    var val7 = degree - 1;
    add7 = 12;
  }
  else
    var val7 = degree + 6;

  var root = Number(scale[degree]);
  var third = Number(scale[val3]) + add3;
  var fifth = Number(scale[val5]) + add5;
  var seventh= Number(scale[val7]) + add7;

  // TODO: calculate using Intervals[] and IntervalValue[]
  // if (third - root == 4){
  //   if (fifth - third == 4)
  //     return scale = 3;
  //   else
  //     return scale = 0;
  // }
  // if (third - root == 3) {
  //   if (fifth - third == 4)
  //     return scale = 1;
  //   else
  //     return scale = 2;
  // }

  // if (third - root == 4){
  //   if (seventh - fifth == 4)
  //     return scale = 4; // MM7
  //   else
  //     return scale = 5; //Mm7
  // }
  // if (third - root == 3) {
  //   if (fifth - third == 4)
  //     return scale = 6; //mm7
  //   else
  //     return scale = 7; //dim7
  // }

  if (third - root == 3) var str3 = "b3";
  if (third - root == 4) var str3 = "3";

  if (str3 == "b3" && fifth - third == 3) var str5 = "b5";
  if (str3 == "b3" && fifth - third == 4) var str5 = "5";
  if (str3 == "3" && fifth - third == 3) var str5 = "5";
  if (str3 == "3" && fifth - third == 4) var str5 = "#5";

  if (str5 == "b5" && seventh - fifth == 3) var str7 = "bb7";
  if (str5 == "b5" && seventh - fifth == 4) var str7 = "b7";
  if (str5 == "5" && seventh - fifth == 3) var str7 = "b7";
  if (str5 == "5" && seventh - fifth == 4) var str7 = "7";
  if (str5 == "#5" && seventh - fifth == 2) var str7 = "b7";
  if (str5 == "#5" && seventh - fifth == 3) var str7 = "7";

  var scaleStr = "1," + str3 + "," + str5; // + "," + str7;
  //alert(scaleStr);
  return scaleStr;
}

function calcScale(scalestring) {
  // May be wrong approach (specifying interval values in DDL)
  // Consider giving scale degree data instead (1,2,3,#4,5,6,7), may be easier to derive intervals
  var keyNotes = getScaleArray(scalestring);
  var root = Number(keyNotes[0]);
  var second = Number(keyNotes[1]);
  var third = Number(keyNotes[2]);
  var fourth = Number(keyNotes[3]);
  var fifth = Number(keyNotes[4]);
  var sixth = Number(keyNotes[5]);
  var seventh = Number(keyNotes[6]);

  // var Intervals = ["1", "#1", "b2", "2", "#2", "b3", "3", "4", "#4", "b5", "5", "#5", "b6", "6", "#6", "bb7", "b7", "7"];
  // var IntervalValue = [0, 1, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 8, 9, 10, 9, 10, 11];
  var scaleStr="";
  for (var q = 0; q < keyNotes.length; q++) {
    for (var z = 0; z < Intervals.length; z++) { // Extension above root
      if ((IntervalValue[z] == keyNotes[q]) && (Number(Intervals[z].replace(/\D/g,'')) == q + 1)) {
        var extension = IntervalValue[z];
        var degree = q; // replace() to remove non-numeric chars
        var degreestr = Intervals[z];
        var notelabel = degreestr;
        break;
      }
    }

    scaleStr += notelabel + (q < keyNotes.length - 1 ? "," : "");
  }

  return scaleStr;
}

function setSharpOrFlat(index){
  if ([0, 2, 4, 6, 7, 9, 11].indexOf(index) >= 0)
    document.getElementById("sharpOrFlat").value = 1;
  else // Flat keys - F, Bb, Eb, Ab, Db
    document.getElementById("sharpOrFlat").value = 2;

  if ([0, 2, 4, 5, 7, 9, 11].indexOf(index) >= 0) // Natural Notes
    $("#sharpOrFlat").hide();
  else
    $("#sharpOrFlat").show();
}

function update() {
  Tuning = getTuning();
  updateSize();
  drawall(getChordRoot());
}

function updateSize() {
  // to resize Tabs - need to remove offset
  // $('<style>.tab-block {width: ' + getRatio() + '%;} input::-webkit-outer-spin-button: {display: none;}</style>')
  // .appendTo('head');
  $('<style>.tab-mnu {width: ' + getRatio() + '%; margin: auto;}</style>')
  .appendTo('head');
}

function updateKey() {
  //  var tabWrapper = $('#tab-block'),
  //    tabContent = tabWrapper.find('.tab-cont > .tab-pane');
  //
  // tabContent.not(':first-child').hide();
  // tabWrapper.find(tabContent).hide();
  // tabWrapper.find(tabContent).filter('[data-tab=tab0]').show();
  //
  // // to reset focus to First tab
  // var before = $('.tab-mnu li.active');
  // before.removeClass('active');
  // var after = $('.tab-mnu :first');
  // after.addClass('active');

  setSharpOrFlat(getChordRoot());
  update();
}

function drawall(scaleRoot) {
  var scalestring = getScaleDegrees();
  var keyNotes = getScaleArray(scalestring);

  for (var i = 0; i < keyNotes.length; i++) {
      var canvasname = "canvas" + (i+1);
      var degree = i;
      var root = getRoot(scaleRoot, scalestring, i);
      var scale = calcChord(scalestring, i);
      draw(canvasname, root, scale, degree);
      //draw(canvasname, root, scale, degree, true); // print
  }

  //var scale = getScaleArray(getScaleDegrees());
  var scale = calcScale(scalestring);

  drawKey("canvas8", scaleRoot, scale, KeyTab);
  drawprintcanvas();
}

function drawKey(canvasname, rootIndex, scaleIndex, degree) {
  var canvas = document.getElementById(canvasname);
  var canvasWidth = getWindowWidth(); //window.innerWidth;
  var numfrets = 13;
  var numstrings = 1;

  var margin = (canvasWidth * MarginPct);
  var strLen = (canvasWidth - margin) * ratio / 100;
  var offset = ((canvasWidth - margin) * (100 - ratio) / 100) / 2;

  var normalfw = strLen / NumFrets; // fret width; 16=num frets
  var fw = strLen / 13; // fret width; 16=num frets
  var fh = normalfw * FretHeightToWidthRatio;
  var canvasHeight = fh * (NumStrings + 1); // + top + bot;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    var x = (margin/2) + offset;
    var y = fh;

    // frets
    line(canvasname, x + fw, y/2 + 0, x + fw, y/2 + fh, 6);
    for (ab = 1; ab <= 12; ab++) {
        line(canvasname, x + (fw * ab), y/2 + 0, x + (fw * ab), y/2 + fh, 1);
    }
    // strings
    for (ab = 0; ab < 1; ab++) {
      line(canvasname, x, y + fh * ab, x + strLen, y + fh * ab, ab + 1, true);
    }

    labelfrets(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset, numfrets);
    labelscale(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset, numfrets);
    labelstrings(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset, numstrings);
    getnotes(canvasname, canvasWidth, canvasHeight, rootIndex, scaleIndex, degree, strLen, fw, fh, margin, offset, numstrings, numfrets);
  }
}

function drawprintcanvas() {
  var canvasWidth = getWindowWidth(); //window.innerWidth;
  //var margin = 0;
  var strLen = canvasWidth;
  var fw = strLen / NumFrets; // fret width; 16=num frets
  var fh = fw * FretHeightToWidthRatio;
  var canvasHeight = fh * (NumStrings + 1); // + top + bot;
  var canvasAll = document.getElementById("canvasAll");
  var spacer = fh * 1.8;
  canvasAll.width = canvasWidth;
  canvasAll.height = (canvasHeight * 4) + (spacer * 3);
  var ctxA = canvasAll.getContext('2d');

  var can1 = document.getElementById("canvas1");
  var can2 = document.getElementById("canvas2");
  var can3 = document.getElementById("canvas3");
  var can4 = document.getElementById("canvas4");
  // Page 2
  // var can5 = document.getElementById("canvas5");
  // var can6 = document.getElementById("canvas6");
  // var can7 = document.getElementById("canvas7");

  ctxA.drawImage(can1, 0, 0);
  ctxA.drawImage(can2, 0, canvasHeight + spacer);
  ctxA.drawImage(can3, 0, (canvasHeight + spacer) * 2);
  ctxA.drawImage(can4, 0, (canvasHeight + spacer) * 3);
  // Page 2
  // ctxA.drawImage(can5, 0, (canvasHeight + spacer) * 4);
  // ctxA.drawImage(can6, 0, (canvasHeight + spacer) * 5);
  // ctxA.drawImage(can7, 0, (canvasHeight + spacer) * 6);

}

function getRoot(scaleRoot, scalestring, i) {
  var scale = getScaleArray(scalestring);
  var degree = Number(scale[i]);
  var noteVal = scaleRoot + degree;
  if (noteVal > 11)
    noteVal -= 12;

  return noteVal;
}

function draw(canvasname, rootIndex, scaleIndex, degree, isPrint=false) {
  var canvas = document.getElementById(canvasname);
  var ratio = getRatio();
  var canvasWidth = getWindowWidth(); //window.innerWidth;

  if (isPrint)
  {
    var margin = 0;
    var strLen = canvasWidth;
    var offset = 0;
  }
  else
  {
    var margin = (canvasWidth * MarginPct);
    var strLen = (canvasWidth - margin) * ratio / 100;
    var offset = ((canvasWidth - margin) * (100 - ratio) / 100) / 2;
  }
  var fw = strLen / NumFrets; // fret width; 16=num frets
  var fh = fw * FretHeightToWidthRatio;
  var canvasHeight = fh * (NumStrings + 1); // + top + bot;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawstrings(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset);
    labelfrets(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset);
    labelstrings(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset);
    getnotes(canvasname, canvasWidth, canvasHeight, rootIndex, scaleIndex, degree, strLen, fw, fh, margin, offset);
  }
}

function line(canvasname, startx, starty, endx, endy, width, isString) {
  var canvas = document.getElementById(canvasname);

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    ctx.lineWidth = width;
    if (isString)
      ctx.strokeStyle = "#E7BE8E"; // color strings
    else
      ctx.strokeStyle = "#8CA2A7"; // color frets
    ctx.beginPath();
    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
    ctx.closePath();
    ctx.stroke();
  }
}

function circle(canvasname, startx, starty, width, height, isFret, isRoot) {
  var canvas = document.getElementById(canvasname);

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    if (isRoot) {
      // b was passed and has truthy value
      var color = "grey";
    } else {
      // b was not passed or has falsy value
      var color = "black";
    }

    if (isFret)
      var color = "#92C5E2";

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(startx, starty, width, height, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
}

function drawstrings(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset) {
  var x = (margin/2) + offset;
  var y = fh;

  // frets
  line(canvasname, x + fw, y + 0, x + fw, y + fh * (NumStrings-1), 6);
  for (ab = 1; ab <= NumFrets; ab++) {
      line(canvasname, x + (fw * ab), y + 0, x + (fw * ab), y + fh * (NumStrings-1), 1);
  }
  // strings
  for (ab = 0; ab < NumStrings; ab++) {
    line(canvasname, x, y + fh * ab, x + strLen, y + fh * ab, ab + 1, true);
  }
  // capo
  if (Capo1.indexOf(getChordRoot() + 1) > -1)
    line(canvasname, x + fw + fw/2, y - fh/2, x + fw + fw/2, y + fh * (NumStrings-1) + fh/2, 20);
  if (Capo2.indexOf(getChordRoot() + 1) > -1)
    line(canvasname, x + fw*2 + fw/2, y - fh/2, x + fw*2 + fw/2, y + fh * (NumStrings-1) + fh/2, 20);
}

function labelfrets(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset, numfrets=NumFrets) {
  var width = fh / 5; //7;
  var x = (margin/2) + (fw/2) + offset;
  var y = (fh / 4);

  // draw all notes later
  for (ab = 0; ab < numfrets; ab++) {
    //if (ab == 3 || ab == 5 || ab == 7 || ab == 9 || ab == 15)
    if ([3, 5, 7, 9, 15].indexOf(ab) >= 0)
      circle(canvasname, x + ab * fw, y, width, 0, true);

    if (ab == 12) {
      circle(canvasname, x + ab * fw - (width + 2), y, width, 0, true);
      circle(canvasname, x + ab * fw + (width + 2), y, width, 0, true);
    }

    shownums(canvasname, canvasWidth, ab, ab, fw, fh, x);
  }
}

function labelscale(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset, numfrets=NumFrets) {
  var width = fh / 5; //7;
  var x = (margin/2) + (fw/2) + offset;

  var scaleStr = "R,b2,2,b3,3,4,b5,5,b6,6,b7,7,R";
  var scale = getScaleArray(scaleStr);
  var keyNotes = getScaleArray(getScaleDegrees());
  //alert("keyNotes - " + keyNotes);

  for (ab = 0; ab < numfrets; ab++) {
    var label = scale[ab];
    if ((keyNotes.indexOf(ab.toString()) > -1) || (ab == numfrets - 1))
      var bold = true;
    else
      var bold = false;

    shownums(canvasname, canvasWidth, ab, label, fw, fh, x, true, bold);
  }
}

function shownums(canvasname, canvasWidth, ab, label, fw, fh, startx, bottom=false, isBold=true) {
  var canvas = document.getElementById(canvasname);
  var width = fh / 2 * 0.7;
  var boldStyle = (isBold ? "bold " : "");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    var fontstr = boldStyle + width + "px sans-serif";
    //var fontstr = width + "px sans-serif";
    ctx.font = fontstr;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    // ctx.fillText(note, startx, starty);
    if (bottom == true)
      ctx.fillText(label, startx + ab * fw, fh * 2);
    else
      ctx.fillText(label, startx + ab * fw, fh/7);
  }
}

function labelstrings(canvasname, canvasWidth, canvasHeight, strLen, fw, fh, margin, offset, numstrings=NumStrings) {
  var canvas = document.getElementById(canvasname);
  var x2 = (margin/2) + offset*2;
  var y2 = fh;

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var fontstr = "bold " + fh / 2 * 0.85 + "px sans-serif";

    ctx.font = fontstr;
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    for (ab = 0; ab < numstrings; ab++) {
      if (numstrings == 1)
        var root = getChordRoot() + 1;
      else
        var root = Tuning[ab];
      var noteName = "";
      var foundNote = 0;

      for (var i = 0; i < NoteValue.length; i++) {
        if (NoteValue[i][2] == root) {
          noteName = Notes[i][2];
          foundNote = 1;
        }
      }
      if (foundNote == 0) // not a natural note, name has a sharp (#)
      {
        for (var i = 0; i < NoteValue.length; i++) {
          if (NoteValue[i][2] == root) {
            noteName = Notes[i][2];
          }
        }
      }

      ctx.fillText(noteName, x2 / 2, y2 + ab * fh);
    }
  }
}

function showlabel(canvasname, label, fh, xpos, ypos) {
  var canvas = document.getElementById(canvasname);

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var fontstr = "bold " + fh / 2 * 0.7 + "px sans-serif";

    ctx.font = fontstr;
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(label, xpos, ypos);
  }
}

function showkeylabel(canvasname, description, x, fw, fh) {
  showlabel(canvasname, description, fh, x+fw, fh * 3);
  showlabel(canvasname, "(1) D - xx0232", fh, x+fw, fh * 3.5);
  showlabel(canvasname, "(2) Em - 022000", fh, x+fw, fh * 4);
  showlabel(canvasname, "(3) F#m - 244222", fh, x+fw, fh * 4.5);
  showlabel(canvasname, "(4) G - 320003", fh, x+fw, fh * 5);
  showlabel(canvasname, "(5) A - x02220", fh, x+fw, fh * 5.5);
  showlabel(canvasname, "(6) Bm - x24432", fh, x+fw, fh * 6);
  showlabel(canvasname, "(7) A7 - x02020", fh, x+fw, fh * 6.5);
}


function drawnotes(canvasname, startx, starty, isRoot, width) {
  circle(canvasname, startx, starty, width, width, false, isRoot);
}

function labelnotes(canvasname, note, startx, starty, width) {
  var canvas = document.getElementById(canvasname);

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var fontstr = "bold " + width + "px sans-serif";
    ctx.font = fontstr;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(note, startx, starty);

    // var f = 9837; // flat
    // var s = 9839; // sharp
    // var c= 169;
    // ctx.fillText(String.fromCharCode(c), startx, starty);
    // var h= toUTF16('1D12B');
    // ctx.fillText(String.fromCharCode(parseInt(h, 16)), startx, starty);
  }
}

function toUTF16(codePoint) {
    var TEN_BITS = parseInt('1111111111', 2);
    function u(codeUnit) {
        return '\\u'+codeUnit.toString(16).toUpperCase();
    }

    if (codePoint <= 0xFFFF) {
        return u(codePoint);
    }
    codePoint -= 0x10000;

    // Shift right to get to most significant 10 bits
    var leadSurrogate = 0xD800 + (codePoint >> 10);
    // Mask to get least significant 10 bits
    var tailSurrogate = 0xDC00 + (codePoint & TEN_BITS);

    return u(leadSurrogate) + u(tailSurrogate);
}

function getnotes(canvasname, canvasWidth, canvasHeight, rootIndex, scaleIndex, degree, strLen, fw, fh, margin, offset, numstrings=NumStrings, numfrets=NumFrets) {
  var x = (margin/2) + offset;
  var width = fh / 2 * 0.85; //16;
  var y = fh;

  if (degree == KeyTab) { // show entire scale
      var scalestring = calcScale(getScaleDegrees());
      var scaleLabel = getScaleLabel();
      var rootLabel = DictionaryNoteName[rootIndex];
      if (rootLabel.length > 1) // sharp or flat
          rootLabel = (getSharpFlat() == "sharp" ? rootLabel.substring(0,2) : rootLabel.substring(3,5));
      var tabLabel = "Key of " + rootLabel;
  }
  else { // show chord built on scale degree
    var found = 0;
    for (var i = 0; i < ScaleMembers.length; i++) {
      if (scaleIndex.valueOf() == ScaleMembers[i][0].valueOf()){
        found = i;
      }
    }

    var scalestring = ScaleMembers[found][0];
    var scaleLabel = ScaleMembers[found][1];
    var tabLabel = ScaleMembers[found][2];
    var rootLabel = getChordLabel(canvasname, rootIndex, degree);
  }

  var scale = getScaleArray(scalestring);
  var rootValue = DictionaryNoteValue[rootIndex];
  var description = rootLabel + " " + scaleLabel + " (" + scalestring + ")";
  if (degree == KeyTab)
    showkeylabel(canvasname, description, x, fw, fh);
  else
    showlabel(canvasname, description, fh, x+fw, fh * (NumStrings+1));
  updateTabLabel(degree, rootLabel, tabLabel);

  // Get root note
  if (rootLabel.length == 1)
    column = 2;
  if (rootLabel.length == 2) // sharp or flat
    column = (rootLabel[1] == "#" ? 3 : 1);
  if (rootLabel.length == 3) // double sharp or flat
    column = (rootLabel[2] == "#" ? 4 : 0);

  for (var f = 0; f < NoteValue.length; f++) {
    if (rootValue == NoteValue[f][column]) rootrow = f;
  }

  // Loop through each string
  for (var string = 0; string < numstrings; string++) {
    // Root note of string
    var root = Tuning[string];
    if (degree == KeyTab) root = rootIndex+1;
    var showString = ShowStrings[string];

    // Current fretted note
    for (var fret = 0; fret < numfrets; fret++) {
      // if capo, don't show frets below capo
      if (degree != KeyTab && fret == 0 && Capo1.indexOf(getChordRoot() + 1) > -1)
        continue;
      if (degree != KeyTab && (fret == 0 || fret == 1) && Capo2.indexOf(getChordRoot() + 1) > -1)
        continue;

      var currentfret = root + fret;
      while (currentfret > 12) currentfret -= 12;
      // Assign a numeric value if note is found, 0 means not found
      var foundnote = 0;
      var notelabel = "";

      // Print scale extensions, using scale formula
      for (var q = 0; q < scale.length; q++) {
        for (var z = 0; z < Intervals.length; z++) { // Extension above root
          if (Intervals[z] == scale[q]) {
            var extension = IntervalValue[z];
            var degree = Number(scale[q].replace(/\D/g,'')); // replace() to remove non-numeric chars
            var degreestr = Intervals[z];

          }
        }

        var scaledegree = rootValue + extension;
        while (scaledegree > 12) scaledegree -= 12;
        // Use the equality operator (==), not assignment (=)
        if (scaledegree == currentfret) {
          for (b = 0; b < 5; b++) {
            var degreeoffset = (degree == KeyTab ? 0 : degree - 1);
            var noterow = rootrow + degreeoffset;
            if (noterow > 6) noterow = noterow - 7;
            if (NoteValue[noterow][b] == scaledegree) {
              foundnote = NoteValue[noterow][b];
              if (getNoteDegree() == "degree")
                notelabel = degreestr;
              else{
                notelabel = Notes[noterow][b];
                // if (notelabel.length > 1)  //TODO to render sharp/flat
                //   notelabel = notelabel[0];
              }
            }
          }
        }
      }

      if (foundnote != 0 && showString == '1') {
        // if (noterow == rootrow)
        //   drawnotes(canvasname, x + fw / 2 + fret * fw, y + string * fh, true, width);
        // else
        //   drawnotes(canvasname, x + fw / 2 + fret * fw, y + string * fh, false, width);
        var isRoot = (noterow == rootrow);
        drawnotes(canvasname, x + fw / 2 + fret * fw, y + string * fh, isRoot, width);
        labelnotes(canvasname, notelabel, x + fw / 2 + fret * fw, y + string * fh, width);
      }
    }
  }
}

(function($) {})(jQuery);

var Notes = [
  ["Cbb","Cb", "C", "C#", "C##"],
  ["Dbb","Db", "D", "D#", "D##"],
  ["Ebb","Eb", "E", "E#", "E##"],
  ["Fbb","Fb", "F", "F#", "F##"],
  ["Gbb","Gb", "G", "G#", "G##"],
  ["Abb","Ab", "A", "A#", "A##"],
  ["Bbb","Bb", "B", "B#", "B##"]
];

var NoteValue = [
  [11, 12, 1, 2, 3],
  [1, 2, 3, 4, 5],
  [3, 4, 5, 6, 7],
  [4, 5, 6, 7, 8],
  [6, 7, 8, 9, 10],
  [8, 9, 10, 11, 12],
  [10, 11, 12, 1, 2]
];

var ScaleMembers = [
  [["1,3,5"],["Major"],[""]],
  [["1,b3,5"],["Minor"],["m"]],
  [["1,b3,b5"],["Diminished"],["dim"]],
  [["1,3,#5"],["Augmented"],["+"]],
  [["1,b3,5,b7"],["mm7"],["mm7"]],
  [["1,b3,5,7"],["mM7"],["mM7"]],
  [["1,3,5,7"],["MM7"],["MM7"]],
  [["1,3,5,b7"],["Mm7"],["Mm7"]],
  [["1,b3,b5,b7"],["m7b5"],["m7b5"]],
  [["1,b3,b5,bb7"],["dim7"],["dim7"]],
  [["1,3,#5,7"],["aug7"],["aug7"]],
];

// var ScaleFormula = [
//   [[0,2,4,5,7,9,11],["Major Scale"]],
//   [[0,2,3,5,7,8,11],["Melodic Minor"]]
// ];

var DictionaryNoteValue = [1,2,3,4,5,6,7,8,9,10,11,12];
var DictionaryNoteName = ["C","C#/Db","D","D#/Eb","E","F","F#/Gb","G","G#/Ab","A","A#/Bb","B"];
var ScaleFormula = [0,2,4,5,7,9,11];
var ScaleFormula2 = [1,2,3,4,5,6,7];
//var ScaleFormula = [0,2,3,5,7,8,11];

//var Intervals = ["1", "1#", "2b", "2", "2#", "3b", "3", "4", "4#", "5b", "5", "5#", "6b", "6", "6#", "7b", "7"];
var Intervals = ["1", "#1", "b2", "2", "#2", "b3", "3", "4", "#4", "b5", "5", "#5", "b6", "6", "#6", "bb7", "b7", "7"];
var IntervalValue = [0, 1, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 8, 9, 10, 9, 10, 11];
var ShowStrings = [1, 1, 1, 1, 1, 1];
var Tuning = [5, 12, 8, 3, 10, 5];
var Capo1 = [2, 4, 6, 9, 11];
var Capo2 = [7, 12];
var Position1 = [1, 2];
var Position2 = [3, 4];
var Position3 = [5, 6, 7];
var Position4 = [8, 9];
var Position5 = [10, 11, 12];
var NumFrets = 16; //15 frets + open string
var NumStrings = 6; //15 frets + open string
var MarginPct = 0.05;
var FretHeightToWidthRatio = 2/3;
var KeyTab = 8;
//var _ratio = Number(size.options[size.selectedIndex].value);

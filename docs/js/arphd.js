var LOCALSTORAGE_KEY = 'arphd.navState';

window.onload = function() {
  // Fade in
  var containers = document.getElementsByClassName('container');
  for (var i = 0; i < containers.length; i++) {
    containers[i].classList.add('visible');
  }
  var showcase = document.getElementsByClassName('showcase-wrapper');
  for (var i = 0; i < showcase.length; i++) {
    showcase[i].classList.add('visible');
  }

  // Slide toggle
  var projects = document.getElementsByClassName('project-box');
  for (var i = 0; i < projects.length; i++) {
    projects[i].onclick = function() {
      this.classList.toggle('show');
    }
  }

  var animationListener;
  animationListener = function () {
    this.classList.toggle('collapse');
    this.removeEventListener('animationend', animationListener);
  }

  // button toggle
  var buttons = document.getElementsByClassName('navbar-toggle');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      var target = document.querySelector(this.getAttribute('data-target'));
      target.addEventListener('animationend', animationListener);
      target.style.animation = target.classList.contains('collapse')?'unfold 1s':'fold 1s';
    }
  }

  // Register navigation state
  document.querySelectorAll('.ac-container > input').forEach(function(menu){
    menu.onclick = function () {
      var state = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};
      state[this.id] = this.checked;
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
    }
  });

  // Reapply previous state
  var state = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
  if(state) {
    Object.keys(state).forEach(function(menu){
      document.getElementById(menu).checked = state[menu];
    });
  }
}

function calculateAFPScore(){
  var result = document.getElementById('result');
  result.classList.remove('good');
  result.classList.remove('bad');
  var score = 0;
  switch (document.score.size.value){
    case 'mid':
      score += 1;
      break;
    case 'high':
      score += 4;
      break;
    default:
  }
  if(document.score.number.value === 'high') score += 2;
  switch (document.score.protein.value){
    case 'mid':
      score += 2;
      break;
    case 'high':
      score += 3;
      break;
    default:
  }

  result.textContent = score;
  result.classList.add(score <= 2 ? 'good' : 'bad');
}

function calculateCLIFScore(){
  var result = document.getElementById('result');
  var score = 0;
  var creat = (document.score.creat.value / 88.4).toFixed(2);
  var age = document.score.age.value;
  var inr = document.score.inr.value.replace(',', '.');
  var sodium = document.score.sodium.value;
  var glob = document.score.glob.value / 1000;

  score = 10 * (0.03 * age + 0.66 * Math.log(creat) + 1.71 * Math.log(inr) + 0.88 * Math.log(glob) - 0.05 * sodium + 8);

  if(score < 0)
    score = 0;
  else if(score > 100)
    score = 100;

  var constants = [[-0.00012, 0.1083], [-0.00056, 0.1007], [-0.00173, 0.0889], [-0.00879, 0.0698]];
  for(var i = 0; i < constants.length; i++) {
    var cell = document.getElementById("result_" + (i + 1));
    cell.textContent = (Math.exp(constants[i][0] * Math.exp(constants[i][1] * score)) * 100).toFixed(0) + "%";
  }
}

function calculateMELDScore(){
  var result = document.getElementById('result');
  var score = 0;
  var creat = document.score.creat.value.replace(',', '.') / 88.4;
  var bili = document.score.bilirubin.value.replace(',', '.') / 17.1;
  var inr = document.score.inr.value.replace(',', '.');
  if(document.score.dial.checked) creat = 4;
  if(creat < 1) creat = 1;
  if(bili < 1) bili = 1;

  score = (0.957 * Math.log(creat) + 0.378 * Math.log(bili) + 1.120 * Math.log(inr) + 0.643 ) * 10;

  if(score < 6)
    score = 6;
  else if(score > 40)
    score = 40;

  result.textContent = score.toFixed(0);
}

function calculateChildScore(){
  var result = document.getElementById('result');
  var score = 0;
  var inputs = document.querySelectorAll('.score input[type=radio]:checked');
  for (var i = 0; i < inputs.length; i++) {
    switch (inputs[i].value){
      case 'low':
        score += 1
        break;
      case 'mid':
        score += 2;
        break;
      case 'high':
        score += 3;
        break;
      default:
    }
  }
  if(score < 5) score = 5;
  if(score > 15) score = 15;

  if(score < 7)
    result.textContent = 'A' + score;
  else if(score < 10)
    result.textContent = 'B' + score;
  else
    result.textContent = 'C' + score;
}

function calculateLilleScore(){
  var result = document.getElementById('result');
  result.classList.remove('good');
  result.classList.remove('bad');
  var score = 0;
  var creat = document.score.creatine.value.replace(',', '.');
  var albu = document.score.albumine.value.replace(',', '.');
  var bili = document.score.bilirubin.value.replace(',', '.');
  var bili7 = document.score.bilirubin7.value.replace(',', '.');
  var pt = document.score.pt.value.replace(',', '.');
  var age = document.score.age.value;

  creat = creat < 115 ? 0 : 1;

  var r = 3.19 - 0.101 * age + 0.147 * albu + 0.0165 * (bili - bili7) - 0.206 * creat - 0.0065 * bili - 0.0096 * pt;
  score = Math.exp(-r) / (1 + Math.exp(-r));

  result.textContent = score.toFixed(2);
  result.classList.add(score <= 0.45 ? 'good' : 'bad');
}

function calculateHERSScore(){
  var result = document.getElementById('result');
  var result_1 = document.getElementById('result_1');
  var result_3 = document.getElementById('result_3');
  var result_5 = document.getElementById('result_5');
  result.classList.remove('good', 'bad');
  var score = 0;
  switch (document.score.size.value){
    case 'mid':
      score += 2;
      break;
    case 'high':
      score += 5;
      break;
    default:
  }
  switch (document.score.number.value){
    case 'mid':
      score += 1;
      break;
    case 'high':
      score += 2;
      break;
    default:
  }
  if(document.score.tumor.value == 'bi') score += 2;
  if(document.score.invasion.value == 'invasion') score += 2;

  var prob = [[3, 7, 8], [5, 10, 11], [7, 13, 15], [9, 18, 21], [12, 24, 28], [17, 31, 35], [22, 40, 46], [29, 52, 59], [39, 64, 71], [49, 77, 82], [61, 87, 91], [73, 94, 96]];
  result.textContent = score;
  result_1.textContent = prob[score][0] + '%';
  result_3.textContent = prob[score][1] + '%';
  result_5.textContent = prob[score][2] + '%';
  //result.classList.add(score <= 2 ? 'good' : 'bad');
}

function calculateHFScore(){
  var result_clichy = document.getElementById('result_clichy');
  var result_kings = document.getElementById('result_kings');
  result_clichy.classList.remove('good', 'bad');
  result_kings.classList.remove('good', 'bad');
  var score = document.score;
  var clichy = score.coma.value == 'oui' && ((score.facteur.value < 20 && score.age.value < 30) || (score.facteur.value < 30 && score.age.value >= 30));

  var atLeastThree = 0;
  if(score.inr.value > 3.5) atLeastThree++;
  if(score.bili.value > 300) atLeastThree++;
  if(score.age.value > 40 || score.age.value < 10) atLeastThree++;
  if(score.delai.value == 'mid' ) atLeastThree++;
  if(score.etio.value == 'medoc' || score.etio.value == 'unknown') atLeastThree++;

  var kings = (score.etio.value == 'paracetamol' && score.ph.value < 7.3) || (score.etio.value == 'paracetamol' && score.lactate.value > 3) || (score.etio.value == 'paracetamol' && score.coma.value == 'oui' && score.creat.value > 300 && score.inr.value > 6.5) || (score.etio.value != 'paracetamol' && score.inr.value > 6.5) || (score.etio.value != 'paracetamol' && atLeastThree >= 3);

  if(clichy){
    result_clichy.textContent = 'Oui'
    result_clichy.classList.add('good');
  } else {
    result_clichy.textContent = 'Non'
    result_clichy.classList.add('bad');
  }
  if(kings){
    result_kings.textContent = 'Oui'
    result_kings.classList.add('good');
  } else {
    result_kings.textContent = 'Non'
    result_kings.classList.add('bad');
  }
}

function calculateSOFAScore(){
  var result = document.getElementById('result');
  var score;
  var creat = document.score.creat.value.replace(',', '.');
  var bili = document.score.bilirubin.value.replace(',', '.');
  var inr = document.score.inr.value.replace(',', '.');
  var plaquettes = document.score.plaquettes.value.replace(',', '.');
  var pafi = document.score.pafi.value.replace(',', '.');
  var encephal = document.score.encephal.value;
  var hasEncephal = document.score.encephal.value == "high";
  var amines = document.score.amines.value == "oui";

  var prb = 0;
  if(bili >= 205) prb++;
  if(inr > 2.5 || plaquettes <= 20000) prb++;
  if(pafi <= 200) prb++;
  if(amines) prb++;

  if(
    (bili < 205 && creat < 177 && inr <= 2.5 && plaquettes > 20000 && !hasEncephal && pafi > 200 && !amines) ||
    (creat < 133 && !hasEncephal && prb == 1) ||
    (hasEncephal && creat < 133 && bili < 205 && inr <= 2.5 && plaquettes > 20000 && pafi > 200 && !amines))
      score = [0, 4.7];
  else if(
    (creat >= 177 && bili < 205 && inr <= 2.5 && plaquettes > 20000 && !hasEncephal && pafi > 200 && !amines) ||
    (creat >= 133 && creat <= 168 && !hasEncephal && prb == 1) ||
    (creat >= 133 && creat <= 168 && hasEncephal && bili < 205 && inr <= 2.5 && plaquettes > 20000 && pafi > 200 && !amines) ||
    (encephal == 'mid' && creat <= 168 && prb == 1))
      score = [1, 22.1];
  else{
      if(creat >= 177) prb++;
      if(hasEncephal) prb++;

      if(prb == 2) score = [2, 32];
      else score = [3, 78.6];
  }

  result.textContent = 'ACLF ' + score[0];
  document.getElementById("result_1").textContent = 100 - score[1].toFixed(0) + '%';
}

function calculateMayoCBP(){
  var albu = document.score.albumine.value.replace(',', '.') / 10;
  var bili = (document.score.bilirubin.value.replace(',', '.') / 17.1).toFixed(1);
  var pt = document.score.pt.value.replace(',', '.');
  var age = document.score.age.value;
  var oedeme = parseFloat(document.score.oedeme.value);

  var score = 0.039 * age + 0.871 * Math.log(bili) - 2.53 * Math.log(albu) + 2.38 * Math.log(pt) + 0.859 * oedeme;

  getSurvivability(score, [0.97, 0.941, 0.883, 0.833, 0.774, 0.721, 0.651], 5.07);
}

function calculateMayoCSP() {
  var albu = document.score.albumine.value.replace(',', '.') / 10;
  var bili = (document.score.bilirubin.value.replace(',', '.') / 17.1).toFixed(1);
  var asat = document.score.asat.value;
  var age = document.score.age.value;
  var atcd = parseInt(document.score.atcd.value);

  var score = 0.0295 * age + 0.5373 * Math.log(bili) - 0.8389 * albu + 0.5380 * Math.log(asat) + 1.2426 * atcd;
  getSurvivability(score, [0.963, 0.919, 0.873, 0.833], 1);
}

function getSurvivability(score, constants, scoreModifier) {
  for(var i = 0; i < constants.length; i++) {
    var cell = document.getElementById("result_" + (i + 1));
    cell.textContent = (Math.pow(constants[i], Math.exp(score-scoreModifier)) * 100).toFixed(0) + "%";
  }
}

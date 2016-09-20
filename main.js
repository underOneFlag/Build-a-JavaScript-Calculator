(function() {

function $(x) {
	const selected = document.querySelectorAll(x);
	const newArray = [];

	for(let i = 0, len = selected.length; i < len; ++i)
		newArray.push(selected[i]);

	return newArray;
}

const keyToBtn = {Escape:'AC', Delete:'C', Backspace:'C', Enter:'='}
const buttons = $('button');

document.onkeydown = (e) => {
	let key = e.key;

	if(key in keyToBtn) {
		key = keyToBtn[key];
	}

	for(let i = 0, len = buttons.length; i < len; ++i) {
		if(buttons[i].textContent === key) {
			buttons[i].classList.add('pressed');
			break;
		}
	}
}

document.onkeyup = (e) => {
	let key = e.key;

	if(key in keyToBtn) {
		key = keyToBtn[key];
	}

	for(let i = 0, len = buttons.length; i < len; ++i) {
		if(buttons[i].textContent === key) {
			buttons[i].click();
			buttons[i].classList.remove('pressed');
			break;
		}
	}
};

buttons.forEach(x => x.onclick = runMe);

const cInput = document.getElementById('current-input');
const cCalc = document.getElementById('current-calc');
const runningCalc = [];
const operators = ['-', '/', '*', '+'];
let resultSet = false;

function clear() {
	if(cInput.textContent === '') {
		cInput.textContent = runningCalc.pop();
		updateCalc();
	}
	else {
		cInput.textContent = '';
	}
	cCalc.classList.remove('result');
}

function allClear() {
	cInput.textContent = '';
	runningCalc.splice(0, runningCalc.length);
	updateCalc();
	cCalc.classList.remove('result');
}

function updateCalc() {
	cCalc.textContent = runningCalc.join(' ');
}

function calcPush(value) {
	runningCalc.push(value);
	updateCalc();
}

function evalCalc() {
	const wide = runningCalc.reduce((x,y) => x.length > y.length ? x : y).length;
	const pres = (wide.toString().indexOf('.') > -1) ? 
							 wide.length - 1 : wide.length;

	const evaled = eval(runningCalc.join(''));

	if(isNaN(evaled) || evaled === Infinity || evaled === -Infinity) {
		allClear();
		cInput.textContent = 'error';
		return;
	}

	const eStr = evaled.toString();

	if(eStr.indexOf('.') > -1) {
		cInput.textContent = Number(evaled.toPrecision(wide + 1));
	}
	else if(eStr.length > 16 || evaled > Number.MAX_SAFE_INTEGER) {
		allClear();
		cInput.textContent = 'max size exceeded';
	}
	else {
		cInput.textContent = evaled;
	}

	resultSet = true;
}

function runMe(e) {
	const value = e.target.textContent;

	if(value == 'AC')
		return allClear();

	if(value == 'C') {
		resultSet = false;
		return clear();
	}

	if(resultSet) {
		const result = cInput.textContent;

		allClear();

		if(result != 'error' && result != 'max size exceeded') {
			if(value.match(/[^0-9\.]/)) {
				calcPush(result);	
			}
		}

		resultSet = false;
		cCalc.classList.remove('result');
	}

	if(value == '=') {
		if(runningCalc.length === 0 || runningCalc.join('') === '') return;
		if(cInput.textContent.slice(-1).match(/[\.\*\/\-\+]/) === null) { 
			calcPush(cInput.textContent);
			evalCalc();
			cCalc.classList.add('result');
		}
		return;
	}

	if(cInput.textContent === '') {
		if(operators.includes(value)) {
			if(runningCalc.length === 0) return;
			if(operators.includes(runningCalc.slice(-1)[0])) return;
			cInput.textContent = value;
		}
		else {
			if(runningCalc.length > 0 &&
				 !operators.includes(runningCalc.slice(-1)[0])) return;
			cInput.textContent = value;
		}
	}
	else {
		if(operators.includes(value)) {
			if(cInput.textContent.slice(-1) == '.') return;
			if(!operators.includes(cInput.textContent)) {
				calcPush(cInput.textContent);
			}
			cInput.textContent = value;
		}
		else {
			if(cInput.textContent.length == 16) {
				allClear();
				cInput.textContent = 'max size exceeded';
				resultSet = true;
				return;
			}
			if(operators.includes(cInput.textContent)) {
				calcPush(cInput.textContent);
				cInput.textContent = value;
			}
			else {
				if(cInput.textContent === '0' && value != '.') return;
				if(cInput.textContent.match(/\d*\./) && value == '.') return;
				cInput.textContent += value;
			}
		}
	}

	if(runningCalc.join(' ').length > 70) {
		allClear();
		cInput.textContent = 'max size exceeded';
		resultSet = true;
	}
}

})();
var rawSize = 0;
var referenceElementCaller;

function changeSize(sizeField) {
	var overlay = document.getElementById("overlay");
	referenceElementCaller = sizeField;
	
	overlay.style.display = "block";	
}

function applySize() {
	var overlay = document.getElementById("overlay");
	if (overlay.style.display == "block") {
		overlay.style.display = "none";
		referenceElementCaller.value = document.getElementById("sizeHex").value;
	}
	
	updateStatistics();
}

function updateStatistics() {
	let totalPartDOM = document.getElementById("partCount");
	let totalSizeDOM = document.getElementById("totalSize");
	let table = document.getElementById("partitionTable");
	
	let dataArr = getData();
	
	// Get all sizes
	let size = 0;
	for (var i = 1; i < dataArr.length; i++) {
		size += parseInt(dataArr[i][4], 16);
	}
	
	size = parseFloat(size / 1000000);
	if (size > 4) {
		totalSizeDOM.setAttribute('class','warning');
	} else {
		totalSizeDOM.removeAttribute('class');
	}
	
	size = String(size + "mb");
	
	totalSizeDOM.innerHTML = size;
	totalPartDOM.innerHTML = actualRows;
}

function updateSizeValues(referenceElement) {
	var sizeFieldDOM = document.getElementById("sizeValue");
	var sizeUnitDOM = document.getElementById("sizeUnit");
	var sizeHexDOM = document.getElementById("sizeHex");
	
	var totalSizeBDOM = document.getElementById("totalSizeB");
	var totalSizeKbDOM = document.getElementById("totalSizeKb");
	var totalSizeMbDOM = document.getElementById("totalSizeMb");
	
	if (referenceElement.id != "sizeHex") {
	} else {
		rawSize = parseInt(sizeHexDOM.value, 16);
	}
	
	// Determine proper source for rawSize calculation
	switch (sizeUnitDOM.value) {
		case 'b': rawSize = sizeFieldDOM.value; break;
		case 'kb': rawSize = sizeFieldDOM.value / 1000; break;
		case 'mb': rawSize = sizeFieldDOM.value / 1000000; break;
	}
	

	switch (sizeUnitDOM.value) {
		case 'b':
			totalSizeBDOM.innerHTML = rawSize;
			totalSizeKbDOM.innerHTML = rawSize / 1000;
			totalSizeMbDOM.innerHTML = rawSize / 1000000;
			break;			
		case 'kb':
			totalSizeBDOM.innerHTML = rawSize * 1000000;
			totalSizeKbDOM.innerHTML = rawSize * 1000;
			totalSizeMbDOM.innerHTML = rawSize;
			break;
		case 'mb': 
			totalSizeBDOM.innerHTML = rawSize * 1000000000000;
			totalSizeKbDOM.innerHTML = rawSize * 1000000000;
			totalSizeMbDOM.innerHTML = rawSize * 1000000;
			break;
	}
	
	sizeHexDOM.value = parseInt(totalSizeBDOM.innerHTML).toString(16);
	
}
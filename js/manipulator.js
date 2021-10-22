var rawSize = 0;
var referenceElementCaller;

var flashMaxSize = 4;

function generateCSV() {
	if (validatePartitionTable()) {
	}
}

function toggleErrorOverlay() {
	var overlay = document.getElementById("errorOverlay");
	if (overlay.style.display == "block") {
		overlay.style.display = "none";
	} else {
		overlay.style.display = "block";
	}
}

function validatePartitionTable() {
	let totalSizeDOM = document.getElementById("totalSize");
	let errOverlayDOM = document.getElementById("errorOverlayContentReasons");
	let dataArr = getData();
	let validationPassed = true;
	
	// Blanket data collection
	let arrMatey = new Array();
	let flatArray;
	for (var i = 1; i < dataArr.length; i++) {
		arrMatey = arrMatey.concat(dataArr[i]);
		flatArray += dataArr[i];
	}
	
	// Prepare error overlay
	let child = errOverlayDOM.lastElementChild;
	while (child) {
		errOverlayDOM.removeChild(child);
		child = errOverlayDOM.lastElementChild;
	}
	
	var sizeVal = parseFloat(totalSizeDOM.innerText)
	if (totalSizeDOM.getAttributeNames().includes("class")) {
		var e = document.createElement('b');
			e.innerHTML = "- Max flash size has been exceeded. (Threshold: " + flashMaxSize + "mb)";
			e.appendChild(document.createElement('br'));
		errOverlayDOM.appendChild(e);
		validationPassed = false;
	} else if (isNaN(sizeVal) || sizeVal <= 0) {
		var e = document.createElement('b');
			e.innerHTML = "- At least one partition has not been assigned a size.";
			e.appendChild(document.createElement('br'));
		errOverlayDOM.appendChild(e);
		validationPassed = false;
	}
	
	// Check for OTA information
	if (flatArray.match(/ota_/g) !== null) {
		if (!(arrMatey.includes("ota"))) {
			var e = document.createElement('b');
				e.innerHTML = "- OTA data partitions have been set, but an OTA information partition is missing.";
				e.appendChild(document.createElement('br'));
			errOverlayDOM.appendChild(e);
			validationPassed = false;
		}
	}
	
	if (validationPassed) {
		return true;
	} else {
		toggleErrorOverlay();
	}
}

function changeSize(sizeField) {
	var overlay = document.getElementById("overlay");
	referenceElementCaller = sizeField;
	
	overlay.style.display = "block";
	
	var sizeFieldDOM = document.getElementById("sizeValue");
	
	sizeFieldDOM.value = parseInt(sizeField.value, 16);
	updateSizeValues(this);
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
	if (size > flashMaxSize) {
		totalSizeDOM.setAttribute('class','warning');
	} else {
		totalSizeDOM.removeAttribute('class');
	}
	
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
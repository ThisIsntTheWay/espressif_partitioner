var rawSize = 0;
var referenceElementCaller;

var flashMaxSize = 4;

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function generateCSV() {
	
	if (validatePartitionTable() < 1) {
		var assembledString = "# Generated using espressif partition manager at: " + Date() + "\n";
		
		var d = getData();
		for (var i = 0; i < d.length; i++) {
			if (i == 0) { assembledString += "# "; }
			
			for (var c = 0; c < d[i].length; c++) {
				if (c == d[i].length - 1) {
					assembledString += d[i][c] + '\n';
				} else {
					assembledString += d[i][c] + ',';
				}
			}
		}
		
		download("partition_table.csv", assembledString);
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

function toggleWarnOverlay() {
	var overlay = document.getElementById("warnOverlay");
	if (overlay.style.display == "block") {
		overlay.style.display = "none";
	} else {
		overlay.style.display = "block";
	}
}

function validatePartitionTable() {
	let totalSizeDOM = document.getElementById("totalSize");
	let errOverlayDOM = document.getElementById("errorOverlayContentReasons");
	let warnOverlayDOM = document.getElementById("warnOverlayContentReasons");
	let dataArr = getData();
	
	let validationPassed = true;
	let validationWarnings = false;
	
	// Blanket data collection
	let arrMatey = new Array();
	let flatArray;
	for (var i = 1; i < dataArr.length; i++) {
		arrMatey = arrMatey.concat(dataArr[i]);
		flatArray += dataArr[i];
	}
	
	// Prepare overlays
	var child = errOverlayDOM.lastElementChild;
	while (child) {
		errOverlayDOM.removeChild(child);
		child = errOverlayDOM.lastElementChild;
	}
	
	var child = warnOverlayDOM.lastElementChild;
	while (child) {
		warnOverlayDOM.removeChild(child);
		child = warnOverlayDOM.lastElementChild;
	}
	
	// Check size
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
	console.log(flatArray.match(/ota_/g))
	if (flatArray.match(/ota_/g)) {
		console.log("is not null");
		if (flatArray.match(/ota_/g).length < 2) {
			var e = document.createElement('b');
				e.innerHTML = "- Only one OTA data partition has been set.";
				e.appendChild(document.createElement('br'));
			warnOverlayDOM.appendChild(e);
			validationWarnings = true;
		}
	} else {
		if (!(arrMatey.includes("ota"))) {
			var e = document.createElement('b');
				e.innerHTML = "- OTA data partitions have been set, but an OTA information partition is missing.";
				e.appendChild(document.createElement('br'));
			errOverlayDOM.appendChild(e);
			validationPassed = false;
		}
	}
	
	// Determine whether to proceed or not
	if (validationPassed) {
		return 0;
	} else if (validationWarnings) {
		toggleWarnOverlay();
		return 1;
	} else {
		toggleErrorOverlay();
		return 2;
	}
}

function changeSize(sizeField) {
	var overlay = document.getElementById("overlay");
	referenceElementCaller = sizeField;
	
	overlay.style.display = "block";
	
	var sizeFieldDOM = document.getElementById("sizeValue");
	
	sizeFieldDOM.value = parseInt(sizeField.value, 16);
	sizeFieldDOM.focus();
	updateSizeValues(this);
}

function applySize() {
	referenceElementCaller.value = "0x" + document.getElementById("sizeHex").value;
	toggleSizeOverlay();
	updateStatistics();
}

function toggleSizeOverlay() {
	var overlay = document.getElementById("overlay");
	
	if (overlay.style.display == "block") {
		overlay.style.display = "none";
	}
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
	
	if (referenceElement.id == "sizeHex") {
		rawSize = parseInt(sizeHexDOM.value, 16);
	} else {
		rawSize = sizeFieldDOM.value;
	}
	
	// Determine proper source for rawSize calculation
	switch (sizeUnitDOM.value) {
		case 'b': break;
		case 'kb': rawSize = rawSize / 1000; break;
		case 'mb': rawSize = rawSize / 1000000; break;
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
	
	if (referenceElement.id == "sizeHex") {
		sizeFieldDOM.value = rawSize;
	} else {
		sizeHexDOM.value = parseInt(totalSizeBDOM.innerHTML).toString(16);
	}
}
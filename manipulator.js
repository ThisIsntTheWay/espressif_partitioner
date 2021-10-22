var rawSize = 0;

function changeSize(textField) {
	
}

function updateSizeValues(referenceElement) {	
	var sizeFieldDOM = document.getElementById("sizeValue");
	var sizeUnitDOM = document.getElementById("sizeUnit");
	var sizeHexDOM = document.getElementById("sizeHex");
	
	var totalSizeKbDOM = document.getElementById("totalSizeKb");
	var totalSizeMbDOM = document.getElementById("totalSizeMb");
	
	
	// Determine proper source for rawSize calculation
	switch (referenceElement.id) {
		case 'sizeHex':
			break;
		default:
			switch (sizeUnitDOM.value) {
				case 'b': rawSize = sizeFieldDOM.value; break;
				case 'kb': rawSize = sizeFieldDOM.value / 1000; break;
				case 'mb': rawSize = sizeFieldDOM.value / 1000000; break;
			}
			break;
	}

	switch (sizeUnitDOM.value) {
		case 'b': 
			totalSizeKbDOM.innerHTML = rawSize / 1000;
			totalSizeMbDOM.innerHTML = rawSize / 1000000;
			break;			
		case 'kb': 
			totalSizeKbDOM.innerHTML = rawSize * 1000;
			totalSizeMbDOM.innerHTML = rawSize;
			break;
		case 'mb': 
			totalSizeKbDOM.innerHTML = rawSize * 1000000000;
			totalSizeMbDOM.innerHTML = rawSize * 1000000;
			break;
	}
}

function toggleOverlay() {
	var overlay = document.getElementById("overlay");
	
	if (overlay.style.display == "block") {
		overlay.style.display = "none";
	} else {
		overlay.style.display = "block";
	}		
}
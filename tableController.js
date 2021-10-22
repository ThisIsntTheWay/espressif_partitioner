var tableHeaders = new Array();
tableHeaders = ['', 'Name', 'Type', 'SubType', 'Offset', 'Size', 'Flags', 'Identification'];

function createTable() {
	var partitionTable = document.createElement('table');
	partitionTable.setAttribute('id', 'partitionTable');

	var tr = partitionTable.insertRow(-1);

	// headers
	for (var h = 0; h < tableHeaders.length; h++) {
		var th = document.createElement('th');
		th.innerHTML = tableHeaders[h];
		tr.appendChild(th);
	}

	var div = document.getElementById('partitionTableDiv');
	div.appendChild(partitionTable);
}

function addRow() {
	var empTab = document.getElementById('partitionTable');

	var rowCnt = empTab.rows.length;
	var tr = empTab.insertRow(rowCnt);
	tr = empTab.insertRow(rowCnt);

	for (var c = 0; c < tableHeaders.length; c++) {
		var td = document.createElement('td');
		td = tr.insertCell(c);

		// Populate table with elements
		if (c == 0) {   // if its the first column of the table.
			// add a button control.
			var button = document.createElement('input');

			// set the attributes.
			button.setAttribute('type', 'button');
			button.setAttribute('value', '-');

			// add button's "onclick" event.
			button.setAttribute('onclick', 'removeRow(this)');

			td.appendChild(button);
		}
		else {
			var ele = document.createElement('input');
			ele.setAttribute('type', 'text');
			ele.setAttribute('class', 'tableTextBox');
			ele.setAttribute('value', '');

			td.appendChild(ele);
		}
	}
}

// function to delete a row.
function removeRow(oButton) {
	var empTab = document.getElementById('partitionTable');
	empTab.deleteRow(oButton.parentNode.parentNode.rowIndex); // buttton -> td -> tr
}
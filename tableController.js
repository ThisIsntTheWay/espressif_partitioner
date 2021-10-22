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

function getData() {
	var t = document.getElementById("partitionTable");
	var dataArray = new Array();
	var skippedRows = 0;
	
	for (var r = 0, n = t.rows.length - 1; r < n; r++) {
		var cellLength = t.rows[r].cells.length;
		console.log("Row: " + r + ", Cell length: " + cellLength);
		
		// The tables for some reason generate empty rows.
		// The code with skippedRows will compensate for those:
		// Such rows are skipped, and to ensure proper dataArray index continuation, the next index will be
		//  substracted by the amount of skipped rows
		var index = r - skippedRows;
		
		if (cellLength > 0) {
			dataArray[index] = new Array();
			
			for (var c = 1, m = t.rows[r].cells.length; c < m; c++) {
				var data = "";
				
				if (r == 0) {
					data = t.rows[r].cells[c].innerText;
				} else {
					data = t.rows[r].cells[c].getElementsByClassName("tableTextBox")[0].value;
				}
				
				console.log("> Column " + c + " data: " + data);
				
				dataArray[index].push(data);
			}
		} else {
			skippedRows++;
		}
	}
	
	return dataArray;
}
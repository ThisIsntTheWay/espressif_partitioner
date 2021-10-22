var tableHeaders = new Array();
var hasChanged = false;
var firstRun = true;

var actualRows = 0;

tableHeaders = ['', 'Name', 'Type', 'Subtype', 'Offset', 'Size', 'Flags'];

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
	actualRows++;
	var empTab = document.getElementById('partitionTable');

	var rowCnt = empTab.rows.length;
	var tr = empTab.insertRow(rowCnt);
	tr = empTab.insertRow(rowCnt);

	for (var c = 0; c < tableHeaders.length; c++) {
		var td = document.createElement('td');
		td = tr.insertCell(c);

		// Populate table with elements
		switch (c) {
			case 0:			// add a button control.
				var button = document.createElement('input');
				button.setAttribute('type', 'button');
				button.setAttribute('value', '-');
				button.setAttribute('onclick', 'removeRow(this)');

				td.appendChild(button);
				break;
				
			case 2:
				var drop = document.createElement('select');
				drop.setAttribute('id', 'partitionType');
				drop.setAttribute('onclick', 'setChangedFlag()');
				
				var o1 = document.createElement('option');
					o1.setAttribute('value','data')
					o1.innerHTML = "data";
					drop.appendChild(o1); 
				var o2 = document.createElement('option');
					o2.setAttribute('value','app')
					o2.innerHTML = "app";
					drop.appendChild(o2);
					
				td.appendChild(drop);
				break;
				
			case 3:
				var drop = document.createElement('select');
				drop.setAttribute('id', 'partitionSubType');
				drop.setAttribute('onclick', 'changeDropSelection(this)');
					
				td.appendChild(drop);
				break;
				
			case 4:
				if (firstRun) {
					var ele = document.createElement('input');
					ele.setAttribute('type', 'text');
					ele.setAttribute('class', 'tableTextBox');
					ele.setAttribute('value', '0x9000');
					ele.setAttribute('disabled','');

					td.appendChild(ele);
					
					firstRun = false;
				} else {
					var ele = document.createElement('input');
					ele.setAttribute('type', 'text');
					ele.setAttribute('class', 'tableTextBox');
					ele.setAttribute('value', '');

					td.appendChild(ele);
					break;
				}
				break;
			
			case 5:
				var ele = document.createElement('input');
				ele.setAttribute('type', 'text');
				ele.setAttribute('class', 'tableTextBox');
				ele.setAttribute('onclick', 'changeSize(this)');
				ele.setAttribute('value', '');

				td.appendChild(ele);
				break;
			
			case 6:
				var label = document.createElement('label');
				label.innerHTML = "Encrypted";
				
				var ele = document.createElement('input');
				ele.setAttribute('type', 'checkbox');
				ele.setAttribute('id', 'flashEncryption');

				label.appendChild(ele);
				td.appendChild(label);
				break;				
				
			default:
				var ele = document.createElement('input');
				ele.setAttribute('type', 'text');
				ele.setAttribute('class', 'tableTextBox');
				ele.setAttribute('value', '');

				td.appendChild(ele);
				break;
		}
	}
}

// function to delete a row.
function removeRow(oButton) {
	var empTab = document.getElementById('partitionTable');
	empTab.deleteRow(oButton.parentNode.parentNode.rowIndex); // buttton -> td -> tr
	
	actualRows--;
}

function setChangedFlag() {
	if (hasChanged) {
		hasChanged = false;
	}
}

function changeDropSelection(dropDown) {
	if (!hasChanged) {
		var val = dropDown.parentElement.parentElement.cells[2].getElementsByTagName("select")[0].value
		
		var child = dropDown.lastElementChild;
		while (child) {
			dropDown.removeChild(child);
			child = dropDown.lastElementChild;
		}
		
		switch (val) {
			case "data":
				var o = document.createElement('option');
					o.setAttribute('value','ota');
					o.innerHTML = "ota";
					dropDown.appendChild(o); 
				var o = document.createElement('option');
					o.setAttribute('value','phy');
					o.innerHTML = "app";
					dropDown.appendChild(o);
				var o = document.createElement('option');
					o.setAttribute('value','nvs');
					o.innerHTML = "nvs";
					dropDown.appendChild(o);
				var o = document.createElement('option');
					o.setAttribute('value','nvs_keys');
					o.innerHTML = "nvs_keys";
					dropDown.appendChild(o);
				var o = document.createElement('option');
					o.setAttribute('value','spiffs');
					o.innerHTML = "spiffs";
					dropDown.appendChild(o);
				var o = document.createElement('option');
					o.setAttribute('value','fat');
					o.innerHTML = "fat";
					dropDown.appendChild(o);
				break;
			
			case "app":
				var o1 = document.createElement('option');
					o1.setAttribute('value','factory');
					o1.innerHTML = "factory";
					dropDown.appendChild(o1); 
				var o2 = document.createElement('option');
					o2.setAttribute('value','ota_0');
					o2.innerHTML = "ota_0";
					dropDown.appendChild(o2);
				var o3 = document.createElement('option');
					o3.setAttribute('value','ota_1');
					o3.innerHTML = "ota_2";
					dropDown.appendChild(o3);
				var o4 = document.createElement('option');
					o4.setAttribute('value','ota_2');
					o4.innerHTML = "ota_2";
					dropDown.appendChild(o4);
				var o4 = document.createElement('option');
					o4.setAttribute('value','ota_3');
					o4.innerHTML = "ota_3";
					dropDown.appendChild(o4);
				break;
		}
		
		hasChanged = true;
	}
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
					console.log("Current c: " + c);
					switch (c) {
						case 2: data = t.rows[r].cells[c].getElementsByTagName("select")[0].value; break;
						case 3: data = t.rows[r].cells[c].getElementsByTagName("select")[0].value; break;
						case 6: data = t.rows[r].cells[c].getElementsByTagName("input")[0].checked ? 'encrypted' : ''; break;
						default: data = t.rows[r].cells[c].getElementsByClassName("tableTextBox")[0].value; break;
					}
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
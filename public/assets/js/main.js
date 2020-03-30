var MCD = {
	'matrix': [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	],
	'settings': {
		'fieldWidth': 20,
		'fieldHeight': 20,
		'setSize': function (event) {
			var new_width = parseInt($('#setsize_width').val());
			var new_height = parseInt($('#setsize_height').val());
			var isConfirmed = true;
			if(new_width < MCD.settings.fieldWidth || new_height < MCD.settings.fieldHeight) {
				var isComfirmed = confirm('The dimensions you entered are smaller than the current ones (' + MCD.settings.fieldWidth + 'x' + MCD.settings.fieldHeight + ").\n" + 'This may cause you to lose part of your design. Are you sure you want to continue?');
			}
			if(isConfirmed) {
				var designCopy = [];
				//make a copy only of the part we're still going to use
				for(var y = 0; ((y < MCD.settings.fieldHeight) && (y < new_height)); y += 1) {
					designCopy[y] = [];
					for(var x = 0; ((x < MCD.settings.fieldWidth) && (x < new_width)); x += 1) {
						designCopy[y][x] = MCD.matrix[y][x];
					}
				}

				//regenerate the matrix
				MCD.matrix = [];
				for(var y = 0; y < new_height; y += 1) {
					MCD.matrix[y] = [];
					for(var x = 0; x < new_width; x += 1) {
						if(y < MCD.settings.fieldHeight && x < MCD.settings.fieldWidth) {
							MCD.matrix[y][x] = designCopy[y][x];
						}
						else {
							MCD.matrix[y][x] = 0;
						}
					}
				}
				MCD.settings.fieldWidth = new_width;
				MCD.settings.fieldHeight = new_height;
				MCD.env.reDraw();
			}
		}
	},
	'env': {
		'selectedMaterial': 1,
		'isDrawing': false,
		'clearAll': function () {
			if(confirm('Are you sure you want to erase your whole design?')) {
				for(var y = 0; y < MCD.settings.fieldHeight; y += 1) {
					for(var x = 0; x < MCD.settings.fieldWidth; x += 1) {
						MCD.matrix[y][x] = MCD.env.selectedMaterial;
					}
				}
				MCD.env.reDraw();
			}
		},
		'reDraw': function() {
			var tb = $('#design_table tbody');
			tb.html('');
			for(var y = 0; y < MCD.settings.fieldHeight; y += 1) {
				var new_row = $('<tr>', {'title':'row_' + y});
				for(var x = 0; x < MCD.settings.fieldWidth; x += 1) {
					var new_cell = $('<td>', {'title':'col_' + x, 'class':'material_' + MCD.matrix[y][x]});
					new_cell.hover(function() {
						//detect coordinates
						var self_x = parseInt($(this).attr('title').substr(4));
						var self_y = parseInt($(this).parent().attr('title').substr(4));
						MCD.env.showCoords((self_x + 1), (self_y + 1));
						if(MCD.env.isDrawing) {
							MCD.matrix[self_y][self_x] = MCD.env.selectedMaterial;
							$(this).removeClass().addClass('material_' + MCD.env.selectedMaterial);
						}
					})
					.click(function() {
						var self_x = parseInt($(this).attr('title').substr(4));
						var self_y = parseInt($(this).parent().attr('title').substr(4));
						MCD.matrix[self_y][self_x] = MCD.env.selectedMaterial;
						$(this).removeClass().addClass('material_' + MCD.env.selectedMaterial);
					})
					.mousedown(function(e) {
						try {
							e.preventDefault();
							event.preventDefault();
						}
						catch(er) { /*who cares*/ }
						MCD.env.isDrawing = true;
					});
					new_row.append(new_cell);
				}
				tb.append(new_row);
			}
		},
		'setMaterial': function ( newMaterial ) {
			MCD.env.selectedMaterial = newMaterial;
			$('#cur_material').removeClass().addClass('material_' + newMaterial);
			$('#cur_material_code').html(newMaterial);
		},
		'showCoords': function(x, y) {
			$('#coords_container').html(x.toString() + ', ' + (MCD.settings.fieldHeight - y + 1).toString());
			$('td').removeClass('mark_left').removeClass('mark_top').removeClass('mark_right').removeClass('mark_bottom');
			$('tr[title="row_' + (y-1).toString() + '"] td:first').addClass('mark_left');
			$('tr[title="row_' + (y-1).toString() + '"] td:last').addClass('mark_right');
			$('tr:first td[title="col_' + (x-1).toString() + '"]').addClass('mark_top');
			$('tr:last td[title="col_' + (x-1).toString() + '"]').addClass('mark_bottom');
		}
	},
	'exportToForm': function() {
		$('#port_field').val(MCD.export());
	},
	'export': function() {
		var output = '{"w":' + MCD.settings.fieldWidth.toString() + ',"h":' + MCD.settings.fieldHeight.toString() + ',"m":[';
		for(var y = 0; y < MCD.settings.fieldHeight; y += 1) {
			output += '[';
			for(var x = 0; x < MCD.settings.fieldWidth; x+= 1) {
				output += MCD.matrix[y][x].toString();
				if(x < (MCD.settings.fieldWidth-1)) { output += ','; }
			}
			output += ']';
			if(y < (MCD.settings.fieldHeight-1)) { output += ','; }
		}
		output += ']}';
		return output;
	},
	'importFromForm': function() {
		if(confirm('Importing a design will erase your current design. If you want to keep your work, export your design first and save it somewhere.\nDo you still want to import this design now?')) {

			try {
				var imported = $.parseJSON($.trim($('#port_field').val()));
				if (typeof(imported) === 'object') {
					if(typeof(imported.w) === 'number' && typeof(imported.h) === 'number' && typeof(imported.m) === 'object') {
						//okay.
						MCD.settings.fieldWidth = imported.w;
						MCD.settings.fieldHeight = imported.h;
						MCD.matrix = imported.m;
						MCD.env.reDraw();
					}
					else {
						alert('The design you pasted was invalid. Please make sure you have copied all of it.');
					}
				}
				else {
					alert('Failed to import this design. Please make sure you copied all of it.');
				}
			}
			catch(e) {
				alert('Something went quite wrong while trying to parse the design you pasted. Please make sure you copied all of it.');
			}
		}
	},
	'import': function ( inJson ) {
		try {
			var imported = $.parseJSON(inJson);
			if (typeof(imported) === 'object') {
				if(typeof(imported.w) === 'number' && typeof(imported.h) === 'number' && typeof(imported.m) === 'object') {
					//okay.
					MCD.settings.fieldWidth = imported.w;
					MCD.settings.fieldHeight = imported.h;
					MCD.matrix = imported.m;
					MCD.env.reDraw();
				}
				else
				{

				}
			}
			else
			{

			}
		}
		catch(e) { /* no. */ }
	},
	'save': function ( ) {
		$.ajax({
			'url': 			'/',
			'data':			'design=' + escape(MCD.export()),
			'type':			'post',
			'dataType':	'json',
			'timeout':	15000,
			'success':	function ( theData ) {
				if(theData.status == 'success') {
					window.location.href = '/' + theData.designID + '/';
				}
				else {
					alert(theData.message);
				}
			},
			'error':		function ( ) {
				alert('Something went wrong while contacting the server, please try again.');
			}
		});
	}
};

$(document).ready(function() {
	MCD.env.reDraw(); //initialize design table

	$(document).mouseup(function() {
		MCD.env.isDrawing = false;
	}); //make sure drawing also stop on mouseup outside the drawing field

	$('#material_container .material_wrap div').click(function() {
		MCD.env.setMaterial(parseInt($(this).attr('class').substr(9)));
	});
});

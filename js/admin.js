//globals
var butAdd = $("<button>Neu</button>");
var tables;
//onload handler
$(function() {
	$("#vtab").tabs();
	$(".menubar li").addClass("ui-corner-all");
	$(".main").css("padding","0px");
	tables=$(".dat").dataTable({
		"bJQueryUI": true,
		"bDeferRender": true,
		"bPaginate": false,
		"bProcessing": true,
		"sAjaxSource": "trainings.json",
		"ssAjaxDataProp" : "",
		 "aoColumns": [
	 	   { "mData": "diff" },
            { "mData": "what" },
            { "mData": "where" }       ]
		
	});
	$(".main .dataTables_filter").append(butAdd);
	butAdd.css("float","right").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        });
});

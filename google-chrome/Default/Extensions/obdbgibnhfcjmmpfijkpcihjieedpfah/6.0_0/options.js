$(function(){
	if(localStorage["saved_url"]){
		$('#school-opt').prop('checked', true);
		$("#url").val(localStorage["saved_url"]);
		$('#school-opt').closest('label').addClass('active');
	}else{
		$('#individual-opt').prop('checked', true);
		$('#individual-opt').closest('label').addClass('active');
	}


	// the save action
	$("#save").click(function(){
		if($('#individual-opt').prop('checked')){
			delete localStorage["saved_url"];	
		}else{
			if($("#url").val() == ''){
				alert('Please set your portal URL prior to saving this settings');
				return;
			}
			localStorage["saved_url"] = $("#url").val();
		}
		document.location = "main.html";
		return false;
	});


	// styling fixes
	$("input[type=radio]").click(function(){
		$('.active').removeClass('active');
		$(this).closest('label').addClass('active');
	})
})
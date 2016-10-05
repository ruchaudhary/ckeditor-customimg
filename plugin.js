/**
 * Custom image uplaod plugin for CKEditor.
 * @developed by Ruchi Chaudhary(ruchichaudhary5@gmail.com)
 */

var flag = 0;
var uhtml = '<div id="myDiv" style="position:relative;"><h3>Enter Image URL or Choose Image</h3><form action="" name="editor_link_form" id="editor_link_form"><div style="padding:0; margin: 15px 0;"><label for="content">URL: </label><input type="hidden" name="name" value="link"><input type="text" placeholder="Enter image url.." name="content" id="rcontent_image" /></div><div style="padding:0; margin:32px 0 10px;"><label class="l-btn" for="e-image_image">Choose Image</label><input id="e-image_image" class="e-image_image" type="file" accept="image/*" onchange="uploadcustimage(this)" value="" name="e-image_image"><span class="editor-load"><img width="28" height="28" src="/assets/images/ajax_loader.gif"></span></div></form></div>';

CKEDITOR.plugins.add('custimage',{
	icons:'custimage',		
	init:function(editor){
		editor.addCommand('custimage', new CKEDITOR.dialogCommand('custimageDialog'));
		
		editor.ui.addButton('custimage',{
				label:editor.lang.common.image,
				command:'custimage',
				toolbar:'insert'
		});			
		
		if ( editor.contextMenu ) {
			editor.addMenuGroup( 'mygroup', 10 );
			editor.addMenuItem( 'My Dialog', {
				label : 'Open dialog',
				command : 'mydialog',
				group : 'mygroup'
			});
			editor.contextMenu.addListener( function( element ){			
				return { 'My Dialog' : CKEDITOR.TRISTATE_OFF };
			});
		}
		
		editor.on('afterCommandExec', function(e){			
			var cmdName = e.data.name;
			if(cmdName == 'custimage'){	
				var d = editor.getData();
				var nImg = $("<div>" +d +"</div>").find("img").length;
				if(nImg >= 3){				
					flag = 1;
				}else{
					flag = 0;
				}				
			}			
		});	
		
		CKEDITOR.dialog.add('custimageDialog',function(editor){
			// CKEDITOR.dialog.definition			
			var dialogDefinition =
			{
				title : 'Image Upload',
				minWidth : 390,
				minHeight : 130,
				contents : [
					{
						id : 'tab1',
						label : 'Label',
						title : 'Title',
						expand : true,
						padding : 0,
						elements :
						[
							{
								type: 'html',
								html: uhtml
							}							
						]
					}
				],
				buttons : [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ],
				onOk : function() {
					// "this" is now a CKEDITOR.dialog object.
					var document = this.getElement().getDocument();					
					var element = document.getById( 'rcontent_image' );					
					if ( element ){						
						var custimage = editor.document.createElement('img');						
						if(element.getValue() != ''){
							custimage.setAttribute('src', element.getValue());							
							editor.insertElement(custimage);
						}
					}
				},
				onShow : function() {					
					var document = this.getElement().getDocument();
					var element = document.getById('myDiv');
					if (element) {
						if(flag == 1){
							element.setHtml('<div class="e-one-image">Sorry!  You can only add more than 3 images.</div>');
						}else{
							element.setHtml(uhtml);
						}
					}
				}								
			};			
			return dialogDefinition;
		});
	}	
});
/* TO upload and save images on server and update */
function uploadcustimage(t){
	var formdata = false;
	if (window.FormData)	
		formdata = new FormData();
	
	var i = 0, len = t.files.length, file;
	for ( ; i < len; i++ ) {
		file = t.files[i];
		if (!!file.type.match(/image.*/)) {	
			if (formdata) {
				formdata.append("image_image", file);					
			}
			if (formdata) {				
				jQuery.ajax({
					url: upload.php,
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					dataType: 'json',
					beforeSend: function () {									
						$('#editor_link_form').find(".editor-load").show();
					}, complete: function () {						
						$('#editor_link_form').find(".editor-load").hide();
					}, success: function (d) {
						if (typeof (d.error) != "undefined") {
							if (d.error != "") {
								alert(d.error)
							}
						} else {
							alert(d.msg + "uplaod and saved sucessfully.");
						}
					}
				});
			}
		}
		else
		{
			alert('Not a vaild image!');
		}
	}	
}
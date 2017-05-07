var currentRel = 

{
g_xmlResource:'',
g_productlist:{},
g_productInScope:'',
g_scopeProductData:{},
g_currentCat:{},
g_currentProductCtx:{}/*current product context = li element*/    
}


function loadCat(arg){
    return currentRel.loadCat(arg);   
}

function loadTable(arg){ 
    return currentRel.loadTable(arg);
}

function addEntry(){
    
    return currentRel.addEntry();
}
function editEntry(){
    
    return currentRel.editEntry();
}
function deleteEntry(){ 
    return currentRel.deleteEntry();
}

function resetList(){ 
    return currentRel.resetList();
}
function loadModifyTable(arg){
    
    return currentRel.loadModifyTable(arg);
}

function entryDeleteSubmit(){
    
    return currentRel.entryDeleteSubmit();
}

function displayYear(arg){ 
    return currentRel.displayYear(arg);
}

function addProductSubmit(){
    return currentRel.addProductSubmit();
}

function delProductSubmit(){
    return currentRel.delProductSubmit();
}

function loadDynList(arg){
    return currentRel.loadDynList(arg);
}

function submitNewEntry(){
    return currentRel.submitNewEntry();
}

function entryChangeSubmit(arg){
    return currentRel.entryChangeSubmit(arg);
}


/*wrapper function */

(function(){
/*some initializations are required */
$(document).ready(function(){

/*trigger a click on first menu */
$('ul.navbar-nav li:first-child>a').click();

/*initialize date-picker */
currentRel.initDatepicker();

/*preload product list for later use */
currentRel.updateProductList();
//setTimeout(function(){$('div.panel-primary:first-child >div.panel-heading').click();}, 100); 
setTimeout(function(){$('div.panel-primary:first-child li:first-child').click();}, 100); 



});
currentRel.g_alertMsg = '<div class="alert alert-warning"><strong> No entry is selected</strong></div>';

currentRel.g_successMsg ='<div class="alert alert-success"><strong>Success! </strong>';
currentRel.g_errMsg = '<div class="alert alert-danger"><strong>Failed! </strong>';
currentRel.getEntity = function(elems, tag){
    
    return elems.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
    
}


/*LEARNING -- define a $.ajax returning function to create a deferred object later */
currentRel.getPdListDefer = function(){
    
    return $.ajax({
        url: 'data/cpereleases/product_list.xml',
        method: 'GET',   
    });
    
    
}

currentRel.initDatepicker=function(){
    
    
    $( ".date-picker" ).datepicker(
	  
	  {
	  //here we can't use yyyy-mm-dd, instead it will show year number twice.
	   dateFormat:"yy-mm-dd",
	   maxDate:"+10y",
	   minDate:"-10y"});
}


currentRel.updateProductList= function(){


    
    var xhttp = new XMLHttpRequest();
    var that = this;
xhttp.onreadystatechange= function(){

if (this.readyState==4 && this.status==200){

	var resp = this.responseXML;

    /*before update, reset the product list */
that.g_productlist={'ojpro':[], 'oj':[], 'pws':[], 'consumer':[], 'mobile':[] };
    
 for (var prop in that.g_productlist)
 {
  var list= resp.getElementsByTagName(prop)[0].getElementsByTagName('product');

   for (var i =0; i<list.length;i++)
   {
    that.g_productlist[prop].push(list[i].childNodes[0].nodeValue);

   }

 }
  
}
}

xhttp.open("GET", "data/cpereleases/product_list.xml");
xhttp.setRequestHeader("cache-control", "no-cache");
xhttp.send();
    
       
}

/*function to determine xml Database */
currentRel.xmlUrl = function(arg){
switch (arg)

{
case 'Officejet Pro':
this.g_xmlResource= "data/cpereleases/ojpro_release.xml"
return this.g_xmlResource;
break;

case 'Officejet':
this.g_xmlResource= "data/cpereleases/oj_release.xml"
return "data/cpereleases/oj_release.xml";
break;

case 'Pagewide':
this.g_xmlResource= "data/cpereleases/pws_release.xml"
return "data/cpereleases/pws_release.xml";
break;

case 'Consumer':
this.g_xmlResource= "data/cpereleases/ics_release.xml"
return "data/cpereleases/ics_release.xml";
break;

case 'Mobile':
this.g_xmlResource= "data/cpereleases/mobile_release.xml"
return "data/cpereleases/mobile_release.xml";
break;

default: 
return "data/cpereleases/oj_release.xml";
break;
}


};




/* reset the list when press Delete Product Again*/
currentRel.resetList=function(){

$('.cat-sel').val('--Please Select--');
document.getElementById('dyn-product-sel').innerHTML = '';
}

/* Display the fiscal year when slide bar moves */
currentRel.displayYear=function(value){
$('#add-product-status').html('');
document.getElementById('show-year').innerHTML = value;

}

/* load dynamic product list used in delete product modal */

currentRel.loadDynList=function(sel){


var list= [];
var selhtml='';
sel=sel.trim();
    
    
switch (sel)

{

case 'Officejet Pro':
list=this.g_productlist['ojpro'];
break;

case 'Officejet':
list=this.g_productlist['oj'];
break;

case 'Pagewide':
list=this.g_productlist['pws'];
break;

case 'Consumer':
list=this.g_productlist['consumer'];
break;

case 'Mobile':
list=this.g_productlist['mobile'];
break;

default:
list=[];
break;
}


list.forEach(function(elems){

selhtml+= '<option>' + elems +'</option>';


})

document.getElementById('dyn-product-sel').innerHTML = selhtml;


}


/*load category */
currentRel.loadCat=function(arg){
    
this.loadPartial(arg);
//setTimeout(function(){$('div.panel-primary:first-child >div.panel-heading').click();}, 100); 
setTimeout(function(){$('div.panel-primary:first-child li:first-child').click();}, 200);    
    
}


/*render the left navigation panel when product category selected */
currentRel.loadPartial=function(arg){

var cat = arg.innerHTML.trim();
var xhttp = new XMLHttpRequest();
var obj_list={};
var arr_years=[];
this.g_currentCat=arg;
var that = this;

$('li.nav-menu').css('background-color','#f8f8f8');
$('li.nav-menu a').css('color','#777');
$('li.'+arg.id).css('background-color','#337ab7');
$('a#'+arg.id).css('color','white');
/*wipe out existing release table - but why? */
//document.getElementById('release-content').innerHTML = '';


xhttp.onreadystatechange= function(){

if (this.readyState==4 && this.status==200){
 
	var xmlDoc=this.responseXML.getElementsByTagName('productlist')[0];

	var years = xmlDoc.getElementsByTagName('year');
    var products= xmlDoc.getElementsByTagName('product');

    for (var i=0; i <years.length; i++)
    {
       var temp= years[i].childNodes[0].nodeValue;;
       obj_list[temp]=[];
       
       for (var j=0; j <products.length; j++)
       {
         if (products[j].getAttribute('year')==temp)
         {
         	obj_list[temp].push(products[j].childNodes[0].nodeValue);

         }

       }

    }
    
    var panelgroup = '';

    var arr_years=Object.keys(obj_list);

    /* sort the arr_years to display the latest year first */
    /* for example: [2016, 2017, 2015] becomes [2017,2016,2015] */

    arr_years=arr_years.sort(function(a,b){
    	return b-a;
    })
     
    /* render the product list according to year */
    arr_years.forEach(function(year){
    var id= arg.id+ year;
    panelgroup+= '<div class="panel panel-primary"> <div class="panel panel-heading" data-toggle="collapse" data-target="#'+id+'"><center><h4>' +  year + '</h4></center></div> <div class="panel panel-body collapse in" id="'+id+'"><ul class="list-group">';
    
   obj_list[year].forEach(function(elems){

     panelgroup+= '<li class="list-group-item" onclick="loadTable(this)">'+ elems + '</li>';

    })

    panelgroup+='</ul></div></div>';


    });

    document.getElementById('product-group').innerHTML = panelgroup;

    /*select the first li element in the product list */
  

	
}
}

xhttp.open("GET", that.xmlUrl(cat));
xhttp.setRequestHeader("cache-control", "no-cache");
xhttp.send();
}


/* load the release table for specific product */
currentRel.loadTable=function(arg){


var name = arg.innerHTML;
this.g_currentProductCtx = arg;
var that = this;
    
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange= function(){

if (this.readyState==4 && this.status==200){

	that.renderTable(this.responseXML, name);
  
}
}

xhttp.open("GET", that.g_xmlResource);
xhttp.setRequestHeader("cache-control", "no-cache");
xhttp.send();
}

/* function to form up the release table */
currentRel.renderTable=function(response, pname){

/*parse the product name, example: ' Muscatel Lite ' become 'muscatelliteroot'*/
/*LEARNING -- need to use regex to replace all occurence, or else it will just replace the first occurence. */
//var tagname= pname.trim().replace(' ','').toLowerCase().concat('root');
var tagname= pname.trim().replace(/ /g,'').toLowerCase().concat('root');
this.g_productInScope=tagname;
var xmlDoc= response.getElementsByTagName(tagname)[0];
this.g_scopeProductData= xmlDoc;
/* store 'release' nodes in array */
var arr=xmlDoc.getElementsByTagName('release');


var tbl_header = '<h3>'+pname+'</h3><hr>'+'<table class="table table-stripped table-hover table-bordered">'+'<tr><th>VR#</th><th>Version</th><th>VR Date</th><th>AREL</th><th class="cell-sarel">SAREL</th><th>NAREL</th><th>Branch</th><th>Update Type</th><th>Released By</th></tr>';
var tbl_footer ='</table><input class="btn btn-success" value="Add" onclick="addEntry()">'+
                 ' <input class="btn btn-primary" value="Edit" onclick="editEntry()">'+
                  '<input class="btn btn-danger" value="Delete" onclick="deleteEntry()">';

 var tbl_body = '';


 for(var i=0; i<arr.length; i++){


 //x[i].getElementsByTagName("version")[0].childNodes[0].nodeValue
 tbl_body+= '<tr><td>'+ this.getEntity(arr[i], 'version')+'</td><td>'+this.getEntity(arr[i], 'fwversion')+'</td><td>'+
              this.getEntity(arr[i], 'date')+'</td><td><a href='+this.getEntity(arr[i], 'arel')+' target="_blank">Link</a></td><td class="cell-sarel"><a href='+
              this.getEntity(arr[i], 'sarel')+' target="_blank">Link</a></td><td><a href='+
              this.getEntity(arr[i], 'narel')+' target="_blank">Link</a></td><td>'+this.getEntity(arr[i], 'branch')+'</td><td>'+
              this.getEntity(arr[i], 'type')+'</td><td>'+this.getEntity(arr[i], 'owner')+'</td><tr>';
 };

 var table= tbl_header+ tbl_body+ tbl_footer;


document.getElementById('release-content').innerHTML = table;

/* check if the first .cell-sarel element is 'NA', if yes, hide the sarel cell */
if($('td.cell-sarel a').eq(0).attr('href') == 'NA')
    $('.cell-sarel').hide();

}


currentRel.addEntry=function(){
      /*LEARNI=functionNG - $() and element itself has different properties */
/* $() is a Jquery object which has all Jquery properties */
//console.log($(g_currentCat).html());
//  console.log(g_currentCat.textContent);
$('#add-entry-modal').modal('show');
    
    /*pass values to hidden input - product and category */

}

currentRel.editEntry=function(){
    
var category = this.g_currentCat.textContent;
var sel_list ='';
var sel_header ='<label> Choose a release to modify: </label> <select class="form-control" name="index" onchange="loadModifyTable(value)">';
var sel_footer = '</select><hr>';
var sel_body ='<option value="unset"> -- Select An Entry -- </option>';
        
var arr = this.g_scopeProductData.getElementsByTagName('release');

    
/* get select list */
    

var selectlist = [];
    
    /*clear the input form while entering */
 $('#edit-form').html(''); 
    
 for(var i=0; i<arr.length; i++){

 selectlist.push(this.getEntity(arr[i], 'version'));

 sel_body +=  '<option value="'+i+'">'+ this.getEntity(arr[i], 'version') + '</option>';
     
 };
    

sel_list = sel_header + sel_body + sel_footer;
    
//var tbl_content =  tbl_body ;

$('#select-box').html(sel_list);
    
$('#modify-entry-modal').modal('show');
    
/*LEARNING - $() and element itself has different properties */
/* $() is a Jquery object which has all Jquery properties */
//console.log($(g_currentCat).html());
//  console.log(g_currentCat.textContent);

    
}


/*Render the modify box */

currentRel.loadModifyTable=function(index){

if (index=='unset')
 $('#edit-form').html(''); 
    
else {
    
var data= this.g_scopeProductData.getElementsByTagName('release')[index];
var arr_label = ['VR#', 'Version', 'VR Date', 'AREL', 'SAREL','NAREL', 'Branch', 'Update Type', 'Released By'];
var form_header = '<div class="form-group">';
var form_footer= '<hr><input type="submit" class="btn btn-primary" value="Submit" onclick="entryChangeSubmit(event)"></div>';
var form_body='';
var i=0;
    
data.childNodes.forEach(function(prop){

/*LEARNING -- filter only those element node , or else it will also loop those text nodes created by XML formatting (the line break) */
/* the structure: element '<version>VR1</version> /n' contains 2 nodes: (1). #text -line break (2).element
*/
if (prop.nodeType ==1)
{

var x='';
var y='';
    
if(i==2)
    y=' date-picker';
    
if (i==4)
    x='<small><em>--Leave it as "NA" or blank if not applicable</em></small>';
    
form_body += '<label>'+ arr_label[i] + x +'</label>'+'<input type="text" class="form-control modify-form'+y+'" name="'+ prop.nodeName
    + '" value="'+ prop.textContent+'">';
    i++;
}

})
    
$('#edit-form').html(form_header+ form_body+form_footer);
currentRel.initDatepicker();
}

}


/* Delete release entry function */

currentRel.deleteEntry=function(){
    
    var ckbox ='';
    var ckbox_header='<select class="form-control" id="select-del-entry" name="deletion">';
    var options ='<option value="unset"> --Please select an entry --</option>';
    var ckbox_footer= '</select><br>'

  var data= this.g_scopeProductData.getElementsByTagName('release');
 /*LEARNING --data will be a HTMLcollection in this case,
 alternative is to use g_scopeProductData.childNodes, which will create a nodelist --- this is a better way 

  below is the other alternative for Array.prototype
 [].forEach.call(data, function(child){ 
Array.prototype.forEach.call(data, function(child, index){ */
    
    [].forEach.call(data, function(child,index){ 
        /* Childnode is [1,3] not [0,2], because XML file is formated with line-break */
        var version = child.childNodes[1].innerHTML;
        var fwversion = child.childNodes[3].innerHTML;
        options += '<option value="'+index +'">'+version + ' -- [' + fwversion +']';
          
    })
    
    var ckbox = ckbox_header + options + ckbox_footer;
    
    $('#delete-modal-body').html(ckbox);
    $('#delete-entry-modal').modal('show');
      
  }

currentRel.addProductSubmit=function(){
    
    var form_data = $('#add-product-form').serialize();;
    var successMsg= this.g_successMsg;
    var errMsg = this.g_errMsg;
    var that = this;
    
    /*LEARNING -- be careful with dataType (expected response format) and contentType (data sending format)*/
    /*.success() and .error() are deprecated after Jquery 1.8, so use .fail() and .done() instead */
    /*clear the feedback message when add another product */

    
    
    $.ajax({
        url: 'php/rel/add_product.php',
        data: form_data,
        method: 'POST',
        //dataType: 'string', /* return data type: no need to define it as client will detect automatically */
        contentType: 'application/x-www-form-urlencoded'
        
    }).done(function(data){
    
       // loadPartial();
        var fb = JSON.parse(data);
        successMsg += fb.product +' has been added to ['+fb.cat+'] successfully!</div>';
        that.loadPartial(that.g_currentCat);
        $('#add-product-status').html(successMsg);
        /*don't forget to update product list */
       that.updateProductList();
    
        
    }).fail(function(xhr,status, err){

        errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
        
     $('#add-product-status').html(errMsg);
        
    }).always(function(xhr,status,err){
        
        
        document.addEventListener('click', function(){
            
               $('#add-product-status').html(''); 
            
        })
        
        
    });
       
    
}


/*submit delete product job */
    

currentRel.delProductSubmit=function(){
    
var formdata = $('#del-product-form').serialize();
    
    var successMsg= this.g_successMsg;
    var errMsg = this.g_errMsg;
    var that = this;
    

$.ajax({

    url: 'php/rel/delete_product.php',
    method: 'POST',
    data: formdata,
    contentType: 'application/x-www-form-urlencoded'
    })
    .done(function(data){
    
    /*load updated product list */
    that.loadPartial(that.g_currentCat);
    
    /*delete the current table if this product is deleted */
    if(that.g_currentProductCtx.innerHTML == $('#dyn-product-sel').val() )
        document.getElementById('release-content').innerHTML = '';
        
    
    var fb= JSON.parse(data);
    successMsg += fb.product +' has been removed from ['+fb.cat+'] successfully!</div>';
    
    $('#del-product-status').html(successMsg);
    
     /*don't forget to update product list */

    /*LEARNING -- reload the product delete list after the list been updated,need to use deferred promise here, while $.when() create a Deferred object, and when it is resolved, then reload the product list */
    
    $.when(that.getPdListDefer()).then( function(resp){
            
    /*before update, reset the product list */
  that.g_productlist={'ojpro':[], 'oj':[], 'pws':[], 'consumer':[], 'mobile':[] };
    
  for (var prop in that.g_productlist)
  {
   var list= resp.getElementsByTagName(prop)[0].getElementsByTagName('product');

   for (var i =0; i<list.length;i++)
   {
    that.g_productlist[prop].push(list[i].childNodes[0].nodeValue);

   }

 } 
        
            that.loadDynList(fb.cat);} );
       

}).fail(function(xhr, status, err){
    
      errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
        
     $('#del-product-status').html(errMsg);
    
    
}).always(function(xhr, status,err){
    
    document.addEventListener('click', function(){
        
          $('#del-product-status').html('');   
        
    })
    
    
})
    
    
    /*ajax call end */

}

currentRel.submitNewEntry=function(){
    
var formdata= $('#form-add-release').serialize()+'&product='+this.g_productInScope+'&cat='+this.g_currentCat.innerHTML;

console.log(formdata);
var successMsg= this.g_successMsg;
var errMsg = this.g_errMsg;
    var that= this;
    
$.ajax({
    url: 'php/rel/add_release.php',
    method:'POST',
    data: formdata,
    contentType: 'application/x-www-form-urlencoded'
    
}).done(function(resp){
    var fb= JSON.parse(resp);
    successMsg += '['+fb.version+']'+fb.fwversion+' has been added! </div>';
    that.loadTable(that.g_currentProductCtx);
    $('#add-release-status').html(successMsg);
    document.addEventListener('click', function(){
        
    $('#add-release-status').html('');
        
    });
    
    
}).fail(function(xhr,status, err){
    
    errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
    
    $('#add-release-status').html(errMsg);
     document.addEventListener('click', function(){
        
    $('#add-release-status').html('');
        
    });
    
});
    
    
    
}

currentRel.entryChangeSubmit=function(e){

/* prevent default action to close the modal */
e.preventDefault();

var successMsg= this.g_successMsg;
var errMsg = this.g_errMsg;
    
    var that = this;
 
/* LEARNING.serialize() only works on certain type of DOM, such as <form> */
var formdata= $('#form-edit-entry').serialize() + '&product='+that.g_productInScope +'&cat='+that.g_currentCat.innerHTML;
    
$.ajax({
    url:'php/rel/edit_release.php',
    method: 'POST',
    data: formdata
  
}).done(function(fb){

successMsg += fb+ ' has been modified! </div>';
that.loadTable(that.g_currentProductCtx);
$('#edit-release-status').html(successMsg);
        
}).fail(function(xhr,status, err){
    
    errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
    
    $('#edit-release-status').html(errMsg);

    
}).always(function(xhr,status,err){
        
    $('#select-box select').val('unset');
    $('#select-box select').trigger('onchange');
    document.addEventListener('click', function(){
    
    $('#edit-release-status').html('');  
        
        
    })
        
    
});
       
}

currentRel.entryDeleteSubmit= function(){
    
    var formdata= $('#select-del-entry').serialize() + '&product='+this.g_productInScope +'&cat='+this.g_currentCat.innerHTML;
    var successMsg= this.g_successMsg;
    var errMsg = this.g_errMsg;
    var that = this;
    if ($('#select-del-entry').val() =="unset")
    {
      $('#del-release-alert').html(this.g_alertMsg);
    /*add Jquery event listener to clear the alert message once new input given in select box */
      $('#select-del-entry').change(function(){
           $('#del-release-alert').html('');    
          
      })
    
    
    }
    
     else{
         
    $('#del-release-alert').html('');
    
    $.ajax({
        url: 'php/rel/delete_release.php',
        method:'POST',
        data:formdata   
    }).done(function(resp){
        
        var fb = JSON.parse(resp);
        successMsg += fb.version+' has been removed!';
        that.loadTable(that.g_currentProductCtx);
        /*LEARNING - instead of AJAX call, can remove the option from the DOM in the modal, which is much more efficient */
         $('#select-del-entry option').get(Number(fb.index)+1).remove();
        $('#del-release-status').html(successMsg);
        
    }).fail(function(xhr, status, err){
        
     errMsg +='Status= '+status+ ' Error= '+ err + '</div>';
    
    $('#edit-release-status').html(errMsg);
        
    }).always(function(xhr,status,err){
        
             
    $('#select-del-entry').val('unset');
    $('#select-del-entry').trigger('onchange');
    document.addEventListener('click', function(){
    $('#del-release-status').html('');  
        
        
    })   
        
        
    });
        
    }


    
}

})();





/*clear the feedback message when add another product */
/*var elems=document.getElementById('input-product-add');
console.log(elems);
elems.addEventListener('focus', function(){
 $('#add-product-status').html('');   
     
})*/

//getEntity(arr[i], 'version')); 
    
		
	
	
	
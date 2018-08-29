/*通过id获取元素
 *  id  string  元素的id名  必须  
 * */
function $id(id){
	return document.getElementById(id);
}

/*通过标签名获取元素集合
 *   tagName  string  标签名  必须
 *    parent  DOMobject 父级元素对象  可有可无
 * */
function $tag(tagName,parent){
	var parent = parent || document;
	return parent.getElementsByTagName(tagName);
}

/*通过class名获取元素集合
 *   className  string  class名  必须
 *    parent  DOMobject 父级元素对象  可有可无
 * */
function $class(className,parent){
	var parent = parent || document;
	return parent.getElementsByClassName(className);
}

/*获取元素外部样式
 
 * obj  DOMobject 获取样式的元素 必须
 * attr string  属性名  必须
 * */
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		//第二个参数false指的是是否存在伪元素
		return window.getComputedStyle(obj,false)[attr];
	}
}

/*  让元素居中
 *  obj 居中元素 
 *  parent 父级的居中范围的元素对象  不传默认是body
 * */
function showCenter(obj,parent){
	//var parent = parent || document.body;
	obj.style.display = "block";
	var parentWidth,parentHeight;
	if(parent){
		//如果有parent
		parentWidth = parent.clientWidth;
		parentHeight = parent.clientHeight;
	}else{
		//body
		parentWidth = getBody().width;
		parentHeight = getBody().height;
	}
	//obj在parent范围内垂直水平居中
	var left = (parentWidth - obj.offsetWidth)/2;
	var top = (parentHeight - obj.offsetHeight)/2;
	obj.style.left = left + "px";
	obj.style.top = top + "px";
	
	window.onresize = function(){
		showCenter(obj);
	}
}

/*获取浏览器宽高
 
 * */
function getBody(){
	return {
		width : document.documentElement.clientWidth || document.body.clientWidth,
		height: document.documentElement.clientHeight || document.body.clientHeight
	};
}

/*事件监听
 *  obj 事件触发对象 DOMobject  必须
 *  type 事件类型  不带 “on”的字符串  必须
 *  fn  事件处理函数 function 必须
 *  isCapture  是否捕获  不传的话默认是false（冒泡）
 * */
function addEvent(obj,type,fn,isCapture){
	if(typeof isCapture == "undefined") isCapture = false;
	if(obj.addEventListener){
		obj.addEventListener(type,fn,isCapture);
	}else{
		obj.attachEvent("on"+type,fn);
	}
}

/*移除事件监听
 *  obj 事件触发对象 DOMobject  必须
 *  type 事件类型  不带 “on”的字符串  必须
 *  fn  事件处理函数 function 必须
 * */
function removeEvent(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn);
	}else{
		obj.detachEvent(type,fn);
	}
}

//创建div
function createDiv(className){
	var div = document.createElement("div");
	div.className = className;
	document.body.appendChild(div);
	return div;
}

window.onload = function(){
	new Engine();
}

function Engine(){
	this.ele = $id("body_main");
	this.init();
}

Engine.prototype.init = function(){

	var _this = this;
	var aLi = $id("options").children;

	for (var i = 0; i < aLi.length; i++) {
		//获取游戏难度
		aLi[i].onclick = function(){
			
			_this.hard = this.value;
			this.parentNode.remove();
			_this.startAnimation();
		}
	}
}

//开场动画
Engine.prototype.startAnimation = function(){
	//创建logo和加载动画
	var logo = createDiv("logo");
	var loading = createDiv("loading");

	//执行开场加载动画
	var index = 0;
	var loadingTimer = setInterval(function(){
		loading.style.background = "url(images/loading"+ ((index++)%3+1) +".png)";
	},500);

	//背景移动
	var y = 0;
	this.bgTimer = setInterval(function(){
		this.ele.style.backgroundPositionY = -(y+= 10/this.hard)+"px";
	}.bind(this),30);

	//开场动画3秒后结束
	var animationTimer = setTimeout(function(){
		clearTimeout(loadingTimer);
		logo.remove();
		loading.remove();
		//游戏开始
		this.startGame();
	}.bind(this),3000);
}

//开始游戏
Engine.prototype.startGame = function(){
	plain.init(this.ele).move().fire(this.hard);
	this.createEnemy();
}

//创建敌机
Engine.prototype.createEnemy = function(){
	setInterval(function(){
		var rand = Math.random();

		// 50%小型1  20%中型2  10%大型3 20%不出现飞机
 		if(rand > 0.5) new Enemy(1, this.ele).init();
		else if(rand > 0.3) new Enemy(2, this.ele).init();
		else if(rand > 0.2) new Enemy(3, this.ele).init();

	}.bind(this),500);
}

var plain = {
	aBullts:[],
	init: function(bodyMain){
		this.bodyMain = bodyMain;
		this.ele = createDiv("my-warplain");
		this.ele.style.bottom = 0;
		this.ele.style.left = (getBody().width - this.ele.offsetWidth)/2 + "px";
		return this;
	},
	move: function(){
		document.onmousemove = function(e){
			var top = e.clientY - this.ele.offsetHeight/2,
				left = e.clientX - this.ele.offsetWidth/2,
				minLeft = this.bodyMain.offsetLeft,
				maxLeft = this.bodyMain.offsetLeft + this.bodyMain.offsetWidth - this.ele.offsetWidth;
			left = left<minLeft? minLeft : left>maxLeft?maxLeft:left;
			top = top<0? 0: top;
			this.ele.style.top = top + "px";
			this.ele.style.left = left + "px";
		}.bind(this);
		return this;
	},
	fire: function(hard){
		var time = (1/hard)*400;
		setInterval(function(){
			this.aBullts.push(new Bullet().init());
		}.bind(this),time);
		
	}
}

function Bullet(){

}

Bullet.prototype = {
	constructor: Bullet,
	init: function(){
		//创建子弹，初始化
		this.ele = createDiv("bullet");
		this.ele.style.left = plain.ele.offsetLeft + plain.ele.offsetWidth/2 - this.ele.offsetWidth/2 + "px";
		this.ele.style.top = plain.ele.offsetTop - this.ele.offsetHeight + "px";
		this.move();
		return this;
	},
	move: function(){
		//子弹飞行
		this.timer = setInterval(function(){
			this.ele.style.top = this.ele.offsetTop - 10 + "px";
			if(this.ele.offsetTop < -20){
				clearInterval(this.timer);
				this.die();
			}
		}.bind(this),30);
	},
	die: function(){
		this.ele.className = "bullet_die";
		clearInterval(this.timer);
		setTimeout(function(){
			this.ele.className = "bullet_die2";
			setTimeout(function(){
				document.body.removeChild(this.ele);
			}.bind(this),100);
		}.bind(this),100);

		
		//从数组中移除
		for(var i = 0; i < plain.aBullts.length; i++){
			if(this === plain.aBullts[i]){
				plain.aBullts.splice(i,1);
			}
		}
	}
}

//敌机
class Enemy{
	constructor(type,bodyMain){
		this.type = type;
		this.bodyMain = bodyMain;
	}
	init(){
		//根据type创建不同类型的敌机
		switch(this.type){
			case 1: 
				this.ele = createDiv("enemy-small");
				this.speed = 5;
				this.hp = 1;
			break;
			case 2: 
				this.ele = createDiv("enemy-middle");
				this.speed = 3;
				this.hp = 6;
			break;
			case 3: 
				this.ele = createDiv("enemy-large");
				this.speed = 1;
				this.hp = 15;
			break;
		}

		//敌机初始位置
		this.ele.style.top = "0px";
		var left = Math.random()*(this.bodyMain.offsetWidth - this.ele.offsetWidth) + this.bodyMain.offsetLeft;
		this.ele.style.left = left + "px";

		this.move();

	}
	move(){
		this.timer = setInterval(function(){
			this.ele.style.top = this.ele.offsetTop + this.speed + "px";
			if(this.ele.offsetTop > this.bodyMain.offsetHeight){
				this.die();
			}
			
			//跟子弹碰撞检测
			var eTop = this.ele.offsetTop,
				eBottom = eTop + this.ele.offsetHeight,
				eLeft = this.ele.offsetLeft,
				eRight = eLeft + this.ele.offsetWidth;

			for(var i = 0; i < plain.aBullts.length; i++){
				var bTop = plain.aBullts[i].ele.offsetTop,
					bLeft = plain.aBullts[i].ele.offsetLeft,
					bRight = bLeft + plain.aBullts[i].ele.offsetWidth;
				console.log(bTop,bLeft,bRight);
				if(eBottom > bTop && bLeft > eLeft && bRight < eRight){
					if(--this.hp==0){
						this.die();
					}
					
					plain.aBullts[i].die();

				}
			}

			//跟战机碰撞检测
			var pLeft = plain.ele.offsetLeft,
				pRight = plain.ele.offsetLeft + plain.ele.offsetWidth,
				pTop = plain.ele.offsetTop,
				pBottom = plain.ele.offsetTop + plain.ele.offsetHeight;
			//console.log(pLeft);
			if( !(eLeft > pRight || pLeft > eRight || eTop > pBottom || pTop > eBottom) ){
				if(confirm("你死了，从新开始吗？")){
					location.reload();
				}
			}

		}.bind(this),30);
	}
	die(){
		clearInterval(this.timer);
		document.body.removeChild(this.ele);
	}
}
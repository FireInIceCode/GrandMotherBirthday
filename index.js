function start(){
	document.querySelector('.bg').classList.add('fly');
	var canvas=document.getElementById('canvas');
	canvas.width=window.innerWidth;
	canvas.height=window.innerHeight;
	world=new cp.World((ctx,canvas)=>{
		ctx.clearRect(0,0,canvas.width,canvas.height);
	});
	const size=10;
	var emitter=new cp.PointCircleEmitter(canvas.width/2,canvas.height/2,100,new cp.BallPaintFunc(size,null,true));
	// world.addForce(cp.forces.getMouseAwayForce(canvas,10000,100));
	for(var i=0;i<900;i++){
		var particle=emitter.emit();
		world.addParticle(particle);
		(function(){
			var pa=particle;
			var action=new cp.Action(cp.getReBoundFunc(100,canvas.height-size,0.3));
			pa.addAction(action,false);
			action.type='rebound';
			action.start();
			action.doing=false;
			setTimeout(()=>{
				cp.scaleInOut(pa,1,1.5,0.5,cp.easeFunctions['easeInOut']);
			},parseInt(Math.random()*1000));
		})();
	};
	world.init(canvas,60);
	for(var particle of world.particles){
		particle.enableShade=true;
		particle.minShadeDis=15;
		particle.getShadeStep=cp.getBasicShadeStepGetter((obj,t)=>{
			obj.alpha-=t/2;
			obj.scale-=t;
			return true;
		},0.6);
	}
	var pos_gener=new cp.PosGenerator();
	var poses=[],str=["祝","姥姥","福","如","东","海","长","流","水","寿","比","南","山","不","老","松"];
	for(var i=0;i<str.length;i++){
		var len=str[i].length;
		poses.push(pos_gener.getPosFromText(str[i],'30px 微软雅黑',true,15,(canvas.width-30*15*len)/2,(canvas.height-30*15)/2));//todo: set x,y
	}
	var dfunc=cp.distributes.getLineDistribute(cp.easeFunctions['easeInOutBack']);
	// var dfunc=cp.distributes.getCircleDistribute(cp.easeFunctions['easeInOutBack']);
	var tdfunc=(particle, pos, time)=>{
		particle.enableForce=false;	
		for(var a of particle.actions){
			if(a.type=='rebound'){
				a.doing=false;
			}
		}
		dfunc(particle,pos,time);
	}
	
	var spfunc=(particle,t)=>{
		particle.vy=0;
		for(var a of particle.actions){
			if(a.type=='rebound'){
				a.start();
			}
		}
	}
	var nfunc=(pos,time)=>{};
	var i=0;
	setInterval(()=>{
		world.distributePosByDistance(poses[i],2,tdfunc,spfunc,nfunc,size);
		i=(i+1)%poses.length;
		console.log(i);
	},4000);
	document.getElementById('audio').play();
}

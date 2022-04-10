function start(){
	document.querySelector('.bg').classList.add('fly');
	var canvas=document.getElementById('canvas');
	canvas.width=window.innerWidth;
	canvas.height=window.innerHeight;
	world=new cp.World((ctx,canvas)=>{
		ctx.clearRect(0,0,canvas.width,canvas.height);
	});
	const size=7;
	var emitter=new cp.PointCircleEmitter(canvas.width/2,canvas.height/2,100,new cp.BallPaintFunc(size,null,true));
	// world.addForce(cp.forces.getMouseAwayForce(canvas,10000,100));
	for(var i=0;i<1500;i++){
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
		},1);
	}
	var pos_gener=new cp.PosGenerator();
	var poses=[],str="祝姥姥福如东海长流水寿比南山不老松";
	for(var i=0;i<str.length;i++){
		poses.push(pos_gener.getPosFromText(str[i],'50px 微软雅黑',true,10,(canvas.width-500)/2,(canvas.height-500)/2));//todo: set x,y
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
		world.distributePosByDistance(poses[i],2,tdfunc,spfunc,nfunc,6);
		i=(i+1)%poses.length;
	},4000);
	document.getElementById('audio').play();
}

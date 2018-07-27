module.exports = function (that, args, lasting){
    if(!lasting){
    	clearTimeout(that[args.timerName]);
	    that[args.timerName] = setTimeout(function (){
	    	var data = {};
	    	for (var k in args) {
	    		if(args.hasOwnProperty(k) && k.match(/^show/)){
	    			data[k] = null;
	    		}
	    	}
	        that.setData(data);
	    }, args.delayed || 3000);
    }
    that.setData(args);
}

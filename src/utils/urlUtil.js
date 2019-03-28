
export function strToJson(str, firstSep, secordSep){
	var res = {};
	if(!str){
		return res;
	}
	var s = str.split(firstSep);
	for(var i=0;i<s.length;i++){
		var ss = s[i].split(secordSep);
		if(ss.length<2){
			continue;
		}
		res[ss[0]]=ss[1];
	}
	return res;
}

export function getQueryParam(){
	return strToJson(document.location.search.replace("?", ""), "&", "=");
}

export function addUrlParam(url, param){
	if(!url || !param){
		return url;
	}
	if(Array.isArray(param)){
		
	}else if(param instanceof Object){
		
	}else{
		return url;
	}
	return strToJson(document.location.search.replace("?", ""), "&", "=");
}
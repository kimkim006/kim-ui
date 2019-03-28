
import $ from 'jquery';
import { Message } from 'element-ui';
import {agentRestCheckFor, agentRestCheckTurn, agentRestGiveUp, agentRest_End, agentRest_Start, 
		agentRestApply, sendMessage, updateIsTransIvr, initService, insertAgentNotReady, 
		updateConnect, disctConnect, updateRecordId, insertRoadData, initAgentInfo, initConfigParams} from './softPhoneApi';

export function BqjrSp(_selector, _op){
	
	if(!_selector){
		return null;
	}
	
	var spObject = null;//软电话操作对象
	var bqjrSp = null;//软电话
	var bqjrSptext = new Array();//软电话标题数组
	var isInited = false;//是否已经初始过
	var selector = _selector;
	var op = {
		updateFenjiSpan: ()=>{},
		updateAgentStateSpan: ()=>{},
		updateBqjrSpStatusTime: ()=>{},
		updateCustomerCallParty: ()=>{},
		updateBqjrSpConnectTime: ()=>{},
		updateAgentIsReady: ()=>{},
		updateBqjrSpServiceNo: ()=>{},	
		updateBuMenZhuanShow: ()=>{},
		openCallDialog: ()=>{},
		openCallScreen: ()=>{},
	};
	
	if(_op){
		op = $.extend(true, op, _op);
	}
	
	if(isInited && spObject){
		return spObject;
	}
	
	/**
	 * 打开来电弹屏界面
	 */
	var openCallScreenFunc = function(str, type){
		if(op.openCallScreen && op.openCallScreen instanceof Function){
			op.openCallScreen(str, type);
		}
	};
	/**
	 * 关闭来电弹屏界面
	 */
	var closeCallScreenFunc = function(str, type){
		if(op.closeCallScreen && op.closeCallScreen instanceof Function){
			op.closeCallScreen(str, type);
		}
	};
	
	/**
	 * 打开拨号界面
	 */
	var openCallDialogFunc = function(str, type){
		if(op.openCallDialog && op.openCallDialog instanceof Function){
			op.openCallDialog(str, type);
		}
	};
	/**
	 * 更新 分机号 显示的方法
	 */
	var updateFenjiSpanFunc = function(str){
		if(op.updateFenjiSpan && op.updateFenjiSpan instanceof Function){
			op.updateFenjiSpan(str);
		}
	};
	/**
	 * 更新 坐席状态 显示的方法
	 */
	var updateAgentStateSpanFunc = function(str){
		if(op.updateAgentStateSpan && op.updateAgentStateSpan instanceof Function){
			op.updateAgentStateSpan(bqjrSpStatusName);
		}
	};
	/**
	 * 更新 时长 显示的方法
	 */
	var updateBqjrSpStatusTimeFunc = function(str){
		if(op.updateBqjrSpStatusTime && op.updateBqjrSpStatusTime instanceof Function){
			op.updateBqjrSpStatusTime(str);
		}
	};
	/**
	 * 更新 客户号码 显示的方法
	 */
	var updateCustomerCallPartyFunc = function(str){
		if(op.updateCustomerCallParty && op.updateCustomerCallParty instanceof Function){
			op.updateCustomerCallParty(str);
		}
	};
	/**
	 * 更新 连接时长 显示的方法
	 */
	var updateBqjrSpConnectTimeFunc = function(str){
		if(op.updateBqjrSpConnectTime && op.updateBqjrSpConnectTime instanceof Function){
			op.updateBqjrSpConnectTime(str);
		}
	};
	/**
	 * 更新 挂机后不就绪 显示的方法
	 */
	var updateAgentIsReadyFunc = function(str){
		if(op.updateAgentIsReady && op.updateAgentIsReady instanceof Function){
			op.updateAgentIsReady(str);
		}
	};
	/**
	 * 更新 挂机后不就绪 可点击的方法
	 */
	var updateAgentIsReadyDisabledFunc = function(str){
		if(op.updateAgentIsReadyDisabled && op.updateAgentIsReadyDisabled instanceof Function){
			op.updateAgentIsReadyDisabled(str);
		}
	};
	/**
	 * 更新 进线号码  显示的方法
	 */
	var updateBqjrSpServiceNoFunc = function(str){
		if(op.updateBqjrSpServiceNo && op.updateBqjrSpServiceNo instanceof Function){
			op.updateBqjrSpServiceNo(str);
		}
	};
	/**
	 * 更新 部门转案  显示的方法
	 */
	var updateBuMenZhuanShowFunc = function(str){
		if(op.updateBuMenZhuanShow && op.updateBuMenZhuanShow instanceof Function){
			op.updateBuMenZhuanShow(str);
		}
	};
	
	//软电话配置
	var xtoolboxConfig = {};
	var agentConfig = {};
	$.extend(true, agentConfig, _op.agentConfig);
	$.extend(true, xtoolboxConfig, _op.xtoolboxConfig);
	
	var extension = '';
	var agentForRest = agentConfig.agentForRest;
	var agentReadyTime = agentConfig.agentReadyTime;
	var agentId = agentConfig.agentId;
	var outBoundCallPrefix = agentConfig.outBoundCallPrefix;
	
	// 是否使用软电话
	var isHasSoftPhone = agentConfig.agentId && agentConfig.extension;	
	var hasXToolBox = true;	//是否使用XToolBox控件
	var ctiIpPort = agentConfig.ctiIpPort; //主登录CTI地址
	var ctiIpPortExt = agentConfig.ctiIpPortExt; //备用登录CTI地址
	
	var enablePhoneLog = agentConfig.enableLog? "true" : "false";
	var enableSendStatus = agentConfig.enableSendStatus? "true" : "false";
	var sendStatusAddress = agentConfig.sendStatusAddress; //软电话状态发送地址
	var platformType = agentConfig.platformType; // 平台类型
	var platformId = agentConfig.platformId; // 平台ID
	var recordType = agentConfig.recordType; // 录音平台类型
	var recordPlatformId = agentConfig.recordPlatformId; // 录音平台ID
	var agentType = agentConfig.agentType; //座席类型
	var reportAgentId = agentConfig.reportAgentId; //是否播报工号
	var reportAgentIdIvr = agentConfig.reportAgentIdIvr; //播报工号IVR号码
	var autoAnswer = agentConfig.autoAnswer; //是否自动接听
	var enableManage = agentConfig.enableManage; //是否有管理功能
	var wrapupTimeOut = agentConfig.wrapupTimeOut; //是否有后处理倒计时
	var wrapupTimer = agentConfig.wrapupTimer; //后处理倒计时长
	var enableIvr = agentConfig.enableIvr; //是否挂机自动转满意度 1.是  0.否
	var ivrServerId = agentConfig.ivrServerId;//满意度ivr的serverId
	var outBoundCallPrefix = agentConfig.outBoundCallPrefix;//满意度ivr的serverId
	var userId = agentConfig.userId; // 用户ID
	var tenantId = agentConfig.tenantId; // 租户ID
	// agentId = agentConfig.agentId; // 坐席工号
	// organId = ""; // 用户机构
	// agentReadyTime = "10";
	
	/*	12201	空闲
		12202	摘机呼出
		12203	振铃
		12204	呼出占中继
		12205	通话中
		12206	回铃
		12207	保持
		12208	被保持
		12209	等待手动挂机
		12210	咨询等待
		12211	咨询
		12212	会议
		12213	会议满
		12219	会议等待
		12220	会议咨询
		12221	咨询呼出
		12222	会议咨询呼出、
	*/
	var extensionStatus = null;//分机状态 
	
	/*	12001	未登录
		12002	就绪
		12003	未就绪
		12004	忙
		12005	事后处理
	*/
	var agentState = null ;//座席状态
	
	var serviceId = null;//服务记录ID
	var ani =null;//主叫
	var dnis = null;//被叫
	var recordId = null;//录音主键
	var serviceNo = null;//接入号
	var callType = null;//呼叫类型
	var outIsScreen = false;//外呼是否弹屏
	var isOutBound = false;//是否外呼
	var serviceType = null;//服务类型 1电话 2短信 3APP
	var otherParty =  null;//客户电话号码
	var customerCallId = null;//通话唯一标示
	var isConnect = true;//是否正真的连接
	/*UUI=101,13489518661,210281197901254623
	101 第一位为按键值，第二位为是否通过手机验证，0否，1是。第三位为是否通过是否身份证验证，0否，1是
	13489518661 手机号
	210281197901254623 身份证号*/
	var roadData = null;//随路数据
	var bqjrSpStatusName = null;//用于座席状态时长显示
	var bqjrSpStatusTime = 0;//用于显示分机状态时长
	var bqjrSpConnectTime = 0;//通话开始计时
	var bqjrSpConnectTimeI = false;//记录计时对象
	var isMeeting = false;//是否会议
	
	//座席小休申请
	var isrealAgentRest = false;//
	var agentRestStart = true;
	var isClickRest = false;
	var isRestQueue = false;
	
	/**
	 * 设置连接时长
	 */
	function setbqjrSpConnectTime(){
	    bqjrSpConnectTime = bqjrSpConnectTime+1;
	    if(otherParty!=null || otherParty!=""){
	    	updateCustomerCallPartyFunc(otherParty);
	        //document.getElementById("CustomerCallParty").innerHTML = otherParty;
	    }
	    var hour = parseInt(bqjrSpConnectTime / 3600);// 小时数
	    if(hour < 10) hour = "0"+hour;
	    var minute = parseInt(bqjrSpConnectTime / 60);// 分钟数
	    if(minute>=60){
	        minute=minute%60;
	    }
	    if(minute < 10) minute = "0"+minute;
	    var second = bqjrSpConnectTime % 60;
	    if(second < 10) second = "0"+second;
	    updateBqjrSpConnectTimeFunc(hour + " : " + minute + " : " + second);
	    //document.getElementById("bqjrSpConnectTime").innerHTML = hour + ":" + minute + ":" + second;
	}
	
	/**
	 * 获取显示座席状态、客户号码
	 */
	function getAgentChange(){
	    var data = bqjrSp.GetStatusText().split(",");
	    if(bqjrSpStatusName != data[1]){
	        bqjrSpStatusName = data[1];
	        updateAgentStateSpanFunc(bqjrSpStatusName);
	        //document.getElementById("AgentStateSpan").innerHTML=bqjrSpStatusName;
	        bqjrSpStatusTime = 0;
	    }
	    bqjrSpStatusTime = bqjrSpStatusTime + 1;
	    var hour = parseInt(bqjrSpStatusTime / 3600);// 小时数
	    if(hour < 10) hour = "0"+hour;
	    var minute = parseInt(bqjrSpStatusTime / 60);// 分钟数
	    if(minute>=60){
	        minute=minute%60;
	    }
	    if(minute < 10) minute = "0"+minute;
	    var second = bqjrSpStatusTime % 60;
	    if(second < 10) second = "0"+second;
	    updateBqjrSpStatusTimeFunc(hour + " : " + minute + " : " + second);
	    //document.getElementById("bqjrSpStatusTime").innerHTML= hour + ":" + minute + ":" + second;
	    if(bqjrSpConnectTimeI){
	        setbqjrSpConnectTime();
	    }
	}
	
	/**
	 * 软电话服务启动
	 */
	function InService(){
	    bqjrSp.CallBarVisible(false);//呼叫状态栏是否显示
	    bqjrSp.CaptionVisible(false);//标题栏是否显示
	    bqjrSp.StatusBarVisible(false);//状态栏是否显示
	//	bqjrSp.AgentStateRegionVisible(false);//座席状态操作区是否显示
	//	bqjrSp.CallControlRegionVisible(false);//话路控制操作区是否显示
	
	    //触发OnInService事件后指向该方法，继而进行初始化的动作
	    bqjrSp.SetLogInAgentState(1103);//在初始化之前首先设置登录后的第一个状态，1103为未就绪，1104为就绪
	    bqjrSp.SetIVRNo("T40001");
	    var retCode = bqjrSp.SPInit(agentId,1);//初始化，第一个参数是工号，第二个参数是acd模式，1为硬acd，2为软acd
	//	bqjrSp.MonDataStop();
	//	bqjrSp.MonDataStart();
	    if (retCode > 1){
	    	Message.error({message: '软电话初始失败:'+retCode, showClose: true});
	        //alert(retCode);  //若初始化不成功，则弹出初始化的返回值
	    }else{
	        bqjrSp.AgentLogin();
	        bqjrSptext = bqjrSp.GetCaptionText().split(",");
	        var agentInfo = {
	        	AgentID: bqjrSptext[0],
	        	AgentName: bqjrSptext[1],
	        	StationID: bqjrSptext[2]
	        };
//	        document.getElementById("fenjiSpan").innerHTML=getCaptionText("StationID");
			updateFenjiSpanFunc(agentInfo.StationID);
	        extension = agentInfo.StationID;
	        extensionStatus ="12201";
	        /*setTimeout(function(){
	        	setInterval(function(){
	        		getAgentChange();
	        	}, 1000);
	        },100);*/
	       	setInterval(function(){
	        	getAgentChange();
	        }, 1000);
	        isInited = true;
	    }
	}
	
	/**
	 * 来电事件
	 * @param CustomerCallID 客户呼叫对象标识
	 * @param CallID 呼叫标识，是分机内部使用的呼叫ID
	 * @param MType 媒体类型：0-电话，1-ICC，2-短信，3-邮件，4-传真，5-VoiceMail
	 * @param CustomerCallNO 客户号码
	 * @param ServiceNo 服务号码
	 * @param CurrQueue 所属队列
	 * @param TrunkNo 中继号码
	 * @returns
	 */
	function inBoundCall(CustomerCallID,CallID,MType,CustomerCallNO,ServiceNo,CurrQueue,TrunkNo){
	    //alert("new  call:"+"CustomerCallID:"+CustomerCallID+"CallID:"+CallID+"MType:"+MType
	    //	+"CustomerCallNO:"+CustomerCallNO+"ServiceNo:"+ServiceNo+"CurrQueue:"+CurrQueue+"TrunkNo:"+TrunkNo);
	    
	    updateAgentIsReadyFunc(false);
	    //document.getElementById("agentIsReady").checked = false;
	    if((CustomerCallNO+"").length<=6){
	        otherParty = CustomerCallNO;
	        return;
	    }
	    //如果servicsId不为空 说明上次服务还未提交又进了电话，这时需要更新上通通话的录音防止录音丢失
	    if(serviceId!=null && serviceId!=""){
	        if(recordId!=null && (recordId+"").indexOf(",")>=0){
	            updateRecordId();
	        }
	    }
	    //初始化
	    initBqjrSpVar();
	    serviceType = 1;
	
	    customerCallId = CustomerCallID;
	    otherParty = CustomerCallNO+"";
	    if(otherParty.indexOf("0")==0){
	        if(isMoblie(otherParty)){
	            otherParty = otherParty.substr(1);
	        }
	    }
	    ani = CustomerCallNO;
	    dnis = extension;
	    callType = 1;
	    serviceNo = ServiceNo;
	    
	    //进线号码
	    updateBqjrSpServiceNoFunc(serviceNo);
	    //document.getElementById("bqjrSpServiceNo").innerHTML=serviceNo;
	    if(recordId==null || recordId == ''){
	        recordId = agentId+CustomerCallID;
	    }else{
	        recordId = recordId+","+agentId+CustomerCallID;
	    }
	    //新增服务
	    newService();
	}
	
	function isMoblie(txt){
	    if(!txt){
	        return true;
	    }
        return txt.search("^0?1[3-9][0-9]{9}$") == 0;
	};
	
	/**
	 * 初始化数据在服务结束时调用,
	 */
	function initBqjrSpVar(){
	    serviceId = null;//服务记录ID
	    ani =null;//主叫
	    dnis = null;//被叫
	    recordId = null;//录音主键
	    serviceNo = null;//接入号
	    callType = null;//呼叫类型
	    outIsScreen = false;//外呼是否弹屏
	    isOutBound = false;//是否外呼
	    serviceType = null;//服务类型 1电话 2短信 3APP
	    otherParty =  null;//客户电话号码
	    roadData = null;//随路数据
	    bqjrSpConnectTimeI = false;
	    customerCallId = null;
	    isConnect = true;
	    isMeeting = false;
	}
	
	/**
	 * 新增一个服务记录
	 */
	var screenNodeId=10000;
	function newService() {
	
	    if (dnis.indexOf(outBoundCallPrefix) === 0) {
	        dnis = dnis.replace(outBoundCallPrefix, "");
	    }
	    if (otherParty.indexOf(outBoundCallPrefix) === 0) {
	        otherParty = otherParty.replace(outBoundCallPrefix, "");
	    }
	    var service10={};
	    service10.ani=ani;//主叫
	    service10.dnis=dnis;//被叫
	    service10.agentId =agentId;//座席工号
	    service10.callType=callType;//呼叫类型
	    service10.serviceNo=serviceNo;//接入号
	    service10.customerCallId=customerCallId; //思科通话id
	    service10.serviceType=serviceType;
	    service10.customerId=otherParty;
	    
	    //saveService(service10, outIsScreen);
	    initService(service10).then(response =>{
	    	if(response && response.rel && response.data){
	    		serviceId = response.data.serviceId; //得到服务器返回的信息serviceId
	    		openCallScreenFunc(response.data);
		        if(outIsScreen) {
		        }
	    	}else{
	    		console.log("初始化服务记录操作失败:"+response.msg);
	    	}
	    }).catch(()=>{});
	    
//	    var url = webRoot + "/service10/initService";
//	    ajaxUtil.post(url,service10,true,function (rs) {
//	        serviceId = rs.serviceId; //得到服务器返回的信息serviceId
//	        if(outIsScreen) {
//	            var node = {
//	                id: screenNodeId,
//	                text: "客户来电弹屏",
//	                url: webRoot+"/apps/default/admin/crm/framework/frame/mmtCallScreen.jsp?serviceId="+serviceId
//	            };
//	            showNoCloseTab(node);
//	        }
//	    });
	    screenNodeId++;
	}
	
	/**
	 * 更新录音，防止丢失
	 */
	function updateRecordId(){
	    setTimeout(function(){
			if(!serviceId){
		        return;
		    }
	    	
			var service10 = {};
		    service10.serviceId = serviceId;
		    service10.recordId = recordId;//录音主键
			updateRecordId(service10);
//		    var url = webRoot + "/service10/updateRecordId";
//		    var service10 = {};
//		    service10.serviceId = serviceId;
//		    service10.recordId = recordId;//录音主键
//		    ajaxUtil.sendPost(url, service10);
	    },100);
	}
	
	function setOutScreen(){
	    if(serviceId==null||serviceId==""){
	        setTimeout(()=>{setOutScreen();},100);
	        return;
	    }
	    if(outIsScreen){
	    	//TODO 关闭弹窗
	        //var url = "service10-prepareInsert.action?serviceId="+serviceId;
	        closeCallScreenFunc({serviceId:serviceId});
	        // window.parent.frames["content"].win.addwin(url,dnis,serviceId);
	    }
	}
	/**
	 * 呼叫事件：外呼
	 * @param CallType 呼叫方向 呼入= 10401 呼出= 10402
	 * @param CustomerCallID 客户呼叫对象标识
	 * @param CallID 呼叫标识，是分机内部使用的呼叫ID
	 * @param MType 媒体类型：0-电话，1-ICC，2-短信，3-邮件，4-传真，5-VoiceMail
	 * @param EventReasion 扩展使用
	 */
	function CallInfoChange(CallType,CustomerCallID,CallID,MType,EventReasion){
	    if(isMeeting){
	        return;
	    }
	    if(!isOutBound){
	        return;
	    }
	    if(CallType=="10402"){
	    	//
	    	updateAgentIsReadyFunc(false);
	        //document.getElementById("agentIsReady").checked = false;
	        if((otherParty+"").length<=6){return;}
	        if(outIsScreen){
	            if(serviceId!=null && serviceId!=""){
	                if(recordId!=null && (recordId+"").indexOf(",")>=0){
	                    updateRecordId();
	                }
	            }
	            //初始化
	            serviceId = null;
	            recordId = null;
	            roadData = null;
	            isConnect = true;
	        }
	        customerCallId = CustomerCallID;
	        serviceType =1;
	        ani = extension;
	        callType = 9;
	        if(recordId==null || recordId == ''){
	            recordId = agentId+CustomerCallID;
	        }else{
	            recordId = recordId+","+agentId+CustomerCallID;
	        }
	        //根据serviceId是否存在判断是否需要新增一条联络历史，弹屏
	        if(serviceId==null||serviceId==""){
	            newService();
	        }
	        setOutScreen();
	    }
	}
	
	function setAgentReady(){
	    if(!$("#agentIsReady").checked){
	        if(agentState=="12005"){
	            bqjrSp.AgentReady();
	            setTimeout(()=>{setAgentReady();},100);
	        }else{
	            if(agentState!="12002"){
	                setTimeout(()=>{setAgentReady();},100);
	            }
	        }
	    }else{
	    	insertAgentNotReady();
	        //var url =  webRoot+"/service10/insertAgentNotReady";
	        //ajaxUtil.sendPost(url,"");
	    }
	}
	
	/**
	 * 记录跟新是否转IVR
	 */
	function OnTransferToIVR(){
	    setTimeout(function(){
	    	isOutBound = false;
	    	var service10={};
	    	service10.agentId=agentId;  //座席工号
		    service10.customerCallId= customerCallId;   //接入号
	    	updateIsTransIvr(service10);
    	
//		    var url =  webRoot+"/service10/updateIsTransIvr";
//		    var service10={};
//		    service10.agentId=agentId;  //座席工号
//		    service10.customerCallId= customerCallId;   //接入号
//		    ajaxUtil.sendPost(url,service10);
	    },100);
	}
	
	function HangupCall(){
	    bqjrSpConnectTimeI = false;
	    //setTimeout(()=>{setAgentReady()",agentReadyTime*1000);
	}
	
	/**
	 * 外呼对话框确认
	 * @param type 呼出类型  0=外拨呼出  1=咨询
	 * @param party 呼叫的号码
	 */
	function OutBoundCall(type,party){
	    isOutBound = true;
	    party = (""+party).replace(outBoundCallPrefix,"");
	    party = party.replace("T", "").replace("C", "");
	    if(party.indexOf("0")==0){
	        if(isMoblie(party)){
	            party = party.substr(1);
	        }
	    }
	    debugger
	    dnis = party;
	    otherParty = party;
	    serviceType = 1;
	    if(type==1){
	        outIsScreen = false;
	//		alert("咨询"+party);
	//		bqjrSp.ConsultantCall(party,"");
	    }else{
	//		if(serviceId==null||serviceId==""){
	        outIsScreen = true;
	//		}
	    }
	}
	
	/**
	 * 分机状态变化事件
	 * @param StationStateID StationState标识
	 * @param StationStateName StationState名称
	 * @param LastStationStateID 上一个StationState标识
	 * @param LastStationStateName 上一个StationState名称
	 * @param OtherParty  对方号码
	 * @param UUI 随路数据
	 * @param EventReason 扩展使用
	 */
	function stachange(StationStateID,StationStateName,LastStationStateID,LastStationStateName,
	                   OtherParty,UUI,EventReason){
	    extensionStatus = StationStateID;
	    if(StationStateID=="12209"&&callType=="1"){
	        if("4009987101"==serviceNo || "95780"==serviceNo || "4009987102"==serviceNo 
	        	|| "4009987860"==serviceNo || "4009302308"==serviceNo){
	        	
	        	var data = {
	        		agentId: agentId,//座席工号
	        		customerCallId: customerCallId,//接入号
	        		phone: otherParty//客户号码
	        	};
	        	sendMessage(data);
	        	
//	            var url =  webRoot+"/softPhoneUpdate/messageSend";
//	            var para = "&agentId="+agentId; //座席工号
//	            para += "&serviceNo="+customerCallId;//接入号
//	            para += "&phone="+otherParty;//客户号码
//	            para = para + "&forward=json";
//	            ajaxUtil.sendPost(url,para);
	        }
	    }
	    //end zhangdi
	    if(UUI!=""){
	        roadData = UUI;
	    }
	    if(StationStateID=="12203"||StationStateID=="12202"){
	        if(otherParty ==null || otherParty ==""){
	        	updateCustomerCallPartyFunc("");
	            //document.getElementById("CustomerCallParty").innerHTML = "";
	        }else{
	        	updateCustomerCallPartyFunc(otherParty);
	            //document.getElementById("CustomerCallParty").innerHTML = otherParty;
	        }
	        updateBqjrSpConnectTimeFunc("");
	        //document.getElementById("bqjrSpConnectTime").innerHTML = "";
	        bqjrSpConnectTime = 0;
	        bqjrSpConnectTimeI = true;
	    }
	    //分机状态变化为通话状态，接通事件
	    if(StationStateID=="12205"){
	    	updateCustomerCallPartyFunc(otherParty);
	        //document.getElementById("CustomerCallParty").innerHTML = otherParty;
	        answerCall();
	        bqjrSpConnectTime = 0;
	        bqjrSpConnectTimeI = true;
	        isOutBound = false;
	        //zhangdi begin
	        updateBuMenZhuanShowFunc(true);
	        //buMenZhuanShow();
	        //zhangdi end
	    }else{
	        //zhangdi begin
	        updateBuMenZhuanShowFunc(false);
	        //buMenZhuanHide();
	        //zhangdi end
	    }
	    //分机状态变化为等待手动挂机，挂机事件
	    if(StationStateID=="12209"){
	        bqjrSpConnectTimeI = false;
	        isMeeting = false;
	        isOutBound = false;
	        updateBqjrSpServiceNoFunc("");
	        //document.getElementById("bqjrSpServiceNo").innerHTML="";
	        //setTimeout(()=>{setAgentReady()",agentReadyTime*1000);
	    }
	    /*if(StationStateID=="12203"){
	        alert("分机状态变化UUI:"+UUI);
	        roadData = UUI;
	    }*/
	}
	                   
	/**
	 * 应答事件：更新接通时间
	 */
	function answerCall(){
	    setTimeout(function(){
	    	if(!isConnect){
		        return;
		    }
		    if(!serviceId){
		        return;
		    }
		    isConnect= false;
		    var service10 = {};
		    service10.serviceId = serviceId;
		    service10.recordId = recordId; //录音主键
		    service10.agentId = agentId;  //座席工号
		    service10.customerCallId = customerCallId;    //接入号
		    service10.serviceNo = serviceNo;  //热线号码
		    service10.ani = otherParty;   //客户号码
		    updateConnect(service10);
		    
		    //var url = webRoot + "/service10/connectService";
		    //ajaxUtil.sendPost(url, service10);
		    setRoadData();
	    },100);
	}
	function setRoadData(){
		//TODO 增加注释
	    if(callType==="9"){return;}
	    if(!roadData){
	        setTimeout(()=>{setRoadData();},100);
	        return;
	    }
	    //var url = webRoot + "/service10/insertRoadData";
	    var roadDataEntity = {};
	    roadDataEntity.phone = getRoadData("2");
	    roadDataEntity.recordId = recordId;
	    roadDataEntity.idNum = getRoadData("3");
	    roadDataEntity.isPhoneChecked = getRoadData("11");
	    roadDataEntity.isIdNumChecked = getRoadData("12");
	    roadDataEntity.is_bind_wx = getRoadData("13");
	    roadDataEntity.roadData = roadData;
	    roadDataEntity.serviceId = serviceId;
	    insertRoadData(roadDataEntity);
	    //ajaxUtil.sendPost2(url, roadDataEntity);
	}
	
	/**
	 * 获取需要的随路数据
	 * @param no 参数; 10.获取按键值 11.获取手机验证是否通过0/1 12. 获取身份证验证是否通过0/1 2.获取手机号码 3.获取身份证号码
	 * @returns {String}
	 */
	function getRoadData(no){
	    if(roadData==null || roadData==""){
	        return "";
	    }
	    var data = roadData.split(",");
	    if(data.length>3){//新的UUI格式
	        if(no=="10"){//获取按键值
	            return data[5];
	        }
	        if(no=="2"){//获取手机号
	            return data[2]+"";
	        }
	        if(no=="11"){//手机号码是否是身份证预留手机号码
	            return (data[4]+"");
	        }
	        if(no=="3"){//获取身份证号码
	            return (data[0]+"").replace('*','X');
	        }
	        if(no=="12"){ //获取身份证验证是否通过
	            return (data[1]+"");
	        }
	        //if(no=="13"){ //获取主叫于身份证是否匹配
	        //return (data[4]+"");
	        //}
	    }else{
	        if(no=="10"){
	            return (data[0]+"").substring(0,1);
	        }
	        if(no=="11"){
	            return (data[0]+"").substring(1,2);
	        }
	        if(no=="12"){
	            return (data[0]+"").substring(2,3);
	        }
	        if(no=="2"){
	            return data[1]+"";
	        }
	        if(no=="3"){
	            return (data[2]+"").replace('*','X');
	        }
	    }
	}
	
	/**
	 * 更新挂断时间
	 */
	function setDisConnect(){
		setTimeout(()=>{
			if(serviceId == null || serviceId ===""){
		        return;
		    }
		    var service10={};
		    service10.serviceId=serviceId;
		    disctConnect(service10);
		},100);
	    
	    //var url =  webRoot+"/service10/disConnectService";
	    //ajaxUtil.sendPost2(url,service10);
	}
	/**
	 * 更新挂断时间
	 */
//	function disConnect(){
//	    setTimeout(()=>{setDisConnect();},100);
//	}
	
	/**
	 * 座席状态变化事件
	 * @param AgentId 工号
	 * @param AgentStateId AgentState标识
	 * @param AgentStateName AgentState名称
	 * @param AgentSubStateId AgentSubState标识
	 * @param AgentSubStateName AgentSubState名称
	 * @param LastAgentStateId 上一个AgentState标识
	 * @param LastAgentStateName 上一个AgentState名称
	 * @param LastAgentSubStateId 上一个AgentSubState标识
	 * @param LastAgentSubStateName 上一个AgentSubState名称
	 * @param EventReason 扩展使用
	 * @returns
	 */
	function agentStateChange(AgentId,AgentStateId,AgentStateName,AgentSubStateId,AgentSubStateName,
	                          LastAgentStateId,LastAgentStateName,LastAgentSubStateId,LastAgentSubStateName,EventReason){
	    agentState = AgentStateId;
	    if(agentState=="12005"&&LastAgentStateId!="12002"&&LastAgentStateId!="12005"){
	        setDisConnect();
	        setTimeout(()=>{setAgentReady();},agentReadyTime*1000);
	        updateAgentIsReadyDisabledFunc(true);
	        //document.getElementById("agentIsReady").disabled= true;
	    }
	    if(agentState=="12004"){
	    	updateAgentIsReadyDisabledFunc(false);
	        //document.getElementById("agentIsReady").disabled= false;
	    }
	    
        bqjrSpConnectTimeI = extensionStatus=="12205";
        
	    if(agentState=="12005"||agentState=="12003"){
	        isOutBound = false;
	    }
	    if(agentForRest){
	        if(isrealAgentRest){
	            if(agentState=="12003"&&agentRestStart&&isClickRest){
	                agentRestStart = false;
	                setTimeout(()=>{agentRestFunc();},100);
	            }else if(LastAgentStateId=="12003"&&!agentRestStart){
	                setTimeout(()=>{agentRestEndFunc();},100);
	                isrealAgentRest = false;
	                isClickRest = false;
	            }
	        }
	    }
	}
	                          
	/**
	 * 座席进入小休
	 */
	function agentRestFunc(){
		agentRest_Start().then((response)=>{
			if(response && response.rel){
				Message.success({message: '小休成功，现在开始属于小休时间！', showClose: true});
				//Message.success({message: '小休成功，单次小休时长为：'+response.data+'分钟！', showClose: true});
	            //alert("小休成功，单次小休时长为："+data[1]+"分钟！");
	            //setTimeout(()=>{agentRestRemind();}, response.data*60*1000);
			}else{
				Message.error({message: response && response.msg?response.msg:'小休失败', showClose: true});
			}
		}).catch(()=>{});
		
//	    var url = webRoot+"/forRest/agentRest";
//	    var result = ajaxUtil.sendPost(url,"")+"";
//	    var data = result.split("||");
//	    if(data[0]=="success"){
//	        if(data[1]){
//	            
//	        }
//	    }
	}
	/**
	 * 座席结束小休
	 */
	function agentRestEndFunc(){
		agentRest_End();
//	    var url =  webRoot+"/forRest/agentRestEnd";
//	    ajaxUtil.sendPost(url,"");
	}
	
	/**
	 * 座席小休时间到，提醒
	 */
	function agentRestRemind(){
	    if(agentState=="12003"&&isrealAgentRest){
	        //alert("本次小休时间到！");
	        Message.warn({message: '本次小休时间到！', showClose: true});
	    }
	}
	                          
	
	
	function onMakeCall() {
	    bqjrSp.SetOperationCancel();
	    isMeeting = false;
	    openCallDialogFunc("外呼", "1");
	}
	
	function onConsultantCall(){
	    bqjrSp.SetOperationCancel();
	    openCallDialogFunc("咨询","2");
	}
	
	/**
	 * 界面会议按钮事件
	 */
	function OnConferenceCall(){
	    isMeeting = true;
	}
	
	/**
	 * 错误事件
	 */
	function Error(ErrorCode, ErrorStr){
	    //触发错误事件指向该方法
	    if (ErrorCode > 100){
	        //alert('网络连接错误,请重新登陆,错误码:'+ ErrorCode+ErrorStr);//错误事件处理
	        Message.error({message: '网络连接错误,请重新登陆,错误码:'+ ErrorCode+ErrorStr, showClose: true});
	        
	    }
	}
	/**
	 * 点击就绪：设置通话结束后默认就绪
	 */
	function agentReady(){
		updateAgentIsReadyFunc(false);
	    //document.getElementById("agentIsReady").checked = false;
	}
	
	/**
	 * 检查座席是否能进行小休:0.机构未进行小休配置 1.达到允许的小休总次数2.时段未配置可以小休3.是否排队4.可小休5.是否排队
	 */
	function checkForRest(){
		agentRestCheckFor().then(response =>{
			if(response && response.rel){
				checkForRestResult(response.data);
			}else{
				console.log("检查座席是否能进行小休操作失败!");
			}
		}).catch(()=>{});
		
		function checkForRestResult(data){
			if(data.code == "1"){
		    	Message.info({message: data.msg, showClose: true});
		        return;
		   }else if(data.code == "0"|| data.code=="2"|| data.code =="4"){
		    	updateAgentIsReadyFunc(true);
		        isrealAgentRest = true;
		        isClickRest = true;
		        agentRestStart = true;
		        bqjrSp.AgentNotReady("0");//设置座席小休
		        return;
		    }else{
		    	Message.confirm(data.msg, '确认', {
		          confirmButtonText: '确定', cancelButtonText: '取消', type: 'info'
		        }).then(() => {
		        	agentRestApply().then(response => {
		        		if(response && response.rel){
		        			isRestQueue = true;
		            		setTimeout(()=>{isTurnRest();}, 1000*60);
		            		Message.info({message: response.msg, showClose: true});
		        		}else{
		        			console.log("申请小休操作失败："+response.msg);
		        		}
		        	}).catch(()=>{});
		        }).catch(() => {});
		    }
		}
		
//	    var url = webRoot+"/forRest/checkForRest";
//	    var result = ajaxUtil.get(url,"")+"";
//	    var data = result.split("=-=");
//	    if(data[0]=="0"||data[0]=="2"||data[0]=="4"){
//	    	updateAgentIsReadyFunc(true);
//	        //document.getElementById("agentIsReady").checked = true;
//	        isrealAgentRest = true;
//	        isClickRest = true;
//	        agentRestStart = true;
//	        bqjrSp.AgentNotReady("0");//设置座席小休
//	        return;
//	    }else if(data[0]=="1"){
//	    	Message.info({message: data[1]+"", showClose: true});
//	        //alert(data[1]+"");
//	        return;
//	    }else{
//	        var isQueue =  window.confirm(data[1]+"");
//	        if(isQueue){
//	            var url = webRoot+"/forRest/agentRestApply";
//	            ajaxUtil.sendPost(url,"");
//	            isRestQueue = true;
//	            setTimeout(()=>{isTurnRest()",1000*60);
//	        }
//	    }
	}
	
	/**
	 * 进行小休控制的机构下的座席点击小休按钮
	 */
	function agentNotReady(SubIndex){
	    if("0"==SubIndex){
	        bqjrSp.SetOperationCancel();
	        if(isRestQueue){
	            //alert("你已在小休排队队列中，请耐心等待！");
	            Message.info({message: '你已在小休排队队列中，请耐心等待！', showClose: true});
	            return;
	        }
	        agentUseRest();
	        //setTimeout(()=>{checkForRest();},100);
	    }else{
	        isClickRest = false;
	    }
	}
	
	/**
	 * 座席使用小休
	 */
	function agentUseRest(){
		agentRestStart = true;
		isClickRest = true;
		updateAgentIsReadyFunc(true);
	    //document.getElementById("agentIsReady").checked = true;
	    if(agentState=="12004"){
	        setTimeout(()=>{agentUseRest();},1000);
	    }else if(agentState!="12001"){
	        isrealAgentRest = true;
	        bqjrSp.AgentNotReady("0");//设置座席小休
	    }
	}
	/**
	 * 座席放弃小休
	 */
	function giveUpRest(){
		agentRestStart = false;
		isClickRest = false;
		agentRestGiveUp();
//	    var url = webRoot+"/forRest/giveUpRest";
//	    ajaxUtil.sendPost(url,"");
	}
	
	/**
	 * 排队座席查看是否轮到自己小休
	 */
	function isTurnRest(){
		agentRestCheckTurn().then(response =>{
			if(response && response.rel){
				if(!response.data){
					setTimeout(()=>{isTurnRest();},1000*60);
				}else{
					isRestQueue = false;
			        //轮到小休
			        var isUseRest = window.confirm("轮到你小休了，你确认进行小休吗（确定使用，取消放弃）？");
			        if(isUseRest){
			            setTimeout(()=>{agentUseRest();},100);
			        }else{
			            setTimeout(()=>{giveUpRest();},100);
			        }
				}
			}else{
				console.log("排队座席查看是否轮到自己小休 操作失败!");
			}
		}).catch(()=>{});
//	    var url = webRoot+"/forRest/isTurnRest";
//	    var result = ajaxUtil.sendPost(url,"");
//	    if(result=="0"){
//	        setTimeout(()=>{isTurnRest()",1000*60);
//	    }else if(result=="1"){
//	        isRestQueue = false;
//	        //轮到小休
//	        var isUseRest = window.confirm("轮到你小休了，你确认进行小休吗（确定使用，取消放弃）？");
//	        if(isUseRest){
//	            agentRestStart = true;
//	            isClickRest = true;
//	            setTimeout(()=>{agentUseRest();},100);
//	        }else{
//	            agentRestStart = false;
//	            isClickRest = false;
//	            setTimeout(()=>{giveUpRest();},100);
//	        }
//	    }
	}
	
	/**
	 * 外拨方法
	 * @param phoneNo 外拨的电话号码
	 * @param isScreen 是否需要弹屏 true:是 FALSE:否
	 */
	function _makeCall(phoneNo,isScreen){
	    if(!phoneNo){
	        //alert("请输入电话号码!");
	        Message.error({message: '请输入电话号码!', showClose: true});
	        return false;
	    }
	    //判断当前状态能否外拨
	    if( extensionStatus!="12201" && extensionStatus!="12202"){
	        //alert("请在分机空闲状态或者摘机呼出状态下进行外呼");
	        Message.error({message: '请在分机空闲状态或者摘机呼出状态下进行外呼', showClose: true});
	        return false;
	    }
	    isOutBound = true;
	    dnis = phoneNo;
	    otherParty = phoneNo;
	    if(otherParty.indexOf("0")==0){
	        if(isMoblie(otherParty)){
	            otherParty = otherParty.substr(1);
	        }
	    }
	    outIsScreen = isScreen;
	    if((phoneNo+"").length>6){
	        bqjrSp.MakeCall(outBoundCallPrefix+phoneNo,"");
	    }else{
	        bqjrSp.MakeCall(phoneNo,"");
	    }
	    return true;
	}
	
	/**
	 * 跨部门转接
	 */
	function _transferDepartment(IVRNo){
	    bqjrSp.SetIVRNo(IVRNo);
	    if(bqjrSp.TransferToIVR("",0)){
	        setManYiDuIVR();
	    }else{
	        //alert("转接失败请重试！");
	        Message.error({message: '转接失败请重试！', showClose: true});
	    }
	}
	/**
	 * 转接完设置IVR号码为满意度
	 */
	function setManYiDuIVR(){
	    var result = bqjrSp.SetIVRNo("T40001");
	    if(result!=1){
	        setTimeout(()=>{setManYiDuIVR();},100);
	    }
	}
                          
    function initEvent(){
    	if(!bqjrSp || !bqjrSp.attachEvent){
    		console.warn("软电话初始化失败！");
    		return false;
    	}
		bqjrSp.attachEvent('OnInService', InService);//注册OnInService事件，启动软电话服务（StartService），启动成功后有OnInService事件。
	    bqjrSp.attachEvent('OnInBoundCall', inBoundCall);//注册来电事件，外线来电振铃即触发
	    bqjrSp.attachEvent('OnCallInfoChange', CallInfoChange);//注册客户呼叫事件
	    bqjrSp.attachEvent("OnTransferToIVR", OnTransferToIVR);//转IVR事件，服务结束
	    bqjrSp.attachEvent("OnHangupCall", HangupCall);//挂机事件，服务结束
	    bqjrSp.attachEvent("OnInputBoxFinish", OutBoundCall);//外呼对话框确认
	//    bqjrSp.attachEvent("OnAnswerCall", answerCall);//应答事件
	    bqjrSp.attachEvent('OnStationStateChange',stachange);//分机状态变化事件
	    bqjrSp.attachEvent("OnAgentStateChange",agentStateChange);//座席状态变化事件
	
	    bqjrSp.attachEvent('OnMakeCall',onMakeCall);//界面外呼按钮事件
	    bqjrSp.attachEvent('OnConsultantCall',onConsultantCall);//界面咨询按钮事件
	    bqjrSp.attachEvent('OnConferenceCall',OnConferenceCall);//界面会议按钮事件
	
	    bqjrSp.attachEvent('OnError',Error);//注册错误事件，有错误即触发
	    bqjrSp.attachEvent("OnAgentReady",agentReady);//就绪事件
	    if(agentForRest){
	        bqjrSp.attachEvent("OnAgentNotReady",agentNotReady);//就绪事件,用于小休申请
	    }
	//  bqjrSp.attachEvent("OnButtonInvisbleFlagChange", buttonChange);//按钮变化事件
	//  bqjrSp.attachEvent('OnAgentWorkingAfterCall',AgentWorkingAfterCall);//注册事后处理事件，点击事后处理按钮出发
	    bqjrSp.SetSPConfig("LinkIP","10.22.1.62");
	    bqjrSp.SetSPConfig("TServerIP","10.22.1.62");
	    bqjrSp.SetSPConfig("AgentID",agentId);
	    return true;
    }
		
	//软电话操作对象API
	spObject = {
		init: function(){
			bqjrSp = document.getElementById(selector);
			if(!bqjrSp){
				var bqjrSpFrame = document.getElementById(selector+"_iframe");
				if(bqjrSpFrame){
					bqjrSp = bqjrSpFrame.contentWindow.document.getElementById(selector);
				}
			}
			if(!bqjrSp){
				console.error("初始化软电话失败，未找到软电话控件!")
				return null;
			}
			
			if(initEvent()){
				bqjrSp.StartService();  //启动软电话服务，成功后触发OnInService事件
			};
		},
		makeCall: function(phoneNo,isScreen){
			return _makeCall(phoneNo,isScreen);
		},
		consultantCall: function(phone, s){
			bqjrSp.ConsultantCall(phone, s);
		},
		transferDepartment: function(IVRNo){
			_transferDepartment(IVRNo);
		}
	};
	
	spObject.that = this;
	return spObject;
}

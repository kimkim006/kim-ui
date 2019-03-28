<template>
	<div class="el-box soft-phone-text" :loading="loading">
		<div style="width: 875px; height: 80px;">
            <object id="bqjrSp" style="width: 875px; height: 80px;"
		        classid="clsid:5E57CDEB-8FBB-4AB5-9050-3A307E5BCFBD">
				<PARAM NAME="_Version" VALUE="65536"/>
				<PARAM NAME="_ExtentX" VALUE="23072"/>
				<PARAM NAME="_ExtentY" VALUE="6985"/>
				<PARAM NAME="_StockProps" VALUE="0"/>
				<PARAM NAME="wmode" VALUE="transparent"/> 
			</object>
		</div>
		<div class="el-box" style="margin-left:0px;margin-top: 10px;">
			<div>
				<div>
					<a v-if="isShowTransfDepartment" @click="showTransfDepartment()">
						<img class="icon-bumenzhuanjie" src="static/framework/images/bumenzhuanjie1.png">
					</a>
					<span v-else style="cursor: not-allowed;">
						<img class="icon-bumenzhuanjie" src="static/framework/images/bumenzhuanjie0.png" >
					</span>
				</div>
				<div style="text-align: center;color:#808080;">
					<span>技能转</span>
				</div>
			</div>
			<div style="margin-left: 8px;">
				<table style="height: 72px;">
					<tr>
						<td class="soft-phone-label1">进线号码：</td>
						<td class="soft-phone-value2"><span>{{bqjrSpServiceNo}}</span></td>
						<td class="soft-phone-label3">座席状态：</td>
						<td class="soft-phone-value4"><span>{{AgentStateSpan}}</span></td>
						<td class="soft-phone-label5">时长：</td>
						<td class="soft-phone-value6"><span>{{bqjrSpStatusTime}}</span></td>
					</tr>
					<tr>
						<td class="soft-phone-label1">客户号码：</td>
						<td class="soft-phone-value4"><span></span>{{CustomerCallParty}}</td>
						<td class="soft-phone-label3">连接时长：</td>
						<td style="width: 100px;text-align: left;color: blue;" colspan="2"><span>{{bqjrSpConnectTime}}</span></td>
					</tr>
					<tr>
						<td colspan="2" style="width: 150px;">
							<input id="agentIsReady" disabled="disabled" type="checkbox" style="vertical-align: middle;"/>
							<span>挂机后不就绪</span>
						</td>
						<td class="soft-phone-label3">用户工号：</td>
						<td class="soft-phone-value4"><span>{{agentConfig.agentId}}</span></td>
						<td class="soft-phone-label5">分机：</td>
						<td class="soft-phone-value6"><span>{{fenjiSpan}}</span></td>
					</tr>
				</table>
			</div>
		</div>
		<div>
			<object ID="XToolBox" CLASSID="clsid:798159CE-735A-4A34-9241-314288655406"
			        codebase="static/framework/dll/XToolBox.cab#version=1,0,0,5" width="0" height="0">
			</object>
		</div>
		
		<el-dialog :title="dialogTitle" v-if="dialogVisible" :visible.sync="dialogVisible" custom-class="el-dialog-soft-phone-call"
			 :close-on-click-modal="false" :append-to-body="true" :modal-append-to-body="false">

	        <div class="el-dialog-panel">
	        	<div class="el-box" style="padding-left: 7px;padding-top: 5px;">
					<el-input v-model="phoneNumber" size="large" maxlength="12" style="width: 205px;" @keyup.enter.native="clicMakeCall()"></el-input>
					<div style="margin-left: 5px;">
						<a @click="clicMakeCall()">
							<img src="static/framework/images/dail.png" style="width: 41px;height: 41px;">
						</a>
					</div>
				</div>
	        	<div style="margin-left: 4px;">
		            <table>
						<tr>
							<td @click="phoneNumCk('1')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">1</span></el-button></td>
							<td @click="phoneNumCk('2')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">2</span></el-button>
							</td>
							<td @click="phoneNumCk('3')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">3</span></el-button>
							</td>
						</tr>
						<tr>
							<td @click="phoneNumCk('4')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">4</span></el-button>
							</td>
							<td @click="phoneNumCk('5')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">5</span></el-button>
							</td>
							<td @click="phoneNumCk('6')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">6</span></el-button>
							</td>
						</tr>
						<tr>
							<td @click="phoneNumCk('7')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">7</span></el-button>
							</td>
							<td @click="phoneNumCk('8')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">8</span></el-button>
							</td>
							<td @click="phoneNumCk('9')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">9</span></el-button>
							</td>
						</tr>
						<tr>
							<td></td>
							<td @click="phoneNumCk('0')">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">0</span></el-button>
							</td>
							<td class="delete_num" @click="deleteNum()">
								<el-button type="info" size="large" style="width: 80px;"><span class="call_number">X</span></el-button>
							</td>
						</tr>
					</table>
	        	</div>
	        </div>
	        <div slot="footer" class="dialog-footer">
	            <el-button @click="closeCallDialog()">取 消</el-button>
        	</div>
	    </el-dialog>
	</div>
</template>

<style>
	.icon-bumenzhuanjie{
		width:44px;
		height: 44px;
		text-align: left;
	}
	.soft-phone-text{
		font-size:12px;
		font-weight:normal;
	}
	.soft-phone-label1{
		text-align: right;
		width: 62px;
	}
	.soft-phone-label3{
		text-align: left;
		width: 62px;
	}
	.soft-phone-label5{
		text-align: left;
		width: 40px;
	}
	.soft-phone-value2{
		text-align: left;
		width: 96px;
		color: blue;
	}
	.soft-phone-value4{
		text-align: left;
		width: 70px;
		color: blue;
	}
	.soft-phone-value6{
		text-align: left;
		width: 65px;
		color: blue;
	}
	.el-dialog-soft-phone-call{
		width: 306px;
	}
	
	.call_number{
		color: black;
		font-weight: bold;
		font-size:26px;
		font-weight:normal;
	}
</style>

<script>
import {initAgentInfo, initAgentInfoTest} from './softPhoneApi';
import $ from 'jquery';
import {BqjrSp} from './softPhone';
import {hasPermission} from '@/utils/permissionUtil';
export default {
  	name: 'softPhoneView',
  	props: {
	},
  	data() {
    	return {
    		extension: true,
    		bqjrSpServiceNo: undefined,
    		AgentStateSpan: undefined,
    		bqjrSpStatusTime: undefined,
    		CustomerCallParty: undefined,
    		bqjrSpConnectTime: undefined,
    		agentIsReady: false,
    		fenjiSpan: undefined,
    		
    		isShowTransfDepartment: false,
    		
    		agentConfig: {
    			agentForRest: undefined,
    			agentReadyTime: undefined,
    			agentId: '',
    			outBoundCallPrefix: undefined
    		},
    		xtoolboxConfig: {},
    		bqjrSp: null,
    		
    		loading: false,
    		isShowBtnCall: false,
    		dialogVisible: false,
    		dialogTitle: '',
    		phoneNumber: '',
    		phonetype: ''
    		
    	}
  	},
  	created() {
    	this.isShowBtnCall = hasPermission('resource.isShowBtnCall');
    	//this.initConfig();
//  	this.openCallScreen({
//  		serviceId:"36cc4c752d914a18a13911167e2180f0",
//  		ani: "13826653400"
//  	});
    	
  	},
  	mounted: function () {
	  	this.$nextTick(function () {
	  		this.initAgent();
	  	});
	},
	computed: {
	    callScreens() {
	       	return this.$store.state.app.callScreens;
	    }
   },
  	methods: {
  		initAgent(){
  			this.loading = true;
			initAgentInfo(this.extension).then(response => {
				if(response && response.rel && response.data){
					$.extend(true, this.agentConfig, response.data.agentConfig);
					//$.extend(true, this.xtoolboxConfig, response.data.xtoolboxConfig);
					this.initSoftPhone();
				} else{
					this.$message.error({message: response.msg,showClose: true});
				}
				this.loading = false;
			}).catch(()=>{
				this.loading = false;
			});
//			var data = initAgentInfoTest();
//			console.log(JSON.stringify(data));
//			$.extend(true, this.agentConfig, data.agentMap);
//			$.extend(true, this.xtoolboxConfig, data.xtoolboxMap);
  		},
  		initSoftPhone(){
  			this.bqjrSp = BqjrSp("bqjrSp", {
  				agentConfig: this.agentConfig,
  				xtoolboxConfig: this.xtoolboxConfig,
  				
				updateFenjiSpan: (s)=>{this.fenjiSpan = s;},
				updateAgentStateSpan: (s)=>{this.AgentStateSpan = s;},
				updateBqjrSpStatusTime: (s)=>{this.bqjrSpStatusTime = s;},
				updateCustomerCallParty: (s)=>{this.CustomerCallParty = s;},
				updateBqjrSpConnectTime: (s)=>{this.bqjrSpConnectTime = s;},
				updateBqjrSpServiceNo: (s)=>{this.bqjrSpServiceNo = s;},	
				updateBuMenZhuanShow: (s)=>{this.isShowTransfDepartment = s;},
				updateAgentIsReadyDisabled: (s)=>{
					if(s){
						$("#agentIsReady").attr("disabled", "disabled");
					}else{
						$("#agentIsReady").removeAttr("disabled");
					}
				},
				updateAgentIsReady: (s)=>{
					this.agentIsReady = s;
					$("#agentIsReady").checked = s;
				},
				openCallDialog: (title, phonetype)=>{
					this.openCallDialog(title, phonetype);
				},
				openCallScreen: (data)=>{this.openCallScreen(data);},
				//closeCallScreen: (data)=>{this.closeCallScreen(data);}
				closeCallScreen: (data)=>{;}
  			});
  			if(this.bqjrSp){
  				this.bqjrSp.init();
  			}
  		},
  		openCallScreen(data){
  			this.$store.dispatch('addCallScreen', {
	      		title: data.callType==1?data.ani:data.dnis,
	      		name: data.serviceId,
	      		serviceId: data.serviceId
	        });
  			this.$router.push("/callScreen");
  		},
  		closeCallScreen(data) {
	  		this.$store.dispatch('delCallScreen', {
	      		name: data.serviceId,
	      		serviceId: data.serviceId
	        }).then(()=>{
	        	if(!this.callScreens || !this.callScreens.length){
	        		this.$router.push("/home");
	        	}
	        });
	       
	    },
  		showTransfDepartment(){
  			
  		},
  		openCallDialog(title, phonetype){
  			this.dialogTitle = title;
  			this.phonetype = phonetype;
  			this.dialogVisible = true;
  		},
  		closeCallDialog(){
  			this.dialogVisible = false;
  			this.phoneNumber = '';
  		},
  		clicMakeCall(){
  			if(this.bqjrSp){
  				var res = false;
  				if(this.phonetype =="1"){
			        res = this.bqjrSp.makeCall(this.phoneNumber, true);
				}else if(this.phonetype =="2"){
			        res = this.bqjrSp.consultantCall("T"+this.phoneNumber,"");
				}else{
					this.$message.error({message: '未知的拨号类别!phonetype:'+this.phonetype, showClose: true});
				}
				if(res){
					this.closeCallDialog();
				}
  			}
  		},
  		phoneNumCk(num){
  			if(this.phoneNumber.length<=12){
  				this.phoneNumber += num;
  			}
  		},
  		deleteNum(){
  			this.phoneNumber = this.phoneNumber.substring(0,this.phoneNumber.length-1);
  		}
  	}
}
</script>

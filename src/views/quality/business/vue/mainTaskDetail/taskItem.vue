<template>
	<div>
		<el-form :model="task" :inline="true" >
			<div style="display: table;margin-left: 20px;margin-bottom:-10px;">
               <el-form-item label="任务编号" class="form-item-task-u">
                   	<el-input v-model="task.id" readonly style="width: 250px;"></el-input>
               </el-form-item>
               <el-form-item label="合同编号" class="form-item-task-u">
                   	<el-input v-model="task.tape.contractNo" readonly style="width: 140px;"></el-input>
               </el-form-item>
               <el-form-item label="坐席工号" class="form-item-task-u">
                   	<el-input v-model="task.agentId" readonly style="width: 120px;"></el-input>
               </el-form-item>
               <el-form-item label="业务线" class="form-item-task-u">
                   	<el-input v-model="task.businessCode" readonly style="width: 100px;"></el-input>
               </el-form-item>
        	</div>
        	<div>
        		<fieldset class="el-dialog-panel task-item" style="margin-left: 15px;margin-right: 15px;">
        			<legend style="font-weight: bold;color: black;">录音信息</legend>
        			<div>
        				<el-form-item label="客户电话" class="form-item-task-u">
		                   	<el-input v-model="task.tape.custPhone" readonly style="width: 100px;"></el-input>
		                </el-form-item>
		                <el-form-item label="客户姓名" class="form-item-task-u">
		                   	<el-input v-model="task.tape.custName" readonly style="width: 100px;"></el-input>
		                </el-form-item>
		                <el-form-item label="身份证号" class="form-item-task-u">
		                   	<el-input v-model="task.tape.ivrInfo.custIdCard" readonly style="width: 160px;"></el-input>
		                </el-form-item>
		                <el-form-item label="身份证验证 " class="form-item-task-u">
		                   	<el-input v-model="task.tape.ivrInfo.ivrVerify" readonly style="width: 115px;"></el-input>
		                </el-form-item>
		                <el-form-item label="呼叫方式" class="form-item-task-u">
		                   	<el-input v-model="task.tape.direction" readonly style="width: 50px;"></el-input>
		                </el-form-item>
		                <el-form-item label="通话时间" class="form-item-task-u">
		                   	<el-input v-model="task.tape.startTime" readonly style="width: 160px;"></el-input>
		                   	-
		                   	<el-input v-model="task.tape.endTime" readonly style="width: 160px;"></el-input>
		                </el-form-item>
		                <el-form-item label="通话时长" class="form-item-task-u">
		                   	<el-input v-model="task.tape.recordTime+'s'" readonly style="width: 80px;"></el-input>
		                </el-form-item>
		                <!--<el-form-item label="挂机方式" class="form-item-task-u">
		                   	<el-input v-model="task.tape.hangupType" readonly style="width: 100px;"></el-input>
		                </el-form-item>-->
		                <el-form-item label="分机号码" class="form-item-task-u">
		                   	<el-input v-model="task.tape.agentPhone" readonly style="width: 88px;"></el-input>
		                </el-form-item>
		                <el-form-item label="思科工号" class="form-item-task-u">
		                   	<el-input v-model="task.tape.agentNo" readonly style="width: 90px;"></el-input>
		                </el-form-item>
		                <el-form-item label="录音平台" class="form-item-task-u">
		                   	<el-input v-model="task.tape.platform" readonly style="width: 90px;"></el-input>
		                </el-form-item>
		                <el-form-item label="服务号码" class="form-item-task-u">
		                   	<el-input v-model="task.tape.serviceNo" readonly style="width: 100px;"></el-input>
		                </el-form-item>
		                <!--<el-form-item label="媒体类型" class="form-item-task-u">
		                   	<el-input v-model="task.tape.mediaType" readonly style="width: 120px;"></el-input>
		                </el-form-item>-->
		                <el-form-item label="服务类型 " class="form-item-task-u">
		                   	<el-input v-model="task.tape.summary.typeName" readonly style="width: 200px;"></el-input>
		                </el-form-item>
		                <el-form-item label="来电一级 " class="form-item-task-u">
		                   	<el-input v-model="task.tape.summary.firstName" readonly style="width: 200px;"></el-input>
		                </el-form-item>
		                <el-form-item label="来电二级 " class="form-item-task-u">
		                   	<el-input v-model="task.tape.summary.secondName" readonly style="width: 260px;"></el-input>
		                </el-form-item>
		                <el-form-item label="来电三级 " class="form-item-task-u">
		                   	<el-input v-model="task.tape.summary.thirdName" readonly style="width: 200px;"></el-input>
		                </el-form-item>
		                <el-form-item label="来电四级 " class="form-item-task-u">
		                   	<el-input v-model="task.tape.summary.forthName" readonly style="width: 200px;"></el-input>
		                </el-form-item>
        			</div>
        			<div :loading="playerLoading">
        				<div id="audioDiv">
					        <div >
					          	<canvas style="background-color: #000;" height="70" width="900" ></canvas>
					          	<audio src="" controls="controls" autobuffer=true style="width: 890px;"
					          		crossOrigin="anonymous">
					            	<p>您的浏览器暂不支持该特性，请您更换最新的谷歌、火狐、IE浏览器！</p>
					          	</audio>
					        </div>
					        <div class="pl_bts">
					          	<el-select style="width: 75px;" size="small" v-model="playRateValue" @change="playRateChangeHandler">
					            	<el-option v-for="item in playRateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					          	</el-select>
					          	<el-button type="primary" size="small" class="pl_bt play" @click="player.play()" status="0">播放</el-button>
					          	<el-button type="primary" size="small" class="pl_bt replay" style="margin-left: 1px;" @click="player.replay()">重放</el-button>
					          	<el-button type="primary" size="small" class="pl_bt speed_5" style="margin-left: 1px;" @click="player.speed(5)">快进5秒</el-button>
					         	<el-button type="primary" size="small" class="pl_bt speed-5" style="margin-left: 1px;" @click="player.speed(-5)">快退5秒</el-button>
					          	<label class="pl_bt label_tip"></label>
					          	<el-button type="primary" v-if="task.tape && task.tape.address" @click="openNewTab()" style="margin-left: 1px;float:right;" icon="icm icon-down">原始文件</el-button>
					          	<el-button type="primary" v-else disabled style="margin-left: 1px;float:right;" icon="icm icon-down">原始文件</el-button>
					        </div>
				      	</div>
        			</div>
        		</fieldset>
        	</div>
        </el-form>
	</div>
</template>

<style>
.form-item-task-u{
	margin-bottom: 4px !important;
	float: left;
}
</style>

<script>
import {findTape, getAudioUrl} from '@/views/quality/business/api/mainTask';
import $ from 'jquery';
import {mapGetters} from 'vuex';
import {Player, getRates} from '@/components/player/index';

export default {
  	name: 'taskItem',
  	components: {
  	},
  	props: {
  		close: {
	        type: Function,
	        default: () => {
	        }
	    },
	    callback:{
	        type: Function,
	        default: () => {
	        }
	    },
	    task:{
	    	type: Object,
      		required: true
	    }
  	},
  	data() {
    	return {
	    	player: undefined,
	    	playRateValue: 1.0,
	    	isFirstOpen: true,
	      	listLoading: true,
	      	playerLoading: false
    	}
  	},
  	created() {
    //this.getList();
   		this.init();
  	},
  	computed: {
  		...mapGetters(['tenantId']),
  		taskObj(){
  			return this.task;
  		},
  		playRateOptions(){
  			return getRates();
  		} 
  	},
  	methods: {
  		init(){
  			this.playerLoading = true;
  			if(this.task.tape.localAddress){
  				this.loadPlayer(this.task.tape.localAddress, this.task.tape.sign);
  			}else{
  				findTape(this.task.id).then(ret => {
  					if(ret && ret.rel){
  						this.loadPlayer(ret.data.f, ret.data.s);
  					}else{
  						this.$message.error({message: ret.msg, showClose: true});
  					}
  				});
  			}
  			this.playerLoading = false;
  		},
  		openNewTab(){
  			window.open(this.task.tape.address, "_blank");
  		},
  		loadPlayer(f, s){
  			let url = getAudioUrl(f, s);
            if(this.isFirstOpen){
              this.isFirstOpen = false;
              setTimeout(()=>{
                this.player = Player();
                this.player.initData("audioDiv");
                this.player.load(url);
              }, 800);
            }else{
              this.player.load(url);
            }
  		},
  		playRateChangeHandler(val){
        	this.player.playRate(val);
      	},
  	}
}
	
</script>


<template>
	<transition name="slide-fade">
	  	<div v-show="isShow" id="appAsidePanel" class="app-aside-content">
	  		<div class="notify-title">
	  			<div v-if="list.length">
	  				<span>您有 </span>
	  				<span class="notify-title-num">{{list.length}}</span>
	  				<span> 个待处理任务</span>
	  			</div>
	  			<div v-else><span>当前没有待处理任务！</span></div>
	  		</div>
	  		<div class="notify-close">
	  			<div class="el-box" @click="toggleAppAside">
	  				<div class="notify-close-i"><i class="icm icon-Close"></i></div>
	  				<div class="notify-close-text">关闭</div>
	  			</div>
	  		</div>
	  		<div class="notify-more">
	  			<span class="notify-more-text" @click="openMyNotifyList">查看更多通知</span>
	  		</div>
		    <div >
		    	<table class="notify-tb">
	    			<tr v-for="(item, i) in subList">
	    				<td class="notify-tb-no">{{i+1}}.</td>
    					<td class="notify-tb-sub" @click="processNotify(item)">
    						<span >({{item.statusStr}})</span>
    						<span v-if="item.submitTime" class="notify-tb-time">{{item.submitTime.substring(0, 10)}}</span>
    						<span class="notify-tb-content">{{item.name}}</span>
	    				</td>
	    			</tr>
		    	</table>
			    <el-collapse-transition>
			    </el-collapse-transition>
		    </div>
	  	</div>
  	</transition>
</template>

<style scoped>
	
.notify-title{
	margin: 20px 10px 10px 10px;
    text-align: center;
}
.notify-title-num{
	font-size: 16px;
	font-weight: bold;
	color: blue;
}

.notify-close{
	float: left;
	margin-left: 10px;
	margin-top: 3px;
}

.notify-close-i{
	font-size: 14px;
    margin-right: -7px !important;
}

.notify-close-text{
	font-size: 14px;
	margin-top: 0px;
}
.notify-close :hover{
	color: #589df6;
    cursor:pointer;
}

.notify-more{
	text-align: right;
    margin-right: 17px;
    
}
.notify-more-text{
	font-size: 11px;
	text-decoration: underline;
    cursor: pointer;
}

.notify-more span:hover{
	color: #589df6;
    cursor:pointer;
}

.notify-tb{
	margin: 10px 10px 10px 10px;
}
.notify-tb tr:hover{
	color: #589df6;
    cursor:pointer;
}
.notify-tb span{
	font-size: 14px;
}

.notify-tb-no{
	font-size: 14px;
	padding-top: 4px;
	vertical-align: text-top;	
}
.notify-tb-sub{
	cursor: pointer;
}
.notify-tb-time{
	color: rgba(241, 21, 21, 0.84);
}
.notify-tb-content{
	display: block;
    margin: 1px 0px 3px 1px;
}
</style>

<script>
import { mapGetters } from 'vuex';
import {hasPermission} from '@/utils/permissionUtil';
export default {
	name: 'AppAside',
	data() {
	    return {
	    	maxContentLength: 22,
	    	maxShowNum: 10,
	    	isShowMyNotify: false,
		    testList:[{
		    	name:'审批任务审批任务审批任务审批任务审批任务',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'未读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskApproval"}
		    }, {
		    	name:'质检评分',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'未读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskEvaluation"}
		    }, {
		    	name:'质检评dddddd分',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'未读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskEvaluation"}
		    }, {
		    	name:'质检评质检评分质检评分质检评分质检评分质检评分质检评分',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'未读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskEvaluation"}
		    }, {
		    	name:'质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分质检评分',
		    	submitTime:'2019-03-20 12:45:12',
		    	statusStr:'已阅读',
		    	actionType: 1,
		    	actionParamObject: { path: "/quality/task/mainTaskEvaluation"}
		    }]
	    }
  	},
  	created(){
  		this.isShowMyNotify = hasPermission("myNotify.view");	
  	},
	computed:{
		...mapGetters([
		    'appAside'
		]),
		isShow() {
		    return this.appAside.show
		},
		list(){
			if(!this.appAside.list || !this.appAside.list.length){
				//return [];
				return this.testList;
			}
		},
		subList(){
//			if(!this.appAside.list || !this.appAside.list.length){
//				return [];
//			}
//			this.appAside.list.forEach((i, item)=>{
//				if(item.name.length > 20){
//					item._name = item.name;
//					item.name = item.name.substring(0, 20)+'...';
//				}
//			});
			var arr = [];
			let item;
			for (var i=0; i < this.testList.length; i++) {
				item = this.testList[i];
			    if(item.name.length > this.maxContentLength){
					item._name = item.name;
					item.name = item.name.substring(0, this.maxContentLength)+'...';
				}
				arr.push(item);
				if(arr.length >= this.maxShowNum){
					break;
				}
			}
			return arr;
		}
	},
	methods:{
		openMyNotifyList(){
			if(!this.isShowMyNotify){
				this.$message.error({message: '您没有通知列表功能权限, 请联系管理员!',showClose: true});
				return ;
			}
			this.toggleAppAside();
			this.$router.push("/quality/notify/myNotify");
		},
		processNotify(row){
			if(row.actionType == 1){
				this.$router.push(row.actionParamObject.path);
			}
		},
		toggleAppAside (e) {
		  	this.$store.dispatch('ToggleAppAside');
		}
	}
	
}
</script>
<style type="text/css"> 

.app-aside-content{
    background-color: #d1d7e5;
    transition: all .2s ease;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
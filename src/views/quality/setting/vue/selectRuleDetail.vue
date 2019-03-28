<template>
	<div>
		<div class="el-dialog-panel">
            <el-form :model="selectDetailForm" :rules="selectDetailFormRules" 
            		ref="selectDetailForm" label-width="80px" class="form-body-u">
	            	<el-form-item label="条件维度" prop="resolver" required >
		              	<el-select v-model="selectDetailForm.resolver" placeholder="选择条件维度" :disabled="isReadOnly || isSystem" style="width: 225px;">
		                  <el-option v-for="item in resolverArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
		                </el-select>
	               	</el-form-item>  
	               	<!--
	                	作者：刘波
	                	时间：2018-11-21
	                	描述：录音时长 条件维度
	                -->
	           		<el-form-item v-if="selectDetailForm.resolver == 'tapeTimeLong'" prop="start" label="时长范围" required >
		                <el-input-number :disabled="isReadOnly" v-model="selectDetailForm.start" :min="0" :max="2000" style="width: 105px;"></el-input-number>
		                <span>-</span>
		                <el-input-number :disabled="isReadOnly" v-model="selectDetailForm.end" :min="0" :max="2000" style="width: 105px;"></el-input-number>
	          		</el-form-item>
	          		<!--
	                	作者：刘波
	                	时间：2018-11-21
	                	描述：员工类型  条件维度
	                -->
	          		<el-form-item v-else-if="selectDetailForm.resolver == 'userType'" prop="userType" label="员工类型" required >
	                   <el-select v-model="selectDetailForm.userType" placeholder="选择员工类型" :disabled="isReadOnly" style="width: 225px;">
		                  <el-option v-for="item in userTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
		               </el-select>
	                </el-form-item>
	                
	                <!--
	                	作者：刘波
	                	时间：2018-11-21
	                	描述：弹屏小结  条件维度
	                -->
	                <div v-else-if="selectDetailForm.resolver == 'summary'" style="display: table;">
	                	<el-form-item  prop="typeCode" label="服务类型" required >
		                   <el-select v-model="selectDetailForm.typeCode" placeholder="选择服务类型" :disabled="isReadOnly" style="width: 225px;">
			                  <el-option v-for="item in typeCodeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
			               </el-select>
			            </el-form-item>
	                	<el-form-item  prop="firstCode" label="来电一级" style="width: 350px;">
		                   <el-select v-model="selectDetailForm.firstCode" clearable placeholder="选择来电一级" :disabled="isReadOnly" style="width: 225px;">
			                  <el-option v-for="item in firstCodeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
			               </el-select>
		                </el-form-item>
	                	<el-form-item  prop="secondCode" label="来电二级" style="width: 350px;">
		                   <el-select v-model="selectDetailForm.secondCode" clearable placeholder="选择来电二级" :disabled="isReadOnly" style="width: 225px;">
			                  <el-option v-for="item in secondCodeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
			               </el-select>
		                </el-form-item>
	                	<el-form-item  prop="thirdCode" label="来电三级" style="width: 350px;">
		                   <el-select v-model="selectDetailForm.thirdCode" clearable placeholder="选择来电三级" :disabled="isReadOnly" style="width: 225px;">
			                  <el-option v-for="item in thirdCodeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
			               </el-select>
		                </el-form-item>
	                	<el-form-item  prop="forthCode" label="来电四级" style="width: 350px;">
		                   <el-select v-model="selectDetailForm.forthCode" clearable placeholder="选择来电四级" :disabled="isReadOnly" style="width: 225px;">
			                  <el-option v-for="item in forthCodeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
			               </el-select>
		                </el-form-item>
	            	</div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer dialog-footer-u">
            <el-button @click="closeDialog()">取 消</el-button>
            <el-button v-if="editStatus != 'view'" @click="selectRuleDetailHandler()" type="primary">确 定</el-button>
        </div>
	</div>
</template>

<script>
import $ from 'jquery';
import {listSummary} from '@/views/quality/business/api/summary';
import {creatValid, checkRequire, check, checkNumber} from '@/components/public/validator';
import {getMapFromArr} from '@/utils/arrayUtil';
export default {
  	name: 'selectRuleDetail',
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
	    sampleType:{
	    	type: String,
      		required: true
	    },
	    editStatus: {
      		type: String,
      		required: true
    	},
	    index:{
	    	type: Number,
	    	required: true
	    },
	    ruleDetail: {
	      	type: Object,
	      	required: true
	    },
	    ruleDetailList: {
	      	type: Array,
	      	required: true
	    }
  	},
  	data() {
    	return {
      		resolverArr:[
		      	{value:'tapeTimeLong', name:'录音时长'},
		      	{value:'userType', name:'员工类型'},
		      	{value:'summary', name:'弹屏小结'}
	      	],
	      	userTypeArr:[
		      	{value:'NEW', name:'新员工'},
		      	{value:'OLD', name:'老员工'}
		    ],
	      	typeCodeArr:[],
		    firstCodeArr:[],
		    secondCodeArr:[],
		    thirdCodeArr:[],
	      	forthCodeArr:[],
	      	selectDetailMetadata:{
	      		resolver: 'tapeTimeLong',
	      		name:undefined,
	      		userType:'OLD',
	      		start: 0,
	      		end:0,
	      		typeCode: undefined,
	      		firstCode: undefined,
	      		secondCode: undefined,
	      		thirdCode: undefined,
	      		forthCode: undefined,      		
	      	},
	      	selectDetailForm: $.extend(true, {}, this.selectDetailMetadata, this.ruleDetail),
	      	selectDetailFormRules:{
	      		resolver: creatValid((rule, value, callback)=>{
	      			if(!value){
	      				callback(new Error("请选择条件维度"));
	      			}else{
	      				if(this.isSystem){
	      					callback();
	      				}else{
	      					let res = this.checkRuleDetail(value, (item)=>{
					    		return "条件维度冲突!";
					    	});
					    	if(res){
					    		callback(new Error(res));
					    	}else{
					    		callback();
					    	}
	      				}
	      			}
	      		}),
	      		userType: creatValid((rule, value, callback)=>{
	      			if(!value){
	      				callback(new Error("请选择员工类型"));
	      			}else{
	      				let res = this.checkRuleDetail("userType", (item)=>{
				    		if(item.userType == this.selectDetailForm.userType){
				    			return "员工类型维度冲突!";
				    		}
				    	});
				    	if(res){
				    		callback(new Error(res));
				    	}else{
				    		callback();
				    	}
	      			}
	            }),
	            start: creatValid((rule, value, callback)=>{
			    	if((!value && value!=0) || (value == 0 && !this.selectDetailForm.end)){
			    		callback(new Error("请填写时长范围"));
			        }else if(value >= this.selectDetailForm.end){
			         	callback(new Error("结束时长必须大约起始时长"));
			        }else{
			         	let res = this.checkRuleDetail("tapeTimeLong", (item)=>{
			         		let res = this.checkRange(item, this.selectDetailForm);
			    			return res?"与录音时长维度("+res+")冲突!":'';
				    	});
				    	if(res){
				    		callback(new Error(res));
				    	}else{
				    		callback();
				    	}
			        }
	            }),
	            typeCode: creatValid((rule, value, callback)=>{
	      			if(!value){
	      				callback(new Error("请选择服务类型"));
	      			}else{
	      				let res = this.checkRuleDetail("summary", (item)=>{
				    		if(item.typeCode == this.selectDetailForm.typeCode){
				    			return "服务类型维度冲突!";
				    		}
				    	});
				    	if(res){
				    		callback(new Error(res));
				    	}else{
				    		callback();
				    	}
	      			}
	            })
	      	}
    	}
  	},
  	computed: {
	  	resolverMapping(){
	  		return getMapFromArr(this.resolverArr);
	  	},
	  	userTypeMapping(){
	  		return getMapFromArr(this.userTypeArr);
	  	},
	  	typeCodeArrMapping(){
	  		return getMapFromArr(this.typeCodeArr);
	  	},
	  	firstCodeArrMapping(){
	  		return getMapFromArr(this.firstCodeArr);
	  	},
	  	secondCodeArrMapping(){
	  		return getMapFromArr(this.secondCodeArr);
	  	},
	  	thirdCodeArrMapping(){
	  		return getMapFromArr(this.thirdCodeArr);
	  	},
	  	forthCodeArrMapping(){
	  		return getMapFromArr(this.forthCodeArr);
	  	},
	  	isSystem(){
	  		return this.sampleType == 'system';
	  	},
	  	isReadOnly(){
	  		return this.editStatus == 'view';
	  	}  	
  	},
	  watch:{
	  	'selectDetailForm.resolver':{
	  		immediate: true,
		    handler(newVal, oldVal) {
		      if(newVal == 'summary' && (!this.typeCodeArr || !this.typeCodeArr.length)){
		      		this.listCodeArr();
		      }
		    }
	  	},
	  	'selectDetailForm.typeCode':{
	  		immediate: true,
		    handler(newVal, oldVal) {
		    	if(newVal){
					listSummary(newVal, 1).then(response => {this.firstCodeArr = response.data;});
				}
		      	if(this.selectDetailForm.firstCode && oldVal){
		      		this.selectDetailForm.firstCode = '';
		      		this.secondCodeArr = [];
		      		this.thirdCodeArr = [];
		      		this.forthCodeArr = [];
		      	}
		    }
	  	},
	  	'selectDetailForm.firstCode':{
		    immediate: true,
		    handler(newVal, oldVal) {
		    	if(newVal){
		    		listSummary(newVal, 2).then(response => {this.secondCodeArr = response.data;});
		    	}
		      	if(this.selectDetailForm.secondCode && oldVal){
		      		this.selectDetailForm.secondCode = '';
		      		this.thirdCodeArr = [];
		      		this.forthCodeArr = [];
		      	}
		    }
	  	},
	  	'selectDetailForm.secondCode':{
	  		immediate: true,
		    handler(newVal, oldVal) {
		    	if(newVal){
		    		listSummary(newVal, 3).then(response => {this.thirdCodeArr = response.data;});
		    	}
		      	if(this.selectDetailForm.thirdCode && oldVal){
		      		this.selectDetailForm.thirdCode = '';
		      		this.forthCodeArr = [];
		      	}
		    }
	  	},
	  	'selectDetailForm.thirdCode':{
	  		immediate: true,
		    handler(newVal, oldVal) {
		    	if(newVal){
		    		listSummary(newVal, 4).then(response => {this.forthCodeArr = response.data;});
		    	}
		      	if(this.selectDetailForm.forthCode && oldVal){
		      		this.selectDetailForm.forthCode = '';
		      	}
		    }
	  	}
  	},
  	created() {
  	},
  	methods: {
	  	listCodeArr(){
	  		listSummary('', 0).then(response => {this.typeCodeArr = response.data;});
	  	},
	  	checkRuleDetail(resolver, compare){
	  		if(this.ruleDetailList && this.ruleDetailList.length > 0){
	  			let arr = this.ruleDetailList;
	  			for(var i=0;i<arr.length;i++){
	  				if(i == this.index){
	  					continue;
	  				}
	  				if(arr[i].resolver == resolver && arr[i].resolverParam){
	  					let res = compare(arr[i]);
	  					if(res){
	  						return res;
	  					}
	  				}
	  			}
	  		}
	  		return null;
	  	},
	  	checkRange(item1, item2){
	  		//item1是比较对象，item2是当前对象
	  		if(!item1.end && !item2.end){
	  			return item1.start+" - ∞";
	  		}else if(!item1.end){
	  			if(item1.start <= item2.start || item1.start < item2.end){
	  				return item1.start+" - ∞";
	  			}
	  		}else if(!item2.end){
	  			if(item2.start <= item1.start || item2.start < item1.end){
	  				return item1.start+" - "+item1.end;
	  			}
	  		}else{
	  			if(item1.start>=item2.start && item1.start < item2.end){
	  				return item1.start+" - "+item1.end;
	  			}
	  			if(item1.end>item2.start && item1.end < item2.end){
	  				return item1.start+" - "+item1.end;
	  			}
	  			if(item2.start>=item1.start && item2.start < item1.end){
	  				return item1.start+" - "+item1.end;
	  			}
	  			if(item2.end>item1.start && item2.end < item1.end){
	  				return item1.start+" - "+item1.end;
	  			}
	  		}
	  	},
	    closeDialog(){
	      	this.close();
	    },
	    selectRuleDetailHandler(){
	    	this.$refs['selectDetailForm'].validate(valid => {
	        	if (!valid) {
	        		return false;
	        	}
	        	var param = {};
        		let digestName = "";
		    	switch(this.selectDetailForm.resolver){
		    		case 'tapeTimeLong': {
						param = {
							start: this.selectDetailForm.start,
							end: this.selectDetailForm.end
						};
						digestName = ' ('+(param.end? param.start + " - "+param.end : param.start + " - ∞")+")s";
						break;
					}
					case'userType': {
						param = {userType: this.selectDetailForm.userType}; 
						digestName = ' (' +this.userTypeMapping[param.userType]+")";
						break;
					}
					case'summary': {
						param = {
							typeCode: this.selectDetailForm.typeCode,
				      		firstCode: this.selectDetailForm.firstCode,
				      		secondCode: this.selectDetailForm.secondCode,
				      		thirdCode: this.selectDetailForm.thirdCode,
				      		forthCode: this.selectDetailForm.forthCode,  
						};
						digestName = ' [' +this.typeCodeArrMapping[param.typeCode];
						if(param.firstCode){
							digestName+=' / '+this.firstCodeArrMapping[param.firstCode];
							if(param.secondCode){
								digestName+=' / '+this.secondCodeArrMapping[param.secondCode];
								if(param.thirdCode){
									digestName+=' / '+this.thirdCodeArrMapping[param.thirdCode];
									if(param.forthCode){
										digestName+=' / '+this.forthCodeArrMapping[param.forthCode];
									}
								}
							}
						}
						digestName+="]";
						break;
					}
		    		default :break;
		    	}
		    	this.selectDetailForm.resolverParam = JSON.stringify(param);
		    	this.selectDetailForm.name = this.resolverMapping[this.selectDetailForm.resolver];
		    	console.log(this.resolverMapping);
		    	console.log(this.selectDetailForm.resolver);
		    	console.log(this.selectDetailForm);
		    	this.selectDetailForm.digestName = this.selectDetailForm.name + digestName;
		    	this.callback(this.index, this.selectDetailForm);
		    	this.closeDialog();
	      	});
	    }
  	}
}
	
</script>

<style>
</style>
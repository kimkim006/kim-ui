<template>
	<el-tabs v-model="activeTab" type="border-card">
	  	<el-tab-pane v-for="(item, index) in callScreens" 
	  		:key="item.name" :label="item.title" :name="item.name">
	    	<call-screen-detail :serviceId="item.serviceId"></call-screen-detail>
	  	</el-tab-pane>
	</el-tabs>
</template>

<script>

export default {
	name: 'callScreen',
	components: {
	    'call-screen-detail': () => import('./callScreenDetail')
	},
	props:{
		activeScreen:""
	},
	data() {
	  	return {
	    	activeTab:"",
	  	}
	},
	computed: {
	    callScreens() {
	       	return this.$store.state.app.callScreens;
	    },
	    activeCallScreen(){
	    	return this.$store.state.app.activeCallScreen;
	    }
    },
    watch:{
    	
    	activeTab(val){
    		this.$store.dispatch('setActiveCallScreen', val);
    	}
    },
    created(){
    	this.activeTab = this.activeCallScreen;
    },
	methods: {
	}
}
</script>

<style>
</style>
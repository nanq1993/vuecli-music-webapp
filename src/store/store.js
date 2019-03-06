import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
	state:{
		showPlayer:false,
		bottom:"0px",
		screenHeight:800,
	},
	getters:{
		getIsPlay:state=>state.showPlayer,
		getPlayHeigh:state=>state.bottom,
		getscreenHeigh:state=>state.screenHeight
	},
	mutations:{
		setIsPlay(state,date){
			state.showPlayer=date;
		},
		setPlayHeigh(state,date){
			state.bottom=date;
		},
		setScreenHeigh(state,date){
			state.screenHeight=date;
		}
	}
})
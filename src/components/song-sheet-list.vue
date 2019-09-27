 <template>
	 <div class="sheet-list">
		<van-list error-text="请求失败，点击重新加载">
			<van-cell  :title="'播放全部('+songlist.length+')'" icon="play-circle-o"></van-cell>
			<van-cell :clickable="true" v-for="(item,index) in songlist" :key="index" @click="playMusic(index)">
				<template class="sheet-list-item" slot="title">
					<van-row>
					<van-col span="3">
						<div class="list-item-index"><p  v-html="index+1"></p></div>
					</van-col>
					<van-col span="18">
						<div class="list-item-right-div">
							<p v-html="item.name" class="list-item-name"></p>
							<p v-html="item.ar[0].name+'--'+item.al.name" class="list-item-detail"></p>
						</div>
					</van-col>
					</van-row>
				</template>
				<van-icon slot="right-icon" name="wap-nav" class="custom-icon list-item-icon" />
			</van-cell>
		</van-list>
	 </div>
 </template>

 <script>
import configs from "./../config/appConfig.js";

 export default {
	 props: {
		 songlist:Array,
	 },
	 data() {
		 return {

		 };
	 },
	 computed: {

	 },
	 created() {
	 },
	 mounted() {

	 },
	 watch: {

	 },
	 methods: {
		playMusic(index){
		  this.$root.$children[0].musicArr=this.songlist;
		  this.$root.$children[0].currentIndexRender=index;
		}
	 },
	 components: {

	 },
 };
 </script>

 <style scoped >
	.sheet-list{

	}
	.list-item-index{
		height: 20px;
	}
	.list-item-index p{
		text-align: center;
		font-size: 15px;
		color: #666;
		vertical-align: middle;
	}
	.list-item-right-div{
		height: 30px;
	}
	.list-item-name{
		margin: 0px;
		padding: 0px;
		font-size: 12px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
	.list-item-detail{
		margin: 0px;
		font-size: 8px;
		overflow: hidden;
		display: -webkit-box;
		color: #666;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}
	.list-item-icon{
		margin-top: 14px;
	}
 </style>

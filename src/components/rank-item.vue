 <template>
	 <div class="rankitem">
		 <van-row gutter="20">
			 <van-col span="8">
				<img class="rank-item-img"  v-lazy="imgurl">
			 </van-col>
			 <van-col span="16">
				<p class="rank-item-name" v-html="name"></p>
				<p class="rank-item-descript" v-html="descript"></p>
			 </van-col>
		 </van-row>
	 </div>
 </template>
 
 <script>
 export default {
	 props: {
		imgurl:String,
		name:String,
		descript:String,
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
 
	 },
	 components: {
 
	 },
 };
 </script>
 
 <style scoped lang="css">
	.rankitem{
		width: 94%;
		margin-left: 3%;
		margin-top: 6px;
		border-bottom: 1px solid #ccc;
	}
	.rank-item-img{
		width: 90%;
		border-radius: 5px;
	}
	.rank-item-name{
		margin-top: 8px;
		font-size: 15px;
		font-weight:bold;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		width: 90%;
	}
	.rank-item-descript{
		margin-top: 0px;
		font-size: 14px;
		overflow: hidden;
		display: -webkit-box;
		text-indent:2em;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		width: 90%;
		text-align: left;
	}
 </style>
 
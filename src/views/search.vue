 <template>
	 <div >
		 <van-field
			class="search-field"
			v-model="searchtext"
			clearable
			left-icon="arrow-left"
			color="#000"
			autofocus="true"
			size="medium"
			@input="getKeyWords"
			placeholder="请输入搜索内容"
			@keydown.enter="keydownHandle"
			@click-left-icon="gotoback"
		/>
		<div class="seach-hint van-hairline--left van-hairline--right" v-if="searchtext&&showKeyWords">
			<ul>
				<li class="seach-hint-li van-hairline--bottom"  ><span style="color:#aa4411">搜索:</span>{{searchtext}}</li>
				<li  class="seach-hint-li van-hairline--bottom" v-for="(item,index) in keywords" :key="index">
					<van-icon name="search" size="18px"></van-icon>{{item.keyword}}
				</li>
			</ul>
		</div>
	 	<div v-show="searched">

		</div>
		<div class="unsearch" v-show="!searched">
			<!-- 未搜索 -->
			<div class="unsearch-hotsearch">
				<p class="unsearch-hotsearch-p van-hairline--bottom" >热门搜索</p>
				<div class="unsearch-hotsearch-item" v-for="(item,index) in hots" :key="index" >
					<span v-html="item.first"></span>
				</div>
			</div>
		</div>
	 </div>
 </template>
 <script>
import configs from "./../config/appConfig.js"

 export default {
	 props: {
		 
	 },
	 data() {
		 return {
			 searchtext:"",
			 searched:false,
			 hots:[],
			 keywords:[],
			 showKeyWords:false,
		 };
	 },
	 computed: {
		 
	 },
	 created() {
		 var _this=this;
		 this.$http.get(configs.APIURL+"/search/hot")
			.then(response=>{
				console.log(response.data.result);
				_this.hots=response.data.result.hots;
			}).catch(err=>{

			});
	 },
	 mounted() {
		 
	 },
	 watch: {
		 
	 },
	 methods: {
		gotoback(){
			this.$router.back();
		},
		getKeyWords(){
			this.showKeyWords=true;
			var _this=this;
			this.$http.get(configs.APIURL+"/search/suggest",{params:{keywords:this.searchtext,type:"mobile"}})
				.then(response=>{
					console.log(response.data.result);
					_this.keywords=response.data.result.allMatch;
				}).catch(err=>{

				});
		},
		//监听回车
		keydownHandle(){
			if(!this.searchtext){
				return;
			}
			this.searchSong();
		},
		//搜索方法
		searchSong(){
			this.showKeyWords=false;
			//歌手
			this.$http.get(configs.APIURL+"/search",{params:{keywords:this.searchtext,type:"100"}})
				.then(response=>{
					console.log(response.data);
				}).catch(err=>{

				});
			//歌单
			this.$http.get(configs.APIURL+"/search",{params:{keywords:this.searchtext,type:"1000"}})
				.then(response=>{
					console.log(response.data);
				}).catch(err=>{

				});
			//歌曲
			this.$http.get(configs.APIURL+"/search",{params:{keywords:this.searchtext,type:"1"}})
				.then(response=>{
					console.log(response.data);
				}).catch(err=>{

				});
				
		}
	 },
	 components: {
 
	 },
 };
 </script>
 
 <style>
 .search-field{
	 background-color: rgb(212, 68, 57);
	 size: 30px;
	 height: 50px;
	 color: #fff;
 }
 .seach-hint{
	 position: absolute;;
	 top: 50;
	 left: 30px;
	 right: 30px;
	 z-index: 2;
	 background-color: #fff;
 }
 .seach-hint-li{
	 line-height: 50px;
	 font-size: 18px;
 }
 .unsearch-hotsearch-item{
	border:1px solid rgb(212, 68, 57);
	float: left;
	padding: 5px 12px;
	margin: 7px 5px;
	border-radius:8px;
 }
 .unsearch-hotsearch-p{
	 padding: 10px 15px;
	 
 }
 </style>
 
 <template>
	 <div >
		 <van-field
			class="search-field"
			v-model="searchtext"
			:clearable="true"
			left-icon="arrow-left"
			:autofocus="false"
			size="medium"
			@input="getKeyWords"
			placeholder="请输入搜索内容"
			@keydown.enter="keydownHandle"
			@click-left-icon="gotoback"
		/>
		<div class="seach-hint van-hairline--left van-hairline--right" v-if="searchtext&&showKeyWords">
			<ul>
				<li class="seach-hint-li van-hairline--bottom" @click="clickToSearch(searchtext)" ><span style="color:#aa4411">搜索:</span>{{searchtext}}</li>
				<li  class="seach-hint-li van-hairline--bottom" v-for="(item,index) in keywords" :key="index" @click="clickToSearch(item.keyword)">
					<van-icon name="search" size="18px"></van-icon>{{item.keyword}}
				</li>
			</ul>
		</div>
		<div class="searchresult" v-show="searched">
			<scroll class="wrapper"  :data="resultlist"  data2="bottom" :style="{bottom:bottom}" >
			<div class="content">
				<!-- 搜索结果 -->
				<h4 v-show="songsheetobj||singerlistobj"  class="searchresult-guess">你可能感兴趣</h4>
				<ul>
					<li v-show="singerlistobj.name" class="searchresult-item-li van-hairline--bottom flexlayout" @click="gotosheet(0,singerlistobj.id)">
						<img class="searchresult-item-img"  :src="singerlistobj.img1v1Url" />
						<span class="searchresult-item-span" v-html="highLight('歌手：'+singerlistobj.name)"></span>
					</li>
					<li v-show="songsheetobj.name"  class="searchresult-item-li van-hairline--bottom flexlayout" @click="gotosheet(songsheetobj.id,0)">
						<img class="searchresult-item-img"  :src="songsheetobj.coverImgUrl"/>
						<span class="searchresult-item-span van-hairline--bottom"  v-html="highLight('歌单：'+songsheetobj.name)"></span>
					</li>
					<li v-show="resultlist" v-for="(item,index) in resultlist" :key="index"  class=".searchresult-item-songli van-hairline--bottom" @click="gotoSong(item)">
						<div>
							<span class="searchresult-item-span-song"  v-html="highLight(item.name)"></span><br>
							<span class="searchresult-item-span-singer"  v-html="highLight(item.artists[0].name)"></span>
						</div>
					</li>
				</ul>
			</div>
			</scroll>
		</div>
		<div class="unsearch" v-show="!searched">
			<scroll class="wrapper"  :data="historySearch"  data2="bottom" :style="{bottom:bottom}" >
			<div class="content">
				<!-- 未搜索 -->
				<div class="unsearch-hotsearch">
					<p class="unsearch-hotsearch-p van-hairline--bottom" >热门搜索</p>
					<div class="unsearch-hotsearch-item" v-for="(item,index) in hots" :key="index" >
						<a  @click.prevent="clickToSearch(item.first)"><span v-html="item.first"></span></a>
					</div>
				</div>
				<div class="unsearch-history" v-show="historySearch">
					<ul>
						<li class="unsearch-history-li van-hairline--top-bottom">
							<a  href="javascript:void(0)" class="unsearch-history-li-a" ><span class="unsearch-history-li-span" >搜索历史</span></a>
							<van-icon class="unsearch-history-li-icon" name="delete" @click="destroyHisttory()"/>
						</li>
						<li class="unsearch-history-li van-hairline--top-bottom" v-for="(item,index) in historySearch" :key="index">
							<van-icon  name="clock-o"/>
							<a @click.prevent="clickToSearch(item)" class="unsearch-history-li-a" ><span class="unsearch-history-li-span" >{{item}}</span></a>
							<van-icon class="unsearch-history-li-icon" name="cross" @click="deleteHistory(index)"/>
						</li>
					</ul>
				</div>
			</div>
			</scroll>
		</div>
	 </div>
 </template>
 <script>
import configs from "./../config/appConfig.js"
import { mapState,mapGetters , mapMutations} from "vuex"
import scroll from "./../components/scroll.vue"
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
			songsheetobj:{},
			singerlistobj:{},
			resultlist:[],
			historySearch:[],
		 };
	 },
	 computed: {
		 ...mapState(["showPlayer","bottom"]),
	 },
	 created() {
		 var _this=this;
		 this.$http.get(configs.APIURL+"/search/hot")
			.then(response=>{
				_this.hots=response.data.result.hots;
			}).catch(err=>{

			});
		this.getHistory();
	 },
	 mounted() {

	 },
	 watch: {
		 searchtext(val){
			 if(val==""){
				this.searched=false;
				this.showKeyWords=false;
			 }
		 }
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
		clickToSearch(searchStr){
			this.searchtext=searchStr;
			this.searchSong();
		},
		//搜索方法
		searchSong(keywords=this.searchtext){
			if(!keywords){
				return;
			}
			this.showKeyWords=false;
			var _this=this
			//歌手
			this.$http.get(configs.APIURL+"/search",{params:{keywords:keywords,type:"100"}})
				.then(response=>{
					_this.singerlistobj=response.data.result.artists[0];
				}).catch(err=>{

				});
			//歌单
			this.$http.get(configs.APIURL+"/search",{params:{keywords:keywords,type:"1000"}})
				.then(response=>{
					_this.songsheetobj=response.data.result.playlists[0];
				}).catch(err=>{

				});
			//歌曲
			this.$http.get(configs.APIURL+"/search",{params:{keywords:keywords,type:"1"}})
				.then(response=>{
					_this.resultlist=response.data.result.songs
				}).catch(err=>{

				});
			this.searched=true;
			this.addHistory(keywords);
		},
		highLight(textStr,keyword=this.searchtext){
			var reg=new RegExp(keyword,"g");
			return textStr.replace(reg,"<span class='searchresult-item-highlight'>"+keyword+"</span>")
		},
		gotosheet(sheetid,singerid){
			if(!singerid){
				singerid=0;
			}
			this.$router.push({ name: 'songsheet', params: { sheetid,singerid }})
		},
		gotoSong(item){
			var arrTemp=new Array();
			item.ar=item.artists;
			arrTemp.push(item);
			this.$root.$children[0].musicArr=arrTemp;
			this.$root.$children[0].currentIndexRender=0;
		},
		getHistory(){
			var historyJson=localStorage.getItem("historySearch");
			if(historyJson){
				this.historySearch=JSON.parse(historyJson);
			}else{
				this.historySearch=[];
			}
		},
		addHistory(textStr=this.searchtext){
			this.historySearch.unshift(textStr);
			var historyJson=JSON.stringify(this.historySearch);
			localStorage.setItem("historySearch",historyJson);
		},
		deleteHistory(index){
			if(!this.historySearch){
				return;
			}
			this.historySearch.splice(index,1);
			var historyJson=JSON.stringify(this.historySearch);
			localStorage.setItem("historySearch",historyJson);
		},
		destroyHisttory(){
			this.historySearch=[];
			localStorage.removeItem("historySearch");
		}
	 },
	 components: {
		 scroll
	 },
 };
 </script>

 <style>
 .wrapper{
		position: fixed;
		top: 50px;
		bottom: 0px;
		right: 0px;
		left: 0px;
		overflow: hidden;
	}
 .search-field{
	 background-color: rgb(212, 68, 57);
	 size: 30px;
	 height: 50px;
	 color: #fff;
 }
 .search-field input{
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
 .searchresult-guess{
	 margin: 5px 10px;
 }
.searchresult-item-li{
	height: 70px;
	display: flex;
}
.searchresult-item-img{
	 width: 60px;
	 height: 60px;
	 margin:0 0 0 10px;
 }
 .searchresult-item-span{
	margin:10px 0 0 10px;
	font-size: 15px;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	color: #000;
 }
 .searchresult-item-songli{
	height: 50px;
	width: 100%;
 }
 .searchresult-item-span-song{
	 width: 90%;
	 margin:10px 0px 0 10px;
	font-size: 15px;
	display: inline-block;
	table-layout: fixed;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
 }
 .searchresult-item-span-singer{
	margin:0px 0 5px 10px;
	font-size: 12px;
	display: inline-block;
	table-layout: fixed;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
 }
 .searchresult-item-highlight{
	color: #0099FF;
 }
 .unsearch-hotsearch{
	 float: left;
   width: 100%;
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
   font-family:"simsun";

 }
 .unsearch-history{
    float: left;
    width: 100%;
 }
 .unsearch-history-li{
	 padding: 10px ;
	 display: flex;
 }
.unsearch-history-li-a{
	 flex-grow: 1;
	 display: inline-block;
}
.unsearch-history-li-span{
	vertical-align: top;
	margin-left: 10px
}
 </style>

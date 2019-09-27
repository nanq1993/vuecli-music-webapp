 <template>
	 <div class="songsheet">
		<div class="backgrounddiv"></div>
		<div class="backgroundimg" :style="{ background: `url(${picUrl}) center` }"></div>
		<div class="header">
			<van-row>
				<van-col span="3"><van-icon class="header-back" size="30px" color="#fff" name="arrow-left" @click="onClickLeft"></van-icon></van-col>
				<van-col span="18"><center><h1 class="header-title" v-html="title"></h1></center></van-col>
				<van-col span="3"></van-col>
			</van-row>
		</div>
		<scroll class="wrapper"  ref="wrapper"  :data2="bottom" :style="{bottom:bottom}">
		<div class="content">
			<div class="songsheet-detail" >
				<van-row>
				<van-col span="12" >
					<center>
						<div class="songsheet-detail-left" :style="{backgroundImage: 'url(' + picUrl + ')'}"></div>
					</center>
				</van-col>
				<van-col span="12">
				<div class="songsheet-detail-right">
					<p class="songsheet-title" v-html="title"></p>
					<div class="songsheet-creater" v-if="creator">
						<div class="songsheet-creater-img" :style="{backgroundImage: 'url(' + creator.avatarUrl + ')'}"></div>
						<div class="songsheet-creater-name" v-html="creator.nickname"></div>
					</div>
					<p  v-if="description" v-html="description" class="songsheet-description"></p>
				</div>
				</van-col>
				</van-row>
			</div>
			<div>
				<songsheetlist :songlist="songlist"></songsheetlist>
			</div>
		</div>
		</scroll>
	 </div>
 </template>

 <script>

	import configs from "./../config/appConfig.js"
	import songsheetlist from "./../components/song-sheet-list.vue"
	import scroll from "./../components/scroll.vue"
	import { mapState,mapGetters , mapMutations} from "vuex"
 export default {
	 props: {
		 sheetid:[String, Number],
		 singerid:[String, Number],
	 },
	 data() {
		 return {
			songlist:[],
			picUrl:"",
			creator:0,
			title:"",
			description:"",
		 };
	 },
	 computed: {
		 ...mapState(["showPlayer","bottom"]),
	 },
	 created() {
		 var _this=this;
		 if(this.sheetid){
			this.$http.get(configs.APIURL+"/playlist/detail",{params:{id:""+this.sheetid}})
			.then(response=>{
				_this.songlist=response.data.playlist.tracks;
				_this.picUrl=response.data.playlist.coverImgUrl;
				_this.creator=response.data.playlist.creator;
				_this.title=response.data.playlist.name;
				_this.description=response.data.playlist.description;
			}).catch(err=>{
          console.log(err)
			});
		 }else if(this.singerid){
			 this.$http.get(configs.APIURL+"/artists",{params:{id:""+this.singerid}})
			.then(response=>{
				_this.songlist=response.data.hotSongs;
				_this.picUrl=response.data.artist.picUrl;
				_this.title=response.data.artist.name;
				_this.description=response.data.artist.briefDesc;
			}).catch(err=>{
          console.log(err)
			});
		 }
	 },
	 mounted() {

	 },
	 watch: {

	 },
	 methods: {
		onClickLeft(){
			this.$router.go(-1)
		},
    toinitScroll(){
      this.$refs.wrapper._initScroll();
    }
	 },
	 components: {
		songsheetlist,
		scroll,
	 },
 };
 </script>

 <style scoped>
	.wrapper{
		position: fixed;
		top: 40px;
		bottom: 0px;
		right: 0px;
		left: 0px;
		overflow: hidden;
	}
	.content{
		width: 100%;
	}
	.songsheet-detail{
		padding: 25PX;
	}
	.header{
		padding-top: 10px;
		height: 50px;
	}
	.header-title{
		padding-top:0px;
		margin-top: 0px;
		width: 100%;
		font-size: 20px;
		position: relative;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		color: #fff;
	}
	.backgroundimg{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-size: cover;
		filter: blur(80px);
		transform: scale(1.5);
		z-index: -1;
		background-size: cover;
	}
	.backgrounddiv{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(7, 17, 27, 0.2)
	}
	.songsheet-detail-left{
		height: 150px;
		width: 150px;
		border-radius:5PX;
		background-position:center center;
		background-size:auto 100%;
	}
	.songsheet-detail-right{
		width: 100%;
		height: 150px;
	}
	.songsheet-title{
		margin: 0px;
		font-size: 15px;
		position: relative;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		color: #fff;
	}
	.songsheet-creater{
		height: 50px;
	}
	.songsheet-creater-img{
		height: 50px;
		width: 50px;
		border-radius:50%;
		background-position:center center;
		background-size:auto 100%;
		float: left;
	}
	.songsheet-creater-name{
		padding: 13px 0px 0px 8px;
		font-size: 15px;
		position: relative;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		color: #fff;
	}
	.songsheet-description{
		margin-bottom:0px;
		position: relative;
		bottom: 0px;
		font-size: 12px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		color: #fff;
	}
 </style>

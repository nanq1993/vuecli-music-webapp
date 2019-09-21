 <template>
 <div>
	<scroll class="wrapper"  :data="personalized" data2="bottom" :style="{bottom:bottom}" >
		<div class="content">
		<!-- 轮播组建 -->
		<div class="banners">
			<van-swipe :autoplay="3000"  class="csvanswipe" indicator-color="white"  :width="swipeWidth" :height="swipeHeigh">
				<van-swipe-item class="csvanswipeItem" v-for="(bannerItem) in banners"  :key="bannerItem.picUrl">
					<img class="csSwipeImg" :src="bannerItem.imageUrl" />
				</van-swipe-item>
			</van-swipe>
			<div id="vanswipediv"></div>
		</div>
		<!-- 私人fm 每日推荐 歌单 和排行榜入口 -->
<!-- 		<div class="entry">
			<van-row gutter="10">
				<van-col v-for="entryItem in entryList" :key="entryItem.index" span="6" >
					<van-icon class="entryIcon" :name="entryItem.name" color="red" size="3em"></van-icon>
					<p v-html="entryItem.description"></p>
				</van-col>
			</van-row>
		</div> -->
    <div class="line_02"><span>今日歌单推荐</span></div>
		<!-- 推荐歌单 -->
		<div class='sheet-entry-div'>
			<van-row gutter="10" v-for="n in Math.ceil(personalized.length/3)" :key="n">
				<van-col  :span="8"   v-if="personalized[3*(n-1)]">
					<a  @click.prevent="gotosheet(personalized[3*(n-1)].id)"><sheetentry :imgsrc="personalized[3*(n-1)].picUrl" :descript="personalized[3*(n-1)].name"></sheetentry></a>
				</van-col>
				<van-col  :span="8"  v-if="personalized[3*(n-1)+1]">
					<a  @click.prevent="gotosheet(personalized[3*(n-1)+1].id)"><sheetentry   :imgsrc="personalized[3*(n-1)+1].picUrl" :descript="personalized[3*(n-1)+1].name"></sheetentry></a>
				</van-col>
				<van-col  :span="8"  v-if="personalized[3*(n-1)+2]">
					<a  @click.prevent="gotosheet(personalized[3*(n-1)+2].id)"><sheetentry  :imgsrc="personalized[3*(n-1)+2].picUrl" :descript="personalized[3*(n-1)+2].name"></sheetentry></a>
				</van-col>
			</van-row>
		</div>
		</div>
	</scroll>
	</div>
 </template>

 <script>
import configs from "./../config/appConfig.js";
import sheetentry from  "./sheet-entry.vue";
import scroll from "./scroll.vue"
import { mapState,mapGetters , mapMutations} from "vuex"

 export default {
	 props: {

	 },
	 data() {
		 return {
			banners:[],
			personalized:[],
			swipeWidth:0,
			swipeHeigh:0,
			entryList:[
				{index:1,name:"tv-o",description:"私人fm"},
				{index:2,name:"notes-o",description:"每日推荐"},
				{index:3,name:"orders-o",description:"歌单"},
				{index:4,name:"bar-chart-o",description:"排行榜"},
			],
			pulldown:false,
		 };
	 },
	 computed: {
		 ...mapState(["showPlayer","bottom"]),
	 },
	 created() {
		 var _this=this;
		 this.$http.get(configs.APIURL+"/banner")
		.then(response=>{
			_this.banners=response.data.banners;
		}).catch(err=>{

		});
		this.$http.get(configs.APIURL+"/personalized")
		.then(response=>{
			_this.personalized=response.data.result;

		}).catch(err=>{

		});
	 },
	 mounted() {
		this.swipeWidth =parseInt(((document.body.clientWidth)*0.9).toFixed(0));
		this.swipeHeigh=parseInt((0.46*this.swipeWidth).toFixed(0));
	 },
	 methods: {
		 gotosheet(sheetid,singerid){
			if(!singerid){
				singerid=0;
			}
			this.$router.push({ name: 'songsheet', params: { sheetid,singerid }})
		},

	 },
	 components: {
		 sheetentry,
		 scroll,
	 },
 };
 </script>

 <style scoped>
	.wrapper{
		position: fixed;
		top: 90px;
		bottom: 0px;
		right: 0px;
		left: 0px;
		overflow: hidden;
	}
	.csvanswipe{
		margin-left: 5%;
		margin-right: 5%;
	}
	.csSwipeImg{
		border-radius: 6px;
		width: 100%;
		height: 100%;
	}
	.banners{
		content: '';
		position: relative;
		left:0;
		right:0 ;
		height: 200;
	}
	#vanswipediv{
    content: '';
		position: absolute;
    top:0;
		left:0;
		right:0 ;
		bottom:20%;
    background-color:rgb(212, 68, 57);
    z-index: -1;
	}
	.entry{
		position: relative;
		text-align: center;
    top:5px;
		left:0;
		right:0 ;
	}
  .line_02{
      height: 1px;
      border-top: 3px solid rgb(212, 68, 57);
      text-align: center;
      margin: 30px 5px;
  }
  .line_02 span{
      position: relative;
      top: -12px;
      background: #fff;
      padding: 0 20px;
  }
	.sheet-entry-div{
      text-align: center;
      width: 100%;
	}
  .entryIcon{
    display: block;
	}

 </style>

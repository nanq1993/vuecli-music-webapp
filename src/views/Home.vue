<template>
	<div class="home">
		<van-nav-bar class="csnavbar" >
			<van-icon name="apps-o" color="rgb(250,250,250)" size="25px" slot="left" />
			<span class="csspan" slot="title">南强的网站</span>
			<van-icon color="rgb(250,250,250)"  name="search"  size="25px"  slot="right" />
		</van-nav-bar>
		<van-tabs class="cstabs" v-model="active" background="rgb(212, 68, 57)" color="rgb(255, 255, 255)"  title-active-color="rgb(255, 255, 255)"	title-inactive-color="rgb(220, 220, 230)" swipeable>
			<!-- 写推荐页面 -->
			<van-tab  title="推荐">
				<!-- 轮播组建 -->
				<div class="banners">
					<van-swipe :autoplay="3000"  class="csvanswipe" indicator-color="white">
						<van-swipe-item class="csvanswipeItem" v-for="bannerItem in banners"  :key="bannerItem.picUrl">
							<img class="csSwipeImg" :src="bannerItem.picUrl" width="100%">
						</van-swipe-item>
					</van-swipe>
					<div id="vanswipediv"></div>
				</div>
				<!-- 私人fm 每日推荐 歌单 和排行榜入口 -->
				<div class="entry">
					<van-row gutter="10">
						<van-col v-for="entryItem in entryList" :key="entryItem.index" span="6" >
							<van-icon class="entryIcon" :name="entryItem.name" color="red" size="3em"></van-icon>
							<p v-html="entryItem.description"></p>
						</van-col>
					</van-row>
				</div>
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
			</van-tab>
			<van-tab  title="排行">
				<div class="ranker">
					<a  v-for="(item,index) in rankeList" :key="index"  @click.prevent="gotosheet(item.id)">
						<rankitem :imgurl="item.coverImgUrl" :descript="item.description" :name="item.name"></rankitem>
					</a>
				</div>
			</van-tab>
			<van-tab  title="歌手">
				<van-list finished-text="没有更多了">
					<a  v-for="(item,index) in singerlist" :key="index" @click.prevent="gotosheet(0,item.id)">
					<van-cell  >
						<template class="singertemplate"  slot="title">
							<div class="singerIMGDiv"  v-lazy:background-image="item.picUrl">
							</div> 
							<p class="singerP" v-html="item.name"></p>
						</template>
					</van-cell>
					</a>
				</van-list>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
import configs from "./../config/appConfig.js";
import sheetentry from  "./../components/sheet-entry.vue";
import rankitem from "./../components/rank-item.vue"

export default {
	name:"home",
	methods:{},
	data(){
		return {
			active:"0",
			banners:[],
			personalized:[],
			rankeList:[],
			singerlist:[],
			entryList:[
				{index:1,name:"tv-o",description:"私人fm"},
				{index:2,name:"notes-o",description:"每日推荐"},
				{index:3,name:"orders-o",description:"歌单"},
				{index:4,name:"bar-chart-o",description:"排行榜"},
			]
		}
	},
	methods:{
		gotosheet(sheetid,singerid){
			if(!singerid){
				singerid=0;
			}
			this.$router.push({ name: 'songsheet', params: { sheetid,singerid }})
		}
	},
	created:function(){
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
			this.$http.get(configs.APIURL+"/toplist/detail")
			.then(response=>{
				_this.rankeList=response.data.list;
			}).catch(err=>{

			});
			this.$http.get(configs.APIURL+"/top/artists")
			.then(response=>{
				_this.singerlist=response.data.artists;
			}).catch(err=>{

			});
	},
	components: {
		sheetentry,
		rankitem
	}
}
</script>
<style scoped>
	.csnavbar{
		background-color: rgb(212, 68, 57);
		
	}
	.csSwipeImg{
		border-radius: 6px;
	}
	.csvanswipe{
		width: 90%;
		margin-left: 5%;
	}
	.csspan{
		color: rgb(250,250,250);
	}
	.banners{
		content: '';
		position: relative;
		left:0;
		right:0 ;
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
	.ranker{
		text-align: center;
	}
	.entry{
		position: relative;
		text-align: center;
        top:5px;
		left:0;
		right:0 ;
	}
	.sheet-entry-div{
		text-align: center;
		width: 100%;
	}
	.entryIcon{
		display: block;
	}
	.singerIMGDiv{
		height: 50px;
		width: 50px;
		border-radius:50%;
		background-position:center center;
		background-size:auto 100%;
		float: left;
	}
	.singerP{
		float: left;
		margin-left: 20px;
	}
</style>


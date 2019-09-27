<template>
  <div>
    <van-tabs v-model="activeName"   @click="changeTabs"   background="rgb(212, 68, 57)" color="rgb(255, 255, 255)"  title-active-color="rgb(255, 255, 255)"	title-inactive-color="rgb(220, 220, 230)"  >
      <van-icon  class="back-icon"  color="rgb(255, 255, 255)"  slot="nav-left"  name="arrow-left"  size="25px"  @click="gotoback"/>
      <van-tab title="收藏" name="favorite">
        <div class="sheet-list">
			<scroll class="wrapper"   ref="wrapperf"  :data="songFavorites"  :data2="bottom" :style="{bottom:bottom}" >
				<div class="content">
        		<van-list error-text="请求失败，点击重新加载">
        			<van-cell :clickable="true" v-for="(item,index) in songFavorites" :key="index" @click="playFavoriteMusic(index)">
        				<template class="sheet-list-item" slot="title">
        					<van-row>
        					<van-col span="3">
        						<div class="list-item-index"><p  v-html="index+1"></p></div>
        					</van-col>
        					<van-col span="18">
        						<div class="list-item-right-div">
                        <p v-html="item.name" class="list-item-name"></p>
                        <p v-html="item.singerName[0]" class="list-item-detail"></p>
        						</div>
        					</van-col>
        					</van-row>
        				</template>
        				<van-icon slot="right-icon" name="cross"  @click.stop="deleteFavorites(index)"  class="custom-icon list-item-icon" />
        			</van-cell>
        		</van-list>
				</div>
				</scroll>
        </div>
      </van-tab>
      <van-tab title="历史播放" name="history">
        <scroll class="wrapper"   ref="wrapperh"  :data="songHistoryList"  :data2="bottom" :style="{bottom:bottom}" >
        	<div class="content">
        <div class="sheet-list">
        		<van-list error-text="请求失败，点击重新加载">
        			<van-cell :clickable="true" v-for="(item,index) in songHistoryList" :key="index" @click="playHistoryMusic(index)">
        				<template class="sheet-list-item" slot="title">
        					<van-row>
        					<van-col span="3">
        						<div class="list-item-index"><p  v-html="index+1"></p></div>
        					</van-col>
        					<van-col span="18">
        						<div class="list-item-right-div">
                        <p v-html="item.name" class="list-item-name"></p>
                        <p v-html="item.singerName[0]" class="list-item-detail"></p>
        						</div>
        					</van-col>
        					</van-row>
        				</template>
        				<van-icon name="cross"  @click.stop="deleteHistory(index)"    class="custom-icon list-item-icon" />
        			</van-cell>
        		</van-list>
        </div>
        </div>
        </scroll>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import { mapState,mapGetters , mapMutations} from "vuex"
	import scroll from "./../components/scroll.vue"
export default{
  data(){
    return{
      activeName:"favorite",
      songHistoryList:[],
      songFavorites:[]
    }
  },
  methods:{
    changeTabs(name,tittle){
      this.activeName=name;
    },
    gotoback(){
    	this.$router.back();
    },
    playFavoriteMusic(index){
      this.$root.$children[0].musicArr=this.songFavorites;
      this.$root.$children[0].currentIndexRender=index;
    },
    playHistoryMusic(index){
      this.$root.$children[0].musicArr=this.songHistoryList;
      this.$root.$children[0].currentIndexRender=index;
    },
    deleteFavorites(index){
        this.songFavorites.splice(index,1);
        let songlist=JSON.stringify(this.songFavorites);
        localStorage.setItem("Favorites",songlist);
    },
    deleteHistory(index){
        this.songHistoryList.splice(index,1);
        let songlist=JSON.stringify(this.songHistoryList);
        localStorage.setItem("historyPlay",songlist);
    }
  },
  computed: {
  	...mapState(["showPlayer","bottom"]),
  },
  mounted() {
       let historyJson=localStorage.getItem("historyPlay");
       if(historyJson){
          let  historyPlayTemp=JSON.parse(historyJson);
          this.songHistoryList=historyPlayTemp;
       }
       let favoritesJson=localStorage.getItem("Favorites");
       if(favoritesJson){
          let  favoritesTemp=JSON.parse(favoritesJson);
          this.songFavorites=favoritesTemp;
       }
  },
  components: {
  		scroll,
  }
}

</script>

<style>
  .back-icon{
    top: 15px;
    left: 10px;
    z-index: 3;
  }
  .wrapper{
  	position: fixed;
  	top: 60px;
  	bottom: 0px;
  	right: 0px;
  	left: 0px;
  	overflow: hidden;
  }
  .sheet-list{
      width: 100%;
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

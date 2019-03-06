<template>
  <div id="app">
    <div class="cs-router" :style="{bottom:bottom}">
      <!-- <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/> -->
       <router-view></router-view>
     </div>
     <audio :src="musicSrc" ref="audio1" autoplay @ended="playEnd"></audio>
     <div class="cs-player" v-show="showPlayer" >
       <div class="player-pic"  v-lazy:background-image="playerPic" v-show="playerPic"></div>
       <div class="player-text">
         <span class="player-name" v-html="playerName"></span>
         <span class="player-singer" > <span v-for="item in playerSinger" v-html="item+'  '" :key="item" ></span></span>
       </div>
       <van-icon class="player-icon" size="35px" name="play-circle" @click="next"></van-icon>
       <van-icon class="player-icon"  size="35px"  :name="isPlay?'pause-circle-o':'play-circle-o'" @click="pause"></van-icon>
       <van-icon class="player-icon"  size="35px"  name="orders-o" @click="showMusicArr"></van-icon>
     </div>
     <van-actionsheet
      v-model="show"
      :actions="musicArr"
      @select="onSelect"
    />
  </div>
</template>

<script>
import configs from "./config/appConfig.js"
import { mapState,mapGetters , mapMutations} from "vuex"


export default {
  data(){
    return{
      musicSrc:"",
      show: false,
      musicArr:[],
      currentIndex:-1,
      playerPic:"",
      playerName:"",
      playerSinger:[],
      isPlay:false,
      startPlay:false,
    }
  },
  methods:{
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      var _this=this;
      this.musicArr.some(function(someItem,index,array){
          if(someItem.id==item.id){
              _this.currentIndexRender=index;
          }
      });
      this.show = false;
    },
    showMusicArr(){
      this.show = true;
    },
    pause(){
      if(this.isPlay){
        this.$refs.audio1.pause();
        this.isPlay=false;
      }else{
        this.$refs.audio1.play();
        this.isPlay=true;
      }
    },
    playEnd(){
      this.isPlay=false;
    },
    next(){
      if(this.musicArr.length==1){
        this.$toast('没有下一首了');
        return;
      }
      if((this.currentIndex+1)>=this.musicArr.length){
        this.currentIndexRender=0;
        return;
      }
      this.currentIndexRender=this.currentIndex+1;
    },
    getSongDetail(){
      var  _this=this;
      this.$http.get(configs.APIURL+"/song/detail?ids="+this.musicArr[this.currentIndex].id)
        .then(response=>{
          _this.playerSinger=response.data.songs[0].ar.map(function(item){
            return item.name
          });
          _this.playerPic=response.data.songs[0].al.picUrl;
          _this.playerName=response.data.songs[0].name;
        }).catch(err=>{

        });
        this.startPlay=true;
        this.isPlay=true;
    },
    ...mapMutations(["setIsPlay","setPlayHeigh","setScreenHeigh"])
  },
  watch: {
    startPlay(val, oldVal){
      if(val){
        this.setIsPlay(true);
        this.setScreenHeigh(this.screenHeight-60);
        this.setPlayHeigh("60px"); 
      }else{
        this.setIsPlay(false);
        this.setPlayHeigh("0px"); 
      }
    }
	},
  computed:{
    currentIndexRender:{
      get:function(){
        this.currentIndex;
      },
      set:function(newValue){
        if(!this.musicArr[newValue])return;
        var _this=this;
        this.$http.get(configs.APIURL+"/song/url?id="+this.musicArr[newValue].id)
        .then(response=>{
          if(_this.musicSrc==response.data.data[0].url&&_this.isPlay==false){
              _this.isPlay=true;
              this.$refs.audio1.play();
          }
          if(!response.data.data[0].url){
            this.$toast("暂时找不到这首歌的路径，请选择其他歌曲");
            return;
          }
          _this.musicSrc=response.data.data[0].url;
          _this.currentIndex=newValue;
          _this.getSongDetail()
        }).catch(err=>{
          console.log(err);
        });
      }
    },
    ...mapState(["showPlayer","bottom","screenHeight"]),
  },
  mounted () {
    var screenHeight=document.documentElement.clientHeight;
    this.setScreenHeigh(screenHeight);
  }
}
</script>


<style>
.cs-router{
  position: fixed;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cs-player{
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0px;
  background-color:#fff;
  display: flex;
  flex-wrap:nowrap;
  align-items:center;
  justify-content:center;
}
.player-pic{
		height: 50px;
		width: 50px;
		border-radius:50%;
		background-position:center center;
		background-size:auto 100%;
	}
  .player-text{
    flex-grow:1;
    padding:0 0 0 5px;
  }
  .player-name{
    margin-top: 8px;
		font-size: 16px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		width: 100%;
  }
   .player-singer{
    margin: 3px 0 0 2px;
		font-size: 12px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		width: 100%;
  }
  .player-icon{
    text-align: center;
    height: 35px;
    flex: 1,0,auto;
    padding-left:4px;
     padding-right:4px;
  }
</style>

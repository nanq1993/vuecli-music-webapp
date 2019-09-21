<template>
  <div id="app">
    <div class="cs-router" :style="{bottom:bottom}">
      <!-- <keep-alive>
        <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/> -->
      <keep-alive include="home">
        <router-view v-show="!showBigPlayer"></router-view>
      </keep-alive>
     </div>
     <audio :src="musicSrc" ref="audio1"  @canplay="readyPlay"  @ended="playEnd"></audio>
     <div class="cs-player" v-show="showPlayer" >
        <div class="mini-player" v-show="!showBigPlayer">
          <div class="player-pic"  v-lazy:background-image="playerPic" v-show="playerPic" @click="openBigPlayer"></div>
          <div class="player-text" @click="openBigPlayer">
            <span class="player-name" v-html="playerName"></span>
            <span class="player-singer" > <span v-for="item in playerSinger" v-html="item+'  '" :key="item" ></span></span>
          </div>
          <img class="player-icon"  :src="isPlay?pauseSvgStr:playSvgStr" @click="pause" style=" border:solid 2px #000000;border-radius:50% ;"></img>
          <img class="player-icon"  :src="require('./assets/icons/playlist.svg')" @click="showMusicArr"></img>
        </div>
        <div class="big-player" v-show="showBigPlayer">
          <div class="backgrounddiv"></div>
          <div class="backgroundimg" :style="{ background: `url(${playerPic}) center` }"></div>
          <div class="header">
          	<van-row>
          		<van-col span="3"><van-icon class="header-back" size="30px" color="#fff" name="arrow-left" @click="closeBigPlayer"></van-icon></van-col>
          		<van-col span="18"><center><h1 class="header-title" v-html="playerName"></h1></center></van-col>
          		<van-col span="3"></van-col>
          	</van-row>
          </div>
          <div class="music-content">
            <center>
              <div class="content-playerPic" :class="{Rotation:isPlay}" v-lazy:background-image="playerPic"></div>
            </center>
          </div>
          <div class="music-controller">
              <img class="controller-icon"  @click="changePlayMode" :src="playModePic[playMode[currentPlayMode]]"></img>
              <img class="controller-icon"  @click="prev"  :src="require('./assets/icons/prev.svg')"></img>
              <img class="controller-icon"  @click="pause"  :src="isPlay?pauseSvgStr:playSvgStr" style=" border:solid 2px #000000;border-radius:50% ;padding: 10px;"></img>
              <img class="controller-icon"  @click="next"  :src="require('./assets/icons/next.svg')"></img>
              <img class="controller-icon"  @click="showMusicArr"  :src="require('./assets/icons/playlist.svg')"></img>
          </div>
        </div>
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
      showBigPlayer:false,
      pauseSvgStr:require("./assets/icons/mini-pause2.svg"),
      playSvgStr:require("./assets/icons/mini-play2.svg"),
      playMode:["danqu","liebiao","suiji"],
      playModePic:{
        danqu:require("./assets/icons/once.svg"),
        liebiao:require("./assets/icons/repeat.svg"),
        suiji:require("./assets/icons/random.svg"),
      },
      currentPlayMode:1
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
    //点击暂停监听
    pause(){
      if(this.isPlay){
        this.$refs.audio1.pause();
        this.isPlay=false;
      }else{
        this.$refs.audio1.play();
        this.isPlay=true;
      }
    },
    //监听一首歌播放结束
    playEnd(){
      this.isPlay=false;
    },
    //监听歌曲加载完成可以开始播放
    readyPlay(){
      this.$refs.audio1.play();
      this.isPlay=true;
    },
    //点击修改播放模式
    changePlayMode(){
        if(this.currentPlayMode+1>=this.playMode.length){
           this.currentPlayMode=0;
        }else{
            this.currentPlayMode++;
        }
        switch(this.currentPlayMode){
          case 0:
              this.$toast('单曲播放');
              break;
          case 1:
              this.$toast('列表播放');
              break;
          case 2:
              this.$toast('随机播放');
              break;
        }
    },
    //点击上一首歌
    prev(){
      if(this.musicArr.length==1){
        this.$toast('当前列表就一首歌曲');
        return;
      }
      if(this.currentPlayMode==2){
        //随机播放
        this.currentIndexRender=Math.floor(Math.random()*this.musicArr.length)
      }else{
        //列表循环和单曲循环
        if(this.currentIndex===0){
          this.currentIndexRender=this.musicArr.length-1;
          return;
        }
        this.currentIndexRender=this.currentIndex-1;
      }
    },
    //监听歌曲下一首
    next(){
      if(this.musicArr.length==1){
        this.$toast('当前列表就一首歌曲');
        return;
      }
      if(this.currentPlayMode==2){
        //随机播放
        this.currentIndexRender=Math.floor(Math.random()*this.musicArr.length)
      }else{
        //列表循环和单曲循环
        if((this.currentIndex+1)>=this.musicArr.length){
          this.currentIndexRender=0;
          return;
        }
        this.currentIndexRender=this.currentIndex+1;
      }
    },
    //通过id获取歌曲信息
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
    },
    openBigPlayer(){
      this.showBigPlayer=true;
    },
    closeBigPlayer(){
      this.showBigPlayer=false;
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
.mini-player{
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
.mini-player .player-pic{
		height: 50px;
		width: 50px;
		border-radius:50%;
		background-position:center center;
		background-size:auto 100%;
	}
.mini-player .player-text{
  flex-grow:1;
  padding:0 0 0 5px;
}
.mini-player .player-name{
  margin-top: 8px;
  font-size: 16px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
}
.mini-player .player-singer{
  margin: 3px 0 0 2px;
  font-size: 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
}
.mini-player .player-icon{
  text-align: center;
  height: 35px;
  flex: 1,0,auto;
  margin-left:4px;
  margin-right:4px;
  fill:rgb(18, 136, 222);
}
.cs-player .big-player{
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
}
.big-player	.backgroundimg{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-size: cover;
		filter: blur(80px);
		transform: scale(1.5);
		z-index: -4;
		background-size: cover;
	}
.big-player  .backgrounddiv{
  	position: fixed;
  	top: 0;
  	left: 0;
  	right: 0;
  	bottom: 0;
  	background-color: rgba(7, 17, 27, 0.2)
  }
.big-player  .header{
  	padding-top: 10px;
  	height: 50px;
  }
.big-player  .header-title{
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
.big-player  .music-content{
    width: 100%;
}
.music-content .content-playerPic{
    width: 80%;
    padding-bottom: 80%;
    margin-top: 40px;
    border-radius:50%;
    background-position:center center;
    background-size:auto 100%;
    border:3px solid #969896;
}
@-webkit-keyframes rotation {
          from {
              -webkit-transform: rotate(0deg);
          }
          to {
              -webkit-transform: rotate(360deg);
          }
      }

.Rotation {
    -webkit-transform: rotate(360deg);
    animation: rotation 20s linear infinite;
    -moz-animation: rotation 20s linear infinite;
    -webkit-animation: rotation 20s linear infinite;
    -o-animation: rotation 20s linear infinite;
}
.music-controller{
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 70px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items:center;
}
.music-controller .controller-icon{
    height: 30px;
    widows: auto;
}
</style>

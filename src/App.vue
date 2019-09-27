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
     <audio :src="musicSrc" ref="audio1"  @timeupdate="getCurrentTime"  @canplaythrough="readyPlay"  @ended="playEnd" @durationchange="durationchange" ></audio>
     <div class="cs-player" v-show="showPlayer" >
        <div class="mini-player" v-show="!showBigPlayer">
          <div class="player-pic"  v-lazy:background-image="playerPic" v-show="playerPic" @click="openBigPlayer"></div>
          <div class="player-text" @click="openBigPlayer">
            <span class="player-name" v-html="playerName"></span>
            <span class="player-singer" > <span v-for="item in playerSinger" v-html="item+'  '" :key="item" ></span></span>
          </div>
          <div @click="pause">
            <van-circle
              class="player-circle"
              v-model="currentRate"
              size="45px"
              layer-color="#999"
              color="#D22"
              :rate="0"
            >
            <img  class="player-play-img" :src="isPlay?pauseMiniStr:playMiniStr" @click="pause"></img>
            </van-circle>
          </div>
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
          <div class="music-content"   @click="showLyrics"  >
            <center >
              <div v-show="!isShowLyrics"  class="content-playerPic" :class="{Rotation:isPlay}" v-lazy:background-image="playerPic"></div>
            </center>
            <scroll class="scroll-lyrics"  v-show="isShowLyrics"   ref="lyricWrapper" :data="lyric.lines"   >
              <div>
                <p
                  v-for="(line, index) in lyric.lines" :key="index"  class="line" ref="line"
                  :class="{ 'active': index === currentLineNum }"
                >
                  {{line.txt}}
                </p>
              </div>
            </scroll>
            </div>
          <div class="music-progress">
               <van-icon class="icon-collect" size="30px"   @click="changeCollect"  :name="isCollect?'like':'like-o'" color="red"></van-icon>
               <span class="span-timeShow" >{{ Math.floor((currentTime / 60 % 60))}}:{{Math.floor((currentTime % 60)) < 10 ? '0' + Math.floor((currentTime % 60)) : Math.floor((currentTime % 60))}}</span>
               <div  class="div-progress"><van-slider v-model="currentRate"  @change="rateChange"  bar-height="4px"  active-color="#f44"  /></div>
               <span class="span-timeShow">{{ Math.floor((allTime / 60 % 60))}}:{{Math.floor((allTime % 60)) < 10 ? '0' + Math.floor((allTime % 60)) : Math.floor((allTime % 60))}}</span>
          </div>
          <div class="music-controller">
              <img class="controller-icon"  @click="changePlayMode" :src="playModePic[playMode[currentPlayMode]]"></img>
              <img class="controller-icon"  @click="prev"  :src="require('./assets/png/prev.png')"></img>
              <img class="controller-icon"  @click="pause"  :src="isPlay?pauseSvgStr:playSvgStr" ></img>
              <img class="controller-icon"  @click="next"  :src="require('./assets/png/next.png')"></img>
              <img class="controller-icon"  @click="showMusicArr"  :src="require('./assets/png/list.png')"></img>
          </div>
        </div>
     </div>
     <van-action-sheet
      v-model="show"
      :actions="musicArr"
      @select="onSelect"
    />
  </div>
</template>

<script>
import configs from "./config/appConfig.js"
import { mapState,mapGetters , mapMutations} from "vuex"
import lyricParser from 'lyric-parser'
import scroll from "./components/scroll.vue"

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
      pauseSvgStr:require("./assets/png/stop.png"),
      playSvgStr:require("./assets/png/play.png"),
      pauseMiniStr:require("./assets/icons/mini-pause2.svg"),
      playMiniStr:require("./assets/icons/mini-play2.svg"),
      playMode:["danqu","liebiao","suiji"],
      playModePic:{
        danqu:require("./assets/png/danqu.png"),
        liebiao:require("./assets/png/liebiao.png"),
        suiji:require("./assets/png/suiji.png"),
      },
      currentPlayMode:1,
      isCollect:false,
      currentTime:0,
      currentRate:0,
      playingLyric: null, // 设置一个歌词维护属性
      lyric: '',
      currentLineNum:0,
      allTime:0,
      isShowLyrics:false
    }
  },
  methods:{
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.musicArr.some((someItem,index,array)=>{
          if(someItem.id==item.id){
              this.currentIndexRender=index;
          }
      });
      this.show = false;
    },
    showMusicArr(){
      this.show = true;
    },
    rateChange(value){

      var changeTime=Math.floor(this.allTime*(value/100));
      this.$refs.audio1.currentTime=changeTime;
      this.lyric && this.lyric.seek(this.$refs.audio1.currentTime*1000);

    },
    //点击暂停监听
    pause(){
      if(this.isPlay){
        this.$refs.audio1.pause();
        this.isPlay=false;
        this.lyric.togglePlay();
      }else{
        this.$refs.audio1.play();
        this.isPlay=true;
        this.lyric.togglePlay();
      }
    },
    //监听一首歌播放结束
    playEnd(){
      if(this.musicArr.length==1){
        this.$refs.audio1.play();
        this.lyric.play();
        return;
      }
      if(this.currentPlayMode==2){
        //随机播放
        this.currentIndexRender=Math.floor(Math.random()*this.musicArr.length)
      }else if(this.currentPlayMode==1){
        //列表循环
        if((this.currentIndex+1)>=this.musicArr.length){
          this.currentIndexRender=0;
          return;
        }
        this.currentIndexRender=this.currentIndex+1;
      }else if(this.currentPlayMode==0){
        //单曲循环
        this.currentIndexRender=this.currentIndex;
        this.$refs.audio1.play();
        this.lyric.play();
        return;
      }
    },
    //监听歌曲加载完成可以开始播放
    readyPlay(e){
      if(this.$refs.audio1.currentTime==0){
          this.currentTime=0;
          this.currentRate=0;
      }
      this.isPlay=true;
      this.$refs.audio1.play();
      if(this.$refs.audio1.duration){
        this.allTime=this.$refs.audio1.duration;
      }
    },
    durationchange(e){
      this.allTime=this.$refs.audio1.duration;
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
      this.$http.get(configs.APIURL+"/song/detail?ids="+this.musicArr[this.currentIndex].id)
        .then(response=>{
          this.playerSinger=response.data.songs[0].ar.map(function(item){
            return item.name
          });
          this.playerPic=response.data.songs[0].al.picUrl;
          this.playerName=response.data.songs[0].name;
          this.saveHistoryPlay({id:this.musicArr[this.currentIndex].id,name:this.playerName,singerName:this.playerSinger});
        }).catch(err=>{

        });
        let favoritesJson=localStorage.getItem("Favorites");
        this.isCollect=false;
        if(favoritesJson){
           let  favoritesTemp=JSON.parse(favoritesJson);
           this.songFavorites=favoritesTemp;
           favoritesTemp.find((value,index,arr)=>{
               if(this.musicArr[this.currentIndex].id==value.id){
                   this.isCollect=true;
               }
           });
        }
        this.startPlay=true;
    },
    //进入大播放器
    openBigPlayer(){
      this.showBigPlayer=true;
    },
    //关闭大播放器
    closeBigPlayer(){
      this.showBigPlayer=false;
    },
    //监听当前音乐播放时间
    getCurrentTime(e){
      var nowTime=e.target.currentTime;
      this.currentTime=Math.floor(nowTime);
      this.currentRate=Math.floor((this.currentTime/this.allTime)*100)
    },
    showLyrics(){
      this.isShowLyrics=!this.isShowLyrics;
    },
    lycHanlder({lineNum, txt}){
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          const line = this.$refs.line[lineNum - 5];
          this.$refs.lyricWrapper.scrollToElement(line, 1000);
        } else {
          this.$refs.lyricWrapper.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
    },
    saveHistoryPlay({id,name,singerName}){
      let historyJson=localStorage.getItem("historyPlay");
      let  historyPlayTemp=[];
      if(historyJson){
      	historyPlayTemp=JSON.parse(historyJson);
        let indexTemp=-1;
        historyPlayTemp.find((value,index,arr)=>{
            if(id==value.id){
                indexTemp=index;
            }
        });
        if(indexTemp===0){
          return;
        }
        if(indexTemp>0){
          historyPlayTemp.splice(indexTemp,1);
        }
      }
      historyPlayTemp.unshift({id,name,singerName});
      localStorage.setItem("historyPlay",JSON.stringify(historyPlayTemp));
    },
    changeCollect(){
      let id=this.musicArr[this.currentIndex].id;
      let name=this.playerName;
      let singerName=this.playerSinger;
      this.isCollect=!this.isCollect;
      let favoritesJson=localStorage.getItem("Favorites");
      let  favoritesTemp=[];
      if(favoritesJson){
      	favoritesTemp=JSON.parse(favoritesJson);
        let indexTemp=-1;
        favoritesTemp.find((value,index,arr)=>{
            if(id==value.id){
                indexTemp=index;
            }
        });
        if(indexTemp>=0){
          favoritesTemp.splice(indexTemp,1);
          localStorage.setItem("Favorites",JSON.stringify(favoritesTemp));
          return;
        }
      }
      favoritesTemp.unshift({id,name,singerName});
      localStorage.setItem("Favorites",JSON.stringify(favoritesTemp));
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
        return this.currentIndex;
      },
      set:function(newValue){
        if(!this.musicArr[newValue])return;
        this.$http.get(configs.APIURL+"/song/url?id="+this.musicArr[newValue].id)
        .then(response=>{
          if(this.musicSrc==response.data.data[0].url&&(this.isPlay==false)){
              this.isPlay=true;
              this.$refs.audio1.play();
          }
          if(!response.data.data[0].url){
            this.$toast("暂时找不到这首歌的路径，请选择其他歌曲");
            this.musicArr.splice(newValue,1);
            return;
          }
          this.musicSrc=response.data.data[0].url;
          this.currentIndex=newValue;

          this.$http.get(configs.APIURL+"/lyric?id="+this.musicArr[newValue].id)
          .then(response=>{
              let lyricStr=response.data.lrc.lyric;
              this.lyric  &&  this.lyric.stop();

              this.lyric = new lyricParser(lyricStr, this.lycHanlder);
              this.lyric && this.lyric.seek(0);
              this.lyric  &&  this.lyric.play();
          }).catch(err=>{
            console.log(err);
          });
          this.getSongDetail()
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
  },
  components: {
  	scroll
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
}
.mini-player .player-circle{
  text-align: center;
  flex: 1,0,auto;
  margin-left:4px;
  margin-right:4px;
}
.mini-player .player-play-img{
    text-align: center;
    height: 35px;
    margin-top: 5px;
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
.music-content .content-playerPic{
    width: 80%;
    padding-bottom: 80%;
    margin-top: 40px;
    border-radius:50%;
    background-position:center center;
    background-size:auto 100%;
    border:3px solid #969896;
}
.music-content  .div-lyrics{
    width: 80%;
    height: 350px;
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
    height: 35px;
    widows: auto;
}
.music-progress {
   position: fixed;
   left: 0px;
   right: 0px;
   bottom: 70px;
   height: 50px;
   display: flex;
   flex-direction: row;
   justify-content: space-around;
   align-items:center;
}
.music-progress .icon-collect{
    margin: 0px 10px;
}
.music-progress .span-timeShow{
    margin: 0px 10px;
    color: #F0F0F0;
}
.music-progress .div-progress{
    flex-grow:1;
}
.div-progress  .progress{
    margin: 0px 10px;
}
.scroll-lyrics{
    position: fixed;
    top: 90px;
    bottom:200px;
    right: 0px;
    left: 0px;
    text-align: center;
    overflow: hidden;
}
.big-player  .music-content{
    width: 100%;
    position: absolute;
    top: 55px;
    right: 0px;
    left: 0px;
    bottom: 200px;
}
.active{
  color: #EAEAEA;
}
</style>

<template>
	<div class="home">
		<van-nav-bar class="csnavbar" >
			<van-icon name="apps-o" color="rgb(250,250,250)" size="25px" slot="left" @click="intoCollect"/>
			<span class="csspan" slot="title">南强的网站</span>
			<van-icon color="rgb(250,250,250)"  name="search"  size="25px"  slot="right" @click="intoSearch" />
		</van-nav-bar>
		<van-tabs    class="cstabs" v-bind:lazy-render="false" v-model="active" background="rgb(212, 68, 57)" color="rgb(255, 255, 255)"  title-active-color="rgb(255, 255, 255)"	title-inactive-color="rgb(220, 220, 230)" swipeable>
			<!-- 写推荐页面 -->
			<van-tab  title="推荐"  name="recommend">
				<recommend ></recommend>
			</van-tab>
			<van-tab  title="排行"  name="toplist">
				<toplist></toplist>
			</van-tab>
			<van-tab  title="歌手"  name="singerlist">
				<singerlist></singerlist>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
import recommend from "./../components/recommend.vue"
import toplist from "./../components/toplist.vue"
import singerlist from "./../components/singerlist.vue"
import { mapState,mapGetters , mapMutations} from "vuex"



export default {
	name:"home",
	data(){
		return {
			active:"0",

		}
	},
	methods:{
		intoSearch(){
			this.$router.push({ name: 'search'});
		},
    intoCollect(){
      this.$router.push({ name: 'collect'});
    }
	},
	created:function(){

	},
	mounted(){

	},
	components: {
		toplist,
		recommend,
		singerlist,
	},
  initscoll(name,tittle){

  }
}
</script>
<style scoped>
	.csnavbar{
		background-color: rgb(212, 68, 57);

	}

	.csspan{
		color: rgb(250,250,250);
	}

</style>

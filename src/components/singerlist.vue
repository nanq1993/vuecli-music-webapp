<template>
	<scroll class="wrapper"   ref="wrapper"  :data="singerlist"  :data2="bottom" :style="{bottom:bottom}" >
			<div class="content">
				<van-list finished-text="没有更多了">
					<a  v-for="(item,index) in singerlist" :key="index" @click.prevent="gotosheet(0,item.id)">
					<van-cell  >
						<template class="singertemplate"  slot="title">
							<div class="singerIMGDiv"  v-lazy:background-image="item.picUrl">
							</div>
							<p class="singerP" v-html="item.name"></p>
						</template>
					</van-cell>
					<div class="van-hairline--bottom"></div>
					</a>
				</van-list>
			</div>
	</scroll>
</template>

<script>
import configs from "./../config/appConfig.js";
import scroll from "./scroll.vue"
import { mapState,mapGetters , mapMutations} from "vuex"
export default {
	data() {
		return {
			singerlist:[],
		};
	},
	computed: {
		...mapState(["showPlayer","bottom"]),
	},
	created() {
			this.$http.get(configs.APIURL+"/top/artists")
			.then(response=>{
				this.singerlist=response.data.artists;
        this.$nextTick(()=>{
          this.$refs.wrapper._initScroll();

        });
			}).catch(err=>{

			});
	},
	methods: {
		gotosheet(sheetid,singerid){
			if(!singerid){
				singerid=0;
			}
			this.$router.push({ name: 'songsheet', params: { sheetid,singerid }})
		},
    toinitScroll(){
      this.$refs.wrapper._initScroll();
    }
	},
	components: {
		scroll
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

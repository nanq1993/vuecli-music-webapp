<template>
	<scroll class="wrapper"  :data="rankeList"  data2="bottom" :style="{bottom:bottom}">
			<div class="content">
				<div class="ranker">
					<a  v-for="(item,index) in rankeList" :key="index"  @click.prevent="gotosheet(item.id)">
						<rankitem :imgurl="item.coverImgUrl" :descript="item.description" :name="item.name"></rankitem>
					</a>
				</div>
			</div>
	</scroll>
</template>

<script>
import rankitem from "./rank-item.vue"
import configs from "./../config/appConfig.js";
import scroll from "./scroll.vue"
import { mapState,mapGetters , mapMutations} from "vuex"

export default {
	props: {

	},
	data() {
		return {
			rankeList:[],
		};
	},
	computed: {
		...mapState(["showPlayer","bottom"]),
	},
	created() {
		var _this=this;
			this.$http.get(configs.APIURL+"/toplist/detail")
			.then(response=>{
				_this.rankeList=response.data.list;
			}).catch(err=>{

			});
	},
	mounted() {
		
	},
	watch: {

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
		rankitem,
		scroll,
	},
};
</script>

<style scoped>
	.ranker{
		text-align: center;
	}
	.wrapper{
		position: fixed;
		top: 90px;
		bottom: 0px;
		right: 0px;
		left: 0px;
		overflow: hidden;
	}
</style>

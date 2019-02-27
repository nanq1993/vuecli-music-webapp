 <template>
	 <div >
		 <van-field
			class="search-field"
			v-model="searchtext"
			clearable
			left-icon="arrow-left"
			color="#000"
			autofocus="true"
			size="medium"
			placeholder="请输入搜索内容"
			@click-left-icon="gotoback"
		/>
	 	<div v-show="searched">

		</div>
		<div v-show="!searched">

		</div>
	 </div>
 </template>
 <script>
import configs from "./../config/appConfig.js"

 export default {
	 props: {
		 
	 },
	 data() {
		 return {
			 searchtext:"",
			 searched:false,
		 };
	 },
	 computed: {
		 
	 },
	 created() {
		 this.$http.get(configs.APIURL+"/search/hot")
			.then(response=>{
				// _this.banners=response.data.banners;
				console.log(response)
			}).catch(err=>{

			});
	 },
	 mounted() {
		 
	 },
	 watch: {
		 
	 },
	 methods: {
		gotoback(){
			this.$router.back();
		}
	 },
	 components: {
 
	 },
 };
 </script>
 
 <style>
 .search-field{
	 background-color: rgb(212, 68, 57);
	 size: 30px;
	 height: 50px;
	 color: #fff;
 }
.van-field__control{
	 color: #fff;
 }
  ::-moz-placeholder  {
	  color: #fff;
  }
 </style>
 
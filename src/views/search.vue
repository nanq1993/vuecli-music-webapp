 <template>
	 <div >
		 <van-field
			class="search-field"
			v-model="username"
			clearable
			left-icon="arrow-left"
			color="#000"
			autofocus="true"
			size="medium"
			placeholder="请输入搜索内容"
			@click-left-icon="gotoback"
		/>
	 </div>
 </template>
 <script>
 export default {
	 props: {
 
	 },
	 data() {
		 return {
			 username:"",
		 };
	 },
	 computed: {
		 
	 },
	 created() {
 
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
 
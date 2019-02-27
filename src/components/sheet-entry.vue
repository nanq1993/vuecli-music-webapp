<template>
	<div class="shentry">
		<img v-lazy="imgsrc"/>
		<p v-html="descript"></p>
	</div>
</template>

<script>
export default {
	props: {
		imgsrc:String,
		descript:String
	},
	data() {
		return {

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

	},
	components: {

	},
};
</script>

<style scoped>
	.shentry > img{
		border-radius: 10px;
		 width:90%;
		 height: auto;
	}
	.shentry > p{
		margin-top: 0px;
		font-size: 14px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		width: 90%;
	}
</style>

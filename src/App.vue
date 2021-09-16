<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang='scss'>
/* 图标字体 */
@import './static/iconfont/iconfont.wxss';

.container{
	scroll-view{
		height: calc(100vh - 70px);
		overflow: hidden;
	}
}
/* 设置背景 */
.fixbg{
	width: 100%;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	background-size: cover;
	background-position: center 0;
	filter: blur(60rpx);
	transform: scale(1.6);
	/* background-image: url('https://img.zcool.cn/community/01842c5afbc873a801207ab43936d8.jpg@1280w_1l_2o_100sh.jpg'); */
	/* background-color: #7c7369; */
}

</style>

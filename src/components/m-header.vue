<template>
	<div class="m-header">
		<p class="topbar"><strong>{{bigTitle}}</strong> <small>{{smallTitle}}</small></p>
		<router-link to="/pizzahub"> pizzahub </router-link>
		<a href="/servlib"> servlib </a>
	</div>
</template>

<script>
export default {
  name: 'm-header',
  props: {
    bigTitle: {
      type: String,
      default: ''
    },
    smallTitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
.m-header
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 1000;
	padding-left: 10px;
	height: 40px;
	background-color: $header-background-color
	border-color: $header-border-color
	color: $header-color
.topbar
	float:left
	margin: 0
	line-height: 40px
	font-size:$font-size-large
</style>
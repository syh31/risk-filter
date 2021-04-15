<template>
  <div id="wrap">
    <div style="float: left">
      <img src="../../assets/404.png" alt="404.life" width="910"/>
    </div>
    <div class="text">
      <p style="color: orange;font-size: 26px;margin-bottom: 6px;">很抱歉！</p>
      <p style="color: #0086F0;font-size: 22px;margin-bottom: 20px;">您访问的页面不存在</p>
      <el-button type="primary" round @click="gotoHome">返回首页&nbsp;{{ jumpTime }}秒</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  mounted () {
    this.timeChange()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  data () {
    return {
      jumpTime: 5,
      timer: 0
    }
  },
  methods: {
    timeChange () {
      this.timer = setInterval(() => {
        if (this.jumpTime) {
          this.jumpTime--
        } else {
          this.$router.push({path: '/'})
          clearInterval(this.timer)
        }
      }, 1000)
    },
    gotoHome () {
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

@media screen and (min-width: 768px) {
  #wrap {
    width: 1180px;
    height: 407px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -224px;
    margin-left: -590px;
    display: flex;
    align-items: center;
  }

  #wrap .text {
    float: right;
    position: relative;
    left: -125px;
    top: 10px;
  }
}

@media screen and (min-width: 320px) and (max-width: 767px) {

  html,
  body {
    height: 100%;
  }

  body {
    display: flex;
    align-items: center;
  }

  #wrap,
  #wrap img {
    width: 100%;
    margin-bottom: 60px;
  }

  #wrap .text {
    text-align: center;
  }
}
</style>

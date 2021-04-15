<template>
  <div class="container">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import '../../../static/Build/Cesium/Widgets/widgets.css'

export default {
  name: 'home',
  mounted () {
    // eslint-disable-next-line no-unused-vars,no-undef
    const viewer = Cesium.Viewer('cesiumContainer')
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}

#cesiumContainer {
  width: 100%;
  height: 100vh;
}
</style>

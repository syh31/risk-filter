<template>
  <div class="container">
    <div id="cesiumContainer">
      <div class="risk-window">
        <el-form label-width="60px">
          <el-form-item label="项目">
            <el-select v-model="projectName">
              <el-option v-for="(item, index) in projectList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: center; ">
          <el-button-group>
            <el-button size="mini" type="primary" @click="generateView" :disabled="riskButton" :loading="riskLoading">
              {{ riskText }}
            </el-button>
            <el-button type="primary" size="mini" :disabled="tableViewButton" @click="tableView">查看图表</el-button>
            <el-button type="primary" size="mini" :disabled="clearWarnButton" @click="clearWarn">清除绘制</el-button>
          </el-button-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/Build/Cesium/Widgets/widgets.css'
import {getRisk} from '../../api/user'

export default {
  name: 'home',
  mounted () {
    this.initCesium()
  },
  data () {
    return {
      viewer: null,
      projectName: '南京地铁二号线',
      projectList: ['南京地铁二号线'],
      riskText: '生成图像',
      riskLoading: false,
      riskButton: false,
      tableViewButton: true,
      clearWarnButton: true
    }
  },
  methods: {
    initCesium () {
      // eslint-disable-next-line no-undef
      const tiandi = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=f91e513daae0086357dd5993528e7715',
        layer: 'img',
        style: 'default',
        tileMatrixSetID: 'w',
        format: 'tiles',
        maximumLevel: 18
      })

      // eslint-disable-next-line no-undef,no-unused-vars
      let viewer = new Cesium.Viewer('cesiumContainer', {
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        baseLayerPicker: false,
        imageryProvider: tiandi,
        sceneModePicker: false
      })

      // eslint-disable-next-line no-undef
      const tiandiText = new Cesium.WebMapTileServiceImageryProvider({
        url: 'http://t0.tianditu.gov.cn/cia_w/wmts?tk=f91e513daae0086357dd5993528e7715',
        layer: 'cia',
        style: 'default',
        tileMatrixSetID: 'w',
        format: 'tiles',
        maximumLevel: 18
      })

      viewer.imageryLayers.addImageryProvider(tiandiText)
      viewer.camera.setView({
        // eslint-disable-next-line no-undef
        destination: Cesium.Cartesian3.fromDegrees(118.76741, 32.041546, 30000.0)
      })

      this.viewer = viewer
    },
    generateView () {
      this.viewer.entities.removeAll()
      this.riskLoading = true
      this.riskText = '生成中'
      this.msgWarning('正在生成图像（可能会花费较长时间）')
      const queryParams = {
        layerName: this.projectName
      }
      getRisk(queryParams).then(response => {
        if (!response.data.error) {
          let pointsList = response.data.riskareainfo // 多边形点集
          let points = response.data.points // 风险点集
          // 风险点标注
          for (let point of points) {
            this.viewer.entities.add({
              // eslint-disable-next-line no-undef
              position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat),
              point: {
                pixelSize: 5,
                // eslint-disable-next-line no-undef
                color: Cesium.Color.RED
              }
            })
          }
          // 多边形绘制
          for (let set of pointsList) {
            let conList = []
            for (let pot of set.spionts) {
              conList.push(pot.lon, pot.lat)
            }
            if (conList.length > 4) {
              this.viewer.entities.add({
                polygon: {
                  // eslint-disable-next-line no-undef
                  hierarchy: Cesium.Cartesian3.fromDegreesArray(conList),
                  height: 0,
                  // eslint-disable-next-line no-undef
                  material: Cesium.Color.RED.withAlpha(0.5),
                  outline: false
                }
              })
            }
          }
          this.riskLoading = false
          this.riskText = '生成图像'
          this.msgSuccess('查询成功！')
          this.riskButton = true
          this.clearWarnButton = false
        } else {
          this.msgError(response.data.error)
          this.riskLoading = false
        }
      }).catch(function (e) {
        this.msgError(e)
        this.riskLoading = false
        this.riskText = '生成图像'
      })
    },
    tableView () {
    },
    clearWarn () {
      this.viewer.entities.removeAll()
      this.riskButton = false
      this.tableViewButton = true
      this.clearWarnButton = true
    }
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

.risk-window {
  width: 300px;
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 999;
  padding: 10px;
  border-radius: 5px;
}

.risk-window ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.risk-window li {
  padding: 0;
  margin: 0;
}
</style>

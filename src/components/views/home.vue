<template>
  <div class="container">
    <div id="cesiumContainer">
      <div class="risk-window">
        <el-form :model="form" :rules="rules" ref="form" label-width="60px">
          <el-form-item label="项目" prop="project">
            <el-select v-model="form.project">
              <el-option v-for="(item, index) in projectList" :key="index" :label="item.layerName"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: center; ">
          <el-button-group>
            <el-button size="mini" type="primary" @click="generateView" :disabled="riskButton" :loading="riskLoading">
              {{ riskText }}
            </el-button>
            <el-button type="primary" size="mini" :disabled="clearWarnButton" @click="clearWarn">清除绘制</el-button>
          </el-button-group>
          <el-button type="success" size="mini" @click="openLayers(form.project)">加载图层</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../../static/Build/Cesium/Widgets/widgets.css'
import {getOpenLast, getRisk} from '../../api/user'

export default {
  name: 'home',
  mounted () {
    this.initCesium()
    this.getProjectList()
  },
  data () {
    return {
      viewer: null,
      form: {
        project: null
      },
      rules: {
        project: [
          {required: true, message: '请选择项目', trigger: 'change'}
        ]
      },
      projectList: [],
      riskText: '生成图像',
      riskLoading: false,
      riskButton: false,
      clearWarnButton: true,
      currentLayer: null
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
        destination: Cesium.Cartesian3.fromDegrees(118.76741, 32.041546, 48000.0)
      })

      this.viewer = viewer
    },
    getProjectList () {
      getOpenLast().then(response => {
        this.projectList = []
        for (let item of response.data) {
          if (item.valid === 1) {
            this.projectList.push(item)
          }
        }
        if (this.projectList[0]) {
          this.form.project = this.projectList[0]
          this.openLayers(this.projectList[0])
        }
      })
    },
    generateView () {
      console.time('Test')
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.viewer.entities.removeAll()
          this.riskLoading = true
          this.riskText = '生成中'
          this.msgWarning('正在生成图像（可能会花费较长时间）')
          const queryParams = {
            layerName: this.form.project.layerName
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
              console.timeEnd('Test')
            } else {
              this.msgError(response.data.error)
              this.riskLoading = false
              console.timeEnd('Test')
            }
          }).catch(function (e) {
            this.msgError(e)
            this.riskLoading = false
            this.riskText = '生成图像'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openLayers (project) {
      this.viewer.imageryLayers.remove(this.currentLayer)
      // eslint-disable-next-line no-undef
      const newSource = new Cesium.WebMapServiceImageryProvider({
        url: project.url,
        request: project.request,
        layers: project.layers,
        version: project.version,
        // eslint-disable-next-line no-undef
        proxy: new Cesium.DefaultProxy('/proxy/'),
        parameters: {
          service: project.service,
          format: 'image/png',
          srs: project.srs,
          transparent: true
        },
        getFeatureInfoParameters: {
          request: 'GetFeatureInfo'
        }
      })
      this.currentLayer = this.viewer.imageryLayers.addImageryProvider(newSource)
      let center = project.bbox.split(',')
      const longitude = (Number(center[0]) + Number(center[2])) / 2
      const latitude = (Number(center[1]) + Number(center[3])) / 2
      this.viewer.camera.flyTo({
        // eslint-disable-next-line no-undef
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 48000.0)
      })
    },
    clearWarn () {
      this.viewer.entities.removeAll()
      this.riskButton = false
      this.clearWarnButton = true
    }
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}

#cesiumContainer {
  width: 100%;
  height: 100%;
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

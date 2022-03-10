<template>
  <div class="container">
    <div class="header-bar">
      <div class="header-bar-logo">
        <img src="../../assets/antd.png" />
      </div>
      <div class="header-bar-title">InSAR&nbsp;地质监测数据可视化平台</div>
      <div class="header-bar-right">
        <img src="../../assets/top_left.png" />
      </div>
    </div>
    <div id="mapContainer"></div>
    <div class="pic_color" id="piccolorid">
      <div style="height: 40px; background-color: #003da8; padding-left: 5px; padding-right: 5px; width: 300px">
        <el-row :gutter="10">
          <el-col :span="16">
            <div>
              <div class="color_line2" style="margin-top: 10px"></div>
              <div style="height: 5px">
                <span style="float: left; font-size: 12px; color: white">-5</span>
                <span style="float: right; font-size: 12px; color: white">5</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div style="font-size: 12px;color: white;line-height: 40px">
              <span>vel[mm/yr]</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import heatmapData from '../../api/HeatData'

export default {
  name: 'test',
  mounted () {
    this.initAmap()
  },
  data () {
    return {
      amap: null,
      heatmap: null
    }
  },
  methods: {
    initAmap () {
      // eslint-disable-next-line no-undef,no-unused-vars
      const imageBase = new AMap.TileLayer({
        getTileUrl:
          'http://t{0,1,2,3,4,5,6,7}.tianditu.gov.cn/DataServer?T=img_w&tk=f91e513daae0086357dd5993528e7715&x=[x]&y=[y]&l=[z]',
        tileSize: 256,
        zIndex: 0,
        detectRetina: true
      })
      // eslint-disable-next-line no-undef,no-unused-vars
      const imageAnnotation = new AMap.TileLayer({
        getTileUrl:
          'http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=[z]&TILEROW=[y]&TILECOL=[x]&tk=f91e513daae0086357dd5993528e7715',
        tileSize: 256,
        zIndex: 0,
        detectRetina: true
      })
      // eslint-disable-next-line no-undef,no-unused-vars
      const satellite = new AMap.TileLayer.Satellite()
      // eslint-disable-next-line no-undef,no-unused-vars
      const roadNet = new AMap.TileLayer.RoadNet()
      // eslint-disable-next-line no-undef
      this.amap = new AMap.Map('mapContainer', {
        resizeEnable: true,
        center: [118.796623, 32.059352],
        zoom: 12,
        layers: [
          imageBase,
          imageAnnotation
          // satellite,
          // roadNet
        ]
      })
      if (!this.isSupportCanvas()) {
        alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
      }
      this.initOrigin()
      // this.initHeatMap()
    },
    isSupportCanvas () {
      const elem = document.createElement('canvas')
      return !!(elem.getContext && elem.getContext('2d'))
    },
    initOrigin () {
      const layerUrl = 'http://123.57.20.173:11020/geoserver/mydata/wms?service=WMS&version=1.1.0&request=GetMap&layers=mydata:nanjing_PS_75_0&styles=sldxml&bbox=118.73127434360205,31.88400433400328,118.91736674605006,32.120682587195994&width=768&height=437&srs=EPSG:4326&format=application/openlayers'
      // eslint-disable-next-line no-undef
      const wms = new AMap.TileLayer.WMS({
        url: layerUrl,
        blend: false, // 地图级别切换时，不同级别的图片是否进行混合
        tileSize: 512, // 加载WMS图层服务时，图片的分片大小
        params: {
          'LAYERS': 'topp:states',
          VERSION: '1.3.0'
        } // OGC标准的WMS地图服务的GetMap接口的参数
      })
      this.amap.add(wms)
    },
    initHeatMap () {
      const _this = this
      this.amap.plugin(['AMap.Heatmap'], function () {
        // eslint-disable-next-line no-undef
        _this.heatmap = new AMap.Heatmap(_this.amap, {
          radius: 25,
          opacity: [0, 0.8]
        })
        _this.heatmap.setDataSet({
          data: heatmapData,
          max: 15
        })
      })
    }
  }
}
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}

.header-bar {
  width: 100%;
  height: 50px;
  display: flex;
}

.header-bar-logo {
  height: 50px;
  width: 50px;
  margin-left: 10px;
}

.header-bar-logo img {
  position: relative;
  top: 50%;
  left: 50%;
  height: 30px;
  width: 30px;
  transform: translate(-50%, -50%);
}

.header-bar-title {
  height: 100%;
  line-height: 50px;
  color: #1890ff;
  font-size: 24px;
  font-family: Muli, Futura, Helvetica, Arial, '黑体', sans-serif;
  font-weight: bold;
  flex: 1;
}

.header-bar-right img {
  height: 100%;
}

#mapContainer {
  width: 100%;
  height: calc(100vh - 50px);
}

.pic_color {
  background-color: rgba(255, 255, 255, 0.3);
  position: absolute;
  top: 89%;
  left: 2%;
  padding: 10px;
}

.color_line2 {
  height: 10px;
  background: linear-gradient(-90deg,red 0,#ff0 30%,#0f0 50%,#0ff 70%,#00f 100%);
  border-radius: 10px;
  margin-top: 5px;
}
</style>

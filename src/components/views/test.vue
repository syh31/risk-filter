<template>
  <div class="container">
    <div id="mapContainer"></div>
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
      // eslint-disable-next-line no-undef
      const satellite = new AMap.TileLayer.Satellite()
      // eslint-disable-next-line no-undef
      const roadNet = new AMap.TileLayer.RoadNet()
      // eslint-disable-next-line no-undef
      this.amap = new AMap.Map('mapContainer', {
        resizeEnable: true,
        center: [118.796623, 32.059352],
        zoom: 12,
        layers: [
          // imageBase,
          // imageAnnotation,
          satellite,
          roadNet
        ]
      })
      if (!this.isSupportCanvas()) {
        alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
      }
      this.initHeatMap()
      // this.markPoints()
    },
    isSupportCanvas () {
      const elem = document.createElement('canvas')
      return !!(elem.getContext && elem.getContext('2d'))
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
    },
    markPoints () {
      const _this = this
      for (let i = 0; i < 5; i++) {
        // let convertRes = transformGCJ2WGS(heatmapData[i]['lat'], heatmapData[i]['lng'])
        // eslint-disable-next-line no-undef
        let marker = new AMap.Marker({
          // eslint-disable-next-line no-undef
          position: new AMap.LngLat(heatmapData[i]['lng'], heatmapData[i]['lat'])
        })
        _this.amap.add(marker)
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
}

#mapContainer {
  width: 100%;
  height: 100vh;
}
</style>

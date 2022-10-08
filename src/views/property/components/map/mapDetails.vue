<template>
  <el-dialog
    slot="—"
    :title="title"
    :width="width"
    :visible.sync="showMapComponent"
    top="5vh"
    custom-class="baidu-map"
    @close="cancel"
    append-to-body
    :close-on-click-modal="false"
    :modal-append-to-body="false"
  >
    <baidu-map
      :style="mapStyle"
      ak="baidumapak"
      :map-click="false"
      :center="center"
      :zoom="zoom"
      :scroll-wheel-zoom="true"
      @ready="onBaiduMapReady"
      
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @zoomend="syncCenterAndZoom"
      @tilesloaded="hideLogo"
    >
      <bm-view style="width: 100%; height: 100%;" />
      <bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" />

      <bm-polygon
        :path="border"
        stroke-color="#006080"
        :stroke-weight="1.5"
        :editing="false"
        @lineupdate="updatePolygonPath"
      />
      <bm-local-search :keyword="keyword" :auto-viewport="true" :panel="false" />
    </baidu-map>
  </el-dialog>
</template>

<script>
import {
  BaiduMap,
  BmView,
  BmAutoComplete,
  BmMarker,
  BmLocalSearch,
  BmPolygon //多边形
} from "vue-baidu-map";
export default {
  components: {
    BaiduMap,
    BmView,
    BmAutoComplete,
    BmMarker,
    BmLocalSearch,
    BmPolygon //多边形
  },
  props: {
    // 在子组件中使用 props 选项去接收来自父组件传递过来的数据
    dialogVisible: Boolean,
    mapHeight: {
      type: Number,
      default: 500
    },
    title: {
      type: String,
      default: "区划范围"
    },
    width: {
      type: [Number, String],
      default: "60%"
    },
    height: {
      type: [Number, String],
      default: "80%"
    }
  },
  data: function() {
    return {
      BMap: null, // 地图组件是否就绪
      map: null,
      showMapComponent: this.dialogVisible,
      mapStyle: {
        width: "100%",
        height: this.mapHeight + "px"
      },
      center: { lng: 118.802, lat: 32.064 },
      choosedLocation: { province: "", city: "", district: "", addr: "" },
      zoom: 16,
      paramsCenter: null,
      border: [],
      keyword: ""
    };
  },
  created() {
  },
  destroyed(){
    this.$parent.sign = true;    
  },
  watch: {
    dialogVisible: function(currentValue) {
      this.showMapComponent = currentValue;
      if (currentValue) {
        this.keyword = "";
      }
    }
  },
  
  methods: {
    // ready事件：在你需要二次开发或手动控制其子组件，可以使用在此事件中使用返回的 BMap 类和 map 实例进行手动控制
    onBaiduMapReady({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      if (this.BMap) {
        if (this.paramsCenter != null) {
          this.center = this.paramsCenter;
        }
      }
     
    },
    open(center) {
      this.showMapComponent = true;
      if (this.BMap) {
        if (center.lng != null && center.lng != 0) {
          this.center = center;
          this.paramsCenter = center;
        }
      } else {
        if (center.lng != null && center.lng != 0) {
          this.paramsCenter = center;
        }
      }

    },

    updatePolygonPath(e) {
      this.border = e.target.getPath();
    },

    syncCenterAndZoom(e) {
      // 返回地图当前的缩放级别
      this.zoom = e.target.getZoom();
    },
    // /** *
    //  * 确认
    //  */
    confirm: function() {
        this.showMapComponent = false;
            

    },
    /** *
     * 取消
     */
    cancel: function() {
      this.showMapComponent = false;
       this.$parent.sign = false;
    },
    //去除版权信息
    hideLogo() {
      for (
        let i = 0;
        i < document.getElementsByClassName("anchorBL").length;
        i++
      ) {
        document.getElementsByClassName("anchorBL")[i].style.display = "none";
      }
    }
  }
};
</script>

<style lang="scss">
.baidu-map {
  *,
  *:before,
  *:after {
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
  }
  .el-dialog__body {
    padding: 5px !important;
  }
  .el-row-a {
    margin-top: -45px;
    margin-right: 27px !important;
  }
  .el-row-b {
    width: 70px !important;
  }
  .toggle {
    color: white;
    background-color: #00607f;
    border: none;
    border-radius: 3px;
    height: 28px;
    font-size: 13px;
    width: 100px;
    margin: 5px 0 0 5px;
    cursor: pointer;
  }
  .toggle:hover {
    background: #338099;
    border-color: #338099;
  }
  .el-button {
    height: 30px !important;
  }
}
.baidu-map * {
  fill: rgba($color: #006080, $alpha: 0.2);
}
</style>

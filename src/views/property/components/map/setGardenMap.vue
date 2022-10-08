<template>
  <el-dialog
    slot="—"
    :title="title"
    :width="width"
    :visible.sync="showMapComponent"
    top="5vh"
    custom-class="baidu-map"
    @close="cancel"
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
      @click="paintPolyline"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @zoomend="syncCenterAndZoom"
      @mousemove="syncPolyline"
      @rightclick="newPolyline"
       @tilesloaded="hideLogo"
    >
      <el-row class="el-row-a" style="float: right;
">
        <el-col :span="7">
          <el-button class="el-row-b" size="small" @click="backout">撤销</el-button>
        </el-col>
        <el-col :span="7">
          <el-button class="el-row-b" size="small" @click="empty">清空</el-button>
        </el-col>
        <el-col :span="10">
          <el-button
            style="width:115px;margin-left:10px;"
            size="small"
            class="bouncedHold"
            @click="confirm"
          >确 定</el-button>
        </el-col>
      </el-row>
      <bm-view style="width: 100%; height: 100%;" />
      <bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" />
      <bm-control :offset="{width: '10px', height: '10px'}">
        <button @click="toggle('polyline')" class="toggle">{{ polyline.editing ? '停止绘制' : '开始绘制' }}</button>
      </bm-control>
      <bm-polyline
        stroke-color="#006080"
         :editing="false"
        :fill-opacity=".5"
        :stroke-weight="1.5"
        :stroke-opacity="1"
        :path="path"
        :key="path.id"
        v-for="path of polyline.paths"
      ></bm-polyline>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" show-address-bar auto-location />
    </baidu-map>
  </el-dialog>
</template>

<script>
import {
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmMarker,
  BmGeolocation,
  BmPolygon, //多边形
  BmPolyline
} from "vue-baidu-map";
export default {
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker,
    BmGeolocation,
    BmPolygon, //多边形
    BmPolyline
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
      default: "设置区划范围"
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
      polyline: {
        editing: false,
        paths: []
      },
      border: []
    };
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
    open(center) {
      this.showMapComponent = true;
      if (this.BMap) {
        if (center.lng != null && center.lng != 0) {
          this.center = center;
        }
      } else {
        if (center.lng != null && center.lng != 0) {
          this.paramsCenter = center;
        }
      }
    },
    close() {
      this.showMapComponent = false;
    },
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

    syncCenterAndZoom(e) {
      // 返回地图当前的缩放级别
      this.zoom = e.target.getZoom();
    },
    /** *
     * 确认
     */
    confirm: function() {
      this.showMapComponent = false;
      this.$emit("map-confirm", this.border);
    },
    /** *
     * 取消
     */
    cancel: function() {
      this.showMapComponent = false;
      this.close();
    },
    // 画线
    toggle(name) {
      this[name].editing = !this[name].editing;
    },
    syncPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        return;
      }
      const path = paths[paths.length - 1];
      if (!path.length) {
        return;
      }
      if (path.length === 1) {
        path.push(e.point);
      }
      this.$set(path, path.length - 1, e.point);
      this.border = path;

    },
    newPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        paths.push([]);
      }
      const path = paths[paths.length - 1];
      path.pop();
      if (path.length) {
        paths.push([]);
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      !paths.length && paths.push([]);
      paths[paths.length - 1].push(e.point);
    },
    //撤销
    backout() {
      this.polyline.paths[0].pop();
    },
    // 清空
    empty() {
      this.polyline.paths = [];
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
</style>

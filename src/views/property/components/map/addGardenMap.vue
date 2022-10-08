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
      @click="getClickInfo"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @ready="onBaiduMapReady"
      @zoomend="syncCenterAndZoom"
       @tilesloaded="hideLogo"
    >
      <el-row class="el-row-x" :gutter="10" style="float: right">
        <el-col :span="10">
          <el-input size="small" type="text" v-model="Pkeyword" placeholder="地址"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input size="small" type="text" v-model="lng" placeholder="经度"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input size="small" v-model="lat" placeholder="纬度"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button class="bouncedHold" style="width:131px;height:31px;" @click="confirm">确定</el-button>
        </el-col>
      </el-row>
      <bm-view style="width: 100%; height: 100%;" />
      <bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" />
      <bm-control :offset="{width: '10px', height: '10px'}">
        <bm-auto-complete v-model="keyword" :sug-style="{zIndex: 999999}">
          <el-input v-model="keyword" type="text" placeholder="请输入地名关键字" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
        </bm-auto-complete>
      </bm-control>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        locationSuccess
        show-address-bar
        auto-location
      />
      <bm-local-search
        :keyword="keyword"
        @searchcomplete="getJW"
        :auto-viewport="true"
        :panel="false"
      />
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
      default: "地图选址"
    },
    width: {
      type: [Number, String],
      default: "80%"
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
      keyword: "", // 地区搜索的信息
      Pkeyword: "",
      addrInfo: { Pkeyword: "", lng: "", lat: "" },
      lng: "", //经度
      lat: "", // 纬度
      mapStyle: {
        width: "100%",
        height: this.mapHeight + "px"
      },
      center: { lng: 118.802, lat: 32.064 },
      choosedLocation: { province: "", city: "", district: "", addr: "" },
      zoom: 15,
      paramsCenter: null
    };
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
    getJW(e) {
      this.lng = e.Ir[0].point.lng;
      this.lat = e.Ir[0].point.lat;
      this.Pkeyword = e.Ir[0].title;
    },
    open(center) {
      this.showMapComponent = true;
      if (this.BMap) {
        if (center.lng != null && center.lng != 0) {
          this.center = center;
        } else {
          this.locationSelf();
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
        } else {
          this.locationSelf();
        }
      }
    },
    //自动定位
    locationSelf() {
      const that = this;
      const geolocation = new this.BMap.Geolocation();
      // 通过 getCurrentPosition() 方法：获取当前的位置信息
      geolocation.getCurrentPosition(res => {
        const { lng, lat } = res.point;
        const { province, city, district, street, street_number } = res.address;

        that.center = { lng, lat };
        that.choosedLocation = {
          province,
          city,
          district,
          addr: street + street_number,
          lng,
          lat
        };
      });
    },
    /** *
     * 地图点击事件。
     */
    getClickInfo(e) {

      // 调整地图中心位置
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;

      // 此时已经可以获取到BMap类
      if (this.BMap) {
        const that = this;
        // Geocoder() 类进行地址解析
        // 创建地址解析器的实例
        const geoCoder = new this.BMap.Geocoder();
        // getLocation() 类--利用坐标获取地址的详细信息
        // getPoint() 类--获取位置对应的坐标
        geoCoder.getLocation(e.point, function(res) {
          that.lng = e.point.lng;
          that.lat = e.point.lat;
          that.Pkeyword = res.address;
          const addrComponent = res.addressComponents;
          const surroundingPois = res.surroundingPois;
          const province = addrComponent.province;
          const city = addrComponent.city;
          const district = addrComponent.district;
          let addr = addrComponent.street;
          if (surroundingPois.length > 0 && surroundingPois[0].title) {
            if (addr) {
              addr += `-${surroundingPois[0].title}`;
            } else {
              addr += `${surroundingPois[0].title}`;
            }
          } else {
            addr += addrComponent.streetNumber;
          }
          that.choosedLocation = {
            province,
            city,
            district,
            addr,
            ...that.center
          };
        });
      }
    },

    syncCenterAndZoom(e) {
      // 返回地图当前的缩放级别
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
    },
    /** *
     * 确认
     */
    confirm: function() {

      this.addrInfo.lng = this.lng;
      this.addrInfo.lat = this.lat;
      this.addrInfo.Pkeyword = this.Pkeyword;
      this.$emit("map-confirm", this.addrInfo);
      this.showMapComponent = false;
    },
    /** *
     * 取消
     */
    cancel: function() {
      this.showMapComponent = false;
      this.close();
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
  .el-dialog__body {
    padding: 5px !important;
  }
  .el-row-x {
    margin-bottom: 7px;
    margin-top: -45px;
    margin-right: -45px !important;
  }
  .el-dialog__body {
    height: 505px;
  }
  .el-input.is-disabled .el-input__inner {
    color: #303133;
  }
}
</style>

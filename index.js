import cvPlay from "@/components/play/play.vue";
import carPng from "./car.png";
import MmapLushu from "./mapLushu.js";
import {
    mapState,
} from "vuex";
export default {
      inject: ["store"],
    extends: cvPlay,
    data(){
       return {
            trankpoint:[],//点数组
            speed:"1000",//双向绑定的速度
            //传入的参数
            vmStore: {
               autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
               speed: "1000", // 传入速度， 单位米每秒
               enableRotation: true, //是否设置marker随着道路的走向进行旋转
               landmarkPois: [],
               showData: 0,
               playFlag: false//播放信号

       }
       }
    },
    methods: {
        //点击开始播放
         trackPaly() {
                if (!this.MAP) this.lushuinit()
                this.vmStore.showData == this.allData.length - 1 && (this.vmStore.showData = 0)
                if (!this.vmStore.playFlag) {
                    this.runLushufeatures()
                } else {
                    this.pauseLushu();
                }
            },
        //新建路书对象
        lushuinit(){
            Object.assign(this.vmStore,{
                defaultContent :this.content(this),
                speed:this.speed
            })
         //百度
            if (this.store.currentName == "cvBaiduMap" && this.lushu == null) {
                 this.MAP = new MmapLushu("cvBaiduMap", this.store.map.map, this.trankpoint, this.vmStore)
                    //高德 
            } else if (this.store.currentName == "cvGaodeMap" && this.lushuG == null) {
                 this.MAP = new MmapLushu("cvGaodeMap", this.store.map.map, this.trankpoint, this.vmStore)
                 //supermap
            }else{
               this.MAP = new MmapLushu("Gis", this.store.map.map, this.trankpoint, this.vmStore)
               
            }
        },
         /**速度更改
          * idx   当前slider
          * speed 当前速度
          */
       changLabel(val) {
            //暂停
            this.MAP && this.MAP.setSpeed(val)
       },
         /**跳点
          *  idx 当前slider
          *  speed 当前速度
          */
         moveTrack(e) {
             //暂停
              this.MAP && this.MAP.checkTrack()
         },
         //路书暂停
         pauseLushu() {
             this.MAP && this.MAP.pause()
         },
         runLushufeatures() {
             this.MAP && this.MAP.start()
         }, 
         /**
          * 
          * @param {*} flag flag true: 停止&&清除地图上的图标和弹框 false 停止
          */
         stopLushu(flag) {
              this.MAP && this.MAP.stop(flag)
         },
         //模板内容
         content(that) {
               return function (n){
                     return `<style>.BMap_pop{margin-left:5px;margin-top: 1px;visibility: visible !important;}.BMap_shadow{display:none}}</style>` +
                         `<div style="    padding: 15px; margin-top: 0;margin-bottom: 0;width:360px;height:180px;overflow:hidden;font-family: 'simsun';font-size: 14px;font-weight: bold;color: #333;">` +
                         `<div><span style='color: #333;font-weight: bold;'>${that.$t(
                  "cvtsp.plateCode"
                )
                }: ${that.selectedVehicle.plateCode}</div > ` +
                         `<div><span style="display:inline-block;margin: 5px 10px 5px 0px;width: 185px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>${that.$t(
                  "historyTrack.gpsTime"
                )}:</span>${that.$filter.format(
                  that.allData[n].gpsTime,
                  "yyyy-MM-dd HH:mm:ss"
                )}</span>` +
                         `<span style="display:inline-block;margin: 5px 0px;width: 150px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>${that.$t(
                  "historyTrack.orientation"
                )}:</span>${that.$filter.direction(that.allData[n].direction)}</span>` +
                         `</div><div><span style="display:inline-block;margin: 5px 10px 5px 0px;width: 185px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>${that.$t(
                  "historyTrack.altiTude"
                )}:</span>${that.allData[n].high}(m)</span>` +
                         `<span style="display:inline-block;margin: 5px 0px;width: 150px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>${that.$t(
                  "historyTrack.mileage"
                )}:</span>${that.allData[n].mileage}(km)</span>` +
                         `</div><div><span style="display:inline-block;margin: 5px 10px 5px 0px;width: 185px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>${that.$t(
                  "historyTrack.speed"
                )}:</span>${that.allData[n].dspeed}(km/h)</span>` +
                         `<span style="display:inline-block;margin: 5px 0px;width: 150px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>${that.$t(
                  "historyTrack.gpsSpeed"
                )}:</span>${that.allData[n].gpsSpeed}(km/h)</span>` +
                         `</div><div><span style="display:inline-block;margin: 5px 10px 5px 0px;width: 185px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>${that.$t(
                  "historyTrack.longitude"
                )}:</span>${that.$filter.toFixed(that.allData[n].mapLongitude, 6)}</span>` +
                         `<span style="display:inline-block;margin: 5px 0px;width: 150px;font-size: 12px;font-weight: normal;color: #666;"><span class='titleName'>${that.$t(
                  "historyTrack.latitude"
                )}:</span>${that.$filter.toFixed(
                  that.allData[n].mapLatitude,
                  6
                )}</span></div>` +
                         `<div style="margin-top: 6px;font-size: 12px;font-weight: normal;color: #666;"><span style="white-space: normal !important">${that.$t(
                  "historyTrack.location"
                )}: ${that.allData[n].locationDesc} </span></div></div>`
                }
             },
         poindata(point) {
             let points=point||this.data
             this.trankpoint = points.map((item) => {
                 return {
                     lng: item.mapLongitude || item.lng,
                     lat: item.mapLatitude || item.lat
                    }
                })
            
        }
    },
     watch: {
         data(val) {
             this.trankpoint=val.map((val)=>{
                 return {
                     lng: val.mapLongitude || val.lng,
                     lat: val.mapLatitude || val.lat
                 }
             })
               this.stopLushu(true)
               this.MAP=null
               this.vmStore.playVal="1000"
               this.speed="1000"
         },
            "store.currentName"(val) {
                this.vmStore.playFlag = false;
                this.trankpoint=null
               this.stopLushu(true)
               this.MAP=null
                this.vmStore.playVal = "1000"
                this.speed="1000"

            },
            "store.loadSearch"(val) {
                 this.stopLushu(true)
                 this.MAP=null
                this.vmStore.playVal = "1000"
                this.speed="1000"
        },
        "store.bPoints"(val) {
               this.poindata(val)
                 this.vmStore.playVal = "1000"
                 this.speed="1000"

            },
           'vmStore.showData'(val) {
                if (val == this.data.length-1){
                    this.vmStore.playFlag=false
                }
           },
           
        }
}
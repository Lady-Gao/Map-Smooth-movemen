/**auther:gaoyanan
 * Fri Jan 11 2019 09: 34: 59 GMT + 0800
 */
import GMapLib from "../../../../../components/changsha-airport/LuShu_Gaode.js";
import AirportGem from "../../../../../components/changsha-airport/AirportGem.js";
/**
 * superMap,baidu,gaode地图平滑移动
 * currentName 地图类型      "cvBaiduMap" ,"Gis" ,"cvGaodeMap"
 * map        地图对象       {} 
 * trankpoint  点数据        [{lng:x lat:y},{lng:x1 lat:y1}...] 
 * obj 参数 {
    * defaultContent:content(this)//文本函数
     autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
     speed: "1000", // 传入速度， 单位米每秒
     enableRotation: true, //是否设置marker随着道路的走向进行旋转
     landmarkPois: [],//站点 没写
     showData: 0,进度  i
     playFlag: false 是否开始和停止
 }
 */
export default class MmapLushu {
    constructor(currentName, map, trankpoint, obj) {
        this.currentName = currentName
        this.map = map
        this.trankpoint = trankpoint
        this.obj = obj
        this.BD = null
        this.GD = null
        this.Gis = null
        
    }
    /**
     * 
     * @param {*} curIndex  跳点
     * @param {*} speed 速度
     */
    start() {
       
        switch (this.currentName) {
            case "cvBaiduMap":
            if (!this.BD ) {
             require("@/components/changsha-airport/LuShu_Baidu.js")
             this.BD = new BMapLib.LuShu(this.map, this.trankpoint, this.obj);
            }
             this.BD.start()
                break;

            case "Gis":
            if (!this.Gis)this.Gis = new AirportGem(this.map, this.trankpoint, this.obj)
            
            this.Gis.start()
                break;
            case "cvGaodeMap":
          
             if (!this.GD) this.GD = new GMapLib(this.map, this.trankpoint, this.obj);
            this.GD.start()
                break;
        }
    }
    
    /**
     * 暂停
     */
    pause() {
        switch (this.currentName) {
            case "cvBaiduMap":
                this.BD && this.BD.pause()
                break;
            case "Gis":
                 this.Gis && this.Gis.pause()
                break;
            case "cvGaodeMap":
                 this.GD && this.GD.pause()
                break;
        }
    }
    
    /**
     * flag true: 停止&&清除地图上的图标和弹框 false 停止
     */
    stop(flag) {
        switch (this.currentName) {
            case "cvBaiduMap":
                this.BD && this.BD.stop(flag)
                break;
            case "Gis":
                this.Gis && this.Gis.stop(flag)
                break;
            case "cvGaodeMap":
                this.GD && this.GD.stop(flag)
                break;
        }
    }
   
    /**
     * 变速,跳点
     * idx  slider ,数组切割的下标
     * speed 当前速度
     */
    checkTrack() {
         switch (this.currentName) {
             case "cvBaiduMap":
                 this.BD && this.BD.setTranck()
                 break;
             case "Gis":
                 this.Gis && this.Gis.setTranck()
                 break;
             case "cvGaodeMap":
                 this.GD && this.GD.setTranck()
                 break;
         }
    }
    /**
     * 设置倍数
     * @param {*} val 
     */
    setSpeed(val){
         switch (this.currentName) {
             case "cvBaiduMap":
                 this.BD && this.BD.setSpeed(val)
                 break;
             case "Gis":
                 this.Gis && this.Gis.setSpeed(val)
                 break;
             case "cvGaodeMap":
                 this.GD && this.GD.setSpeed(val)
                 break;
         }
    }
}
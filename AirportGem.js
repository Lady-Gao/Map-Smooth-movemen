import AirportBase from "./AirportDraw";
import imgMap from "../../assets/img/map/2.gif";
export default class AirportGem {
    constructor(map, trankpoint, obj) {
        this.map = map;
        this.popup = null
        this.contentPop = null
        this.array = []
        this._fromStop = false
        this.trankpoint = trankpoint
        this.obj = obj
        this.i = 0 || this.obj.showData
        this.len = 0
        this.speed = this.obj.speed
    }

//路书开始
start() {
     this.obj.playFlag = true
    //只是暂停
    if (this.animatorVector && this._frompause) {
        this.animatorVector.animator.start()
        this._frompause = false
        return
    }
    this.stop(true)
    //跳点
    if (this.setTran) {
        this.i = this.obj.showData
        this.array = this.trankpoint.slice(this.obj.showData)
        this.len = this.trankpoint.length
    } else {
        this.array = this.trankpoint
        this.len = this.array.length
    }
    this.setcontentPop()
    this.Geminit()
    this.getLayer();
    //点成线、轨迹播放
    setTimeout(() => {
        this.animatorVector && this.animatorVector.animator.start();
        this._fromStop = false
        this._frompause = false
        this.touchOff = false
        this.setTran = false
        this.setSpeedtime = false
    }, 200);

}
//暂停播放动画
pause() {
    if (this.animatorVector) this.animatorVector.animator.pause();
    this._frompause = true
     this.obj.playFlag = false
    //播放和停止的信号 停止 
}
setTranck() {
    //暂停
    if (this.animatorVector) this.animatorVector.animator.pause();
    this.setTran = true
     this.obj.playFlag = false
}
setSpeed(val) {
    if (this.animatorVector) this.animatorVector.animator.pause();
    this.setSpeedtime = true
     this.obj.playFlag = false
    this.speed = val
}
//tingzhi
stop(falg) {
    //falg重新搜索
    if (falg) {
        this.animatorVector && this.animatorVector.destroy()
        this.animatorVector = null
        this.popup && this.closeInfoWindow(this.popup)

    }
    //清除
    this.animatorVector && this.animatorVector.animator.pause()
    this._fromStop = true
    this.i = 0
}
    //赋值文本
    setcontentPop(val) {
        this.popup && this.closeInfoWindow(this.popup)
        this.contentPop = this.obj.defaultContent
    }
    Geminit() {
        //生成地图
        this.animatorVector = new SuperMap.Layer.AnimatorVector("layer", {
            rendererType: "TadpolePoint"
        }, {
            speed: this.speed / 10000, //设置速度为每一帧播放0.01小时的数据speed / 10000
            startTime: 0, //设置开始时间为0时刻
            endTime: 1000 * this.array.length //设置结束时间为1时刻
        });
        //车辆样式
        this.styleCar1 = {
            externalGraphic: imgMap,
            allowRotate: true,
            graphicWidth: 40,
            graphicHeight: 40
        };

        this.map.addLayers([this.animatorVector]);
        this.animatorVector.events.on({
            'featurerendered': this.featurerendered.bind(this),
            'drawfeaturestart': this.drawfeaturestart.bind(this),
        });
    }
    //每次绘制在当前时间节点内的feature时触发
    drawfeaturestart(e) {
        if (this.touchOff) return
        if ((this.i + 1) == this.len) {
            this.touchOff = true
            this.stop(false) //停止不删除图标
            this.obj.playFlag && (this.obj.playFlag = false)

            return
        }
        this.i++
        if (this.obj.showData >= 0) this.obj.showData = this.i
    }
    //每一帧都会触发此事件
    featurerendered(e) {
        if (this.touchOff) return
        if (this.popup) {
            this.closeInfoWindow(this.popup)
        }
        if (this.array.legnth <= this.i) this.i = this.array.length
        this.popup = this.openInfoWindow(this.obj.defaultContent(this.i - 1), {
            lon: e.geometry.x,
            lat: e.geometry.y
        })

    }
    //显示地图范围
    getLayer() {
        this.features = []
        var pointFeatures = []
        this.array.forEach((element, i) => {
            var point = new SuperMap.Geometry.Point(element.lng, element.lat);
            var pointFeature = new SuperMap.Feature.Vector(point, {
                FEATUREID: 0,
                TIME: i
            }, this.styleCar1);
            pointFeatures.push(point);
            this.features.push(pointFeature);
        })
        this.animatorVector.addFeatures(this.features)
    }
    /**
     * 实例化一个新的信息弹框
     * @param {HTML} content: 弹框中的信息模版 
     * @param {Object} options 
     * @param {Object} point:经纬度 
     * @return {Constructor} InfoWindow(弹框实例)
     */
    infoWindow(content, options) {
        return new SuperMap.Popup.FramedCloud(Math.random() * 100, new SuperMap.LonLat(options.lon, options.lat), new SuperMap.Size(370, 210), content, null, true);
    }
    /**
     * 关闭信息弹框
     * @param {Constructor} infoWindow: 需要关闭的弹框实例 
     */
    closeInfoWindow(infoWindow) {
        if (infoWindow) {
            try {

                infoWindow.hide(); //隐藏窗体对象
                infoWindow.destroy(); //消毁窗体对象

            } catch (e) {
                //    console.log(e,"e")
            }
        }
    }
    /**
     * 
     * @param {HTML} content 
     * @param {Object} options:
     *  自定义属性 var options = {
     *           width: 0, // 信息窗口宽度
     *          height: 0, // 信息窗口高度
     *           title: "", // 信息窗口标题
     *          offset: new BMap.Size(-10, -20)
     *       };
     * @param {?} point 不知道是Object还是Constructor(查找百度或高德看属性)
     */
    openInfoWindow(content, options, point) {
        // 百度方法参考
        // var infoWindow = _self.infoWindow(content, options);
        // _self.map.openInfoWindow(infoWindow, point); ---- 打开对应的infoWindow的窗口
        // return infoWindow;
        var infoWindow = this.infoWindow(content, options);
        this.map.addPopup(infoWindow);
        return infoWindow;
    }
}

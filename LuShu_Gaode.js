import carPng from "@/view/monitorPlatform/changshaAirport/airport-historytrack/newHistoryTrack/car.png";
export default class GMapLib {
    constructor(g, f, e) {
    this._Gnum=0
   if (!f || f.length < 1) {
       return
   }
   this._map = g;
   this.trankpoint = f;
   this.i = 0;
   this._projection = this._map;
   this._opts = e
   this.info=null
   this._rotation = 0;
   this._intervalFlag=null
  // // 创建一个 Icon
  this.startIcon = new AMap.Icon({
      // 图标尺寸
      size: new AMap.Size(52, 26),
      // 图标的取图地址
      image: carPng,
      // 图标所用图片大小
      imageSize: new AMap.Size(52, 26)
  });
 this._tween= {
     linear: function (f, j, h, i) {
         var e = f,
             l = j - f,
             g = h,
             k = i;
         return l * g / k + e
     }
 }
} 
//跳点
setTranck = function (idx) {
       this.pause()
       this._path = this.trankpoint.slice(idx)
       this.i = this._opts.showData
       this._Gnum = this._opts.showData + 1
        this._opts.playFlag = false
}
setSpeed = function (val) {
     this.pause()
     this._opts.speed = val
      this._opts.playFlag = false
 };
start () {
     this._opts.playFlag = true
    if (this._fromStop && this._marker) this._map.remove(this._marker)
   this._path =  this.trankpoint
   console.log(this._opts.speed)
   this._opts.speed = this._opts.speed
    var f = this,
        e = this._path.length;
    if (this.i && this.i < e - 1) {
        if (!this._fromPause) {
            return
        } else {

            if (!this._fromStop) {
                this._moveNext(++this.i)
            }
        }
    } else {
            this._Gnum =  0
        this._addMarker();
        this._timeoutFlag = setTimeout(()=>{
            this._moveNext(this.i)
        }, 400)
    }
    this._fromPause = false;
    this._fromStop = false
}
//添加marker
_addMarker(f) {
    if (this._marker) {
        this.stop(true);
        clearTimeout(this._timeoutFlag)
    }
    // 将 icon 传入 marker
    var e = new AMap.Marker({
        position: new AMap.LngLat(this._path[0].lng, this._path[0].lat),
        icon: this.startIcon,
        offset: new AMap.Pixel(-8, -8)
    });
    this._map.add(e)
    e.setAnimation("AMAP_ANIMATION_NONE")
    this._marker = e
}
pause(){
     this._fromPause = true;
     clearInterval(this._intervalFlag)
      this._opts.playFlag = false
}
stop(falg){
    if (falg) {
       this._marker&&this._map.remove(this._marker)
        this._marker = null
        this.info && this._map.clearInfoWindow() && (this.info = null)
    }
       this.i = 0;
       this._fromStop = true;
       clearInterval(this._intervalFlag);
       
  }  
 _moveNext(e){
     if (e < this._path.length - 1) {
           this._Gnum++
           this._opts.showData = this._Gnum
         this._move(this._path[e], this._path[e + 1], this._tween.linear)
         
     }
 }
  _move(n, j, m){
      var i = this,
          h = 0,
          e = 10,
          f = this._opts.speed / (1000 / e),
          //根据球面坐标获得平面坐标
          l = this._projection.lnglatToPixel([n.lng, n.lat], this._projection.getZoom()-1),
          k = this._projection.lnglatToPixel([j.lng, j.lat],this._projection.getZoom()-1),
          g = Math.round(i._getDistance(l, k) / f);
      if (g < 1) {
          i._moveNext(++i.i);
          return
      }
      i._intervalFlag = setInterval(()=> {
          if (h >= g) {
              clearInterval(i._intervalFlag);
              if (i.i > i._path.length) {
                  return
              }
              i._moveNext(++i.i)
          } else {
              h++;
              var o = m(l.x, k.x, h, g),
                  r = m(l.y, k.y, h, g),
                  pixna = new AMap.Pixel(o, r),
                //  根据平面坐标获得球面坐标
                  q = i._projection.pixelToLngLat(pixna, this._projection.getZoom()-1);
              if (h == 1) {
                  var p = null;
                  if (i.i - 1 >= 0) {
                      p = i._path[i.i - 1]
                  }
                }
                i.setRotation(p, n, j)
              i._marker.setPosition(q);
              i._setInfoWin(q)
          }
      }, e)
  }
  //坐标计算
_getDistance(f, e){
       return Math.sqrt(Math.pow(f.x - e.x, 2) + Math.pow(f.y - e.y, 2))
}

     
//计算方向
setRotation(l, f, m) {
     var j = this;
     var e = 0;
     // 经纬度坐标转换为像素坐标
     f = j._map.lnglatToPixel([f.lng, f.lat], this._map.getZoom());
     m = j._map.lnglatToPixel([m.lng, m.lat],this._map.getZoom());
      if (m.x != f.x) {
          var k = (m.y - f.y) / (m.x - f.x),
              g = Math.atan(k);
          e = g * 360 / (2 * Math.PI);
          if (m.x < f.x) {
              e = -e + 90 + 90
          } else {
              e = -e
          }
          j._marker.setRotation(-e)
     } else {
         var h = m.y - this.y;
         var i = 0;
         if (h > 0) {
             i = -1
         } else {
             i = 1
         }
         j._marker.setRotation(-i * 90)
     }
     return
 }

 //弹框
_setInfoWin(g, n){
       if (!n) n = 0
       //关闭弹框
       this.info && this._map.clearInfoWindow()&&(this.info=null)
          
           if (this._Gnum == this._path.length) {
               
                 this._opts.playFlag && (this._opts.playFlag = false)
           } else {
               this.setHtml(this._opts.defaultContent(this._Gnum))
               
           }
   }
///setHtml
setHtml(content) {
     this.info=new AMap.InfoWindow({
         content, //使用默认信息窗体框样式，显示信息内容
     });

     this.info.open(this._map, this._marker.getPosition());
}
 
 }
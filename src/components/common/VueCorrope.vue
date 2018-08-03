/**
*  @description： 顶部面包削组件
*  @author： guokang
*  @data:  2018.6.11
*/
<template> 
 <div id="demo"> 
 <!-- 遮罩层 --> 
    <el-row class="wapper">
      <el-col :span="14"> 
        <el-button class="upload">上传图片</el-button>
        <input  id = 'uploadInput2' class = 'uploadCoverImg' type = 'file' name="coverImg" accept="image/jpeg,image/png" multiple="multiple"
                    @change = "upload($event,'#uploadInput1')" 
                    />
        <p class="info">建议最小尺寸750px*422px</p>
        <img id="image" :src="mysrc" alt="Picture">
      </el-col>
      <el-col :span="10">
        <div class="previewbox">
        <p class="title">封面预览</p>
        <div class="peview">
          <div v-if="myWidth < 750" class="imgInfo">
              <p>当前尺寸过小，无法以大图样式展示(建议最小尺寸为750*422，优质文章将优先以大图形式在APP展示)</p>
          </div>
          <div v-else-if="myHeight < 422" class="imgInfo">
              <p>当前尺寸过小，无法以大图样式展示(建议最小尺寸为750*422，优质文章将优先以大图形式在APP展示)</p>
          </div>
          <img :src='headerImage' v-else/>

          <p>16：9</p>
        </div>
        <div class="peview">
          <img :src='headerImage' class="smallImg"/>
          <p class="smalltext">3：2</p>
        </div>
        </div>
      </el-col>
    </el-row> 
    <el-row class="btnsCrop">
        <el-button @click="postImg" :loading="cropLoading">确定</el-button>
        <el-button @click="close">取消</el-button>
    </el-row>
 </div> 
</template> 
<script>
import Cropper from "cropperjs";
import $ from 'jquery';
export default {
  components: {
  },
  props:{
    src:{},
    imgWidth:{},
    imgHeight:{},
    cropLoading:{},
    type:{}
  },
  data() {
    return {
      mysrc:this.src,
      headerImage: "",
      picValue: "",
      cropper: "",
      croppable: false,
      panel: false,
      BlobData:null,
      myWidth:this.imgWidth,
      myHeight:this.imgHeight,
      myType:this.type,
    };
  },
  mounted() {
    //初始化这个裁剪框
    var self = this;
    self.newCropper();
    setTimeout(()=>{
      self.crop();
    },10)
    
  },
  methods: {
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      
      return url;
    },
    newCropper() {
      var self = this;
      var image = document.getElementById("image");
      this.cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        viewMode: 1,
        background: false,
        zoomable: false,
        autoCrop:true,
        autoCropArea:1,
        minCropBoxWidth:356,
        minCropBoxHeight:200,
        crop: function(e) {
          self.crop();
        },
        ready: function() {
          self.croppable = true;
        },
      
      });
    },
    change(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.panel = true;
      this.picValue = files[0];

      this.url = this.getObjectURL(this.picValue);
      //每次替换图片要重新得到新的url
      if (this.cropper) {
        this.cropper.replace(this.url);
      }
      this.panel = true;
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    isIE(){
      if (window.navigator.userAgent.indexOf("MSIE")>=1) 
      return true; 
      else
      return false; 
    },
    crop() {
      this.panel = false;
      var croppedCanvas;
      var roundedCanvas;
      var _this =this;
      if (!this.croppable) {
        return;
      }
      // Crop
      croppedCanvas = this.cropper.getCroppedCanvas();
      //console.log(this.cropper);
      // Round
      //roundedCanvas = this.getRoundedCanvas(croppedCanvas);
      // var cas=$('#image').cropper('getCroppedCanvas');
       var base64url=croppedCanvas.toDataURL('image/jpeg');
       this.headerImage = base64url;
       if(this.isIE) {
         _this.BlobData = _this.dataURLtoBlob(base64url)
       }else {
         croppedCanvas.toBlob(function (e) {
          //生成Blob的图片格式
            _this.BlobData = e
        })
       }
       
      //this.postImg();
    },
    postImg() {
      //这边写图片的上传
      this.$emit('tailor',this.BlobData)
    },
    close() {
      this.$emit('closeModal')
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    //上传图片
    upload(e) {
      const that = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      
      this.picValue = files[0];
      var imgSize = files[0].size;
      var imgType = files[0].type;
      if (imgSize > 2 * 1024 * 1024 || (imgType != "image/png" && imgType != "image/jpeg")) {
        that.$message({
          type: "warning",
          message: "封面图不超过2M，仅支持jpg、png、jpeg格式"
        });
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.src = reader.result;
        img.onload = function(argument) {
          that.myWidth = this.width;
          that.myHeight = this.height;
          if (this.width < 356) {
            that.$message({
              type: "warning",
              message: "上传封面图最小尺寸356*200px"
            });
          } else if (this.height < 200) {
            that.$message({
              type: "warning",
              message: "上传封面图最小尺寸356*200px"
            });
          } else {
            
          }
        };
      };
       this.mysrc = this.getObjectURL(that.picValue);
     
      //每次替换图片要重新得到新的url
      if (this.cropper) {
       
        var img = new Image();
        img.src = this.mysrc;
        img.onload = function(argument) {
          that.myWidth = this.width;
          that.myHeight = this.height;
          if(that.myType === 'article'){
            if (this.width < 356) {
              that.$message({
                type: "warning",
                message: "上传封面图最小尺寸356*200px"
              });
            } else if (this.height < 200) {
              that.$message({
                type: "warning",
                message: "上传封面图最小尺寸356*200px"
              });
            } else {
              that.cropper.replace(that.mysrc);
            }
          }else {
            if (this.width < 750) {
              that.$message({
                type: "warning",
                message: "上传封面图最小尺寸750*422px"
              });
            } else if (this.height < 422) {
              that.$message({
                type: "warning",
                message: "上传封面图最小尺寸750*422px"
              });
            } else {
              that.cropper.replace(that.mysrc);
            }
          }
        }
      }
    },
    onChange(val){
       
    }
  },
  watch: {
    src(val) {
        this.mysrc = val;//②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
    },
    imgWidth(val) {
      this.myWidth = val;
    },
    imgHeight(val) {
      this.myHeight = val;
    },
    type(val) {
      this.myType = val;
    }
  },
};
</script>

<style lang="less" > 
*{ 
 margin: 0; 
 padding: 0; 
}
#demo #button { 
 position: absolute; 
 right: 10px; 
 top: 10px; 
 width: 80px; 
 height: 40px; 
 border:none; 
 border-radius: 5px; 
 background:white; 
}
#demo .show { 
 width: 100px; 
 height: 100px; 
 overflow: hidden; 
 position: relative; 
 border-radius: 50%; 
 border: 1px solid #d5d5d5; 
}
#demo .picture { 
 width: 100%; 
 height: 100%; 
 overflow: hidden; 
 background-position: center center; 
 background-repeat: no-repeat; 
 background-size: cover; 
}
#demo .container { 
 z-index: 99; 
 position: fixed; 
 padding-top: 60px; 
 left: 0; 
 top: 0; 
 right: 0; 
 bottom: 0; 
 background:rgba(0,0,0,1); 
}
  
#demo #image { 
 max-width: 100%; 
 height:280px;
} 
.wapper {
  height:420px;
}
.previewbox {
 background:rgba(240,242,245,1);
 height:490px;
 margin-left: 30px;
 .title {
   font-size:16px;
   width:320px;
   text-align: center;
   color: #333;
   margin: 0px 0 10px;
   padding-top:18px;
 }
}
.uploadCoverImg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 150px;
    height: 40px;
    filter: alpha(opacity=0);
    -moz-opacity: 0;
    -khtml-opacity: 0;
    opacity: 0;
    z-index: 100;
    cursor: pointer;
  }
.peview {
  text-align: center;
  position: relative;
  p {
     font-size: 16px;
     color: #333;
     padding:10px 0;
     text-align-last: center;
  }
  img{
    display: inline-block;
    width:320px;
    height:180px;
    background:#fff;
    margin: 0 auto;
  }
  .smallImg {
    position: absolute;
    clip: rect(0px 295px 180px 25px);
    left: 10px;
  }
  .smalltext {
    position: absolute;
    width:320px;
    top:180px;
  }
}
.upload {
  width:150px;
  height:40px;
  background:rgba(35,130,234,1);
  border-radius:4px;
  color:#fff;
  border:0;
  margin-bottom: 10px;
  &:hover {
    background:rgba(35,130,234,0.7);
    color:#fff;
  }
}
.info {
  color:#666;
  font-size:14px;
  margin-bottom: 20px;
}
.btnsCrop {
  margin-top: 50px;
  text-align: center;
  button {
    margin-top: 20px;
    text-align: center;
    font-size:14px;
    &:nth-child(1) {
      width:150px;
      height:40px;
      background:rgba(35,130,234,1);
      border-radius:4px;
      color:#fff;
      &:hover {
        background:rgba(35,130,234,0.7);
        color:#fff;
      }
    }
    &:nth-child(2) {
      width:150px;
      height:40px;
      background:rgba(255,255,255,1);
      border-radius:4px;
      color:#333333;
    }
  }
}
.imgInfo {
  width:320px;
  height:180px;
  background: #fff;
  margin: 0 auto;
  p {
    width:216px;
    margin: 0 auto;
    font-size:14px;
    font-family:MicrosoftYaHei;
    color:rgba(102,102,102,1);
    line-height:28px;
    text-align: left;
    padding-top: 44px;
  }
 
}
.cropper-view-box,.cropper-face { 
 /* border-radius: 50%;  */
} 
/*! 
 * Cropper.js v1.0.0-rc 
 * https://github.com/fengyuanchen/cropperjs 
 * 
 * Copyright (c) 2017 Fengyuan Chen 
 * Released under the MIT license 
 * 
 * Date: 2017-03-25T12:02:21.062Z 
 */
  
.cropper-container { 
  height:400px!important;
 font-size: 0; 
 line-height: 0; 
  
 position: relative; 
  
 -webkit-user-select: none; 
  
  -moz-user-select: none; 
  
  -ms-user-select: none; 
  
   user-select: none; 
  
 direction: ltr; 
 -ms-touch-action: none; 
  touch-action: none 
} 
  
.cropper-container img { 
 /* Avoid margin top issue (Occur only when margin-top <= -height) */
 display: block; 
 min-width: 0 !important; 
 max-width: none !important; 
 min-height: 0 !important; 
 max-height: none !important; 
 width: 100%; 
 height: 100%; 
 image-orientation: 0deg 
} 
  
.cropper-wrap-box, 
.cropper-canvas, 
.cropper-drag-box, 
.cropper-crop-box, 
.cropper-modal { 
 position: absolute; 
 top: 0; 
 right: 0; 
 bottom: 0; 
 left: 0; 
} 
  
.cropper-wrap-box { 
 overflow: hidden; 
} 
  
.cropper-drag-box { 
 opacity: 0; 
 background-color: #fff; 
} 
  
.cropper-modal { 
 opacity: .5; 
 background-color: #000; 
} 
  
.cropper-view-box { 
 display: block; 
 overflow: hidden; 
  
 width: 100%; 
 height: 100%; 
  
 outline: 1px solid #39f; 
 outline-color: rgba(51, 153, 255, 0.75); 
} 
  
.cropper-dashed { 
 position: absolute; 
  
 display: block; 
  
 opacity: .5; 
 border: 0 dashed #eee 
} 
  
.cropper-dashed.dashed-h { 
 top: 33.33333%; 
 left: 0; 
 width: 100%; 
 height: 33.33333%; 
 border-top-width: 1px; 
 border-bottom-width: 1px 
} 
  
.cropper-dashed.dashed-v { 
 top: 0; 
 left: 33.33333%; 
 width: 33.33333%; 
 height: 100%; 
 border-right-width: 1px; 
 border-left-width: 1px 
} 
  
.cropper-center { 
 position: absolute; 
 top: 50%; 
 left: 50%; 
  
 display: block; 
  
 width: 0; 
 height: 0; 
  
 opacity: .75 
} 
  
.cropper-center:before, 
 .cropper-center:after { 
 position: absolute; 
 display: block; 
 content: ' '; 
 background-color: #eee 
} 
  
.cropper-center:before { 
 top: 0; 
 left: -3px; 
 width: 7px; 
 height: 1px 
} 
  
.cropper-center:after { 
 top: -3px; 
 left: 0; 
 width: 1px; 
 height: 7px 
} 
  
.cropper-face, 
.cropper-line, 
.cropper-point { 
 position: absolute; 
  
 display: block; 
  
 width: 100%; 
 height: 100%; 
  
 opacity: .1; 
} 
  
.cropper-face { 
 top: 0; 
 left: 0; 
  
 background-color: #fff; 
} 
  
.cropper-line { 
 background-color: #39f 
} 
  
.cropper-line.line-e { 
 top: 0; 
 right: -3px; 
 width: 5px; 
 cursor: e-resize 
} 
  
.cropper-line.line-n { 
 top: -3px; 
 left: 0; 
 height: 5px; 
 cursor: n-resize 
} 
  
.cropper-line.line-w { 
 top: 0; 
 left: -3px; 
 width: 5px; 
 cursor: w-resize 
} 
  
.cropper-line.line-s { 
 bottom: -3px; 
 left: 0; 
 height: 5px; 
 cursor: s-resize 
} 
  
.cropper-point { 
 width: 5px; 
 height: 5px; 
  
 opacity: .75; 
 background-color: #39f 
} 
  
.cropper-point.point-e { 
 top: 50%; 
 right: -3px; 
 margin-top: -3px; 
 cursor: e-resize 
} 
  
.cropper-point.point-n { 
 top: -3px; 
 left: 50%; 
 margin-left: -3px; 
 cursor: n-resize 
} 
  
.cropper-point.point-w { 
 top: 50%; 
 left: -3px; 
 margin-top: -3px; 
 cursor: w-resize 
} 
  
.cropper-point.point-s { 
 bottom: -3px; 
 left: 50%; 
 margin-left: -3px; 
 cursor: s-resize 
} 
  
.cropper-point.point-ne { 
 top: -3px; 
 right: -3px; 
 cursor: ne-resize 
} 
  
.cropper-point.point-nw { 
 top: -3px; 
 left: -3px; 
 cursor: nw-resize 
} 
  
.cropper-point.point-sw { 
 bottom: -3px; 
 left: -3px; 
 cursor: sw-resize 
} 
  
.cropper-point.point-se { 
 right: -3px; 
 bottom: -3px; 
 width: 20px; 
 height: 20px; 
 cursor: se-resize; 
 opacity: 1 
} 
  
@media (min-width: 768px) { 
  
 .cropper-point.point-se { 
 width: 15px; 
 height: 15px 
 } 
} 
  
@media (min-width: 992px) { 
  
 .cropper-point.point-se { 
 width: 10px; 
 height: 10px 
 } 
} 
  
@media (min-width: 1200px) { 
  
 .cropper-point.point-se { 
 width: 5px; 
 height: 5px; 
 opacity: .75 
 } 
} 
  
.cropper-point.point-se:before { 
 position: absolute; 
 right: -50%; 
 bottom: -50%; 
 display: block; 
 width: 200%; 
 height: 200%; 
 content: ' '; 
 opacity: 0; 
 background-color: #39f 
} 
  
.cropper-invisible { 
 opacity: 0; 
} 
  
/* .cropper-bg { 
 background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC'); 
}  */
  
.cropper-hide { 
 position: absolute; 
  
 display: block; 
  
 width: 0; 
 height: 0; 
} 
  
.cropper-hidden { 
 display: none !important; 
} 
  
.cropper-move { 
 cursor: move; 
} 
  
.cropper-crop { 
 cursor: crosshair; 
} 
  
.cropper-disabled .cropper-drag-box, 
.cropper-disabled .cropper-face, 
.cropper-disabled .cropper-line, 
.cropper-disabled .cropper-point { 
 cursor: not-allowed; 
} 
  
  
</style>

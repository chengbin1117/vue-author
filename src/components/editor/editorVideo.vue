  /**
*  @description： 作者端发布文章
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
  <div>
    <Bread :name = "name"></Bread>
    <div class="publishVideo">
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="标题：" label-width="102px" prop ="title" id="myTitle">
              <el-input v-model="form.title"  placeholder="请在这里输入文章标题" class="videotitle">
               <span slot="suffix" class="num">{{titleNum}}/64</span>
              </el-input>
            </el-form-item>
            <el-form-item label="视频：" label-width="102px" id="myVideo">
              <el-radio-group v-model="form.videoType" >
                <el-radio label="1">本地视频</el-radio>
                <el-radio label="2">视频链接</el-radio>
              </el-radio-group>
            </el-form-item>
             <el-form-item class = 'videoType'  style = "margin-bottom:20px" label-width="102px"  v-if = "form.videoType === '1'" prop = "videoInfo">
                <el-upload
                  v-model= "form.videoInfo"
                  class="upload-demo uploadVideo"
                  :action = "uploadVideoUrl"
                  :on-error = "handleError"
                  :on-remove = "handleRemove"
                  :on-success = "handleSuccess"
                  :before-upload = "handleBefore"
                  :before-remove = "beforeRemove"
                  :on-change = "handleChange"
                  :on-exceed = "handleExceed"
                  accept = '.mp4'
                  :file-list = "fileList"
                  :disabled = "limitUpload"
                  >
                  <el-button :loading = "limitUpload"  type="primary">{{form.videoInfo == '' ? '添加视频':'重新上传'}}</el-button>
                  <div slot="tip" class="el-upload__tip">限200M以内mp4格式视频</div>
                </el-upload>

            </el-form-item>
            <el-form-item v-if = "form.videoType === '2'" label-width="102px" prop="videoInfo2" class="videoUrl">
                 <div  >
                  <el-input  size = 'small' v-model="form.videoInfo2" placeholder = '示例：<iframe frameborder="0" width="640" height="498" src="……" allowfullscreen> </iframe>'></el-input>
                  <a style = "display:block;width:140px"  :href = 'tutorial' target="_blank">如何上传视频链接？</a>
                </div>
            </el-form-item>
            <el-form-item class = 'marginTop' label="Tag标签：" prop = 'tag' label-width="102px" id="myTag">
              <el-input v-for = "(item,key) in tag" :key = "key" size = 'small' class = 'tagInput' v-model="item.value" placeholder = ''>
              </el-input>
              <a class="tipsTag">至少3个tag, 每个tag2-8个汉字</a>
            </el-form-item>
            <el-form-item label="视频简介：" label-width="102px" prop="textarea" class="area" id="myVideoIntro">
              <el-input type="textarea" placeholder="请输入视频简介" v-model="form.textarea"></el-input>
            </el-form-item>
            <el-form-item label="封面图：" label-width="102px" prop = "listCoverImgPost">
              <div class="articleImg">
                <div class="img" v-loading="imgloading">
                  <input  id = 'uploadInput1' class = 'uploadCoverImg' type = 'file' name="coverImg" accept="image/jpeg,image/png" multiple="multiple"
                          @change = "showDialog($event,'#uploadInput1')"
                  />
                  <img v-if = "form.listCoverImgPost == null " class = ' listCoverImg' src = "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/img/articleDefaut_up.png" />
                  <img v-else class = 'listCoverShow' :src = "form.listCoverImgShow"  />
                </div>
                <!--<el-button>上传</el-button>-->
              </div>
            <!--  <p class="imgtips">找不到合适的图片？您可以用以下任一张图作为封面图</p>
              <div class = 'chooseCover'>
                <div v-for = '(item,index) in dataImg' :key="item.id">
                    <img :src = 'item.path' @click = "chooseCover(index,$event)"  :class="{active:index==isActive}"/>
                    <span v-if="index==isActive"><i class="iconfont icon-gou "></i></span>
                </div>

              </div>-->
            </el-form-item>
            <el-form-item label="类别：" label-width="102px"  prop="articleType">
              <el-radio-group v-model="form.articleType">
                <el-radio label="1">原创</el-radio>
                <el-radio label="2">转载</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if = "form.articleType === '' ? false : true">
              <el-form-item  v-if = "form.articleType == 1 ? false : true" label="视频来源：" prop = "articleSource" label-width="102px" id="myVideoSource">
                <el-input size = 'small' v-model="form.articleSource" placeholder = '请输入视频来源网站名称，如**网'></el-input>
              </el-form-item>
              <el-form-item  v-if = "form.articleType == 1 ? false : true" label="来源地址：" prop = "articleLink" label-width="102px">
                <el-input size = 'small' v-model="form.articleLink" placeholder = '请输入视频来源地址'></el-input>
              </el-form-item>
            </div>
            <el-form-item label="权利声明：" label-width="102px">
              <el-row>
                <el-col :span="24" class="instructions bgcolor">
                  <div>考虑到用户浏览体验，所有投稿千氪财经的稿件，千氪财经均有权对文章的标题、头图进行调整，这些调整并不会影响正文
                    内容，如果需要进行内容调整，编辑会与作者联系确认，不会直接修改。</div>
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-form-item label="视频打赏：" label-width="102px" prop="award" >
              <el-radio-group v-model="form.award">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">不开启</el-radio>
              </el-radio-group>
              <div>
                  <p class="red-text">注：开启打赏后，可在视频详情页展示打赏入口，其他用户可以向您打赏一定额度的钛值; 不开启打赏，则视频详情页无打赏入口</p>
              </div>
            </el-form-item> -->
            <div class="line"></div>
            <el-form-item class="btn-boss" >
              <div class="btn-boss-default">
                <div class="btn-ddiv">
                  <div style="width: 958px;padding: 0 36px">
                    <div class="btn-boss-default-center" >
                      <el-button type="primary" class="btn"  @click="publish('form')" :loading="publishLoading">立即发布</el-button>
                      <el-button class="btn" @click="preview">预览</el-button>
                      <el-button class="btn save" @click="draft" :loading="draftLoading">存草稿</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn-boss-bottom">
                <el-button type="primary" class="btn"  @click="publish('form')" :loading="publishLoading">立即发布</el-button>
                <el-button class="btn" @click="preview">预览</el-button>
                <el-button class="btn save" @click="draft" :loading="draftLoading">存草稿</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
       <!-- 封面图裁剪 -->
      <Dialog v-if="showBlockMask" @close="close" :width="width">
        <div class="mask-title">上传封面</div>
        <div class="mask-block">
          <VueCorrope :src="checkedImg" :type="video" v-on:closeModal="close()"  :imgWidth="imgWidth" :imgHeight="imgHeight" v-on:tailor="tailorCreate" :cropLoading="cropLoading"></VueCorrope>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
import Bread from "../common/Bread";
import C from "./../../assets/js/config.js";
import axios from "axios";
import JQ from "jquery";
import Dialog from "../common/Dialog";
import Verification from "@/assets/js/util/verification";
import VueCorrope from "../common/VueCorrope";
import article1 from "@/assets/img/article1.png";
import article2 from "@/assets/img/article2.png";
import article3 from "@/assets/img/article3.png";
export default {
  components: { Bread, VueCorrope, Dialog },
  data() {
    var validateTitle = (rule, value, callback) => {
      this.titleNum = value.length;
      if (value == "") {
        callback(new Error("视频标题不能为空"));
      } else if (value != "" && typeof this.sensitive === "string") {
        const sensitive = this.sensitive.split(",");
        for (var i in sensitive) {
          if (value.indexOf(sensitive[i]) != "-1") {
            callback(new Error("视频标题检测到敏感词：" + this.sensitive));
          } else {
            callback();
          }
        }
      } else if (value != "" && (value.length > 64 || value.length < 1)) {
        callback(new Error("视频标题长度在 1 到 64 个字符"));
      } else {
        callback();
      }
    };
    var validateTag = (rule, value, callback) => {
      var n = 0;
      var res = [this.tag[0].value];
      for (var i in this.tag) {
        if (this.tag[i].value == "") {
          n += 1;
        } else if (!Verification.validateTag(this.tag[i].value)) {
          callback(new Error("每个tag：2-16个字符"));
        } else if (
          this.tag[i].value != "" &&
          typeof this.sensitive === "string"
        ) {
          const sensitive = this.sensitive.split(",");
          for (var j in sensitive) {
            if (this.tag[i].value.indexOf(sensitive[j]) != "-1") {
              callback(new Error("视频标签检测到敏感词：" + this.sensitive));
            }
          }
        }
      }
      for (var k = 1; k < this.tag.length; k++) {
        var repeat = false;
        for (var j = 0; j < res.length; j++) {
          if (this.tag[k].value == res[j] && res[j] != "") {
            repeat = true;
            callback(new Error("tag标签不能重复"));
            break;
          }
        }
        if (!repeat) {
          res.push(this.tag[k].value);
        }
      }
      if (n > 2) {
        callback(new Error("至少输入3个tag"));
      } else {
        callback();
      }
    };
    var validateCoverImg = (rule, value, callback) => {
      if (this.form.listCoverImgPost == null) {
        callback(new Error("请选择封面图片"));
      } else {
        callback();
      }
    };
    var validateVideo = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请上传视频"));
      } else {
        callback();
      }
    };
    var validateVideoUrl = (rule, value, callback) => {
      console.log(value.indexOf("iframe"));
      if (value == "") {
        callback(new Error("请输入视频视频链接"));
      } else if (value.indexOf("iframe") === -1) {
        callback(
          new Error(
            '请输入视频为了更好的视频浏览体验，请粘贴外部视频网站的视频通用代码，代码示例：<iframe frameborder="0"width="640"height="498"src="...……"allowfullscreen></iframe>若视频网站不支持这种通用代码，请尝试更换视频网站或直接本地上传视频。支持的网站：优酷、腾讯视频、爱奇艺等。不支持的网站：搜狐视频、乐视视频等视频链接'
          )
        );
      } else {
        callback();
      }
    };
    let validateTextarea = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入视频简介"));
      } else if (value != "" && (value.length > 100 || value.length < 10)) {
        callback(new Error("请输入10-100个字作为视频简介"));
      } else if (value != "" && typeof this.sensitive === "string") {
        const sensitive = this.sensitive.split(",");
        for (var i in sensitive) {
          if (value.indexOf(sensitive[i]) != "-1") {
            callback(new Error("视频简介检测到敏感词：" + this.sensitive));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    let validateSource = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入视频来源"));
      } else if (value != "" && (value.length > 500 || value.length < 1)) {
        callback(new Error("请输入1-500字的视频来源"));
      } else if (value != "" && typeof this.sensitive === "string") {
        const sensitive = this.sensitive.split(",");
        for (var i in sensitive) {
          if (value.indexOf(sensitive[i]) != "-1") {
            callback(new Error("视频来源检测到敏感词：" + this.sensitive));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    return {
      showBlockMask: false,
      width: "950px",
      name: "编辑视频", //顶部名字
      form: {
        videoInfo: "",
        title: "",
        videoType: "1",
        textarea: "",
        tag: "",
        category: "",
        from: "",
        url: "",
        money: "",
        videoInfo2: "",
        videoFilename: "",
        articleType: "",
        articleSource: "",
        articleLink: "",
        listCoverImgPost: null,
        listCoverImgShow: "",
        award: '0'
      },
      option: {
        size: 1,
        outputType: "png",
        full: true,
        autoCrop: true,
        autoCropWidth: 356,
        autoCropHeight: 200,
        fixedNumber: [16, 9]
      },
      imgloading:false,
      cropLoading: false,
      checkedImg: "", //封面图
      imgWidth: 0,
      imgHeight: 0,
      previews: "",
      crap: false,
      vIf: false,
      video:'video',
      uploadUrl: C.uploadImgUrlHost,
      uploadVideoUrl: C.uploadVideoUrlHost,
      videourl: C.videoHost,
      imgUrl: C.imgHost,
      tutorial: C.mainNameHost+'/about_course/list.html',  //如何上传视频链接地址
      dialogRelease: false, // 发布成功莫泰
      dialogReleaseErro: false, // 发布失败莫泰
      d: false, // 发布莫泰
      limitUpload: false,
      fileList: [],
      articleId:null,
      tag: [
        { id: "1", value: "" },
        { id: "2", value: "" },
        { id: "3", value: "" },
        { id: "4", value: "" },
        { id: "5", value: "" }
      ],
      tagStr: "",
      dataImg: [
        {
          id: "1",
          path: article1
        },
        {
          id: "2",
          path: article2
        },
        {
          id: "3",
          path: article3
        }
      ],
      isActive: "-1",
      publishLoading: false,
      draftLoading: false,
      titleNum: 0,
      rules: {
        title: [
          { required: true, validator: validateTitle, trigger: "blur" }
        ],
        tag: [{ required: true, validator: validateTag, trigger: "change" }],
        textarea: [
          { required: true, validator: validateTextarea, trigger: "change" }
        ],
        articleSource: [
          { required: true, validator: validateSource, trigger: "change" }
        ],
        articleLink: [
          { required: true, message: "请输入原文链接", trigger: "change" },
          {
            min: 1,
            max: 500,
            message: "长度不能超过500个字符",
            trigger: "change"
          }
        ],
        articleType: [
          { required: true, message: "请选择文章类别", trigger: "change" }
        ],
        award: [
          { required: true, message: "请选择是否开启打赏", trigger: "change" }
        ],
        listCoverImgPost: [
          { required: true, validator: validateCoverImg, trigger: "change" }
        ],
        videoInfo: [
          { required: true, validator: validateVideo, trigger: "change" }
        ],
        videoInfo2: [
          { required: true, validator: validateVideoUrl, trigger: "change" }
        ]
      },
      isPublish: true,
      winUrl:''
    };
  },
  created() {
    // const that = this;
    // history.pushState(null, null, that.winUrl);
    // window.addEventListener("popstate",that.pushHistory);
    // window.onbeforeunload = function(){
    //       return "您的视频尚未保存，确定要离开吗";
    //   }
  },
  // 组件内导航钩子，处理未保存退出的情况
  beforeRouteLeave: function(to, from , next){
    if(this.isPublish){
      next(false)
      var bool =  window.confirm("有内容正在编辑，是否退出当前编辑?");
      if(bool) {
        next()

      }else{
        next(false)
      }
      // this.$alert('有内容正在编辑，是否退出当前编辑?', '提示', {
      //     cancelButtonText: "取消",
      //     confirmButtonText: "确定",
      //     showCancelButton: true,
      //     customClass: "applySuccessBox",
      //     cancelButtonClass: "cancelButtonClass",
      //     confirmButtonClass: "confirmButtonClass",
      //     showClose: false,
      //     center: true,
      //     lockScroll: false
      // }).then(() => {
      //   // 选择确定
      //   next()
      // })
    }else {
      next()
    }
  },
  mounted() {
    window.addEventListener("scroll",this.handleFun);
    var id = this.$route.query.id;
    this.getVideoDetail(id);
    //监听浏览器关闭
    // this.winUrl = document.URL;
    // history.pushState(null, null, document.URL);
    // window.addEventListener('popstate', function () {
    //     history.pushState(null, null, document.URL);
    // });
  },
  beforeDestroy(){
    window.removeEventListener("scroll",this.handleFun)
  },
  methods: {
    handleFun(){
      let scorll = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
      let seltHigth=JQ("#myVideo").offset().top;
      seltHigth=seltHigth-150
      if(scorll<seltHigth){
        JQ(".btn-boss-default").css("display" ,'block');
      }else {
        JQ(".btn-boss-default").css("display" ,'none');
      }
    },
    pushHistory() {
      var bool =  window.confirm("您还未保存视频，确定需要退出吗?");
      const _this = this
        if(bool) {
          history.go(-1)
          window.removeEventListener('popstate',_this.pushHistory);

        }else{
          window.removeEventListener('popstate',_this.pushHistory);
          history.pushState(null, null, _this.winUrl);
        }
    },
    getVideoDetail(id) {
      let data = {
        articleId:id
      }
      const _this = this;
      this.ajax({
        url:'/release/getArticleContent',
        data,
        success(data) {
          if(data.code === '10000') {

              var res = data.responseBody.data;
              _this.form.title = res.articleTitle;
              _this.articleId = res.articleId,
              _this.form.textarea = res.articleDescription;
              _this.form.listCoverImgShow = res.articleImage == null ? '' :_this.imgUrl + res.articleImage;
              _this.form.listCoverImgPost = res.articleImage == null ? null :  res.articleImage;
              _this.form.articleType = res.articleType == null ? '' :res.articleType + '';
              _this.form.award = res.bonusStatus == null ? '' :res.bonusStatus + '';
              let tagArr = [];
              if(res.articleTagnames != null){
                tagArr = res.articleTagnames.split(',')
                for(var i in tagArr){
                  _this.tag[i].value = tagArr[i]
                }
              }
              if(res.articleType === 2 ) {
                _this.form.articleSource = res.articleSource == null ? '' :res.articleSource + '';
                _this.form.articleLink = res.articleLink == null ? '' :res.articleLink + '';
              }
              if(res.videoFilename == "") {
                if(res.videoUrl == "") {
                  _this.form.videoType = '1'
                }else {
                  _this.form.videoType = '2'
                  _this.form.videoInfo2 = res.videoUrl
                }

              }else {
                 _this.form.videoInfo = res.videoUrl;
                 _this.form.videoFilename = res.videoFilename,
                 _this.fileList =[ {name: res.videoFilename, url: res.videoUrl}]

              }
          }else {
            _this.$message({
              type:'error',
              message:res.message
            })
          }
        },
        catch(error) {

        }
      })
    },
    publish(form) {
      let n = 0;
      let arr = [];
      for (var i in this.tag) {
        if (this.tag[i].value == "") {
          n += 1;
        } else {
          arr.push(this.tag[i].value);
        }
      }
      this.tagStr = arr.join(",");
      let _this = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          let videoUrl = "";
          let videoFilename = "";
          //判断是否是本地上传的视频
          if (this.form.videoType === "1") {
            if(this.form.videoInfo == ''){
              videoUrl = '';
            }else if(this.form.videoInfo != '' && this.form.videoInfo.indexOf('oss') != '-1'){
              videoUrl = this.form.videoInfo

            }else{
              videoUrl =this.videourl + this.form.videoInfo;
            }

            videoFilename = this.form.videoFilename;
          } else {
            if(this.form.videoInfo2.indexOf('https') === -1) {
               videoUrl =this.form.videoInfo2.replace(/http/,'https')
            }else {
               videoUrl = this.form.videoInfo2;
            }

            videoFilename = "";
          }
          let data = {
            articleId: _this.articleId,
            articleTitle: _this.form.title,
            articleImage: _this.form.listCoverImgPost,
            publishKind: "2",
            articleDescription: _this.form.textarea,
            articleTagnames: _this.tagStr,
            articleType: parseInt(_this.form.articleType),
            bonusStatus: parseInt(_this.form.award),
            textnum: _this.limitLength,
            publishStatus: 2,
            videoUrl: videoUrl,
            videoFilename: videoFilename
          };
          if (_this.form.articleType === "2") {
            data.articleLink = _this.form.articleLink;
            data.articleSource = _this.form.articleSource;
          }
          _this.publishLoading = true;
          _this.ajax({
            url: "/release/addArticle",
            data,
            success(data) {
              if (data.code === "10000") {
                _this.publishLoading = false;
                localStorage.setItem("kg_author_contentMange", "video");
                _this
                  .$alert(
                    "您的视频已成功发布，通过审核后，即可展示出来,请耐心等待!",
                    "发布成功",
                    {
                      cancelButtonText: "取消",
                      confirmButtonText: "我知道了",
                      showCancelButton: false,
                      customClass: "applySuccessBox",
                      cancelButtonClass: "cancelButtonClass",
                      confirmButtonClass: "confirmButtonClass",
                      showClose: false,
                      center: true
                    }
                  )
                  .then(() => {
                    localStorage.setItem('kg_author_contentMange','video')
                    _this.isPublish = false
                    _this.$router.push("/contentManage");
                  })
                  .catch(() => {});
              } else if (data.code === "29001") {
                _this.publishLoading = false;
                _this.sensitive = data.message;
                _this.$refs["form"].validateField("title", title => {
                  if (title == "") {
                  } else {
                    return false;
                  }
                });
                _this
                  .$alert("检测到标题有敏感词，请修改后在发布", "提示", {
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    showCancelButton: false,
                    customClass: "applySuccessBox",
                    cancelButtonClass: "cancelButtonClass",
                    confirmButtonClass: "confirmButtonClass",
                    showClose: false,
                    center: true,
                    lockScroll: false
                  })
                  .then(() => {
                    let anchor = _this.$el.querySelector('#myTitle')
                    document.body.scrollTop = anchor.offsetTop
                    document.documentElement.scrollTop = anchor.offsetTop
                    _this.sensitive=[]

                  })
                  .catch(() => {});
              } else if (data.code === "29002") {
                let sensitive = [];
                _this.publishLoading = false;
                sensitive = data.message.split(",");
                _this.sensitive = data.message.split(",");
                JQ.each(sensitive, function(i, e) {
                  //console.log(i,e)
                  if (_this.editorContentHtml.indexOf(e) > 0) {
                    //若匹配到了铭感词使用高亮显示,这里使用的是红色显示
                    sensitive = _this.editorContentHtml.replace(
                      new RegExp(e, "gm"),
                      '<span style="color:red;"  contenteditable="false">' +
                        e +
                        "</span>"
                    );
                    JQ(".ql-editor").html(sensitive);
                  }
                });
                _this
                  .$alert("检测到正文有敏感词，请修改后在发布", "提示", {
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    showCancelButton: false,
                    customClass: "applySuccessBox",
                    cancelButtonClass: "cancelButtonClass",
                    confirmButtonClass: "confirmButtonClass",
                    showClose: false,
                    center: true,
                    lockScroll: false
                  })
                  .then(() => {})
                  .catch(() => {});
              } else if (data.code === "29003") {
                _this.sensitive = data.message;
                _this.publishLoading = false;
                _this.$refs["form"].validateField("tag", tag => {
                  if (tag == "") {
                  } else {
                    return false;
                  }
                });
                _this
                  .$alert("检测到TAG标签有敏感词，请修改后在发布", "提示", {
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    showCancelButton: false,
                    customClass: "applySuccessBox",
                    cancelButtonClass: "cancelButtonClass",
                    confirmButtonClass: "confirmButtonClass",
                    showClose: false,
                    center: true,
                    lockScroll: false
                  })
                  .then(() => {
                    let anchor = _this.$el.querySelector('#myTag')
                    document.body.scrollTop = anchor.offsetTop
                    document.documentElement.scrollTop = anchor.offsetTop
                    _this.sensitive=[]

                  })
                  .catch(() => {});
              } else if (data.code === "29004") {
                _this.sensitive = data.message;
                _this.publishLoading = false;
                _this.$refs["form"].validateField("textarea", textarea => {
                  if (textarea == "") {
                  } else {
                    return false;
                  }
                });
                _this
                  .$alert("检测到视频简介有敏感词，请修改后在发布", "提示", {
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    showCancelButton: false,
                    customClass: "applySuccessBox",
                    cancelButtonClass: "cancelButtonClass",
                    confirmButtonClass: "confirmButtonClass",
                    showClose: false,
                    center: true,
                    lockScroll: false
                  })
                  .then(() => {
                    let anchor = _this.$el.querySelector('#myVideoIntro')
                    document.body.scrollTop = anchor.offsetTop
                    document.documentElement.scrollTop = anchor.offsetTop
                    _this.sensitive=[]

                  })
                  .catch(() => {});
              } else if (data.code === "29006") {
                _this.sensitive = data.message;
                _this.publishLoading = false;
                _this.$refs["form"].validateField(
                  "articleSource",
                  articleSource => {
                    if (articleSource == "") {
                    } else {
                      return false;
                    }
                  }
                );
                _this
                  .$alert("检测到视频来源有敏感词，请修改后在发布", "提示", {
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    showCancelButton: false,
                    customClass: "applySuccessBox",
                    cancelButtonClass: "cancelButtonClass",
                    confirmButtonClass: "confirmButtonClass",
                    showClose: false,
                    center: true,
                    lockScroll: false
                  })
                  .then(() => {
                    let anchor = _this.$el.querySelector('#myVideoSource')
                    document.body.scrollTop = anchor.offsetTop
                    document.documentElement.scrollTop = anchor.offsetTop
                    _this.sensitive=[]

                  })
                  .catch(() => {});
              } else {
                _this.publishLoading = false;
                _this.$message({
                  message: data.message,
                  type: "error"
                });
              }
            }
          });
        }
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
      console.log(this.fileList);
    },
    handleError(err, file, fileList) {
      this.limitUpload = false;
      this.publishLoading = false;
    },
    handleExceed(files, fileList) {
      if (this.form.videoInfo != "") {
        this.fileList = [];
      }
    },
    handleRemove(files, fileList) {
      if (fileList.length == 0) {
        this.form.videoInfo = "";
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确认移除${file.name}吗？`, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        showCancelButton: true,
        customClass: "applySuccessBox",
        cancelButtonClass: "cancelButtonClass",
        confirmButtonClass: "confirmButtonClass",
        showClose: false,
        center: true
      });
    },
    handleBefore(file) {
      let isTrue = false;
      const isLt200M = file.size / 1024 / 1024 < 200;
      if (!isLt200M) {
        this.$message.error("上传视频大小不能超过 200MB!");
        isTrue = false;
      } else {
        isTrue = true;
      }
      return true;
    },
    handleSuccess(response, file, fileList) {
      if (response.code === "10000") {
        this.form.videoInfo = response.responseBody[0].filePath;
        this.form.videoFilename = file.name;
        this.limitUpload = false;
        this.publishLoading = false;
        this.$refs["form"].validateField("videoInfo", videoInfo => {
          if (videoInfo == "") {
          } else {
            return false;
          }
        });
      } else {
        this.fileList = [];
        this.ruleForm.videoInfo = "";
        this.limitUpload = false;
        this.publishLoading = false;
        this.$message({
          type: "error",
          message: response.message
        });
      }
    },
    //      发布按钮
    releaseNow() {
      this.dialogRelease = true;
    },
    //      预览按钮
    preview() {
      if(this.form.videoType === '1') {
        let url = ""
        if(this.form.videoInfo == ''){
            url = '';
        }else if(this.form.videoInfo != '' && this.form.videoInfo.indexOf('oss') != '-1'){
            url = this.form.videoInfo

        }else{
            url =this.videourl + this.form.videoInfo;
        }
        localStorage.setItem('videoFilename',this.form.videoFilename)
        localStorage.setItem('videoUrl',url)
      }else {

        localStorage.setItem('videoFilename','')
        let videoUrl = ""
        if(this.form.videoInfo2.indexOf('https') === -1) {
              videoUrl =this.form.videoInfo2.replace(/http/,'https')
            }else {
              videoUrl = this.form.videoInfo2;
              //videoUrl =this.form.videoInfo2.replace(/http/,'https')
          }
        localStorage.setItem('videoUrl',videoUrl)
      }

      window.open('/author/#/videoPreview')
    },
    //      草稿按钮
    draft() {
      const that = this;
      this.$alert("是否要保存您已填写的内容?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "保存",
        showCancelButton: true,
        customClass: "applySuccessBox",
        cancelButtonClass: "cancelButtonClass",
        confirmButtonClass: "confirmButtonClass",
        showClose: false,
        center: true
      })
        .then(() => {
          that.draftLoading = true;
          that.draftPublish();

        })
        .catch(() => {});
    },
    draftPublish() {
      const that = this;
      let n = 0;
      let arr = [];
      for (var i in this.tag) {
        if (this.tag[i].value == "") {
          n += 1;
        } else {
          arr.push(this.tag[i].value);
        }
      }
      this.tagStr = arr.join(",");
      let videoUrl = "";
      let videoFilename = "";
      //判断是否是本地上传的视频
      if (this.form.videoType === "1") {
          if(this.form.videoInfo == ''){
            videoUrl = '';
          }else if(this.form.videoInfo != '' && this.form.videoInfo.indexOf('oss') != '-1'){
            videoUrl = this.form.videoInfo
          }else{
            videoUrl =this.videourl + this.form.videoInfo;
          }
        videoFilename = this.form.videoFilename;
      } else {
        if(this.form.videoInfo2.indexOf('https') === -1) {
               videoUrl =this.form.videoInfo2.replace(/http/,'https')
        }else {
            videoUrl = this.form.videoInfo2;

        }

        videoFilename = "";
      }

      let data = {
        articleId:this.articleId,
        articleTitle: this.form.title,
        articleImage: this.form.listCoverImgPost,
        publishKind: "2",
        articleDescription: this.form.textarea,
        articleTagnames: this.tagStr,
        articleType: this.form.articleType,
        bonusStatus: this.form.award,
        publishStatus: 4,
        videoFilename: videoFilename,
        videoUrl: videoUrl
      };
      if (this.form.articleType == 2) {
        data.articleLink = this.form.articleLink;
        data.articleSource = this.form.articleSource;
      }
      that.draftLoading = true;
      this.ajax({
        url: "/release/addArticle",
        data,
        success(data) {
          if (data.code === "10000") {
            that.draftLoading = false;
            that.$message({
              showClose: true,
              message: "草稿保存成功",
              type: "success"
            });
            setTimeout(() => {
              localStorage.setItem('kg_author_contentMange','video')
              that.isPublish = false
              that.$router.push("/contentManage");
            }, 50);
          }else {
            that.draftLoading = false;
            that.$message({
              type:'error',
              message:data.message
            })
          }
        }
      });
    },
    //裁剪封面图
    tailorCreate(data) {
      const that = this;
      var docobj = document.getElementById("uploadInput1");
      docobj.setAttribute('type','file');
      let formData = new FormData();
      formData.append("name", "file");
      formData.append("file", data);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.cropLoading = true;
      axios
        .post(that.uploadUrl, formData, config,{'timeout':30000})
        .then(function(res) {
          that.busying = null;
          res = res.data;
          if (res.code === "10000") {
            that.form.listCoverImgShow =
              that.imgUrl + res.responseBody[0].filePath;
            that.form.listCoverImgPost = res.responseBody[0].filePath;
            that.cropLoading = false;
            that.close(); //关闭模态框
            // that.tailorVisible = false;
            that.editorShow = true;
            that.vIf = false;
            that.checkedImg = null;
          }
        })
        .catch(function(error) {
          that.loading = false;
          alert(error);
        });
    },
    chooseCover(index, e) {
      this.isActive = index; //当前选中的封面图
      var _this = e.target.src;
      const that = this;
      function getBase64(img) {
        //传入图片路径，返回base64
        function getBase64Image(img, width, height) {
          //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
          var canvas = document.createElement("canvas");
          canvas.width = width ? width : img.width;
          canvas.height = height ? height : img.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var dataURL = canvas.toDataURL();
          return dataURL;
        }
        var image = new Image();
        image.crossOrigin = "";
        image.src = img;
        var deferred = JQ.Deferred();
        if (img) {
          image.onload = function() {
            deferred.resolve(getBase64Image(image)); //将base64传给done上传处理
          };
          return deferred.promise(); //问题要让onload完成后再return sessionStorage['imgTest']
        }
      }
      function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
          type: mime
        });
      }
      getBase64(_this).then(
        function(base64) {
          let formData = new FormData();
          formData.append("name", "file");
          formData.append("file", dataURLtoBlob(base64));
          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          that.imgloading =true;
          axios
            .post(that.uploadUrl, formData, config)
            .then(function(res) {
              that.busying = null;
              res = res.data;
              if (res.code === "10000") {
                that.imgloading = false;
                that.form.listCoverImgShow =
                  that.imgUrl + res.responseBody[0].filePath;
                that.form.listCoverImgPost = res.responseBody[0].filePath;
                // that.vIf = false;
                that.checkedImg = null;
              }else {
                that.imgloading =false;
                that.$message({
                  type:'error',
                  message:data.message
                })
              }
            })
            .catch(function(error) {});
        },
        function(err) {}
      );
    },
    showDialog(e, element) {
      const that = this;
      var fileList = e.target.files[0];
      //现在图片文件大小
      var imgSize = fileList.size;
      const type = fileList.type;
      if (
        imgSize > 2 * 1024 * 1024 ||
        (type != "image/png" && type != "image/jpeg")
      ) {
        this.$message({
          type: "warning",
          message: "封面图不超过2M，仅支持jpg、png、jpeg格式"
        });
        var jqObj = JQ(element);
        jqObj.val("");
        var domObj = jqObj[0];
        domObj.outerHTML = domObj.outerHTML;
        var newJqObj = jqObj.clone();
        jqObj.before(newJqObj);
        jqObj.remove();
        JQ(element)
          .unbind()
          .change(function(e) {
            //alert("ab");
            that.showDialog(e, element);
          });
        return;
      }
      //将图片文件转换为base64
      // var coverImg = this.coverImg
      var reader = new FileReader();
      reader.onload = function(e) {
        that.checkedImg = reader.result;
        var img = new Image();
        img.src = reader.result;
        img.onload = function(argument) {
          that.imgWidth = this.width;
          that.imgHeight = this.height;
          if (that.imgWidth < 750) {
            that.$message({
              type: "warning",
              message: "上传封面图最小尺寸750*422px"
            });
          } else if (that.imgHeight < 422) {
            that.$message({
              type: "warning",
              message: "上传封面图最小尺寸750*422px"
            });
          } else {
            //延迟加载，先渲染dom

            setTimeout(() => {
              var docobj = document.getElementById("uploadInput1");
              that.showBlockMask = true; //打开模态框
              docobj.setAttribute('type','text');
            }, 50);
          }
        };
      };
      reader.readAsDataURL(fileList);
    },
    close() {
      this.cropLoading=false

      // 关闭封面图裁剪框
      var docobj = document.getElementById("uploadInput1");
      docobj.setAttribute('type','file');
      this.showBlockMask = false;
    }
  }
};
</script>
<style lang="less" scoped>
.border {
  border: 1px solid red;
}
.publishVideo {
  padding: 50px 36px 36px 36px;
  background: rgba(255, 255, 255, 1);
  border-radius: 10px;
  box-shadow: 0px 20px 10px rgba(183, 182, 182, 0.1);
  border: 1px solid #ebebeb;
  .tag-tips {
    font-size: 12px;
    font-family: "PingFangSC";
    color: rgba(155, 155, 155, 1);
  }
  .tagInput {
    width: 104px;
    height: 26px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    margin-right: 15px;
  }
  .videoUrl {
    height: 106px;
    a {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(35, 130, 234, 1);
    }
  }
  .title {
    font-family: MicrosoftYaHei;
    color: #333333;
    .num {
      color: #333333 !important;
    }
  }
  .tipsTag {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(155, 155, 155, 1);
  }
  .videoType {
    position: relative;
    .el-upload__tip {
      position: absolute;
      top: -4px;
      left: 131px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(155, 155, 155, 1);
    }
    button {
      width: 120px;
      height: 36px;
      background: rgba(35, 130, 234, 1);
      border-radius: 4px;
      &:hover {
        background: rgba(35, 130, 234, 0.7);
      }
    }
  }
  .uploadCoverImg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 250px;
    height: 140px;
    filter: alpha(opacity=0);
    -moz-opacity: 0;
    -khtml-opacity: 0;
    opacity: 0;
    z-index: 100;
    cursor: pointer;
    &:hover {
      background: rgba(35, 130, 234, 0.7);
    }
  }
  .imgtips {
    color: #9b9b9b;
  }
  .articleImg {
    height: 140px;
    .img {
      width: 250px;
      height: 140px;
      position: absolute;
      // border: 1px solid #ebebeb;
      img {
        width: 250px;
        height: 140px;
        border: 1px solid #ebebeb;
      }
    }
    button {
      position: absolute;
      top: 150px;
      left: 0px;
      width: 250px;
      height: 32px;
      background: #2382ea;
      font-size: 14px;
      color: #fff;
      text-align: center;
      border-radius: 0 !important;
      border: 0;
      padding: 0;
      &:hover {
        background: rgba(35, 130, 234, 0.7);
      }
    }
  }
  .chooseCover {
    display: flex;
    div {
      margin-right: 16px;
      cursor: pointer;
      position: relative;
      img {
        width: 250px;
        height: 140px;
      }
      .active {
        border: 2px solid #2382ea;
        z-index: 5;
      }
      span {
        position: absolute;
        top: -7px;
        right: -5px;
        z-index: 100;
        background: #2382ea;
        width:23px;
        height:23px;
        border-radius: 50%;
        line-height: 24px;
        text-align: center;
        i {
          color:#fff;
           font-size: 18px;
        }
      }
    }
  }
  .bgcolor {
    height: 74px;
    background: rgba(245, 245, 245, 1);
    border: 1px solid #ebebeb;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 1);
  }
  .red-text {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(252, 90, 93, 1);
  }
  .img {
    overflow: hidden;
    .imgcom {
      width: 120px;
      height: 80px;
      border: 1px solid rebeccapurple;
    }
    .tips {
      margin-top: 18px;
      font-size: 14px;
      font-family: PingFangSC;
      color: rgba(155, 155, 155, 1);
    }
    .up {
      width: 120px;
      font-size: 14px;
      margin-top: 8px;
    }
    .inline {
      display: inline-block;
    }
  }
  .instructions {
    div {
      line-height: 25px !important;
      margin-top: 10px;
      margin-left: 13px;
      margin-right: 13px;
    }
  }
  .line {
    height: 1px;
    border-bottom: 1px solid #ebebeb;
  }
  .btn-boss {
    .btn-boss-bottom{
      padding-top: 36px;
      overflow: hidden;
      .btn {
        width: 120px;
        height: 40px;
        border-radius: 4px;
        &:nth-child(1) {
          background: #2382ea;
          &:hover {
            background: rgba(35, 130, 234, 0.7);
          }
        }
        &:nth-child(2) {
          border: 1px solid #2382ea;
          color: #2382ea;
        }
        &:nth-child(3) {
          border: 1px solid #2382ea;
          color: #2382ea;
        }
      }
      .save {
        float: right;
      }
    }
    .btn-boss-default{
      display: block;
      width: 100%;
      height: 90px;
      position: fixed;
      padding: 25px 0;
      z-index: 33;
      background-color: rgba(255,255,255,0.9);
      box-shadow:1px 0px 10px rgba(0,0,0,0.05);
      bottom: 0px;
      left: 0px;
      .btn-ddiv{
        width: 1200px;
        margin: 0 auto;
        padding-left: 194px;
        position: relative;
      }
      .btn-boss-default-center{
        width: 886px;
        /*height: 90px;*/
        /*margin: 0 auto;*/
        margin-left: 41px;
        overflow: hidden;
        .btn {
          width: 120px;
          height: 40px;
          border-radius: 4px;
          &:nth-child(1) {
            background: #2382ea;
            &:hover {
              background: rgba(35, 130, 234, 0.7);
            }
          }
          &:nth-child(2) {
            border: 1px solid #2382ea;
            color: #2382ea;
          }
          &:nth-child(3) {
            border: 1px solid #2382ea;
            color: #2382ea;
          }
        }
        .save{
          float: right;
        }
      }
    }
  }
}
.mask-title {
  font-size: 20px;
  font-family: MicrosoftYaHei;
  color: rgba(51, 51, 51, 1);
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e1e0e1;
}
.mask-block {
  margin: 30px 30px;
  max-height: 540px;
}
.mask-footer {
  text-align: center;
  margin-bottom: 30px;
  .el-button {
    width: 180px;
    background: #2382ea;
    color: #fff;
    &:hover {
      background: rgba(35, 130, 234, 0.7);
    }
  }
}
</style>
<style lang = "less">
.videotitle {
  .el-input__inner {
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background: #fff;
    border-left: 0;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(102, 102, 102, 1);
  }
}
.area {
  textarea {
    height: 100px;
    background: rgba(255, 255, 255, 1);
  }

}
.applySuccessBox {
  .el-message-box__header {
    border-bottom: 1px solid #e1e0e1;
    padding-top: 20px;
    .el-message-box__title {
      font-size: 18px;
      font-family: "微软雅黑";
      color: rgba(51, 51, 51, 1);
      padding-bottom: 10px;
    }
  }
  .el-message-box__message {
    margin: 30px 0;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: rgba(102, 102, 102, 1);
  }
  .el-message-box__btns button {
    font-family: MicrosoftYaHei;
    border-radius: 4px;
    font-size: 14px;
  }
  .confirmButtonClass {
    width: 120px;
    height: 40px;
    background: rgba(35, 130, 234, 1);
    color: #fff;
  }
  .cancelButtonClass {
    width: 120px;
    height: 40px;
    background: rgba(255, 255, 255, 1);
    color: rgba(51, 51, 51, 1);
  }
}
</style>

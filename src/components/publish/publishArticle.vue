/**
*  @description： 作者端发布文章
*  @author： 杨玉梅
*  @data:  2018.5.30
*/
<template>
  <div>
    <Bread :name = "name"></Bread>
    <div class="publishArticle">
      <el-row>
        <el-col :span="24">
          <el-form ref="form" :model="form" class="articleForm" :rules="rules">
            <el-form-item prop="title" id="myTitle">
              <el-input v-model="form.title"  placeholder="请在这里输入文章标题" class="title"  @blur = "autoSave"></el-input>
            </el-form-item>
            <div class="quill-editor-example" id="myText">
              <QuillEditor
                :onEditorChange = "onEditorChange"
                :onEditorBlur = "onEditorBlur"
                :content = "content"
                :changeContent = "changeContent"
              ></QuillEditor>
              <span class="error" v-if="this.empty">正文不能为空</span>
              <span class="error" v-if="this.noempty">正文字数不少于100字</span>
            </div>
            <p style="color: #606266;padding-bottom: 22px">温馨提示：由于本站规范，您文内所含超链接将被自动去除，请知悉。如有广告等其他需求，请联系微信客服qiankecaijing。</p>

            <el-form-item class = 'marginTop' label="Tag标签：" prop = 'tag' label-width="102px" id="myTag">
              <el-input v-for = "(item,key) in tag" :key = "key" size = 'small' class = 'tagInput' v-model="item.value" placeholder = '' @change = "autoSave">
              </el-input>
              <span class="tipsTag">至少3个tag, 每个tag2-8个汉字</span>
            </el-form-item>
            <el-form-item label="文章摘要：" prop = 'textarea' label-width="102px" id="myArticle">
              <el-input
                size = "small"
                type="textarea"
                placeholder="请输入文章摘要"
                v-model="form.textarea"
                class= "textarea"
                @change = "autoSave"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="封面图：" prop="listCoverImgPost" label-width="102px">
              <div class="articleImg">
                <div class="img"
                     v-loading="imgloading"

                >
                  <input  id = 'uploadInput1' class = 'uploadCoverImg' type = 'file' name="coverImg" accept="image/jpeg,image/png" multiple="multiple"
                          @change = "showDialog($event,'#uploadInput1')"
                  />
                  <img  v-if = "form.listCoverImgPost == null " class = ' listCoverImg' src = "https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/author/img/articleDefaut_up.png" />
                  <img v-else class = 'listCoverShow' :src = "form.listCoverImgShow"  />
                </div>
               <!-- <input  id = 'uploadInput1' class = 'uploadCoverImg' type = 'file' name="coverImg" accept="image/jpeg,image/png" multiple="multiple"
                        @change = "showDialog($event,'#uploadInput1')"
                />-->
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
              <el-radio-group v-model="form.articleType" @change = "autoSave">
                <el-radio label="1">原创</el-radio>
                <el-radio label="2">转载</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-if = "form.articleType === '' ? false : true">
              <el-form-item id="myArticleSource"  v-if = "form.articleType == 1 ? false : true" label="文章来源：" prop = "articleSource" label-width="102px">
                <el-input size = 'small' v-model="form.articleSource" placeholder = '请输入文章来源网站名称，如**网' @change = "autoSave"></el-input>
              </el-form-item>
              <el-form-item  v-if = "form.articleType == 1 ? false : true" label="原文地址：" prop = "articleLink" label-width="102px">
                <el-input size = 'small' v-model="form.articleLink" placeholder = '请输入文章来源地址' @change = "autoSave"></el-input>
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
            <!-- <el-form-item label="文章打赏：" label-width="102px" prop="award" >
              <el-radio-group v-model="form.award" @change = "autoSave">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">不开启</el-radio>
              </el-radio-group>
              <div>
                <p class="red-text">注：开启打赏后，可在文章详情页展示打赏入口，其他用户可以向您打赏一定额度的钛值; 不开启打赏，则文章详情页无打赏入口</p>
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
      <!--和规的发布-->
      <el-dialog
        :visible.sync="dialogRelease"
        width="30%"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <span>您的文章已成功发布，通过审核后，即可展示出来，请耐心等待！</span>
        <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogRelease=false">我知道了</el-button>
    </span>
      </el-dialog>
      <!--不和规的发布-->
      <el-dialog
        :visible.sync="dialogReleaseErro"
        width="30%"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <span>检测到该文章标题、正文、简介、tag标签中包含15个敏感词，请修改后再发布</span>
        <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogReleaseErro=false">确定</el-button>
    </span>
      </el-dialog>
      <!-- 封面图裁剪 -->
      <Dialog v-if="showBlockMask" @close="close" :width="width" >
        <div class="mask-title">上传封面</div>
        <div class="mask-block">
          <VueCorrope :src="checkedImg" v-on:closeModal="close()"  :type="article" v-on:onResultChange="onResult" :imgWidth="imgWidth" :imgHeight="imgHeight" v-on:tailor="tailorCreate" :cropLoading="cropLoading"></VueCorrope>
        </div>
      </Dialog>
    </div>
  </div>
</template>
<script>
import C from "./../../assets/js/config.js";
import axios from "axios";
import JQ from "jquery";
import vueCropper from "vue-cropper";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import QuillEditor from "@/components/common/QuillEditor";
import Bread from "../common/Bread";
import Dialog from "../common/Dialog";
import Verification from "@/assets/js/util/verification";
import article1 from "@/assets/img/article1.png";
import article2 from "@/assets/img/article2.png";
import article3 from "@/assets/img/article3.png";
import VueCorrope from "../common/VueCorrope";
import { MessageBox } from 'element-ui';
export default {
  components: { QuillEditor, Bread, Dialog, vueCropper, VueCorrope, },
  data() {
    //验证标题
    var validateTitle = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("文章标题不能为空"));
      } else if (value != "" && typeof this.sensitive === "string") {
        const sensitive = this.sensitive.split(",");
        for (var i in sensitive) {
          if (value.indexOf(sensitive[i]) != "-1") {
            callback(new Error("文章标题检测到敏感词：" + this.sensitive));
          } else {
            callback();
          }
        }
      } else if (value != "" && (value.length > 64 || value.length < 1)) {
        callback(new Error("文章标题长度在 1 到 64 个字符"));
      } else {
        callback();
      }
    };

    //验证TAG
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
              callback(new Error("文章标签检测到敏感词：" + this.sensitive));
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

    //请选择封面图
    var validateCoverImg = (rule, value, callback) => {
      if (this.form.listCoverImgPost == null) {
        callback(new Error("请选择封面图片"));
      } else {
        callback();
      }
    };
    //验证摘要
    let validateTextarea = (rule, value, callback) => {
      if (value != "" && (value.length > 100 || value.length < 10)) {
        callback(new Error("请输入10-100个字作为摘要"));
      } else if (value != "" && typeof this.sensitive === "string") {
        const sensitive = this.sensitive.split(",");
        for (var i in sensitive) {
          if (value.indexOf(sensitive[i]) != "-1") {
            callback(new Error("文章摘要检测到敏感词：" + this.sensitive));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    //验证文章链接
    let validateSource = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入文章来源"));
      } else if (value != "" && (value.length > 500 || value.length < 1)) {
        callback(new Error("请输入1-500字的文章来源"));
      } else if (value != "" && typeof this.sensitive === "string") {
        const sensitive = this.sensitive.split(",");
        for (var i in sensitive) {
          if (value.indexOf(sensitive[i]) != "-1") {

            callback(new Error("文章来源检测到敏感词：" + this.sensitive));
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    };
    return {
      sensitive: null, //敏感词检测
      showBlockMask: false, // 是否显示封面图弹窗
      width: "950px",
      name: "发布文章", //顶部
      form: {
        title: "",
        text: "",
        tag: "",
        category: "",
        from: "",
        url: "",
        award: "0",
        textarea: "",
        articleType: "",
        articleSource: "",
        articleLink: "",
        listCoverImgPost: null,
        listCoverImgShow: "",
        limitLength: 0
      },
      tag: [
        { id: "1", value: "" },
        { id: "2", value: "" },
        { id: "3", value: "" },
        { id: "4", value: "" },
        { id: "5", value: "" }
      ],
      tagStr: "",
      dialogRelease: false, // 发布成功莫泰
      dialogReleaseErro: false, // 发布失败莫泰
      d: false, // 发布莫泰
      imgloading:false, //上传默认图
      uploadUrl: C.uploadImgUrlHost,
      imgUrl: C.imgHost,
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
      isActive: "-1", //选中的图片
      checkedImg: "", //封面图
      previews: "",
      crap: false,
      vIf: false,
      content: "",
      article:'article',
      editorContentHtml: "",
      editorContentText: "",
      publishLoading: false,
      draftLoading: false,
      articleId: null,
      blobData: null,
      option: {
        size: 1,
        outputType: "png",
        full: true,
        autoCrop: true,
        autoCropWidth: 356,
        autoCropHeight: 200,
        fixedNumber: [16, 9]
      },
      imgWidth: 0,
      imgHeight: 0,
      cropLoading: false,
      isPublish:true,
      empty:false,
      noempty:false,
      rules: {
        title: [
          { required: true, validator: validateTitle, trigger: "blur" }
        ],
        tag: [{ required: true, validator: validateTag, trigger: "change" }],
        textarea: [{ validator: validateTextarea, trigger: "change" }],
        articleSource: [
          { required: true, validator: validateSource, trigger: "change" }
        ],
        articleLink: [
          { required: true, message: "请输入原文链接", trigger: "change" },
          {
            min: 1,
            max: 500,
            message: "长度不能超过500个字符",
            trigger: "blur"
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
        ]
      },
      winUrl:""
    };
  },
  created() {
    const that = this;
    // window.addEventListener("popstate",that.pushHistory);
    // history.pushState(null, null, that.winUrl);

    // window.onbeforeunload = function(){
    //     return "您的文章尚未保存，确定要离开吗";
    // }
  },
  // 组件内导航钩子，处理未保存退出的情况
  beforeRouteLeave: function(to, from , next){
    if(this.isPublish){
      if(!this.form.title&&!this.form.text&&!this.form.tag&&!this.form.url&&!this.form.award&&
        !this.form.textarea&&!this.form.articleType&&!this.form.articleSource&&!this.form.articleLink
        &&!this.form.listCoverImgPost&&!this.form.listCoverImgShow&&!this.editorContentText) {
        next()
      }else {
        next(false)
        var bool =  window.confirm("有内容正在编辑，是否退出当前编辑?");
        if(bool) {
          next()

        }else{
          next(false)
        }
        // MessageBox.confirm('有内容正在编辑，是否退出当前编辑?', '提示', {
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
        // }).catch(() => {
        //   next(false)
        // })
      }
    }else {
      next()
    }
  },
  mounted() {
    window.addEventListener("scroll",this.handleFun)
    JQ(".ql-blank").attr("data-placeholder", "在这里输入正文内容..."); //修改编辑器的placeholder
    //监听浏览器关闭
    // window.addEventListener("popstate",this.pushHistory);
  },
  beforeDestroy(){
    window.removeEventListener("scroll",this.handleFun)
  },
  methods: {
    handleFun(){
      let scorll = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
      let seltHigth=JQ("#myTag").offset().top;
      seltHigth=seltHigth-242;
      if(scorll<seltHigth){
        JQ(".btn-boss-default").css("display" ,'block');
      }else {
        JQ(".btn-boss-default").css("display" ,'none');
      }
    },
    pushHistory() {
      const _this = this;

      window.removeEventListener('popstate',_this.pushHistory);
    },
    //裁剪图片
    tailorCreate(data) {
      const that = this;
      var jqObj = document.getElementById('uploadInput1')
      jqObj.setAttribute('type','file');
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
          }else {
            that.cropLoading = false;
          }
        })
        .catch(function(error) {
          that.cropLoading = false;

          that.$message({
            type:'error',
            message:'上传图片失败'
          });
        });
    },
    //发布文章
    publish(form) {



      /* JQ('a').css({
       'color':'#666',
       'text-decoration':'none',
       'font-size':'16px',
       'cursor':'default',
       }
       )
       JQ('u').css({
       'color':'#666',
       'text-decoration':'none',
       'font-size':'16px',
       }
       )
       var ll=this.editorContentHtml.replace(/\bhref="([^"]*)" /g,'')
       var tt=ll.replace(/<a/g,"<span style='color:#666'")
       var bb=tt.replace(/a>/g,'span>')
       bb=bb.replace(/target="_blank"/g,'')
       //这里的bb打印出来就时对的，这个bb是传给后台的，富文本显示的还是原来的所以加上下面这句
       JQ(".ql-editor").html(bb);*/


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
          if(_this.form.limitLength===0){
            _this.empty=true
            return
          }
          if(_this.form.limitLength<100){
            _this.noempty=true
            return
          }
          let data = {
            articleTitle: _this.form.title,
            articleId: _this.articleId,
            articleImage: _this.form.listCoverImgPost,
            articleText: _this.editorContentHtml,
            publishKind: "1",
            articleDescription:
              _this.form.textarea == ""
                ? _this.editorContentText
                .substring(0, 100)
                .replace(/&nbsp;/gi, "")
                : _this.form.textarea.replace(/&nbsp;/gi, ""),
            articleTagnames: _this.tagStr,
            articleType: parseInt(_this.form.articleType),
            bonusStatus: parseInt(_this.form.award),
            textnum: _this.form.limitLength,
            publishStatus: 2
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

                localStorage.setItem("kg_author_contentMange", "article");
                _this
                  .$alert(
                    "您的文章已成功发布，通过审核后，即可展示出来,请耐心等待！",
                    "发布成功",
                    {
                      cancelButtonText: "取消",
                      confirmButtonText: "我知道了",
                      showCancelButton: false,
                      customClass: "applySuccessBox",
                      cancelButtonClass: "cancelButtonClass",
                      confirmButtonClass: "confirmButtonClass",
                      showClose: false,
                      center: true,
                      lockScroll: false
                    }
                  )
                  .then(() => {
                    localStorage.setItem('kg_author_contentMange','article')
                    _this.isPublish = false;
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
                  .$alert("检测到标题有敏感词，请修改后再发布", "提示", {
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
                    document.documentElement.scrollTop = anchor.offsetTop
                    document.body.scrollTop = anchor.offsetTop
                    _this.sensitive=[]
                  })
                  .catch(() => {});
              } else if (data.code === "29002") {
                let sensitive = [];
                _this.publishLoading = false;
                sensitive = data.message.split(",");
               // _this.sensitive = data.message.split(",");
                let articleText = localStorage.getItem("articleTextPreview");
                 var content = ""
                JQ.each(sensitive, function(i, e) {
                  if (articleText.indexOf(e) > 0) {
                    //若匹配到了铭感词使用高亮显示,这里使用的是红色显示
                    articleText = articleText.replace(
                      new RegExp(e, "gm"),
                      '<span style="background-color:#ffe614;" contenteditable="false">' +
                      e +
                      "</span>"
                    );
                    console.log(articleText)
                    JQ(".ql-editor").html(articleText);
                  }
                });
                _this
                  .$alert("检测到正文有敏感词，请修改后再发布", "提示", {
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
                    var anchor = _this.$el.querySelector('#myText')
                    document.body.scrollTop = anchor.offsetTop
                    document.documentElement.scrollTop = anchor.offsetTop
                    _this.sensitive=[]
                  })
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
                  .$alert("检测到TAG标签有敏感词，请修改后再发布", "提示", {
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
                    var anchor = _this.$el.querySelector('#myTag')
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
                  .$alert("检测到摘要有敏感词，请修改后再发布", "提示", {
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
                    var anchor = _this.$el.querySelector('#myArticle')
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
                  .$alert("检测到文章来源有敏感词，请修改后再发布", "提示", {
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
                    let anchor = _this.$el.querySelector('#myArticleSource')
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
    onEditorBlur() {
      this.autoSave();
    },
    onEditorChange(html, text) {

      JQ('a').css({
          'color':'#666',
          'text-decoration':'none',
          'font-size':'16px',
          'cursor':'default',
        }
      )
      JQ('u').css({
          'color':'#666',
//          'text-decoration':'none',
          'font-size':'16px',
        }
      )
        var ll=html.replace(/\bhref="([^"]*)" /g,'')
        var tt=ll.replace(/<a/g,"<span style='color:#666'")
        var bb=tt.replace(/a>/g,'span>')

        bb=bb.replace(/target="_blank"/g,'')
//这里的bb打印出来就时对的，这个bb是传给后台的，富文本显示的还是原来的所以加上下面这句
//      JQ(".ql-editor").html(bb);


//      this.editorContentHtml = bb;

      this.editorContentHtml = bb;
      localStorage.setItem("articleTextPreview", bb);
      this.editorContentText = text;
      let l = text.replace(/\s+/g, "");
      this.form.limitLength = l.length;
      if(l.length==0){
        this.empty=true
        this.noempty=false
      }else if(l.length<100&&l.length!=0){
        this.noempty=true
        this.empty=false
      }else {
        this.noempty=false
        this.empty=false
      }
    },
    changeContent(val) {
      this.editorContentHtml = val;
    },
    changeScale(item) {
      this.$refs.cropper.changeScale(item);
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    coverImgCancel() {
      this.dialogVisible = false;
      this.editorShow = true;
      this.checkedImg = null;
    },
    //发布按钮
    releaseNow() {
      this.dialogRelease = true;
    },
    //预览按钮
    preview() {
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
      localStorage.setItem('atricle_title',this.form.title);
      localStorage.setItem('atricle_text',this.editorContentHtml);
      localStorage.setItem('atricle_dec',this.form.textarea == ""? this.editorContentText.substring(0, 100).replace(/&nbsp;/gi, ""): this.form.textarea.replace(/&nbsp;/gi, ""),);
      localStorage.setItem('article_tags',this.tagStr);
      localStorage.setItem('article_type',this.form.articleType)
      if(this.form.articleType === '2') {
        localStorage.setItem('atricle_source',this.form.articleSource);
        localStorage.setItem('atricle_link',this.form.articleLink);
      }
      window.open('/author/#/articlePreview')
    },
    //草稿按钮
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
        center: true,
        lockScroll: false
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
      let data = {
        articleTitle: this.form.title,
        articleId: this.articleId,
        articleImage: this.form.listCoverImgPost,
        articleText: this.editorContentHtml,
        publishKind: "1",
        articleDescription:
          this.form.textarea == ""
            ? this.editorContentText.substring(0, 100).replace(/&nbsp;/gi, "")
            : this.form.textarea.replace(/&nbsp;/gi, ""),
        articleTagnames: this.tagStr,
        articleType: parseInt(this.form.articleType),
        bonusStatus: parseInt(this.form.award),
        textnum: this.form.limitLength,
        publishStatus: 4
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
            that.isPublish = false;
            localStorage.setItem('kg_author_contentMange','article')
            setTimeout(() => {
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
          that.imgloading = true;
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
                that.$message({
                  type:'error',
                  message:data.message
                })
                that.imgloading = false;
              }
            })
            .catch(function(error) {});
        },
        function(err) {}
      );
    },
    onResult(val) {
      this.checkedImg = val;
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

          if (that.imgWidth < 356) {
            that.$message({
              type: "warning",
              message: "上传封面图最小尺寸356*200px"
            });
          } else if (that.imgHeight < 200) {
            that.$message({
              type: "warning",
              message: "上传封面图最小尺寸356*200px"
            });
          } else {
            //延迟加载，先渲染dom
            setTimeout(() => {
              var docobj = document.getElementById("uploadInput1");
              that.showBlockMask = true; //打开模态框
              docobj.setAttribute('type','text');
              that.vIf = true;
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
    },
    //自动保存
    autoSave() {
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
      //文章自动保存
      let data = {
        articleTitle: this.form.title,
        articleId: this.articleId,
        articleImage: this.form.listCoverImgPost,
        articleText: this.editorContentHtml,
        publishKind: "1",
        articleDescription:
          this.form.textarea == ""
            ? this.editorContentText.substring(0, 100).replace(/&nbsp;/gi, "")
            : this.form.textarea.replace(/&nbsp;/gi, ""),
        articleTagnames: this.tagStr,
        articleType: this.form.articleType,
        bonusStatus: this.form.award,
        publishStatus: 4,
        textnum: this.form.limitLength
      };
      if (this.form.articleType === "2") {
        data.articleLink = this.form.articleLink;
        data.articleSource = this.form.articleSource;
      }
      this.ajax({
        url: "/release/addArticle",
        data,
        success(data) {
          if (data.code === "10000") {
            var articleId = data.responseBody;
            that.articleId = articleId;
          } else {
          }
        }
      });
    },
    handleAvatarSuccess1(res, file) {
      this.ruleForm.idcard1 = res.data[0].filePath;
      this.imageUrl.idcard1 = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      let isTrue = false;
      if (file.type === "image/jpeg" || file.type === "image/png") {
        isTrue = true;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isTrue) {
        this.$message.error("图片格式不对!");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return isTrue && isLt2M;
    },
    realTime(data) {
      this.previewsHandle();
    },
    previewsHandle() {
      const vm = this;
      this.$refs.cropper.getCropBlob(data => {
        vm.blobData = data;
      });
      this.$refs.cropper.getCropData(data => {
        this.previews = data;
      });
    },
    coverImgChang(e) {
      const vm = this;
      var fileList = e.target.files[0];
      //现在图片文件大小
      var imgSize = fileList.size;
      const type = fileList.type;

      //将图片文件转换为base64
      // var coverImg = this.coverImg
      var reader = new FileReader();
      if (
        imgSize > 2 * 1024 * 1024 ||
        (type != "image/png" && type != "image/jpeg")
      ) {
        this.$message({
          type: "warning",
          message: "封面图不超过2M，仅支持jpg、png、jpeg格式"
        });
        var jqObj = JQ("#uploadInput");
        jqObj.val("");
        var domObj = jqObj[0];
        domObj.outerHTML = domObj.outerHTML;
        var newJqObj = jqObj.clone();
        jqObj.before(newJqObj);
        jqObj.remove();
        JQ("#uploadInput")
          .unbind()
          .change(function(e) {
            //alert("ab");
            vm.coverImgChang(e);
          });
        return;
      }
      reader.onload = function(e) {
        vm.checkedImg = reader.result;
      };
      reader.readAsDataURL(fileList);
      // this.$refs.cropper.reload()
      this.vIf = true;
    }
  }
};
</script>
<style lang="less" scoped>
  .border {
    border: 1px solid red;
  }
  .publishArticle {

    padding: 22px 36px 14px 36px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    margin-left: 5px;
    margin-right: 5px;
    box-shadow:-2px 0px 4px  rgba(183,182,182,0.1) ,2px 0px 4px  rgba(183,182,182,0.1) ,0px 2px 4px  rgba(183,182,182,0.1) ,0px -2px 4px  rgba(183,182,182,0.1)  ;
    .title {
      font-size: 24px;
      font-family: MicrosoftYaHei;
      color: #333333;
      border: none !important;
      .el-input__inner {
        border: 0 !important;
        transform: translateY(-2px);
      }
    }
    .quill-editor-example {
      position: relative;
      /*margin-top: 30px;*/
      .ql-editor {
        min-height: 200px !important;
      }
      .error{
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
      }
    }
    .tagInput {
      width: 104px;
      height: 26px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      margin-right: 15px;
    }
    .tipsTag {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: rgba(155, 155, 155, 1);
    }

    .instructions {
      height: 74px;
      border: 1px solid #ebebeb;

      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);
      div {
        line-height: 25px !important;
        margin-top: 10px;
        margin-left: 13px;
        margin-right: 13px;
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
    .bgcolor {
      background: rgba(245, 245, 245, 1);
    }
    .imgloading {
      font-size:16px;
    }
    .red-text {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #9b9b9b;
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
        font-family: MicrosoftYaHei;
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
      .uploadbtn {
        margin: 16px 0;
        .primay-btn {
          border: none;
          background: #2382ea;
          color: #fff;
          font-size: 14px;
          width: 120px;
          height: 28px;
        }
      }
      .uploadbtn input {
        opacity: 0;
        position: absolute;
        z-index: 2;
        width: 120px;
        height: 35px;
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
          width: 888px;
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
</style>
<style lang="less">
  .title .el-input__inner {
    border: 0;
    font-size: 24px;
    color: #333333;
    font-family: MicrosoftYaHei;
    transform: translateY(-2px);
    // border-bottom: 1px solid #ebebeb;
    /*margin-top: 30px;*/
    padding-left: 0 !important;
    &::-webkit-input-placeholder {
      color: #333 !important;
      font-family: MicrosoftYaHei !important;
    }
    .br {
      display: inline-block;
      width: 100%;
      height: 10px;
      color: #ebebeb;
    }
  }
  .textarea {
    textarea {
      height: 100px;
      background: rgba(255, 255, 255, 1);
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
  .wrapper {
    width: 500px;
    height: 300px;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 10px;
  }
  .preview {
    display: inline-block;
    width: 320px;
    height: 180px;
    background: rgba(0, 0, 0, 0.7);
    /*margin-top:20px;*/
    border: 1px solid #ccc;
  }
  .preview img {
    display: inline-block;
    width: 320px;
    height: 180px;
  }
  .uploadbtn {
    width: 280px;
    height: 38px;
    overflow: hidden;
    position: relative;
    display: inline-block;
    color: #fff;
  }
  .uploadbtn button {
    position: absolute;
    top: 0px;
    z-index: 1;
    border: 0px;
    background: #2382ea;
    width: 180px;
    height: 38px;
    color: #fff;
    border-radius: 4px;
  }
  .uploadbtn input {
    opacity: 0;
    position: absolute;
    z-index: 2;
    width: 280px;
    height: 38px;
  }
  .corpperBox {
    height: 400px;
  }
  .previewTips {
    text-align: center;
    font-size: 14px;
    margin: 20px 0;
  }
  .btns {
    width: 240px;
    display: inline-block;
    span {
      font-size: 40px;
      margin-right: 20px;
      &:first-child {
      }
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

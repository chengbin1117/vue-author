/**
*  @description： 视频预览页
*  @author： guokang
*  @data:  2018.6.14
*/
<template>
  <div class="mask">
       <section class="content">
           <video-player
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            class="video-player-box"
            customEventName="customstatechangedeventname"
            v-if = "videoFilename!=''">
            </video-player>
            <!-- 视频地址为iframe链接 -->
        <!-- <iframe v-else style = "width:960px;height:450px" frameborder="0" allowfullscreen="true" :src="videoData.videoUrl"></iframe> -->
        <div v-else>
            <div  v-html="videoUrl" class="ifram" v-if="showifa">
            </div>
            <div v-else class="ifram">
              <iframe style = "width:100%;height:450px" frameborder="0" allowfullscreen="true" :src="videoUrl"></iframe>
            </div>   
        </div>
       </section>
  </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
import C from '../../assets/js/config'
export default {
  name: "Bread",
  components: { videoPlayer },
  data() {
    return {
      playerOptions: {
        height: "540px",
        autoplay: false,
        muted: false,
        language: "zh-CN",
        preload: "auto",
        sources: [
          {
            type: "video/mp4",
            // mp4
            src: ""
          }
        ],
        notSupportedMessage: "此视频暂无法播放，请稍后再试"
      },
      videoUrl: "",
      videoFilename: "",
      showifa:false
    };
  },
  props: {
    name: {}
  },
  mounted() {

    var id = this.$route.query.id;

    if (id === undefined) {
      this.getDetiles();
    } else {
      this.getArtilce(id);
    }
  },
  methods: {
    getDetiles() {
        this.videoFilename = localStorage.getItem("videoFilename");
        this.videoUrl = localStorage.getItem("videoUrl");
        this.playerOptions.sources[0].src=localStorage.getItem("videoUrl");
        this.showifa = true
    },
    getArtilce(id) {
      let data = {
        articleId: id
      };
      const _this = this;
      this.ajax({
        url: "/release/getArticleContent",
        data,
        success(data) {
          if (data.code === "10000") {
            var res = data.responseBody.data;
            _this.videoFilename = res.videoFilename;
            _this.videoUrl = res.videoUrl;
            _this.playerOptions.sources[0].src=res.videoUrl
            if(res.videoUrl.indexOf('src') === -1) {
              
              _this.showifa = false
            }else {
              _this.showifa = true
            }
          console.log(_this.showifa)
          } else {
            _this.$message({
              type: "error",
              message: res.message
            });
          }
        },
        catch(error) {}
      });
    }
  }
};
</script>

<style lang="less" scoped>
.mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);
  .content {
    width: 960px;
    height: 540px;
    margin: 0 auto;
    padding-top: 150px;
    z-index: 100;
    video {
      display: inline-block;
      margin: a auto;
    }
  }
}
</style>
<style lang="less">
.video-js .vjs-big-play-button {
  left: 42% !important;
  top: 42% !important;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  line-height: 68px;
  background: rgba(35, 130, 234, 1);
  border: 0;
  font-size: 46px;
  &:hover {
    background: rgba(35, 130, 234, 0.7);
  }
}
.video-js {
  margin: 0 auto!important;
  text-align:center;
}
.ifram {
  iframe {
    width:100%!important;
    height:520px;
    border:0px;
  }
}
</style>

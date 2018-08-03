/**
*  @description： 作者端申请个人专栏资料填写组件
*  @author： zhangchenle
*  @data:  2018.6.2
*/
<template>
  <div class="personal">
    <Header></Header>
    <div class="main">
      <Steps :steps="steps"></Steps>
      <div class="box">
        <div class="title">专栏信息</div>
        <el-form ref="form" :model="form"  :rules="rules" label-width="115px" label-position="left">
          <el-form-item label="专栏名称："  class="name" prop="name" >
            <el-input @blur="checkName('form')" v-model="form.name" placeholder="2-15个字，支持中英文、数字，不包含特殊符号、空格，不区分大小写"></el-input>
          </el-form-item>
          <el-form-item label="专栏介绍："  class="introduce" prop="region" >
          <el-input @blur="checkregion('form')" v-model="form.region" type="textarea" :rows="4" placeholder="10-50个字，支持中英文、数字、符号、空格，不区分大小写"></el-input>
          </el-form-item>
          <el-form-item label="专栏头像：" prop="nickImg" class="nickImg">
            <div class="photo" >
              <div class="img">
                 <img v-if="imageUrl.avatar" :src="imgurl+form.nickImg" class="avatar">
                 <img v-else :src="defaultPhotoUrl" class="avatar">
              </div>
              <div class="tips">不超过2M, 支持jpg、png、jpeg等</div>
              <el-upload
                class="uploadperson"
                v-model="form.nickImg"
                :action= "uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                <el-button>上传</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="所在地区："   class="area" prop="select" >
            <v-distpicker
            :province="form.select.province"
            :city="form.select.city"
            :area="form.select.area"
            @selected = "selected"
            />
          </el-form-item>
          <div v-if = "!personalVisible">
                <div class="title" v-if="mediaVisible">
                    媒体信息
                </div>
                <div class="title" v-else>{{enterpriseVisible?'企业信息':'组织信息'}}</div>
                <el-form-item :label="enterpriseVisible ? '企业名称':'组织名称'" prop = "companyName">
                  <el-input v-model="form.companyName"  class="el-input"></el-input>
                </el-form-item>
                <el-form-item :label="enterpriseVisible ? '企业营业执照扫描件':'组织机构代码证'" prop = 'licensePic'>
                  <div class="photo" >
                     <div class="img">
                        <img v-if="form.licensePic" :src="imgurl+form.licensePicShow" class = 'idCard' >
                        <span v-else>{{enterpriseVisible?'上传企业营业执照':'上传组织机构代码证或营业执照'}}</span>
                      </div>
                    <div class="tips">不超过2M，支持jpg、png、jpeg等，确保营业执照清晰可见</div>
                    <el-upload
                      class="uploadperson"
                      v-model="form.licensePic"
                      :action= "uploadUrl"
                      :show-file-list="false"
                      :on-success="licensePicSuccess"
                      :before-upload="beforeAvatarUpload"
                      >
                      <el-button>上传</el-button>
                    </el-upload>
                  </div>

                </el-form-item>

          </div>
          <div class="title">管理者信息</div>
          <el-form-item :label="personalVisible ? '真实姓名：':'管理员姓名：'" prop='userName' >
            <el-input v-model="form.userName"  class="el-input" placeholder="2-20个字，请与身份证件中的姓名一致"></el-input>
          </el-form-item>
          <el-form-item :label=" personalVisible? '身份证号：':'身份证号：'" prop="ID">
            <el-input @blur="checkId('form')" v-model="form.ID"  class="el-input"></el-input>
          </el-form-item>
          <el-form-item :label="personalVisible ? '身份证扫描件：':'身份证扫描件：'" prop = 'cards' >
          <div class="cards">
            <div class="presonal">
              <div class="img">
                <img v-if="imageUrl.idcard1" :src="imgurl+form.idcard1" class="idCard">
                <span v-else>正面</span>
              </div>
              <el-upload
                class="uploadcard"
                :action= "uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
                :before-upload="beforeAvatarUpload"
                >
                <el-button>上传</el-button>
              </el-upload>
            </div>
            <div class="presonal2">
              <div class="img">
                <img v-if="imageUrl.idcard2" :src="imgurl+form.idcard2" class="idCard">
                <span v-else>反面</span>
              </div>
              <el-upload
                class="uploadcard"
                :action= "uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess2"
                :before-upload="beforeAvatarUpload"
                >
                <el-button>上传</el-button>
              </el-upload>
            </div>
            <div class="presonal3">
              <div class="img">
                <img v-if="imageUrl.idcard3" :src="imgurl+form.idcard3" class="idCard">
                <div v-else>
                  手持身份证正面半身照
                  </div>
              </div>
              <el-upload
                class="uploadcard"
                :show-file-list="false"
                :action= "uploadUrl"
                :on-success="handleAvatarSuccess3"
                :before-upload="beforeAvatarUpload"
                >
                <el-button>上传</el-button>
              </el-upload>
            </div>
          <div class="tips">
            超过2M，支持jpg、png、jpeg等必须包含身份证正反两面、 手持身份证照片及其日期，且证件中的信息清晰可见
          </div>
        </div>
        </el-form-item>
        <el-form-item label="其他资质" class="mobileCode">
            <div class="fileListBox">
              <!-- <div v-for = 'item in form.otherPic' class="fileList">

                <div class="natural">
                  <img :src="imgurl+item"/>
                </div>
              </div> -->
              <el-upload
                class="uploadother"
                list-type="picture-card"
                v-model="form.otherPic"
                :action="uploadUrl"
                :on-success="otherPicSuccess"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-exceed	="moreExceed"
                multiple
                :limit="5"
                >
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip el-input colorc5">最多5张，每张大小不超过2M，支持jpg、png、jpeg等，资料越多，审核通过越快</div>
              </el-upload>
            </div>
        </el-form-item>
        <div v-if="!personalVisible">
          <!-- 相关链接 -->
          <el-form-item label="相关链接：">
            <el-input v-model="form.relateLink" class="el-input"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="手机验证：" >
              <el-input   type="text"   v-model="atskMobile" :disabled = "true"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="checkNo">
          <el-input type="text" v-model="form.code" auto-complete="off" class="code" placeholder="验证码" style="width:198px">
          </el-input>
          <div v-if="showCountdown"  class="tips">{{time}}秒后重发</div>
          <div class="tips" @click="getCheckCode" v-else>
             验证码
          </div>
        </el-form-item>
        <el-form-item prop="resource" class="checkNo">
              <el-checkbox  v-model = "form.resource" name="type"  class="martop20 checkbox_el el-input"  >我同意并接受<a @click="showProtocolBox">千氪专栏申请协议</a></el-checkbox>
        </el-form-item>
        <el-form-item>
           <section class="btn-group">
            <div class="btn-prev" @click="prevStep">上一步</div>
            <div class="btn-commit" @click="commit('form')">提交</div>
          </section>
        </el-form-item>
        </el-form>
        <Dialog v-if="showBlockMask" @close="close" :width="widthBlock">
        <div class="mask-title">验证</div>
        <Block  class="mask-block1" @sendMsg="sendMsg" :ncBlock="ncBlock"></Block>
       </Dialog>
        <Dialog v-if="showProtocol" @close="closeProtocol" :width="width" >
        <div class="mask-title">千氪专栏申请协议</div>
         <div class="mask-block2">
          <p>欢迎您使用千氪财经软件及相关服务！</p>
           <h3>一、定义</h3>
          <p>
            1.1 您：指提交有效申请并注册后，在千氪平台登录、上传、发布、提供链接等以各种形式传播内容（包括文字、图片、音频、视频、图表、漫画等）的自然人、法人或其他组织。          </p>
          <p>
            1.2 千氪：是千氪网络公司出品的新型财经类门户网站和区块链SAAS服务平台。          </p>
          <p>
            1.3 千氪平台：是千氪网络公司借助区块链技术服务——千氪对自然人、法人或其他组织包括但不限于媒体及内容合作伙伴所开放的内容分发渠道。您注册千氪平台后可以通过千氪平台上传发布内容，向用户传播信息、与用户交流互动等。千氪网络公司是提供网络信息存储空间的网络服务提供者。          </p>
          <p>
            1.4 用户：指所有直接或间接使用千氪提供的相关服务的用户。
          </p>
           <h3>二、帐户注册和使用</h3>
          <p>
            2.1 在注册、使用和管理平台帐户时，请您使用真实、准确、合法、有效的相关身份证明材料及必要信息（包括您的姓名及电子邮件地址、联系电话、联系地址等），以便千氪网络公司在必要时与您联系，并注意及时更新。为使您更好地使用千氪平台的各项服务，请您按照相关法律规定及千氪平台要求完成实名认证。您应当对您提供的帐号资料的真实性、合法性、准确性和有效性独立承担责任。如因此给千氪网络公司或第三方造成损害的，您应当依法予以赔偿。
          </p>
          <p>
            2.2 为保障用户和公司利益，千氪网络公司有权核查您提交的相关材料（如自然人身份证复印件、企业法人营业执照副本复印件、事业单位法人证书复印件、公司官方声明/说明等）后再决定是否核准您的注册申请。若您提交的材料或填写的信息不完整或不准确，则您可能无法使用本服务或在使用过程中受到限制。
          </p>
          <p>
            2.3 您所设置的帐户名不得违反国家法律法规及千氪网络公司平台规则关于帐户名的管理规定，否则千氪网络公司可对您的帐户名进行暂停使用或注销等处理，并向主管机关报告。          </p>
          <p>
            2.4 您理解并承诺，您的帐户名称、头像和简介等注册信息中不得出现违法和不良信息，没有冒用、关联机构或社会名人，您在帐户注册过程中需遵守法律法规、社会主义制度、国家利益、公民合法权益、公共秩序、社会道德风尚和信息真实性等内容。
          </p>
          <p>
            2.5 您同意并授权，为了更好的为您提供服务以及确保您的帐户安全，千氪网络公司可以根据您提供的手机号码、身份证号码等信息，向全国公民身份号码查询服务中心、电信运营商、金融服务机构等可靠单位发起用户身份真实性、用户征信记录、用户手机号码有效性状态等情况的查询。
          </p>
           <p>
             2.6 千氪平台帐号的所有权归千氪网络公司所有，您注册申请通过后，您将拥有千氪平台帐号的使用权，可以登录并在千氪平台上制作、复制、发布、传播内容。平台帐号的所有权归千氪网络公司所有，公司有权因经营需要收回帐号。同时，禁止任何赠与、借用、租用、转让或售卖帐号等的行为。如您违反本协议内容，千氪网络公司有权对该帐户进行暂停使用、注销或停止提供服务等处理，且不承担任何法律责任，由此导致的包括并不限于您通讯中断、资料和内容等清空等损失由您自行承担。
           </p>
           <h3>三、用户个人信息保护</h3>
           <p>3.1 为了更好地为您提供服务和帮助、保护您的合法权益，请您保证申请服务时所提供的信息是真实、准确、合法、有效的，并注意及时更新，以免在使用过程中受到限制或无法使用。
           </p>
           <p>3.2 千氪网络公司将保护用户个人信息作为公司发展的最基本原则之一，未经您的同意，不会向其他任何公司、组织或个人披露您的个人信息，法律法规另有规定的除外。
           </p>
           <p>3.3 千氪网络公司邀请您和千氪网络公司共同努力，保护上亿用户的切身利益。请您在使用千氪平台的过程中，不要以搜集、复制、存储、传播等任何方式使用其他用户的个人信息，否则，由此产生的后果需您自行承担。
           </p>
           <h3>
             四、您的权利和义务
           </h3>
           <p>4.1 您需要对注册和使用时提交的信息及材料真实性、准确性、合法性、有效性负责，如因此引起的问题，由您承担全部法律责任。
           </p>
           <p>
             4.2 请您妥善保管您的帐户信息，并对此帐户下发生的一切活动承担全部法律责任。不向任何第三方透露帐户或密码信息，如出现或怀疑帐号和密码遭到他人使用，请尽快通知千氪网络公司，以免您的利益受到损失。
           </p>
           <p>4.3 请您保证对在千氪平台制作、复制、上传、发布、传播的任何内容享有合法权益，若您发布的内容发生权利纠纷或侵犯了任何第三方的合法权益，需您承担全部法律责任。</p>
           <p>4.4 请您遵守本协议的各项条款，并正确、适当地使用、运营、管理此平台账号，如您违反本协议中的任何条款，千氪网络公司有权在任何时候依据本协议中止或终止对您提供服务。</p>
           <p>4.5您的言行应遵守《计算机信息网络国际联网安全保护管理办法》、《互联网信息服务管理办法》、《互联网电子公告服务管理规定》、《维护互联网安全的决定》、《互联网新闻信息服务管理规定》等相关法律规定，您使用千氪平台过程中所制作、复制、上传、发布、传播的任何内容，包括但不限于帐户头像、名称、用户说明、注册信息及其他资料，或文字、语音、图片、视频、图文、图表、漫画等发送、回复消息、评论和相关链接页面，以及其他使用千氪帐户或千氪平台服务所产生的内容，不得包含如下法律、法规和政策禁止的内容：
             (1) 反对宪法所确定的基本原则的；
             (2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
             (3) 损害国家荣誉和利益的；
             (4) 煽动民族仇恨、民族歧视，破坏民族团结的；
             (5) 破坏国家宗教政策，宣扬邪教和封建迷信的；
             (6) 散布谣言，扰乱社会秩序，破坏社会稳定的；
             (7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
             (8) 侮辱或者诽谤他人，侵害他人合法权益的；
             (9) 含有法律、法规和政策禁止的其他内容的信息。
           </p>
           <p>4.6 为保证千氪的正常运营及用户的良好体验，请您不要利用千氪平台制作、复制、上传、发布、传播如下内容：
             (1) 含有任何性或性暗示以及任何其他低俗类信息；
             (2) 骚扰、垃圾广告；
             (3) 涉及他人隐私、个人信息或资料的任何信息；
             (4) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的任何信息；
             (5) 含有其他干扰千氪正常运营、侵犯其他用户或其他第三方合法权益内容的信息。
           </p>
           <p>4.7 为确保千氪网络公司和用户的利益，您请在使用本平台时，不要进行如下行为（该行为是指使用千氪帐户和千氪平台所进行的任何行为，包括但不限于注册登录、帐号运营、管理及推广以及其他行为）：
             (1) 提交、发布虚假信息，或冒充、利用他人名义进行相关活动；
             (2) 强制、诱导其他用户关注、点击链接页面或分享信息；
             (3) 虚构事实、隐瞒真相以误导、欺骗他人；
             (4) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利；
             (5) 未经千氪网络公司书面许可使用插件、外挂或其他第三方工具、服务接入本服务和相关系统；
             (6) 利用千氪平台及帐户从事违法犯罪活动；
             (7) 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播；
             (8) 其他违反法律法规规定、侵犯其他用户合法权益、干扰产品正常运营或未经千氪网络公司明示授权的行为。
           </p>
           <p>4.8 请您在任何情况下都不要私自使用千氪网络公司的包括但不限于“千氪网络”、“千氪”、“KG”、“KG.COM”和“kg.com”在内的任何商标、服务标记、商号、域名、网站名称或其他显著品牌特征等。未经千氪网络公司事先书面同意，您不得将本平台标识以任何方式展示、使用或申请注册商标、进行域名注册等，也不得实施向他人明示或暗示有权展示、使用、或其他有权处理本平台标识的行为。您由于非法使用本平台标识给本平台或他人造成损失的，由您承担相关法律责任。</p>
           <p>4.9 若您需对千氪平台内容创作衍生品或投放商业广告，请您另外提交书面授权申请，在符合条件且得到千氪网络公司同意下，您方可通过该平台进行广告或推广等商业活动。</p>
           <h3>五、千氪网络公司的权利和义务</h3>
           <p>5.1 为保障用户和公司的利益，千氪网络公司有权对您注册时提交的材料和信息进行审查，并有权要求您改正或补充相关材料，请您理解。如果您拒绝改正或补充相关材料，您可能无法使用本服务。千氪网络公司的审查不代表对您提交的材料和信息的真实性、准确性、真实性、合法性负责。您应当对该材料和信息独立承担责任，如因此给千氪网络公司或第三方造成损害的，您应当承担法律责任并予以赔偿。
           </p>
           <p>5.2 千氪网络公司为千氪平台及千氪平台的开发、运营提供技术支持，并对该平台的开发和运营等过程中产生的所有数据和信息等享有全部权利。</p>
           <p>5.3 如果您停止使用本服务或服务被终止或取消，千氪网络公司有权自主决定是否从服务器上永久地删除您的数据且无需向您返还任何数据。</p>
           <p>5.4 千氪网络公司保留随时变更、暂停、限制、终止或撤销千氪平台服务的权利。公司可通过网页公告、电子邮件、电话或信件传送等方式向您发出通知，通知在发送时即视为已送达收件人，届时公司无需向您承担任何责任。
           </p>
           <p>5.5 您充分理解并同意：本服务中可能包括千氪网络公司针对个人或企业推出的信息发布或品牌推广服务，您同意千氪网络公司有权在千氪平台显示平台和/或第三方供应商、合作伙伴的商业广告或商业信息。</p>
           <h3>六、知识产权</h3>
           <p>6.1 在本服务中，由您通过千氪平台上传、发布的任何内容的知识产权归属您或原始著作权人所有，以上内容您授权千氪网络公司使用并授权千氪网络公司有权以千氪网络公司自己的名义或委托专业第三方对侵犯以上内容著作权的行为进行维权，维权形式包括但不限于：监测侵权行为、发送维权函、提起诉讼或仲裁、调解、和解等任何方式，甲方可对维权事宜做出决策并独立实施。千氪网络公司在本服务中提供的内容（包括但不限于网页、文字、图片、音频、视频、图表等）的知识产权属于千氪网络公司所有。千氪网络公司提供本服务时所依托的软件的著作权、专利权及其他知识产权均归千氪网络公司所有。
           </p>
           <p>6.2 您应当是在注册资料中提交的网站的合法权利人。您充分的理解并同意，为提高您的网站内容曝光率，本协议的合作范围是您提交的网站的全部内容。除非您另有明确表示，您在注册时点击同意，即表明您同意授权千氪网络公司收录、链接您网站中的已有及将来的全部内容，并通过系统以您的注册帐户自动发布。如您对授权范围另有需求可以书面方式通知千氪网络公司并另行签订授权协议。
           </p>
           <p>
             6.3 您理解并且同意，为持续改善千氪网络公司为您提供的各项服务，您授予千氪网络公司及其关联方、合作方对您上传发布的任何内容具有全世界范围内的、永久的、不可撤销的、免费的、非独家的使用权。
           </p>
           <p>6.4 本服务所包含的内容的知识产权均受到法律保护，未经千氪网络公司、用户或相关权利人书面许可，任何人不得以任何形式进行使用或创造相关衍生作品。
           </p>
           <h3>七、隐私政策</h3>
           <p>7.1 您知悉并同意：个人隐私信息是指能够对您进行个人辨识或涉及个人通信的信息，包括您的真实姓名、身份证号、手机号码、银行账户、IP地址等。非个人隐私信息是指您对本服务的操作状态以及使用习惯等一些明确且客观反映在本平台服务器端的基本记录信息和其他一切个人隐私信息范围外的普通信息，以及您同意公开的上述隐私信息。
           </p>
           <p>7.2 因您使用平台不同服务内容时，为保证功能服务的完整体验，产品可能会收集到您的地理位置、读取您的通讯录、开启您使用工具的摄像头、话筒，如您不希望开启相关功能，可停止使用对应服务，千氪网络公司不会开启与您使用的服务无关的功能。
           </p>
           <p>7.3 本平台不对外公开或向第三方提供您的注册资料及用户在使用网络服务时存储在本网站的非公开内容，但下列情况除外：
             （1）事先获得您的明确授权；
             （2）根据有关的法律法规要求；
             （3）按照相关政府主管部门的要求；
             （4）该第三方同意承担与本平台同等的保护隐私的责任。
           </p>
           <p>7.4 在不透露您隐私资料的前提下，本平台有权对整个用户数据库进行分析并对用户数据库进行商业上的利用。</p>
           <p>7.5 为了运营和改善千氪平台的技术和服务，便于本平台向您及用户提供更好的体验和提高服务质量，千氪网络公司将可能会自行收集使用或向第三方提供您的非个人隐私信息。</p>
           <h3>八、法律责任</h3>
           <p>8.1 若您提交的注册信息和材料不真实、不完整、不合法或无效，那么导致或产生的一切法律责任由您承担。千氪网络公司有权随时封禁或删除您的平台帐号，以及中止或终止为您提供千氪平台的相关服务。
           </p>
           <p>8.2 您理解并认可，千氪平台为提供信息分享、传播及获取的平台，您在使用千氪平台时，请您自行对内容加以判断，并承担因使用内容而引起的所有风险。您须为自己注册帐户下的一切行为负责，包括您所发表内容的真实性、合法性、准确性、有效性，以及承担因账号使用、运营、管理行为产生的结果。您应对千氪平台中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容真实性、合法性、准确性、有效性的依赖而产生的风险。千氪网络公司无法且不会对因您的行为而导致的损失或损害承担责任。 如果您发现任何人违反本协议规定或以其他不当的方式使用千氪平台服务，请立即举报或投诉，千氪网络公司将依法进行处理。
           </p>
           <p>8.3 对违反有关法律法规或本协议规定的行为，千氪网络公司将依法律规定及上述规则等加以合理判断进行处理，对违法违规的任何人士采取适当的法律行动，并依据法律法规保存有关信息并向有关部门报告等。
           </p>
           <p>8.4 若您上传、发布的内容或其他在千氪平台上从事的行为侵害他人利益并引发第三方的任何索赔、要求或赔偿的，需由您承担全部法律责任。若因此给千氪网络公司或第三方造成任何损失，您应负责赔偿并使之免受损害，损失包括但不限于诉讼费用、律师费用、和解费用、罚款或生效法律文书中规定的损害赔偿金额及其他直接或间接支出费用。
           </p>
           <p>8.5 若千氪网络公司发现您不当使用本平台帐号或因您的帐号被他人举报投诉时，千氪网络公司有权不经通知随时删除相关内容，并视行为情节对违规帐号进行处理，处理方式包括但不限于警告、删除部分或全部订阅用户、限制或禁止使用全部或部分功能、帐号封禁甚至注销，并有权视具体情况而公告处理结果。
           </p>
           <p>8.6 因技术故障等不可抗事件影响到服务的正常运行的，本平台及其合作单位承诺在第一时间内与相关单位配合，及时处理进行修复，但您因第三方如电信部门的通讯线路故障、技术问题、网络、电脑故障、系统不稳定性及其他各种不可抗力原因而遭受的一切损失，本平台及其合作单位不承担责任。
           </p>
           <h3>九、其他约定</h3>
           <p>9.1 您使用本服务即视为您已阅读并同意受本协议的约束。</p>
           <p>9.2 必要时千氪网络公司会对本协议的部分内容进行修改。修改后，将在页面显著位置提示协议有更新，您应及时查看更新后的协议。如果您同意接受修改后的协议，您可以继续使用千氪平台；如果您不接受则应停止使用千氪平台服务。
           </p>
           <p>9.3 您和千氪网络公司均是独立的主体，在任何情况下本协议不构成双方之间的代理、合伙、合营或雇佣关系。</p>
           <p>9.4 本协议的成立、生效、履行、解释及纠纷解决，都适用于中华人民共和国的法律。本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。</p>
           <p>9.5 如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决。协商不成时，任何一方均应向千氪网络公司所在地有管辖权的人民法院提起诉讼。</p>
           <p>9.6 本协议签订地为中华人民共和国四川省成都市高新区。</p>
        </div>
      </Dialog>
        <!-- <OtherInfo :type="'personal'"></OtherInfo> -->
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/apply/Header";
import Steps from "@/components/apply/Steps";
import Footer from "@/components/home/Footer";
import Verification from "@/assets/js/util/verification";
import codeData from "@/assets/js/phone";
import VDistpicker from "v-distpicker";
import url from "@/assets/js/config";
import { mapGetters } from "vuex";
import Dialog from "@/components/common/Dialog";
import Block from "@/components/common/Block";
export default {
  name: "Personal",
  components: {
    Header,
    Steps,
    Footer,
    VDistpicker,
    Block,
    Dialog
  },
  data() {
    //验证专栏名字
    let validateColumnName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入专栏名称"));
      } else if (value != "" && !Verification.validateColumnName(value)) {
        callback(
          new Error(
            "请输入纯数字、纯字母、纯中文或者中英文数字的组合，长度2-15个字"
          )
        );
      } else if(value != "" && this.existName){
        callback(
          new Error(
            "这个专栏名称已经被使用，请换个名称吧"
          )

        );
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      } else if( value != "" && this.sensitiveName  != ''){
        callback(
          new Error(
            "检测到敏感词："+this.sensitiveName
          )
        );
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }else {
        callback();
      }
    };
    //验证地区
    let validateAddress = (rule, value, callback) => {
      if (this.form.select.province == "") {
        callback(new Error("请选择地区"));
      } else {
        callback();
      }
    };
    //验证真实名字
    let validateName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入真实姓名"));
      } else if (!Verification.validateRealName(value)) {
        callback(new Error("请输入2-20个字的真实姓名"));
      } else {
        callback();
      }
    };
    //验证身份证号
    let validateID = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入身份证号码"));
      } else if (!Verification.validateIdCard(value)) {
        callback(new Error("身份证号码输入不正确"));
      } else if(value != "" && this.existId){
        callback(
          new Error(
            "身份证号已存在"
          )
        );
        const wh = document.body.clientHeight/2;
        document.body.scrollTop = document.documentElement.scrollTop = wh;
      }else {
        callback();
      }
    };

    //勾选协议验证
    let validateAgree = (rule, value, callback) => {
      if (value == false) {
        callback(new Error("请勾选!"));
      } else {
        callback();
      }
    };

    //身份证图片验证
    let validateCards = (rule, value, callback) => {
      if (
        this.imageUrl.idcard1 == "" &&
        this.imageUrl.idcard2 == "" &&
        this.imageUrl.idcard3 == ""
      ) {
        callback(new Error("请上传三张有效身份证件"));
      } else if (this.imageUrl.idcard1 == "") {
        callback(new Error("请上传身份证正面扫描件"));
      } else if (this.imageUrl.idcard2 == "") {
        callback(new Error("请上传身份证背面扫描件"));
      } else if (this.imageUrl.idcard3 == "") {
        callback(new Error("请上传手持身份证扫描件"));
      } else {
        callback();
      }
    };

    //企业或者组织名称校验
    let validatecompanyName = (rule, value, callback) => {
      if (value == "") {
        callback(
          new Error(
            this.enterpriseVisible ? "请填写企业名称" : "请填写组织机构名称"
          )
        );
      } else if (value != "" && !Verification.validateCompanyName(value)) {
        callback(
          new Error(
            this.enterpriseVisible
              ? "请输入300字以内的企业名称，不能包含符号"
              : "请输入300字以内的组织机构名称，不能包含符号"
          )
        );
      } else {
        callback();
      }
    };
    let validateColumnRegion = (rule, value, callback) => {
      if (value == "") {
        callback(
          new Error(
            this.enterpriseVisible ? "请填写企业名称" : "请填写组织机构名称"
          )
        );
      } else if (value != "" && (value.length < 10 || value.length > 50)) {
        callback(
          new Error(
            '请输入10-50个字的专栏介绍'
          )
        );
      }  else if( value != "" && this.sensitiveRegion  != ''){
        callback(
          new Error(
            "检测到敏感词："+this.sensitiveRegion
          )
        );
      }else {
        callback();
      }
    };
    return {
      sensitiveRegion:'',//专栏介绍敏感词
      sensitiveName:'',//专栏名称敏感词
      existName:false, // 专栏名称判重
      existId:false, //身份证判重
      showProtocol: false, //协议弹窗
      width: "800px",
      widthBlock: "400px",
      time: 90, // 倒计时的时间
      showCountdown: false, // 显示倒计时
      showBlockMask: false, // 显示滑块蒙层
      userInfo: {},
      ncBlock: {
        platform: "3",
        session: "",
        sig: "",
        token: "",
        scene: ""
      },
      // 步骤
      steps: [
        {
          stepno: "1", // 步骤序号
          title: "注册账号", // 步骤标题
          active: true // 步骤是否激活（已进行）
        },
        {
          stepno: "2",
          title: "选择类型",
          active: true
        },
        {
          stepno: "3",
          title: "填写资料",
          active: true
        }
      ],
      imageUrl: {
        avatar: "",
        idcard1: "",
        idcard2: "",
        idcard3: "",
        idcard4: ""
      },
      avatar: "",
      form: {
        name: "",
        resource: false,
        region: "",
        select: {
          province: "",
          city: "",
          area: ""
        },
        nickImg: "",
        idcard1: "",
        idcard2: "",
        idcard3: "",
        idcard4: "",
        otherPic: [],
        nick_show: "",
        userName: "",
        ID: "",
        email: "",
        phone: "",
        code: "",
        licensePic: "",
        licensePicShow: "",
        select: {
          province: "",
          city: "",
          area: ""
        },
        //媒体
        companyName: "",
        media_img: "",
        relateLink: ""
      },
      rules: {
        name: [
          { required: true, validator: validateColumnName, trigger: "blur" }
        ],
        region: [
          { required: true, validator: validateColumnRegion, trigger: "blur" },
          // {
          //   min: 10,
          //   max: 50,
          //   message: "请输入10-50个字的专栏介绍",
          //   trigger: "change"
          // }
        ],
        select: [
          {
            required: true,
            validator: validateAddress,
            message: "请选择地区",
            trigger: "change"
          }
        ],
        userName: [
          { required: true, validator: validateName, trigger: "blur" }
        ],
        ID: [{ required: true, validator: validateID, trigger: "change" }],
        resource: [{ validator: validateAgree, trigger: "change" }],
        cards: [{ required: true, validator: validateCards, trigger: "change" }],
        //媒体
        companyName: [
          { required: true, message: "请填写组织/企业名称", trigger: "change" },
          { validator: validatecompanyName, trigger: "change" }
        ],
        licensePic: [
          { required: true, message: "请上传照片", trigger: "change" }
        ],
        nickImg: [
          { required: true, message: "请上传专栏头像", trigger: "change" }
        ],
        code: [
          { required: true, message: "请填写验证码", trigger: "blur" },
          { message: "请输入正确的验证码", trigger: "change" }
        ]
      },
      uploadUrl: url.uploadImgUrlHost,
      defaultPhotoUrl: url.defaultPhotoUrl,
      imgurl: url.imgHost,
      personalVisible: false,
      mediaVisible: false,
      enterpriseVisible: false,
      atskMobile: "",
      id: 0
    };
  },
  mounted() {
    this.id = this.$route.query.id; //携带的参数
    switch (this.id) {
      case "2":
        this.personalVisible = true;
        break;
      case "3":
        this.mediaVisible = true;
        break;
      case "4":
        this.enterpriseVisible = true;
        break;
      default:
    }
    //console.log(this.$store.state.userInfo)
    this.userInfo = this.$store.state.userInfo; //获取用户信息
    this.atskMobile = this.$store.state.userInfo.atskMobile; //获取用户信息带*号的手机
  },
  methods: {
    //身份证判重
    checkId(form){
      const that = this;
      let data  = {
        idcard:this.form.ID,
        roleId:this.id
      }
      this.ajax({
            url: "/column/checkIdcardInvalid",
            data,
            success(data) {
              if (data.code === "10000") {
                that.existId = data.responseBody ? false : true
               	that.$refs[form].validateField('ID', (ID) => {
                      if (ID == "") {
                      } else {
                            return false
                      }
                });
              } else {
                // 失败
                that.$message({
                  type: "error",
                  message: data.message
                });
              }
            }
      });
    },
    // 专栏介绍检测违禁词
    checkregion(form){
      const that = this;
      let data  = {plainTxt:this.form.region}
          //检测违禁词
          this.ajax({
            url: "/common/checkSensitiveWord",
            data:data,
            success(data) {
              if (data.code === "10000") {
                  if(data.responseBody != '' && data.responseBody != null){
                    that.sensitiveRegion = data.responseBody
                  }else{
                    that.sensitiveRegion = ''
                  }
                	that.$refs[form].validateField('region', (region) => {
                      if (region == "") {
                      } else {
                            return false
                      }
                    });
              } else {
                // 失败
                that.$message({
                  type: "error",
                  message: data.message
                });
              }
            }
          });
    },
    // 专栏名称判重、检测违禁词
    checkName(form){
      const that = this;
      let data1  = {columnName:this.form.name}
      let data2  = {plainTxt:this.form.name}
      // 专栏名称判重
          this.ajax({
                url: "/column/existsColumnName",
                data:data1,
                success(data) {
                  if (data.code === "10000") {
                      that.existName = data.responseBody ? false : true
                      that.$refs[form].validateField('name', (name) => {
                          if (name == "") {
                          } else {
                                return false
                          }
                        });
                  } else {
                    // 失败
                    that.$message({
                      type: "error",
                      message: data.message
                    });
                  }
                }
          });
          //检测违禁词
          this.ajax({
            url: "/common/checkSensitiveWord",
            data:data2,
            success(data) {
              if (data.code === "10000") {
                  if(data.responseBody != '' && data.responseBody != null){
                    that.sensitiveName = data.responseBody
                  }else{
                    that.sensitiveName = ''
                  }
                	that.$refs[form].validateField('name', (name) => {
                      if (name == "") {
                      } else {
                            return false
                      }
                    });
              } else {
                // 失败
                that.$message({
                  type: "error",
                  message: data.message
                });
              }
            }
          });
    },
    //打开协议弹窗
    showProtocolBox() {
      this.showProtocol = true;
    },
    //关闭协议弹窗
    closeProtocol() {
      this.showProtocol = false;
    },
    close() {
      // 隐藏验证码滑块
      this.showBlockMask = false;
    },
    //删除资质上传
    handleRemove(file, fileList) {
      const res = file.response.responseBody;
      for (var i in this.form.otherPic) {
        if (res[0].filePath == this.form.otherPic[i]) {
          this.form.otherPic.splice(i, 1);
        }
      }
    },
    handleChange(file, fileList) {
      // this.fileList = fileList.slice(-1);

    },
    moreExceed (file, fileList) {
        this.$message.error('最多上传5张')
    },
    handleAvatarSuccess(res, file) {
      if (res.code === "10000") {
        this.form.nickImg = res.responseBody[0].filePath;
        this.imageUrl.avatar = URL.createObjectURL(file.raw);
      } else {
        this.$message.error(res.message);
      }
    },
    otherPicSuccess(res, file) {
      this.form.otherPic.push(res.responseBody[0].filePath);
    },
    handleAvatarSuccess1(res, file) {
       if (res.code === "10000") {
        this.form.idcard1 = res.responseBody[0].filePath;
        this.imageUrl.idcard1 = URL.createObjectURL(file.raw);
      } else {
        this.$message.error(res.message);
      }

    },
    handleAvatarSuccess2(res, file) {
      if (res.code === "10000") {
        this.form.idcard2 = res.responseBody[0].filePath;
        this.imageUrl.idcard2 = URL.createObjectURL(file.raw);
      } else {
        this.$message.error(res.message);
      }
    },
    handleAvatarSuccess3(res, file) {
      console.log(res)
      if (res.code === "10000") {
         this.form.idcard3 = res.responseBody[0].filePath;
         this.imageUrl.idcard3 = URL.createObjectURL(file.raw);
      } else {
        this.$message.error(res.message);
      }
    },
    licensePicSuccess(res, file) {
      console.log(res);
      if (res.code === "10000") {
        this.form.licensePic = res.responseBody[0].filePath;
        this.form.licensePicShow = res.responseBody[0].filePath;
      } else {
        this.$message.error(res.message);
      }

    },
    beforeAvatarUpload(file) {
      let isTrue = false;
      if (file.type === "image/jpeg" || file.type === "image/png") {
        isTrue = true;
      }
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isTrue) {
        this.$message.error("图片格式不对!");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 1MB!");
      }
      return isTrue && isLt2M;
    },
    selected(val) {
      this.form.select.area = val.area.value;
      this.form.select.city = val.city.value;
      this.form.select.province = val.province.value;
    },
    getCheckCode() {
      this.showBlockMask = true;
    },
    prevStep() {
      this.$router.push("/apply");
    },
    commit(form) {
      const that = this;
      let countryname = "中国";
      for (var i in codeData) {
        if (this.mobileArea == codeData[i].code) {
          countryname = codeData[i].countryname;
        }
      }
      const otherPic_list = this.form.otherPic.join(",");
      let data = Object.assign({
        userId: that.userInfo.userId,
        roleId: 1,
        mobile: that.userInfo.userMobile,
        applyRole: this.id,
        realName: this.form.userName,
        columnName: this.form.name,
        columnIntro: this.form.region,
        columnAvatar: this.form.nickImg,
        columnCountry: countryname,
        columnProvince: this.form.select.province,
        columnCity: this.form.select.city,
        columnCounty: this.form.select.area,
        idcard: this.form.ID,
        idcardFront: this.form.idcard1,
        idcardBack: this.form.idcard2,
        idcardPic: this.form.idcard3,
        code: this.form.code,
        otherPic: otherPic_list
      });
      const n = this.id;
      switch (n) {
        case "2":
          data.applyRole = "2";
          break;
        case "3":
          data.applyRole = "3";
          data.companyName = this.form.companyName;
          data.licensePic = this.form.licensePic;
          data.siteLink = this.form.relateLink;
          break;
        case "4":
          data.applyRole = "4";
          data.companyName = this.form.companyName;
          data.licensePic = this.form.licensePic;
          data.siteLink = this.form.relateLink;
          break;
        case "5":
          data.applyRole = "5";
          data.companyName = this.form.companyName;
          data.licensePic = this.form.licensePic;
          data.siteLink = this.form.relateLink;
          break;
        default:
      }
      //submit_list = Lib.M.dataRequest(submit_list)
      this.$refs[form].validate(valid => {
        if (valid) {
          let that = this;
          this.ajax({
            url: "/column/addUserProfile",
            data,
            success(data) {
              if (data.code === "10000") {
                that
                  .$alert(
                    "我们将在1-3个工作日内，审核您的材料，请耐心等待！",
                    "你的资料已提交成功！",
                    {
                      confirmButtonText: "我知道了",
                      customClass: "applySuccessBox",
                      showCancelButton: false,
                      showClose: false,
                      center: true
                    }
                  )
                  .then(() => {
                    that.$router.push("/progress");
                  })
                  .catch(() => {});
              } else {
                // 失败
                that.$message({
                  type: "error",
                  message: data.message
                });
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    // 显示倒计时
    startCountdown() {
      this.showCountdown = true;
      let timer = setInterval(() => {
        this.time--;
        if (this.time == 0) {
          this.showCountdown = false;
          this.time = 90;
          clearInterval(timer);
        }
      }, 1000);
    },
    sendMsg() {
      let that = this;
      let data = Object.assign(
        {
          verIfy: that.userInfo.userMobile,
          mobileArea: "86",
          valiDation: 2
        },
        this.ncBlock
      );
      that.close(); // 关闭蒙层
      that.startCountdown(); // 开始倒计时
      that.resetBlock(); // 重置滑块
      this.ajax({
        url: "/common/sendSmsCode",
        data,
        success(data) {
          if (data.code === "10000") {
            // 发送短信成功
          } else {
            // 发送短信失败
            this.$message({
              type: "error",
              message: "发送短信失败"
            });
          }
        }
      });
    },
    // 重置滑块
    resetBlock() {
      this.ncBlock.session = "";
      this.ncBlock.sig = "";
      this.ncBlock.token = "";
      this.ncBlock.scene = "";
    }
  }
};
</script>

<style lang="less" scoped>
.personal {
  padding-top: 72px;
  padding-bottom: 100px;
  position: relative;
  min-height: 100%;
  .main {
    margin: 62px auto 100px;
    width: 1200px;
    padding-bottom: 100px;
    position: relative;
    min-height: 100%;
    .mask-title {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);
      text-align: center;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #e1e0e1;
    }
    .mask-block1 {
      margin: 30px 30px;
      p {
        font-size: 15px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 20px;
        /*line-height: 22px;*/
      }
    }
    .mask-block2 {
      margin: 30px 0px 30px 30px;
      max-height: 600px;
      overflow-y: scroll;
      p {
        font-size: 15px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 20px;
        /*line-height: 22px;*/
      }
      h3{
        margin-bottom: 20px;
      }
    }
    .box {
      margin: 60px auto 0;
      width: 640px;
      .operator-info {
        margin-top: 75px;
      }
      .title {
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        margin-bottom: 37px;
        margin-top: 60px;
      }
      .photo {
        height: 140px;
        .img {
          position: absolute;
          left: 0px;
          width: 100px;
          height: 100px;
          background: rgba(245, 245, 245, 1);
          font-family: MicrosoftYaHei;
          color: rgba(155, 155, 155, 1);
          // padding: 22px 10px 0px 15px;
          line-height: 20px !important;
          overflow: hidden;
          img {
            position: absolute;
            left: 0px;
            width: 100%;
            height: 100px;
          }
          span {
            display: inline-block;
            padding: 20px 10px 0 16px;
            text-align: center;
          }
        }
        .tips {
          position: absolute;
          left: 121px;
          line-height: 20px !important;
          bottom: 40px;
          font-size: 12px;
          font-family: PingFangSC;
          color: rgba(102, 102, 102, 1);
        }
        .uploadperson {
          position: absolute;
          top: 103px;
          left: 0px;
          button{
            width: 100px;
            height: 28px;
            background: #2382ea;
            font-size: 14px;
            color: #fff;
            text-align: center;
            border-radius: 0!important;
            border:0;
            padding:0;
             &:hover {
              background: rgba(35, 130, 234, 0.7);
            }
          }
        }
      }
      .area {
        margin-top: 46px;
      }
      .cards {
        height: 200px;
        .tips {
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
          position: absolute;
          top: 154px;
          left: 0px;
        }
        .presonal {
          position: relative;

          .img {
            width: 160px;
            height: 96px;
            line-height: 96px;
            background: rgba(245, 245, 245, 1);
            font-family: MicrosoftYaHei;
            color: rgba(155, 155, 155, 1);
            text-align: center;
            position: absolute;
            left: 0px;
            top: 0px;
            .idCard {
              width: 100%;
              height: 96px;
            }
          }
          .uploadcard {
            position: absolute;
            top: 103px;
            left: 0px;
            button{
              width: 160px;
              height: 28px;
              background: #2382ea;
              font-size: 14px;
              color: #fff;
              text-align: center;
              border-radius: 0!important;
              border:0;
              padding:0;
              &:hover {
                background: rgba(35, 130, 234, 0.7);
              }
            }
          }
        }
        .presonal2 {
          position: relative;
          margin-left: 74px;
          .img {
            width: 160px;
            height: 96px;
            line-height: 96px;
            background: rgba(245, 245, 245, 1);
            font-family: MicrosoftYaHei;
            color: rgba(155, 155, 155, 1);
            text-align: center;
            position: absolute;
            left: 100px;
            top: 0px;
            .idCard {
              width: 160px;
              height: 96px;
            }
          }
          .uploadcard {
            position: absolute;
            top: 103px;
            left: 100px;
            button{
              width: 160px;
              height: 28px;
              background: #2382ea;
              font-size: 14px;
              color: #fff;
              text-align: center;
              border-radius: 0!important;
              border:0;
              padding:0;
              &:hover {
                background: rgba(35, 130, 234, 0.7);
              }
            }
          }
        }
      }
      .presonal3 {
        position: relative;
        margin-left: 248px;
        .img {
          width: 160px;
          height: 96px;
          // line-height:60px;
          background: rgba(245, 245, 245, 1);
          font-family: MicrosoftYaHei;
          color: rgba(155, 155, 155, 1);
          text-align: center;
          position: absolute;
          left: 100px;
          top: 0px;

          .idCard {
            width: 160px;
            height: 96px;
          }
          div {
            line-height: 18px !important;
            width: 80px;
            height: 31px;
            margin: 0 auto;
            font-size: 12px !important;
            padding-top: 30px;
            padding: 30px 5px;
          }
        }
        .uploadcard {
          position: absolute;
          top: 103px;
          left: 100px;
          button{
            width: 160px;
            height: 28px;
            background: #2382ea;
            font-size: 14px;
            color: #fff;
            text-align: center;
            border-radius: 0!important;
            border:0;
            padding:0;
             &:hover {
              background: rgba(35, 130, 234, 0.7);
            }
          }
        }
      }
    }
    .mobileCode {
      margin-top: 40px;
      .btnUpload {
        width: 100px;
        height: 28px;
        line-height: 28px;
        background: #2382ea;
        font-family: PingFangSC;
        font-size: 14px;
        text-align: center;
        color: #fff;
        margin-top: 30px;
        &:hover {
          background: rgba(35, 130, 234, 0.7);
        }
      }

      .fileList:nth-child(4) div {
        margin-top: 20px;
      }
      .fileList:nth-child(5) div {
        margin-top: 20px;
      }
      .natural {
        float: left;
        width: 100px;
        height: 60px;
        line-height: 60px;
        margin-right: 14px;
        background: rgba(245, 245, 245, 1);
        :nth-child(3) {
          margin-top: 20px;
          background: #ff0;
        }
        img {
          width: 100px;
          height: 60px;
        }
      }
      .el-upload__tip {
        line-height: 20px !important;
      }
    }
    .checkNo {
      position: relative;
      margin-top: 30px;
      height: 40px;
      line-height: 40px;
      width: 200px;
      .tips {
        padding-right: 13px;
        cursor: pointer;
        font-size: 12px;
        position: absolute;
        right: -100px;
        top: 0;
        height: 100%;
        width: 93px;
        padding-top: 2px;
        color: #2382ea;
        text-align: right;
        &:hover {
          color: rgba(35, 130, 234, 0.7);
        }
      }
    }
    .checkbox_el {
      a {
        color: rgba(35, 130, 234, 1);
        &:hover {
          color: rgba(35, 130, 234, 0.7);
        }
      }
    }
    .btn-group {
      display: flex;
      justify-content: flex-start;
      margin-top: 25px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      .btn-prev {
        margin-right: 15px;
        width: 170px;
        background: #fff;
        color: #2382ea;
        border: 1px solid #2382ea;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          border: 1px solid rgba(35, 130, 234, 0.7);
          color: rgba(35, 130, 234, 0.7);
        }
      }
      .btn-commit {
        width: 170px;
        background: #2382ea;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background: rgba(35, 130, 234, 0.7);
        }
      }
    }
  }
}
</style>
<style lang="less">
.applySuccessBox {
  .el-message-box__header {
    border-bottom: 1px solid #e1e0e1;
    padding-top: 20px;
    .el-message-box__title {
      font-size: 18px;
      font-family: "微软雅黑";
      font-weight: bold;
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
    width: 170px;
    height: 40px;
    font-family: MicrosoftYaHei;
    background: rgba(35, 130, 234, 1);
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
  }
}
</style>

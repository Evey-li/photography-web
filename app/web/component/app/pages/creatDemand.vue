<template>
  <div>
    <div class="requst-header">
      <h1>发布需求</h1>
    </div>
    <div class="instruction">
      <div class="step">
        <h2 class="step-num">1</h2>
        <h4>发布需求</h4>
        <p>告诉创作者您要找的内容，完善需求及奖励信息</p>
      </div>
      <div class="step">
        <h2 class="step-num">2</h2>
        <h4>提交审核</h4>
        <p>需求审核通过后，将被发布到本网站供创作人浏览</p>
      </div>
      <div class="step">
        <h2 class="step-num">3</h2>
        <h4>挑选作品</h4>
        <p>下载最符合您创意和愿景的作品，支付承诺的奖励</p>
      </div>
    </div>
    <div class="request-info">
      <h5>发布需求信息</h5>
      <hr>
      <p v-if="errors.length">
        <ul>
          <li v-for="error in errors">
            <span>
              {{ error }}
            </span>
            <span>
              <i class="icon-bell"></i>
            </span>
          </li>
        </ul>
      </p>
      <div class="wrapper1">
        <div class="project-name">
          <label for="projectName">
            <i class="icon-asterisk"></i> 需求名称：</label><input type="text" name="projectName" v-model="demandData.title">
        </div>

        <div class="demander">
          <label for="demander">
            <i class="icon-asterisk"></i> 发布人：</label><input type="text" name="demander" :value="user.userName" readonly>
        </div>

      </div>

      <div class="request-detail">
        <label for="requestDetail">
          <i class="icon-asterisk"></i> 具体要求：</label>
        <textarea id="" cols="83" rows="3" name="requestDetail" style="vertical-align:middle;" v-model="demandData.demandDesc"></textarea>
      </div>
      <div class="wrapper2">

        <div class="time-limit">
          <label for="timeLimit">
            <i class="icon-asterisk"></i> 周转时间：</label><input type="text" name="timeLimit" v-model="demandData.workTime" placeholder="3">
          <span>(天)</span>
        </div>
        <div class="reward">
          <label for="reward">
            <i class="icon-asterisk"></i> 奖金报酬：</label><input type="text" name="reward" v-model="demandData.payment" placeholder="1000">
          <span>(￥)</span>
        </div>
        <div class="address">
          <label>
            <i class="icon-asterisk"></i> 拍摄地点：</label>
          <area-cascader :level="1" v-model="addrData" :data="pcaa" class="place"></area-cascader>
        </div>
      </div>
      <div class="wrapper3">
        <div class="email">
          <label for="email">
            <i class="icon-asterisk"></i> 邮箱地址：</label><input type="text" name="email" v-model="demandData.email">
        </div>
        <div class="tel">
          <label for="tel">
            <i class="icon-asterisk"></i> 联系电话：</label><input type="text" name="tel" v-model="demandData.tel">
        </div>
      </div>
      <div class="creator">
        <label for="creator">创作人：</label><input type="text" name="creato" readonly :value="invitee.userName">
        <span class="invite-hint">（如果您已有心仪的创作人，邀请后这里就会有ta的信息哦）</span>
      </div>
      <div class="prefer-style">
        <label for="preferStyle">风格偏好：</label>
        <textarea name="preferStyle" id="" cols="83" rows="2" style="vertical-align:middle;" v-model="demandData.preference"></textarea>
      </div>
      <div class="submit">
        <span class="btn" @click="release">立即发布</span>
      </div>
    </div>

  </div>

</template>
<script>
import {mapState} from 'vuex';
import { log } from 'util';
import {addDemand} from 'api';
import {
  pca,
  pcaa
} from 'area-data'; // v5 or higher
export default {
  computed:{
    ...mapState(['invitee','user'])
  },
  created(){
    this.pcaa = pcaa;


    if(this.invitee){
      this.demandData.creatorId = this.invitee._id;
    }else{
      this.demandData.creatorId = null;
    }
    if(this.user){
      this.demandData.demanderId = this.user._id;
      this.demandData.email = this.user.email;
      this.demandData.tel = this.user.tel;
    }
    
  },
  data(){
    return{
      errors: [],
      addrData:{},
      demandData:{
        title:'',
        demanderId:'',
        demandDesc:'',
        workTime:'',
        payment:'',
        email:'',
        tel: '',
        creatorId:'',
        preference:'',
        place:'',
      }
    }
  },
  methods:{
    release(){
       this.errors = [];
       let address = this.addrData;

       if (!this.demandData.title) {
         this.errors.push("请您填写项目名");
       }
       if(!this.demandData.demandDesc){
         this.errors.push("请填写具体要求给创作人")
       }
       if(!this.demandData.workTime){
         this.errors.push("请填写留给创作人的周转时间")
       }
       if(!this.demandData.payment){
         this.errors.push("请给出您的丰厚奖励，让创作人为您更加卖力地创作")
       }
       if(!address.length){
         this.errors.push("请选择拍摄地点")
       }else{
         this.demandData.place = pcaa['86'][address[0]]+pcaa[address[0]][address[1]]+pcaa[address[1]][address[2]];
       }
       if (!this.demandData.email) {
         this.errors.push('请您填写邮箱地址，方便创作人联系您');
       } else if (!this.validEmail(this.demandData.email)) {
         this.errors.push('请填写有效的邮箱地址');
       }
       if(!this.demandData.tel){
         this.errors.push("请填写您的常用联系电话，方便创作人联系您")
       }
       if (!this.errors.length) {
         addDemand(this,{demand:this.demandData}).then(result => {
           this.$toasted.show("需求发布成功！")
         });
         return true;
       }
      
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.requst-header {
  width: 100%;
  height: 300px;
  position: relative;
  background-image: url('http://twanight.org/newTWAN/photos/3005727.jpg');
  background-position: center 20%;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    font-family: '宋体';
    text-align: center;
    color: #fff;
    position: absolute;
  }
}
.instruction {
  display: flex;
  justify-content: center;
  //   border: 1px solid black;
  margin: 40px 0 30px 0;
  padding: 10px 0;
  .step {
    flex: 1;
    text-align: center;
    .step-num {
      border: 1px solid #71726e;
      border-radius: 100px;
      display: inline-block;
      width: 80px;
      height: 80px;
      color: #71726e;
      font-family: '仿宋';
      font-size: 40px;
      line-height: 80px;
      text-align: center;
    }
    h4 {
      color: #71726e;
    }
    p {
      color: #71726e;
      font-size: 17px;
    }
  }
}
.request-info {
  width: 60%;
  border: 1px solid #ccc;
  margin: 40px 0 40px 20%;
  padding: 20px;
  input,
  textarea {
    padding-left: 10px;
  }
  p {
    border-bottom: 1px solid #ccc;
    ul {
      list-style-type: circle;
      color: #f14164;
    }
  }
  .icon-asterisk {
    color: #f14164;
    font-size: 11px;
  }
  h5 {
    color: #444;
    padding-left: 5px;
  }
  .wrapper1 {
    margin: 20px 0;
    padding-left: 25px;
    .project-name {
      display: inline;
    }
    .demander {
      display: inline;
      margin-left: 25px;
    }
  }

  .request-detail {
    padding-left: 25px;
    margin: 20px 0;
    textarea {
      width: 81%;
    }
  }
  .wrapper2 {
    padding-left: 25px;
    margin: 20px 0;
    .time-limit {
      display: inline;
      input {
        width: 7%;
        margin-left: 5px;
      }
    }
    .reward {
      margin-left: 25px;
      display: inline;
      input {
        width: 8%;
      }
    }
    .address {
      display: inline;
      margin: 20px 0;
      padding-left: 25px;
      .place {
        display: inline-block;
        .area-select.large {
          width: 240px;
        }
        .area-select .area-selected-trigger {
          display: inline;
        }
      }
    }
  }
  .wrapper3 {
    .email {
      display: inline;
      padding-left: 25px;
      margin: 20px 0;
      input {
        width: 300px;
        margin-left: 5px;
      }
    }
    .tel {
      display: inline;
      padding-left: 25px;
      margin: 20px 0;
      input {
        width: 260px;
      }
    }
  }
  .creator {
    padding-left: 55px;
    margin: 20px 0;
    input {
      width: 300px;
      margin-left: 5px;
    }
    .invite-hint {
      margin-left: 5px;
      font-size: 14px;
      color: #08af7f;
    }
  }
  .prefer-style {
    padding-left: 40px;
    margin: 20px 0;
  }
  .submit {
    // border: 1px solid black;
    text-align: center;
    .btn {
      color: #fff;
      font-size: 18px;
      width: 200px;
      height: 50px;
      padding: 10px 0;
      background-color: #08af7f;
    }
  }
}
</style>


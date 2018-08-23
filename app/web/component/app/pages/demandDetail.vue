<template>
  <div>
    <div class="detail-header">
      <h1>
        {{demand.title}}
      </h1>
    </div>
    <div class="container">
      <div class="details">
        <div class="demand-des">
          <div class="description">
            <div class="title">需求介绍：</div>
            <div class="content">{{demand.demandDesc}}</div>
          </div>

          <div class="other-detail">
            <div>
              <span class="title">
                <i class="icon-calendar"></i>
              </span>
              <span class="content"> {{demand.releaseTime}}发布</span>
            </div>
            <div>
              <span class="title">
                <i class="icon-map-marker"></i>
              </span>
              <span class="content"> {{demand.place}}</span>
            </div>
            <div>
              <span class="title">
                <i class="icon-phone"></i>
              </span>
              <span class="content"> {{demand.tel}}</span>
            </div>
            <div>
              <span class="title">
                <i class="icon-envelope-alt"></i>
              </span>
              <span class="content"> {{demand.email}}</span>
            </div>

          </div>
        </div>
        <hr>
        <div class="info-img">
          <div class="demand-time">
            <img src="../assets/img/demand-time.png" alt="">
            <div>周转时间</div>
            <div>
              <span>{{demand.workTime}}</span>天</div>
          </div>
          <div class="demand-status">
            <img src="../assets/img/demand-status.png" alt="">
            <div>需求状态</div>
            <div>{{demand.status}}</div>
          </div>
          <div class="demand-reward">
            <img src="../assets/img/demand-reward.png" alt="">
            <div>奖励报酬</div>
            <div>￥
              <span>{{demand.payment}}</span>
            </div>
          </div>
        </div>
        <hr>
        <!-- <h4>已有作品展示</h4>
          <div class="result-show">
            <div class="show-img" :key="item.id" v-for="item in reqImgs" :style="backgroundImgStyle(item.url)">
            </div>
          </div> -->
        <!-- <hr> -->
        <div class="received" v-if="received">
          <router-link to="/demandMgmt">
            查看其它已接需求
            <i class="icon-double-angle-right"></i>
          </router-link>

        </div>
        <div class="receive-demand" @click="receiveDemand(demand._id)" v-else>
          <div class="receive-btn" v-show="user.userType === 0">接下需求</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getDemandById,updateDemand,checkDemand} from 'api';
import {mapState} from 'vuex';
import { log } from 'util';

export default {
  created(){
    this.id = this.$route.params.id;
    getDemandById(this,{demandId:this.id}).then(result => {
      this.demand = result;
    });
    checkDemand(this,{demandId:this.id,creatorId:this.user._id}).then(result => {
      this.received = result;
    });
  },
  watch:{
     $route(to,from){
      const tmp = to.path.split("/")
      if(tmp[1] === 'demandDetail' && tmp[2]){
         getDemandById(this,{demandId:tmp[2]}).then(result => {
           this.demand = result;
         });
         checkDemand(this,{demandId:tmp[2],creatorId:this.user._id}).then(result => {
           this.received = result;
         });
      }
    }
  },
  computed:{
    ...mapState(['user'])
  },
  data() {
    return {
      demand:{},
      reqImgs: [
        {
          id: 1,
          url:
            'https://images.snapwi.re/fac1/59bcd0ce2a39199f558b456e.w314.h314.jpg'
        },
        {
          id: 2,
          url:
            'https://images.snapwi.re/fb8f/59bccf5c2a3919b1528b4579.w314.h314.jpg'
        },
        {
          id: 3,
          url:
            'https://images.snapwi.re/5fb3/59bc2f322a3919f2778b458e.w314.h314.jpg'
        },
        {
          id: 4,
          url:
            'https://images.snapwi.re/7663/59bc26d12a3919226e8b4587.w314.h314.jpg'
        },
        {
          id: 5,
          url:
            'https://images.snapwi.re/7d2d/59bcd0122a39199d528b4599.w314.h314.jpg'
        },
        {
          id: 6,
          url:
            'https://images.snapwi.re/1f2a/59bc2f192a3919f2778b4582.w314.h314.jpg'
        }
      ],
      received:false
    };
  },
  methods: {
    backgroundImgStyle(image) {
      return {
        'background-image': `url(${image})`
      };
    },
    receiveDemand(demand_id){
     updateDemand(this,{demandId:demand_id,creatorId:this.user._id}).then(result => {
        this.$router.push('/demandMgmt');      
     });
    }
  }
};
</script>

<style lang="scss">
.detail-header {
  width: 100%;
  height: 300px;
  background-image: url('https://www.snapwi.re/assets/img/headers/clouds2.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    font-family: '宋体';
    text-align: center;
    color: #444;
    position: absolute;
    // top: 40%;
    // left: 40%;
  }
}
.container {
  display: flex;
  width: 60%;
  padding-bottom: 30px;
  .demand-des {
    padding-top: 30px;
    .description {
      font-size: 18px;
      display: flex;
      justify-content: center;
      .title {
        // border: 1px solid black;
        font-size: 23px;
        flex: 1;
        text-align: center;
      }
      .content {
        // border: 1px solid black;
        flex: 6;
      }
    }
    .other-detail {
      // border: 1px solid black;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      margin: 30px 0;
      div {
        padding: 0 5px;
        margin: 0 5px;
        text-align: center;
      }
    }
  }
  .info-img {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px 0;
    .demand-time,
    .demand-status,
    .demand-reward {
      flex: 1;
      text-align: center;
      font-size: 20px;
    }
    img {
      width: 100px;
      height: 100px;
    }
  }
  h4 {
    color: black;
    text-align: center;
    margin: 15px 0;
  }
  .result-show {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .show-img {
      background-color: #eee;
      width: 30%;
      height: 300px;
      margin: 10px;
    }
  }
  .received {
    text-align: center;
    margin-top: 25px;
    color: #08af7f;
    font-size: 22px;
    font-family: '宋体';
    &:hover {
      cursor: pointer;
      text-decoration: none;
    }
  }
  .receive-demand {
    text-align: center;
    margin-top: 25px;
    .receive-btn {
      width: 200px;
      height: 50px;
      line-height: 50px;
      display: inline-block;
      border-radius: 10px;
      color: #fff;
      background-color: #08af7f;
      font-size: 22px;
      font-family: '宋体';
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>


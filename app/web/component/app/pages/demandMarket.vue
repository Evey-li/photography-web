<template>
  <div>
    <div class="market-header">
      <h2>需求市场</h2>
      <p>挑选感兴趣的创意，享受创作乐趣的同时获得丰厚报酬</p>
    </div>
    <div class="request-fliter">
      <div class="fliter" @click="getDemandsByCond('all')" :class="{click:filter==='all'}">全部需求</div>
      <div class="fliter" @click="getDemandsByCond('recent')" :class="{click:filter==='recent'}">最近发布</div>
      <div class="fliter" @click="getDemandsByCond('payment')" :class="{click:filter==='payment'}">酬劳最高</div>
      <div class="fliter" @click="getDemandsByCond('workTime')" :class="{click:filter==='workTime'}">工期较短</div>
    </div>
    <div class="show-requests">
      <div class="request" :key="index" v-for="(item,index) in demands" :style="backgroundImgStyle(item.image)">
        <router-link :to="{name:'detail',params: {id:item._id}}" class="link">
          <div class="other">
            <div class="demander">
              <div class="img" :style="backgroundImgStyle(item.user[0].headImgUrl)"></div>
              <p>{{item.user[0].userName}}</p>
            </div>
          </div>
          <div class="bottom ">
            <h4>{{item.title}}</h4>
            <div class="req-info ">
              <div class="time-info ">
                <i class="icon-time "></i>
                <span class="time ">{{item.workTime}}</span>
                <span>days</span>
              </div>
              <div class="payment-info ">
                <span>￥</span>
                <span class="payment ">{{item.payment}}</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="market-pagination ">
      <pagination :count="totalPages " @onItemClick="onPageItemClick "></pagination>
    </div>
  </div>
</template>
<script>
import Pagination from '../components/Pagination';
import {getDemandList,getDemandsNum} from 'api';

export default {
  created(){
    this.filter = 'all';
    getDemandList(this,{condition:'all',pageSize:this.pageSize,currentPage:1}).then(result => {
      this.demands = result;
    });
    getDemandsNum(this).then(result => {
      this.totalPages = Math.ceil(result/this.pageSize);
    });
  },
  data() {
    return {
      demands: [],
      filter:'',
      totalPages:0,
      pageSize:3,
    };
  },
  components: {
    Pagination
  },
  methods: {
    getDemandsByCond(condition){
      if(condition){
        this.filter = condition
      }
      getDemandList(this,{ condition:condition,pageSize:this.pageSize,currentPage:1}).then(result => {
        this.demands = result;
      });
    },
    onPageItemClick(page) {
      getDemandList(this,{condition:this.filter,pageSize:this.pageSize,currentPage:page}).then(result => {
        this.demands = result;
      });
    },
    backgroundImgStyle(image) {
      return {
        'background-image': `url(${image})`
      };
    }
  }
};
</script>
<style lang="scss">
.click {
  background-color: #08af7f;
  border-color: #08af7f;
  color: #fff;
}
.market-header {
  width: 100%;
  height: 300px;
  position: relative;
  background-image: url('https://s3.amazonaws.com/snapwire/images/home/5491ec8e780eb7720f5e268a.jpg');
  background-position: center 55%;
  background-repeat: no-repeat;
  background-size: cover;
  h2 {
    font-family: '宋体';
    text-align: center;
    color: #fff;
    position: absolute;
    top: 26%;
    width: 100%;
  }
  p {
    color: #fff;
    font-size: 24px;
    font-family: '仿宋';
    position: absolute;
    top: 45%;
    width: 100%;
    text-align: center;
    padding: 6px 0;
  }
}
.request-fliter {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100px;
  background-color: #f7f7f7;
  .fliter {
    width: 200px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #71726e;
    border-radius: 10px;
    margin: 10px 30px;
    &:hover {
      cursor: pointer;
    }
  }
}
.show-requests {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 40px 0;
  .request {
    color: #444;
    position: relative;
    z-index: 100;
    width: 25%;
    height: 300px;
    margin: 0px 15px;
    background-color: #f7f7f7;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    .link {
      &:hover {
        color: #444;
      }
    }
    .other {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 100px;
      .demander {
        width: 100%;
        display: inline-block;
        text-align: center;
        margin-top: 35px;
      }
      .img {
        display: inline-block;
        width: 110px;
        height: 110px;
        border-radius: 50%;
        background-image: url('../assets/img/test.jpeg');
        background-size: cover;
      }
    }
    .bottom {
      // color: #444;
      width: 100%;
      height: 100px;
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
      text-align: center;
      h4 {
        border-bottom: 1px solid #444;
        padding-bottom: 10px;
        font-family: '宋体';
        color: #444;
      }
    }
    .req-info {
      font-size: 18px;
      .time-info {
        display: inline;
      }
      .payment-info {
        display: inline;
        margin-left: 15px;
      }
    }
  }
}
.market-pagination {
  //   border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
</style>


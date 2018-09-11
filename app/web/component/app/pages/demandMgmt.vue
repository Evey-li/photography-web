<template>
  <div class="mgmt-container">
    <div class="main">
      <div class="mgmt-filter">
        <div></div>
        <div class="all-demand" @click="getOrders" :class="{newBorder:currentIndex===0}">全部需求</div>
        <div></div>
        <div class="unfinished-demand" @click="getUnfinished" :class="{newBorder:currentIndex===1}">未完成需求</div>
        <div></div>
        <div class="finished-demand" @click="getFinished" :class="{newBorder:currentIndex===2}">已完成需求</div>
        <div></div>
      </div>
      <div class="table-data" v-if="user.userType === 0">
        <div v-if="!ordersOfCreator.length" class="no-data">
          <img src="http://localhost:7001/public/test.gif" alt="">
          <p>暂无符合要求的数据</p>
        </div>
        <table class="table" v-else>
          <thead>
            <th>需求名称</th>
            <th>需求人</th>
            <th>需求人邮箱</th>
            <th>奖励报酬</th>
            <th>当前状态</th>
            <th>接单日期</th>
            <th>完成日期</th>
            <th>邀请单</th>
            <th></th>
          </thead>

          <tbody>
            <tr v-for="(item,index) in ordersOfCreator" :key="index">
              <td>
                <router-link :to="{name:'detail',params: {id:item.demandId}}" class="link">{{item.title}}</router-link>
              </td>
              <td>{{item.demander}}</td>
              <td>{{item.email}}</td>
              <td>{{item.payment}}</td>
              <td>{{item.status}}</td>
              <td>{{item.receiveDate}}</td>
              <td v-if="!item.finishDate">暂无</td>
              <td v-else>{{item.finishDate}}</td>
              <td v-if="item.invited">是</td>
              <td v-else>否</td>
              <td>等待中</td>
            </tr>
          </tbody>

        </table>
      </div>
      <div class="table-data" v-else>
        <div v-if="!ordersOfDemander.length" class="no-data">
          <img src="http://localhost:7001/public/test.gif" alt="">
          <p>暂无符合要求的数据</p>
        </div>
        <table class="table" v-else>
          <thead>
            <th>需求名称</th>
            <th>当前状态</th>
            <th>接单日期</th>
            <th>创作人</th>
            <th>完成日期</th>
            <th>邀请单</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in ordersOfDemander" :key="index">
              <td>
                <router-link :to="{name:'detail',params: {id:item.demandId}}" class="link">{{item.title}}</router-link>
              </td>
              <td>{{item.status}}</td>
              <td v-if="item.receiveDate">{{item.receiveDate}}</td>
              <td v-else>暂无</td>
              <td v-if="item.creatorId">
                <router-link :to="{name:'user',params: {id:item.creatorId}}" class="link">{{item.creatorName}}</router-link>
              </td>
              <td v-else>暂无</td>
              <td v-if="item.finishDate">{{item.finishDate}}</td>
              <td v-else>暂无</td>
              <td v-if="item.invited">是</td>
              <td v-else>否</td>
              <td v-if="item.status === '已完成'">
                <div class="inopera">已完成</div>
              </td>
              <td v-else>
                <div v-if="item.status === '待接单'" class="inopera">请等待</div>
                <div v-else-if="item.status === '待回复'" class="opera" @click="reply(item.orderId)">确认挑选</div>
                <div v-else-if="item.status === '订单关闭'" class="inopera">订单关闭</div>
                <div v-else class="inopera">创作中</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrdersByCreator, getDemandsOfDemander, confirmCreator } from 'api';
import { mapState } from 'vuex';
import { log } from 'util';

export default {
  created() {
    this.getOrders();
  },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      currentIndex: 0,
      ordersOfCreator: [],
      ordersOfDemander: []
    };
  },

  methods: {
    getOrders() {
      this.currentIndex = 0;
      if (this.user.userType === 0) {
        getOrdersByCreator(this).then(result => {
          // console.log(result);
          this.ordersOfCreator = result;
        });
      }
      if (this.user.userType === 1) {
        getDemandsOfDemander(this).then(result => {
          // console.log(result);
          this.ordersOfDemander = result;
        });
      }
    },
    getUnfinished() {
      this.currentIndex = 1;
      if (this.user.userType === 0) {
        const unfinished = [];
        getOrdersByCreator(this).then(result => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].status !== '已完成') {
              unfinished.push(result[i]);
            }
          }
          this.ordersOfCreator = unfinished;
        });
      } else {
        const unfinished = [];
        getDemandsOfDemander(this).then(result => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].status !== '已完成') {
              unfinished.push(result[i]);
            }
          }
          this.ordersOfDemander = unfinished;
        });
      }
    },
    getFinished() {
      this.currentIndex = 2;
      if (this.user.userType === 0) {
        const finished = [];
        getOrdersByCreator(this).then(result => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].status === '已完成') {
              finished.push(result[i]);
            }
          }
          this.ordersOfCreator = finished;
        });
      } else {
        const finished = [];
        getDemandsOfDemander(this).then(result => {
          for (let i = 0; i < result.length; i++) {
            if (result[i].status === '已完成') {
              finished.push(result[i]);
            }
          }
          this.ordersOfDemander = finished;
        });
      }
    },
    reply(orderId) {
      confirmCreator(this, { orderId }).then(result => {
        console.log(result);
      });
    }
  }
};
</script>

<style lang="scss">
.mgmt-container {
  display: flex;
  justify-content: center;
}
.newBorder {
  border-top: 1.5px solid #aaa;
  border-right: 1.5px solid #aaa;
  border-left: 1.5px solid #aaa;
  border-bottom: transparent;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.main {
  width: 70%;
  height: 500px;
  margin: 30px 0;
  .mgmt-filter {
    // border: 1px solid black;
    display: flex;
    justify-content: center;
    div {
      text-align: center;
      width: 20%;
      border-bottom: 1.5px solid #aaa;
      padding: 5px;
      cursor: pointer;
    }
  }
  .table-data {
    margin: 30px 0;
  }
  .no-data {
    text-align: center;
    margin-top: 60px;
    p {
      font-size: 20px;
    }
  }
  table {
    text-align: center;
    .confirmFinish {
      display: inline-block;
      width: 90px;
      height: 35px;
      line-height: 35px;
      border: 1px solid #08af7f;
      border-radius: 5px;
      background-color: #08af7f;
      color: #fff;
      &:hover {
        cursor: pointer;
      }
    }
    .link {
      color: #08af7f;
      &:hover {
        color: #aaa;
      }
    }
    .inopera {
      display: inline-block;
      width: 90px;
      height: 35px;
      line-height: 35px;
      color: #aaa;
      border: 1px solid #aaa;
      border-radius: 5px;
      &:hover {
        cursor: pointer;
        text-decoration: none;
      }
    }
    .opera {
      display: inline-block;
      width: 90px;
      height: 35px;
      line-height: 35px;
      color: #fff;
      background-color: #08af7f;
      border: 1px solid #08af7f;
      border-radius: 5px;
      &:hover {
        cursor: pointer;
        text-decoration: none;
      }
    }
  }
}
</style>


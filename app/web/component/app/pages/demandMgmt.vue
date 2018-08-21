<template>
  <div class="mgmt-container">
    <div class="main">
      <div class="mgmt-filter">
        <div></div>
        <div class="all-demand" @click="getAllDemand" :class="{newBorder:currentIndex===0}">全部需求</div>
        <div></div>
        <div class="unfinished-demand" @click="getUnfinished" :class="{newBorder:currentIndex===1}">未完成需求</div>
        <div></div>
        <div class="finished-demand" @click="getFinished" :class="{newBorder:currentIndex===2}">已完成需求</div>
        <div></div>
      </div>
      <div class="table-data" v-if="demands.length">
        <table class="table">
          <thead>
            <th>需求名称</th>
            <th>需求人</th>
            <th>奖励报酬</th>
            <th>当前状态</th>
            <th>创作人</th>
            <th>接单日期</th>
            <th>完成日期</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="demand in demands" :key="demand._id">
              <td>
                <router-link :to="{name:'detail',params: {id:demand._id}}" class="viewDetail">
                  {{demand.title}}
                </router-link>
              </td>
              <td>{{demand.demanderName}}</td>
              <td>￥{{demand.payment}}</td>
              <td>{{demand.status}}</td>
              <td v-if="demand.creatorName">{{demand.creatorName}}</td>
              <td v-else>暂无</td>
              <td v-if="demand.receiveTime">{{demand.receiveTime}}</td>
              <td v-else>暂无</td>
              <td v-if="demand.finishTime">{{demand.finishTime}}</td>
              <td v-else>暂无</td>
              <td v-if="user.userType===0">
                <div v-if="demand.status==='未完成'">
                  <span class="confirmFinish" @click="confirmFinish(demand._id)">确认完成</span>
                </div>
                <div v-else>
                  <router-link :to="{name:'uploadPhoto',params: {id:demand._id}}" class="finished" v-show="!demand.hasPhotos">上传分享</router-link>
                  <span v-show="demand.hasPhotos">已分享</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
      <div v-else class="no-data">
        <img src="http://localhost:7001/public/test.gif" alt="">
        <p>暂无符合要求的数据</p>
      </div>
    </div>
  </div>
</template>

<script>
import {getAllDemandsByUser,confirmFinish} from 'api';
import {mapState} from 'vuex';

export default {
  created(){
    getAllDemandsByUser(this).then(result => {
       this.demands = result;
    });
  },
   computed:{
    ...mapState(['user'])
  },
  data() {
    return {
      currentIndex: 0,
      demands:[]
    };
  },

  methods: {
    getAllDemand(){
       this.currentIndex = 0;
       getAllDemandsByUser(this).then(result => {
         this.demands = result;
       })
    },
    getUnfinished(){
      this.currentIndex = 1;
      let unfinishedDemands = [];
       getAllDemandsByUser(this).then(result => {
         for(let i=0 ;i<result.length; i++){
           if(result[i].status === "未完成"){
             unfinishedDemands.push(result[i]);
           }
         }
         this.demands = unfinishedDemands;
       })
    },
    getFinished(){
      this.currentIndex = 2;
      let finishedDemands = [];
       getAllDemandsByUser(this).then(result => {
         for(let i=0 ;i<result.length; i++){
           if(result[i].status === "已完成"){
             finishedDemands.push(result[i]);
           }
         }
         this.demands = finishedDemands;
       })
    },
    confirmFinish(demand_id){
      if(demand_id){
        confirmFinish(this,{demandId:demand_id}).then(res => {
           getAllDemandsByUser(this).then(result => {
             this.demands = result;
           });
          this.$toasted.show("恭喜您完成一单需求，快去分享您此次的作品，吸引更多需求人吧~");
        })
      }
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
    .finished {
      display: inline-block;
      width: 90px;
      height: 35px;
      line-height: 35px;
      color: #08af7f;
      border: 1px solid #08af7f;
      border-radius: 5px;
      &:hover {
        cursor: pointer;
        text-decoration: none;
      }
    }
    .viewDetail {
      color: #08af7f;
      font-size: 17px;
      &:hover {
        text-decoration: none;
      }
    }
  }
  .no-data {
    text-align: center;
    margin-top: 60px;
    p {
      font-size: 20px;
    }
  }
}
</style>


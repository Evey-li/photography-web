<template>
  <div class="pagenation-content">
    <div class="page-back">
      <i class="icon-angle-left"></i>
      <span @click="onBackClick()">Back</span>
    </div>
    <div class="page-num">
      <ul>
        <li class="page" v-for="(item, index) in pages" :key="index" @click="onItemClick(item)" :class="{actived:item===currentPage}">
          <span>{{item}}</span>
        </li>
      </ul>
    </div>

    <div class="page-next">
      <span @click="onNextClick()">Next</span>
      <i class="icon-angle-right"></i>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    count: { default: 0 }
  },
  computed:{
    pages(){
      const c = this.currentPage;
      const t = this.count;
      if(t<9){
        return t;
      }
      if(c <= 4){
        return [1,2,3,4,5,6,7,'...',t]
      }else if(c >= t - 4){
       return [1, '...', t-6, t-5, t-4, t-3, t-2, t-1, t]
      }else{
         return [1, '...', c-2, c-1, c, c+1, c+2, '...', t]
      }
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  methods: {
    onItemClick(item) {
      if (item === this.currentPage) return;
      if (typeof item === 'string') return;
      this.currentPage = item;
      this.$emit('onItemClick', this.currentPage);
    },
    onBackClick() {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.$emit('onItemClick', this.currentPage);
      }
    },
    onNextClick() {
      if (this.currentPage < this.count) {
        this.currentPage = this.currentPage + 1;
        this.$emit('onItemClick', this.currentPage);
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.actived {
  color: #08af7f;
}
.pagenation-content {
  // width: 80%;
  display: flex;
  justify-content: center;
  line-height: 50px;
  font-size: 18px;
}
.page-back,
.page-next {
  margin: 0 10px;
  &:hover {
    color: #08af7f;
    cursor: pointer;
  }
}
.page-num {
  // text-align: center;
  padding-right: 40px;
  li {
    float: left;
    margin: 0 15px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>


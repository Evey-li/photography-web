<template>
  <div>
    <div class="banner">
      <div id="particles-js"></div>
      <ul class="cb-slideshow">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
      <div class="container-fluid">
        <div class="row cb-slideshow-text-container ">
          <div class="tm-content col-xl-6 col-sm-8 col-xs-8 ml-auto section">
            <header class="mb-5">
              <h2 class="content-title">需求与创作之间的双向选择</h2>
            </header>
            <p class="mb-5" id="web_intro">Photography平台可以让您轻松获取所需的独特摄影作品，创作人会根据您的条件创造出高质量的视觉效果。<br>摄影爱好人可以聚集于此，享受爱好创造价值的别样乐趣。
            </p>
          </div>
        </div>
      </div>
      <div class="go-bottom-btn" @click="scrollNext">
        <i class="icon-angle-down"></i>
      </div>
    </div>
    <!--下拉箭头参考点-->
    <span ref="nextPart"></span>

    <div class="intro-photo">
      <div class="intro-item">
        <img src="../assets/img/intro-global.png" alt="">
        <span>欣赏世界各地创作人的摄影作品</span>
      </div>
      <div class="intro-item">
        <img src="../assets/img/intro-experience.png" alt="">
        <span style="padding-top:8px">分享每件作品背后不为人知的故事</span>
      </div>
      <div class="intro-item">
        <img src="../assets/img/intro-snap.png" alt="">
        <span>在这里开启你由衷热爱的摄影之旅</span>
      </div>
    </div>

    <div class="photo-album">
      <div class="top-bar">
        <p class="title">
          来自世界的摄影作品
        </p>

        <router-link to="/gallery" class="view-more">查看更多
          <i class="icon-double-angle-right"></i>
        </router-link>

      </div>
      <div class="photos-show">
        <div class="hovereffect" v-for="(item,index) in photosData" :key="index">
          <img class="img-responsive" :src="item.imgUrl" alt="">
          <div class="overlay">
            <!-- <p>
              <router-link to="/gallery">查看更多</router-link>
            </p> -->
            <img :src="item.user.headImgUrl" alt="" class="headImg">
            <h2>创作人：
              <router-link :to="{name:'user',params: {id:item.user._id}}">{{item.user.userName}}</router-link>
            </h2>

          </div>
        </div>
      </div>
    </div>

    <div class="intro-service">
      <div class="for-display">
        <div class="service-content">
          <h4>在这儿，你可以……</h4>
          <div class="content-item">
            <h5>分享自己的摄影作品</h5>
            <p>上传你的得意之作，获得摄友们的点赞和关注，分享共同热爱的摄影。</p>
          </div>
          <div class="content-item">
            <h5>遇到大师级摄影佳作</h5>
            <p>我们欢迎世界各地摄影爱好者前来聚集，说不定你会遇到摄影大师的作品。</p>
          </div>
          <div class="content-item">
            <h5>作为需求方，按需求图</h5>
            <p>po出你的要求、价格等，会有一大波优秀的摄影师为你的需求接单，拍摄出惊艳的作品。</p>
          </div>
          <div class="content-item">
            <h5>作为创作方，边摄影边赚酬金</h5>
            <p>找到自己感兴趣的需求方，根据他们的需要拍摄作品，在获得摄影乐趣的同时获取丰厚酬金。</p>
          </div>
        </div>
        <div class="service-img">
          <img src="img/photo-service.png" alt="">
        </div>
      </div>
    </div>

    <div class="give-demand">
      <h3>让想象成为现实,</h3>
      <h3>寻找一个最让你满意的摄影佳作。</h3>
      <router-link tag="a" to="/creatDemand" class="btn">发布需求</router-link>
    </div>
  </div>
</template>
<script>
import particlesJS from 'asset/js/particles.js';
import { mapMutations, mapState } from 'vuex';
import { getPhotosForIndex } from 'api';
// 挂载到全局上，方面里面的particlesJS调用原生的document
window.particlesJS = particlesJS;
export default {
  created() {
    getPhotosForIndex(this).then(result => {
      this.photosData = result;
      console.log(result);
    });
  },
  data() {
    return {
      photosData: []
    };
  },
  mounted() {
    window.particlesJS('particles-js', {
      particles: {
        number: {
          value: 60,
          density: {
            enable: true,
            value_area: 1000
          }
        },
        color: {
          value: '#ffffff'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          },
          polygon: {
            nb_sides: 5
          },
          image: {
            src: 'img/github.svg',
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 5,
          random: true,
          anim: {
            enable: false,
            speed: 30,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 200,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 200
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true,
      config_demo: {
        hide_card: false,
        background_color: '#b61924',
        background_image: '',
        background_position: '50% 50%',
        background_repeat: 'no-repeat',
        background_size: 'cover'
      }
    });
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    scrollNext() {
      const jump = this.$refs.nextPart;
      // 获取需要滚动的距离
      const total = jump.offsetTop - 60;
      window.scrollTo({
        top: total,
        behavior: 'smooth'
      });
    }
  }
};
</script>

<style scoped>
@import '../assets/css/templatemo-style.css';
@import '../assets/css/bootstrap.min.css';

/*banner轮播样式*/
.banner {
  position: relative;
  overflow: hidden;
}
.content-title {
  font-size: 40px;
}
.container-fluid .mb-5 {
  font-size: 24px;
}

#web_intro {
  font-size: 22px;
  font-family: '宋体';
  line-height: 40px;
}
/*下拉箭头的浮动样式*/
.go-bottom-btn {
  position: absolute;
  color: #fff;
  z-index: 102;
  width: 50px;
  bottom: 50px;
  left: calc(50% - 25px);
  text-align: center;
  font-size: 70px;
  line-height: 70px;
  -webkit-transition: color 0.2s ease-out;
  transition: color 0.2s ease-out;
  -webkit-animation: t-arrow-bottom 1.7s infinite ease;
  animation: t-arrow-bottom 1.7s infinite ease;
}
@keyframes t-arrow-bottom {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }

  50% {
    -webkit-transform: translateY(-7px);
    transform: translateY(-7px);
  }

  55% {
    -webkit-transform: translateY(-7px);
    transform: translateY(-7px);
  }

  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}
/*特点简介部分的样式*/
.intro-photo {
  height: 300px;
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.intro-photo img {
  display: block;
  margin-left: 20%;
}
.intro-photo span {
  display: block;
}
/*摄影作品展示区*/
.photo-album .top-bar {
  text-align: center;
  position: relative;
}
.photo-album p {
  color: #444;
  text-align: center;
  margin-bottom: 35px;
}
.photo-album .title {
  font-size: 28px;
}
.photo-album a {
  color: #444;
  text-decoration-style: none;
}
.photo-album .view-more {
  font-size: 16px;
  margin-left: 20px;
  position: absolute;
  right: 35%;
  top: 15px;
}
.photo-album .view-more:hover {
  cursor: pointer;
  color: #08af7f;
  text-decoration: none;
}
.photo-album .photos-show {
  height: 300px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  align-content: space-around;
}
.photo-album .photos-show .hovereffect {
  flex: 1;
  height: 350px;
  overflow: hidden;
  text-align: center;
  cursor: default;
  position: relative;
  padding: 20px;
}
.hovereffect .overlay {
  position: absolute;
  overflow: hidden;
  width: 50%;
  height: 60%;
  left: 25%;
  top: 20%;
  /* -webkit-transition: opacity 0.35s, -webkit-transform 0.35s; */
  /* transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: scale(0, 1);
  -ms-transform: scale(0, 1);
  transform: scale(0, 1); */
}

.hovereffect:hover .overlay {
  border-bottom: 1px solid #fff;
  border-top: 1px solid #fff;
  padding-top: 35px;
  opacity: 1;
  filter: alpha(opacity=100);
  /* -webkit-transform: scale(1);
  -ms-transform: scale(1);
  transform: scale(1); */
  display: flex;
  align-items: center;
  flex-direction: column;
}
.hovereffect img {
  -webkit-transition: all 0.35s;
  transition: all 0.35s;
  position: relative;
  width: 100%;
  height: 100%;
}
.hovereffect:hover img {
  filter: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter"><feComponentTransfer color-interpolation-filters="sRGB"><feFuncR type="linear" slope="0.6" /><feFuncG type="linear" slope="0.6" /><feFuncB type="linear" slope="0.6" /></feComponentTransfer></filter></svg>#filter');
  filter: brightness(0.6);
  -webkit-filter: brightness(0.6);
}
.hovereffect h2 {
  flex: 1;
  text-transform: uppercase;
  text-align: center;
  position: relative;
  font-size: 17px;
  background-color: transparent;
  color: #fff;
  padding-top: 1.5em;
  /* line-height: 100%; */
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(0, -100%, 0);
  transform: translate3d(0, -100%, 0);
}
.hovereffect .headImg {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  opacity: 0;
  filter: alpha(opacity=0);
  margin-top: 10px;
}
.hovereffect a,
.hovereffect .headImg {
  flex: 1;
  color: #fff;
  /* padding: 1em 0; */
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
  transition: opacity 0.35s, transform 0.35s;
  -webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
}
.hovereffect:hover a,
.hovereffect:hover .headImg,
.hovereffect:hover h2 {
  opacity: 1;
  filter: alpha(opacity=100);
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  text-decoration: none;
}

/*网站服务介绍*/
.intro-service {
  margin-top: 90px;
}
.intro-service .for-display {
  display: flex;
  justify-content: center;
}
.intro-service .service-content {
  line-height: 1.5em;
}
.intro-service .service-content h4 {
  color: #444;
  margin: 20px 0px 30px 10px;
}
.intro-service .service-content .content-item {
  margin-top: 20px;
  padding: 10px;
}
.intro-service .service-content .content-item h5 {
  color: #444;
}
.intro-service .service-content .content-item p {
  color: #444;
  margin-top: 20px;
  font-size: 17px;
}
.intro-service .service-img {
  margin-left: 40px;
}

/*发布需求部分*/
.give-demand {
  width: 100%;
  height: 500px;
  margin-top: 80px;
  background-image: url('/public/bg.jpg');
  background-position: center 20%;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  padding-top: 6%;
}
.give-demand h3 {
  color: #444;
  margin: 30px;
}
.give-demand a {
  margin-top: 5%;
  text-decoration: none;
  background-color: #08af7f;
  border-color: #08af7f;
  width: 300px;
  height: 65px;
  color: #fff;
  font-size: 1.6em;
  padding: 12px 0px;
}
</style>



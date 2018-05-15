<template>
    <div>
      <m-header bigTitle="可视化轻量级服务聚合器" smallTitle="ServLib"></m-header>
      <div class="container-fluid">
        <side-bar v-on:clickTab="convertContent"></side-bar>
        <div class="content-body">
          <router-link :to="newBtnTo" @click.native="clickNew">New</router-link>
          <entity-form v-show="newEntity"></entity-form>
          <service-list v-show="tab == 'Services'"></service-list>
          <entity-list v-show="tab == 'Entities'"></entity-list>
          <project-list v-show="tab == 'Projects'"></project-list>
        </div>
      </div>
    </div>
</template>
    
    <script>
    import MHeader from 'components/m-header'
    import SideBar from 'components/side-bar'
    import ServiceList from 'components/service-list'
    import EntityList from 'components/entity-list'
    import ProjectList from 'components/project-list.vue'
    import EntityForm from 'components/entity-form'
    import {mapMutations} from 'vuex'
    
    export default {
      data() {
        return {
          tab: 'Services',
          widgets: [],
          sources: [],
          newBtnTo: '',  // 判断在哪个选项卡下
          newEntity: false     // 实体表单是否show
        }
      },
      components: {
        MHeader,
        SideBar,
        ServiceList,
        EntityList,
        ProjectList,
        EntityForm
      },
      methods: {
        convertContent: function(payload) {
          this.tab = payload.clickWhich;
        },
        ...mapMutations({
          setSDMode: 'SET_SDMODE'
        }),
        clickNew: function() {
          // 在不同选项卡下点击New Btn路径不同
          if (this.tab === 'Services') {
            // servDetail新增模式渲染
            this.setSDMode('form');
            this.newBtnTo = '/servlib/new';
          } else if (this.tab === 'Projects') {
            this.newBtnTo = '/lsce';
          } else {
            this.newBtnTo = '#';
            this.newEntity = !this.newEntity;    
          }
        }

      },
      computed: {
      },
      mounted() {
       
      },
      created() {
    
      },
      watch: {

      }
    }
    </script>
    
    <style>
    .container-fluid {
        position: absolute;
        width: 70%;
        margin-left: 15%;
    }
    
    .content-body{
      position: absolute;
      margin-left: 140px;
      height: 100%;
      top: 45px;
      bottom: 40px;
      right: 0px;
      /*padding: 20px 0px 50px 90px;*/
    }
    </style>
<template>
<div>
  <m-header bigTitle="可视化轻量级服务聚合器" smallTitle="addServ"></m-header>
  <div class="container-fluid">
    <div>
      <div>
        <p>mode: {{formOrInfo}} </p>
        <router-link to="/servlib"> <— </router-link>
      </div>
      <form>
        <h2 style="margin-bottom: 20px">服务基本信息</h2>
        <table>
          <tr>
            <td><label>listName</label></td> 
            <td v-if="formOrInfo == 'info'"><input type="text" :value="thisService.listName" /> </td>
            <td v-else><input type="text" /> </td>
          </tr>
          <tr>
            <td><label>iconImg</label></td>           
            <td v-if="formOrInfo == 'info'"><img :src="thisService.iconImg" /> </td>
            <td v-else><input name="icon" type="file" />  </td>
          </tr>
          <tr>
            <td><label>servName</label></td>        
            <td v-if="formOrInfo == 'info'"><input type="text" :value="thisService.servName" /> </td>
            <td v-else><input type="text" /> </td>
          </tr>
        </table>
        <br />

        <h2 style="margin-bottom: 20px">接口信息</h2>
        <h3>输入<input type="button" value=" + " @click="toggleInputForm" /></h3>
        <!-- 输入添加表单 -->
        <div v-show="inputForm">
          <span v-for="col in columns">
            <label>{{col.name}}</label>
            <select v-if="col.dataSource" v-model="newItem[col.name]">
              <option v-for="opt in col.dataSource" :value="opt">{{ opt }}</option>
            </select>
            <input v-else type="text" v-model="newItem[col.name]">
          </span>
          <input type="button" value="save"  @click="saveInput" />
        </div>
        <!-- 输入管脚信息表格 -->
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th v-for="col in columns">{{col.name}}</th>
              <th>operation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(input,index) in inputs">
              <td>{{index+1}}</td>
              <td>{{input.name}}</td>
              <td>{{input.type}}</td>
              <td>
                <input type="button" value="delete"  @click="delInput(index)" />
              </td>
            </tr>
          </tbody>
        </table>
        <br /><br />

        <h3>输出<input type="button" value=" + " @click="toggleOutputForm" /></h3>
        <div v-show="outputForm">
          <span v-for="col in columns">
            <label>{{col.name}}</label>
            <select v-if="col.dataSource" v-model="newItem[col.name]">
              <option v-for="opt in col.dataSource" :value="opt">{{ opt }}</option>
            </select>
            <input v-else type="text" v-model="newItem[col.name]">
          </span>
          <input type="button" value="save"  @click="saveOutput" />
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th v-for="col in columns">{{col.name}}</th>
              <th>operation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(output,index) in outputs">
              <td>{{index+1}}</td>
              <td>{{output.name}}</td>
              <td>{{output.type}}</td>
              <td>
                <input type="button" value="delete"  @click="delOutput(index)" />
              </td>
            </tr>
          </tbody>
        </table>
         <br />

        <h2 style="margin-bottom: 20px">界面信息</h2>
        <textarea v-model="code.html"></textarea>
        <br />
        <textarea v-model="code.css"></textarea>
        <br />
        <textarea v-model="code.js"></textarea>
        <input type="button" @click="preview" value="点击运行" />
        <div id="iframewrapper"></div>

        <input type="submit" value="提交表单" />
      </form>
    </div>
  </div>
</div> 
</template>

<script>
  import MHeader from 'components/m-header'
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        tab: 'Services',
        widgets: [],
        sources: [],
        // 从vuex中查这个服务信息
        thisService: {},
        columns: [
          {
            name: 'name',
            isKey: true
          }, {
            name: 'type',
            dataSource: ['Str', 'Num', 'Bool']
          }
        ],
        inputs: [
          {
            name: 'input1',
            type: 'str'
          }, {
            name: 'input2',
            type: 'num'
          }
        ],
        outputs: [],
        inputForm: false,
        outputForm: false,
        newItem: {},   // 新增内容
        htmlText: '',
        cssText: '',
        jsText: '',
        code: {
          html: " <h1 id='h1'>我的第一个 JavaScript 程序</h1> <p id='demo'>这是一个段落</p> <button type='button' onclick='displayDate()'>显示日期</button> ",
          css: ' #h1 { color:orange; text-align:center; } ',
          js: "function displayDate(){ document.getElementById('demo').innerHTML=Date(); } "
        }
      }
    },
    components: {
      MHeader
    },
    created() {
      var servName = this.$route.params.servName;
      /*  重写iconImg属性方便img的src动态赋值 */
      if (this.formOrInfo === 'info') {
        var servObj = this.getServiceById(servName);
        servObj.iconImg = '../' + servObj.iconImg;
      }
      /***************************************/
      this.thisService = servObj;
      // console.log(JSON.stringify(this.getServiceById(servName)))
    },
    computed: {
      ...mapGetters([
        'getServiceById',
        'formOrInfo' // 是新增服务还是查看详情？
      ])
    },
    methods: {
      delInput: function(index) {
        this.inputs.splice(index, 1);
      },
      toggleInputForm: function() {
        if (this.inputForm) {
          this.inputForm = false;
        } else {
          this.inputForm = true;
          this.outputForm = false;
        }
      },
      saveInput: function() {
        this.inputs.push(this.newItem);
        this.newItem = {};
      },
      delOutput: function(index) {
        this.outputs.splice(index, 1);
      },
      toggleOutputForm: function() {
        if (this.outputForm) {
          this.outputForm = false;
        } else {
          this.outputForm = true;
          this.inputForm = false;
        }
      },
      saveOutput: function() {
        this.outputs.push(this.newItem);
        this.newItem = {};
      },
      preview: function() {
        // <\/script> eslint 总报no-useless-escape 不知道怎么改
        // eslint-disable-next-line
        var text = this.code.html + '<script>' + this.code.js + '<\/script>';
        console.log(text);
        var ifr = document.createElement('iframe');
        ifr.setAttribute('frameborder', '0');
        ifr.setAttribute('id', 'iframeResult');  
        document.getElementById('iframewrapper').innerHTML = '';
        document.getElementById('iframewrapper').appendChild(ifr);
            
        var ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
        ifrw.document.open();
        ifrw.document.write(text);  
        // 添加样式
        var styleTag = document.createElement('style');
        styleTag.innerHTML = this.code.css;
        ifrw.document.getElementsByTagName('head')[0].appendChild(styleTag);

        ifrw.document.close();
      }
    }   
  }
</script>
        
<style>
.container-fluid {
    position: absolute;
    width: 70%;
    margin-left: 15%;
    height: 100%;
    top: 45px;
    bottom: 40px;
}
textarea {
  width: 100%;
  height: 50px;
}
</style>
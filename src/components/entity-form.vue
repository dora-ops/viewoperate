<template>
<div>
  <form method="post">
    <table class="table table-striped" border="1">
      <thead>
        <tr><th colspan="4">new entity</th></tr>
      </thead>
      <tbody>
        <tr>
            <td>name:</td>
            <td><input type="text" name="entityname" /></td>
        <tr>
          <td>service:</td>
          <td>
            <select>
              <option value ="" class="opt-tip">请选择要绑定的service</option>
              <option v-for="(service) in services" :value="service.servName">{{service.servName}}  (data-type:{{service.dataType}})</option>
            </select>
          </td>
        </tr>                    
        <tr>
          <td>source:</td>
          <td>
              <select name="UID" id="device_select">
                    <option value ="" class="opt-tip">请选择根据service的data-type选择数据源 </option>
                    <option v-for="(device) in devices" :value="device.deviceName">{{device.deviceName}}  (data-type:{{device.dataType}})</option>
                    <option value ="btn1"> btn1 </option>
                </select>
                <input id="devices_array" style="display:none;"  type="text" value = "<%= JSON.stringify(devices) %>" />
          </td>
        </tr> 
        <tr>
          <td>initialData:</td>
          <td><input type="text" placeholder="绑定后需要的数据的初始值...     " /></td>
        <tr>                   
        <tr>
          <td colspan="2"><input type="submit" value="Save" /></td>
        </tr>
      </tbody>
    </table>
  </form>
</div>
</template>
<script>
import {mapGetters} from 'vuex'

export default{
  name: 'entity-form',
  data() {
    return {
      devices: []   // 请求的设备资源
      
    }
  },
  created() {
    this.getsrclist()
  },
  computed: {
    ...mapGetters([
      'services'
    ])  
  },
  methods: {
    getsrclist: function() {
      var _this = this
      this.$http.get('../../static/virtualSources.json')
                .then(function(res) {
                  var result = res.body.sources
                  _this.devices = result
                })
    }
  }
}
</script>
<style>
select {
    color:green;
}
</style>
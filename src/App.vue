<template>
<v-app id="app">
    <Layout>
        <template slot="outlet">
            <router-view></router-view>
        </template>
    </Layout>
</v-app>
</template>

<script>
import { eventBus } from './eventBus.js';
import Layout from '@/components/layout/Layout';

 export default {
     name: 'app',
     components: { Layout },
     data() {
         return {
             commitParams: {},
             templateId: 'aat',
             workflowObj: {},
             displayFileMenu: false,
             fromView: '',
             modify: false
         };
     },
     created() {
         eventBus.$on('displayFileMenu', function (obj) {
             this.fromView = obj.fromView;
             this.displayFileMenu =true;
             this.workflowObj = obj.workflowObj;
         }.bind(this));

         eventBus.$on('hideFileMenu', function () {
             this.displayFileMenu = false;
             this.templateId = '';
         }.bind(this));

         eventBus.$on('setModify', function (obj) {
             this.modify = obj.modify;
         }.bind(this));
     }
 };
</script>

<style lang="scss" scoped>
#app {
    border: 1px solid red;
}
</style>

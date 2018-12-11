<template>
    <div>
        <h2>{{ welcomeMsg }}</h2>
        <br>
        <br>
        <template-selector
            ref="templateSelector"
            v-if="select"
            @templateSelected="loadTemplateObjects"
            @configureNewWorkflow="configureWorkflow"
            @modifyWorkflow="modifyWorkflow"
        >
        </template-selector>
        <router-view></router-view>
    </div>
</template>

<script>
 import { eventBus } from '@/eventBus.js';
 import 'bootstrap/dist/css/bootstrap.css';
 import 'bootstrap-vue/dist/bootstrap-vue.css';
 import TemplateSelector from './TemplateSelector.vue';
 import Workflow from '../Workflow.js';
 
 export default {
     data() {
         return {
             welcomeMsg: '',
             selectedTemplate: '',
             baseTemplateObj: null,
             stepTemplateObj: null,
             displayFileMenu: false,
             workflows: [],
             select: true             
         };
     },
     methods: {
         loadWelcomeMsg() {
             return this.$http.get()
                        .then(
                            /*eslint-disable  no-unused-vars*/
                            response => {
                                this.welcomeMsg = response.body;
                                return response.body;
                            },
                            response => alert('Error in Workflows.vue::loadMsg')
                            /*eslint-enable no-unused-vars*/
                        );
         },         
         loadTemplateObjects(obj) {
             this.selectedTemplate = obj.name;
             this.loadTemplate('base');
             this.loadTemplate(this.selectedTemplate);
         },
         configureWorkflow() {
             this.select = false;
             let workflowObj = this.createWorkflowObj(
                 this.selectedTemplate,
                 this.baseTemplateObj,
                 this.stepTemplateObj
             );
             this.$router.push({
                 name: 'configWorkflow',
                 params: {
                     workflowObj: workflowObj
                 }
             });
         },
         modifyWorkflow() {
             eventBus.$emit('setModify', { modify: true });
             this.workflows = [];
             let element = this.$refs.templateSelector;
             this.$http.get('query_workflow' + '/' + element.selectedTemplate.name)
                 .then(
                     response => {
                         response.data.forEach((e) => {
                             let workflowObj = this.createWorkflowObj(
                                 e.assay,
                                 JSON.parse(e.baseConfig),
                                 JSON.parse(e.stepConfig),
                                 e.workflowName,
                                 e.userId,
                                 e.lastModified
                             );
                             
                             this.workflows.push(workflowObj);   
                         });
                         
                         this.$router.push({
                             name: 'findWorkflows',
                             params: {
                                 workflows: this.workflows,
                                 fromView: 'findWorkflows'
                             }
                         });
                             
                         eventBus.$emit('hideFileMenu');
                     },
                     err => console.error(err)
                 );
         },
         loadTemplate(templateName) {
             let template = this.$store.getters.getWorkflowTemplate(templateName);             

             if (! template) {
                 let promiseObj = this.getTemplate(templateName);
                 promiseObj.then(
                     function(result) {
                         let clone = this.cloneObj(result);
                         if (templateName === 'base') {
                             console.log('saving base template');
                             this.baseTemplateObj = clone;
                         } else {
                             console.log('saving step template');
                             this.stepTemplateObj = clone;
                         }                         
                     },
                     function(err) {
                         /*eslint-disable no-console*/
                         console.log(err);
                     }
                 );
             } else {
                 this.stepTemplateObj = this.cloneObj(template);
             }
         },
         getTemplate(name) {
             console.log('getting template ' + name);
             return this.$http.get('template/' + name)
                        .then(
                            response => response.json(),
                            /*eslint-disable no-unused-vars*/
                            response => alert('Error getting template for ' + name)
                            /*eslint-enable no-unused-vars*/
                        ).then( function(jsonObj) {
                            let templateObj = {
                                name: name,
                                config: jsonObj
                            };
                            this.$store.commit('addWorkflowTemplate', templateObj);
                            return templateObj;
                        }).catch( () => {
                            console.log('This template is not implemented yet');
                        });
         },
         createWorkflowObj(assay, baseConfig, stepConfig, workflowName, userId, lastModified) {
             return new Workflow(assay, baseConfig, stepConfig, workflowName, userId, lastModified);
         },
         cloneObj(obj) {
             return JSON.parse(JSON.stringify(obj));
         }
     },
     created() {
         this.loadWelcomeMsg();
     },
     components: {
         'template-selector': TemplateSelector
     },
     beforeRouteEnter(to, from, next) {
         next( (vm) => {
             vm.select = true;
             eventBus.$emit('hideFileMenu');
         });
     }
 };
</script>
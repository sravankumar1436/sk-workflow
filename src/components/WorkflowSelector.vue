<template>
    <div>
        <div v-if="workflows.length">
            <table ref="savedWorkflows">
                <caption>Saved Workflows</caption>
                <thead>
                    <tr class="query-result-header">
                        <th>Workflow Name</th>
                        <th>User ID</th>
                        <th>Last Modified</th>
                        <th colspan="2"></th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="w in workflows" :key="w.workflowName" class="query-result-row">
                        <td>{{ w.workflowName }}</td>
                        <td>{{ w.userId }}</td>
                        <td>{{ formatModifyDate(w.lastModified) }}</td>
                        <td>
                            <b-button
                                variant="primary"
                                size="sm"
                                @click="previewWorkflow(w.workflowName)"
                            >
                                Preview
                            </b-button>
                        </td>
                        <td>
                            <b-button
                                variant="primary"
                                size="sm"
                                @click="selectWorkflow(w.workflowName)"
                            >
                                Select
                            </b-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <h2>No saved workflows matched your query</h2>
        </div>
        <br>
        <b-button variant="primary" @click="done">Close</b-button>
    </div>    
</template>

<script>
 import moment from 'moment';
 import { eventBus } from '../eventBus.js';
 
 export default {
     props: {
         workflows: {
             type: Array,
             required: true
         },
         fromView: {
             required: true
         }
     },
     computed: {
         caption: () => {
             return this.workflows.length ? 'Saved Workflows' : 'No Saved Workflows Found';
         }
     },
     data() {
         return { workflowObj: {} };
     },
     methods: {
         previewWorkflow(workflowName) {
             let workflowObj = this.workflows.find((e) => e.workflowName === workflowName);

             this.$router.push(
                 {
                     name: 'previewConfig',
                     params: {
                         workflowObj: workflowObj,
                         fromView: this.fromView,
                         workflows: this.workflows
                     }
                 }
             );
         },
         selectWorkflow(workflowName) {
             let workflowObj = this.workflows.find((e) => e.workflowName === workflowName);
             // console.log(workflowObj);
 
             this.$router.push(
                 {
                     name: 'configWorkflow',
                     params: {
                         workflowObj: workflowObj
                     }
                 }
             );

             eventBus.$emit('displayFileMenu',
                            {
                                workflowObj: workflowObj,
                                fromView: 'configWorkflow'
                            });
         },         
         formatModifyDate(seconds) {
             let date = moment.unix(seconds);
             let locale = navigator.language;
             date.locale(locale);
             return date.format('LLL');
         },
         done() {
             this.$router.push({
                 name: 'Home'
             });
         }
     }
 };
</script>

<style>
 .query-result-header th {
     border: 1px solid;
     padding-top: 5px !important;
     padding-bottom: 5px !important;
     padding-right: 5px !important;
     padding-left: 5px !important;
 }
 .query-result-row td {
     border: 1px solid;
     padding-top: 5px !important;
     padding-bottom: 5px !important;
     padding-right: 5px !important;
     padding-left: 5px !important;
 }
 caption {
     caption-side: top;
     text-align: center;
     font-weight: bold;
     font-size: x-large;
     color: black;
 }
</style>
<template>
    <div>
        <div>
            <b-container fluid>
                <h4>Commit Workflow Configuration</h4>
                <br>
                <b-row align-h="start">
                    <b-col cols="1">
                        <strong>Workflow Type: </strong>
                    </b-col>
                    <b-col cols="1">
                        <strong>{{ workflowObj.assayId.toUpperCase() }}</strong>
                    </b-col>
                    <b-col cols="1">
                        <strong>Workflow Name: </strong>
                    </b-col>
                    <b-col cols="1">
                        <strong>{{ workflowName }}</strong>
                    </b-col>
                </b-row>
                <b-row align-h="start">
                    <b-col cols="2">
                        <strong>User ID: </strong>
                    </b-col>
                    <b-col>
                        <input ref="userId" type="text" v-model="userId" />        
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-alert
                            :show="showFailureAlert"
                            variant="danger"
                            dismissible
                            @dismissed="showFailureAlert=false"
                        >
                            {{ failureMsg }}
                        </b-alert>
                    </b-col>                
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-alert
                            :show="dismissCountdown"
                            variant="success"
                            dismissible
                            @dismissed="dismissCountdown=0"
                            @dismiss-count-down="countDownChanged"
                        >
                            {{ successMsg }}
                        </b-alert>
                    </b-col>
                </b-row>
                <br>
                <br>
            </b-container>
        </div>
        <b-button
            variant="primary"
            :disabled="!workflowName || !userId || committed"
            @click="commit"
        >
            Commit Configuration
        </b-button>
        <b-button variant="primary" @click="cancel">Cancel</b-button>
        <br>
        <br>
        <div v-if="showInvalidItems">
            <textarea cols="80" rows="20" :value="validationError"></textarea>
        </div>
    </div>
</template>

<script>
 import moment from 'moment';
 import { eventBus } from '../eventBus.js';
 
 export default {
     props: {
         workflowObj: {
             type: Object,
             required: true
         },
         modify: {
             type: Boolean,
             required: true
         }
     },
     data() {
         return {
             workflowName: '',
             userId: '',
             committed: false,
             dismissSecs: 2,
             dismissCountdown: 0,
             successMsg: '',
             failureMsg: '',
             showFailureAlert: false,
             valid: false,
             showInvalidItems: false,
             validationError: 'Cannot save the workflow to the database:\n\n' +
                              'Steps containing invalid data or missing required data:\n\n'
         };
     },
     methods: {
         commit() {
             if (! this.$refs.userId.value) {
                 this.failureMsg = 'User ID is required';
                 this.showFailureAlert = true;
                 return;
             } else {                 
                 this.validate();

                 if (this.valid) {
                     if (this.modify) {
                         this.updateWorkflow();
                     } else {
                         this.insertWorkflow();   
                     }                                          
                 } else {
                     this.showInvalidItems = true;
                 }
             }             
         },
         validate() {
             if (! this.workflowObj.isValid()) {
                 this.validationError =  this.validationError +
                                         this.workflowObj.displayInvalidFields();
             } else {
                 this.valid = true;                 
             }
         },
         insertWorkflow() {             
             this.$http.post('save_workflow',
                             {
                                 assay: this.workflowObj.assayId,
                                 workflowName: this.workflowName,
                                 baseConfig: this.workflowObj.getBaseObjAsString(),
                                 stepConfig: this.workflowObj.getStepObjAsString(),
                                 userId: this.userId,
                                 lastModified: moment().unix()
                             })
                 .then (
                     response =>  {
                         this.successMsg = response.body;
                         this.dismissCountdown = this.dismissSecs;
                         this.committed = true;
                     },
                     err => {
                         this.failureMsg = err.body;
                         this.showFailureAlert = true;
                     }
                 );
         },
         updateWorkflow() {
             //             let changeSet = this.$store.getters.getChangeSet(this.templateId);
             this.$http.post('update_workflow',
                             {
                                 //                                 changeSet: changeSet,
                                 assay: this.workflowObj.assayId,
                                 workflowName: this.workflowObj.workflowName,
                                 baseConfig: this.workflowObj.getBaseObjAsString(),
                                 stepConfig: this.workflowObj.getStepObjAsString(),
                                 userId: this.userId,
                                 lastModified: moment().unix()
                             })
                 .then (
                     response =>  {
                         this.successMsg = response.body;
                         this.dismissCountdown = this.dismissSecs;
                         this.committed = true;
                     },
                     err => {
                         this.failureMsg = err.body;
                         this.showFailureAlert = true;
                     }
                 );             
         },
         countDownChanged(dismissCountdown) {
             this.dismissCountdown = dismissCountdown;
         },
         cancel() {
             if (this.modify) {
                 eventBus.$emit('setModify', { modify: false });    
             }             

             let routeName = this.valid ? 'Home' : 'configWorkflow';
             let routeParams = this.valid ? {} : {
                 workflowObj: this.workflowObj
             };
             
             this.$router.push({ name: routeName, params: routeParams });             
         }
     },
     created() {
         let params = this.workflowObj.getOptGroup('runtimeParameters');
         this.workflowName = params.options.find((e) => e.name === 'workflowName').value;
     },
     mounted() {
         if (! this.workflowName) {
             this.failureMsg = 'Workflow Name is required';
             this.showFailureAlert = true;             
         }
     }

 };
</script>
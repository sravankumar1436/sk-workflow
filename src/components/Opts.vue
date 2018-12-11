<template>
    <div>
        <h4>{{ buildTitle }}</h4>
        <br>
        <b-container fluid>
            <div v-if="opts.length > 0">
                <div v-for="o of opts">
                    <b-row class="row">
                        <b-col cols="4">
                            <strong>{{ o.type === 'Label' ? o.value : o.label }}</strong>
                            <div v-if="o.type === 'Label'">
                                <hr class="hr-section" align="left" width="100%">
                                <br>
                            </div>
                        </b-col>
                        <div v-if="o.type !== 'Label'">
                            <b-col>
                                <input-field
                                    :ref="o.name"
                                    class="input-field"
                                    :workflowObj="workflowObj"
                                    :option="o"
                                    :fieldName="o.name"
                                    :optGroup="optGroup"
                                    v-on:fieldUpdated="updateOptions"
                                >
                                </input-field>
                            </b-col>
                        </div>
                    </b-row>
                </div>
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
            </div>
            <div v-else>
                <p>No options to configure for {{ exeName }}</p>
            </div>
            <br>
            <br>
            <button ref="saveBtn" class="btn btn-primary" @click="saveOpts()">OK</button>
            <button class="btn btn-primary" @click="undoChanges()">Undo</button>
        </b-container>
    </div>
</template>

<script>
 import Input from './input/Input.vue';
 import { eventBus } from '../eventBus.js';
 import { updatedDiff } from 'deep-object-diff';
 
 export default {
     components: {
         'input-field': Input
     },
     props: {
         type: {
             required: true
         },
         options: {
             type: Array,
             required: true
         },
         workflowObj: {
             type: Object,
             requried: true
         },
         sectionName: {
             type: String,
             required: true
         },
         stepName: {
             type: String,
             required: false
         },
         exeName: {
             type: String,
             required: false
         },
         optGroup: {
             type: Object,
             required: true
         }
     },
     data() {
         return {
             opts: {},
             savedOpts: {},
             navButtonClicked: false,
             dirtyFields: false,
             dismissSecs: 2,
             dismissCountdown: 0,
             successMsg: '',
             failureMsg: '',
             showFailureAlert: false
         };
     },
     /* eslint-disable no-console */
     computed: {
         buildTitle: function() {
             if (this.type === 'base') {
                 return this.optGroup.label + ' Options';
             } else if (this.type === 'exe') {
                 const label = this.workflowObj.getStepObj(this.sectionName, this.stepName).label;
                 return 'Options for ' +  label + ': ' + this.exeName;
             }
         }
     },
     methods: {
         isValid() {
             let valid = true;
             for (let ref in this.$refs) {
                 let element = this.$refs[ref];
                 const hasOption = this.options.find((e) => e.name === ref);
                 if (
                     hasOption &&
                     element[0].option.required &&
                     ! element[0].valid
                 ) {
                     element[0].$children[0].$el.style = 'border: 2px solid red;';
                     valid = false;
                 }
             }
             return valid;
         },
         cloneObj(obj) {
             if (obj && Object.keys(obj).length > 0) {
                 return JSON.parse(JSON.stringify(obj));
             }
         },
         getDiffObject() {
             const lhs = this.savedOpts;
             const rhs = this.opts;
             return updatedDiff(lhs, rhs);
         },
         saveOpts() {
             if (! this.isValid()) {
                 this.failureMsg = 'Please correct invalid values before saving';
                 this.showFailureAlert = true;
                 return;
             }

             let diff = this.getDiffObject();
             console.log('saving changes');
             this.savedOpts = this.cloneObj(this.opts);
             this.dirtyFields = false;
             eventBus.$emit('saveOptions', {
                 options: this.opts,
                 optGroup: this.optGroup.name,
                 diff: diff
             });
         },
         undoChanges() {
             console.log('undoing changes');
             this.opts = this.cloneObj(this.savedOpts);
             this.dirtyFields = false;
             eventBus.$emit('revertChanges', {opts: this.opts});
         },
         updateOptions(obj) {
             let opt = this.opts.find((e) => e.name === obj.fieldName);
             opt.value = obj.fieldValue;
             this.dirtyFields = true;
         },
         cloneOptions(options) {
             if (options.length === 0) {
                 this.opts = Array(0);
             } else {
                 this.opts = this.cloneObj(options);
             }
             
             this.savedOpts = this.cloneObj(this.opts);
         },
         countDownChanged(dismissCountdown) {
             this.dismissCountdown = dismissCountdown;
         },
         warnOnDirtyFields() {
             if (this.dirtyFields) {
                 console.log('dirty fields detected');
                 if (! confirm('The form contains unsaved changes!\nDo you want to navigate to a different form?')) {
                     console.log('aborting navigation');
                     return false;
                 } else {
                     console.log('abandoning changes');
                 }
             } else {
                 console.log('no dirty fields detected');
             }
             Object.assign(this.$data, this.$options.data());
             this.$refs = {};
             return true;
         }
     },
     created() {
         console.log('Opts::created');
         this.cloneOptions(this.options);
         eventBus.$on('saveFailed-opts', function (obj) {
             this.failureMsg = obj.e.message;
             this.showFailureAlert = true;
         }.bind(this));

         eventBus.$on('savedOptions-opts', function (obj) {
             this.successMsg = 'Saved changes to ';
             if (obj.optionType === 'exe') {
                 this.successMsg += this.stepName + ': ' + this.exeName;
             } else if (obj.optionType === 'base') {
                 this.successMsg += this.optGroup.label;
             }
             this.dismissCountdown = this.dismissSecs;
         }.bind(this));
     },
     beforeRouteLeave(to, from, next) {
         let leaveRoute = this.warnOnDirtyFields();

         if (leaveRoute && to.path !== '/') {
             if (to.params.options) {
                 this.cloneOptions(to.params.options);
             }             
         }

         next(leaveRoute);
     },
     beforeRouteUpdate(to, from, next) {
         let updateRoute = this.warnOnDirtyFields();

         if (updateRoute) {
             this.cloneOptions(to.params.options);
         }

         next(updateRoute);
     },
     destroyed() {
         console.log('Opts::destroyed');
         eventBus.$off('saveFailed-opts');
         eventBus.$off('savedOptions-opts');
     }
 };
</script>

<style>
 .input-field {
     margin-top: 10px;
     margin-bottom: 10px;
 }
 .input-table {
     table-layout: fixed;
 } 
 .input-table td {
     padding-left: 1px !important;
     padding-right: 1px !important;
     vertical-align: middle !important;
 }
 .option-label {
     width: 40%
 }
 .opts-container {
     margin-right: 0px !important;
     margin-left: 0px !important;
     padding-right: 0px !important;
     padding-left: 0px !important;
 }
 .hr-section {
     margin-top: 1px;
     margin-bottom: 5px;
     border: 0;
     border-top: 2px solid black;
 }
</style>
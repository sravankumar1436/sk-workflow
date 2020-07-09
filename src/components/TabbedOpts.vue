<template>
    <div>
        <h4>{{ buildTitle }}</h4>
        <br>
        <b-container>
            <b-tabs no-fade>
                <div v-for="o of options">
                    <b-tab
                        v-if="o.type === 'Label'"
                        :title="o.value"
                        :active="isActive(o.name)"
                    >
                        <br>
                        <div v-for="opt of optionsForLabel(o.name)">
                            <b-row>
                                <b-col cols="4">
                                    <strong>{{ opt.label }}</strong>
                                </b-col>                                    
                                <b-col
                                    <input-field
                                        :ref="opt.name"
                                        class="input-field"
                                        :workflowObj="workflowObj"
                                        :option="opt"
                                        :fieldName="opt.name"
                                        :optGroup="optGroup"
                                        v-on:fieldUpdated="updateOptions"
                                    >
                                    </input-field>
                                </b-col>
                            </b-row>
                        </div>
                    </b-tab>
                </div>
            </b-tabs>
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
        </b-container>
        <br>
        <br>
        <button ref="saveBtn" class="btn btn-primary" @click="saveOpts()">OK</button>
        <button class="btn btn-primary" @click="undoChanges()">Undo</button>
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
         },
         workflowObj: {
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
                     //                     element[0].$children[0].option.required &&
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
             this.opts = this.cloneObj(options);
             this.savedOpts = this.cloneObj(this.opts);
         },
         optionsForLabel(labelName) {
            if(this.opts){
               let index = this.opts.findIndex((e) => e.type === 'Label' && e.name === labelName);
                let optsForLabel = this.options.slice(index + 1);
                let nextIndex = optsForLabel.findIndex((e) => e.type === 'Label');
                if (nextIndex !== -1) {
                    return optsForLabel.slice(0, nextIndex);
                } else {
                    return optsForLabel;
                } 
            }
         },
         isActive(labelName) {
             return labelName === 'referenceFiles';
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
         console.log('TabbedOpts::created');
         this.cloneOptions(this.options);
         eventBus.$on('saveFailed-tabbed-opts', function (obj) {
             this.failureMsg = obj.e.message;
             this.showFailureAlert = true;
         }.bind(this));

         eventBus.$on('savedOptions-tabbed-opts', function () {
             this.successMsg = 'Saved changes to ' + this.stepName + ': ' + this.exeName;
             this.dismissCountdown = this.dismissSecs;
         }.bind(this));
     },
     beforeRouteLeave(to, from, next) {
         let leaveRoute = this.warnOnDirtyFields();

        // if(to.params.options.length === 0){
        //     this.$snotify.info(`No options to configure for ${to.params.exeName}`, {
        //         timeout: 5000,
        //         showProgressBar: true,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         position: "centerCenter",
        //         preventDuplicates: true,
        //         oneAtTime: true,
        //     });
        //     next(false);
        // }
        if (leaveRoute) {
             this.cloneOptions(to.params.options);
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
         console.log('TabbedOpts::destroyed');
         eventBus.$off('saveFailed-tabbed-opts');
         eventBus.$off('savedOptions-tabbed-opts');
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
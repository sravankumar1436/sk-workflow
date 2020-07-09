<template>
    <div>
        <b-container fluid>
            <br>
            <b-row>
                <b-col offset-sm="4" offset-lg="3" cols="4"><h4>{{ workflowType }}</h4></b-col>
                <b-col cols="4"><h4>{{ workflowTitle }}</h4></b-col>                
            </b-row>            
            <b-row>
                <b-col sm="4" md="3" lg="2">
                    <explorer
                        :workflowObj="workflowObj"
                    >
                    </explorer>
                </b-col>
                <b-col offset="1" md="8" sm="6" >
                    <div v-if="showStepList"> 
                        <step-list
                            
                            :workflowObj="workflowObj"
                        >
                        </step-list>
                    </div>
                    <div v-else >
                        <router-view></router-view>
                    </div>
                    <!--
                         <opts v-else-if="optsType === 'opts'"
                         ref="opts"
                         :workflowObj="workflowObj"
                         :sectionName="sectionName"
                         :stepName="stepName"
                         :exeName="exeName"
                         :options="options"
                         :title="title"
                         :type="optionType"
                         :optGroup="optGroup"
                         :optionType="optionType"
                         >
                         </opts>
                         <tabbed-opts v-else="optsType === 'tabbed-opts'"
                         ref="opts"
                         :workflowObj="workflowObj"
                         :stepName="stepName"
                         :exeName="exeName"
                         :options="options"
                         :title="title"
                         :optGroup="optGroup"
                         :optionType="optionType"
                         >
                         </tabbed-opts>
                    -->
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
 import { eventBus } from '../eventBus.js';
 import StepList from './StepList.vue';
 import ConfigExplorer from './ConfigExplorer.vue';
 import Opts from './Opts.vue';
 import TabbedOpts from './TabbedOpts';
 
 export default {
     name: 'Configuration',
     /* eslint-disable no-console */
     props: {
         workflowObj: {
             type: Object,
             required: true
         }
     },
     data() {
         return {
             sectionName: '',
             stepName: '',
             exeName: '',
             toolTemplates: {},
             optGroup: {},
             programObj: null,
             optionType: '',
             title: '',
             options: [],
             cachedOptions: [],
             showStepList: true
         };
     },
     computed: {
         workflowName: function() {
             let workflowName = this.workflowObj.workflowName;
             return workflowName || 'New Workflow';
         },
         templateTitle: function() {
             return this.$store.getters.getTemplateTitle(this.workflowObj.assayId);
         },
         workflowType: function() {
             return 'Workflow Type: ' + this.templateTitle;
         },
         workflowTitle: function() {
             return ' Workflow Name: ' + this.workflowName;
         },
         optsType: function() {
             return (this.options.findIndex((e) => e.type === 'Label') !== -1 ? 'tabbed-opts' : 'opts');
         }
     },
     methods: {
         loadToolTemplates(step) {
             step.externalPrograms.forEach((p) => {
                 let toolTemplateObj = this.toolTemplates[p.name];
                 if (! toolTemplateObj) {
                     const baseName = p.name.split('.')[0];
                     toolTemplateObj = this.$store.getters.getToolTemplate(baseName);
                     if (! toolTemplateObj) {
                         this.loadToolTemplate(baseName).then(
                             obj => {
                                 this.workflowObj.addToolTemplate(p.name, obj);
                                 this.workflowObj.mergeToolTemplate(p);
                             },
                             err => console.log(err)
                         );
                     } else {
                         this.workflowObj.addToolTemplate(p.name, toolTemplateObj);
                         this.workflowObj.mergeToolTemplate(p);
                     }
                 } else {
                     this.workflowObj.mergeToolTemplate(p);
                 }
             });
         },
         loadToolTemplate(name) {
             return this.$http.get('tooltemplate/' + name)
                        .then(
                            response => response.json(),
                            /* eslint-disable no-unused-vars */
                            response => alert('Error getting tool template for ' + name)
                            /* eslint-enable no-unused-vars */
                        ).then(function(jsonObj) {
                            let templateObj = {
                                name: name,
                                config: jsonObj
                            };
                            this.$store.commit('addToolTemplate', templateObj);
                            return templateObj;
                        });
         },
         displayStepOpts() {
             this.showStepList = true;
         },
         //         buildTitle() {
         //             const label = this.workflowObj.getStepObj(this.sectionName, this.stepName).label;
         //             return 'Options for ' +  label + ': ' + this.exeName;
         //         },
         displayExeOpts(obj) {
             console.log('displaying exe options for ' + obj.exeName);
             this.optGroup = {};
             this.sectionName = obj.sectionName;
             this.stepName = obj.stepName;
             this.exeName = obj.exeName;
             this.cachedOptions = this.cloneObj(this.options);
             this.programObj = this.workflowObj.getProgramObj(
                 this.sectionName,
                 this.stepName,
                 this.exeName
             );
             this.options = this.programObj.options;
             this.showStepList = false;
             this.optionType = 'exe';
             //this.title = this.buildTitle();
             this.$router.push(
                 {
                     name: this.optsType === 'opts' ? 'Opts' : 'TabbedOpts',
                     params: {
                         id: this.exeName,
                         stepId: this.stepName,
                         workflowObj: this.workflowObj,
                         options: this.options,
                         sectionName: this.sectionName,
                         stepName: this.stepName,
                         exeName: this.exeName,
                         type: this.optionType,
                         optGroup: this.optGroup
                     }
                 }
             );
         },
         displayBaseOpts(obj) {
             console.log('displaying base options for ' + obj.groupName);
             this.optGroup = this.workflowObj.getOptGroup(obj.groupName);
             //             this.optGroup.valid = false;
             this.cachedOptions = this.cloneObj(this.options.length ? this.options : this.optGroup.options);
             this.options = this.optGroup.options;
             this.showStepList = false;
             this.optionType = 'base';
             this.title = obj.groupLabel + ' Options';
             this.$router.push(
                 {
                     name: this.optsType === 'opts' ? 'Opts' : 'TabbedOpts',
                     params: {
                         id: this.optGroup.name,
                         workflowObj: this.workflowObj,
                         options: this.options,
                         sectionName: this.sectionName,
                         stepName: this.stepName,
                         exeName: this.exeName,
                         type: this.optionType,
                         optGroup: this.optGroup
                     }
                 }
             );
         },
         saveOptions(obj) {
             try {
                 this.cachedOptions = this.cloneObj(obj.options);

                 //             this.$store.commit(
                 //                 'setChangeSet',
                 //                 {
                 //                     workflowName: this.templateId,
                 //                     optGroupName: obj.optGroup ? obj.optGroup : '',
                 //                     stepName: obj.step ? obj.step : '',
                 //                     exeName: obj.exe ? obj.exe : '',
                 //                     diff: obj.diff
                 //                 });
                 if (this.optionType === 'base') {
                     let optGroup = this.workflowObj.getOptGroup(obj.optGroup);

                     for (let i in obj.diff) {
                         optGroup.options[i].value = obj.diff[i].value;
                     }

                     optGroup.valid = true;
                 } else if (this.optionType === 'exe') {
                     this.programObj.options = this.cloneObj(obj.options);
                     this.programObj.valid = true;
                     this.workflowObj.checkStepValidity(this.sectionName, this.stepName);
                 }

                 eventBus.$emit('savedOptions-' + this.optsType, { optionType: this.optionType });
             } catch (e) {
                 eventBus.$emit('saveFailed-' + this.optsType, {error: e});
             }
         },
         cloneObj(obj) {
             let optArray = JSON.parse(JSON.stringify(obj));
             return optArray;
         },
         toTitleCase(str) {
             let words = str.split(' ').map((w) => w.slice(0, 1).toUpperCase() + w.slice(1));
             return words.join(' ');
         }
     },
     created() {
         console.log('Configuration::created');
         eventBus.$on('displayBaseOpts', (obj) => { this.displayBaseOpts(obj); });
         eventBus.$on('displayExeOpts', (obj) => {
             this.displayExeOpts(obj);
         });
         eventBus.$on('revertOptions', () => { this.options = this.cloneObj(this.cachedOptions); });
         eventBus.$on('saveOptions', (obj) => { this.saveOptions(obj); });
         eventBus.$on('displayStepOpts', () => { this.displayStepOpts(); });

         if (! this.workflowObj.workflowName) {
             let sections = this.workflowObj.stepConfig.config.sections;

             sections.forEach((section) => {
                 section.steps.forEach((step) => {
                     this.loadToolTemplates(step);
                 });
             });
         }
     },
     mounted() {
         eventBus.$emit('displayFileMenu', {
             workflowObj: this.workflowObj,
             fromView: 'configWorkflow'
         });
     },
     beforeRouteUpdate(to, from, next) {
         if(to.params.options) {
             if(to.params.options.length === 0) {
                 this.$snotify.info(`No options to configure for ${to.params.exeName}`, {
                     timeout: 5000,
                     showProgressBar: true,
                     closeOnClick: true,
                     pauseOnHover: true,
                     position: "centerCenter",
                     preventDuplicates: true,
                     oneAtTime: true,
                 });
                 if(!from.params.options) {
                     this.displayStepOpts();
                 }            
                 // next(false);
             } else{
                 next();
             }
         } else {
             next();
         }        
     },
     destroyed() {
         eventBus.$off('displayExeOpts');
         eventBus.$off('displayBaseOpts');
         eventBus.$off('saveOptions');
         eventBus.$off('revertOptions');
     },
     components: {
         explorer: ConfigExplorer,
         opts: Opts,
         'tabbed-opts': TabbedOpts,
         'step-list': StepList
     }
 };
</script>

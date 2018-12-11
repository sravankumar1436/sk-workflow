<template>
    <div>
        <b-button variant="primary" @click="printView">Print View</b-button>        
        <b-button variant="primary" @click="close">Close</b-button>
        <br>
        <br>
        <div role="tablist">
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-btn block href="#" v-b-toggle.baseConfig variant="info">Base Configuration</b-btn>
                </b-card-header>
                <b-collapse
                    id="baseConfig"
                    visible
                    accordion="accordion1"
                    role="tabpanel"
                >
                    <b-card-body>
                        <b-container>
                            <div v-for="optGroup of workflowObj.getAllOptGroups()">
                                <b-row>
                                    <b-col cols="1"></b-col>
                                    <b-col><strong>{{ optGroup.label }}</strong></b-col>
                                </b-row>
                                <div v-for="option of optGroup.options">
                                    <b-row>
                                        <b-col cols="2"></b-col>
                                        <b-col cols="2">{{ option.label }}</b-col>
                                        <b-col>{{ option.value }}</b-col>
                                    </b-row>
                                </div>
                            </div>
                        </b-container>
                    </b-card-body>
                </b-collapse>
            </b-card>
            <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-btn block href="#" v-b-toggle.workflowConfig variant="info">Workflow Configuration</b-btn>
                </b-card-header>
                <b-collapse
                    id="workflowConfig"
                    accordion="accordion1"
                    role="tabpanel"
                >
                    <b-card-body>
                        <div v-for="section of workflowObj.getAnalysisSections()">
                            <b-card no-body class="mb-1">
                                <b-card-header header-tag="header" class="p-1" role="tab">
                                    <b-btn
                                        block href="#"
                                        v-b-toggle="section.name + '-toggle'"
                                        variant="info"
                                    >
                                        {{ section.label }}
                                    </b-btn>
                                </b-card-header>
                                <b-collapse
                                    :id="section.name + '-toggle'"
                                    accordion="accordion2"
                                    role="tabpanel"
                                >
                                    <b-card-body>
                                        <b-container>
                                            <div v-for="step of getSteps(section.name)">
                                                <b-row>
                                                    <b-col cols="1"></b-col>
                                                    <b-col><strong>{{ step.label }}</strong></b-col>
                                                </b-row>
                                                <div v-for="exe of step.externalPrograms">
                                                    <b-row>
                                                        <b-col cols="2"></b-col>
                                                        <b-col><strong>{{ exe.name }}</strong></b-col>
                                                    </b-row>
                                                    <div v-for="option of exe.options">
                                                        <div v-if="Array.isArray(option.value)">
                                                            <b-row>
                                                                <b-col cols="3"></b-col>
                                                                <b-col cols="4">
                                                                    {{ option.label }}
                                                                </b-col>
                                                            </b-row>
                                                            <div v-for="e of option.value">
                                                                <b-row>
                                                                </b-row>
                                                                <b-row>
                                                                    <b-col cols="5"></b-col>
                                                                    <b-col cols="4">
                                                                        {{ e.label }}
                                                                    </b-col>
                                                                    <b-col>
                                                                        {{ e.value }}
                                                                    </b-col>
                                                                </b-row>
                                                            </div>
                                                        </div>
                                                        <div v-else-if="option.type !== 'Label'">
                                                            <b-row>
                                                                <b-col cols="3"></b-col>
                                                                <b-col cols="4">
                                                                    {{ option.label }}
                                                                </b-col>
                                                                <b-col>{{ option.value }}</b-col>
                                                            </b-row>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>            
                                        </b-container>
                                    </b-card-body>
                                </b-collapse>                                
                            </b-card>
                        </div>
                    </b-card-body>
                </b-collapse>
            </b-card>
        </div>
        <br>
        <b-button variant="primary" @click="printView">Print View</b-button>
        <b-button variant="primary" @click="close">Close</b-button>
    </div>
</template>

<script>
 export default {
     props: {
         workflowObj: {
             type: Object,
             required: true
         },
         fromView: {
             required: true
         },
         workflows: {
             type: Array
         }
     },
     methods: {
         printView() {
             this.$router.push(
                 {
                     name: 'printView',
                     params: {
                         workflowObj: this.workflowObj,
                         fromView: this.fromView,
                         workflows: this.workflows
                     }
                 });                          
             
         },
         close() {
             this.$router.push(
                 {
                     name: this.fromView,
                     params: {
                         workflowObj: this.workflowObj,
                         fromView: this.fromView,
                         workflows: this.workflows
                     }
                 });                          
         },
         getSteps(section) {
             return this.workflowObj.getSectionObj(section).steps;
         }
     },
     beforeRouteLeave(to, from, next) {
         console.log('PreviewConfig: leaving ' + to.name);
         console.log(to);
         next();
     },
     beforeRouteEnter(to, from, next) {
         console.log('PreviewConfig: entering from ' + from.name);
         console.log(from);
         next();
     }
 };
</script>

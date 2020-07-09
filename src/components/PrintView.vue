<template>
    <div>
        <b-button variant="primary" @click="close">Close</b-button>
        <br>
        <br>
        <b-container>
            <b-row>
                <b-col class="step-header"><strong>Base Configuration</strong></b-col>
            </b-row>
            <br>
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
        <br>
        <div v-for="section of workflowObj.getAnalysisSections()">
            <b-container>
                <b-row>
                    <b-col class="step-header">
                        <strong>{{ section.label }} Configuration</strong>
                    </b-col>
                </b-row>
                <br>
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
            <br>
        </div>
        <br>
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
         close() {
             this.$router.push(
                 {
                     name: 'previewConfig',
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
     }
 };
</script>

<style>
 .step-header {
     font-size: 1.2rem;
 }
</style>

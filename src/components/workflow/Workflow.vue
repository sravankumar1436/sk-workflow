<template>
<v-container fluid>
    <v-layout v-if="Object.keys(selectedTemplate).length > 0">
        <v-flex>
            <v-toolbar>
                <v-toolbar-title>{{selectedTemplate.title}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn large :to="{name: 'addWorkflow' }" flat>Add New Configuration</v-btn>
                    <v-btn large :to="{name: 'workflows' }" flat>View All Configurations</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <router-view></router-view>
        </v-flex>
    </v-layout>
    <v-layout fluid v-else>
        <v-card width="100%" class="elevation-11">
            <v-card-text>
                <span class="grey--text headline">
                    Please select an assay template from the side navigation drawer
                </span>
            </v-card-text>
        </v-card>
    </v-layout>
</v-container>
</template>

<script>
    import StepperActions from './StepperActions';
    import BaseStep from '@/components/workflow/BaseStep';
    import PreProcess from '@/components/workflow/PreProcess';
    import AnalysisStep from '@/components/workflow/Analysis';


    import {mapGetters} from 'vuex'

    export default {
        name: 'Workflow',
        components: { StepperActions, BaseStep, PreProcess, AnalysisStep },

        created() {
            // this.$store.dispatch('fetchBaseOptions');

        },

        destroyed() {

        },

        data () {
            return {
            }
        },



        computed: {
            ...mapGetters([
                'activeStep',
                'selectedTemplate',
                'stepperHeadColor',
        ]),

        nextStep(){
            let temp = this.activeStep + 1;

            if (temp > 4) {
                return 1;
            }

            return temp;
        },

        prevStep() {
            let temp = this.activeStep - 1;

            if (temp <= 0) {
                return 4;
            }

            return temp;
        },
    },

    methods: {
        updateActiveStep(step) {
            console.log('update active step to', step);
            this.$store.dispatch('setStep', step);
        },

        handleModifyWorkflows() {
            console.log('modify workflows');
        },

        handleNextStep(){
            console.log('next step', this.nextStep);
            this.$store.dispatch('setStep', this.nextStep);
        },

        handlePrevStep(){
            console.log('prev step', this.prevStep);
            this.$store.dispatch('setStep', this.prevStep);
        },
    },
        created() {
console.log('The selected template is: ', this.selectedTemplate);
        }
    }

</script>

<style lang="scss" scoped>

</style>

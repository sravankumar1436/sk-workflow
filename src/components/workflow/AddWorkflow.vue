<template>
    <v-layout row class="workflow-stepper elevation-3">
        <v-stepper v-if="Object.keys(selectedTemplate).length > 0" non-linear :value="activeStep">
            <v-stepper-header class="headline">
                <v-stepper-step
                    :complete="activeStep != 1"
                    :color="stepperHeadColor"
                    @click.stop="updateActiveStep(1)"
                    editable step="1">
                    BASE
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step
                    :complete="activeStep != 2"
                    :color="stepperHeadColor"
                    @click.stop="updateActiveStep(2)"
                    editable step="2">
                    PRE-PROCESS
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step
                    :complete="activeStep != 3"
                    :color="stepperHeadColor"
                    @click.stop="updateActiveStep(3)"
                    editable step="3">
                    ANALYSIS
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step
                    :complete="activeStep != 4"
                    :color="stepperHeadColor"
                    editable
                    @click.stop="updateActiveStep(4)" step="4">
                    REVIEW AND SAVE
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <BaseStep :options="baseConfig.config.baseOptions" />
                </v-stepper-content>
                <v-stepper-content step="2">
                    <PreProcess :steps="preProcessSteps" />
                </v-stepper-content>

                <v-stepper-content step="3">
                    <AnalysisStep />
                </v-stepper-content>

                <v-stepper-content step="4">
                    <v-card
                    class="mb-5"
                    color="grey lighten-1"
                    height="200px">
                    </v-card>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-card v-else class="elevation-11">
            <v-card-text>
                <span class="grey--text headline">
                    Please select an assay template from the side navigation drawer
                </span>
            </v-card-text>
        </v-card>
    </v-layout>
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
                'baseConfig',
                'stepConfig'

            ]),
            preProcessSteps() {
                return this.$store.getters.getStepsForSection('preprocess');
            },

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
                this.$store.dispatch('setStep', step);
            },

            handleModifyWorkflows() {
                // console.log('modify workflows');
            },

            handleNextStep(){
                // console.log('next step', this.nextStep);
                this.$store.dispatch('setStep', this.nextStep);
            },

            handlePrevStep(){
                console.log('prev step', this.prevStep);
                this.$store.dispatch('setStep', this.prevStep);
            },
        },
    }
</script>

<style lang="scss" scoped>
.workflow-stepper {
    border: 2px solid brown;
}
</style>

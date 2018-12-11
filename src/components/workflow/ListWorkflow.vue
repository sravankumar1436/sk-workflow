<template>
    <v-card flat>
        <v-card-title>

        </v-card-title>
        <v-card-text>
            <h1> List of all workflows for: {{ selectedTemplate.title}} </h1>
        </v-card-text>
    </v-card>
</template>
<script>
    import StepperActions from './StepperActions';
    import BaseStep from '@/components/workflow/BaseStep';
    import PreProcess from '@/components/workflow/PreProcess';
    import AnalysisStep from '@/components/workflow/Analysis';


    import {mapGetters} from 'vuex'

    export default {
        name: 'Workflow',
        components: { },

        created() {


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
                'selectedTemplate'
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
    }

</script>

<style lang="scss" scoped>

</style>

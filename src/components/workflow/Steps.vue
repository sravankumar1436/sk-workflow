<template>
    <v-layout row class="steps-frame" >
        <v-flex xs12 sm12 class="steps-window">
            <Step :step="step" v-for="step in analysisSection.steps" :key="step.name" class="step-card elevation-5" />

        </v-flex>
    </v-layout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Step from '@/components/steps/Step';

export default {
        name: 'AnalysisStep',
        components: { Step },

    data: () => {
        return {

        }
    },

    methods: {
        handleAnalysisOptions() {
            this.$store.dispatch('analysisOptions', !this.analysisOptions);
        },

    },

    computed: {
        ...mapGetters(['selectedTemplate', 'analysisSection', 'analysisOptions']),
    },

    created() {

    },
}
</script>

<style lang="scss" scoped>
.expansion-content {
    background: #2196F3;
    color: white;
    font-size: 17px;
}
</style>

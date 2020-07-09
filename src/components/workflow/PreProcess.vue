<template>
    <v-layout class="preprocess-frame">
        <Step :step="step" v-for="step in steps" :key="step.name" class="step-card elevation-5" />
    </v-layout>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Step from '@/components/workflow/Step';


    export default {
        name: 'PreProcess',
        components: { Step },
        props: ['steps'],
        methods: {
            handlePreProcessOptions() {
                this.$store.dispatch('preProcessOptions', !this.preProcessOptions);
            },
            loadToolTemplates(externalPrograms) {
                externalPrograms.forEach((p) => {
                    const baseName = p.name.split('.')[0];
                    console.log('in loadTool templates; base name is: ', baseName);
                    let toolTemplateObj = this.$store.getters.getToolTemplate(baseName);
                    if (! toolTemplateObj) {
                            this.$store.dispatch('loadToolTemplate', baseName).then(
                                obj => {
                                    this.$store.dispatch('addToolTemplate', {'name': p.name, 'config': obj});
                                    this.$store.dispatch('mergeToolTemplate', p);
                                },
                                err => console.log(err)
                            );
                    } else {
                        this.$store.dispatch('mergeToolTemplate', p);
                    }
                });
            },
        },

        computed: {
            ...mapGetters(['selectedTemplate',
                ]),
        },
        created() {
           for (let i = 0; i < this.steps.length; i++) {
                this.loadToolTemplates(this.steps[i].externalPrograms);
            }
        }
}

</script>

<style lang="scss" scoped>
    .preprocess-frame {
        border: 1px solid yellow;
        display: block;
        width: 100%;
    }
</style>

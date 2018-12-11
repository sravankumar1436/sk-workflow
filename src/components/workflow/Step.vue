<template>
    <v-card class="step-card elevation-1">
        <v-card-title class="step-header">
            <section class="step-label">
                <v-btn
                    @click="showBodyCtrl = !showBodyCtrl"
                    v-model="showBodyCtrl"
                    v-if="step.enabled"
                    flat dark color="indigo darken-4" >
                    <v-icon>
                        {{ showBodyCtrl ? 'expand_less' : 'expand_more' }}
                    </v-icon>
                </v-btn>
            </section>
            <section class="step-enable">
                <v-checkbox label="Enable" v-model="step.enabled">
                </v-checkbox>
            </section>
            <section class="step-notify">
                <v-checkbox v-model="step.notify" label="Notify on Complete" :disabled="!step.enabled">
                </v-checkbox>
            </section>
            <section class="step-delete-output">
                <v-checkbox v-model="step.deleteOutput" label="Delete Output" :disabled="!step.enabled">
                </v-checkbox>

            </section>
        </v-card-title>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'Step',

        props: ['step'],

        data: () => {
            return {
                showBodyCtrl: false,
            }
        },

        methods: {

        },


        computed: {
            controlIcon() {
                let result = this.showBody;

                if (this.showBody) {
                    return 'expand_less';
                }

                return 'expand_more';
            },

            toolTemplates() {
                return this.$store.getters.getToolTemplate(this.step.externalPrograms);externalPrograms
            },

            showBody() {
                let result = false;
                if (this.step.enabled && this.showBodyCtrl) {
                    return true;
                }

                return false;
            },
        },

        created() {
            // this.loadToolTemplates(this.step.externalPrograms);
        }
    }
</script>

<style lang="scss" scoped>
    .step-card {


        .step-header {
            display: flex;
            width: 100%;
            justify-content: space-between;
            flex-wrap: nowrap;

            font-size: 17px;
            font-weight: bold;

            .step-label {

            }

            .step-enable {

            }

            .step-notify {

            }

            .step-delete-output {

            }
        }
    }
</style>

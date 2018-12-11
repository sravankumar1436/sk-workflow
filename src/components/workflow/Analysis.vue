<template>
<v-card>
    <v-card-title> <v-btn color="indigo" class="white--text" @click.stop="handleAnalysisOptions"> Toggle Step List</v-btn>
    </v-card-title>
    <v-card-text>
        <v-container>
         <v-layout class="expansion-container">
        <v-expansion-panel popout focusable>
            <v-expansion-panel-content
                v-for="(option, i) in enabledList"
                :key="i">
                <div slot="header" class="silver--text title">
                    {{option.name}}
                </div>

               <!--  <v-card class="basic-padding" v-for="(item, j) in option.options"
                :key="j">
                    <v-text-field
                        :label="item.label"
                        v-model="item.value"
                    ></v-text-field>
                </v-card> -->
            </v-expansion-panel-content>
        </v-expansion-panel>
         </v-layout>
         </v-container>

    </v-card-text>
</v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'AnalysisStep',

    data: () => {
        return {
            enabled: [],
            notified: [],
            deletedOutput: [],
            headers: [
                {
                    text: 'Step Name',
                    align: 'left',
                    sortable: false,
                    value: 'label'

                },
                {
                    text: 'Enabled',
                    value: 'enabled'

                },
                {
                    text: 'Notify on Complete',
                    value: 'notify'

                },
                {
                    text: 'Delete Output',
                    value: 'deleteOutput'

                },

            ],
        }
    },

    methods: {
        handleAnalysisOptions() {
            // this.$store.dispatch('analysisOptions', !this.analysisOptions);
        },

    },

    computed: {
        ...mapGetters(['selectedTemplate']),

        enabledList() {
            let elts = this.enabled;
            let result = [];
            elts.forEach((elt, i) => {
                let cur = {id: i, name: elt.label, children: []};

                [ { "valid": false, "name": "noMismatch.py" } ],
                elt.externalPrograms.forEach((elt, j) => {
                    let c = {id: j, name: elt.name, children: []};
                    cur.children.push(c);
                });


                result.push(cur);
            });

            return result;
        },
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

<template>
    <v-layout row class="expansion-container">
        <v-expansion-panel inset focusable>
            <v-expansion-panel-content
                v-for="(option, i) in options"
                :key="i">
                <div slot="header" class="silver--text title">
                    {{option.label}}
                </div>

                <v-card class="basic-padding" v-for="(item, j) in option.options"
                :key="j">
                    <v-text-field
                        :label="item.label"
                        v-model="item.value"
                    ></v-text-field>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
        name: 'BaseStep',
        props: ['options'],
        data: () => {
            return {
            }
        },

        methods: {
        },

        computed: {
            // ...mapGetters(['baseConfig']),
        },

        created() {
        },
    }
</script>

<style lang="scss" scoped>
    .expansion-container {
        border: 1px solid blue;
        width: 100%;
        .expansion-content {
            background: #2196F3;
            color: white;
            font-size: 17px;
        }
        .basic-padding{
            padding: 15px;
        }
    }
</style>

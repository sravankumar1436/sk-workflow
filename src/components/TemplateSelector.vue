<template>
    <v-container>
    <v-layout>
    <v-flex>
    <v-card class="elevation-11">
    <v-card-title class="title">
    Select a Workflow Template
</v-card-title>

    <v-card-text>
        <v-select
            @change="updateSelectedTitle"
              :items="templates"
              item-text="title"
label="Select a workflow template">
</v-select>

        <v-textarea
                    @change="updateSelectedDescription"
                    :value="selected.description"
            label="Workflow Template Description"></v-textarea>

</v-card-text>

    <v-card-actions>
    <v-btn class="configureBtn" :disabled="!canSubmit" color="primary">
    configure workflow
    </v-btn>
    <v-btn class="modifyBtn" color="indigo" :disabled="!canSubmit">
    modify existing workflow
</v-btn>

    </v-card-actions>
    </v-card>
    </v-flex>
    </v-layout>
    </v-container>
    </template>

<script>
import {mapGetters } from 'vuex'

export default {
    created() {
        this.$store.dispatch('fetchTemplates')
    },

    data() {
        return {
        }
    },

    computed: {
        ...mapGetters(['templates', 'selected']),

        canSubmit() {
            return (this.selected.title && this.selected.description)
        }
    },

    methods: {
        updateSelectedTitle(payload) {
            this.$store.dispatch('updateSelectedTitle', payload);
        },

        updateSelectedDescription(payload) {
            this.$store.dispatch('updateSelectedDescription', payload);
        },

        configWorkflow() {
            this.$emit('templateSelected', this.selected)
        },

        modifyWorkflow() {
           console.log('in the modify section')
        }
    }
}

</script>
<style lang="scss" scoped>
.v-card {
    border: 1px solid silver;
    padding: 11px;


    .v-select {
        padding: 17px;
        width: 50%;
    }

    .v-textarea {
        width: 87%;
    }

    .v-btn {
        color: white;
        border-radius: 11%;
    }
}
</style>

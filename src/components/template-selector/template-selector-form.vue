<template>
<v-container>
    <v-layout>
        <v-flex>
            <v-card class="elevation-11">
                <v-card-title class="title">
                    Select a Workflow Template
                </v-card-title>
                <v-card-text>
                    <v-form>

                    </v-form>

                    <v-select solo @change="updateSelected"
                              v-model="sel.title"
                              :items="templates"
                              item-value="title"

                              item-text="title"
label="Select a workflow template">
</v-select>

        <v-textarea @change="updateSelected"
             v-model="sel.description"
                label="Workflow Template Description">jfjfjfj</v-textarea>

</v-card-text>

    <v-card-actions>
    <v-btn class="configureBtn: ;" :disabled="!canSubmit" color="primary">
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

</script>

<style>

</style>

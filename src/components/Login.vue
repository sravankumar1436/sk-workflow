<template>
    <v-container>
        <v-layout>
            <v-flex>
                <v-card class="elevation-10">
                    <v-card-title class="headline">
                        Login Form
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-text-field label="username"
                                v-model="fields.username">

                            </v-text-field>

                            <v-text-field label="password" v-model="fields.password" type="password">

                            </v-text-field>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
    <v-btn :disabled="disableBtn" color="info">
                            login
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {

    created() {
        this.$store.dispatch('hideToolBar');
        this.$store.dispatch('hideDrawer');
    },

    data() {

        return {
            fields: {
                username: '',
                password: ''
            }
        }
    },


    computed: {
        disableBtn() {
            return !(this.fields.username && this.fields.password);
        }
    },

    methods: {

    }
}
</script>

<style lang="scss" scoped>
    .v-card {
        // border: 1px solid red;
        padding: 20px;
        width: 55%;
            .v-form {
                width: 100%;
            }
    }
</style>

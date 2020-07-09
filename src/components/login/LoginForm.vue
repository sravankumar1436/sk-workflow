<template>
    <v-container>
        <v-layout>
            <v-flex>
                <v-card class="elevation-1">
                    <v-card-title class="headline">
                        Login Form
                    </v-card-title>
                    <v-card-text>
                        <v-alert v-if="loginErr" :value="true" type="error">
                    {{loginErr}}
                </v-alert>
                        <v-form>
                            <v-text-field label="username"
                                v-model="fields.username">

                            </v-text-field>

                            <v-text-field label="password" v-model="fields.password" type="password">

                            </v-text-field>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
    <v-btn :disabled="disableBtn" color="info" @click="postLoginData">
                            login
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    data() {

        return {
            fields: {
                username: '',
                password: ''
            }
        }
    },


    computed: {
        ...mapGetters(['loginErr']),
        disableBtn() {
            return !(this.fields.username && this.fields.password);
        }
    },
    methods: {
        postLoginData() {
            const loginPromise = this.$http.post('authenticate', this.fields);

            loginPromise.then(resp => {
                console.log('the response is: ', resp);
                if (resp.body === 'authorized') {
                    this.$store.dispatch('error', '');
                    this.$store.dispatch('setLoggedIn', true);
                    localStorage.setItem('isLoggedIn', true);
                    localStorage.setItem('userId', this.fields.username);
                    this.$router.push('/');
                } else {
                    let msg = 'you are not authorized to use this application'
                    this.$store.dispatch('error', msg);
                }

            }, (err) => {
                console.log('the error is: ', err);
                this.$store.dispatch('error', err.body);

            });


            // console.log('posted data is: ', loginPromise);
        }

    }
}
</script>

<style lang="scss" scoped>

.v-card {
    // border: 1px solid red;
    padding: 20px;
    width: 70%;
    min-width: 500px;

    .v-alert {
        margin: 11px 0 7% 0;
        font-size: 23px;
        font-weight: light;
    }

    .v-form {
        width: 90%;
    }
}

</style>

<template>
    <v-container>
        <v-layout row wrap>
            <v-flex x12>
                <LoginForm />

            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import LoginForm from './LoginForm';
import {mapGetters} from 'vuex'


export default {
    name: 'LoginComponent',
    components: { LoginForm },

    created() {
        this.$store.dispatch('hideDrawer');
        this.$store.dispatch('hideToolBar');
    },

    destroyed() {
        this.$store.dispatch('showDrawer');
        this.$store.dispatch('showToolBar');

    },

    data: () => {
        return {

        }
    },

    computed: {
        ...mapGetters(['loginErr']),
    },

    methods: {},
}
</script>

<style lang="scss" scoped>
.LoginForm {
    width: 50%;
}
</style>

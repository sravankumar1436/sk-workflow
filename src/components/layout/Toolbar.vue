<template>
<v-toolbar class="toolbar"
    v-if="toolbar"
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    color="indigo darken-1"
    app
    dark
    absolute
    clipped-left>
    <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="updateDrawer"></v-toolbar-side-icon>
        <a class="white--text bfx-title" href="/">BFX Workflow</a>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="logout">
        <v-icon>logout</v-icon>
        </v-btn>
</v-toolbar>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    data() {
        return {
        }
    },

    computed: {
        ...mapGetters(['drawer', 'toolbar']),
    },

    methods: {
        updateDrawer() {
            this.$store.dispatch('updateDrawer', !this.drawer);
        },

        logout() {
            console.log('logging you out');
            localStorage.clear();
            this.$store.dispatch('setLoggedIn', false);
            this.$router.push('/login');
        }
    }
}
</script>

<style lang="scss" scoped>
    .v-toolbar {
        border: 1px solid yellow;
        .bfx-title {
            text-decoration: none;

        }
    }
</style>

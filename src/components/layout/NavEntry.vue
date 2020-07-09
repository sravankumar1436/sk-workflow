<template>
    <v-layout class="nav-entry" >
        <v-flex class="nav-entry-flex">
            <v-btn class="nav-entry-btn"
                   :class="{active: selectedTitle === item.title}"
                   :disabled="selectedTitle === item.title"
                   outline @click="selectTemplate">
                {{ item.title }}
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    name: 'NavEntry',
    props: ['item', 'selectedTitle'],
    data: () => {
        return {
        }
    },

    methods: {
        selectTemplate() {
            this.$emit('templateSelected', this.item);
        }
    }

}
</script>

<style lang="scss" scoped>
.nav-entry{

}

.active {
    border-bottom: 3px solid green;
    font-weight: bolder;
    color: green;

}
</style>

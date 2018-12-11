<template>
<section>
        <Toolbar />
        <SideNav />
        <v-content>
            <Content>
                <slot name="outlet"></slot>
            </Content>
        </v-content>
</section>
</template>

<script>
import SideNav from './SideNav';
import Toolbar from './Toolbar';
import Content from './Content';

export default {
    name: 'Layout',
    components: {SideNav, Toolbar, Content },
    data: () => {
        return {

        }
    },

    created() {
        this.$store.dispatch('fetchTemplateList');
    }
}
</script>

<style lang="scss" scoped>

</style>

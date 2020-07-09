
const actions = {

    updateDrawer({commit, state}, status) {
        commit('SET_DRAWER', status);
    },

    showDrawer({commit, state}) {
        commit('SET_DRAWER', true);
    },

    hideDrawer({commit, state}) {
        commit('SET_DRAWER', false);
    },

    updateToolBar({commit, state}, status) {
        commit('SET_TOOLBAR', status);
    },

    showToolBar({commit, state}) {
        commit('SET_TOOLBAR', true);
    },

    hideToolBar({commit, state}) {
        commit('SET_TOOLBAR', false);
    },

    enableDrawerResize({commit, state}) {
        commit('SET_RESIZE_DRAWER', true);
    },

    disableDrawerResize({commit, state}) {
        commit('SET_RESIZE_DRAWER', false);
    }
}

export default actions;

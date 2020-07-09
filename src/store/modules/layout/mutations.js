export const mutations = {
    SET_LOADING(state, status) {
        state.loading = status;
    },

    SET_DRAWER_RESIZE(state, status) {
        state.drawerResize = status;
    },

    SET_DRAWER(state, status) {
        state.drawer = status;
    },

    SET_TOOLBAR(state, status) {
        state.toolbar = status;
    }
}


export default mutations;

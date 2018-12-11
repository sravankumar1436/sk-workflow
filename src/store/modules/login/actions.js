const actions = {
    error({commit, state}, err) {
        commit('SET_LOGIN_ERROR', err);
    },
    setLoggedIn({commit, state}, status) {
        commit('SET_LOGGED_IN', status);
    },
    setUserId({commit, state}, userId) {
        commit('SET_USER_ID', userId);
    }
};

export default actions;

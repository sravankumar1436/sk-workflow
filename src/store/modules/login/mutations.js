const mutations = {
    SET_LOGIN_ERROR(state, err) {
        state.loginError = err;
    },

    SET_LOGGED_IN(state, status) {
        state.loggedIn = status;
    },
    SET_USER_ID(state, userId) {
        state.userId = userId;
    }
};

export default mutations;

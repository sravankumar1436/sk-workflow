const getters = {

    loginErr: state => {
        return state.loginError;
    },
    loggedIn: state => {
        return state.loggedIn;
    },
    userId: state => {
        return state.userId;
    }
}


export default getters;

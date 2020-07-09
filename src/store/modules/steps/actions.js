import Vue from 'vue';

const actions = {

    baseOptions: state => {
        return state.baseOptions;
    },
    baseOptionsError({commit, state}, err) {
        commit('SET_BASE_OPTIONS_ERROR', err);
    },

    fetchSections({commit, state}, name) {
        commit('SET_SECTIONS_LOADER', true);

        Vue.http.get(`template/${name}`)
            .then(
                resp => {
                    const payload = resp.body;

                    console.log('loaded sections: ', payload.sections);

                    commit('SET_SECTIONS', payload.sections);
                    commit('SET_SECTIONS_LOADER', false);

                },

                err => {
                    console.log('the error is: ', err);
                    commit('SET_SECTIONS_ERROR', err);
                    commit('SET_SECTIONS_LOADER', false);
                });
    },

    sectionsError({commit, state}, err) {
        commit('SET_SECTIONS_ERROR', err);
    },
}

export default actions;

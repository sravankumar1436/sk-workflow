const mutations = {
    SET_BASE_OPTIONS_LOADER(state, status) {
        state.loadingBaseOptions = status;
    },

    SET_BASE_OPTIONS_ERROR(state, err) {
        state.baseOptionsError = err;
    },

    SET_BASE_OPTIONS(state, options) {
        state.baseOptions = options;
    },

    SET_SECTIONS_LOADER(state, status) {
        state.loadingSections = status;
    },

    SET_SECTIONS_ERROR(state, err) {
        state.sectionsError = err;
    },

    SET_SECTIONS(state, sections) {
        state.sections = sections;
    },
}


export default mutations;

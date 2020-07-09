const mutations = {
    SET_TEMPLATE_LIST(state, payload) {
        state.templateList = payload;
    },
    ADD_TEMPLATE(state, payload) {
        state.templates.push(payload);
    },

    SET_SELECTED_TEMPLATE(state, template) {
        state.selected = template;
    },
    ADD_TOOL_TEMPLATE(state, payload) {
        state.toolTemplates[payload.name] = payload.config;
    }
};

export default mutations;

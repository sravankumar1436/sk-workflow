import Vue from 'vue';

const actions = {
    updateWorkflow({commit, state}, payload) {
        commit('UPDATE_WORK_FLOW', payload);
    },
    createWorkflow({commit, state}, payload) {
        commit('CREATE_WORK_FLOW', payload);
    },
    setStep({commit, state}, payload) {
        commit('SET_ACTIVE_STEP', payload);
    },
    baseOptionsError({commit, state}, err) {
        commit('SET_BASE_OPTIONS_ERROR', err);
    },
    addToolTemplate({commit, state}, payload) {
        console.log('in the add tool template action; payload is: ', payload);
        commit('ADD_TOOL_TEMPLATE', payload);
    },
    mergeToolTemplate({commit, state}, payload) {
        console.log('in the merge tool template action; payload is: ', payload);
        commit('MERGE_TOOL_TEMPLATE', payload);
    }

};

export default actions;

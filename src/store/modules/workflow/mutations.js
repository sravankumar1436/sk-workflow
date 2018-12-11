import Workflow from '@/Workflow';

const mutations = {
    UPDATE_WORK_FLOW(state, payload) {
        state.workflows[payload.key] = payload.value;
    },

    CREATE_WORK_FLOW(state, payload) {
        state.workflowObj = new Workflow(
            payload.selectedTemplate,
            payload.baseTemplate,
            payload.stepTemplateObj,
            payload.workflowName,
            payload.userId,
            payload.lastModified
        );
    },
    SET_ACTIVE_STEP(state, payload) {
        state.activeStep = payload;
    },
    SET_BASE_OPTIONS_LOADER(state, status) {
        state.loadingBaseOptions = status;
    },

    SET_BASE_OPTIONS_ERROR(state, err) {
        state.baseOptionsError = err;
    },

    SET_BASE_OPTIONS(state, options) {
        state.baseOptions = options;
    },
    ADD_TOOL_TEMPLATE(state, payload) {
        console.log('in the add tool template mutator; payload is: ', payload);
        state.workflowObj.addToolTemplate(payload.name, payload.config);
    },
    MERGE_TOOL_TEMPLATE(state, payload) {
        state.workflowObj.mergeToolTemplate(payload);
    }
};

export default mutations;

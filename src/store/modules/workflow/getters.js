const getters = {
    activeStep: state => {
        return state.activeStep;
    },
    stepperHeadColor: state => {
        return state.stepperHeadColor;
    },
    baseConfig: state => {
        return state.workflowObj.baseConfig;
    },
    stepConfig: state => {
        return state.workflowObj.stepConfig;
    },
    getSectionObj: state => {
        return function(payload) {
            return state.workflowObj.getSectionObj(payload);
        };
    },
    getStepsForSection: state => {
        return function(payload) {
            return state.workflowObj.getStepsForSection(payload);
        };
    }
};

export default getters;

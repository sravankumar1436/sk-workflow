const getters = {

    baseTemplate: state => {
        return state.templateList.filter((tmpl) => tmpl.name === 'base')[0];
    },
    templateList: state => {
        return state.templateList.filter(tmpl => (tmpl.name !== 'base'));
    },
    selectedTemplate: state => {
       return  state.selected;
    },
    getTemplate: state => {
        return function(payload) {
            let result = state.templates.find((tmpl) => tmpl.name === payload);
            if (! result) {
                return result;
            }
            return JSON.parse(JSON.stringify(result));
        };
    },
    getToolTemplate: state => {
        return function(payload) {
            if (Object.keys(state.toolTemplates).length === 0) {
                return '';
            }

            return state.toolTemplates[payload];
        };
    }
};

export default getters;

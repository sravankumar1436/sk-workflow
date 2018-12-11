/*
  The store for the template selector component
*/

const state = {
    templates: [],
    loadingTemplates: false,
    selected: {
        title: '',
        description: '',
    }
}

const mutations = {
    SET_LOADING_TEMPLATES(state, status) {
        state.loadingTemplates = status
    },

    SET_TEMPLATES(state, templates) {
        state.templates = templates
    },

    SET_SELECTED(state, selected) {
        state.selected = selected
    }
}

const testTemplates = [
    {
        title: 'template 1',
        description: 'description 1'
    },
    {
        title: 'template 2',
        description: 'description 2'
    },
    {
        title: 'template 3',
        description: 'description 3'
    },
    {
        title: 'template 4',
        description: 'description 4'
    },
    {
        title: 'template 5',
        description: 'description 5'
    }
]

const actions = {
    fetchTemplates({commit}) {
        commit('SET_LOADING_TEMPLATES', true)
        console.log('fetching templates')
        commit('SET_LOADING_TEMPLATES', false)
        commit('SET_TEMPLATES', testTemplates)
    },

    updateSelectedTitle({commit, state}, title) {
        //  console.log('selected is: ', selected)
        const sel = {
            title: title,
            description: '',
        };

        testTemplates.forEach(elt => {
            if (elt.title === title) {
                sel.description = elt.description;
            }
        });

        commit('SET_SELECTED', sel);

    },

    updateSelectedDescription({commit, state}, description) {
        const sel = {
            title: state.selected.title,
            description: description
        };

        commit('SET_SELECTED', sel);
    }
}

const getters = {
    templates: state => {
        return state.templates
    },

    selected: state => {
        return state.selected
    },
}


export default {
    state,
    getters,
    actions,
    mutations
}

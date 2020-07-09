const getters = {
    sections: state => {
        return state.sections;
    },

    preprocessSection: state => {
        // if(state.sections.length){
            // state.sections[0].steps.map(item => item.expand = false);
            return state.sections[0];
        // }
        // return {};
    },

    analysisSection: state => {
        return state.sections[1];
    }

}


export default getters;

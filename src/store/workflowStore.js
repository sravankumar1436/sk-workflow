 import Vue from 'vue';
 import Workflow from '../Workflow.js';

export default{
    namespaced: true,
    state: {
        newMessage: '',
        workflows: []
    },
    mutations: {
        updateNewMessage(state, value) {
            state.newMessage = value;
        },
        MUTATE_WORKFLOWS(state, value) {
            state.workflows.push(value);
        }
    },
    actions: {
        getNewMessage({ commit }) {
            Vue.http.get()
            .then((response) => {
                commit('updateNewMessage', response.body);
            },
            () => {
                alert('Error in Workflows.vue::loadMsg');
            });
        },
        queryWorkflow({ commit }, url) {
            return new Promise((resolve, reject) => {
                Vue.http.get(url)
                    .then((response) => {
                        response.data.forEach((e) => {
                            let obj = JSON.parse(e.stepConfig);
                            let analysisConfig = obj.config.sections.find((e) => e.name === 'analysis');
                            let stepConfig = analysisConfig.steps.find((e) => e.name === 'querydbs');
                            let bwaConfig = stepConfig.externalPrograms.find((e) => e.name === 'bwa');
                            console.log(bwaConfig.options[1]);                        
                            let workflowObj = new Workflow(
                                e.assay,
                                JSON.parse(e.baseConfig),
                                JSON.parse(e.stepConfig),
                                e.workflowName,
                                e.userId,
                                e.lastModified
                            );
                            commit('MUTATE_WORKFLOWS', workflowObj);
                            resolve();
                        });
                    },
                    (err) => {
                        reject(err);
                    }
                );
            });
        },
        getTemplateCall({ commit }, url) {
            return Vue.http.get(url);
        },
        getTemplateListCall({ commit }, url){
            Vue.http.get(url)
                 .then((response) => {
                        return response.json();
                    },
                    (err) => {
                        console.error(err);
                        alert('Error getting workflow templates');
                    }
                ).then((templates) =>{                    
                    commit('setTemplateList', templates, { root : true});
                    },
                    (err) => console.error(err)
                )
            ;
        },
        loadToolTemplateCall({ commit }, url){
            return new Promise((resolve, reject) =>{
                Vue.http.get(url)
                 .then((response) => {
                        return response.json();
                    },
                    (err) => {
                        console.error(err);
                        alert('Error getting workflow templates');
                        reject(err);
                    }
                ).then((jsonObj) =>{ 
                    let templateObj = {
                                name: name,
                                config: jsonObj
                            };                   
                    commit('addToolTemplate', templateObj, { root : true});
                    resolve(templateObj);
                    },
                    (err) => reject(err)
                );
            });
        }
    }
};

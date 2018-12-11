import Vue from 'vue';

const actions = {
    fetchTemplateList({commit, state}) {
        Vue.http.get('templates')
            .then(
                resp => {
                    const tmpls = resp.body;

                    commit('SET_TEMPLATE_LIST', tmpls);
                },

                err => {
                    console.log('the error is: ', err);
                  });
    },
    fetchTemplate({commit, state}, payload) {
        console.log('in the fetchTemplate action: ', payload);
        return new Promise((resolve, reject) => {
            Vue.http.get('template/' + payload + '')
                .then(
                    resp => resp.json(),
                    err => {
                        console.log('fetchTemplate for ' + payload + ': ', err.message);
                        reject(err);
                    })
                .then((jsonObj) => {
                    console.log('in the fetchTemplate action: ', jsonObj);
                    let templateObj = {
                        name: payload,
                        config: jsonObj
                    };
                    console.log('in the fetchTemplate action: ', templateObj);
                    commit('ADD_TEMPLATE', templateObj);
                    resolve();
                }).catch((error) => {
                    console.log('fetchTemplate(json) for ' + payload + ': ' + error.message);
                    reject(error);
                });
        });
    },
    loadToolTemplate({commit, state}, payload) {
        return new Promise((resolve, reject) => {
        Vue.http.get('tooltemplate/' + payload)
            .then(
                response =>
                    response.json(),
                /* eslint-disable no-unused-vars */
                error => {
                    alert('Error getting tool template for ' + payload);
                    reject(error);
                }
                /* eslint-enable no-unused-vars */
            ).then(function(jsonObj) {
                console.log('in load tool template; josnObj is: ', jsonObj);
                let templateObj = {
                    name: payload,
                    config: jsonObj
                };
                commit('ADD_TOOL_TEMPLATE', templateObj);
                resolve(templateObj);
            })
            .catch((error) => {
                alert(error);
                console.log('Error parsing json object: ', error);
                reject(error);
            });
        });
    },
    setSelectedTemplate({commit, state}, payload) {
        commit('SET_SELECTED_TEMPLATE', payload);
    }
};

export default actions;

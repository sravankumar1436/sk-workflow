<template>
    <v-navigation-drawer :disable-resize-watcher="!loggedIn || !resizeDrawer"
    clipped
        :value="drawer"
        fixed
        stateless
        app>

        <NavEntry
            @templateSelected="handleTemplateSelected"
            v-for="tmpl in templateList"
            :key="tmpl.name"
            :item="tmpl"
            :selectedTitle="selectedTemplate.title"
        />

    </v-navigation-drawer>
</template>

<script>
    import {mapGetters} from 'vuex';
    import NavEntry from './NavEntry';

    export default {
        components: { NavEntry },
        computed: {
            ...mapGetters(['selectedTemplate',
                           'templateList',
                           'baseTemplate',
                           'drawer',
                           'loggedIn',
                           'resizeDrawer'
            ]),

            stepTemplateObj() {
                return this.$store.getters.getTemplate(this.selectedTemplate.name);

            },
            baseTemplateObj() {
                return this.$store.getters.getTemplate('base');
            }
        },
        methods: {
            handleTemplateSelected(template) {
                this.$store.dispatch('setSelectedTemplate', template);
                this.loadTemplates()
                    .then (() => {
                        this.$store.dispatch('createWorkflow', {
                            'selectedTemplate': this.selectedTemplate.name,
                            'baseTemplate': this.baseTemplateObj,
                            'stepTemplateObj': this.stepTemplateObj,
                            'workflowName': '',
                            'userId': localStorage.userId
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
                this.$router.push({
                    name: 'workflows'
                });

            },
            loadTemplates() {
                return new Promise((resolve, reject) => {
                    this.$store.dispatch('fetchTemplate', 'base')
                        .then((templateObj) => {
                            console.log('selected template name = ' + this.selectedTemplate.name);
                            this.$store.dispatch('fetchTemplate', this.selectedTemplate.name)
                                .then((templateObj) => {
                                    resolve();
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            }
        },
        data() {
            return {
            }
        }
    }
</script>

<style lang="scss" scoped>
    .activeTab {
        border: 2px solid white;
    }

    .v-navigation-drawer {
        border-right: 1px solid silver;
        background:  white;
        padding-top: 21px;

        .v-list {
            // border: 1px solid green;

            .v-list-tile {
                border: 1px solid red;
            }
        }

        .v-tabs {
            .actionsTab {
                background: #E3F2FD;
                color: red;

                :hover {
                    font-weight: bolder;
                    color: #E3F2FD;
                    background: red;
                }
            }

            .templatesTab {
                background: #B39DDB;
                color: #1B5E20;

                :hover {
                    background: #EDE7F6;
                }
            }

            .explorerTab {
                background: #A5D6A7;
                color: #1B5E20;

                :hover {
                    background: #C8E6C9;
                }

            }
        }
    }
</style>

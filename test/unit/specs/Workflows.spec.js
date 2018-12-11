import { mount, createLocalVue } from '@vue/test-utils';
import Workflows from '@/components/Workflows';
import TemplateSelector from '@/components/TemplateSelector.vue';
import Configuration from '@/components/Configuration.vue';
import WorkflowSelector from '@/components/WorkflowSelector.vue';
import VueRouter from 'vue-router';
import {routes} from '@/routes.js';
import {eventBus} from '@/eventBus.js';

const localVue = createLocalVue();
localVue.use(VueRouter);

const router = new VueRouter({ routes });

jest.mock('@/components/Configuration.vue', () => ({
    name: 'Configuration',
    render: h => h('div')
}));

jest.mock('@/components/WorkflowSelector.vue', () => ({
    name: 'WorkflowSelector',
    render: h => h('div')
}));

jest.mock('@/components/TemplateSelector.vue', () => ({
    name: 'TemplateSelector',
    render: h => h('div'),
    data() {
        return { selectedTemplate: { name: 'aat' } };
    }
}));

const welcomeResponse = { data: 'Mock Welcome!' };
const mockBaseTemplate = { name: 'base', config: { baseOptions: [] } };
const mockStepTemplate = { name: 'aat', config: { sections: ['preprocess', 'analysis'] } };
const mockWorkflowObj = { workflowName: 'aat', baseConfig: '{}', stepConfig: '{}', userId: 'jdoe', lastModifed: 12345 };

describe('Workflows.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Workflows, {
            localVue,
            router,
            methods: {
                loadTemplate(name) {
                    if (name === 'base') {
                        wrapper.vm.baseTemplateObj = mockBaseTemplate;
                    } else {
                        wrapper.vm.stepTemplateObj = mockStepTemplate;
                    }
                },
                getTemplate(name) {
                    if (name === 'base') {
                        return mockBaseTemplate;
                    } else {
                        return mockStepTemplate;
                    }
                }
            },
            mocks: {
                $http: {
                    get: function (url) {
                        if (!url) {
                            let obj = Promise.resolve(welcomeResponse);
                            return obj;
                        } else if (url.match(/^query_workflow.+/)) {
                            const workflows = [
                                mockWorkflowObj,
                                mockWorkflowObj
                            ];
                            return Promise.resolve({ data: workflows });
                        }
                    }
                }
            }
        });
    });

    test('loads welcome message', () => {
        wrapper.vm.loadWelcomeMsg().then((data) => {
            expect(wrapper.vm.welcomeMsg).toEqual(data);
        });
    });

    test('loads template objects when the templateSelected event is received', () => {
        wrapper.vm.$refs.templateSelector.$emit('templateSelected', { name: 'aat' });
        expect(wrapper.vm.baseTemplateObj).toEqual(mockBaseTemplate);
        expect(wrapper.vm.stepTemplateObj).toEqual(mockStepTemplate);
    });

    test('renders Configuration view for the configWorkflow route', () => {
        router.push({name: 'configWorkflow', params: {workflowObj: mockWorkflowObj}});
        expect(wrapper.find(Configuration).exists()).toBe(true);
    });

    test('renders WorkflowSelector view for the findWorkflows route', () => {
        const workflows = [{name: 'wf1'}, {name: 'wf2'}, {name: 'wf3'}];

        router.push({
            name: 'findWorkflows',
            params: { workflows: workflows, fromView: 'findWorkflows' }
        });

        expect(wrapper.find(WorkflowSelector).exists()).toBe(true);
    });

    test('configureWorkflow event displays Configuration view', () => {
        wrapper.vm.$refs.templateSelector.$emit('configureNewWorkflow');
        expect(wrapper.find(Configuration).exists()).toBe(true);
    });

    test('modifyWorkflow event displays WorkflowSelector view', () => {
        wrapper.vm.$refs.templateSelector.$emit('modifyWorkflow');

        eventBus.$on('hideFileMenu', () => {
            wrapper.vm.$emit('hideFileMenu');
        });

        wrapper.vm.$nextTick(() => {
            expect(wrapper.find(WorkflowSelector).exists()).toBe(true);
            expect(wrapper.emitted('hideFileMenu')).toBeTruthy();
        });
    });
});

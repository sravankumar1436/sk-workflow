import { createLocalVue, shallowMount } from '@vue/test-utils';
import App from '@/App';
import { eventBus } from '@/eventBus.js';
import snotify from 'vue-snotify';

const localVue = createLocalVue();
localVue.use(snotify);

describe('App.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(App, {
            localVue,
            stubs: [
                'router-link',
                'router-view',
                'b-dropdown',
                'b-dropdown-item'
            ]
        });
    });

    test('has "aat" for the templateId', () => {
        expect(wrapper.vm.templateId).toEqual('aat');
    });

    test('has the expected html structure', () => {
        expect(wrapper.vm.$el).toMatchSnapshot();
    });
    test('display the File menu when the "displayFileMenu" event is received', () => {
        const obj = { fromView: 'Configuration', workflowObj: {} };
        expect(wrapper.find('#filemenu').isVisible()).toBeFalsy();
        eventBus.$emit('displayFileMenu', obj);
        expect(wrapper.find('#filemenu').isVisible()).toBeTruthy();
    });

    test('hide the File menu when the "hideFileMenu" event is received', () => {
        const obj = { fromView: 'Configuration', workflowObj: {} };
        eventBus.$emit('displayFileMenu', obj);
        eventBus.$emit('hideFileMenu');
        expect(wrapper.find('#filemenu').isVisible()).toBeFalsy();
    });

    test('set the "modify" property when the "setModify" event is received', () => {
        eventBus.$emit('setModify', { modify: true });
        expect(wrapper.vm.modify).toBeTruthy();
    });
});

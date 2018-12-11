<template>
    <div>
        <div id="bootstrap-overrides">
            <div class="wrapper" >        
                <!-- Sidebar Holder -->
                <nav id="sidebar" ref="sidebar">
                    <div class="sidebar-header">
                        <h3>Configuration Explorer</h3>
                        <br>
                        <b-dropdown id="actionMenu" text="Actions" class="m-md-2" @click="toggleActionMenu()">
                            <b-dropdown-item
                                :disabled="numExpanded === menus.length"
                                @click="expandAllMenus()"
                            >
                                Expand All Menus
                            </b-dropdown-item>
                            <b-dropdown-item
                                :disabled="numExpanded === 0"
                                @click="collapseAllMenus()"
                            >
                                Collapse All Menus
                            </b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item
                                @click="displayStepOpts()"
                            >
                                Show Step Options
                            </b-dropdown-item>
                        </b-dropdown>
                    </div>
                    <ul class="list-unstyled components">
                        <li class="active">
                            <b-link
                                ref="base"
                                @click="menuClicked('base')"
                                aria-controls="baseSubmenu"
                                :aria-expanded="menuStatus('base')"
                            >
                                {{menuStatus('base') ? '&#9660;' : '&#9658;' }}  Base
                            </b-link>
                            <b-collapse id="baseSubmenu" class="mt-2" :visible="menuStatus('base')">
                                <ul class="list-unstyled">
                                    <li v-for="optGroup of workflowObj.baseConfig.config.baseOptions">
                                        <b-link
                                            @click="displayBaseOpts(optGroup.name, optGroup.label, optGroup.options)"
                                        >
                                            {{ optGroup.label }}
                                        </b-link>
                                    </li>
                                </ul>
                            </b-collapse>
                            <b-link
                                ref="workflow"
                                @click="menuClicked('workflow')"
                                aria-controls="workflowSubmenu"
                                :aria-expanded="menuStatus('workflow')"
                            >
                                {{menuStatus('workflow') ? '&#9660;' : '&#9658;' }}   Workflow
                            </b-link>
                            <b-collapse
                                id="workflowSubmenu"
                                class="mt-2"
                                :visible="menuStatus('workflow')"
                            >
                                <ul class="list-unstyled">
                                    <div v-for="section of workflowObj.stepConfig.config.sections">
                                        <b-link
                                            :ref=section.name
                                            @click="menuClicked(section.name)"
                                            aria-controls="workflowSubmenu"
                                            :aria-expanded="menuStatus(section.name)"
                                        >
                                            {{menuStatus(section.name) ? '&#9660;' : '&#9658;' }}   {{ section.label }}
                                        </b-link>
                                        <b-collapse
                                            :id="section.name + 'Submenu'"
                                            class="mt-2"
                                            :visible="menuStatus(section.name)">
                                            <ul class="list-unstyled">
                                                <div v-for="step of section.steps">
                                                    <b-link v-if="step.enabled"
                                                        :ref=step.name
                                                        @click="menuClicked(step.name)"
                                                        aria-controls="step.name + 'Submenu'"
                                                        :aria-expanded="menuStatus(step.name)" 
                                                    >
                                                        {{menuStatus(step.name) ? '&#9660;' : '&#9658;' }}   {{ step.label }}
                                                    </b-link>
                                                    <b-collapse v-if="step.enabled"
                                                        :id="step.name + 'Submenu'"
                                                        class="mt-2"
                                                        :visible="menuStatus(step.name)"
                                                    >
                                                        <ul class="list-unstyled">
                                                            <div v-for="exe of step.externalPrograms">
                                                                <li>
                                                                    <b-link
                                                                        @click="displayExeOpts(section.name, step.name, exe.name)"
                                                                    >
                                                                        {{ exe.name }}
                                                                    </b-link>
                                                                </li>
                                                            </div>
                                                        </ul>
                                                    </b-collapse>
                                                </div>
                                            </ul>
                                        </b-collapse>
                                    </div>                                         
                                </ul>
                            </b-collapse>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
 import { eventBus } from '../eventBus.js';
 
 export default {
     name: 'ConfigExplorer',
     props: {
         workflowObj: {
             type: Object,
             required: true
         }
     },
     data() {
         return {
             menus: [
                 { name: 'base', expanded: false },
                 { name: 'workflow', expanded: false }
             ]
         };
     },
     computed: {
         numExpanded: function () {
             return this.menus.filter((e) => e.expanded).length;
         }
     },
     methods: {
         toggleMenu(menuName, action) {
             this.menus.find((e) => {
                 if (e.name === menuName) {
                     if (action) {
                         if (action === 'expand') {
                             if (! e.expanded) {
                                 e.expanded = true;
                             }
                         } else if (action === 'collapse') {
                             if (e.expanded) {
                                 e.expanded = false;
                             }
                         }
                     } else {
                         e.expanded = ! e.expanded;
                     }
                 }
             });
         },
         toggleAllMenus(action) {            
             this.menus.forEach((e) => {
                 this.toggleMenu(e.name, action);
                 this.toggleCollapse(e.name, action);
             });
         },
         expandAllMenus() {
             this.toggleAllMenus('expand');
         },
         collapseAllMenus() {
             this.toggleAllMenus('collapse');
         },
         //         toggleSidebar() {
         //             this.toggleAllMenus();
         //             
         //             for (let r in this.$refs) {
         //                 this.toggleElement(this.$refs[r], 'active');
         //             }
         //             this.toggleExpansion('all');
         //         },
         //         toggleExpansion() {
         //             let elements = document.querySelectorAll('.collapse.in');
         //             const it = elements.entries();
         //             let e = it.next().value;
         //             while (e) {
         //                 e[1].classList.toggle('in');                     
         //                 e = it.next().value;
         //             }
         //         },
         toggleCollapse(menuName) {
             let element = this.$refs[menuName];
             if (!element) return;
             if (Array.isArray(element)) {
                 element = element[0];
             }
             element.classList.toggle('collapsed');
         },
         menuClicked(menuName) {
             this.toggleMenu(menuName);
             this.toggleCollapse(menuName);
         },
         getMenu(menuName) {
             return this.menus.filter((e) => {
                 return e.name === menuName;
             });
         },
         menuStatus (menuName) {
             const menu = this.getMenu(menuName)[0];
             return menu.expanded;
         },
         displayStepOpts() {
             eventBus.$emit('displayStepOpts');
         },
         displayBaseOpts(groupName, groupLabel) {
             eventBus.$emit('displayBaseOpts', { groupName: groupName, groupLabel: groupLabel });
         },
         displayExeOpts(sectionName, stepName, exeName) {
             eventBus.$emit('displayExeOpts', { sectionName: sectionName, stepName: stepName, exeName: exeName });
         },
         toggleActionMenu() {
             const menu = this.$refs.actionMenu;
             menu.classList.toggle('is-active');
         }
     },
     created() {
         for (let section of this.workflowObj.stepConfig.config.sections) {
             this.menus.push({ name: section.name, expanded: false });
             for (let step of section.steps) {
                 this.menus.push({ name: step.name, expanded: false });
             }
         }
     }
 };
</script>

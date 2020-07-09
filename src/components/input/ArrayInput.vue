<template>
    <div>
        <b-button v-if="option.dynamic" variant="primary" size="sm" @click="showAddElements=true">Add Elements</b-button>
        <br>
        <br>
        <table>
            <div v-for="(i, index) in value">
                <tr>
                    <td style="width: 110px">
                        <label><strong>{{i.label}}:</strong></label>
                    </td>
                    <td>
                        <input
                            v-if="i.type === 'Number'"
                            :ref="i.label"
                            class="element-input element-input-number"
                            :style="getNumberStyle(i)"
                            type="number"
                            v-model="i.value"
                            :required="option.required"
                            :disabled="option.readOnly"
                            @change="validateElement(i, i.label, index)"
                        />
                        <input
                            v-else
                            :ref="i.label"
                            class="element-input"
                            :style="getTextStyle(i)"
                            type="text"
                            v-model="i.value"
                            :size="i.fieldLength || 92"
                            :required="option.required"
                            :disabled="option.readOnly"
                            @change="validateElement(i, i.label, index)"
                        />
                    </td>
                </tr>
            </div>
        </table>
        <br>
        <div v-if="showAddElements">
            <add-elements
                :label="this.option.label"
                :elements="this.value"
                :workflowObj="this.workflowObj"
                @doneAddingElements="showAddElements=false"
            >
            </add-elements>
        </div>
    </div>
</template>
<script>
 import Field from './mixins/Field.js';
 import AddElements from './AddElements.vue';
 import { eventBus } from '../../eventBus.js';
 
 export default {
     mixins: [Field],
     data() {
         return {
             validElements: [],
             addingElements: false,
             elementsToAdd: 1,
             newElements: [],
             defaultValue: this.option.value[0],
             type: this.option.value[0].type,
             useDefaultValue: true,
             autoLabels: true,
             customizeElements: false,
             showAddElements: false
         };
     },
     methods: {
         validateElement(i, id, index) {
             if (this.option.pattern) {
                 let regex = new RegExp(this.option.pattern);
                 let element = this.$refs[id][0];
                 if (! i.value.match(regex)) {
                     alert(i.value + ' does not match the required pattern for this field: ' + this.option.pattern);
                     element.style = 'border: 2px solid red;';
                     element.focus();
                     eventBus.$emit('invalidate', { fieldName: this.id });
                     return;
                 } else {
                     element.style = '';
                     this.validElements[index] = true;
                 }
             }
             if (this.option.consistent) {
                 for (let e of this.value) {
                     e.value = i.value;
                 }
             }
             this.update();
             let valid = true;
             for (let j = 0; j < this.validElements.length; ++j) {
                 if (this.validElements[j] === false) {
                     valid = false;
                     break;
                 }
             }
             if (valid) {
                 eventBus.$emit('validate', { fieldName: this.id });
             }
         },
         getTextStyle(element) {
             let style = '';
             if (element.align) {
                 style = 'text-align: ' + element.align;
             }
             if (element.fieldLength) {
                 style += '; size=' + element.fieldLength + 'px;';
             }
             return style;
         },
         getNumberStyle(element) {
             let digits = 0;
             let n = element.value;
             while (n >= 1) {
                 ++digits;
                 n /= 10;
             }
             digits = digits < 3 ? 3 : digits;
             return 'width: ' + (digits).toString() + 'em;';
         },
         getInputStyle(element) {
             return this.type === 'Number' ? this.getNumberStyle(element) : this.getTextStyle(element);
         }
     },
     created() {
         if (! this.value) {
             console.log(this.option.name + ' value is undefined');
         }

         for (let i = 0; i < this.value.length; ++i) {
             this.validElements.push(false);
         }
     },
     components: {
         'add-elements': AddElements
     }
 };
</script>

<style media="screen">
 .element-input {
     margin-top: 5px;
     margin-bottom: 5px;
 }
 .element-input-number {
     text-align: right;
 }
 .table th {
     border-top: none !important;
     border-bottom: none !important;
     text-align: center !important;
     padding-right: 0px !important;
     padding-left: 0px !important;
 }
 td {
     vertical-align: top !important;
     padding-top: 1px !important;
     padding-bottom: 1px !important;
     padding-right: 0px !important;
     padding-left: 0px !important;
 }
</style>

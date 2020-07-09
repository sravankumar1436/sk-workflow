<template>
    <div>
        <component
            :is="getInputType(option.type)"
            :workflowObj="workflowObj"
            :option="option"
            :id="fieldName"
            :optGroup="optGroup"
            v-on:update-field="updateOption"
        >                    
        </component>
        <b-alert
            :show="showFailureAlert"
            variant="danger"
            dismissible
            @dismissed="showFailureAlert=false"
        >
            {{ failureMsg }}
        </b-alert>
        <b-alert
            :show="dismissCountdown"
            variant="success"
            dismissible
            @dismissed="dismissCountdown=0"
            @dismiss-count-down="countDownChanged"
        >
            {{ successMsg }}
        </b-alert>
    </div>
</template>

<script>
 import TextInput from './TextInput.vue';
 import Textarea from './TextareaInput.vue';
 import NumberInput from './NumberInput.vue';
 import EmailInput from './EmailInput.vue';
 import BooleanInput from './BooleanInput.vue';
 import DateInput from './DateInput.vue';
 import MultipleChoiceInput from './MultipleChoiceInput.vue';
 import ArrayInput from './ArrayInput.vue';
 import ListSelection from './ListSelection.vue';
 import { eventBus } from '../../eventBus.js';

 export default {
     props: {
         option: {
             type: Object,
             required: true
         },
         fieldName: {
             required: true
         },
         optGroup: {
             type: Object,
             required: false
         },
         workflowObj: {
             type: Object,
             requried: true
         }
     },
     data() {
         return {
             dirty: false,
             valid: false,
             dismissSecs: 5,
             dismissCountdown: 0,
             successMsg: '',
             failureMsg: '',
             showFailureAlert: false
         };
     },
     methods: {
         updateOption(obj) {
             this.dirty = true;
             this.$emit('fieldUpdated', { fieldName: this.fieldName, fieldValue: obj.fieldValue } );
         },
         getInputType(typeName) {
             let typeMap = [
                 { type: 'Textarea', inputType: 'textarea-input' },
                 { type: 'Number',  inputType: 'number-input' },
                 { type: 'String',  inputType: 'text-input' },
                 { type: 'Email',   inputType: 'email-input' },
                 { type: 'Boolean', inputType: 'boolean-input' },
                 { type: 'Date',    inputType: 'date-input' },
                 { type: 'MultipleChoice',  inputType: 'multiple-choice-input'},
                 { type: 'Array', inputType: 'array-input' },
                 { type: 'ListSelection', inputType: 'list-selection' }
             ];

             let typeObjs = typeMap.filter(function(e) {
                 return e.type === typeName;
             });

             let numElements = typeObjs.length;

             if (numElements == 0 || numElements > 1) {
                 return 'text-input';
             }

             return typeObjs[0].inputType;
         },
         revertChanges(obj) {
             console.log('Input::revertChanges');
             console.log(obj);
             let option = obj.opts.find((e) => e.name === this.fieldName );
             let newValue = option.value;
             eventBus.$emit('revert', { name: this.fieldName, value: newValue });             
         },
         countDownChanged(dismissCountdown) {
             this.dismissCountdown = dismissCountdown;
         }
     },
     components: {
         textInput: TextInput,
         textareaInput: Textarea,
         numberInput: NumberInput,
         emailInput: EmailInput,
         booleanInput: BooleanInput,
         dateInput: DateInput,
         multipleChoiceInput: MultipleChoiceInput,
         arrayInput: ArrayInput,
         listSelection: ListSelection
     },
     created() {
         eventBus.$on('revertChanges', function(obj) {
             console.log('Input::revertChangesHandler');
             console.log(obj);
             this.revertChanges(obj);
         }.bind(this));

         eventBus.$on('validate', function (obj) {
             if (obj.fieldName === this.fieldName) {
                 this.valid = true;
             }
         }.bind(this));

         eventBus.$on('invalidate', function (obj) {
             if (obj.fieldName === this.fieldName) {
                 this.valid = false;
             }
         }.bind(this));

         eventBus.$on('duplicateKey', function (obj) {
             if (obj.field === this.fieldName) {
                 this.failureMsg = 'a record with value ' + obj.value + ' exists in the database';
                 this.showFailureAlert = true;
             }
         }.bind(this));

         eventBus.$on('uniqueKey', function (obj) {
             if (obj.field === this.fieldName) {
                 this.successMsg = obj.value + ' is available';
                 this.dismissCountdown = this.dismissSecs;
             }
         }.bind(this));
     },
     destroyed() {
         eventBus.$off('revertChanges');
     }
 };
</script>

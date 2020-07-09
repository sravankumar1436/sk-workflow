<template>
    <div>
        <div v-if="addingElements">
            <h4>Add Elements to {{ this.label }}</h4>
            <br>
            <b-container>
                <b-row class="mb-1 text-left">
                    <b-col cols="8">
                        <label>Number to Add: </label>
                    </b-col>
                    <b-col>
                        <input
                            type="number"
                            style="text-align: right; width: 3em;"
                            @change="addNewElement"
                        />
                    </b-col>
                </b-row>
                <b-row class="mb-1 text-left">
                    <b-col cols="8">
                        <label>Use Default Value: </label>
                    </b-col>
                    <b-col>
                        <input type="checkbox" v-model="useDefaultValue" />
                    </b-col>
                </b-row>
                <b-row class="mb-1 text-left">
                    <b-col cols="8">
                        <label>Generate Labels: </label>
                    </b-col>
                    <b-col>
                        <input type="checkbox" v-model="autoLabels" />
                    </b-col>
                </b-row>
            </b-container>
            <div>
                <b-button
                    variant="primary"
                    :disabled="(useDefaultValue && autoLabels) || newElements.length === 0"
                    @click="customizeElements"
                >
                    Customize Elements
                </b-button>
                <b-button
                    variant="primary"
                    :disabled="! useDefaultValue || ! autoLabels"
                    @click="addElements"
                >
                    Add Elements
                </b-button>
                <b-button variant="primary" @click="cancelAddElements">Cancel</b-button>
            </div>
        </div>
        <div v-if="customizing">
            <h4>Customize Elements</h4>
            <b-container>
                <div v-for="e of newElements">
                    <b-row class="text-left">
                        <b-col cols="2">
                            <strong>Label: </strong>
                        </b-col>
                        <b-col>
                            <input
                                type="text"
                                :style="getTextStyle(defaultValue.label)"
                                v-model="e.label"
                                :disabled="autoLabels"
                            />
                        </b-col>
                        <b-col cols="2">
                            <strong>Default Value: </strong>
                        </b-col>
                        <b-col>
                            <input
                                type="text"
                                :style="getTextStyle(defaultValue)"
                                v-model="e.value"
                                :disabled="useDefaultValue"
                            /> 
                        </b-col>
                    </b-row>
                </div>
            </b-container>
            <b-button variant="primary" @click="doneCustomizing">OK</b-button>
            <b-button variant="primary" @click="cancelCustomizing">Cancel</b-button>
        </div>
    </div>
</template>

<script>
 export default {
     props: {
         label: {
             required: true
         },
         elements: {
             type: Array,
             required: true
         },
         workflowObj: {
             type: Object,
             required: true
         }
     },
     computed: {
         lastIndex: function() {
             return this.elements.length + this.newElements.length;
         },
         nextLabel: function() {
             let lastIndex = this.lastIndex;
             let labelParts = this.elements[0].label.split(/\s/);
             let labelPrefix = labelParts[0];

             let suffix = labelParts.length > 1 ? (lastIndex + 1).toString() : '';
             return labelPrefix + (suffix ? (' ' + suffix) : '');
         },
         defaultValue: function() {
             let obj = JSON.parse(JSON.stringify(this.elements[0]));
             obj.label = this.nextLabel;
             console.log(obj.label);
             return obj;
         }
     },
     data() {
         return {
             newElements: [],
             type: this.elements[0].type,
             useDefaultValue: true,
             autoLabels: true,
             addingElements: true,
             customizing: false
         };
     },
     methods: {
         addElements() {
             for (let e of this.newElements) {
                 this.elements.push(e);
             }

             this.$emit('doneAddingElements');
         },
         addNewElement() {
             console.log('adding new element');
             this.newElements.push(this.defaultValue);
         },
         cancelAddElements() {
             this.$emit('doneAddingElements');
         },
         customizeElements() {
             this.addingElements = false;
             this.customizing = true;
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
         },
         getType() {
             let typeMap = [
                 { type: 'Textarea', inputType: 'textarea' },
                 { type: 'Number',  inputType: 'number' },
                 { type: 'String',  inputType: 'text' },
                 { type: 'Email',   inputType: 'email' },
                 { type: 'Boolean', inputType: 'boolean' },
                 { type: 'Date',    inputType: 'date' }
             ];

             return typeMap.filter((e) => e.type === this.type)[0].inputType;
         },
         doneCustomizing() {
             this.customizing = false;
             this.addElements();
         },
         cancelCustomizing() {
             this.customizing = false;
             this.addingElements = true;
             this.autoLabels = true;
             this.useDefaultValues = true;
         }
     }
 };
</script>

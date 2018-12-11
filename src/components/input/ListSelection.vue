<template>
    <div>
        <select class="select.input-lg" v-model="selectedValue" :multiple="option.multiple" @change="updateValue()">
            <option disabled value=''>
                {{ option.placeholder }}
            </option>
            <option v-for="choice in option.choices" :value="choice">{{displayName(choice)}}</option>
        </select>
    </div>
</template>

<script>
import Field from './mixins/Field.js';
import { eventBus } from '../../eventBus.js';

export default {
    /* eslint-disable no-console */
    mixins: [Field],
    computed: {
        selectedValue: {
            get: function () {
                if (typeof(this.option.choices[0]) === 'object') {
                    console.log(this.option.label + ' has object value');
                    let s = this.option.choices.find( (e) => {
                        let key =  this.option.key;
                        return e[key] === this.value[key].value;
                    }, this);
                    console.log('selectedValue::get: ');
                    console.log(s);
                    return s;
                } else {
                    console.log(this.option.label + ' has simple value');
                    return this.value;
                }
            },
            set: function(newValue) {
                console.log('ListSelection::setting new value');
                console.log(newValue);
                if (typeof(newValue) === 'object') {
                    let keys = Object.keys(newValue);
                    for (let i in keys) {
                        this.value[keys[i]].value = newValue[keys[i]];
                    }
                } else {
                    this.value = newValue;
                }
            }
        }
    },
    methods: {
        displayName(choice) {
            let key = this.option.key;
            if (typeof(choice) === 'object') {
                return choice[key];
            } else {
                return choice;
            }
        },
        updateValue() {
            if (typeof(this.selectedValue) === 'object') {
                let keys = Object.keys(this.selectedValue);
                for (let i in keys) {
                    this.value[keys[i]].value = this.selectedValue[keys[i]];
                }
            } else {
                this.value = this.selectedValue;
            }
            this.update();
        }
    },
    created() {
        eventBus.$emit('validate', { fieldName: this.id });
    }
};
</script>

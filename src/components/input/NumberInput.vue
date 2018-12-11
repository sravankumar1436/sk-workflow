<template>
    <input
        type="number"
        :style="style"
        v-model="value"
        @change="validateNum()"
        :min="option.minValue"
        :max="option.maxValue"
        :step="option.step || 1" :required="option.required" :disabled="option.readOnly"
    />
</template>

<script>
 import Field from './mixins/Field.js';

 export default {
     mixins:[Field],
     computed: {
         fieldWidth: function() {
             let digits = 0;
             let n = this.value;
             while (n >= 1) {
                 ++digits;
                 n /= 10;
             }
             digits = digits < 3 ? 3 : digits;
             return (digits).toString() + 'em';
         },
         style: function() {
             let fieldWidth = this.fieldWidth;
             return 'text-align: right; width: ' + fieldWidth;
         }
     },
     methods: {
         validateNum() {
             let numVal = Number(this.value);
             if ( isNaN(numVal) ) {
                 throw 'invalid value ' + this.value;
             }
             this.validate();
         }
     }
 };
</script>

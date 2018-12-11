<template>
    <input
        ref="input"
        :style="style"
        type="text"
        v-model="value"
        :size="option.fieldLength || 92"
        :required="option.required"
        :disabled="option.readOnly"
        :pattern="option.pattern"
        @change="validate()"
    >
</template>

<script>
import Field from './mixins/Field.js';

export default {
     mixins: [Field],
     computed: {
         style: function() {
             if (this.option.align) {
                 return 'text-align: ' + this.option.align;
             }
         }
     }
 };
</script>

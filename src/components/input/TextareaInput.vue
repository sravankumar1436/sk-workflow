<template>
    <input
        ref="input"
        type="text"
        v-model="value"
        rows="option.rows || 2"
        :cols="option.fieldLength || 92"
        :required="option.required"
        :disabled="option.readOnly"
        :pattern="option.pattern"
        @change="validate()"
    >
</template>

<script>
import Field from './mixins/Field.js';

export default {
    mixins: [Field]
};
</script>

<template>
    <div>
        <div v-for="choice in option.choices">
            <input type="radio" :value="choice" v-model="value" @click="update">{{ choice }}
        </div>
    </div>
</template>

<script>
import Field from './mixins/Field.js';
import { eventBus } from '../../eventBus.js';

export default {
    mixins: [Field],
    created() {
        eventBus.$emit('validate', { fieldName: this.id });
    }
};
</script>

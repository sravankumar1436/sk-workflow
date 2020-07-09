<template>
    <input type="checkbox" v-model="value" @change="update">
</template>

<script>
import Field from './mixins/Field.js';

export default {
    mixins: [Field]
};
</script>

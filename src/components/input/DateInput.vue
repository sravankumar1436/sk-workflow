<template>
    <input type="date" v-model="formattedDate" :required="option.required" :disabled="option.readOnly" @change="update">
</template>

<script>
import Field from './mixins/Field.js';
import moment from 'moment';

export default {
    mixins: [Field],
    methods: {
        currentDate() {
            return moment().format('YYYYMMDD');
        }
    },
    computed: {
        formattedDate: {
            get: function() {
                // YYYY-MM-DD is the required wire format of the date value
                // as prescribed by IETF RFC333 (http://tools.ietf.org/html/rfc3339)
                // the presentation fromat will be browser and possibly locale dependent
                // and may differ from the wire format
                return moment(this.value ? this.value : this.currentDate()).format('YYYY-MM-DD');
            },
            set: function(newValue) {
                this.value = moment(newValue ? newValue : this.currentDate()).format('YYYY-MM-DD');
            }
        }
    },
    created() {
        if (! this.value) {
            this.value = this.currentDate();
            this.update();
        }
    }
};
</script>

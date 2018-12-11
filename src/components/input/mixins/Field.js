import { eventBus } from '../../../eventBus.js';

export default {
    props: {
        option: {
            type: Object,
            required: true
        },
        id: {
            required: true
        },
        optGroup: {
            type: Object,
            required: false
        },
        workflowObj: {
            type: Object,
            required: true
        }
    },
    watch: {
        option: function(newOpts) {
            console.log('Field.js:: watcher for ' + this.id + ' newValue = ' + newOpts.value);
            this.value = newOpts.value;
        }
    },
    data() {
        return {
            value: this.option.value
        };
    },
    methods: {
        update() {
            /* eslint-disable no-console */
            console.log('Field.js: updating value');
            this.$emit('update-field', {
                fieldValue: this.value
            });
        },
        validateValue(value) {
            let regex = new RegExp(this.option.pattern);
            let element = this.$el;
            if (! value.match(regex) ) {
                alert(value + ' does not match the required pattern for ' + this.id + ': ' + this.option.pattern);
                element.style = 'border: 2px solid red;';
                element.focus();
                eventBus.$emit('invalidate', { fieldName: this.id });
                return;
            } else {
                element.style='';
                eventBus.$emit('validate', { fieldName: this.id });
            }
        },
        validate() {
            if (this.option.pattern) {
                this.validateValue(this.value);
            } else if (this.option.unique) {
                let element = this.$el;
                this.$http.get('check_primary_key' +
                               '/' + this.option.table +
                               '/' + this.option.name +
                               '/' + element.value
                              ).then(
                                  response => {
                                      if (! response.body) {
                                          element.style = '';
                                          eventBus.$emit('validate', { fieldName: this.id });
                                          eventBus.$emit(
                                              'uniqueKey',
                                              { field: this.id, value: this.value }
                                          );
                                          this.update();                                          
                                      } else {
                                          element.style = 'border: 2px solid red;';
                                          eventBus.$emit(
                                              'duplicateKey',
                                              { field: this.id, value: this.value }
                                          );
                                      }
                                  },
                                  err => {
                                      console.log(err.body);
                                  }
                              );
            } else {
                let element = this.$el;
                element.style = '';
                eventBus.$emit('validate', { fieldName: this.id });
                this.update();
            }
        }
    },
    created() {
        eventBus.$on('revert', (obj) => {
            console.log('Field.js: ' + this.id + ' received revert event');
            console.log(obj);
            if (obj.name  === this.id) {
                console.log('Field.js: reverting ' + this.id + ' to ' + obj.value);
                this.value = obj.value;
            }
        });
        if (this.value) {
            eventBus.$emit('validate', { fieldName: this.id });
        }
    }
};

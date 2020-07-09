<template>
    <input :ref="this.id" type="email" v-model="value" :required="option.required" :readOnly="option.readOnly" :size="option.fieldLength || 80" @change="validateEmailAddress()">
</template>

<script>
 import Field from './mixins/Field.js';
 import { eventBus } from '../../eventBus.js';

 export default {
     mixins: [Field],
     data() {
         return {
             singleAddressRegex: '[a-zA-z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-z0-9.!#$%&\'*+\\/=?^_`{|}~-]+\\.[a-z]+',
             badDelimRegexBase: '[a-zA-z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@',
             multipleAddressRegex: '',
             validDomainAlert: '',
             invalidDomainAlert: 'The following addresses contain invalid domains:\n',
             invalidAddressAlert: 'The following addresses are improperly formatted:\n'
         };
     },
     methods: {
         checkDomains(address) {             
             let domain = address.split('@')[1];
             return this.validDomains.find(function(e) {
                 return e === domain;
             });
         },
         checkFormatting(address, obj) {
             let matchResult = address.match(obj.regex);
             return matchResult && matchResult[0] === matchResult.input;
         },
         checkAddresses(addressStr, fn, obj) {
             let result = { valid: true, bad: [], alertMsg: '' };

             addressStr.split(';').forEach( (addr) =>  {
                 if (! fn(addr, obj)) {
                     result.bad.push(addr);
                     result.alertMsg += '    ' + addr + '\n';
                 }
             });

             result.valid = result.bad.length === 0;
             
             return result;
         },
         validateEmailAddress() {
             let valid = true;
             let element = this.$refs[this.id];

             if (this.value.length > 0) {
                 if (! this.option.multiple) {                 
                     let resultObj = this.checkAddresses(
                         this.value,
                         this.checkFormatting,
                         { regex: this.singleAddressRegex } 
                     );
                     if (!resultObj.valid) {
                         valid = false;
                         alert(this.option.label + ':\n' + this.invalidAddressAlert + resultObj.alertMsg);
                     } else {
                         if (this.value.match(/[^;];+[^;]+.*/)) {
                             valid = false;
                             alert(this.option.label + ' only accepts a single e-mail address');
                         }
                     }
                 }
                 
                 if (this.option.multiple) {
                     if (this.value.match(this.badDelimRegex)) {
                         valid = false;
                         alert(this.option.label + ' contains an invalid separator');
                     } else {
                         let resultObj = this.checkAddresses(
                             this.value,
                             this.checkFormatting,
                             { regex: this.multipleAddressRegex } 
                         );
                         if (!resultObj.valid) {
                             valid = false;
                             alert(this.option.label + ':\n' + this.invalidAddressAlert +
                                   resultObj.alertMsg);
                         }
                     }
                 }
                 
                 if (valid) {
                     let resultObj = this.checkAddresses(
                         this.value,
                         this.checkDomains
                     );
                     if (!resultObj.valid) {
                         valid = false;
                         alert(this.option.label + ':\n' +
                               this.invalidDomainAlert + resultObj.alertMsg
                             + '\n' + this.validDomainAlert);                             
                     }                 
                 }                 
             }

             if (!valid) {                 
                 element.style = 'border: 2px solid red;';
                 eventBus.$emit('invalidate', { fieldName: this.id });
             } else {
                 element.style = '';
                 eventBus.$emit('validate', { fieldName: this.id });
             }                 

             this.update();
         },
     },
     created() {
         this.validDomains = this.optGroup.validDomains;
         this.validDomainAlert = 'ValidDomains:\n';
         this.validDomains.forEach( (e) => {
             this.validDomainAlert += '    ' + e + '\n';
         });
         this.multipleAddressRegex = '(' + this.singleAddressRegex + ')(;' + this.singleAddressRegex +')*';
         let validDomainsStr = '(?:';

         let domainsGroup = this.validDomains.map( (e) => {
             return e.replace(/\./g, '\\.');
         });

         validDomainsStr += domainsGroup.join('|') + ')';
         
         this.badDelimRegex = this.badDelimRegexBase + validDomainsStr + '[^;]'
                            + this.badDelimRegexBase + validDomainsStr;
     }
 };
</script>

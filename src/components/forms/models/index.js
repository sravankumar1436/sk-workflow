/*
  These are models for the generic form component.

  A form is a collection of input controls called formFields.

  A formField is a collection of attributes that work together for
  the proper functioning of a given input field

  A formFieldConfig is s collection of rules that can be used to paint
  a given form field

  A formConfig is a collection of formFieldConfig elements that capture the
  essence of a given form; e.g a user login form has the following entities
  in the background of these form models

  1. username formField
  2. username formFieldConfig
  3. password formField
  4. password formFieldConfig
  5. the emergent user login formConfig


*/

import FormConfig from './form-config.js';
import { FormField, MakeFieldData } from './form-field.js';
import { FormFieldConfig, MakeFieldAttributes } from './form-field-config.js';

export default {
    FormFieldConfig,
    MakeFieldAttributes,
    MakeFieldData,
    FormField,
    FormConfig
}

<template>
    <div>
        <table class="table">
            <thead class="thead-light">
                <tr class="d-flex">
                    <th class="col-2">Section</th>
                    <th class="col-2">Step Name</th>
                    <th class="col-2">Enabled</th>
                    <th class="col-2">Notify on Completion</th>
                    <th class="col-2">Delete Output</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="section of workflowObj.getAnalysisSections()">
                    <tr class="d-flex">                        
                        <th
                            id="section-header"
                            class="col-5"
                        >
                            <strong>{{ section.label }}</strong>
                        </th>
                    </tr>
                    <template v-for="step of section.steps">
                        <tr class="d-flex">
                            <td class="col-2 td-blank">
                            </td>
                            <td class="col-2 table-bordered">
                                {{ step.label }}
                            </td>
                            <td class="col-2 table-bordered td-bool">
                                <input type="checkbox" v-model="step.enabled">
                            </td>
                            <td class="col-2 table-bordered td-bool">
                                <input type="checkbox" v-model="step.notify" :disabled="! step.enabled">
                            </td>
                            <td class="col-2 table-bordered td-bool">
                                <input type="checkbox" v-model="step.deleteOutput" :disabled="! step.enabled">
                            </td>
                        </tr>
                    </template>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
 
 export default {
     props: {
         workflowObj: {
             type: Object,
             requried: true
         }
     }
 };
</script>

<style>
 .td-bool {
     text-align: center;
     vertical-align: middle !important;
 }
 .td-blank {
     border-top: none !important;
     border-bottom: none !important;
 }
 .table th {
     border-top: none !important;
     border-bottom: none !important;
     text-align: center !important;
     padding-right: 0px !important;
     padding-left: 0px !important;
 }
 #section-header {
     text-align: left !important;
 }
 td {
     vertical-align: top !important;
     padding-top: 1px !important;
     padding-bottom: 1px !important;
     padding-right: 0px !important;
     padding-left: 0px !important;
 }
</style>
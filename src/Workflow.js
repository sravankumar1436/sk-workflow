import moment from 'moment';

export default function Workflow(assayId, baseConfig, stepConfig, workflowName, userId, lastModified) {
    this.assayId = assayId;
    this.workflowName = workflowName || '';
    this.baseConfig = baseConfig;
    this.stepConfig = stepConfig;
    this.userId = userId || '';
    this.lastModified = lastModified || moment().unix();
    this.toolTemplates = {};

    this.invalidFields = { base: [], step: { preprocess: [], analysis: [] } };
}

Workflow.prototype.clone = function() {
    return this.cloneObj(this);
};

Workflow.prototype.cloneBaseConfig = function() {
    return this.cloneObj(this.baseConfig);
};

Workflow.prototype.cloneStepConfig = function() {
    return this.cloneObj(this.stepConfig);
};

Workflow.prototype.getBaseObjAsString = function() {
    return JSON.stringify(this.baseConfig);
};

Workflow.prototype.getStepObjAsString = function() {
    return JSON.stringify(this.stepConfig);
};

Workflow.prototype.getSectionObj = function(sectionName) {
    return this.stepConfig.config.sections.find((e) => e.name === sectionName);
};

Workflow.prototype.getStepObj = function(sectionName, stepName) {
    const section = this.getSectionObj(sectionName);
    return section.steps.find((e) => e.name === stepName);
};

Workflow.prototype.getProgramObj = function(sectionName, stepName, exeName) {
    const step = this.getStepObj(sectionName, stepName);
    return step.externalPrograms.find((p) => p.name === exeName);
};

Workflow.prototype.getStepsForSection = function(sectionName)  {
    const section = this.getSectionObj(sectionName);
    return section.steps;
};

Workflow.prototype.getOptGroup = function(optGroupName) {
    return this.baseConfig.config.baseOptions.find((e) => e.name === optGroupName);
};

Workflow.prototype.getAllOptGroups = function() {
    return this.baseConfig.config.baseOptions;
};

Workflow.prototype.getAnalysisSections = function () {
    return this.stepConfig.config.sections;
};

Workflow.prototype.checkStepValidity = function(sectionName, stepName) {
    let step = this.getStepObj(sectionName, stepName);
    let bools = step.externalPrograms.map(e => e.valid);
    let stepValid = bools.reduce((result, current) => { return result & current; }, true);
    console.log(step.name + ' is ' + stepValid);
    step.valid = Boolean(stepValid);
};

Workflow.prototype.isValid = function() {
    let baseConfigValid = true;

    let baseOptions = this.baseConfig.config.baseOptions;
    baseOptions.forEach((e) => {
        if (! e.valid) {
            console.log(e.name + ' is invalid');
            this.invalidFields.base.push(e.name);
        }
        baseConfigValid = baseConfigValid & e.valid;
    });

    let stepConfigValid = true;

    let sections = this.stepConfig.config.sections;
    
    sections.forEach((section) => {
        section.steps.forEach((step) => {
            if (step.enabled && ! step.valid) {
                console.log(step.name + ' is invalid');
                this.invalidFields.step[section.name].push(step.name);
                stepConfigValid = stepConfigValid & step.valid;
            }
        });            
    });

    return baseConfigValid & stepConfigValid;
};

Workflow.prototype.displayInvalidFields = function() {
    let errmsg = '';
    
    if (this.invalidFields.base.length) {
        errmsg += 'Base Configuration\n';
        this.invalidFields.base.forEach((e) => {
            errmsg += '\t' + e + '\n';
        });

        errmsg += '\n';
    }

    if (this.invalidFields.step.preprocess.length) {
        errmsg += 'PreProcess\n';
        this.invalidFields.step.preprocess.forEach((e) => {
            errmsg += '\t' + e + '\n';
        });
    }

    if (this.invalidFields.step.analysis.length) {
        errmsg += 'Analysis\n';
        this.invalidFields.step.analysis.forEach((e) => {
            errmsg += '\t' + e + '\n';
        });
    }

    return errmsg;
};

Workflow.prototype.addToolTemplate = function(exeName, template) {
    this.toolTemplates[exeName] = this.cloneObj(template);
};

Workflow.prototype.mergeToolTemplate = function(programObj) {
    programObj['options'] = this.cloneObj(this.toolTemplates[programObj.name].config.options);
    if (programObj.hasOwnProperty('overrides')) {
        this.overrideDefaultValues(programObj);
    }
};

Workflow.prototype.overrideDefaultValues = function(programObj) {
    for (let override in programObj.overrides) {
        const index = programObj.options.findIndex((option) => option.name === override);   
        
        if (Array.isArray(programObj.options[index].value)) {
            let overrideValueArray = programObj.overrides[override].value;
            let defaultValueArray = programObj.options[index].value;

            if (overrideValueArray.length === 0) {
                programObj.options.splice(index, 1);
            } else {
                for (let i in overrideValueArray) {
                    if (typeof(overrideValueArray[i]) === 'object') {
                        defaultValueArray[i] = this.cloneObj(overrideValueArray[i]);
                    } else {
                        defaultValueArray[i].value = overrideValueArray[i];
                    }
                }
            }
        } else {
            programObj.options[index].value = programObj.overrides[override].value;
        }
    }    
};

Workflow.prototype.cloneObj = function(obj) {
    return JSON.parse(JSON.stringify(obj));
};

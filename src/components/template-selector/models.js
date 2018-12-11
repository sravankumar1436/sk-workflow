/*
  Template is the single source of truth for data and behavior
  about this app's Templates. A template has a title and a description
*/

class Template {
    constructor(title, description) {
        this._title = title;
        this._description = description;
    }

    // get the template
    get title() {
        return this._title;
    }

    // get the description
    get description() {
        return this._description;
    }

    // set the title
    set title(title) {
        this._title = title;
    }

    // set the description
    set description(description) {
        this._description = description;
    }
}

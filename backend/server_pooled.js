/* eslint-disable no-unused-vars* /
/* global require b:true  */
/* global __dirname b:true */
/* eslint no-undef: "error" */
/* eslint-enable no-unused-vars */

const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const Sqlite = require('sqlite-pool');
const ldap = require('ldapjs');
const assert = require('assert');
const atob = require('atob');
require('dotenv').config();

const app = express();

const dbPath = path.resolve(__dirname, 'bfx_workflows_dev.db');
console.log(dbPath);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

let client;

const ldapConfig = {
    url: 'ldap://global.sial.com',
    binddn: 'CN=s_ldap_f5,OU=RCK,OU=NA,OU=Service Accounts and Groups,OU=Special Objects,DC=global,DC=sial,DC=com',
    bindpw_base64: 'MUJpZ1JlZEJhbGwhIQ==',
    basedn: 'DC=global,DC=sial,DC=com',
    filter: '(&(objectClass=organizationalPerson)(objectClass=user)(sAMAccountName=%s))'
};

function createLDAPClient() {
    return new Promise(function (resolve, reject) {
        console.log('creating LDAP client');
        client = ldap.createClient({ url: ldapConfig.url });

        if (client) {
            resolve('LDAP client created');
        } else {
            reject(Error('Could not create LDAP client'));
        }
    });
}

function isAuthorizedUser(username) {
    let result = false;
    let sql = 'SELECT * FROM users WHERE name = ' + "'" + username + "'";
    console.log(sql);

    return Promise.all([db.get(sql)]);
}

function bindLDAP() {
    return new Promise(function (resolve, reject) {
        let bindError;

        client.bind(ldapConfig.binddn, atob(ldapConfig.bindpw_base64), function (err) {
            bindError = err;
            if (bindError) {
                reject(Error(bindError));
            } else {
                resolve('Successfully bound LAP client');
            }
        });
    });
}

let db = new Sqlite(
    dbPath,
    { Promise, mode: Sqlite.OPEN_READWRITE }, (err) => {
        let msg = '';
        if (err) {
            msg = err.message;
            console.error(msg);
        }
        msg = 'Connected to the bfx_workflow database.';
        console.log(msg);
    });

app.listen(process.env.EXPRESS_PORT, function() {
    console.log('Listening on port ' + process.env.EXPRESS_PORT + '...');
});

db.on('trace', (sql) => console.log('trace ' + sql));

app.get('/', (req, res, next) => {
    console.log('get request for home page');
    res.status(200).send('Welcome to the Bioinformatics Workflow Configuration Application');
});

app.get('/templates', (req, res, next) => {
    console.log('get request for workflow templates');
    let sql = 'SELECT name, title, description, enabled FROM template_index NATURAL JOIN step_templates';

    return Promise.all([db.all(sql)]).then(([rows]) => {
        console.log(rows);
        let body = null;
        console.log('getTemplateNames: ' + rows.length + ' rows returned');
        let templateNames = [];
        if (rows.length === 0) {
            body = 'getTemplateNames: no rows returned';
        } else {
            for (let r of rows) {
                templateNames.push(
                    {
                        name: r.name,
                        title: r.title,
                        description: r.description,
                        enabled: r.enabled
                    }
                );
            }
            console.log('getTemplateNames: templateNames = ' + templateNames);
            body = templateNames;
        }
        console.log('getTemplateNames: body = ' + body);
        res.status(200).send(body);
    }).catch((err) => {
        console.error('getTemplateNames: ' + err.message);
        res.status(500).send(err.message);
    });
});

app.get('/template/:id', (req, res, next) => {
    console.log('get request for template with id');
    let id = req.params.id;
    let sql = 'SELECT config FROM step_templates' + ' WHERE name = "' + id + '"';

    return Promise.all([db.all(sql)]).then(([rows]) => {
        let status = 200;
        let body = null;
        console.log('getTemplateByName: ' + rows.length + ' rows returned');
        if (rows.length > 1) {
            status = 500;
            body = 'too many rows returned for ' + id;
        } else {
            body = rows[0].config;
        }
        res.status(status).send(body);
    }).catch((err) => {
        console.error('getTemplateById: ' + err.message);
        res.status(500).send(err.message);
    });
});

app.get('/tooltemplate/:id', (req, res, next) => {
    console.log('get request for tool template with id = ' + req.params.id);
    let id = req.params.id;
    let sql = 'SELECT config FROM tool_templates' + ' WHERE name = "' + id + '"';

    return Promise.all([db.all(sql)]).then(([rows]) => {
        let status = 200;
        let body = null;
        console.log('getTemplateByName: ' + rows.length + ' rows returned');
        if (rows.length > 1) {
            status = 500;
            body = 'too many rows returned for ' + id;
        } else {
            body = rows[0].config;
        }
        res.status(status).send(body);
    }).catch((err) => {
        console.error('getTemplateById: ' + err.message);
        res.status(500).send(err.message);
    });
});

app.get('/save_template/:type/:id/:obj', (req, res, next) => {
    console.log('save ' + req.params.type + ' template object ' + req.params.id);

    let table = req.params.type + '_templates';
    let obj = req.params.obj;
    let name = req.params.id;
    let sql = 'UPDATE ? SET config to ? WHERE name = ?';

    return Promise.all([db.run(sql, [table, obj, name])]).then((rows) => {
        let body = 'saveTemplate: ' + this.changes + ' rows updated in ' + table +
            ' for template ' + name;
        console.log(body);
        res.status(status).send(body);
    }).catch((err) => {
        console.error('saveTemplate: ' + err.message);
        res.status(500).send(err.message);
    });
});


app.get('/check_primary_key/:table/:key/:value', (req, res, next) => {
    console.log('checking availability of  ' + req.params.value + ' for ' + req.params.key + ' in ' + req.params.table);

    let key = req.params.key;
    let table = req.params.table;
    let value = req.params.value;

    let sql = 'SELECT ' + key + ' FROM ' + table + ' WHERE ' + key + ' = ' + "'" + value + "'";
    console.log(sql);

    return Promise.all([db.get(sql)]).then((rows) => {
        console.log('checkPrimaryKey: ');
        let body = '';

        console.log(rows);

        if (typeof(rows[0]) === 'undefined') {
            console.log('no rows returned from workflows for ' + value);
            body = '';
        } else {
            console.log(value + ' was found in workflows');
            body = value;
        }
        res.status(200).send(body);
    }).catch((err) => {
        console.error('checkPrimaryKey: ' + err.message);
        res.status(500).send(err.message);
    });
});




app.post('/save_workflow', (req, res, next) => {
    console.log('saving ' + req.body.workflowName);

    let sql = 'INSERT INTO workflows VALUES(?, ?, ?, ?, ?, ?);';
    let params = [req.body.workflowName, req.body.assay, req.body.userId,
                  req.body.baseConfig, req.body.stepConfig, req.body.lastModified];

    return Promise.all([db.run(sql, params)]).then(() => {
            let body = 'saveWorkflow: workflow ' + req.body.workflowName +
                ' saved into workflows table';
            console.log(body);
            res.status(200).send(body);
        }).catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

app.post('/update_workflow', (req, res, next) => {
    console.log('updating workflow ' + req.body.workflowName);

    let sql = 'UPDATE workflows SET baseConfig = ?, stepConfig = ?, ' +
        'userId = ?, lastModified = ? WHERE assay = ? AND workflowName = ?;';

    let params = [req.body.baseConfig, req.body.stepConfig, req.body.userId,
                  req.body.lastModified, req.body.assay, req.body.workflowName];
    return Promise.all([db.run(sql, params)]).then(() => {
            let body = '';

            body = 'updateWorkflow: workflow ' + req.body.workflowName +
                ' updated in workflows table';
            console.log(body);
            res.status(200).send(body);
        }).catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

app.get('/query_workflow/:assayName', (req, res, next) => {
    console.log('querying for workflow for assay ' + req.params.assayName);

    let sql = 'SELECT * FROM workflows WHERE assay = ?';

    return Promise.all([db.all(sql, req.params.assayName)]).then(([rows]) => {
        console.log('queryWorkflow: ' + rows.length + ' rows found');
        console.log(typeof(rows[0]));
        res.status(200).send(rows);
    }).catch((err) => {
        console.error(err);
        res.status(500).send(err);
    });
});

app.post('/authenticate', (req, res, next) => {
    function success(value) {
        console.log(value);
    }

    function failure(err) {
        console.log(err);
    }

    createLDAPClient().then(success).catch(failure);
    bindLDAP().then(success).catch(failure);

    let filter = ldapConfig.filter;
    let userFilter = filter.replace(/%s/, req.body.username);
    let options = {
        filter: userFilter,
        scope: 'sub',
        attributes: ['dn', 'sAMAccountName']
    };

    let credentials = { username: req.body.username, password: req.body.password };
    let entries = [];
    let status = 200;
    let body;

    client.search(ldapConfig.basedn, options, function (err, ldapRes) {
        assert.ifError(err);

        ldapRes.on('searchEntry', function(entry) {
            console.log(entry.object);
            entries.push(entry.object);
        });
        ldapRes.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
        });
        ldapRes.on('error', function(err) {
            console.error('error: ' + err.message);
            status = 500;
            body = err.message;
        });
        ldapRes.on('end', function(result) {
            console.log('status: ' + result.status);
            console.log('search: ' + entries.length + ' entry(ies) were found');
            if (entries.length === 0) {
                status = 500;
                body = credentials.username + ' is not a valid MilliporeSigma user account';
                res.status(status).send(body);
            } else if (entries.length > 1) {
                status = 500;
                body = 'too many entries found for ' + credentials.username;
                res.status(status).send(body);
            } else {
                if (entries[0].sAMAccountName.toLowerCase() !== credentials.username.toLowerCase()) {
                    status = 500;
                    body = 'entry returned from DNS does not match the username';
                } else {
                    client.bind(entries[0].dn, credentials.password, function(err) {
                        console.log('attempting authentication for ' +
                                    credentials.username);
                        if (err) {
                            console.log(err);
                            status = 500;
                            body = 'authentication failure: ' + err;
                            res.status(status).send(body);
                       } else {
                            const authPromise = isAuthorizedUser(credentials.username.toLowerCase());

                            authPromise
                                .then((rows) => {
                                console.log('query user: ');
                                let body = '';

                                console.log(rows);

                                if (typeof(rows[0]) === 'undefined') {
                                    console.log('no rows returned from users table for ' + username);
                                    result = false;
                                } else {
                                    result = true;
                                    console.log('the user was found and result is: ', result);
                                }


                                res.status(status).send('authorized');


                            }).catch((err) => {
                                console.error('queryUser: ' + err.message);
                                res.status(status).send('not authorized');
                            });




                            console.log('the authorization check result is: ', result);
                            if (result) {
                                body = 'authorized';
                            } else {
                                body = 'not authorized';
                            }

                        }
                    });
                }
            }
        });
    });
});

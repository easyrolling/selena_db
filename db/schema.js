/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
     property('email', String, { index: true });
     property('password', String);
     property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
     // model definitions here
 });

*/

var Email = describe('Email', function () {
    property('id', String);
    property('name', String);
    property('email', String);
    property('web', String);
    property('zip', String);
    property('status_id', String);
    property('is_valid', String);
    property('division', String);
    property('is_sent', String);
    property('category_id', String);
    set('restPath', pathTo.emails);
}, { 
	table: 'email'
});

var MailingStat = describe('MailingStat', function () {
    property('mailing_id', String);
    property('email_id', String);
    property('promotion_id', String);
    property('email', String);
    property('sent_at', String);
    property('action_id', String);
    set('restPath', pathTo.MailingStats);
}, { 
	table: 'mailing_stats'
});

var Mailing = describe('Mailing', function () {
    property('id', String);
    property('from', String);
    property('subject', String);
    property('started_send', Date);
    property('finished_send', Date);
    property('promotion_id', String);
    property('count', String);
    property('engaged', String);
    property('viewed', String);
    property('unsubscribed', String);
    property('bounced', String);
    property('division', String);
    set('restPath', pathTo.mailings);
});


var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function EmailStub () {
    return {
        id: '',
        name: '',
        email: '',
        web: '',
        zip: '',
        status_id: '',
        is_valid: '',
        division: '',
        is_sent: '',
        category_id: ''
    };
}

describe('EmailController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /emails/new
     * Should render emails/new.ejs
     */
    it('should render "new" template on GET /emails/new', function (done) {
        request(app)
        .get('/emails/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/emails\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /emails
     * Should render emails/index.ejs
     */
    it('should render "index" template on GET /emails', function (done) {
        request(app)
        .get('/emails')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/emails\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /emails/:id/edit
     * Should access Email#find and render emails/edit.ejs
     */
    it('should access Email#find and render "edit" template on GET /emails/:id/edit', function (done) {
        var Email = app.models.Email;

        // Mock Email#find
        Email.find = sinon.spy(function (id, callback) {
            callback(null, new Email);
        });

        request(app)
        .get('/emails/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Email.find.calledWith('42').should.be.true;
            app.didRender(/emails\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /emails/:id
     * Should render emails/index.ejs
     */
    it('should access Email#find and render "show" template on GET /emails/:id', function (done) {
        var Email = app.models.Email;

        // Mock Email#find
        Email.find = sinon.spy(function (id, callback) {
            callback(null, new Email);
        });

        request(app)
        .get('/emails/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Email.find.calledWith('42').should.be.true;
            app.didRender(/emails\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /emails
     * Should access Email#create when Email is valid
     */
    it('should access Email#create on POST /emails with a valid Email', function (done) {
        var Email = app.models.Email
        , email = new EmailStub;

        // Mock Email#create
        Email.create = sinon.spy(function (data, callback) {
            callback(null, email);
        });

        request(app)
        .post('/emails')
        .send({ "Email": email })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Email.create.calledWith(email).should.be.true;

            done();
        });
    });

    /*
     * POST /emails
     * Should fail when Email is invalid
     */
    it('should fail on POST /emails when Email#create returns an error', function (done) {
        var Email = app.models.Email
        , email = new EmailStub;

        // Mock Email#create
        Email.create = sinon.spy(function (data, callback) {
            callback(new Error, email);
        });

        request(app)
        .post('/emails')
        .send({ "Email": email })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Email.create.calledWith(email).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /emails/:id
     * Should redirect back to /emails when Email is valid
     */
    it('should redirect on PUT /emails/:id with a valid Email', function (done) {
        var Email = app.models.Email
        , email = new EmailStub;

        Email.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/emails/1')
        .send({ "Email": email })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/emails/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /emails/:id
     * Should not redirect when Email is invalid
     */
    it('should fail / not redirect on PUT /emails/:id with an invalid Email', function (done) {
        var Email = app.models.Email
        , email = new EmailStub;

        Email.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/emails/1')
        .send({ "Email": email })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /emails/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Email on DELETE /emails/:id');

    /*
     * DELETE /emails/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Email on DELETE /emails/:id if it fails');
});

var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function MailingstatStub () {
    return {
        mailing_id: '',
        email_id: '',
        promotion_id: '',
        email: '',
        sent_at: '',
        action_id: ''
    };
}

describe('MailingstatController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /mailingstats/new
     * Should render mailingstats/new.ejs
     */
    it('should render "new" template on GET /mailingstats/new', function (done) {
        request(app)
        .get('/mailingstats/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/mailingstats\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /mailingstats
     * Should render mailingstats/index.ejs
     */
    it('should render "index" template on GET /mailingstats', function (done) {
        request(app)
        .get('/mailingstats')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/mailingstats\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /mailingstats/:id/edit
     * Should access Mailingstat#find and render mailingstats/edit.ejs
     */
    it('should access Mailingstat#find and render "edit" template on GET /mailingstats/:id/edit', function (done) {
        var Mailingstat = app.models.Mailingstat;

        // Mock Mailingstat#find
        Mailingstat.find = sinon.spy(function (id, callback) {
            callback(null, new Mailingstat);
        });

        request(app)
        .get('/mailingstats/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Mailingstat.find.calledWith('42').should.be.true;
            app.didRender(/mailingstats\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /mailingstats/:id
     * Should render mailingstats/index.ejs
     */
    it('should access Mailingstat#find and render "show" template on GET /mailingstats/:id', function (done) {
        var Mailingstat = app.models.Mailingstat;

        // Mock Mailingstat#find
        Mailingstat.find = sinon.spy(function (id, callback) {
            callback(null, new Mailingstat);
        });

        request(app)
        .get('/mailingstats/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Mailingstat.find.calledWith('42').should.be.true;
            app.didRender(/mailingstats\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /mailingstats
     * Should access Mailingstat#create when Mailingstat is valid
     */
    it('should access Mailingstat#create on POST /mailingstats with a valid Mailingstat', function (done) {
        var Mailingstat = app.models.Mailingstat
        , mailingstat = new MailingstatStub;

        // Mock Mailingstat#create
        Mailingstat.create = sinon.spy(function (data, callback) {
            callback(null, mailingstat);
        });

        request(app)
        .post('/mailingstats')
        .send({ "Mailingstat": mailingstat })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Mailingstat.create.calledWith(mailingstat).should.be.true;

            done();
        });
    });

    /*
     * POST /mailingstats
     * Should fail when Mailingstat is invalid
     */
    it('should fail on POST /mailingstats when Mailingstat#create returns an error', function (done) {
        var Mailingstat = app.models.Mailingstat
        , mailingstat = new MailingstatStub;

        // Mock Mailingstat#create
        Mailingstat.create = sinon.spy(function (data, callback) {
            callback(new Error, mailingstat);
        });

        request(app)
        .post('/mailingstats')
        .send({ "Mailingstat": mailingstat })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Mailingstat.create.calledWith(mailingstat).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /mailingstats/:id
     * Should redirect back to /mailingstats when Mailingstat is valid
     */
    it('should redirect on PUT /mailingstats/:id with a valid Mailingstat', function (done) {
        var Mailingstat = app.models.Mailingstat
        , mailingstat = new MailingstatStub;

        Mailingstat.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/mailingstats/1')
        .send({ "Mailingstat": mailingstat })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/mailingstats/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /mailingstats/:id
     * Should not redirect when Mailingstat is invalid
     */
    it('should fail / not redirect on PUT /mailingstats/:id with an invalid Mailingstat', function (done) {
        var Mailingstat = app.models.Mailingstat
        , mailingstat = new MailingstatStub;

        Mailingstat.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/mailingstats/1')
        .send({ "Mailingstat": mailingstat })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /mailingstats/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Mailingstat on DELETE /mailingstats/:id');

    /*
     * DELETE /mailingstats/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Mailingstat on DELETE /mailingstats/:id if it fails');
});

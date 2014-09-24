var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function MailingStub () {
    return {
        id: '',
        from: '',
        subject: '',
        started_send: '',
        finished_send: '',
        promotion_id: '',
        count: '',
        engaged: '',
        viewed: '',
        unsubscribed: '',
        bounced: '',
        division: ''
    };
}

describe('MailingController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /mailings/new
     * Should render mailings/new.ejs
     */
    it('should render "new" template on GET /mailings/new', function (done) {
        request(app)
        .get('/mailings/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/mailings\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /mailings
     * Should render mailings/index.ejs
     */
    it('should render "index" template on GET /mailings', function (done) {
        request(app)
        .get('/mailings')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/mailings\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /mailings/:id/edit
     * Should access Mailing#find and render mailings/edit.ejs
     */
    it('should access Mailing#find and render "edit" template on GET /mailings/:id/edit', function (done) {
        var Mailing = app.models.Mailing;

        // Mock Mailing#find
        Mailing.find = sinon.spy(function (id, callback) {
            callback(null, new Mailing);
        });

        request(app)
        .get('/mailings/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Mailing.find.calledWith('42').should.be.true;
            app.didRender(/mailings\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /mailings/:id
     * Should render mailings/index.ejs
     */
    it('should access Mailing#find and render "show" template on GET /mailings/:id', function (done) {
        var Mailing = app.models.Mailing;

        // Mock Mailing#find
        Mailing.find = sinon.spy(function (id, callback) {
            callback(null, new Mailing);
        });

        request(app)
        .get('/mailings/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Mailing.find.calledWith('42').should.be.true;
            app.didRender(/mailings\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /mailings
     * Should access Mailing#create when Mailing is valid
     */
    it('should access Mailing#create on POST /mailings with a valid Mailing', function (done) {
        var Mailing = app.models.Mailing
        , mailing = new MailingStub;

        // Mock Mailing#create
        Mailing.create = sinon.spy(function (data, callback) {
            callback(null, mailing);
        });

        request(app)
        .post('/mailings')
        .send({ "Mailing": mailing })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Mailing.create.calledWith(mailing).should.be.true;

            done();
        });
    });

    /*
     * POST /mailings
     * Should fail when Mailing is invalid
     */
    it('should fail on POST /mailings when Mailing#create returns an error', function (done) {
        var Mailing = app.models.Mailing
        , mailing = new MailingStub;

        // Mock Mailing#create
        Mailing.create = sinon.spy(function (data, callback) {
            callback(new Error, mailing);
        });

        request(app)
        .post('/mailings')
        .send({ "Mailing": mailing })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Mailing.create.calledWith(mailing).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /mailings/:id
     * Should redirect back to /mailings when Mailing is valid
     */
    it('should redirect on PUT /mailings/:id with a valid Mailing', function (done) {
        var Mailing = app.models.Mailing
        , mailing = new MailingStub;

        Mailing.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/mailings/1')
        .send({ "Mailing": mailing })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/mailings/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /mailings/:id
     * Should not redirect when Mailing is invalid
     */
    it('should fail / not redirect on PUT /mailings/:id with an invalid Mailing', function (done) {
        var Mailing = app.models.Mailing
        , mailing = new MailingStub;

        Mailing.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/mailings/1')
        .send({ "Mailing": mailing })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /mailings/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Mailing on DELETE /mailings/:id');

    /*
     * DELETE /mailings/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Mailing on DELETE /mailings/:id if it fails');
});

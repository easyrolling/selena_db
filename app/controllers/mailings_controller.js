load('application');

before(loadMailing, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New mailing';
    this.mailing = new Mailing;
    render();
});

action(function create() {
    Mailing.create(req.body.Mailing, function (err, mailing) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: mailing && mailing.errors || err});
                } else {
                    send({code: 200, data: mailing.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Mailing can not be created');
                    render('new', {
                        mailing: mailing,
                        title: 'New mailing'
                    });
                } else {
                    flash('info', 'Mailing created');
                    redirect(path_to.mailings);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Mailings index';
    Mailing.all(function (err, mailings) {
        switch (params.format) {
            case "json":
                send({code: 200, data: mailings});
                break;
            default:
                render({
                    mailings: mailings
                });
        }
    });
});

action(function show() {
    this.title = 'Mailing show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.mailing});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Mailing edit';
    switch(params.format) {
        case "json":
            send(this.mailing);
            break;
        default:
            render();
    }
});

action(function update() {
    var mailing = this.mailing;
    this.title = 'Edit mailing details';
    this.mailing.updateAttributes(body.Mailing, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: mailing && mailing.errors || err});
                } else {
                    send({code: 200, data: mailing});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Mailing updated');
                    redirect(path_to.mailing(mailing));
                } else {
                    flash('error', 'Mailing can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.mailing.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy mailing');
                } else {
                    flash('info', 'Mailing successfully removed');
                }
                send("'" + path_to.mailings + "'");
            });
        });
    });
});

function loadMailing() {
    Mailing.find(params.id, function (err, mailing) {
        if (err || !mailing) {
            if (!err && !mailing && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.mailings);
        } else {
            this.mailing = mailing;
            next();
        }
    }.bind(this));
}

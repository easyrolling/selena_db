load('application');

before(loadEmail, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New email';
    this.email = new Email;
    render();
});

action(function create() {
    Email.create(req.body.Email, function (err, email) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: email && email.errors || err});
                } else {
                    send({code: 200, data: email.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Email can not be created');
                    render('new', {
                        email: email,
                        title: 'New email'
                    });
                } else {
                    flash('info', 'Email created');
                    redirect(path_to.emails);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Emails index';
	var page = req.param('page') || 1;
    Email.paginate({ order: 'id', limit: 100, page: page}, function (err, emails) {
        switch (params.format) {
            case "json":
                send({code: 200, data: emails});
                break;
            default:
                render({
                    emails: emails
                });
        }
    });
});

action(function show() {
    this.title = 'Email show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.email});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Email edit';
    switch(params.format) {
        case "json":
            send(this.email);
            break;
        default:
            render();
    }
});

action(function update() {
    var email = this.email;
    this.title = 'Edit email details';
    this.email.updateAttributes(body.Email, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: email && email.errors || err});
                } else {
                    send({code: 200, data: email});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Email updated');
                    redirect(path_to.email(email));
                } else {
                    flash('error', 'Email can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.email.destroy(function (error) {
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
                    flash('error', 'Can not destroy email');
                } else {
                    flash('info', 'Email successfully removed');
                }
                send("'" + path_to.emails + "'");
            });
        });
    });
});

function loadEmail() {
    Email.find(params.id, function (err, email) {
        if (err || !email) {
            if (!err && !email && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.emails);
        } else {
            this.email = email;
            next();
        }
    }.bind(this));
}

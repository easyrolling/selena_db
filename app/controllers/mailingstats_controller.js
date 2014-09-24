load('application');

before(loadMailingStat, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New MailingStat';
    this.MailingStat = new MailingStat;
    render();
});

action(function create() {
    MailingStat.create(req.body.MailingStat, function (err, MailingStat) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: MailingStat && MailingStat.errors || err});
                } else {
                    send({code: 200, data: MailingStat.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'MailingStat can not be created');
                    render('new', {
                        MailingStat: MailingStat,
                        title: 'New MailingStat'
                    });
                } else {
                    flash('info', 'MailingStat created');
                    redirect(path_to.mailingstats);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'MailingStats index';
    MailingStat.all(function (err, mailingstats) {
        switch (params.format) {
            case "json":
                send({code: 200, data: mailingstats});
                break;
            default:
                render({
                    mailingstats: mailingstats
                });
        }
    });
});

action(function show() {
    this.title = 'MailingStat show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.MailingStat});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'MailingStat edit';
    switch(params.format) {
        case "json":
            send(this.MailingStat);
            break;
        default:
            render();
    }
});

action(function update() {
    var MailingStat = this.MailingStat;
    this.title = 'Edit MailingStat details';
    this.MailingStat.updateAttributes(body.MailingStat, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: MailingStat && MailingStat.errors || err});
                } else {
                    send({code: 200, data: MailingStat});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'MailingStat updated');
                    redirect(path_to.MailingStat(MailingStat));
                } else {
                    flash('error', 'MailingStat can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.MailingStat.destroy(function (error) {
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
                    flash('error', 'Can not destroy MailingStat');
                } else {
                    flash('info', 'MailingStat successfully removed');
                }
                send("'" + path_to.mailingstats + "'");
            });
        });
    });
});

function loadMailingStat() {
    MailingStat.find(params.id, function (err, MailingStat) {
        if (err || !MailingStat) {
            if (!err && !MailingStat && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.mailingstats);
        } else {
            this.MailingStat = MailingStat;
            next();
        }
    }.bind(this));
}

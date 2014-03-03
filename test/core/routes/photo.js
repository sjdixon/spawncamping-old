describe('photo routes', function () {
    describe('new', function () {
        it('renders successfully', function (done) {
            server.get('/photos/new')
                .expect(200, done);
        });
    });

    describe('create', function () {
        it('redirects with errors when file is not image', function (done) {
            server.post('/photos/create')
                .attach('image', system.pathTo('test/fixtures/routes/photos/not_image.txt'))
                .expect(302)
                .expect('location', '/photos/new', done);
        });

        it('accepts png images', function (done) {
            server.post('/photos/create')
                .expect(302)
                .attach('image', system.pathTo('test/fixtures/routes/photos/valid.png'))
                .expect('location', '/feed', done);
        });

        it('accepts gif images', function (done) {
            server.post('/photos/create')
                .expect(302)
                .attach('image', system.pathTo('test/fixtures/routes/photos/valid.gif'))
                .expect('location', '/feed', done);
        });

        it('accepts jpeg images', function (done) {
            server.post('/photos/create')
                .expect(302)
                .attach('image', system.pathTo('test/fixtures/routes/photos/valid.jpeg'))
                .expect('location', '/feed', done);
        });

        it('accepts jpg images', function (done) {
            var uploadFileDirectory = system.pathTo(settings.UPLOADS_PATH),
                photoUploadCount = fs.readdirSync(uploadFileDirectory).length;

            server.post('/photos/create')
                .expect(302)
                .attach('image', system.pathTo('test/fixtures/routes/photos/valid.jpg'))
                .expect('location', '/feed')
                .end(function (err) {
                    if (err) throw err;

                    var newPhotoUploadCount = fs.readdirSync(uploadFileDirectory).length;

                    //Ensure that 'a file' was added to uploads directory
                    //TODO test actual file and ensure that it's correct
                    newPhotoUploadCount.should.be.greaterThan(photoUploadCount);

                    done();
                });
        });
    });
});
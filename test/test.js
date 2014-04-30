var fs = require('fs')
var path = require('path')

var read = require('../')

describe('fs.readdirSyncRecursive()', function () {
  it('should work in the folder', function (done) {
    var files = read(__dirname)

    files.length.should.equal(1)
    files[0].should.equal('test.js')

    done()
  })

  it('should work at the root with a filter', function (done) {
    var files = read(path.join(__dirname, '..'), function (name) {
      return name[0] !== '.' && name !== 'node_modules'
    })

    files.length.should.equal(5)
    files.sort().should.eql([
      'test/test.js',
      'index.js',
      'Makefile',
      'package.json',
      'README.md'
    ].sort())

    done()
  })

  it('should work in the symlinked directory', function (done) {
    var linkname = __dirname + '-link'
    fs.symlinkSync(__dirname, linkname, 'dir')

    var files = read(linkname)

    files.length.should.equal(1)
    files[0].should.equal('test.js')

    fs.unlinkSync(linkname)
    done()
  })

  it('should work in the symlinked directory with a filter', function (done) {
    var linkname = path.join(__dirname, '..') + '-link'
    fs.symlinkSync(path.join(__dirname, '..'), linkname, 'dir')

    var files = read(linkname, function (name) {
      return name[0] !== '.' && name !== 'node_modules'
    })

    files.length.should.equal(5)
    files.sort().should.eql([
      'test/test.js',
      'index.js',
      'Makefile',
      'package.json',
      'README.md'
    ].sort())

    fs.unlinkSync(linkname)

    done()
  })
})
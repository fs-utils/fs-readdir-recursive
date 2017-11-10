var fs = require('fs')
var path = require('path')
var should = require('should')

var read = require('../')

describe('fs.readdirSyncRecursive()', function () {
  it('should work in the folder', function () {
    var files = read(__dirname)

    files.length.should.equal(1)
    files[0].should.equal('test.js')

  })

  it('should work at the root with a filter', function () {
    var files = read(path.join(__dirname, '..'), function (name) {
      return name[0] !== '.' && name !== 'node_modules' && name !== 'coverage' && name !== 'package-lock.json'
    })

    files.length.should.equal(5)
    files.sort().should.eql([
      'test/test.js',
      'index.js',
      'LICENSE',
      'package.json',
      'README.md'
    ].sort())

  })

  it('should filter pass dir', function () {
    var files = read(path.join(__dirname, '..'), function (name, index, dir) {
      return name[0] !== '.' && name !== 'node_modules' && name !== 'coverage' && dir !== __dirname && name !== 'package-lock.json'
    })

    files.length.should.equal(4)
    files.sort().should.eql([
      'index.js',
      'LICENSE',
      'package.json',
      'README.md'
    ].sort())

  })

  it('should work with the symlinked file', function () {
    try {
      var linkname = __filename + '-link'
      fs.symlinkSync(__filename, linkname, 'file')

      var files = read(__dirname).sort()

      files.length.should.equal(2)
      files.should.eql(['test.js', 'test.js-link'])

    } catch (err) {
      throw err
    } finally {
      fs.unlinkSync(linkname)
    }
  })

  it('should work in the symlinked directory', function () {
    try {
      var linkname = __dirname + '-link'
      fs.symlinkSync(__dirname, linkname, 'dir')

      var files = read(linkname)

      files.length.should.equal(1)
      files[0].should.equal('test.js')

    } catch (err) {
      throw err
    } finally {
      fs.unlinkSync(linkname)
    }
  })

  it('should work in the symlinked directory with a filter', function () {
    try {
      var linkname = path.join(__dirname, '..') + '-link'
      fs.symlinkSync(path.join(__dirname, '..'), linkname, 'dir')

      var files = read(linkname, function (name) {
        return name[0] !== '.' && name !== 'node_modules' && name !== 'coverage' && name !== 'package-lock.json'
      })

      files.length.should.equal(5)
      files.sort().should.eql([
        'test/test.js',
        'index.js',
        'LICENSE',
        'package.json',
        'README.md'
      ].sort())
    } catch (err) {
      throw err
    } finally {
      fs.unlinkSync(linkname)
    }
  })

  it('should ignore non-exist symlinked inside', function () {
    try {
      var linkname = __filename + '-link'
      var emptyname = __filename + '-empty'
      fs.writeFileSync(emptyname, 'empty')
      fs.symlinkSync(emptyname, linkname, 'dir')
      fs.unlinkSync(emptyname)

      var files = read(__dirname)

      files.should.eql(['test.js'])
    } catch (err) {
      throw err
    } finally {
      fs.unlinkSync(linkname)
    }
  })

  it('should return empty array', function () {
      read('non-exist-dir').should.eql([])
  })
})

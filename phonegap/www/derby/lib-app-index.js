require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({"racer":[function(require,module,exports){
module.exports=require('eS5xJL');
},{}],"eS5xJL":[function(require,module,exports){
var Racer = require('./Racer');
module.exports = new Racer;

},{"./Racer":1}],"derby":[function(require,module,exports){
module.exports=require('dhy1vc');
},{}],"dhy1vc":[function(require,module,exports){
(function(__dirname){var racer = require('racer');
var derby = module.exports = Object.create(racer);

var derbyPlugin = (racer.util.isServer) ?
  __dirname + '/derby.server' :
  require('./derby.browser');

// TODO: Remove or implement
derby.get = function() {}

derby
  // Server-side or browser-side methods
  .use(derbyPlugin);

})("/node_modules/derby/lib")
},{"racer":"eS5xJL","./derby.browser":2}],3:[function(require,module,exports){
module.exports = function (app) {
  app.fn('user', {
    changeEmail: function (e) {
      var origin = this.model.get('$config.origin');
      $.post(origin + '/user/changeEmail', e.at().get());
    },
    changePassword: function (e) {
      var origin = this.model.get('$config.origin');
      $.post(origin + '/user/changePassword', e.at().get(), function () {
        e.at().del();
      });
    },
    changeUsername: function (e) {
      var origin = this.model.get('$config.origin');
      $.post(origin + '/user/changeUsername', e.at().get());
    },
    connect: {
      facebook: function (e) {
        var origin = this.model.get('$config.origin');
        $.popupWindow(origin + '/user/auth/facebook');
      },
      google: function (e) {
        var origin = this.model.get('$config.origin');
        $.popupWindow(origin + '/user/auth/google');
      },
      twitter: function (e) {
        var origin = this.model.get('$config.origin');
        $.popupWindow(origin + '/user/auth/twitter');
      }
    },
    forgotPassword: function (e) {
      var origin = this.model.get('$config.origin');
      $.post(origin + '/user/forgotPassword', e.at().get(), function () {
        e.at().del();
        e.at().set('success', true);
      });
    },
    resetPassword: function (e) {
      var self = this, origin = this.model.get('$config.origin');
      $.post(origin + '/user/resetPassword', e.at().get(), function (data) {
        self.model.set('_session.user.id', e.at().get('userId'));
        self.model.set('_session.user.isRegistered', true);
      });
    },
    signin: function (e) {
      var self = this, origin = this.model.get('$config.origin');
      $.post(origin + '/user/signin', e.at().get(), function (data) {
        self.model.set('_session.user.id', data.user.id);
        self.model.set('_session.user.isRegistered', true);
      });
    },
    signout: function (e) {
      var self = this, origin = this.model.get('$config.origin');
      $.post(origin + '/user/signout', function (data) {
        self.model.set('_session.user.id', data.user.id);
        self.model.set('_session.user.isRegistered', false);
      });
    },
    signup: function (e) {
      var self = this, origin = this.model.get('$config.origin');
      $.post(origin + '/user/signup', e.at().get(), function () {
        self.model.set('_session.user.isRegistered', true);
      });
    },
    verifyEmail: function (e) {
      var self = this, origin = this.model.get('$config.origin');
      $.post(origin + '/user/verifyEmail', e.at().get());
    }
  });
};
},{}],4:[function(require,module,exports){
module.exports = function (app) {
  app.ready(function (model) {
    model.on('change', '$connection.state', function (state) {
      if (state !== 'connected') return;
      if (model.get('_session.user.id')) return;
      var origin = model.get('$config.origin');
      $.ajax({type: 'POST', url: origin + '/user/sessionize'}).done(function (data) {
        model.set('_session.user.id', data.user.id);
        model.set('_session.user.registered', data.user.registered);
      });
    });

    model.on('change', '_session.user.id', function (userId) {
      if (!userId) return;
      var $private = model.at('usersPrivate.' + userId);
      var $public = model.at('usersPublic.' + userId);
      model.subscribe($private, $public, function (err) {
        if (err) return console.error(err);
        model.ref('_page.user.private', $private);
        model.ref('_page.user.public', $public);
        var isRegistered = $public.get('isRegistered');
        if (model.get('_page.private') && !isRegistered) return app.history.push('/');
        if (model.get('_page.public') && isRegistered) app.history.push('/settings');
      });
    });

    model.on('change', '_session.user.isRegistered', function (isRegistered) {
      if (model.get('_page.private') && !isRegistered) return app.history.push('/');
      if (model.get('_page.public') && isRegistered) app.history.push('/settings');
    });
  });
};
},{}],5:[function(require,module,exports){
module.exports = function (app) {
  app.get('*', function (page, model, params, next) {
    var userId = model.get('_session.user.id');
    if (!userId) return next();
    var $private = model.at('usersPrivate.' + userId);
    var $public = model.at('usersPublic.' + userId);
    model.subscribe($private, $public, function (err) {
      if (err) return next(err);
      model.ref('_page.user.private', $private);
      model.ref('_page.user.public', $public);
      next();
    });
  });
};
},{}],6:[function(require,module,exports){
module.exports = function (app) {
  app.get('/', function (page) {
    page.render('home');
  });

  app.get('/403', function (page) {
    page.render('403');
  });

  app.get('/404', function (page) {
    page.render('404');
  });

  app.get('/404', function (page) {
    page.render('404');
  });

  app.get('/500', function (page) {
    page.render('500');
  });

  app.get('/forgot', function (page, model) {
    model.set('_page.public', true);
    page.render('forgot');
  });

  app.get('/reset/:userId/:token', function (page, model) {
    model.set('_page.form.token', page.params.token);
    model.set('_page.form.userId', page.params.userId);
    model.set('_page.public', true);
    page.render('reset');
  });

  app.get('/settings', function (page, model) {
    model.setNull('_page.form.username.username', model.get('_page.user.public.local.username'));
    model.setNull('_page.form.email.email', model.get('_page.user.private.local.emails.0.value'));
    model.set('_page.private', true);
    page.render('settings');
  });

  app.get('/signin', function (page, model) {
    model.set('_page.public', true);
    page.render('signin');
  });

  app.get('/signup', function (page, model) {
    model.set('_page.public', true);
    page.render('signup');
  });

  app.get('/user/auth/:provider/done', function (page, model) {
    page.render('home');
  });

  app.enter('/user/auth/:provider/done', function (model) {
    if (!window.opener) return;
    var userId = model.get('_session.user.id');
    window.opener.DERBY.app.model.set('_session.user.id', userId);
    window.opener.DERBY.app.model.set('_session.user.registered', true);
    window.close();
  });
};
},{}],7:[function(require,module,exports){
module.exports = function (app) {
  app.view.fn('user.displayName', function (public) {
    if (public.local) return public.local.username;
    if (public.facebook) return public.facebook.displayName;
    if (public.google) return public.google.displayName;
    if (public.twitter) return public.twitter.displayName;
  });

  app.view.fn('user.photoUrl', function (public) {
    if (public.facebook) return 'https://graph.facebook.com/' + public.facebook.username + '/picture';
    if (public.google && public.google.photos && public.google.photos[0]) return public.google.photos[0].value;
    if (public.twitter && public.twitter.photos && public.twitter.photos[0]) return public.twitter.photos[0].value;
    if (public.gravatar && public.gravatar.thumbnailUrl) return public.gravatar.thumbnailUrl;
  });
};
},{}],8:[function(require,module,exports){
var racer = require('racer');
var BCSocket = require('browserchannel/dist/bcsocket-uncompressed').BCSocket;

racer.Model.prototype._createSocket = function(bundle) {
  var options = bundle.racerBrowserChannel;
  var base = options.base || 'http://localhost:3000/channel';
  if (bundle.mount) base = bundle.mount + base;
  return new BCSocket(base, options);
};

},{"racer":"eS5xJL","browserchannel/dist/bcsocket-uncompressed":9}],10:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],1:[function(require,module,exports){
(function(process,__dirname){var EventEmitter = require('events').EventEmitter;
var Model = require('./Model');
var util = require('./util');

module.exports = Racer;

function Racer() {
  EventEmitter.call(this);
}

util.mergeInto(Racer.prototype, EventEmitter.prototype);

// Make classes accessible for use by plugins and tests
Racer.prototype.Model = Model;
Racer.prototype.util = util;

// Support plugins on racer instances
Racer.prototype.use = util.use;

Racer.prototype.init = function(data) {
  var racer = this;

  process.env.NODE_ENV = data.nodeEnv;

  // Init is executed async so that plugins can extend Racer even if they are
  // included after the main entry point in the bundle
  process.nextTick(function() {
    var model = new Model;

    model._createConnection(data);

    racer.emit('model', model);

    // Re-create documents for all model data
    for (var collectionName in data.collections) {
      var collection = data.collections[collectionName];
      for (var id in collection) {
        var doc = model.getOrCreateDoc(collectionName, id, collection[id]);
        if (doc.shareDoc) {
          model._loadVersions[collectionName + '.' + id] = doc.shareDoc.version;
        }
      }
    }

    // TODO: Support re-init when there are contexts other than root
    var context = data.contexts.root;
    // Re-subscribe to document subscriptions
    for (var path in context.subscribedDocs) {
      var segments = path.split('.');
      model.subscribeDoc(segments[0], segments[1]);
      model._subscribedDocs[path] = context.subscribedDocs[path];
    }
    // Init fetchedDocs counts
    for (var path in context.fetchedDocs) {
      model._fetchedDocs[path] = context.fetchedDocs[path];
    }

    var silentModel = model.silent();
    // Re-create refs
    for (var i = 0; i < data.refs.length; i++) {
      var item = data.refs[i];
      silentModel.ref(item[0], item[1]);
    }
    // Re-create refLists
    for (var i = 0; i < data.refLists.length; i++) {
      var item = data.refLists[i];
      silentModel.refList(item[0], item[1], item[2], item[3]);
    }
    // Re-create fns
    for (var i = 0; i < data.fns.length; i++) {
      var item = data.fns[i];
      silentModel.start.apply(silentModel, item);
    }
    // Re-create filters
    for (var i = 0; i < data.filters.length; i++) {
      var item = data.filters[i];
      var filter = model._filters.add(item[0], item[1], item[2]);
      filter.ref(item[3]);
    }
    // Init and re-subscribe queries as appropriate
    model._initQueries(data.queries);

    racer._model = model;
    racer.emit('ready', model);
  });
  return this;
};

Racer.prototype.ready = function(cb) {
  if (this._model) {
    // Callback async in case the code depends on scripts included after in
    // the bundle and is gated by a ready
    process.nextTick(function() {
      cb(this._model);
    });
    return;
  }
  this.once('ready', cb);
};

util.serverRequire(__dirname + '/Racer.server.js');

})(require("__browserify_process"),"/node_modules/derby/node_modules/racer/lib")
},{"events":11,"./util":12,"./Model":13,"__browserify_process":10}],11:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":10}],14:[function(require,module,exports){
var app = require('derby')
  .createApp(module)
  .use(require('../../ui'))
  .use(require('derby-ui-github-buttons'));

require('./controllerFns')(app);
require('./events')(app);
require('./user')(app);
require('./routes')(app);
require('./viewFns')(app);
},{"derby":"dhy1vc","./controllerFns":3,"./events":4,"./user":5,"./routes":6,"./viewFns":7,"../../ui":15,"derby-ui-github-buttons":16}],15:[function(require,module,exports){
(function(__filename){var config = {
  filename: __filename,
  scripts: {
    connectionAlert: require('./connectionAlert')
  }
};

module.exports = function (app, options) {
  app.createLibrary(config, options);
};
})("/ui/index.js")
},{"./connectionAlert":17}],9:[function(require,module,exports){
(function(){
function e() {
  return function() {
  }
}
function m(a) {
  return function(b) {
    this[a] = b
  }
}
function aa(a) {
  return function() {
    return this[a]
  }
}
function ba(a) {
  return function() {
    return a
  }
}
var p, ca = ca || {}, q = this;
function da(a) {
  a = a.split(".");
  for(var b = q, c;c = a.shift();) {
    if(null != b[c]) {
      b = b[c]
    }else {
      return null
    }
  }
  return b
}
function ea() {
}
function fa(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
}
function s(a) {
  return"array" == fa(a)
}
function ga(a) {
  var b = fa(a);
  return"array" == b || "object" == b && "number" == typeof a.length
}
function u(a) {
  return"string" == typeof a
}
function ha(a) {
  return"function" == fa(a)
}
function v(a) {
  return a[ia] || (a[ia] = ++ja)
}
var ia = "closure_uid_" + (1E9 * Math.random() >>> 0), ja = 0;
function ka(a, b, c) {
  return a.call.apply(a.bind, arguments)
}
function la(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
}
function w(a, b, c) {
  w = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ka : la;
  return w.apply(null, arguments)
}
var x = Date.now || function() {
  return+new Date
};
function y(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.ra = b.prototype;
  a.prototype = new c
}
;function ma(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$");
    a = a.replace(/\%s/, d)
  }
  return a
}
function na(a) {
  if(!oa.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(pa, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(qa, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(ra, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(sa, "&quot;"));
  return a
}
var pa = /&/g, qa = /</g, ra = />/g, sa = /\"/g, oa = /[&<>\"]/;
var z, ta, ua, va;
function wa() {
  return q.navigator ? q.navigator.userAgent : null
}
va = ua = ta = z = !1;
var xa;
if(xa = wa()) {
  var ya = q.navigator;
  z = 0 == xa.indexOf("Opera");
  ta = !z && -1 != xa.indexOf("MSIE");
  ua = !z && -1 != xa.indexOf("WebKit");
  va = !z && !ua && "Gecko" == ya.product
}
var za = z, A = ta, Aa = va, B = ua, Ba = q.navigator, Ca = -1 != (Ba && Ba.platform || "").indexOf("Mac");
function Da() {
  var a = q.document;
  return a ? a.documentMode : void 0
}
var Ea;
a: {
  var Fa = "", Ga;
  if(za && q.opera) {
    var Ha = q.opera.version, Fa = "function" == typeof Ha ? Ha() : Ha
  }else {
    if(Aa ? Ga = /rv\:([^\);]+)(\)|;)/ : A ? Ga = /MSIE\s+([^\);]+)(\)|;)/ : B && (Ga = /WebKit\/(\S+)/), Ga) {
      var Ia = Ga.exec(wa()), Fa = Ia ? Ia[1] : ""
    }
  }
  if(A) {
    var Ja = Da();
    if(Ja > parseFloat(Fa)) {
      Ea = String(Ja);
      break a
    }
  }
  Ea = Fa
}
var Ka = {};
function C(a) {
  var b;
  if(!(b = Ka[a])) {
    b = 0;
    for(var c = String(Ea).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(c.length, d.length), g = 0;0 == b && g < f;g++) {
      var h = c[g] || "", n = d[g] || "", k = RegExp("(\\d*)(\\D*)", "g"), t = RegExp("(\\d*)(\\D*)", "g");
      do {
        var l = k.exec(h) || ["", "", ""], r = t.exec(n) || ["", "", ""];
        if(0 == l[0].length && 0 == r[0].length) {
          break
        }
        b = ((0 == l[1].length ? 0 : parseInt(l[1], 10)) < (0 == r[1].length ? 0 : parseInt(r[1], 10)) ? -1 : (0 == l[1].length ? 0 : parseInt(l[1], 10)) > (0 == r[1].length ? 0 : parseInt(r[1], 10)) ? 1 : 0) || ((0 == l[2].length) < (0 == r[2].length) ? -1 : (0 == l[2].length) > (0 == r[2].length) ? 1 : 0) || (l[2] < r[2] ? -1 : l[2] > r[2] ? 1 : 0)
      }while(0 == b)
    }
    b = Ka[a] = 0 <= b
  }
  return b
}
var La = q.document, Ma = La && A ? Da() || ("CSS1Compat" == La.compatMode ? parseInt(Ea, 10) : 5) : void 0;
function Na(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, Na) : this.stack = Error().stack || "";
  a && (this.message = String(a))
}
y(Na, Error);
Na.prototype.name = "CustomError";
function Oa(a, b) {
  b.unshift(a);
  Na.call(this, ma.apply(null, b));
  b.shift();
  this.Jc = a
}
y(Oa, Na);
Oa.prototype.name = "AssertionError";
function Pa(a, b) {
  throw new Oa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}
;var Qa = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
function Ra(a) {
  var b = Sa, c;
  for(c in b) {
    a.call(void 0, b[c], c, b)
  }
}
function Ta(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
}
function Ua(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
}
var Va = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Wa(a, b) {
  for(var c, d, f = 1;f < arguments.length;f++) {
    d = arguments[f];
    for(c in d) {
      a[c] = d[c]
    }
    for(var g = 0;g < Va.length;g++) {
      c = Va[g], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
}
;var D = Array.prototype, Xa = D.indexOf ? function(a, b, c) {
  return D.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(u(a)) {
    return u(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
}, Ya = D.forEach ? function(a, b, c) {
  D.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, f = u(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && b.call(c, f[g], g, a)
  }
};
function Za(a) {
  return D.concat.apply(D, arguments)
}
function $a(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
}
;function ab(a) {
  if("function" == typeof a.N) {
    return a.N()
  }
  if(u(a)) {
    return a.split("")
  }
  if(ga(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return Ta(a)
}
function E(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(ga(a) || u(a)) {
      Ya(a, b, c)
    }else {
      var d;
      if("function" == typeof a.ka) {
        d = a.ka()
      }else {
        if("function" != typeof a.N) {
          if(ga(a) || u(a)) {
            d = [];
            for(var f = a.length, g = 0;g < f;g++) {
              d.push(g)
            }
          }else {
            d = Ua(a)
          }
        }else {
          d = void 0
        }
      }
      for(var f = ab(a), g = f.length, h = 0;h < g;h++) {
        b.call(c, f[h], d && d[h], a)
      }
    }
  }
}
;function bb(a, b) {
  this.O = {};
  this.j = [];
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    if(a) {
      a instanceof bb ? (c = a.ka(), d = a.N()) : (c = Ua(a), d = Ta(a));
      for(var f = 0;f < c.length;f++) {
        this.set(c[f], d[f])
      }
    }
  }
}
p = bb.prototype;
p.f = 0;
p.bc = 0;
p.N = function() {
  cb(this);
  for(var a = [], b = 0;b < this.j.length;b++) {
    a.push(this.O[this.j[b]])
  }
  return a
};
p.ka = function() {
  cb(this);
  return this.j.concat()
};
p.ia = function(a) {
  return db(this.O, a)
};
p.remove = function(a) {
  return db(this.O, a) ? (delete this.O[a], this.f--, this.bc++, this.j.length > 2 * this.f && cb(this), !0) : !1
};
function cb(a) {
  if(a.f != a.j.length) {
    for(var b = 0, c = 0;b < a.j.length;) {
      var d = a.j[b];
      db(a.O, d) && (a.j[c++] = d);
      b++
    }
    a.j.length = c
  }
  if(a.f != a.j.length) {
    for(var f = {}, c = b = 0;b < a.j.length;) {
      d = a.j[b], db(f, d) || (a.j[c++] = d, f[d] = 1), b++
    }
    a.j.length = c
  }
}
p.get = function(a, b) {
  return db(this.O, a) ? this.O[a] : b
};
p.set = function(a, b) {
  db(this.O, a) || (this.f++, this.j.push(a), this.bc++);
  this.O[a] = b
};
p.n = function() {
  return new bb(this)
};
function db(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
}
;function F(a, b) {
  var c;
  if(a instanceof F) {
    this.D = void 0 !== b ? b : a.D, eb(this, a.qa), c = a.ab, H(this), this.ab = c, fb(this, a.ja), gb(this, a.Ba), hb(this, a.H), ib(this, a.R.n()), c = a.Ma, H(this), this.Ma = c
  }else {
    if(a && (c = String(a).match(Qa))) {
      this.D = !!b;
      eb(this, c[1] || "", !0);
      var d = c[2] || "";
      H(this);
      this.ab = d ? decodeURIComponent(d) : "";
      fb(this, c[3] || "", !0);
      gb(this, c[4]);
      hb(this, c[5] || "", !0);
      ib(this, c[6] || "", !0);
      c = c[7] || "";
      H(this);
      this.Ma = c ? decodeURIComponent(c) : ""
    }else {
      this.D = !!b, this.R = new jb(null, 0, this.D)
    }
  }
}
p = F.prototype;
p.qa = "";
p.ab = "";
p.ja = "";
p.Ba = null;
p.H = "";
p.Ma = "";
p.mc = !1;
p.D = !1;
p.toString = function() {
  var a = [], b = this.qa;
  b && a.push(kb(b, lb), ":");
  if(b = this.ja) {
    a.push("//");
    var c = this.ab;
    c && a.push(kb(c, lb), "@");
    a.push(encodeURIComponent(String(b)));
    b = this.Ba;
    null != b && a.push(":", String(b))
  }
  if(b = this.H) {
    this.ja && "/" != b.charAt(0) && a.push("/"), a.push(kb(b, "/" == b.charAt(0) ? mb : nb))
  }
  (b = this.R.toString()) && a.push("?", b);
  (b = this.Ma) && a.push("#", kb(b, ob));
  return a.join("")
};
p.n = function() {
  return new F(this)
};
function eb(a, b, c) {
  H(a);
  a.qa = c ? b ? decodeURIComponent(b) : "" : b;
  a.qa && (a.qa = a.qa.replace(/:$/, ""))
}
function fb(a, b, c) {
  H(a);
  a.ja = c ? b ? decodeURIComponent(b) : "" : b
}
function gb(a, b) {
  H(a);
  if(b) {
    b = Number(b);
    if(isNaN(b) || 0 > b) {
      throw Error("Bad port number " + b);
    }
    a.Ba = b
  }else {
    a.Ba = null
  }
}
function hb(a, b, c) {
  H(a);
  a.H = c ? b ? decodeURIComponent(b) : "" : b
}
function ib(a, b, c) {
  H(a);
  b instanceof jb ? (a.R = b, a.R.qb(a.D)) : (c || (b = kb(b, pb)), a.R = new jb(b, 0, a.D))
}
function I(a, b, c) {
  H(a);
  a.R.set(b, c)
}
function qb(a, b, c) {
  H(a);
  s(c) || (c = [String(c)]);
  rb(a.R, b, c)
}
function J(a) {
  H(a);
  I(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ x()).toString(36));
  return a
}
function H(a) {
  if(a.mc) {
    throw Error("Tried to modify a read-only Uri");
  }
}
p.qb = function(a) {
  this.D = a;
  this.R && this.R.qb(a);
  return this
};
function sb(a, b, c, d) {
  var f = new F(null, void 0);
  a && eb(f, a);
  b && fb(f, b);
  c && gb(f, c);
  d && hb(f, d);
  return f
}
function kb(a, b) {
  return u(a) ? encodeURI(a).replace(b, tb) : null
}
function tb(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
}
var lb = /[#\/\?@]/g, nb = /[\#\?:]/g, mb = /[\#\?]/g, pb = /[\#\?@]/g, ob = /#/g;
function jb(a, b, c) {
  this.C = a || null;
  this.D = !!c
}
function K(a) {
  if(!a.i && (a.i = new bb, a.f = 0, a.C)) {
    for(var b = a.C.split("&"), c = 0;c < b.length;c++) {
      var d = b[c].indexOf("="), f = null, g = null;
      0 <= d ? (f = b[c].substring(0, d), g = b[c].substring(d + 1)) : f = b[c];
      f = decodeURIComponent(f.replace(/\+/g, " "));
      f = L(a, f);
      a.add(f, g ? decodeURIComponent(g.replace(/\+/g, " ")) : "")
    }
  }
}
p = jb.prototype;
p.i = null;
p.f = null;
p.add = function(a, b) {
  K(this);
  this.C = null;
  a = L(this, a);
  var c = this.i.get(a);
  c || this.i.set(a, c = []);
  c.push(b);
  this.f++;
  return this
};
p.remove = function(a) {
  K(this);
  a = L(this, a);
  return this.i.ia(a) ? (this.C = null, this.f -= this.i.get(a).length, this.i.remove(a)) : !1
};
p.ia = function(a) {
  K(this);
  a = L(this, a);
  return this.i.ia(a)
};
p.ka = function() {
  K(this);
  for(var a = this.i.N(), b = this.i.ka(), c = [], d = 0;d < b.length;d++) {
    for(var f = a[d], g = 0;g < f.length;g++) {
      c.push(b[d])
    }
  }
  return c
};
p.N = function(a) {
  K(this);
  var b = [];
  if(a) {
    this.ia(a) && (b = Za(b, this.i.get(L(this, a))))
  }else {
    a = this.i.N();
    for(var c = 0;c < a.length;c++) {
      b = Za(b, a[c])
    }
  }
  return b
};
p.set = function(a, b) {
  K(this);
  this.C = null;
  a = L(this, a);
  this.ia(a) && (this.f -= this.i.get(a).length);
  this.i.set(a, [b]);
  this.f++;
  return this
};
p.get = function(a, b) {
  var c = a ? this.N(a) : [];
  return 0 < c.length ? String(c[0]) : b
};
function rb(a, b, c) {
  a.remove(b);
  0 < c.length && (a.C = null, a.i.set(L(a, b), $a(c)), a.f += c.length)
}
p.toString = function() {
  if(this.C) {
    return this.C
  }
  if(!this.i) {
    return""
  }
  for(var a = [], b = this.i.ka(), c = 0;c < b.length;c++) {
    for(var d = b[c], f = encodeURIComponent(String(d)), d = this.N(d), g = 0;g < d.length;g++) {
      var h = f;
      "" !== d[g] && (h += "=" + encodeURIComponent(String(d[g])));
      a.push(h)
    }
  }
  return this.C = a.join("&")
};
p.n = function() {
  var a = new jb;
  a.C = this.C;
  this.i && (a.i = this.i.n(), a.f = this.f);
  return a
};
function L(a, b) {
  var c = String(b);
  a.D && (c = c.toLowerCase());
  return c
}
p.qb = function(a) {
  a && !this.D && (K(this), this.C = null, E(this.i, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), rb(this, d, a))
  }, this));
  this.D = a
};
function ub() {
}
ub.prototype.Ga = null;
var vb;
function wb() {
}
y(wb, ub);
function xb(a) {
  return(a = yb(a)) ? new ActiveXObject(a) : new XMLHttpRequest
}
function zb(a) {
  var b = {};
  yb(a) && (b[0] = !0, b[1] = !0);
  return b
}
function yb(a) {
  if(!a.Gb && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
    for(var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0;c < b.length;c++) {
      var d = b[c];
      try {
        return new ActiveXObject(d), a.Gb = d
      }catch(f) {
      }
    }
    throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
  }
  return a.Gb
}
vb = new wb;
function M() {
  0 != Ab && (this.Gc = Error().stack, Bb[v(this)] = this)
}
var Ab = 0, Bb = {};
M.prototype.yb = !1;
M.prototype.Ia = function() {
  if(!this.yb && (this.yb = !0, this.u(), 0 != Ab)) {
    var a = v(this);
    delete Bb[a]
  }
};
M.prototype.u = function() {
  if(this.Nb) {
    for(;this.Nb.length;) {
      this.Nb.shift()()
    }
  }
};
function N(a, b) {
  this.type = a;
  this.currentTarget = this.target = b
}
p = N.prototype;
p.u = e();
p.Ia = e();
p.na = !1;
p.defaultPrevented = !1;
p.Wa = !0;
p.preventDefault = function() {
  this.defaultPrevented = !0;
  this.Wa = !1
};
var Cb = 0;
function Db() {
}
p = Db.prototype;
p.key = 0;
p.ea = !1;
p.Ha = !1;
p.Oa = function(a, b, c, d, f, g) {
  if(ha(a)) {
    this.Ib = !0
  }else {
    if(a && a.handleEvent && ha(a.handleEvent)) {
      this.Ib = !1
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.W = a;
  this.Ub = b;
  this.src = c;
  this.type = d;
  this.capture = !!f;
  this.lb = g;
  this.Ha = !1;
  this.key = ++Cb;
  this.ea = !1
};
p.handleEvent = function(a) {
  return this.Ib ? this.W.call(this.lb || this.src, a) : this.W.handleEvent.call(this.W, a)
};
var Eb = !A || A && 9 <= Ma, Fb = A && !C("9");
!B || C("528");
Aa && C("1.9b") || A && C("8") || za && C("9.5") || B && C("528");
Aa && !C("8") || A && C("9");
function Gb(a) {
  Gb[" "](a);
  return a
}
Gb[" "] = ea;
function Hb(a, b) {
  a && this.Oa(a, b)
}
y(Hb, N);
p = Hb.prototype;
p.target = null;
p.relatedTarget = null;
p.offsetX = 0;
p.offsetY = 0;
p.clientX = 0;
p.clientY = 0;
p.screenX = 0;
p.screenY = 0;
p.button = 0;
p.keyCode = 0;
p.charCode = 0;
p.ctrlKey = !1;
p.altKey = !1;
p.shiftKey = !1;
p.metaKey = !1;
p.yc = !1;
p.zb = null;
p.Oa = function(a, b) {
  var c = this.type = a.type;
  N.call(this, c);
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  var d = a.relatedTarget;
  if(d) {
    if(Aa) {
      var f;
      a: {
        try {
          Gb(d.nodeName);
          f = !0;
          break a
        }catch(g) {
        }
        f = !1
      }
      f || (d = null)
    }
  }else {
    "mouseover" == c ? d = a.fromElement : "mouseout" == c && (d = a.toElement)
  }
  this.relatedTarget = d;
  this.offsetX = B || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = B || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.yc = Ca ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.zb = a;
  a.defaultPrevented && this.preventDefault();
  delete this.na
};
p.preventDefault = function() {
  Hb.ra.preventDefault.call(this);
  var a = this.zb;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, Fb) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
p.u = e();
var Sa = {}, O = {}, P = {}, Ib = {};
function Jb(a, b, c, d, f) {
  if(s(b)) {
    for(var g = 0;g < b.length;g++) {
      Jb(a, b[g], c, d, f)
    }
    return null
  }
  a: {
    if(!b) {
      throw Error("Invalid event type");
    }
    d = !!d;
    var h = O;
    b in h || (h[b] = {f:0, t:0});
    h = h[b];
    d in h || (h[d] = {f:0, t:0}, h.f++);
    var h = h[d], g = v(a), n;
    h.t++;
    if(h[g]) {
      n = h[g];
      for(var k = 0;k < n.length;k++) {
        if(h = n[k], h.W == c && h.lb == f) {
          if(h.ea) {
            break
          }
          n[k].Ha = !1;
          a = n[k];
          break a
        }
      }
    }else {
      n = h[g] = [], h.f++
    }
    k = Kb();
    h = new Db;
    h.Oa(c, k, a, b, d, f);
    h.Ha = !1;
    k.src = a;
    k.W = h;
    n.push(h);
    P[g] || (P[g] = []);
    P[g].push(h);
    a.addEventListener ? a != q && a.wb || a.addEventListener(b, k, d) : a.attachEvent(b in Ib ? Ib[b] : Ib[b] = "on" + b, k);
    a = h
  }
  b = a.key;
  Sa[b] = a;
  return b
}
function Kb() {
  var a = Lb, b = Eb ? function(c) {
    return a.call(b.src, b.W, c)
  } : function(c) {
    c = a.call(b.src, b.W, c);
    if(!c) {
      return c
    }
  };
  return b
}
function Mb(a, b, c, d, f) {
  if(s(b)) {
    for(var g = 0;g < b.length;g++) {
      Mb(a, b[g], c, d, f)
    }
  }else {
    d = !!d;
    a: {
      g = O;
      if(b in g && (g = g[b], d in g && (g = g[d], a = v(a), g[a]))) {
        a = g[a];
        break a
      }
      a = null
    }
    if(a) {
      for(g = 0;g < a.length;g++) {
        if(a[g].W == c && a[g].capture == d && a[g].lb == f) {
          Nb(a[g].key);
          break
        }
      }
    }
  }
}
function Nb(a) {
  var b = Sa[a];
  if(!b || b.ea) {
    return!1
  }
  var c = b.src, d = b.type, f = b.Ub, g = b.capture;
  c.removeEventListener ? c != q && c.wb || c.removeEventListener(d, f, g) : c.detachEvent && c.detachEvent(d in Ib ? Ib[d] : Ib[d] = "on" + d, f);
  c = v(c);
  if(P[c]) {
    var f = P[c], h = Xa(f, b);
    0 <= h && D.splice.call(f, h, 1);
    0 == f.length && delete P[c]
  }
  b.ea = !0;
  if(b = O[d][g][c]) {
    b.Mb = !0, Ob(d, g, c, b)
  }
  delete Sa[a];
  return!0
}
function Ob(a, b, c, d) {
  if(!d.Qa && d.Mb) {
    for(var f = 0, g = 0;f < d.length;f++) {
      d[f].ea ? d[f].Ub.src = null : (f != g && (d[g] = d[f]), g++)
    }
    d.length = g;
    d.Mb = !1;
    0 == g && (delete O[a][b][c], O[a][b].f--, 0 == O[a][b].f && (delete O[a][b], O[a].f--), 0 == O[a].f && delete O[a])
  }
}
function Pb(a) {
  var b = 0;
  if(null != a) {
    if(a = v(a), P[a]) {
      a = P[a];
      for(var c = a.length - 1;0 <= c;c--) {
        Nb(a[c].key), b++
      }
    }
  }else {
    Ra(function(a, c) {
      Nb(c);
      b++
    })
  }
}
function Qb(a, b, c, d, f) {
  var g = 1;
  b = v(b);
  if(a[b]) {
    var h = --a.t, n = a[b];
    n.Qa ? n.Qa++ : n.Qa = 1;
    try {
      for(var k = n.length, t = 0;t < k;t++) {
        var l = n[t];
        l && !l.ea && (g &= !1 !== Rb(l, f))
      }
    }finally {
      a.t = Math.max(h, a.t), n.Qa--, Ob(c, d, b, n)
    }
  }
  return Boolean(g)
}
function Rb(a, b) {
  a.Ha && Nb(a.key);
  return a.handleEvent(b)
}
function Lb(a, b) {
  if(a.ea) {
    return!0
  }
  var c = a.type, d = O;
  if(!(c in d)) {
    return!0
  }
  var d = d[c], f, g;
  if(!Eb) {
    f = b || da("window.event");
    var h = !0 in d, n = !1 in d;
    if(h) {
      if(0 > f.keyCode || void 0 != f.returnValue) {
        return!0
      }
      a: {
        var k = !1;
        if(0 == f.keyCode) {
          try {
            f.keyCode = -1;
            break a
          }catch(t) {
            k = !0
          }
        }
        if(k || void 0 == f.returnValue) {
          f.returnValue = !0
        }
      }
    }
    k = new Hb;
    k.Oa(f, this);
    f = !0;
    try {
      if(h) {
        for(var l = [], r = k.currentTarget;r;r = r.parentNode) {
          l.push(r)
        }
        g = d[!0];
        g.t = g.f;
        for(var G = l.length - 1;!k.na && 0 <= G && g.t;G--) {
          k.currentTarget = l[G], f &= Qb(g, l[G], c, !0, k)
        }
        if(n) {
          for(g = d[!1], g.t = g.f, G = 0;!k.na && G < l.length && g.t;G++) {
            k.currentTarget = l[G], f &= Qb(g, l[G], c, !1, k)
          }
        }
      }else {
        f = Rb(a, k)
      }
    }finally {
      l && (l.length = 0)
    }
    return f
  }
  c = new Hb(b, this);
  return f = Rb(a, c)
}
;function Sb() {
  M.call(this)
}
y(Sb, M);
p = Sb.prototype;
p.wb = !0;
p.pb = null;
p.addEventListener = function(a, b, c, d) {
  Jb(this, a, b, c, d)
};
p.removeEventListener = function(a, b, c, d) {
  Mb(this, a, b, c, d)
};
p.dispatchEvent = function(a) {
  var b = a.type || a, c = O;
  if(b in c) {
    if(u(a)) {
      a = new N(a, this)
    }else {
      if(a instanceof N) {
        a.target = a.target || this
      }else {
        var d = a;
        a = new N(b, this);
        Wa(a, d)
      }
    }
    var d = 1, f, c = c[b], b = !0 in c, g;
    if(b) {
      f = [];
      for(g = this;g;g = g.pb) {
        f.push(g)
      }
      g = c[!0];
      g.t = g.f;
      for(var h = f.length - 1;!a.na && 0 <= h && g.t;h--) {
        a.currentTarget = f[h], d &= Qb(g, f[h], a.type, !0, a) && !1 != a.Wa
      }
    }
    if(!1 in c) {
      if(g = c[!1], g.t = g.f, b) {
        for(h = 0;!a.na && h < f.length && g.t;h++) {
          a.currentTarget = f[h], d &= Qb(g, f[h], a.type, !1, a) && !1 != a.Wa
        }
      }else {
        for(f = this;!a.na && f && g.t;f = f.pb) {
          a.currentTarget = f, d &= Qb(g, f, a.type, !1, a) && !1 != a.Wa
        }
      }
    }
    a = Boolean(d)
  }else {
    a = !0
  }
  return a
};
p.u = function() {
  Sb.ra.u.call(this);
  Pb(this);
  this.pb = null
};
function Tb(a, b) {
  M.call(this);
  this.da = a || 1;
  this.Ea = b || q;
  this.eb = w(this.Ec, this);
  this.ob = x()
}
y(Tb, Sb);
p = Tb.prototype;
p.enabled = !1;
p.r = null;
p.setInterval = function(a) {
  this.da = a;
  this.r && this.enabled ? (this.stop(), this.start()) : this.r && this.stop()
};
p.Ec = function() {
  if(this.enabled) {
    var a = x() - this.ob;
    0 < a && a < 0.8 * this.da ? this.r = this.Ea.setTimeout(this.eb, this.da - a) : (this.dispatchEvent(Ub), this.enabled && (this.r = this.Ea.setTimeout(this.eb, this.da), this.ob = x()))
  }
};
p.start = function() {
  this.enabled = !0;
  this.r || (this.r = this.Ea.setTimeout(this.eb, this.da), this.ob = x())
};
p.stop = function() {
  this.enabled = !1;
  this.r && (this.Ea.clearTimeout(this.r), this.r = null)
};
p.u = function() {
  Tb.ra.u.call(this);
  this.stop();
  delete this.Ea
};
var Ub = "tick";
function Vb(a) {
  M.call(this);
  this.e = a;
  this.j = []
}
y(Vb, M);
var Wb = [];
function Xb(a, b, c, d) {
  s(c) || (Wb[0] = c, c = Wb);
  for(var f = 0;f < c.length;f++) {
    var g = Jb(b, c[f], d || a, !1, a.e || a);
    a.j.push(g)
  }
}
Vb.prototype.u = function() {
  Vb.ra.u.call(this);
  Ya(this.j, Nb);
  this.j.length = 0
};
Vb.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
function Yb(a, b, c) {
  M.call(this);
  this.nc = a;
  this.da = b;
  this.e = c;
  this.hc = w(this.tc, this)
}
y(Yb, M);
p = Yb.prototype;
p.Xa = !1;
p.Tb = 0;
p.r = null;
p.stop = function() {
  this.r && (q.clearTimeout(this.r), this.r = null, this.Xa = !1)
};
p.u = function() {
  Yb.ra.u.call(this);
  this.stop()
};
p.tc = function() {
  this.r = null;
  this.Xa && !this.Tb && (this.Xa = !1, Zb(this))
};
function Zb(a) {
  var b;
  b = a.hc;
  var c = a.da;
  if(!ha(b)) {
    if(b && "function" == typeof b.handleEvent) {
      b = w(b.handleEvent, b)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  b = 2147483647 < c ? -1 : q.setTimeout(b, c || 0);
  a.r = b;
  a.nc.call(a.e)
}
;function Q(a, b, c, d, f) {
  this.b = a;
  this.a = b;
  this.Z = c;
  this.B = d;
  this.Ca = f || 1;
  this.Da = $b;
  this.jb = new Vb(this);
  this.Sa = new Tb;
  this.Sa.setInterval(ac)
}
p = Q.prototype;
p.v = null;
p.J = !1;
p.ua = null;
p.sb = null;
p.pa = null;
p.sa = null;
p.T = null;
p.w = null;
p.X = null;
p.l = null;
p.Fa = 0;
p.K = null;
p.ta = null;
p.p = null;
p.h = -1;
p.Xb = !0;
p.aa = !1;
p.oa = 0;
p.Ta = null;
var $b = 45E3, ac = 250;
function bc(a, b) {
  switch(a) {
    case 0:
      return"Non-200 return code (" + b + ")";
    case 1:
      return"XMLHTTP failure (no data)";
    case 2:
      return"HttpConnection timeout";
    default:
      return"Unknown error"
  }
}
var cc = {}, dc = {};
function ec() {
  return!A || A && 10 <= Ma
}
p = Q.prototype;
p.Y = m("v");
p.setTimeout = m("Da");
p.$b = m("oa");
function fc(a, b, c) {
  a.sa = 1;
  a.T = J(b.n());
  a.X = c;
  a.xb = !0;
  gc(a, null)
}
function hc(a, b, c, d, f) {
  a.sa = 1;
  a.T = J(b.n());
  a.X = null;
  a.xb = c;
  f && (a.Xb = !1);
  gc(a, d)
}
function gc(a, b) {
  a.pa = x();
  ic(a);
  a.w = a.T.n();
  qb(a.w, "t", a.Ca);
  a.Fa = 0;
  a.l = a.b.hb(a.b.Ya() ? b : null);
  0 < a.oa && (a.Ta = new Yb(w(a.dc, a, a.l), a.oa));
  Xb(a.jb, a.l, "readystatechange", a.Ac);
  var c;
  if(a.v) {
    c = a.v;
    var d = {}, f;
    for(f in c) {
      d[f] = c[f]
    }
    c = d
  }else {
    c = {}
  }
  a.X ? (a.ta = "POST", c["Content-Type"] = "application/x-www-form-urlencoded", a.l.send(a.w, a.ta, a.X, c)) : (a.ta = "GET", a.Xb && !B && (c.Connection = "close"), a.l.send(a.w, a.ta, null, c));
  a.b.G(jc);
  if(d = a.X) {
    for(c = "", d = d.split("&"), f = 0;f < d.length;f++) {
      var g = d[f].split("=");
      if(1 < g.length) {
        var h = g[0], g = g[1], n = h.split("_");
        c = 2 <= n.length && "type" == n[1] ? c + (h + "=" + g + "&") : c + (h + "=redacted&")
      }
    }
  }else {
    c = null
  }
  a.a.info("XMLHTTP REQ (" + a.B + ") [attempt " + a.Ca + "]: " + a.ta + "\n" + a.w + "\n" + c)
}
p.Ac = function(a) {
  a = a.target;
  var b = this.Ta;
  b && 3 == R(a) ? (this.a.debug("Throttling readystatechange."), b.r || b.Tb ? b.Xa = !0 : Zb(b)) : this.dc(a)
};
p.dc = function(a) {
  try {
    if(a == this.l) {
      a: {
        var b = R(this.l), c = this.l.la, d = kc(this.l);
        if(!ec() || B && !C("420+")) {
          if(4 > b) {
            break a
          }
        }else {
          if(3 > b || 3 == b && !za && !lc(this.l)) {
            break a
          }
        }
        this.aa || (4 != b || c == mc) || (c == nc || 0 >= d ? this.b.G(oc) : this.b.G(pc));
        qc(this);
        var f = kc(this.l);
        this.h = f;
        var g = lc(this.l);
        g || this.a.debug("No response text for uri " + this.w + " status " + f);
        this.J = 200 == f;
        this.a.info("XMLHTTP RESP (" + this.B + ") [ attempt " + this.Ca + "]: " + this.ta + "\n" + this.w + "\n" + b + " " + f);
        this.J ? (4 == b && S(this), this.xb ? (rc(this, b, g), za && 3 == b && (Xb(this.jb, this.Sa, Ub, this.zc), this.Sa.start())) : (sc(this.a, this.B, g, null), tc(this, g)), this.J && !this.aa && (4 == b ? this.b.ma(this) : (this.J = !1, ic(this)))) : (400 == f && 0 < g.indexOf("Unknown SID") ? (this.p = 3, T(uc), this.a.$("XMLHTTP Unknown SID (" + this.B + ")")) : (this.p = 0, T(vc), this.a.$("XMLHTTP Bad status " + f + " (" + this.B + ")")), S(this), wc(this))
      }
    }else {
      this.a.$("Called back with an unexpected xmlhttp")
    }
  }catch(h) {
    this.a.debug("Failed call to OnXmlHttpReadyStateChanged_"), this.l && lc(this.l) ? xc(this.a, h, "ResponseText: " + lc(this.l)) : xc(this.a, h, "No response text")
  }finally {
  }
};
function rc(a, b, c) {
  for(var d = !0;!a.aa && a.Fa < c.length;) {
    var f = yc(a, c);
    if(f == dc) {
      4 == b && (a.p = 4, T(zc), d = !1);
      sc(a.a, a.B, null, "[Incomplete Response]");
      break
    }else {
      if(f == cc) {
        a.p = 4;
        T(Ac);
        sc(a.a, a.B, c, "[Invalid Chunk]");
        d = !1;
        break
      }else {
        sc(a.a, a.B, f, null), tc(a, f)
      }
    }
  }
  4 == b && 0 == c.length && (a.p = 1, T(Bc), d = !1);
  a.J = a.J && d;
  d || (sc(a.a, a.B, c, "[Invalid Chunked Response]"), S(a), wc(a))
}
p.zc = function() {
  var a = R(this.l), b = lc(this.l);
  this.Fa < b.length && (qc(this), rc(this, a, b), this.J && 4 != a && ic(this))
};
function yc(a, b) {
  var c = a.Fa, d = b.indexOf("\n", c);
  if(-1 == d) {
    return dc
  }
  c = Number(b.substring(c, d));
  if(isNaN(c)) {
    return cc
  }
  d += 1;
  if(d + c > b.length) {
    return dc
  }
  var f = b.substr(d, c);
  a.Fa = d + c;
  return f
}
function Cc(a, b) {
  a.pa = x();
  ic(a);
  var c = b ? window.location.hostname : "";
  a.w = a.T.n();
  I(a.w, "DOMAIN", c);
  I(a.w, "t", a.Ca);
  try {
    a.K = new ActiveXObject("htmlfile")
  }catch(d) {
    a.a.I("ActiveX blocked");
    S(a);
    a.p = 7;
    T(Dc);
    wc(a);
    return
  }
  var f = "<html><body>";
  b && (f += '<script>document.domain="' + c + '"\x3c/script>');
  f += "</body></html>";
  a.K.open();
  a.K.write(f);
  a.K.close();
  a.K.parentWindow.m = w(a.wc, a);
  a.K.parentWindow.d = w(a.Sb, a, !0);
  a.K.parentWindow.rpcClose = w(a.Sb, a, !1);
  c = a.K.createElement("div");
  a.K.parentWindow.document.body.appendChild(c);
  c.innerHTML = '<iframe src="' + a.w + '"></iframe>';
  a.a.info("TRIDENT REQ (" + a.B + ") [ attempt " + a.Ca + "]: GET\n" + a.w);
  a.b.G(jc)
}
p.wc = function(a) {
  U(w(this.vc, this, a), 0)
};
p.vc = function(a) {
  if(!this.aa) {
    var b = this.a;
    b.info("TRIDENT TEXT (" + this.B + "): " + Ec(b, a));
    qc(this);
    tc(this, a);
    ic(this)
  }
};
p.Sb = function(a) {
  U(w(this.uc, this, a), 0)
};
p.uc = function(a) {
  this.aa || (this.a.info("TRIDENT TEXT (" + this.B + "): " + a ? "success" : "failure"), S(this), this.J = a, this.b.ma(this), this.b.G(Fc))
};
p.lc = function() {
  qc(this);
  this.b.ma(this)
};
p.cancel = function() {
  this.aa = !0;
  S(this)
};
function ic(a) {
  a.sb = x() + a.Da;
  Gc(a, a.Da)
}
function Gc(a, b) {
  if(null != a.ua) {
    throw Error("WatchDog timer not null");
  }
  a.ua = U(w(a.xc, a), b)
}
function qc(a) {
  a.ua && (q.clearTimeout(a.ua), a.ua = null)
}
p.xc = function() {
  this.ua = null;
  var a = x();
  0 <= a - this.sb ? (this.J && this.a.I("Received watchdog timeout even though request loaded successfully"), this.a.info("TIMEOUT: " + this.w), 2 != this.sa && this.b.G(oc), S(this), this.p = 2, T(Hc), wc(this)) : (this.a.$("WatchDog timer called too early"), Gc(this, this.sb - a))
};
function wc(a) {
  a.b.Hb() || a.aa || a.b.ma(a)
}
function S(a) {
  qc(a);
  var b = a.Ta;
  b && "function" == typeof b.Ia && b.Ia();
  a.Ta = null;
  a.Sa.stop();
  b = a.jb;
  Ya(b.j, Nb);
  b.j.length = 0;
  a.l && (b = a.l, a.l = null, b.abort(), b.Ia());
  a.K && (a.K = null)
}
p.Eb = aa("p");
function tc(a, b) {
  try {
    a.b.Pb(a, b), a.b.G(Fc)
  }catch(c) {
    xc(a.a, c, "Error in httprequest callback")
  }
}
;function Ic(a) {
  a = String(a);
  if(/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) {
    try {
      return eval("(" + a + ")")
    }catch(b) {
    }
  }
  throw Error("Invalid JSON string: " + a);
}
function Jc(a) {
  return eval("(" + a + ")")
}
function Kc(a) {
  var b = [];
  Lc(new Mc(void 0), a, b);
  return b.join("")
}
function Mc(a) {
  this.Va = a
}
function Lc(a, b, c) {
  switch(typeof b) {
    case "string":
      Nc(b, c);
      break;
    case "number":
      c.push(isFinite(b) && !isNaN(b) ? b : "null");
      break;
    case "boolean":
      c.push(b);
      break;
    case "undefined":
      c.push("null");
      break;
    case "object":
      if(null == b) {
        c.push("null");
        break
      }
      if(s(b)) {
        var d = b.length;
        c.push("[");
        for(var f = "", g = 0;g < d;g++) {
          c.push(f), f = b[g], Lc(a, a.Va ? a.Va.call(b, String(g), f) : f, c), f = ","
        }
        c.push("]");
        break
      }
      c.push("{");
      d = "";
      for(g in b) {
        Object.prototype.hasOwnProperty.call(b, g) && (f = b[g], "function" != typeof f && (c.push(d), Nc(g, c), c.push(":"), Lc(a, a.Va ? a.Va.call(b, g, f) : f, c), d = ","))
      }
      c.push("}");
      break;
    case "function":
      break;
    default:
      throw Error("Unknown type: " + typeof b);
  }
}
var Oc = {'"':'\\"', "\\":"\\\\", "/":"\\/", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\u000b"}, Pc = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g;
function Nc(a, b) {
  b.push('"', a.replace(Pc, function(a) {
    if(a in Oc) {
      return Oc[a]
    }
    var b = a.charCodeAt(0), f = "\\u";
    16 > b ? f += "000" : 256 > b ? f += "00" : 4096 > b && (f += "0");
    return Oc[a] = f + b.toString(16)
  }), '"')
}
;function Qc(a) {
  return Rc(a || arguments.callee.caller, [])
}
function Rc(a, b) {
  var c = [];
  if(0 <= Xa(b, a)) {
    c.push("[...circular reference...]")
  }else {
    if(a && 50 > b.length) {
      c.push(Sc(a) + "(");
      for(var d = a.arguments, f = 0;f < d.length;f++) {
        0 < f && c.push(", ");
        var g;
        g = d[f];
        switch(typeof g) {
          case "object":
            g = g ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            g = String(g);
            break;
          case "boolean":
            g = g ? "true" : "false";
            break;
          case "function":
            g = (g = Sc(g)) ? g : "[fn]";
            break;
          default:
            g = typeof g
        }
        40 < g.length && (g = g.substr(0, 40) + "...");
        c.push(g)
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(Rc(a.caller, b))
      }catch(h) {
        c.push("[exception trying to get caller]\n")
      }
    }else {
      a ? c.push("[...long stack...]") : c.push("[end]")
    }
  }
  return c.join("")
}
function Sc(a) {
  if(Tc[a]) {
    return Tc[a]
  }
  a = String(a);
  if(!Tc[a]) {
    var b = /function ([^\(]+)/.exec(a);
    Tc[a] = b ? b[1] : "[Anonymous]"
  }
  return Tc[a]
}
var Tc = {};
function Uc(a, b, c, d, f) {
  this.reset(a, b, c, d, f)
}
Uc.prototype.Cc = 0;
Uc.prototype.Bb = null;
Uc.prototype.Ab = null;
var Vc = 0;
Uc.prototype.reset = function(a, b, c, d, f) {
  this.Cc = "number" == typeof f ? f : Vc++;
  this.Qc = d || x();
  this.za = a;
  this.oc = b;
  this.Ic = c;
  delete this.Bb;
  delete this.Ab
};
Uc.prototype.Yb = m("za");
function V(a) {
  this.pc = a
}
V.prototype.Ra = null;
V.prototype.za = null;
V.prototype.fb = null;
V.prototype.Fb = null;
function Wc(a, b) {
  this.name = a;
  this.value = b
}
Wc.prototype.toString = aa("name");
var Xc = new Wc("SEVERE", 1E3), Yc = new Wc("WARNING", 900), Zc = new Wc("INFO", 800), $c = new Wc("CONFIG", 700), ad = new Wc("FINE", 500);
p = V.prototype;
p.getParent = aa("Ra");
p.Yb = m("za");
function bd(a) {
  if(a.za) {
    return a.za
  }
  if(a.Ra) {
    return bd(a.Ra)
  }
  Pa("Root logger has no level set.");
  return null
}
p.log = function(a, b, c) {
  if(a.value >= bd(this).value) {
    for(a = this.kc(a, b, c), b = "log:" + a.oc, q.console && (q.console.timeStamp ? q.console.timeStamp(b) : q.console.markTimeline && q.console.markTimeline(b)), q.msWriteProfilerMark && q.msWriteProfilerMark(b), b = this;b;) {
      c = b;
      var d = a;
      if(c.Fb) {
        for(var f = 0, g = void 0;g = c.Fb[f];f++) {
          g(d)
        }
      }
      b = b.getParent()
    }
  }
};
p.kc = function(a, b, c) {
  var d = new Uc(a, String(b), this.pc);
  if(c) {
    d.Bb = c;
    var f;
    var g = arguments.callee.caller;
    try {
      var h;
      var n = da("window.location.href");
      if(u(c)) {
        h = {message:c, name:"Unknown error", lineNumber:"Not available", fileName:n, stack:"Not available"}
      }else {
        var k, t, l = !1;
        try {
          k = c.lineNumber || c.Hc || "Not available"
        }catch(r) {
          k = "Not available", l = !0
        }
        try {
          t = c.fileName || c.filename || c.sourceURL || q.$googDebugFname || n
        }catch(G) {
          t = "Not available", l = !0
        }
        h = !l && c.lineNumber && c.fileName && c.stack ? c : {message:c.message, name:c.name, lineNumber:k, fileName:t, stack:c.stack || "Not available"}
      }
      f = "Message: " + na(h.message) + '\nUrl: <a href="view-source:' + h.fileName + '" target="_new">' + h.fileName + "</a>\nLine: " + h.lineNumber + "\n\nBrowser stack:\n" + na(h.stack + "-> ") + "[end]\n\nJS stack traversal:\n" + na(Qc(g) + "-> ")
    }catch(Sd) {
      f = "Exception trying to expose exception! You win, we lose. " + Sd
    }
    d.Ab = f
  }
  return d
};
p.I = function(a, b) {
  this.log(Xc, a, b)
};
p.$ = function(a, b) {
  this.log(Yc, a, b)
};
p.info = function(a, b) {
  this.log(Zc, a, b)
};
function W(a, b) {
  a.log(ad, b, void 0)
}
var cd = {}, dd = null;
function ed(a) {
  dd || (dd = new V(""), cd[""] = dd, dd.Yb($c));
  var b;
  if(!(b = cd[a])) {
    b = new V(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = ed(a.substr(0, c));
    c.fb || (c.fb = {});
    c.fb[d] = b;
    b.Ra = c;
    cd[a] = b
  }
  return b
}
;function X() {
  this.q = ed("goog.net.BrowserChannel")
}
function sc(a, b, c, d) {
  a.info("XMLHTTP TEXT (" + b + "): " + Ec(a, c) + (d ? " " + d : ""))
}
X.prototype.debug = function(a) {
  this.info(a)
};
function xc(a, b, c) {
  a.I((c || "Exception") + b)
}
X.prototype.info = function(a) {
  this.q.info(a)
};
X.prototype.$ = function(a) {
  this.q.$(a)
};
X.prototype.I = function(a) {
  this.q.I(a)
};
function Ec(a, b) {
  if(!b || b == fd) {
    return b
  }
  try {
    var c = Jc(b);
    if(c) {
      for(var d = 0;d < c.length;d++) {
        if(s(c[d])) {
          var f = c[d];
          if(!(2 > f.length)) {
            var g = f[1];
            if(s(g) && !(1 > g.length)) {
              var h = g[0];
              if("noop" != h && "stop" != h) {
                for(var n = 1;n < g.length;n++) {
                  g[n] = ""
                }
              }
            }
          }
        }
      }
    }
    return Kc(c)
  }catch(k) {
    return a.debug("Exception parsing expected JS array - probably was not JS"), b
  }
}
;function gd(a, b) {
  this.Oc = new Mc(a);
  this.P = b ? Jc : Ic
}
gd.prototype.parse = function(a) {
  return this.P(a)
};
var mc = 7, nc = 8;
function hd(a) {
  M.call(this);
  this.headers = new bb;
  this.va = a || null
}
y(hd, Sb);
hd.prototype.q = ed("goog.net.XhrIo");
var id = /^https?$/i;
p = hd.prototype;
p.S = !1;
p.g = null;
p.bb = null;
p.Pa = "";
p.Jb = "";
p.la = 0;
p.p = "";
p.ib = !1;
p.Na = !1;
p.mb = !1;
p.ca = !1;
p.$a = 0;
p.fa = null;
p.Wb = "";
p.cc = !1;
p.send = function(a, b, c, d) {
  if(this.g) {
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.Pa + "; newUri=" + a);
  }
  b = b ? b.toUpperCase() : "GET";
  this.Pa = a;
  this.p = "";
  this.la = 0;
  this.Jb = b;
  this.ib = !1;
  this.S = !0;
  this.g = this.va ? xb(this.va) : xb(vb);
  this.bb = this.va ? this.va.Ga || (this.va.Ga = zb(this.va)) : vb.Ga || (vb.Ga = zb(vb));
  this.g.onreadystatechange = w(this.Ob, this);
  try {
    W(this.q, Y(this, "Opening Xhr")), this.mb = !0, this.g.open(b, a, !0), this.mb = !1
  }catch(f) {
    W(this.q, Y(this, "Error opening Xhr: " + f.message));
    jd(this, f);
    return
  }
  a = c || "";
  var g = this.headers.n();
  d && E(d, function(a, b) {
    g.set(b, a)
  });
  d = q.FormData && a instanceof q.FormData;
  "POST" != b || (g.ia("Content-Type") || d) || g.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  E(g, function(a, b) {
    this.g.setRequestHeader(b, a)
  }, this);
  this.Wb && (this.g.responseType = this.Wb);
  "withCredentials" in this.g && (this.g.withCredentials = this.cc);
  try {
    this.fa && (q.clearTimeout(this.fa), this.fa = null), 0 < this.$a && (W(this.q, Y(this, "Will abort after " + this.$a + "ms if incomplete")), this.fa = q.setTimeout(w(this.Da, this), this.$a)), W(this.q, Y(this, "Sending request")), this.Na = !0, this.g.send(a), this.Na = !1
  }catch(h) {
    W(this.q, Y(this, "Send error: " + h.message)), jd(this, h)
  }
};
p.Da = function() {
  "undefined" != typeof ca && this.g && (this.p = "Timed out after " + this.$a + "ms, aborting", this.la = nc, W(this.q, Y(this, this.p)), this.dispatchEvent("timeout"), this.abort(nc))
};
function jd(a, b) {
  a.S = !1;
  a.g && (a.ca = !0, a.g.abort(), a.ca = !1);
  a.p = b;
  a.la = 5;
  kd(a);
  ld(a)
}
function kd(a) {
  a.ib || (a.ib = !0, a.dispatchEvent("complete"), a.dispatchEvent("error"))
}
p.abort = function(a) {
  this.g && this.S && (W(this.q, Y(this, "Aborting")), this.S = !1, this.ca = !0, this.g.abort(), this.ca = !1, this.la = a || mc, this.dispatchEvent("complete"), this.dispatchEvent("abort"), ld(this))
};
p.u = function() {
  this.g && (this.S && (this.S = !1, this.ca = !0, this.g.abort(), this.ca = !1), ld(this, !0));
  hd.ra.u.call(this)
};
p.Ob = function() {
  this.mb || this.Na || this.ca ? md(this) : this.sc()
};
p.sc = function() {
  md(this)
};
function md(a) {
  if(a.S && "undefined" != typeof ca) {
    if(a.bb[1] && 4 == R(a) && 2 == kc(a)) {
      W(a.q, Y(a, "Local request error detected and ignored"))
    }else {
      if(a.Na && 4 == R(a)) {
        q.setTimeout(w(a.Ob, a), 0)
      }else {
        if(a.dispatchEvent("readystatechange"), 4 == R(a)) {
          W(a.q, Y(a, "Request complete"));
          a.S = !1;
          try {
            var b = kc(a), c, d;
            a: {
              switch(b) {
                case 200:
                ;
                case 201:
                ;
                case 202:
                ;
                case 204:
                ;
                case 206:
                ;
                case 304:
                ;
                case 1223:
                  d = !0;
                  break a;
                default:
                  d = !1
              }
            }
            if(!(c = d)) {
              var f;
              if(f = 0 === b) {
                var g = String(a.Pa).match(Qa)[1] || null;
                if(!g && self.location) {
                  var h = self.location.protocol, g = h.substr(0, h.length - 1)
                }
                f = !id.test(g ? g.toLowerCase() : "")
              }
              c = f
            }
            if(c) {
              a.dispatchEvent("complete"), a.dispatchEvent("success")
            }else {
              a.la = 6;
              var n;
              try {
                n = 2 < R(a) ? a.g.statusText : ""
              }catch(k) {
                W(a.q, "Can not get status: " + k.message), n = ""
              }
              a.p = n + " [" + kc(a) + "]";
              kd(a)
            }
          }finally {
            ld(a)
          }
        }
      }
    }
  }
}
function ld(a, b) {
  if(a.g) {
    var c = a.g, d = a.bb[0] ? ea : null;
    a.g = null;
    a.bb = null;
    a.fa && (q.clearTimeout(a.fa), a.fa = null);
    b || a.dispatchEvent("ready");
    try {
      c.onreadystatechange = d
    }catch(f) {
      a.q.I("Problem encountered resetting onreadystatechange: " + f.message)
    }
  }
}
p.isActive = function() {
  return!!this.g
};
function R(a) {
  return a.g ? a.g.readyState : 0
}
function kc(a) {
  try {
    return 2 < R(a) ? a.g.status : -1
  }catch(b) {
    return a.q.$("Can not get status: " + b.message), -1
  }
}
function lc(a) {
  try {
    return a.g ? a.g.responseText : ""
  }catch(b) {
    return W(a.q, "Can not get responseText: " + b.message), ""
  }
}
p.Eb = function() {
  return u(this.p) ? this.p : String(this.p)
};
function Y(a, b) {
  return b + " [" + a.Jb + " " + a.Pa + " " + kc(a) + "]"
}
;function nd() {
  this.Vb = x()
}
new nd;
nd.prototype.set = m("Vb");
nd.prototype.reset = function() {
  this.set(x())
};
nd.prototype.get = aa("Vb");
function od(a, b, c, d, f) {
  (new X).debug("TestLoadImageWithRetries: " + f);
  if(0 == d) {
    c(!1)
  }else {
    var g = f || 0;
    d--;
    pd(a, b, function(f) {
      f ? c(!0) : q.setTimeout(function() {
        od(a, b, c, d, g)
      }, g)
    })
  }
}
function pd(a, b, c) {
  function d(a, b) {
    return function() {
      try {
        f.debug("TestLoadImage: " + b), g.onload = null, g.onerror = null, g.onabort = null, g.ontimeout = null, q.clearTimeout(h), c(a)
      }catch(d) {
        xc(f, d)
      }
    }
  }
  var f = new X;
  f.debug("TestLoadImage: loading " + a);
  var g = new Image, h = null;
  g.onload = d(!0, "loaded");
  g.onerror = d(!1, "error");
  g.onabort = d(!1, "abort");
  g.ontimeout = d(!1, "timeout");
  h = q.setTimeout(function() {
    if(g.ontimeout) {
      g.ontimeout()
    }
  }, b);
  g.src = a
}
;function qd(a, b) {
  this.b = a;
  this.a = b;
  this.P = new gd(null, !0)
}
p = qd.prototype;
p.v = null;
p.A = null;
p.Ua = !1;
p.ac = null;
p.Ka = null;
p.nb = null;
p.H = null;
p.c = null;
p.h = -1;
p.L = null;
p.wa = null;
p.Y = m("v");
p.Zb = m("P");
p.gb = function(a) {
  this.H = a;
  a = rd(this.b, this.H);
  T(sd);
  this.ac = x();
  var b = this.b.Cb;
  null != b ? (this.L = this.b.correctHostPrefix(b[0]), (this.wa = b[1]) ? (this.c = 1, td(this)) : (this.c = 2, ud(this))) : (qb(a, "MODE", "init"), this.A = new Q(this, this.a, void 0, void 0, void 0), this.A.Y(this.v), hc(this.A, a, !1, null, !0), this.c = 0)
};
function td(a) {
  var b = vd(a.b, a.wa, "/mail/images/cleardot.gif");
  J(b);
  od(b.toString(), 5E3, w(a.ic, a), 3, 2E3);
  a.G(jc)
}
p.ic = function(a) {
  if(a) {
    this.c = 2, ud(this)
  }else {
    T(wd);
    var b = this.b;
    b.a.debug("Test Connection Blocked");
    b.h = b.U.h;
    Z(b, 9)
  }
  a && this.G(pc)
};
function ud(a) {
  a.a.debug("TestConnection: starting stage 2");
  a.A = new Q(a, a.a, void 0, void 0, void 0);
  a.A.Y(a.v);
  var b = xd(a.b, a.L, a.H);
  T(yd);
  if(ec()) {
    qb(b, "TYPE", "xmlhttp"), hc(a.A, b, !1, a.L, !1)
  }else {
    qb(b, "TYPE", "html");
    var c = a.A;
    a = Boolean(a.L);
    c.sa = 3;
    c.T = J(b.n());
    Cc(c, a)
  }
}
p.hb = function(a) {
  return this.b.hb(a)
};
p.abort = function() {
  this.A && (this.A.cancel(), this.A = null);
  this.h = -1
};
p.Hb = ba(!1);
p.Pb = function(a, b) {
  this.h = a.h;
  if(0 == this.c) {
    if(this.a.debug("TestConnection: Got data for stage 1"), b) {
      try {
        var c = this.P.parse(b)
      }catch(d) {
        xc(this.a, d);
        zd(this.b, this);
        return
      }
      this.L = this.b.correctHostPrefix(c[0]);
      this.wa = c[1]
    }else {
      this.a.debug("TestConnection: Null responseText"), zd(this.b, this)
    }
  }else {
    if(2 == this.c) {
      if(this.Ua) {
        T(Ad), this.nb = x()
      }else {
        if("11111" == b) {
          if(T(Bd), this.Ua = !0, this.Ka = x(), c = this.Ka - this.ac, ec() || 500 > c) {
            this.h = 200, this.A.cancel(), this.a.debug("Test connection succeeded; using streaming connection"), T(Cd), Dd(this.b, this, !0)
          }
        }else {
          T(Ed), this.Ka = this.nb = x(), this.Ua = !1
        }
      }
    }
  }
};
p.ma = function() {
  this.h = this.A.h;
  if(!this.A.J) {
    this.a.debug("TestConnection: request failed, in state " + this.c), 0 == this.c ? T(Fd) : 2 == this.c && T(Gd), zd(this.b, this)
  }else {
    if(0 == this.c) {
      this.a.debug("TestConnection: request complete for initial check"), this.wa ? (this.c = 1, td(this)) : (this.c = 2, ud(this))
    }else {
      if(2 == this.c) {
        this.a.debug("TestConnection: request complete for stage 2");
        var a = !1;
        (a = ec() ? this.Ua : 200 > this.nb - this.Ka ? !1 : !0) ? (this.a.debug("Test connection succeeded; using streaming connection"), T(Cd), Dd(this.b, this, !0)) : (this.a.debug("Test connection failed; not using streaming"), T(Hd), Dd(this.b, this, !1))
      }
    }
  }
};
p.Ya = function() {
  return this.b.Ya()
};
p.isActive = function() {
  return this.b.isActive()
};
p.G = function(a) {
  this.b.G(a)
};
function Id(a, b) {
  this.vb = a || null;
  this.c = Jd;
  this.s = [];
  this.Q = [];
  this.a = new X;
  this.P = new gd(null, !0);
  this.Cb = b || null
}
function Kd(a, b) {
  this.Lb = a;
  this.map = b;
  this.Fc = null
}
p = Id.prototype;
p.v = null;
p.xa = null;
p.o = null;
p.k = null;
p.H = null;
p.La = null;
p.ub = null;
p.L = null;
p.fc = !0;
p.Aa = 0;
p.qc = 0;
p.Ja = !1;
p.e = null;
p.F = null;
p.M = null;
p.ba = null;
p.U = null;
p.rb = null;
p.ec = !0;
p.ya = -1;
p.Kb = -1;
p.h = -1;
p.V = 0;
p.ga = 0;
p.gc = 5E3;
p.Bc = 1E4;
p.kb = 2;
p.Db = 2E4;
p.oa = 0;
p.Za = !1;
p.ha = 8;
var Jd = 1, Ld = new Sb;
function Md(a, b) {
  N.call(this, "statevent", a);
  this.Pc = b
}
y(Md, N);
function Nd(a, b, c, d) {
  N.call(this, "timingevent", a);
  this.size = b;
  this.Nc = c;
  this.Mc = d
}
y(Nd, N);
var jc = 1, pc = 2, oc = 3, Fc = 4;
function Od(a, b) {
  N.call(this, "serverreachability", a);
  this.Lc = b
}
y(Od, N);
var sd = 3, wd = 4, yd = 5, Bd = 6, Ad = 7, Ed = 8, Fd = 9, Gd = 10, Hd = 11, Cd = 12, uc = 13, vc = 14, zc = 15, Ac = 16, Bc = 17, Hc = 18, Dc = 22, fd = "y2f%";
p = Id.prototype;
p.gb = function(a, b, c, d, f) {
  this.a.debug("connect()");
  T(0);
  this.H = b;
  this.xa = c || {};
  d && void 0 !== f && (this.xa.OSID = d, this.xa.OAID = f);
  this.a.debug("connectTest_()");
  Pd(this) && (this.U = new qd(this, this.a), this.U.Y(this.v), this.U.Zb(this.P), this.U.gb(a))
};
p.disconnect = function() {
  this.a.debug("disconnect()");
  Qd(this);
  if(3 == this.c) {
    var a = this.Aa++, b = this.La.n();
    I(b, "SID", this.Z);
    I(b, "RID", a);
    I(b, "TYPE", "terminate");
    Rd(this, b);
    a = new Q(this, this.a, this.Z, a, void 0);
    a.sa = 2;
    a.T = J(b.n());
    b = new Image;
    b.src = a.T;
    b.onload = b.onerror = w(a.lc, a);
    a.pa = x();
    ic(a)
  }
  Td(this)
};
function Qd(a) {
  a.U && (a.U.abort(), a.U = null);
  a.k && (a.k.cancel(), a.k = null);
  a.M && (q.clearTimeout(a.M), a.M = null);
  Ud(a);
  a.o && (a.o.cancel(), a.o = null);
  a.F && (q.clearTimeout(a.F), a.F = null)
}
p.Y = m("v");
p.$b = m("oa");
p.Hb = function() {
  return 0 == this.c
};
p.Zb = m("P");
function Vd(a) {
  a.o || a.F || (a.F = U(w(a.Rb, a), 0), a.V = 0)
}
p.Rb = function(a) {
  this.F = null;
  this.a.debug("startForwardChannel_");
  if(Pd(this)) {
    if(this.c == Jd) {
      if(a) {
        this.a.I("Not supposed to retry the open")
      }else {
        this.a.debug("open_()");
        this.Aa = Math.floor(1E5 * Math.random());
        a = this.Aa++;
        var b = new Q(this, this.a, "", a, void 0);
        b.Y(this.v);
        var c = Wd(this), d = this.La.n();
        I(d, "RID", a);
        this.vb && I(d, "CVER", this.vb);
        Rd(this, d);
        fc(b, d, c);
        this.o = b;
        this.c = 2
      }
    }else {
      3 == this.c && (a ? Xd(this, a) : 0 == this.s.length ? this.a.debug("startForwardChannel_ returned: nothing to send") : this.o ? this.a.I("startForwardChannel_ returned: connection already in progress") : (Xd(this), this.a.debug("startForwardChannel_ finished, sent request")))
    }
  }
};
function Xd(a, b) {
  var c, d;
  b ? 6 < a.ha ? (a.s = a.Q.concat(a.s), a.Q.length = 0, c = a.Aa - 1, d = Wd(a)) : (c = b.B, d = b.X) : (c = a.Aa++, d = Wd(a));
  var f = a.La.n();
  I(f, "SID", a.Z);
  I(f, "RID", c);
  I(f, "AID", a.ya);
  Rd(a, f);
  c = new Q(a, a.a, a.Z, c, a.V + 1);
  c.Y(a.v);
  c.setTimeout(Math.round(0.5 * a.Db) + Math.round(0.5 * a.Db * Math.random()));
  a.o = c;
  fc(c, f, d)
}
function Rd(a, b) {
  if(a.e) {
    var c = a.e.getAdditionalParams(a);
    c && E(c, function(a, c) {
      I(b, c, a)
    })
  }
}
function Wd(a) {
  var b = Math.min(a.s.length, 1E3), c = ["count=" + b], d;
  6 < a.ha && 0 < b ? (d = a.s[0].Lb, c.push("ofs=" + d)) : d = 0;
  for(var f = 0;f < b;f++) {
    var g = a.s[f].Lb, h = a.s[f].map, g = 6 >= a.ha ? f : g - d;
    try {
      E(h, function(a, b) {
        c.push("req" + g + "_" + b + "=" + encodeURIComponent(a))
      })
    }catch(n) {
      c.push("req" + g + "_type=" + encodeURIComponent("_badmap")), a.e && a.e.badMapError(a, h)
    }
  }
  a.Q = a.Q.concat(a.s.splice(0, b));
  return c.join("&")
}
function Yd(a) {
  a.k || a.M || (a.tb = 1, a.M = U(w(a.Qb, a), 0), a.ga = 0)
}
function Zd(a) {
  if(a.k || a.M) {
    return a.a.I("Request already in progress"), !1
  }
  if(3 <= a.ga) {
    return!1
  }
  a.a.debug("Going to retry GET");
  a.tb++;
  a.M = U(w(a.Qb, a), $d(a, a.ga));
  a.ga++;
  return!0
}
p.Qb = function() {
  this.M = null;
  if(Pd(this)) {
    this.a.debug("Creating new HttpRequest");
    this.k = new Q(this, this.a, this.Z, "rpc", this.tb);
    this.k.Y(this.v);
    this.k.$b(this.oa);
    var a = this.ub.n();
    I(a, "RID", "rpc");
    I(a, "SID", this.Z);
    I(a, "CI", this.rb ? "0" : "1");
    I(a, "AID", this.ya);
    Rd(this, a);
    if(ec()) {
      I(a, "TYPE", "xmlhttp"), hc(this.k, a, !0, this.L, !1)
    }else {
      I(a, "TYPE", "html");
      var b = this.k, c = Boolean(this.L);
      b.sa = 3;
      b.T = J(a.n());
      Cc(b, c)
    }
    this.a.debug("New Request created")
  }
};
function Pd(a) {
  if(a.e) {
    var b = a.e.okToMakeRequest(a);
    if(0 != b) {
      return a.a.debug("Handler returned error code from okToMakeRequest"), Z(a, b), !1
    }
  }
  return!0
}
function Dd(a, b, c) {
  a.a.debug("Test Connection Finished");
  a.rb = a.ec && c;
  a.h = b.h;
  a.a.debug("connectChannel_()");
  a.jc(Jd, 0);
  a.La = rd(a, a.H);
  Vd(a)
}
function zd(a, b) {
  a.a.debug("Test Connection Failed");
  a.h = b.h;
  Z(a, 2)
}
p.Pb = function(a, b) {
  if(0 != this.c && (this.k == a || this.o == a)) {
    if(this.h = a.h, this.o == a && 3 == this.c) {
      if(7 < this.ha) {
        var c;
        try {
          c = this.P.parse(b)
        }catch(d) {
          c = null
        }
        if(s(c) && 3 == c.length) {
          var f = c;
          if(0 == f[0]) {
            a: {
              if(this.a.debug("Server claims our backchannel is missing."), this.M) {
                this.a.debug("But we are currently starting the request.")
              }else {
                if(this.k) {
                  if(this.k.pa + 3E3 < this.o.pa) {
                    Ud(this), this.k.cancel(), this.k = null
                  }else {
                    break a
                  }
                }else {
                  this.a.$("We do not have a BackChannel established")
                }
                Zd(this);
                T(19)
              }
            }
          }else {
            this.Kb = f[1], c = this.Kb - this.ya, 0 < c && (f = f[2], this.a.debug(f + " bytes (in " + c + " arrays) are outstanding on the BackChannel"), 37500 > f && (this.rb && 0 == this.ga) && !this.ba && (this.ba = U(w(this.rc, this), 6E3)))
          }
        }else {
          this.a.debug("Bad POST response data returned"), Z(this, 11)
        }
      }else {
        b != fd && (this.a.debug("Bad data returned - missing/invald magic cookie"), Z(this, 11))
      }
    }else {
      if(this.k == a && Ud(this), !/^[\s\xa0]*$/.test(b)) {
        c = this.P.parse(b);
        for(var f = this.e && this.e.channelHandleMultipleArrays ? [] : null, g = 0;g < c.length;g++) {
          var h = c[g];
          this.ya = h[0];
          h = h[1];
          2 == this.c ? "c" == h[0] ? (this.Z = h[1], this.L = this.correctHostPrefix(h[2]), h = h[3], this.ha = null != h ? h : 6, this.c = 3, this.e && this.e.channelOpened(this), this.ub = xd(this, this.L, this.H), Yd(this)) : "stop" == h[0] && Z(this, 7) : 3 == this.c && ("stop" == h[0] ? (f && f.length && (this.e.channelHandleMultipleArrays(this, f), f.length = 0), Z(this, 7)) : "noop" != h[0] && (f ? f.push(h) : this.e && this.e.channelHandleArray(this, h)), this.ga = 0)
        }
        f && f.length && this.e.channelHandleMultipleArrays(this, f)
      }
    }
  }
};
p.correctHostPrefix = function(a) {
  return this.fc ? this.e ? this.e.correctHostPrefix(a) : a : null
};
p.rc = function() {
  null != this.ba && (this.ba = null, this.k.cancel(), this.k = null, Zd(this), T(20))
};
function Ud(a) {
  null != a.ba && (q.clearTimeout(a.ba), a.ba = null)
}
p.ma = function(a) {
  this.a.debug("Request complete");
  var b;
  if(this.k == a) {
    Ud(this), this.k = null, b = 2
  }else {
    if(this.o == a) {
      this.o = null, b = 1
    }else {
      return
    }
  }
  this.h = a.h;
  if(0 != this.c) {
    if(a.J) {
      1 == b ? (b = x() - a.pa, Ld.dispatchEvent(new Nd(Ld, a.X ? a.X.length : 0, b, this.V)), Vd(this), this.Q.length = 0) : Yd(this)
    }else {
      var c = a.Eb();
      if(3 == c || 7 == c || 0 == c && 0 < this.h) {
        this.a.debug("Not retrying due to error type")
      }else {
        this.a.debug("Maybe retrying, last error: " + bc(c, this.h));
        var d;
        if(d = 1 == b) {
          this.o || this.F ? (this.a.I("Request already in progress"), d = !1) : this.c == Jd || this.V >= (this.Ja ? 0 : this.kb) ? d = !1 : (this.a.debug("Going to retry POST"), this.F = U(w(this.Rb, this, a), $d(this, this.V)), this.V++, d = !0)
        }
        if(d || 2 == b && Zd(this)) {
          return
        }
        this.a.debug("Exceeded max number of retries")
      }
      this.a.debug("Error: HTTP request failed");
      switch(c) {
        case 1:
          Z(this, 5);
          break;
        case 4:
          Z(this, 10);
          break;
        case 3:
          Z(this, 6);
          break;
        case 7:
          Z(this, 12);
          break;
        default:
          Z(this, 2)
      }
    }
  }
};
function $d(a, b) {
  var c = a.gc + Math.floor(Math.random() * a.Bc);
  a.isActive() || (a.a.debug("Inactive channel"), c *= 2);
  return c * b
}
p.jc = function(a) {
  if(!(0 <= Xa(arguments, this.c))) {
    throw Error("Unexpected channel state: " + this.c);
  }
};
function Z(a, b) {
  a.a.info("Error code " + b);
  if(2 == b || 9 == b) {
    var c = null;
    a.e && (c = a.e.getNetworkTestImageUri(a));
    var d = w(a.Dc, a);
    c || (c = new F("http://www.google.com/images/cleardot.gif"), J(c));
    pd(c.toString(), 1E4, d)
  }else {
    T(2)
  }
  ae(a, b)
}
p.Dc = function(a) {
  a ? (this.a.info("Successfully pinged google.com"), T(2)) : (this.a.info("Failed to ping google.com"), T(1), ae(this, 8))
};
function ae(a, b) {
  a.a.debug("HttpChannel: error - " + b);
  a.c = 0;
  a.e && a.e.channelError(a, b);
  Td(a);
  Qd(a)
}
function Td(a) {
  a.c = 0;
  a.h = -1;
  if(a.e) {
    if(0 == a.Q.length && 0 == a.s.length) {
      a.e.channelClosed(a)
    }else {
      a.a.debug("Number of undelivered maps, pending: " + a.Q.length + ", outgoing: " + a.s.length);
      var b = $a(a.Q), c = $a(a.s);
      a.Q.length = 0;
      a.s.length = 0;
      a.e.channelClosed(a, b, c)
    }
  }
}
function rd(a, b) {
  var c = vd(a, null, b);
  a.a.debug("GetForwardChannelUri: " + c);
  return c
}
function xd(a, b, c) {
  b = vd(a, a.Ya() ? b : null, c);
  a.a.debug("GetBackChannelUri: " + b);
  return b
}
function vd(a, b, c) {
  var d = c instanceof F ? c.n() : new F(c, void 0);
  if("" != d.ja) {
    b && fb(d, b + "." + d.ja), gb(d, d.Ba)
  }else {
    var f = window.location, d = sb(f.protocol, b ? b + "." + f.hostname : f.hostname, f.port, c)
  }
  a.xa && E(a.xa, function(a, b) {
    I(d, b, a)
  });
  I(d, "VER", a.ha);
  Rd(a, d);
  return d
}
p.hb = function(a) {
  if(a && !this.Za) {
    throw Error("Can't create secondary domain capable XhrIo object.");
  }
  a = new hd;
  a.cc = this.Za;
  return a
};
p.isActive = function() {
  return!!this.e && this.e.isActive(this)
};
function U(a, b) {
  if(!ha(a)) {
    throw Error("Fn must not be null and must be a function");
  }
  return q.setTimeout(function() {
    a()
  }, b)
}
p.G = function(a) {
  Ld.dispatchEvent(new Od(Ld, a))
};
function T(a) {
  Ld.dispatchEvent(new Md(Ld, a))
}
p.Ya = function() {
  return this.Za || !ec()
};
function be() {
}
p = be.prototype;
p.channelHandleMultipleArrays = null;
p.okToMakeRequest = ba(0);
p.channelOpened = e();
p.channelHandleArray = e();
p.channelError = e();
p.channelClosed = e();
p.getAdditionalParams = function() {
  return{}
};
p.getNetworkTestImageUri = ba(null);
p.isActive = ba(!0);
p.badMapError = e();
p.correctHostPrefix = function(a) {
  return a
};
var $, ce, de = [].slice;
ce = {0:"Ok", 4:"User is logging out", 6:"Unknown session ID", 7:"Stopped by server", 8:"General network error", 2:"Request failed", 9:"Blocked by a network administrator", 5:"No data from server", 10:"Got bad data from the server", 11:"Got a bad response from the server"};
$ = function(a, b) {
  var c, d, f, g, h, n, k, t, l, r;
  t = this;
  a || (a = "channel");
  a.match(/:\/\//) && a.replace(/^ws/, "http");
  b || (b = {});
  s(b || "string" === typeof b) && (b = {});
  n = b.reconnectTime || 3E3;
  r = function(a) {
    t.readyState = t.readyState = a
  };
  r(this.CLOSED);
  l = null;
  g = b.Kc;
  c = function() {
    var a, b;
    b = arguments[0];
    a = 2 <= arguments.length ? de.call(arguments, 1) : [];
    try {
      return"function" === typeof t[b] ? t[b].apply(t, a) : void 0
    }catch(c) {
      throw a = c, "undefined" !== typeof console && null !== console && console.error(a.stack), a;
    }
  };
  d = new be;
  d.channelOpened = function() {
    g = l;
    r($.OPEN);
    return c("onopen")
  };
  f = null;
  d.channelError = function(a, b) {
    var d;
    d = ce[b];
    f = b;
    r($.cb);
    try {
      return c("onerror", d, b)
    }catch(g) {
    }
  };
  k = null;
  d.channelClosed = function(a, d, g) {
    if(t.readyState !== $.CLOSED) {
      l = null;
      a = f ? ce[f] : "Closed";
      r($.CLOSED);
      try {
        c("onclose", a, d, g)
      }catch(ee) {
      }
      b.reconnect && (7 !== f && 0 !== f) && (d = 6 === f ? 0 : n, clearTimeout(k), k = setTimeout(h, d));
      return f = null
    }
  };
  d.channelHandleArray = function(a, b) {
    return c("onmessage", b)
  };
  h = function() {
    if(l) {
      throw Error("Reconnect() called from invalid state");
    }
    r($.CONNECTING);
    c("onconnecting");
    clearTimeout(k);
    l = new Id(b.appVersion, null != g ? g.Cb : void 0);
    b.crossDomainXhr && (l.Za = !0);
    l.e = d;
    f = null;
    if(b.failFast) {
      var h = l;
      h.Ja = !0;
      h.a.info("setFailFast: true");
      (h.o || h.F) && h.V > (h.Ja ? 0 : h.kb) && (h.a.info("Retry count " + h.V + " > new maxRetries " + (h.Ja ? 0 : h.kb) + ". Fail immediately!"), h.o ? (h.o.cancel(), h.ma(h.o)) : (q.clearTimeout(h.F), h.F = null, Z(h, 2)))
    }
    return l.gb("" + a + "/test", "" + a + "/bind", b.extraParams, null != g ? g.Z : void 0, null != g ? g.ya : void 0)
  };
  this.open = function() {
    if(t.readyState !== t.CLOSED) {
      throw Error("Already open");
    }
    return h()
  };
  this.close = function() {
    clearTimeout(k);
    f = 0;
    if(t.readyState !== $.CLOSED) {
      return r($.cb), l.disconnect()
    }
  };
  this.sendMap = function(a) {
    var b;
    if((b = t.readyState) === $.cb || b === $.CLOSED) {
      throw Error("Cannot send to a closed connection");
    }
    b = l;
    if(0 == b.c) {
      throw Error("Invalid operation: sending map when state is closed");
    }
    1E3 == b.s.length && b.a.I("Already have 1000 queued maps upon queueing " + Kc(a));
    b.s.push(new Kd(b.qc++, a));
    2 != b.c && 3 != b.c || Vd(b)
  };
  this.send = function(a) {
    return this.sendMap({JSON:Kc(a)})
  };
  h();
  return this
};
$.prototype.CONNECTING = $.CONNECTING = $.CONNECTING = 0;
$.prototype.OPEN = $.OPEN = $.OPEN = 1;
$.prototype.CLOSING = $.CLOSING = $.cb = 2;
$.prototype.CLOSED = $.CLOSED = $.CLOSED = 3;
("undefined" !== typeof exports && null !== exports ? exports : window).BCSocket = $;

})();

},{}],17:[function(require,module,exports){
exports.setup = function(library) {
  library.view.fn('sentenceCase', function(text) {
    return text && (text.charAt(0).toUpperCase() + text.slice(1));
  });
};

exports.reconnect = function() {
  var model = this.model;
  model.set('hideReconnect', true);
  setTimeout(function() {
    model.set('hideReconnect', false);
  }, 1000);
  model.reconnect();
};

exports.reload = function() {
  window.location.reload();
};
},{}],2:[function(require,module,exports){
(function(global){var racer = require('racer')
  , tracks = require('tracks')
  , sharedCreateApp = require('./app').create
  , derbyModel = require('./derby.Model')
  , Dom = require('./Dom')
  , viewModel = require('./viewModel')
  , refresh = require('./refresh')

module.exports = derbyBrowser;

function derbyBrowser(derby) {
  // This assumes that only a single instance of this module can run at a time,
  // which is reasonable in the browser. This is written like this so that
  // the DERBY global can be used to initialize templates and data.
  global.DERBY = derby;
  derby.createApp = createApp;
  derby.init = init;
}

function createApp(appModule) {
  if (derbyBrowser.created) {
    throw new Error('derby.createApp() called multiple times in the browser');
  } else {
    derbyBrowser.created = true;
  }

  var app = sharedCreateApp(this, appModule)
  global.DERBY.app = app;

  racer.once('model', function(model) {
    app.emit('model', model);
  });

  // Adds get, post, put, del, enter, and exit methods
  // as well as history to app
  tracks.setup(app, createPage, onRoute);

  onRenderError = function(err, url) {
    setTimeout(function() {
      window.location = url;
    }, 0);
    throw err;
  }

  function Page(app) {
    this.app = app;
    this.model = app.model;
    this.dom = app.dom;
    this.history = app.history;
    this._viewModels = [];
    this._routing = false;
  }
  Page.prototype.render = function(ns, ctx) {
    try {
      if (typeof ns === 'object') {
        ctx = ns;
        ns = '';
      }
      ctx || (ctx = {});
      ctx.$url = this.params.url;
      app.view.render(this.model, ns, ctx);
      this._routing = false;
      tracks.render(this, {
        url: this.params.url
      , previous: this.params.previous
      , method: 'enter'
      , noNavigate: true
      });
    } catch (err) {
      onRenderError(err, this.params.url);
    }
  };
  Page.prototype.init = viewModel.pageInit;

  function createPage() {
    return new Page(app);
  }
  function onRoute(callback, page, params, next, isTransitional, done) {
    if (!app._initialized) return;
    try {
      if (isTransitional) {
        if (callback.length === 4) {
          callback(page.model, params, next, done);
          return true;
        } else {
          callback(page.model, params, next);
          return;
        }
      }

      if (params.method === 'enter' || params.method === 'exit') {
        callback.call(app, page.model, params);
        next();
        return;
      }

      if (!page._routing) {
        tracks.render(page, {
          url: page.params.previous
        , method: 'exit'
        , noNavigate: true
        });
        app.view._beforeRoute();
      }
      page._routing = true;
      callback(page, page.model, params, next);
    } catch (err) {
      onRenderError(err, page.params.url);
    }
  }

  app.ready = function(fn) {
    if (app._initialized) return fn.call(app.page, app.model);
    app.once('ready', function() {
      fn.call(app.page, app.model);
    });
  };
  return app;
}

function init(modelBundle, ctx) {
  var app = global.DERBY.app
    , ns = ctx.$ns
    , renderHash = ctx.$renderHash
    , derby = this

  // The ready event is fired after the model data is initialized
  racer.ready(function(model) {
    var dom = new Dom(model);

    app.model = model;
    app.dom = dom;

    // Calling history.page() creates the initial page, which is only
    // created one time on the client
    // TODO: This is a rather obtuse mechanism
    var page = app.history.page();
    app.page = page;
    page.model = model;
    page.dom = dom;

    // Reinitialize any viewModels which were already initialized
    // during rendering on the server
    if (ctx.$viewModels) {
      for (var i = 0; i < ctx.$viewModels.length; i++) {
        var item = ctx.$viewModels[i];
        var viewModel = app._viewModels[item[0]];
        item[1].unshift(page);
        viewModel.init.apply(viewModel, item[1]);
      }
    }

    derbyModel.init(derby, app);
    // Catch errors thrown when rendering and then throw from a setTimeout.
    // This way, the remaining init code can run and the app still connects
    try {
      // Render immediately upon initialization so that the page is in
      // EXACTLY the same state it was when rendered on the server
      app.view.render(model, ns, ctx, renderHash);
    } catch (err) {
      setTimeout(function() {
        throw err;
      }, 0);
    }
    app._initialized = true;

    app.emit('ready');

    tracks.render(app.history.page(), {
      url: (window.location.pathname.slice(window.location.pathname.indexOf('index.html') + 10) + '/') + window.location.search
    , method: 'enter'
    , noNavigate: true
    });

    // Delaying here to make sure that all ready callbacks are called before
    // the create functions run on various components
    setTimeout(function() {
      app.view._afterRender(ns, ctx);
    }, 0);

    if (ctx.$scriptPath) {
      model.channel.send('derby:app', ctx.$scriptPath);
      refresh.autoRefresh(app.view, model);
    }
  });
  racer.init(modelBundle);
}

})(window)
},{"racer":"eS5xJL","./app":18,"./derby.Model":19,"./Dom":20,"./viewModel":21,"./refresh":22,"tracks":23}],18:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;
var racer = require('racer');
var component = require('./component');
var View = require('./View');
var viewModel = require('./viewModel');
var isServer = racer.util.isServer;
var paths = require('./paths');

exports.create = createApp;

function createApp(derby, appModule) {
  var app = racer.util.mergeInto(appModule.exports, EventEmitter.prototype)

  app.use = racer.util.use;
  component(app);
  app.filename = appModule.filename;
  app.view = new View(app._libraries, app, appModule.filename);
  app.fn = appFn;

  function appFn(value, fn) {
    if (typeof value === 'string') {
      // Don't bind the function on the server, since each
      // render gets passed a new model as part of the app
      paths.pathMerge(app, value, fn, bindPage);
    } else {
      paths.treeMerge(app, value, bindPage);
    }
    return app;
  }

  if (!isServer) {
    var bindPage = function(fn) {
      return function() {
        return fn.apply(app.page, arguments);
      };
    };
  }

  app._viewModels = {};
  app.viewModel = viewModel.construct.bind(app);

  return app;
}

},{"events":11,"racer":"eS5xJL","./component":24,"./View":25,"./viewModel":21,"./paths":26}],21:[function(require,module,exports){
var paths = require('./paths');

module.exports = {
  construct: construct
};

function ViewModel(name, proto) {
  this.name = name;
  this.proto = proto;
}
ViewModel.prototype.init = function(page) {
  var args = Array.prototype.slice.call(arguments, 1);
  // ViewModels are actually just scoped models for now
  var _super = page.model.at(this.name);
  var viewModel = _super._child();

  // Mixin viewModel specific methods
  viewModel._super = _super;
  viewModel.page = page;
  viewModel.model = page.model;
  for (key in this.proto) {
    if (key === 'init') continue;
    viewModel[key] = this.proto[key].bind(viewModel);
  }
  if (this.proto.init) {
    // Keep track of viewModels that were created so that
    // they can be recreated on the client if first rendered
    // on the server
    page._viewModels.push([this.name, args]);
    this.proto.init.apply(viewModel, args);
  }

  // Make viewModel available on the page for use in
  // event callbacks and other functions
  var segments = this.name.split('.');
  var last = segments.pop();
  var node = paths.traverseNode(page, segments);
  node[last] = viewModel;

  return viewModel;
}

function construct(name, proto) {
  // Keep a map of defined viewModels so that they can
  // be reinitialized from their name on the client
  var viewModel = this._viewModels[name] = new ViewModel(name, proto);
  return viewModel;
}

},{"./paths":26}],19:[function(require,module,exports){
(function(){var EventDispatcher = require('./EventDispatcher')
var PathMap = require('./PathMap')
var Model = require('racer').Model
var valueBinding = require('./View').valueBinding
var arraySlice = [].slice;

exports.init = init;

// Add support for creating a model alias from a DOM node or jQuery object
Model.prototype.__at = Model.prototype.at;
Model.prototype.at = function(node) {
  var isNode = node && (node.parentNode || node.jquery && (node = node[0]));
  if (!isNode) return this.__at(node);

  updateMarkers();

  var blockPaths = this.root.__blockPaths
    , pathMap = this.root.__pathMap
    , child, i, id, last, path, blockPath, children, len;
  while (node) {
    if (node.$derbyMarkerParent && last) {
      node = last;
      while (node = node.previousSibling) {
        if (!(id = node.$derbyMarkerId)) continue;
        blockPath = blockPaths[id];
        if (node.$derbyMarkerEnd || !blockPath) break;

        path = pathMap.paths[blockPath.id];
        if ((blockPath.type === 'each') && last) {
          i = 0;
          while (node = node.nextSibling) {
            if (node === last) {
              path = path + '.' + i;
              break;
            }
            i++;
          }
        }
        return this.scope(path);
      }
      last = last.parentNode;
      node = last.parentNode;
      continue;
    }
    if ((id = node.id) && (blockPath = blockPaths[id])) {
      path = pathMap.paths[blockPath.id];
      if ((blockPath.type === 'each') && last) {
        children = node.childNodes;
        for (i = 0, len = children.length; i < len; i++) {
          child = children[i];
          if (child === last) {
            path = path + '.' + i;
            break;
          }
        }
      }
      return this.scope(path);
    }
    last = node;
    node = node.parentNode;
  }

  // Just return the root scope if a path can't be found
  return this.scope();
}

function updateMarkers() {
  // NodeFilter.SHOW_COMMENT == 128
  var commentIterator = document.createTreeWalker(document.body, 128, null, false)
    , comment, id;
  while (comment = commentIterator.nextNode()) {
    if (comment.$derbyChecked) continue;
    comment.$derbyChecked = true;
    id = comment.data;
    if (id.charAt(0) !== '$') continue;
    if (id.charAt(1) === '$') {
      comment.$derbyMarkerEnd = true;
      id = id.slice(1);
    }
    comment.$derbyMarkerId = id;
    comment.parentNode.$derbyMarkerParent = true;
  }
}

function init(derby, app) {
  var model = app.model;
  var dom = app.dom;
  var pathMap = model.__pathMap = new PathMap;
  var events = model.__events = new EventDispatcher({
    onTrigger: derbyModelTrigger
  , onCleanup: derbyModelEventsCleanup
  });

  function derbyModelEventsCleanup(pathId, listener) {
    var id = listener[0];
    return !dom.item(id);
  }

  function derbyModelTrigger(pathId, listener, type, pass, value, index, arg) {
    var id = listener[0]
      , el = dom.item(id);

    // Ignore if the element can't be found, and cleanup after some delay
    if (!el) return events.delayedCleanup(pathId);

    var method = listener[1]
      , property = listener[2]
      , partial = listener.partial
      , path = pathMap.paths[pathId]
      , triggerId;

    // Handle text OT events
    if (type === 'stringInsert' || type === 'stringRemove') {
      if (method !== 'propOt' || el === pass.$el) return;
      method = type;
    }
    // Ignore side-effect change events that were already handled
    if (method === 'propOt' && (pass.$original === 'stringInsert' || pass.$original === 'stringRemove')) return;

    if (partial) {
      triggerId = id;
      if (method === 'html' && type) {
        if (partial.type === 'each') {
          // Handle array updates
          method = type;
          if (type === 'insert') {
            triggerId = null;
          } else if (type === 'remove') {
            partial = null;
          } else if (type === 'move') {
            partial = null;
          }
        } else {
          value = model.get(path);
        }
      }
    }
    if (listener.getValue) {
      value = listener.getValue(model, path);
    }
    if (partial) {
      // TODO Get rid of model.__fnCtx cache
      // Was causing issues with not emitting "init:child" or "create:child"
      // when dynamically rendering a component inside a parent component
      // within an each block.
      delete model.__fnCtx;

      if (method === 'insert') {
        var values = value;
        value = '';
        for (var i = 0, len = values.length; i < len; i++) {
          value += partial(listener.ctx, model, triggerId, values[i], index + i, listener) || '<!--empty-->';
        }
      } else {
        value = partial(listener.ctx, model, triggerId, value, index, listener);
      }
    }
    value = valueBinding(value);
    dom.update(el, method, pass.ignore, value, property, index, arg);
    // HACK: Use of global
    DERBY.app.view._flushUncreated();
  }

  var types = Object.keys(Model.MUTATOR_EVENTS);
  types.push('all');
  types.forEach(function(type) {
    var beforeType = 'beforeBinding:' + type;
    model.on(type, function(segments, eventArgs) {
      model.emit(beforeType, segments, eventArgs);
    });
  });

  model.on('change', '**', function derbyOnChange(path, value, previous, pass) {
    // For set operations on array items, also emit a remove and insert in case the
    // array is bound
    if (/\.\d+$/.test(path)) {
      var i = path.lastIndexOf('.');
      var arrayPath = path.slice(0, i);
      var index = +path.slice(i + 1);
      triggerEach(arrayPath, 'remove', pass, index);
      triggerEach(arrayPath, 'insert', pass, [value], index);
    }
    triggerEach(path, 'html', pass, value);
  });

  model.on('load', '**', function derbyOnLoad(path, value, pass) {
    triggerEach(path, 'html', pass, value);
  });

  model.on('unload', '**', function derbyOnLoad(path, previous, pass) {
    triggerEach(path, 'html', pass, void 0);
  });

  model.on('insert', '**', function derbyOnInsert(path, index, values, pass) {
    pathMap.onInsert(path, index, values.length);
    triggerEach(path, 'insert', pass, values, index);
  });

  model.on('remove', '**', function derbyOnRemove(path, index, removed, pass) {
    var howMany = removed.length;
    var end = index + howMany;
    pathMap.onRemove(path, index, howMany);

    for (var i = index; i < end; i++) {
      var id = pathMap.ids[path];
      if (id) events.trigger(id, 'remove', pass, index);
    }
    triggerParents(path, pass);
  });

  model.on('move', '**', function derbyOnMove(path, from, to, howMany, pass) {
    pathMap.onMove(path, from, to, howMany);
    triggerEach(path, 'move', pass, from, to, howMany);
  });

  model.on('stringInsert', '**', function derbyOnStringInsert(path, index, inserted, pass) {
    var value = model.get(path);
    var id = pathMap.ids[path];
    events.trigger(id, 'stringInsert', pass, value, index, inserted);
  });

  model.on('stringRemove', '**', function derbyOnStringRemove(path, index, howMany, pass) {
    var value = model.get(path);
    var id = pathMap.ids[path];
    events.trigger(id, 'stringRemove', pass, value, index, howMany);
  });

  function triggerEach(path, type, pass, arg0, arg1, arg2) {
    // Trigger an event on the path if it has a pathMap ID
    var id = pathMap.ids[path];
    if (id) events.trigger(id, type, pass, arg0, arg1, arg2);
    // Trigger a pattern event for the path and each of its parent paths
    // This is used by view helper functions to match updates on a path
    // or any of its child segments
    triggerParents(path, pass);
  }

  function triggerParents(path, pass) {
    var segments = path.split('.');
    for (var i = 1, len = segments.length; i <= len; i++) {
      var pattern = segments.slice(0, i).join('.') + '*';
      var id = pathMap.ids[pattern];
      if (id) events.trigger(id, null, pass);
    }
  }

  return model;
}

})()
},{"racer":"eS5xJL","./EventDispatcher":27,"./PathMap":28,"./View":25}],13:[function(require,module,exports){
(function(__dirname){module.exports = require('./Model');
var util = require('../util');

// Extend model on both server and client //
require('./events');
require('./paths');
require('./collections');
require('./mutators');
require('./setDiff');

require('./connection');
require('./subscriptions');
require('./Query');
require('./contexts');

require('./fn');
require('./filter');
require('./refList');
require('./ref');

// Extend model for server //
util.serverRequire(__dirname + '/bundle');
util.serverRequire(__dirname + '/connection.server');

})("/node_modules/derby/node_modules/racer/lib/Model")
},{"./Model":29,"../util":12,"./events":30,"./paths":31,"./collections":32,"./mutators":33,"./setDiff":34,"./connection":35,"./subscriptions":36,"./Query":37,"./contexts":38,"./fn":39,"./filter":40,"./refList":41,"./ref":42}],26:[function(require,module,exports){
module.exports = {
  traverseNode: traverseNode
, pathMerge: pathMerge
, treeMerge: treeMerge
};

function traverseNode(node, segments) {
  var i, len, segment
  for (i = 0, len = segments.length; i < len; i++) {
    segment = segments[i];
    node = node[segment] || (node[segment] = {});
  }
  return node;
}

// Recursively set nested objects based on a path
function pathMerge(node, path, value, nodeFn) {
  var segments = path.split('.')
    , last, i, len, segment
  if (typeof value === 'object') {
    node = traverseNode(node, segments);
    treeMerge(node, value, nodeFn);
    return;
  }
  last = segments.pop();
  node = traverseNode(node, segments);
  node[last] = (nodeFn) ? nodeFn(value) : value;
}

// Recursively set objects such that the non-objects are
// merged with the corresponding structure of the base node
function treeMerge(node, tree, nodeFn) {
  var key, child, value
  for (key in tree) {
    value = tree[key];
    if (typeof value === 'object') {
      child = node[key] || (node[key] = {});
      treeMerge(child, value, nodeFn);
      continue;
    }
    node[key] = (nodeFn) ? nodeFn(value) : value;
  }
}

},{}],27:[function(require,module,exports){
function empty() {}
function EventDispatcherNames() {}
function EventDispatcherListeners() {}
function CleanupPendingMap() {}

module.exports = EventDispatcher;

function EventDispatcher(options) {
  this._onTrigger = options && options.onTrigger || empty;
  this._onBind = options && options.onBind || empty;
  this._onCleanup = options && options.onCleanup;
  this._cleanupPending = new CleanupPendingMap();
  this.clear();
}

EventDispatcher.prototype.clear = function() {
  this.names = new EventDispatcherNames();
};

EventDispatcher.prototype.bind = function(name, listener, arg0) {
  this._onBind(name, listener, arg0);
  var obj = this.names[name] || (this.names[name] = new EventDispatcherListeners());
  obj[JSON.stringify(listener)] = listener;
  return obj;
};

EventDispatcher.prototype.trigger = function(name, value, arg0, arg1, arg2, arg3, arg4, arg5) {
  if (!name) return;
  var listeners = this.names[name];
  var onTrigger = this._onTrigger;
  var count = 0;
  var key, listener;
  for (key in listeners) {
    listener = listeners[key];
    count++;
    if (false !== onTrigger(name, listener, value, arg0, arg1, arg2, arg3, arg4, arg5)) {
      continue;
    }
    delete listeners[key];
    count--;
  }
  if (!count) delete this.names[name];
  return count;
};

EventDispatcher.prototype.delayedCleanup = function(name) {
  if (this._cleanupPending[name]) return;
  this._cleanupPending[name] = true;
  var eventDispatcher = this;
  setTimeout(function() {
    delete eventDispatcher._cleanupPending[name];
    eventDispatcher.cleanup(name);
  }, 0);
};

EventDispatcher.prototype.cleanup = function(name) {
  var listeners = this.names[name];
  var hasKeys = false;
  var key, remove;
  for (key in listeners) {
    remove = this._onCleanup(name, listeners[key]);
    if (remove) {
      delete listeners[key];
    } else {
      hasKeys = true;
    }
  }
  if (!hasKeys) delete this.names[name];
};

},{}],16:[function(require,module,exports){
(function(__filename){var config = {
  filename: __filename,
  ns: 'ghbtns',
  scripts: {
    button: require('./button')
  }
};

module.exports = function(app, options) {
  app.createLibrary(config, options);
}
})("/node_modules/derby-ui-github-buttons/index.js")
},{"./button":43}],28:[function(require,module,exports){
module.exports = PathMap;

function PathMap() {
  this.clear();
  this.count = 0;
}

PathMap.prototype.clear = function() {
  this.ids = {};
  this.paths = {};
  this.arrays = {};
};

PathMap.prototype.id = function(path) {
  // Return the path for an id, or create a new id and index it
  var id = this.ids[path];
  if (id) return id;
  id = (++this.count).toString();
  this.paths[id] = path;
  this._indexArray(path, id);
  this.ids[path] = id;
  return id;
};

PathMap.prototype._indexArray = function(path, id) {
  var arr, index, match, nested, remainder, set, setArrays;
  while (match = /^(.+)\.(\d+)(\*?(?:\..+|$))/.exec(path)) {
    path = match[1];
    index = +match[2];
    remainder = match[3];
    arr = this.arrays[path] || (this.arrays[path] = []);
    set = arr[index] || (arr[index] = {});
    if (nested) {
      setArrays = set.arrays || (set.arrays = {});
      setArrays[remainder] = true;
    } else {
      set[id] = remainder;
    }
    nested = true;
  }
};

PathMap.prototype._incrItems = function(path, map, start, end, byNum, oldArrays, oldPath) {
  var arrayMap, arrayPath, arrayPathTo, i, id, ids, itemPath, remainder;
  if (oldArrays == null) oldArrays = {};

  for (i = start; i < end; i++) {
    ids = map[i];
    if (!ids) continue;

    for (id in ids) {
      remainder = ids[id];
      if (id === 'arrays') {
        for (remainder in ids[id]) {
          arrayPath = (oldPath || path) + '.' + i + remainder;
          arrayMap = oldArrays[arrayPath] || this.arrays[arrayPath];
          if (arrayMap) {
            arrayPathTo = path + '.' + (i + byNum) + remainder;
            this.arrays[arrayPathTo] = arrayMap;
            this._incrItems(arrayPathTo, arrayMap, 0, arrayMap.length, 0, oldArrays, arrayPath);
          }
        }
        continue;
      }

      itemPath = path + '.' + (i + byNum) + remainder;
      this.paths[id] = itemPath;
      this.ids[itemPath] = +id;
    }
  }
};

PathMap.prototype._delItems = function(path, map, start, end, len, oldArrays) {
  var arrayLen, arrayMap, arrayPath, i, id, ids, itemPath, remainder;
  if (oldArrays == null) oldArrays = {};

  for (i = start; i < len; i++) {
    ids = map[i];
    if (!ids) continue;

    for (id in ids) {
      if (id === 'arrays') {
        for (remainder in ids[id]) {
          arrayPath = path + '.' + i + remainder;
          if (arrayMap = this.arrays[arrayPath]) {
            arrayLen = arrayMap.length;
            this._delItems(arrayPath, arrayMap, 0, arrayLen, arrayLen, oldArrays);
            oldArrays[arrayPath] = arrayMap;
            delete this.arrays[arrayPath];
          }
        }
        continue;
      }

      itemPath = this.paths[id];
      delete this.ids[itemPath];
      if (i > end) continue;
      delete this.paths[id];
    }
  }

  return oldArrays;
};

PathMap.prototype.onRemove = function(path, start, howMany) {
  var map = this.arrays[path]
    , end, len, oldArrays;
  if (!map) return;
  end = start + howMany;
  len = map.length;
  // Delete indicies for removed items
  oldArrays = this._delItems(path, map, start, end + 1, len);
  // Decrement indicies of later items
  this._incrItems(path, map, end, len, -howMany, oldArrays);
  map.splice(start, howMany);
};

PathMap.prototype.onInsert = function(path, start, howMany) {
  var map = this.arrays[path]
    , end, len, oldArrays;
  if (!map) return;
  end = start + howMany;
  len = map.length;
  // Delete indicies for items in inserted positions
  oldArrays = this._delItems(path, map, start, end + 1, len);
  // Increment indicies of later items
  this._incrItems(path, map, start, len, howMany, oldArrays);
  while (howMany--) {
    map.splice(start, 0, {});
  }
};

PathMap.prototype.onMove = function(path, from, to, howMany) {
  var map = this.arrays[path]
    , afterFrom, afterTo, items, oldArrays;
  if (!map) return;
  afterFrom = from + howMany;
  afterTo = to + howMany;
  // Adjust paths for items between from and to
  if (from > to) {
    oldArrays = this._delItems(path, map, to, afterFrom, afterFrom);
    this._incrItems(path, map, to, from, howMany, oldArrays);
  } else {
    oldArrays = this._delItems(path, map, from, afterTo, afterTo);
    this._incrItems(path, map, afterFrom, afterTo, -howMany, oldArrays);
  }
  // Adjust paths for the moved item(s)
  this._incrItems(path, map, from, afterFrom, to - from, oldArrays);
  // Fix the array index
  items = map.splice(from, howMany);
  map.splice.apply(map, [to, 0].concat(items));
};

},{}],44:[function(require,module,exports){
module.exports = {
  onStringInsert: onStringInsert
, onStringRemove: onStringRemove
, onTextInput: onTextInput
};

function onStringInsert(el, previous, index, text) {
  function transformCursor(cursor) {
    return (index < cursor) ? cursor + text.length : cursor;
  }
  var newText = previous.slice(0, index) + text + previous.slice(index);
  replaceText(el, newText, transformCursor);
}

function onStringRemove(el, previous, index, howMany) {
  function transformCursor(cursor) {
    return (index < cursor) ? cursor - Math.min(howMany, cursor - index) : cursor;
  }
  var newText = previous.slice(0, index) + previous.slice(index + howMany);
  replaceText(el, newText, transformCursor);
}

function replaceText(el, newText, transformCursor) {
  var selectionStart = transformCursor(el.selectionStart);
  var selectionEnd = transformCursor(el.selectionEnd);

  var scrollTop = el.scrollTop;
  el.value = newText;
  if (el.scrollTop !== scrollTop) {
    el.scrollTop = scrollTop;
  }
  if (document.activeElement === el) {
    el.selectionStart = selectionStart;
    el.selectionEnd = selectionEnd;
  }
}

function onTextInput(model, path, value) {
  var previous = model.get(path) || '';
  if (previous === value) return;
  var start = 0;
  while (previous.charAt(start) == value.charAt(start)) {
    start++;
  }
  var end = 0;
  while (
    previous.charAt(previous.length - 1 - end) === value.charAt(value.length - 1 - end) &&
    end + start < previous.length &&
    end + start < value.length
  ) {
    end++;
  }

  if (previous.length !== start + end) {
    var howMany = previous.length - start - end;
    model.stringRemove(path, start, howMany);
  }
  if (value.length !== start + end) {
    var inserted = value.slice(start, value.length - end);
    model.stringInsert(path, start, inserted);
  }
}

},{}],45:[function(require,module,exports){
(function(process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

})(require("__browserify_process"))
},{"__browserify_process":10}],12:[function(require,module,exports){
(function(process){var deepIs = require('deep-is');

var isServer = process.title !== 'browser';
var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  isServer: isServer
, isProduction: isProduction

, asyncGroup: asyncGroup
, contains: contains
, copyObject: copyObject
, deepCopy: deepCopy
, deepEqual: deepIs
, equal: equal
, equalsNaN: equalsNaN
, lookup: lookup
, mergeInto: mergeInto
, mayImpact: mayImpact
, mayImpactAny: mayImpactAny
, serverRequire: serverRequire
, use: use
};

function asyncGroup(cb) {
  var group = new AsyncGroup(cb);
  return function asyncGroupAdd() {
    return group.add();
  };
}

/**
 * @constructor
 * @param {Function} cb(err)
 */
function AsyncGroup(cb) {
  this.cb = cb;
  this.isDone = false;
  this.count = 0;
}
AsyncGroup.prototype.add = function() {
  this.count++;
  var self = this;
  return function(err) {
    self.count--;
    if (self.isDone) return;
    if (err) {
      self.isDone = true;
      self.cb(err);
      return;
    }
    if (self.count > 0) return;
    self.isDone = true;
    self.cb();
  };
};

function contains(segments, testSegments) {
  for (var i = 0; i < segments.length; i++) {
    if (segments[i] !== testSegments[i]) return false;
  }
  return true;
}

function copyObject(object) {
  var out = new object.constructor;
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      out[key] = object[key];
    }
  }
  return out;
}

function deepCopy(value) {
  if (value instanceof Date) return new Date(value);
  if (typeof value === 'object') {
    if (value === null) return null;
    var copy;
    if (Array.isArray(value)) {
      copy = [];
      for (var i = value.length; i--;) {
        copy[i] = deepCopy(value[i]);
      }
      return copy;
    }
    copy = new value.constructor;
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        copy[key] = deepCopy(value[key]);
      }
    }
    return copy;
  }
  return value;
}

function equal(a, b) {
  return (a === b) || (equalsNaN(a) && equalsNaN(b));
}

function equalsNaN(x) {
  return x !== x;
}

function lookup(segments, value) {
  if (!segments) return value;

  for (var i = 0, len = segments.length; i < len; i++) {
    if (value == null) return value;
    value = value[segments[i]];
  }
  return value;
}

function mayImpactAny(segmentsList, testSegments) {
  for (var i = 0, len = segmentsList.length; i < len; i++) {
    if (mayImpact(segmentsList[i], testSegments)) return true;
  }
  return false;
}

function mayImpact(segments, testSegments) {
  var len = Math.min(segments.length, testSegments.length);
  for (var i = 0; i < len; i++) {
    if (segments[i] !== testSegments[i]) return false;
  }
  return true;
}

function mergeInto(to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to;
}

function serverRequire(name) {
  if (!isServer) return;
  // Tricks Browserify into not logging a warning
  var _require = require;
  return _require(name);
}

function use(plugin, options) {
  // Server-side plugins may be included via filename
  if (typeof plugin === 'string') {
    if (!isServer) return this;
    plugin = serverRequire(plugin);
  }

  // Don't include a plugin more than once
  var plugins = this._plugins || (this._plugins = []);
  if (plugins.indexOf(plugin) === -1) {
    plugins.push(plugin);
    plugin(this, options);
  }
  return this;
}

})(require("__browserify_process"))
},{"deep-is":46,"__browserify_process":10}],43:[function(require,module,exports){
var url = require('url');

exports.init = function (model) {
  var filename = model.get('filename') || 'github-btn.html'
    , fileurl = model.get('fileurl')
    , domain = model.get('domain') || 'ghbtns.com'
    , giturl = model.get('giturl')
    , height = model.get('height')
    , protocol = model.get('secure') ? 'https' : 'http'
    , repo = model.get('repo')
    , size = model.get('size')
    , type = model.get('type')
    , user = model.get('user');

  if (!giturl && (!user || !repo)) {
    return console.error('ghbtns:button: giturl or user/repo required');
  }

  if (!type) {
    return console.error('ghbtns:button: type required');
  }

  if (!fileurl) {
    model.set('fileurl', protocol + '://' + domain + '/' + filename);
  }

  if (giturl) {
    var gitpath = url.parse(giturl).path.split('/');
    model.set('repo', gitpath[2].slice(0, -4));
    model.set('user', gitpath[1]);
  }

  if (!height) {
    model.set('height', size === 'large' ? '30' : '20');
  }

  model.set('show', true);
};
},{"url":47}],24:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter
  , path = require('path')
  , util = require('racer').util
  , View = require('./View')
  , arraySlice = Array.prototype.slice

module.exports = componentPlugin;

function componentPlugin(app) {
  app._libraries = [];
  app._libraries.map = {};
  app.createLibrary = createLibrary;
}

function ComponentProto() {}
util.mergeInto(ComponentProto.prototype, EventEmitter.prototype);

ComponentProto.prototype.emitCancellable = function() {
  var cancelled = false
    , args = arraySlice.call(arguments)

  function cancel() {
    cancelled = true;
  }

  args.push(cancel);
  this.emit.apply(this, args);
  return cancelled;
};

ComponentProto.prototype.emitDelayable = function() {
  var delayed = false
    , args = arraySlice.call(arguments, 0, -1)
    , callback = arguments[arguments.length - 1]

  function delay() {
    delayed = true;
  }

  args.push(delay, callback);
  this.emit.apply(this, args);
  if (!delayed) callback();
  return delayed;
};

function createLibrary(config, options) {
  if (!config || !config.filename) {
    throw new Error ('Configuration argument with a filename is required');
  }
  if (!options) options = {};
  var root = path.dirname(config.filename);
  var ns = options.ns || config.ns || path.basename(root);
  var scripts = config.scripts || {};
  var view = new View;
  var constructors = {};
  var library = {
    ns: ns
  , root: root
  , view: view
  , constructors: constructors
  , styles: config.styles
  };

  view.parent = this;
  view._selfNs = 'lib';
  view._selfLibrary = library;

  for (var name in scripts) {
    var script = scripts[name];
    script.setup && script.setup(library);

    var Component = function(model, scope) {
      this.view = view;
      this.model = model;
      this.scope = scope;
      this.history = null;
      this.dom = null;

      // Don't limit the number of listeners
      this.setMaxListeners(0);

      var component = this;
      model.__on = model._on;
      model._on = function(name, listener) {
        component.on('destroy', function() {
          model.removeListener(name, listener);
        })
        return model.__on(name, listener);
      };
      component.on('destroy', function() {
        model.silent().del();
      });
    }
    var proto = Component.prototype = new ComponentProto();
    util.mergeInto(proto, script);

    Component.view = view;
    Component.ns = Component.prototype.ns = ns;
    Component.name = Component.prototype.name = name;

    // Note that component names are all lowercased
    constructors[name.toLowerCase()] = Component;
  }

  var replaced = false;
  for (var i = this._libraries.length; i--;) {
    if (this._libraries[i].ns === ns) {
      this._libraries[i] = library;
      replaced = true;
    }
  }
  if (!replaced) {
    this._libraries.push(library);
  }
  this._libraries.map[ns] = library;
  return library;
}

},{"events":11,"path":45,"racer":"eS5xJL","./View":25}],22:[function(require,module,exports){
var escapeHtml = require('html-util').escapeHtml
  , errors = {};

exports.errorHtml = errorHtml;
exports.autoRefresh = autoRefresh;

function errorHtml(errors) {
  var text = ''
    , type, err;
  for (type in errors) {
    err = errors[type];
    text += '<h3>' + escapeHtml(type) + ' Error</h3><pre>' + escapeHtml(err) + '</pre>';
  }
  if (!text) return;
  return '<div id=$_derbyError style="position:absolute;background:rgba(0,0,0,.7);top:0;left:0;right:0;bottom:0;text-align:center">' +
    '<div style="background:#fff;padding:20px 40px;margin:60px;display:inline-block;text-align:left">' +
    text + '</div></div>';
}

function autoRefresh(view, model) {

  model.channel.on('derby:reload', reloadOnReady);
  // Wait to reload until the server is responsive again after restarting
  function reloadOnReady() {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        return window.location.reload(true);
      }
      reloadOnReady();
    };
    xhr.open('GET', window.location.href);
    xhr.send();
  }

  model.channel.on('derby:refreshCss', function(data) {
    var el = document.getElementById('$_css');
    if (el) el.innerHTML = data.css;
    updateError('CSS', data.errText);
  });

  model.channel.on('derby:refreshHtml', function(data) {
    view._makeAll(data.templates, data.instances);
    view._makeComponents(data.libraryData);
    var errText = data.errText;
    try {
      view.app.history.refresh();
    } catch (err) {
      errText || (errText = err.stack);
    }
    updateError('Template', data.errText);
  });
}

function updateError(type, err) {
  if (err) {
    errors[type] = err;
  } else {
    delete errors[type];
  }
  var el = document.getElementById('$_derbyError')
    , html = errorHtml(errors)
    , fragment, range;
  if (html) {
    if (el) {
      el.outerHTML = html;
    } else {
      range = document.createRange();
      range.selectNode(document.body);
      fragment = range.createContextualFragment(html);
      document.body.appendChild(fragment);
    }
  } else {
    if (el) el.parentNode.removeChild(el);
  }
}

},{"html-util":48}],23:[function(require,module,exports){
var Route = require('../vendor/express/router/route')
var History = require('./History')
var router = module.exports = require('./router')
var compose = require('./compose')

router.setup = setup

function setup(app, createPage, onRoute) {
  var routes = {
    queue: {}
  , transitional: {}
  , onRoute: onRoute
  }
  app.history = new History(createPage, routes)

  ;['get', 'post', 'put', 'del', 'enter', 'exit'].forEach(function(method) {
    var queue = routes.queue[method] = []
    var transitional = routes.transitional[method] = []
    var transitionalCalls = []

    app[method] = function(pattern, callback) {
      if (Array.isArray(pattern)) {
        pattern.forEach(function(item) {
          app[method](item, callback)
        })
        return app
      }

      if (router.isTransitional(pattern)) {
        var from = pattern.from
        var to = pattern.to
        var forward = pattern.forward || (callback && callback.forward) || callback
        var back = pattern.back || (callback && callback.back)
        transitionalCalls.push({
          from: from
        , to: to
        , forward: forward
        , back: back
        })

        var fromRoute = new Route(method, from, back)
        var toRoute = new Route(method, to, forward)
        fromRoute.isTransitional = true
        toRoute.isTransitional = true
        transitional.push({
          from: fromRoute
        , to: toRoute
        })
        if (back) transitional.push({
          from: toRoute
        , to: fromRoute
        })

        compose.transition(app[method], transitionalCalls, from, to, forward, back)
        return app
      }

      queue.push(new Route(method, pattern, callback))
      return app
    }
  })
}

},{"../vendor/express/router/route":49,"./History":50,"./router":51,"./compose":52}],46:[function(require,module,exports){
var pSlice = Array.prototype.slice;
var Object_keys = typeof Object.keys === 'function'
    ? Object.keys
    : function (obj) {
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }
;

var deepEqual = module.exports = function (actual, expected) {
  // enforce Object.is +0 !== -0
  if (actual === 0 && expected === 0) {
    return areZerosEqual(actual, expected);

  // 7.1. All identical values are equivalent, as determined by ===.
  } else if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  } else if (isNumberNaN(actual)) {
    return isNumberNaN(expected);

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function isNumberNaN(value) {
  // NaN === NaN -> false
  return typeof value == 'number' && value !== value;
}

function areZerosEqual(zeroA, zeroB) {
  // (1 / +0|0) -> Infinity, but (1 / -0) -> -Infinity and (Infinity !== -Infinity)
  return (1 / zeroA) === (1 / zeroB);
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;

  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b);
  }
  try {
    var ka = Object_keys(a),
        kb = Object_keys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

},{}],30:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;
var util = require('../util');
var Model = require('./Model');

// This map determines which events get re-emitted as an 'all' event
Model.MUTATOR_EVENTS = {
  change: true
, insert: true
, remove: true
, move: true
, stringInsert: true
, stringRemove: true
, load: true
, unload: true
};

Model.INITS.push(function(model) {
  EventEmitter.call(this);

  // Set max listeners to unlimited
  model.setMaxListeners(0);

  // Used in async methods to emit an error event if a callback is not supplied.
  // This will throw if there is no handler for model.on('error')
  model.root._defaultCallback = defaultCallback;
  function defaultCallback(err) {
    if (typeof err === 'string') err = new Error(err);
    if (err) model.emit('error', err);
  }

  model.root._mutatorEventQueue = null;
  model._pass = new Passed({}, {});
});

util.mergeInto(Model.prototype, EventEmitter.prototype);

// EventEmitter.prototype.on, EventEmitter.prototype.addListener, and
// EventEmitter.prototype.once return `this`. The Model equivalents return
// the listener instead, since it is made internally for method subscriptions
// and may need to be passed to removeListener.

Model.prototype._emit = EventEmitter.prototype.emit;
Model.prototype.emit = function(type) {
  if (Model.MUTATOR_EVENTS[type]) {
    if (this._silent) return this;
    var segments = arguments[1];
    var eventArgs = arguments[2];
    if (this.root._mutatorEventQueue) {
      this.root._mutatorEventQueue.push([type, segments, eventArgs]);
      return this;
    }
    this.root._mutatorEventQueue = [];
    this._emit(type, segments, eventArgs);
    this._emit('all', segments, [type].concat(eventArgs));
    while (this.root._mutatorEventQueue.length) {
      var queued = this.root._mutatorEventQueue.shift();
      type = queued[0];
      segments = queued[1];
      eventArgs = queued[2];
      this._emit(type, segments, eventArgs);
      this._emit('all', segments, [type].concat(eventArgs));
    }
    this.root._mutatorEventQueue = null;
    return this;
  }
  return this._emit.apply(this, arguments);
};

Model.prototype._on = EventEmitter.prototype.on;
Model.prototype.addListener =
Model.prototype.on = function(type, pattern, cb) {
  var listener = eventListener(this, pattern, cb);
  this._on(type, listener);
  return listener;
};

Model.prototype.once = function(type, pattern, cb) {
  var listener = eventListener(this, pattern, cb);
  function g() {
    var matches = listener.apply(null, arguments);
    if (matches) this.removeListener(type, g);
  }
  this._on(type, g);
  return g;
};

Model.prototype._removeAllListeners = EventEmitter.prototype.removeAllListeners;
Model.prototype.removeAllListeners = function(type, subpattern) {
  if (!this._events) return this;

  // If a pattern is specified without an event type, remove all model event
  // listeners under that pattern for all events
  if (!type) {
    for (var key in this._events) {
      this.removeAllListeners(key, subpattern);
    }
    return this;
  }

  var pattern = this.path(subpattern);
  // If no pattern is specified, remove all listeners like normal
  if (!pattern) {
    if (arguments.length === 0) {
      return this._removeAllListeners();
    } else {
      return this._removeAllListeners(type);
    }
  }

  // Remove all listeners for an event under a pattern
  var listeners = this.listeners(type);
  var segments = pattern.split('.');
  // Make sure to iterate in reverse, since the array might be
  // mutated as listeners are removed
  for (var i = listeners.length; i--;) {
    var listener = listeners[i];
    if (patternContained(pattern, segments, listener)) {
      this.removeListener(type, listener);
    }
  }
};

function patternContained(pattern, segments, listener) {
  var listenerSegments = listener.patternSegments;
  if (!listenerSegments) return false;
  if (pattern === listener.pattern || pattern === '**') return true;
  var len = segments.length;
  if (len > listenerSegments.length) return false;
  for (var i = 0; i < len; i++) {
    if (segments[i] !== listenerSegments[i]) return false;
  }
  return true;
}

Model.prototype.pass = function(object, invert) {
  var model = this._child();
  model._pass = (invert) ?
    new Passed(object, this._pass) :
    new Passed(this._pass, object);
  return model;
};

function Passed(previous, value) {
  for (var key in previous) {
    this[key] = previous[key];
  }
  for (var key in value) {
    this[key] = value[key];
  }
}

/**
 * The returned Model will or won't trigger event handlers when the model emits
 * events, depending on `value`
 * @param {Boolean|Null} value defaults to true
 * @return {Model}
 */
Model.prototype.silent = function(value) {
  var model = this._child();
  model._silent = (value == null) ? true : value;
  return model;
};

function eventListener(model, subpattern, cb) {
  if (cb) {
    // For signatures:
    // model.on('change', 'example.subpath', callback)
    // model.at('example').on('change', 'subpath', callback)
    var pattern = model.path(subpattern);
    return modelEventListener(pattern, cb);
  }
  var path = model.path();
  cb = arguments[1];
  // For signature:
  // model.at('example').on('change', callback)
  if (path) return modelEventListener(path, cb);
  // For signature:
  // model.on('normalEvent', callback)
  return cb;
}

function modelEventListener(pattern, cb) {
  var patternSegments = pattern.split('.');
  var testFn = testPatternFn(pattern, patternSegments);

  function modelListener(segments, eventArgs) {
    var captures = testFn(segments);
    if (!captures) return;

    var args = (captures.length) ? captures.concat(eventArgs) : eventArgs;
    cb.apply(null, args);
    return true;
  }

  // Used in Model#removeAllListeners
  modelListener.pattern = pattern;
  modelListener.patternSegments = patternSegments;

  return modelListener;
}

function testPatternFn(pattern, patternSegments) {
  if (pattern === '**') {
    return function testPattern(segments) {
      return [segments.join('.')];
    };
  }

  var endingRest = stripRestWildcard(patternSegments);

  return function testPattern(segments) {
    // Any pattern with more segments does not match
    var patternLen = patternSegments.length;
    if (patternLen > segments.length) return;

    // A pattern with the same number of segments matches if each
    // of the segments are wildcards or equal. A shorter pattern matches
    // if it ends in a rest wildcard and each of the corresponding
    // segments are wildcards or equal.
    if (patternLen === segments.length || endingRest) {
      var captures = [];
      for (var i = 0; i < patternLen; i++) {
        var patternSegment = patternSegments[i];
        var segment = segments[i];
        if (patternSegment === '*' || patternSegment === '**') {
          captures.push(segment);
          continue;
        }
        if (patternSegment !== segment) return;
      }
      if (endingRest) {
        var remainder = segments.slice(i).join('.');
        captures.push(remainder);
      }
      return captures;
    }
  };
}

function stripRestWildcard(segments) {
  // ['example', '**'] -> ['example']; return true
  var lastIndex = segments.length - 1;
  if (segments[lastIndex] === '**') {
    segments.pop();
    return true;
  }
  // ['example', 'subpath**'] -> ['example', 'subpath']; return true
  var match = /^([^\*]+)\*\*$/.exec(segments[lastIndex]);
  if (!match) return false;
  segments[lastIndex] = match[1];
  return true;
}

},{"events":11,"../util":12,"./Model":29}],31:[function(require,module,exports){
var Model = require('./Model');

exports.mixin = {};

Model.prototype._splitPath = function(subpath) {
  var path = this.path(subpath);
  return (path && path.split('.')) || [];
};

/**
 * Returns the path equivalent to the path of the current scoped model plus
 * (optionally) a suffix subpath
 *
 * @optional @param {String} subpath
 * @return {String} absolute path
 * @api public
 */
Model.prototype.path = function(subpath) {
  if (subpath == null || subpath === '') return (this._at) ? this._at : '';
  if (typeof subpath === 'string' || typeof subpath === 'number') {
    return (this._at) ? this._at + '.' + subpath : '' + subpath;
  }
  if (typeof subpath.path === 'function') return subpath.path();
};

Model.prototype.isPath = function(subpath) {
  return this.path(subpath) != null;
};

Model.prototype.scope = function(path) {
  var model = this._child();
  model._at = path;
  return model;
};

/**
 * Create a model object scoped to a particular path.
 * Example:
 *     var user = model.at('users.1');
 *     user.set('username', 'brian');
 *     user.on('push', 'todos', function (todo) {
 *       // ...
 *     });
 *
 *  @param {String} segment
 *  @return {Model} a scoped model
 *  @api public
 */
Model.prototype.at = function(subpath) {
  var path = this.path(subpath);
  return this.scope(path);
};

/**
 * Returns a model scope that is a number of levels above the current scoped
 * path. Number of levels defaults to 1, so this method called without
 * arguments returns the model scope's parent model scope.
 *
 * @optional @param {Number} levels
 * @return {Model} a scoped model
 */
Model.prototype.parent = function(levels) {
  if (levels == null) levels = 1;
  var segments = this._splitPath();
  var len = Math.max(0, segments.length - levels);
  var path = segments.slice(0, len).join('.');
  return this.scope(path);
};

/**
 * Returns the last property segment of the current model scope path
 *
 * @optional @param {String} path
 * @return {String}
 */
Model.prototype.leaf = function(path) {
  if (!path) path = this.path();
  var i = path.lastIndexOf('.');
  return path.slice(i + 1);
};

},{"./Model":29}],32:[function(require,module,exports){
var Model = require('./Model');
var LocalDoc = require('./LocalDoc');
var util = require('../util');

function CollectionMap() {}
function ModelData() {}
function DocMap() {}
function CollectionData() {}

Model.INITS.push(function(model) {
  model.root.collections = new CollectionMap;
  model.root.data = new ModelData;
});

Model.prototype.getCollection = function(collectionName) {
  return this.root.collections[collectionName];
};
Model.prototype.getDoc = function(collectionName, id) {
  var collection = this.root.collections[collectionName];
  return collection && collection.docs[id];
};
Model.prototype.get = function(subpath) {
  var segments = this._splitPath(subpath);
  return this._get(segments);
};
Model.prototype._get = function(segments) {
  return util.lookup(segments, this.root.data);
};
Model.prototype.getOrCreateCollection = function(name) {
  var collection = this.root.collections[name];
  if (collection) return collection;
  var Doc = this._getDocConstructor(name);
  collection = new Collection(this.root, name, Doc);
  this.root.collections[name] = collection;
  return collection;
};
Model.prototype._getDocConstructor = function() {
  // Only create local documents. This is overriden in ./connection.js, so that
  // the RemoteDoc behavior can be selectively included
  return LocalDoc;
};

/**
 * Returns an existing document with id in a collection. If the document does
 * not exist, then creates the document with id in a collection and returns the
 * new document.
 * @param {String} collectionName
 * @param {String} id
 * @param {Object} [data] data to create if doc with id does not exist in collection
 */
Model.prototype.getOrCreateDoc = function(collectionName, id, data) {
  var collection = this.getOrCreateCollection(collectionName);
  return collection.docs[id] || collection.add(id, data);
};

/**
 * @param {String} collectionName
 */
Model.prototype.destroy = function(collectionName) {
  // TODO: non-collections
  var collection = this.getCollection(collectionName);
  collection && collection.destroy();
  this.removeAllRefs(collectionName);
  this.stopAll(collectionName);
  this.removeAllFilters(collectionName);
  this.removeAllListeners(null, collectionName);
};

function Collection(model, name, Doc) {
  this.model = model;
  this.name = name;
  this.Doc = Doc;
  this.docs = new DocMap();
  this.data = model.data[name] = new CollectionData();
}

/**
 * Adds a document with `id` and `data` to `this` Collection.
 * @param {String} id
 * @param {Object} data
 * @return {LocalDoc|RemoteDoc} doc
 */
Collection.prototype.add = function(id, data) {
  var doc = new this.Doc(this.model, this.name, id, data);
  this.docs[id] = doc;
  return doc;
};
Collection.prototype.destroy = function() {
  delete this.model.collections[this.name];
  delete this.model.data[this.name];
};

/**
 * Removes the document with `id` from `this` Collection. If there are no more
 * documents in the Collection after the given document is removed, then this
 * also destroys the Collection.
 * @param {String} id
 */
Collection.prototype.remove = function(id) {
  delete this.docs[id];
  delete this.data[id];
  if (noKeys(this.docs)) this.destroy();
};

/**
 * Returns an object that maps doc ids to fully resolved documents.
 * @return {Object}
 */
Collection.prototype.get = function() {
  return this.data;
};

function noKeys(object) {
  for (var key in object) {
    return false;
  }
  return true;
}

},{"./Model":29,"./LocalDoc":53,"../util":12}],33:[function(require,module,exports){
var util = require('../util');
var Model = require('./Model');

Model.prototype._mutate = function(segments, fn, cb) {
  if (!cb) cb = this.root._defaultCallback;
  var collectionName = segments[0];
  var id = segments[1];
  if (!collectionName || !id) {
    var message = fn.name + ' must be performed under a collection ' +
      'and document id. Invalid path: ' + segments.join('.');
    return cb(new Error(message));
  }
  var doc = this.getOrCreateDoc(collectionName, id);
  var docSegments = segments.slice(2);
  return fn(doc, docSegments, cb);
};

Model.prototype.set = function() {
  var subpath, value, cb;
  if (arguments.length === 1) {
    value = arguments[0];
  } else if (arguments.length === 2) {
    subpath = arguments[0];
    value = arguments[1];
  } else {
    subpath = arguments[0];
    value = arguments[1];
    cb = arguments[2];
  }
  var segments = this._splitPath(subpath);
  return this._set(segments, value, cb);
};
Model.prototype._set = function(segments, value, cb) {
  segments = this._dereference(segments);
  var model = this;
  function set(doc, docSegments, fnCb) {
    var previous = doc.set(docSegments, value, fnCb);
    model.emit('change', segments, [value, previous, model._pass]);
    return previous;
  }
  return this._mutate(segments, set, cb);
};

Model.prototype.setEach = function() {
  var subpath, object, cb;
  if (arguments.length === 1) {
    object = arguments[0];
  } else if (arguments.length === 2) {
    subpath = arguments[0];
    object = arguments[1];
  } else {
    subpath = arguments[0];
    object = arguments[1];
    cb = arguments[2];
  }
  var segments = this._splitPath(subpath);
  return this._setEach(segments, object, cb);
};
Model.prototype._setEach = function(segments, object, cb) {
  segments = this._dereference(segments);
  var group = util.asyncGroup(cb || this.root._defaultCallback);
  for (var key in object) {
    var value = object[key];
    this._set(segments.concat(key), value, group());
  }
};

Model.prototype.add = function() {
  var subpath, value, cb;
  if (arguments.length === 1) {
    value = arguments[0];
  } else if (arguments.length === 2) {
    if (typeof arguments[1] === 'function') {
      value = arguments[0];
      cb = arguments[1];
    } else {
      subpath = arguments[0];
      value = arguments[1];
    }
  } else {
    subpath = arguments[0];
    value = arguments[1];
    cb = arguments[2];
  }
  var segments = this._splitPath(subpath);
  return this._add(segments, value, cb);
};
Model.prototype._add = function(segments, value, cb) {
  if (typeof value !== 'object') {
    var message = 'add requires an object value. Invalid value: ' + value;
    cb || (cb = this.root._defaultCallback);
    return cb(new Error(message));
  }
  var id = value.id || this.id();
  value.id = id;
  this._set(segments.concat(id), value, cb);
  return id;
};

Model.prototype.setNull = function() {
  var subpath, value, cb;
  if (arguments.length === 1) {
    value = arguments[0];
  } else if (arguments.length === 2) {
    subpath = arguments[0];
    value = arguments[1];
  } else {
    subpath = arguments[0];
    value = arguments[1];
    cb = arguments[2];
  }
  var segments = this._splitPath(subpath);
  return this._setNull(segments, value, cb);
};
Model.prototype._setNull = function(segments, value, cb) {
  segments = this._dereference(segments);
  var model = this;
  function setNull(doc, docSegments, fnCb) {
    var previous = doc.get(docSegments);
    if (previous != null) {
      fnCb();
      return previous;
    }
    doc.set(docSegments, value, fnCb);
    model.emit('change', segments, [value, previous, model._pass]);
    return value;
  }
  return this._mutate(segments, setNull, cb);
};

Model.prototype.del = function() {
  var subpath, cb;
  if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0];
    } else {
      subpath = arguments[0];
    }
  } else {
    subpath = arguments[0];
    cb = arguments[1];
  }
  var segments = this._splitPath(subpath);
  return this._del(segments, cb);
};
Model.prototype._del = function(segments, cb) {
  segments = this._dereference(segments);
  var model = this;
  function del(doc, docSegments, fnCb) {
    var previous = doc.del(docSegments, fnCb);
    // When deleting an entire document, also remove the reference to the
    // document object from its collection
    if (segments.length === 2) {
      var collectionName = segments[0];
      var id = segments[1];
      model.root.collections[collectionName].remove(id);
    }
    model.emit('change', segments, [void 0, previous, model._pass]);
    return previous;
  }
  return this._mutate(segments, del, cb);
};

Model.prototype.increment = function() {
  var subpath, byNumber, cb;
  if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0];
    } else if (typeof arguments[0] === 'number') {
      byNumber = arguments[0];
    } else {
      subpath = arguments[0];
    }
  } else if (arguments.length === 2) {
    if (typeof arguments[1] === 'function') {
      cb = arguments[1];
      if (typeof arguments[0] === 'number') {
        byNumber = arguments[0];
      } else {
        subpath = arguments[0];
      }
    } else {
      subpath = arguments[0];
      byNumber = arguments[1];
    }
  } else {
    subpath = arguments[0];
    byNumber = arguments[1];
    cb = arguments[2];
  }
  var segments = this._splitPath(subpath);
  return this._increment(segments, byNumber, cb);
};
Model.prototype._increment = function(segments, byNumber, cb) {
  segments = this._dereference(segments);
  if (byNumber == null) byNumber = 1;
  var model = this;
  function increment(doc, docSegments, fnCb) {
    var value = doc.increment(docSegments, byNumber, fnCb);
    var previous = value - byNumber;
    model.emit('change', segments, [value, previous, model._pass]);
    return value;
  }
  return this._mutate(segments, increment, cb);
};

Model.prototype.push = function() {
  var subpath, value, cb;
  if (arguments.length === 1) {
    value = arguments[0];
  } else if (arguments.length === 2) {
    subpath = arguments[0];
    value = arguments[1];
  } else {
    subpath = arguments[0];
    value = arguments[1];
    cb = arguments[2];
  }
  var segments = this._splitPath(subpath);
  return this._push(segments, value, cb);
};
Model.prototype._push = function(segments, value, cb) {
  var forArrayMutator = true;
  segments = this._dereference(segments, forArrayMutator);
  var model = this;
  function push(doc, docSegments, fnCb) {
    var length = doc.push(docSegments, value, fnCb);
    model.emit('insert', segments, [length - 1, [value], model._pass]);
    return length;
  }
  return this._mutate(segments, push, cb);
};

Model.prototype.unshift = function() {
  var subpath, value, cb;
  if (arguments.length === 1) {
    value = arguments[0];
  } else if (arguments.length === 2) {
    subpath = arguments[0];
    value = arguments[1];
  } else {
    subpath = arguments[0];
    value = arguments[1];
    cb = arguments[2];
  }
  var segments = this._splitPath(subpath);
  return this._unshift(segments, value, cb);
};
Model.prototype._unshift = function(segments, value, cb) {
  var forArrayMutator = true;
  segments = this._dereference(segments, forArrayMutator);
  var model = this;
  function unshift(doc, docSegments, fnCb) {
    var length = doc.unshift(docSegments, value, fnCb);
    model.emit('insert', segments, [0, [value], model._pass]);
    return length;
  }
  return this._mutate(segments, unshift, cb);
};

Model.prototype.insert = function() {
  var subpath, index, values, cb;
  if (arguments.length === 1) {
    this.emit('error', new Error('Not enough arguments for insert'));
  } else if (arguments.length === 2) {
    index = arguments[0];
    values = arguments[1];
  } else if (arguments.length === 3) {
    subpath = arguments[0];
    index = arguments[1];
    values = arguments[2];
  } else {
    subpath = arguments[0];
    index = arguments[1];
    values = arguments[2];
    cb = arguments[3];
  }
  var segments = this._splitPath(subpath);
  return this._insert(segments, +index, values, cb);
};
Model.prototype._insert = function(segments, index, values, cb) {
  var forArrayMutator = true;
  segments = this._dereference(segments, forArrayMutator);
  var model = this;
  function insert(doc, docSegments, fnCb) {
    var inserted = (Array.isArray(values)) ? values : [values];
    var length = doc.insert(docSegments, index, inserted, fnCb);
    model.emit('insert', segments, [index, inserted, model._pass]);
    return length;
  }
  return this._mutate(segments, insert, cb);
};

Model.prototype.pop = function() {
  var subpath, cb;
  if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0];
    } else {
      subpath = arguments[0];
    }
  } else {
    subpath = arguments[0];
    cb = arguments[1];
  }
  var segments = this._splitPath(subpath);
  return this._pop(segments, cb);
};
Model.prototype._pop = function(segments, cb) {
  var forArrayMutator = true;
  segments = this._dereference(segments, forArrayMutator);
  var model = this;
  function pop(doc, docSegments, fnCb) {
    var arr = doc.get(docSegments);
    var length = arr && arr.length;
    if (!length) {
      fnCb();
      return;
    }
    var value = doc.pop(docSegments, fnCb);
    model.emit('remove', segments, [length - 1, [value], model._pass]);
    return value;
  }
  return this._mutate(segments, pop, cb);
};

Model.prototype.shift = function() {
  var subpath, cb;
  if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0];
    } else {
      subpath = arguments[0];
    }
  } else {
    subpath = arguments[0];
    cb = arguments[1];
  }
  var segments = this._splitPath(subpath);
  return this._shift(segments, cb);
};
Model.prototype._shift = function(segments, cb) {
  var forArrayMutator = true;
  segments = this._dereference(segments, forArrayMutator);
  var model = this;
  function shift(doc, docSegments, fnCb) {
    var arr = doc.get(docSegments);
    var length = arr && arr.length;
    if (!length) {
      fnCb();
      return;
    }
    var value = doc.shift(docSegments, fnCb);
    model.emit('remove', segments, [0, [value], model._pass]);
    return value;
  }
  return this._mutate(segments, shift, cb);
};

Model.prototype.remove = function() {
  var subpath, index, howMany, cb;
  if (arguments.length === 1) {
    index = arguments[0];
  } else if (arguments.length === 2) {
    if (typeof arguments[1] === 'function') {
      cb = arguments[1];
      if (typeof arguments[0] === 'number') {
        index = arguments[0];
      } else {
        subpath = arguments[0];
      }
    } else {
      if (typeof arguments[0] === 'number') {
        index = arguments[0];
        howMany = arguments[1];
      } else {
        subpath = arguments[0];
        index = arguments[1];
      }
    }
  } else if (arguments.length === 3) {
    if (typeof arguments[2] === 'function') {
      cb = arguments[2];
      if (typeof arguments[0] === 'number') {
        index = arguments[0];
        howMany = arguments[1];
      } else {
        subpath = arguments[0];
        index = arguments[1];
      }
    } else {
      subpath = arguments[0];
      index = arguments[1];
      howMany = arguments[2];
    }
  } else {
    subpath = arguments[0];
    index = arguments[1];
    howMany = arguments[2];
    cb = arguments[3];
  }
  var segments = this._splitPath(subpath);
  if (index == null) index = segments.pop();
  return this._remove(segments, +index, howMany, cb);
};
Model.prototype._remove = function(segments, index, howMany, cb) {
  var forArrayMutator = true;
  segments = this._dereference(segments, forArrayMutator);
  if (howMany == null) howMany = 1;
  var model = this;
  function remove(doc, docSegments, fnCb) {
    var removed = doc.remove(docSegments, index, howMany, fnCb);
    model.emit('remove', segments, [index, removed, model._pass]);
    return removed;
  }
  return this._mutate(segments, remove, cb);
};

Model.prototype.move = function() {
  var subpath, from, to, howMany, cb;
  if (arguments.length === 1) {
    this.emit('error', new Error('Not enough arguments for move'));
  } else if (arguments.length === 2) {
    from = arguments[0];
    to = arguments[1];
  } else if (arguments.length === 3) {
    if (typeof arguments[2] === 'function') {
      from = arguments[0];
      to = arguments[1];
      cb = arguments[2];
    } else if (typeof arguments[0] === 'number') {
      from = arguments[0];
      to = arguments[1];
      howMany = arguments[2];
    } else {
      subpath = arguments[0];
      from = arguments[1];
      to = arguments[2];
    }
  } else if (arguments.length === 4) {
    if (typeof arguments[3] === 'function') {
      cb = arguments[3];
      if (typeof arguments[0] === 'number') {
        from = arguments[0];
        to = arguments[1];
        howMany = arguments[2];
      } else {
        subpath = arguments[0];
        from = arguments[1];
        to = arguments[2];
      }
    } else {
      subpath = arguments[0];
      from = arguments[1];
      to = arguments[2];
      howMany = arguments[3];
    }
  } else {
    subpath = arguments[0];
    from = arguments[1];
    to = arguments[2];
    howMany = arguments[3];
    cb = arguments[4];
  }
  var segments = this._splitPath(subpath);
  return this._move(segments, from, to, howMany, cb);
};
Model.prototype._move = function(segments, from, to, howMany, cb) {
  var forArrayMutator = true;
  segments = this._dereference(segments, forArrayMutator);
  if (howMany == null) howMany = 1;
  var model = this;
  function move(doc, docSegments, fnCb) {
    // Cast to numbers
    from = +from;
    to = +to;
    // Convert negative indices into positive
    if (from < 0 || to < 0) {
      var len = doc.get(docSegments).length;
      if (from < 0) from += len;
      if (to < 0) to += len;
    }
    var moved = doc.move(docSegments, from, to, howMany, fnCb);
    model.emit('move', segments, [from, to, moved.length, model._pass]);
    return moved;
  }
  return this._mutate(segments, move, cb);
};

Model.prototype.stringInsert = function() {
  var subpath, index, text, cb;
  if (arguments.length === 1) {
    this.emit('error', new Error('Not enough arguments for stringInsert'));
  } else if (arguments.length === 2) {
    index = arguments[0];
    text = arguments[1];
  } else if (arguments.length === 3) {
    if (typeof arguments[2] === 'function') {
      index = arguments[0];
      text = arguments[1];
      cb = arguments[2];
    } else {
      subpath = arguments[0];
      index = arguments[1];
      text = arguments[2];
    }
  } else {
    subpath = arguments[0];
    index = arguments[1];
    text = arguments[2];
    cb = arguments[3];
  }
  var segments = this._splitPath(subpath);
  return this._stringInsert(segments, index, text, cb);
};
Model.prototype._stringInsert = function(segments, index, text, cb) {
  segments = this._dereference(segments);
  var model = this;
  function stringInsert(doc, docSegments, fnCb) {
    var previous = doc.stringInsert(docSegments, index, text, fnCb);
    model.emit('stringInsert', segments, [index, text, model._pass]);
    var value = doc.get(docSegments);
    var pass = model.pass({$original: 'stringInsert'})._pass;
    model.emit('change', segments, [value, previous, pass]);
    return;
  }
  return this._mutate(segments, stringInsert, cb);
};

Model.prototype.stringRemove = function() {
  var subpath, index, howMany, cb;
  if (arguments.length === 1) {
    this.emit('error', new Error('Not enough arguments for stringRemove'));
  } else if (arguments.length === 2) {
    index = arguments[0];
    howMany = arguments[1];
  } else if (arguments.length === 3) {
    if (typeof arguments[2] === 'function') {
      index = arguments[0];
      howMany = arguments[1];
      cb = arguments[2];
    } else {
      subpath = arguments[0];
      index = arguments[1];
      howMany = arguments[2];
    }
  } else {
    subpath = arguments[0];
    index = arguments[1];
    howMany = arguments[2];
    cb = arguments[3];
  }
  var segments = this._splitPath(subpath);
  return this._stringRemove(segments, index, howMany, cb);
};
Model.prototype._stringRemove = function(segments, index, howMany, cb) {
  segments = this._dereference(segments);
  var model = this;
  function stringRemove(doc, docSegments, fnCb) {
    var previous = doc.stringRemove(docSegments, index, howMany, fnCb);
    model.emit('stringRemove', segments, [index, howMany, model._pass]);
    var value = doc.get(docSegments);
    var pass = model.pass({$original: 'stringRemove'})._pass;
    model.emit('change', segments, [value, previous, pass]);
    return;
  }
  return this._mutate(segments, stringRemove, cb);
};

},{"./Model":29,"../util":12}],36:[function(require,module,exports){
(function(process){var util = require('../util');
var Model = require('./Model');
var Query = require('./Query');

Model.INITS.push(function(model, options) {
  model.root.fetchOnly = options.fetchOnly;
  model.root.unloadDelay = options.unloadDelay || 1000;

  // Keeps track of the count of fetches (that haven't been undone by an
  // unfetch) per doc. Maps doc id to the fetch count.
  model.root._fetchedDocs = new FetchedDocs;

  // Keeps track of the count of subscribes (that haven't been undone by an
  // unsubscribe) per doc. Maps doc id to the subscribe count.
  model.root._subscribedDocs = new SubscribedDocs;

  // Maps doc path to doc version
  model.root._loadVersions = new LoadVersions;
});

function FetchedDocs() {}
function SubscribedDocs() {}
function LoadVersions() {}

Model.prototype.fetch = function() {
  this._forSubscribable(arguments, 'fetch');
  return this;
};
Model.prototype.unfetch = function() {
  this._forSubscribable(arguments, 'unfetch');
  return this;
};
Model.prototype.subscribe = function() {
  this._forSubscribable(arguments, 'subscribe');
  return this;
};
Model.prototype.unsubscribe = function() {
  this._forSubscribable(arguments, 'unsubscribe');
  return this;
};

/**
 * @private
 * @param {Arguments} argumentsObject can take 1 of two forms
 *   1. [[subscribableObjects...], cb]
 *   2. [subscribableObjects..., cb]
 * @param {String} method can be 'fetch', 'unfetch', 'subscribe', 'unsubscribe'
 */
Model.prototype._forSubscribable = function(argumentsObject, method) {
  if (Array.isArray(argumentsObject[0])) {
    var args = argumentsObject[0];
    var cb = argumentsObject[1] || this.root._defaultCallback;
  } else {
    var args = Array.prototype.slice.call(argumentsObject);
    var last = args[args.length - 1];
    var cb = (typeof last === 'function') ? args.pop() : this.root._defaultCallback;
  }
  // If no queries or paths are passed in, try to use this model's scope
  if (!args.length) args.push(null);
  var group = util.asyncGroup(cb);
  var docMethod = method + 'Doc';

  var finished = group();
  for (var i = 0; i < args.length; i++) {
    var item = args[i];
    if (item instanceof Query) {
      item[method](group());
    } else {
      var segments = this._dereference(this._splitPath(item));
      if (segments.length === 2) {
        // Do the appropriate method for a single document.
        this[docMethod](segments[0], segments[1], group());
      } else if (segments.length === 1) {
        // Make a query to an entire collection.
        var query = this.query(segments[0], {});
        query[method](group());
      } else if (segments.length === 0) {
        cb(new Error('No path specified for ' + method));
      } else {
        cb(new Error('Cannot ' + method + ' to a path within a document: ' +
            segments.join('.')));
      }
    }
  }
  finished();
};

/**
 * @param {String}
 * @param {String} id
 * @param {Function} cb(err)
 * @param {Boolean} alreadyLoaded
 */
Model.prototype.fetchDoc = function(collectionName, id, cb, alreadyLoaded) {
  if (!cb) cb = this.root._defaultCallback;

  // Maintain a count of fetches so that we can unload the document when
  // there are no remaining fetches or subscribes for that document
  var path = collectionName + '.' + id;
  this.emit('fetchDoc', path, this._context, this._pass);
  this.root._fetchedDocs[path] = (this.root._fetchedDocs[path] || 0) + 1;

  var model = this;
  var doc = this.getOrCreateDoc(collectionName, id);
  if (alreadyLoaded) {
    process.nextTick(fetchDocCallback);
  } else {
    doc.shareDoc.fetch(fetchDocCallback);
  }
  function fetchDocCallback(err) {
    if (err) return cb(err);
    if (doc.shareDoc.version !== model.root._loadVersions[path]) {
      model.root._loadVersions[path] = doc.shareDoc.version;
      doc._updateCollectionData();
      model.emit('load', [collectionName, id], [doc.get(), model._pass]);
    }
    cb();
  }
};

/**
 * @param {String} collectionName
 * @param {String} id of the document we want to subscribe to
 * @param {Function} cb(err)
 */
Model.prototype.subscribeDoc = function(collectionName, id, cb) {
  if (!cb) cb = this.root._defaultCallback;

  var path = collectionName + '.' + id;
  this.emit('subscribeDoc', path, this._context, this._pass);
  var count = this.root._subscribedDocs[path] = (this.root._subscribedDocs[path] || 0) + 1;
  // Already requested a subscribe, so just return
  if (count > 1) return cb();

  // Subscribe if currently unsubscribed
  var model = this;
  var doc = this.getOrCreateDoc(collectionName, id);
  if (this.root.fetchOnly) {
    // Only fetch if the document isn't already loaded
    if (doc.get() === void 0) {
      doc.shareDoc.fetch(subscribeDocCallback);
    } else {
      process.nextTick(subscribeDocCallback);
    }
  } else {
    doc.shareDoc.subscribe(subscribeDocCallback);
  }
  function subscribeDocCallback(err) {
    if (err) return cb(err);
    if (!doc.createdLocally && doc.shareDoc.version !== model.root._loadVersions[path]) {
      model.root._loadVersions[path] = doc.shareDoc.version;
      doc._updateCollectionData();
      model.emit('load', [collectionName, id], [doc.get(), model._pass]);
    }
    cb();
  }
};

Model.prototype.unfetchDoc = function(collectionName, id, cb) {
  if (!cb) cb = this.root._defaultCallback;
  var path = collectionName + '.' + id;
  this.emit('unfetchDoc', path, this._context, this._pass);
  var fetchedDocs = this.root._fetchedDocs;

  // No effect if the document has no fetch count
  if (!fetchedDocs[path]) return cb();

  var model = this;
  if (this.root.unloadDelay && !this._pass.$query) {
    setTimeout(finishUnfetchDoc, this.root.unloadDelay);
  } else {
    finishUnfetchDoc();
  }
  function finishUnfetchDoc() {
    var count = --fetchedDocs[path];
    if (count) return cb(null, count);
    delete fetchedDocs[path];
    model._maybeUnloadDoc(collectionName, id, path);
    cb(null, 0);
  }
};

Model.prototype.unsubscribeDoc = function(collectionName, id, cb) {
  if (!cb) cb = this.root._defaultCallback;
  var path = collectionName + '.' + id;
  this.emit('unsubscribeDoc', path, this._context, this._pass);
  var subscribedDocs = this.root._subscribedDocs;

  // No effect if the document is not currently subscribed
  if (!subscribedDocs[path]) return cb();

  var model = this;
  if (this.root.unloadDelay && !this._pass.$query) {
    setTimeout(finishUnsubscribeDoc, this.root.unloadDelay);
  } else {
    finishUnsubscribeDoc();
  }
  function finishUnsubscribeDoc() {
    var count = --subscribedDocs[path];
    // If there are more remaining subscriptions, only decrement the count
    // and callback with how many subscriptions are remaining
    if (count) return cb(null, count);

    // If there is only one remaining subscription, actually unsubscribe
    delete subscribedDocs[path];
    if (model.root.fetchOnly) {
      unsubscribeDocCallback();
    } else {
      var shareDoc = model.root.shareConnection.get(collectionName, id);
      if (!shareDoc) {
        return cb(new Error('Share document not found for: ' + path));
      }
      shareDoc.unsubscribe(unsubscribeDocCallback);
    }
  }
  function unsubscribeDocCallback(err) {
    model._maybeUnloadDoc(collectionName, id, path);
    if (err) return cb(err);
    cb(null, 0);
  }
};

/**
 * Removes the document from the local model if the model no longer has any
 * remaining fetches or subscribes on path.
 * Called from Model.prototype.unfetchDoc and Model.prototype.unsubscribeDoc as
 * part of attempted cleanup.
 * @param {String} collectionName
 * @param {String} id
 * @param {String} path
 */
Model.prototype._maybeUnloadDoc = function(collectionName, id, path) {
  var doc = this.getDoc(collectionName, id);
  if (!doc) return;
  // Remove the document from the local model if it no longer has any
  // remaining fetches or subscribes
  if (this.root._fetchedDocs[path] || this.root._subscribedDocs[path]) return;
  var previous = doc.get();
  this.root.collections[collectionName].remove(id);
  if (doc.shareDoc) doc.shareDoc.destroy();
  delete this.root._loadVersions[path];
  this.emit('unload', [collectionName, id], [previous, this._pass]);
};

})(require("__browserify_process"))
},{"../util":12,"./Model":29,"./Query":37,"__browserify_process":10}],38:[function(require,module,exports){
/**
 * Contexts are useful for keeping track of the origin of subscribes.
 */

var Model = require('./Model');
var Query = require('./Query');

Model.INITS.push(function(model) {
  model.root._contexts = new Contexts;
  model.setContext('root');
  [ 'fetchDoc', 'subscribeDoc', 'unfetchDoc', 'unsubscribeDoc'
  , 'fetchQuery', 'subscribeQuery', 'unfetchQuery', 'unsubscribeQuery'
  ].forEach(function(event) {
    model.on(event, function(item, context, pass) {
      context[event](item, pass);
    });
  });
});

Model.prototype.context = function(id) {
  var model = this._child();
  model.setContext(id);
  return model;
};

Model.prototype.setContext = function(id) {
  var context = this.root._contexts[id] || new Context(this, id);
  this._context = this.root._contexts[id] = context;
  return context;
};

Model.prototype.unload = function(id) {
  var context = (id) ? this.root._contexts[id] : this._context;
  context.unload();
};

function Contexts() {}

function FetchedDocs() {}
function SubscribedDocs() {}
function FetchedQueries() {}
function SubscribedQueries() {}

function Context(model, id) {
  this.model = model;
  this.id = id;
  this.fetchedDocs = new FetchedDocs;
  this.subscribedDocs = new SubscribedDocs;
  this.fetchedQueries = new FetchedQueries;
  this.subscribedQueries = new SubscribedQueries;
}

Context.prototype.toJSON = function() {
  return {
    fetchedDocs: this.fetchedDocs
  , subscribedDocs: this.subscribedDocs
  , fetchedQueries: this.fetchedQueries
  , subscribedQueries: this.subscribedQueries
  };
};

Context.prototype.fetchDoc = function(path, pass) {
  if (pass.$query) return;
  mapIncrement(this.fetchedDocs, path);
};
Context.prototype.subscribeDoc = function(path, pass) {
  if (pass.$query) return;
  mapIncrement(this.subscribedDocs, path);
};
Context.prototype.unfetchDoc = function(path, pass) {
  if (pass.$query) return;
  mapDecrement(this.fetchedDocs, path);
};
Context.prototype.unsubscribeDoc = function(path, pass) {
  if (pass.$query) return;
  mapDecrement(this.subscribedDocs, path);
};
Context.prototype.fetchQuery = function(query) {
  mapIncrement(this.fetchedQueries, query.hash);
};
Context.prototype.subscribeQuery = function(query) {
  mapIncrement(this.subscribedQueries, query.hash);
};
Context.prototype.unfetchQuery = function(query) {
  mapDecrement(this.fetchedQueries, query.hash);
};
Context.prototype.unsubscribeQuery = function(query) {
  mapDecrement(this.subscribedQueries, query.hash);
};
function mapIncrement(map, key) {
  map[key] = (map[key] || 0) + 1;
}
function mapDecrement(map, key) {
  map[key] && map[key]--;
  if (!map[key]) delete map[key];
}

Context.prototype.unload = function() {
  var model = this.model;
  for (var hash in this.fetchedQueries) {
    var query = model.root._queries.map[hash];
    if (!query) continue;
    var count = this.fetchedQueries[hash];
    while (count--) query.unfetch(null);
  }
  for (var hash in this.subscribedQueries) {
    var query = model.root._queries.map[hash];
    if (!query) continue;
    var count = this.subscribedQueries[hash];
    while (count--) query.unsubscribe(null);
  }
  for (var path in this.fetchedDocs) {
    var segments = path.split('.');
    var count = this.fetchedDocs[path];
    while (count--) model.unfetchDoc(segments[0], segments[1]);
  }
  for (var path in this.subscribedDocs) {
    var segments = path.split('.');
    var count = this.subscribedDocs[path];
    while (count--) model.unsubscribeDoc(segments[0], segments[1]);
  }
  model._context = model.root._contexts[this.id] = new Context(model, this.id);
};

},{"./Model":29,"./Query":37}],39:[function(require,module,exports){
var util = require('../util');
var Model = require('./Model');
var defaultFns = require('./defaultFns');

function NamedFns() {}

Model.INITS.push(function(model) {
  model.root._namedFns = new NamedFns();
  model.root._fns = new Fns(model);
  model.on('all', fnListener);
  function fnListener(segments, eventArgs) {
    var pass = eventArgs[eventArgs.length - 1];
    var map = model.root._fns.fromMap;
    for (var path in map) {
      var fn = map[path];
      if (pass.$fn === fn) continue;
      if (util.mayImpactAny(fn.inputsSegments, segments)) {
        // Mutation affecting input path
        fn.onInput(pass);
      } else if (util.mayImpact(fn.fromSegments, segments)) {
        // Mutation affecting output path
        fn.onOutput(pass);
      }
    }
  }
});

Model.prototype.fn = function(name, fns) {
  this.root._namedFns[name] = fns;
};

function parseStartArguments(model, args, hasPath) {
  if (typeof args[0] === 'function') {
    var fns = args[0];
  } else {
    var name = args[0];
  }
  if (hasPath) {
    var path = model.path(args[1]);
    var inputPaths = Array.prototype.slice.call(args, 2);
  } else {
    var inputPaths = Array.prototype.slice.call(args, 1);
  }
  var i = inputPaths.length - 1;
  if (model.isPath(inputPaths[i])) {
    inputPaths[i] = model.path(inputPaths[i]);
  } else {
    var options = inputPaths.pop();
  }
  while (i--) {
    inputPaths[i] = model.path(inputPaths[i]);
  }
  return {
    name: name
  , path: path
  , inputPaths: inputPaths
  , fns: fns
  , options: options
  };
}

Model.prototype.evaluate = function(name) {
  var args = parseStartArguments(this, arguments, false);
  return this.root._fns.get(args.name, args.inputPaths, args.fns, args.options);
};

Model.prototype.start = function(name, subpath) {
  var args = parseStartArguments(this, arguments, true);
  return this.root._fns.start(args.name, args.path, args.inputPaths, args.fns, args.options);
};

Model.prototype.stop = function(subpath) {
  var path = this.path(subpath);
  this.root._fns.stop(path);
};

Model.prototype.stopAll = function(subpath) {
  var segments = this._splitPath(subpath);
  var fns = this.root._fns.fromMap;
  for (var from in fns) {
    if (util.contains(segments, fns[from].fromSegments)) {
      this.stop(from);
    }
  }
};

function FromMap() {}
function Fns(model) {
  this.model = model;
  this.nameMap = model.root._namedFns;
  this.fromMap = new FromMap;
}

Fns.prototype.get = function(name, inputPaths, fns, options) {
  fns || (fns = this.nameMap[name] || defaultFns[name]);
  var fn = new Fn(this.model, name, null, inputPaths, fns, options);
  return fn.get();
};

Fns.prototype.start = function(name, path, inputPaths, fns, options) {
  fns || (fns = this.nameMap[name] || defaultFns[name]);
  var fn = new Fn(this.model, name, path, inputPaths, fns, options);
  this.fromMap[path] = fn;
  return fn.onInput();
};

Fns.prototype.stop = function(path) {
  var fn = this.fromMap[path];
  delete this.fromMap[path];
  return fn;
};

Fns.prototype.toJSON = function() {
  var out = [];
  for (var from in this.fromMap) {
    var fn = this.fromMap[from];
    // Don't try to bundle non-named functions that were started via
    // model.start directly instead of by name
    if (!fn.name) continue;
    out.push([fn.name, fn.from].concat(fn.inputPaths));
  }
  return out;
};

function Fn(model, name, from, inputPaths, fns, options) {
  this.model = model.pass({$fn: this});
  this.name = name;
  this.from = from;
  this.inputPaths = inputPaths;
  if (!fns) {
    var err = new TypeError('Model function not found: ' + name);
    model.emit('error', err);
  }
  this.getFn = fns.get || fns;
  this.setFn = fns.set;
  this.fromSegments = from && from.split('.');
  this.inputsSegments = [];
  for (var i = 0; i < this.inputPaths.length; i++) {
    var segments = this.inputPaths[i].split('.');
    this.inputsSegments.push(segments);
  }
  var copy = (options && options.copy) || 'output';
  this.copyInput = (copy === 'input' || copy === 'both');
  this.copyOutput = (copy === 'output' || copy === 'both');
}

Fn.prototype.apply = function(fn, inputs) {
  for (var i = 0, len = this.inputsSegments.length; i < len; i++) {
    var input = this.model._get(this.inputsSegments[i]);
    inputs.push(this.copyInput ? util.deepCopy(input) : input);
  }
  return fn.apply(this.model, inputs);
};

Fn.prototype.get = function() {
  return this.apply(this.getFn, []);
};

var diffOptions = {equal: util.deepEqual};
var eachDiffOptions = {each: true, equal: util.deepEqual};

Fn.prototype.set = function(value, pass) {
  if (!this.setFn) return;
  var out = this.apply(this.setFn, [value]);
  if (!out) return;
  var inputsSegments = this.inputsSegments;
  var model = this.model.pass(pass, true);
  for (var key in out) {
    if (key === 'each') {
      var each = out[key];
      for (key in each) {
        var value = (this.copyOutput) ? util.deepCopy(each[key]) : each[key];
        model._setDiff(inputsSegments[key], value, eachDiffOptions);
      }
      continue;
    }
    var value = (this.copyOutput) ? util.deepCopy(out[key]) : out[key];
    model._setDiff(inputsSegments[key], value, diffOptions);
  }
};

Fn.prototype.onInput = function(pass) {
  var value = (this.copyOutput) ? util.deepCopy(this.get()) : this.get();
  this.model.pass(pass, true)._setDiff(this.fromSegments, value, diffOptions);
  return value;
};

Fn.prototype.onOutput = function(pass) {
  var value = this.model._get(this.fromSegments);
  return this.set(value, pass);
};

},{"../util":12,"./Model":29,"./defaultFns":54}],40:[function(require,module,exports){
var util = require('../util');
var Model = require('./Model');
var defaultFns = require('./defaultFns');

Model.INITS.push(function(model) {
  model.root._filters = new Filters(model);
  model.on('all', filterListener);
  function filterListener(segments, eventArgs) {
    var pass = eventArgs[eventArgs.length - 1];
    var map = model.root._filters.fromMap;
    for (var path in map) {
      var filter = map[path];
      if (pass.$filter === filter) continue;
      if (util.mayImpact(filter.inputSegments, segments)) {
        filter.update(pass);
      }
    }
  }
});

Model.prototype.filter = function(input, fn) {
  var inputPath = this.path(input);
  return this.root._filters.add(inputPath, fn);
};

Model.prototype.sort = function(input, fn) {
  var inputPath = this.path(input);
  return this.root._filters.add(inputPath, null, fn || 'asc');
};

Model.prototype.removeAllFilters = function(subpath) {
  var segments = this._splitPath(subpath);
  var filters = this.root._filters.fromMap;
  for (var from in filters) {
    if (util.contains(segments, filters[from].fromSegments)) {
      filters[from].destroy();
    }
  }
};

function FromMap() {}
function Filters(model) {
  this.model = model;
  this.fromMap = new FromMap;
}

Filters.prototype.add = function(inputPath, filterFn, sortFn) {
  return new Filter(this, inputPath, filterFn, sortFn);
};

Filters.prototype.toJSON = function() {
  var out = [];
  for (var from in this.fromMap) {
    var filter = this.fromMap[from];
    // Don't try to bundle if functions were passed directly instead of by name
    if (!filter.bundle) continue;
    out.push([filter.inputPath, filter.filterName, filter.sortName, from]);
  }
  return out;
};

function Filter(filters, inputPath, filterFn, sortFn) {
  this.filters = filters;
  this.model = filters.model.pass({$filter: this});
  this.inputPath = inputPath;
  this.inputSegments = inputPath.split('.');
  this.filterName = null;
  this.sortName = null;
  this.bundle = true;
  this.filterFn = null;
  this.sortFn = null;
  if (filterFn) this.filter(filterFn);
  if (sortFn) this.sort(sortFn);
  this.idsSegments = null;
  this.from = null;
  this.fromSegments = null;
}

Filter.prototype.filter = function(fn) {
  if (typeof fn === 'function') {
    this.filterFn = fn;
    this.bundle = false;
    return this;
  }
  if (typeof fn === 'string') {
    this.filterName = fn;
    this.filterFn = this.model.root._namedFns[fn] || defaultFns[fn];
    if (!this.filterFn) {
      var err = new TypeError('Filter function not found: ' + fn);
      this.model.emit('error', err);
    }
  }
  return this;
};

Filter.prototype.sort = function(fn) {
  if (!fn) fn = 'asc';
  if (typeof fn === 'function') {
    this.sortFn = fn;
    this.bundle = false;
    return this;
  }
  if (typeof fn === 'string') {
    this.sortName = fn;
    this.sortFn = this.model.root._namedFns[fn] || defaultFns[fn];
    if (!this.sortFn) {
      var err = new TypeError('Sort function not found: ' + fn);
      this.model.emit('error', err);
    }
  }
  return this;
};

Filter.prototype.ids = function() {
  var items = this.model._get(this.inputSegments);
  var ids = [];
  if (!items) return ids;
  if (Array.isArray(items)) {
    if (this.filterFn) {
      for (var i = 0; i < items.length; i++) {
        if (this.filterFn.call(this.model, items[i], i, items)) {
          ids.push(i);
        }
      }
    } else {
      for (var i = 0; i < items.length; i++) ids.push(i);
    }
  } else {
    if (this.filterFn) {
      for (var key in items) {
        if (items.hasOwnProperty(key) &&
          this.filterFn.call(this.model, items[key], key, items)
        ) {
          ids.push(key);
        }
      }
    } else {
      ids = Object.keys(items);
    }
  }
  var sortFn = this.sortFn;
  if (sortFn) {
    ids.sort(function(a, b) {
      return sortFn(items[a], items[b]);
    });
  }
  return ids;
};

Filter.prototype.get = function() {
  var items = this.model._get(this.inputSegments);
  var results = [];
  if (Array.isArray(items)) {
    if (this.filterFn) {
      for (var i = 0; i < items.length; i++) {
        if (this.filterFn.call(this.model, items[i], i, items)) {
          results.push(items[i]);
        }
      }
    } else {
      results = items.slice();
    }
  } else {
    if (this.filterFn) {
      for (var key in items) {
        if (items.hasOwnProperty(key) &&
          this.filterFn.call(this.model, items[key], key, items)
        ) {
          results.push(items[key]);
        }
      }
    } else {
      for (var key in items) {
        if (items.hasOwnProperty(key)) {
          results.push(items[key]);
        }
      }
    }
  }
  if (this.sortFn) results.sort(this.sortFn);
  return results;
};

Filter.prototype.update = function(pass) {
  var ids = this.ids();
  this.model.pass(pass, true)._setDiff(this.idsSegments, ids);
};

Filter.prototype.ref = function(from) {
  from = this.model.path(from);
  this.from = from;
  this.fromSegments = from.split('.');
  this.filters.fromMap[from] = this;
  this.idsSegments = ['$filters', from.replace(/\./g, '|')];
  this.update();
  return this.model.refList(from, this.inputPath, this.idsSegments.join('.'));
};

Filter.prototype.destroy = function() {
  delete this.filters.fromMap[this.from];
  this.model.removeRefList(this.from);
  this.model._del(this.idsSegments);
};

},{"../util":12,"./Model":29,"./defaultFns":54}],41:[function(require,module,exports){
var util = require('../util');
var Model = require('./Model');

Model.INITS.push(function(model) {
  var root = model.root;
  root._refLists = new RefLists(root);
  for (var type in Model.MUTATOR_EVENTS) {
    addListener(root, type);
  }
});

function addListener(model, type) {
  model.on(type, refListListener);
  function refListListener(segments, eventArgs) {
    var pass = eventArgs[eventArgs.length - 1];
    // Check for updates on or underneath paths
    var fromMap = model._refLists.fromMap;
    for (var from in fromMap) {
      var refList = fromMap[from];
      if (pass.$refList === refList) continue;
      refList.onMutation(type, segments, eventArgs);
    }
  }
}

/**
 * @param {String} type
 * @param {Array} segments
 * @param {Array} eventArgs
 * @param {RefList} refList
 */
function patchFromEvent(type, segments, eventArgs, refList) {
  var fromLength = refList.fromSegments.length;
  var segmentsLength = segments.length;
  var pass = eventArgs[eventArgs.length - 1];
  var model = refList.model.pass(pass, true);

  // Mutation on the `from` output itself
  if (segmentsLength === fromLength) {
    if (type === 'insert') {
      var index = eventArgs[0];
      var values = eventArgs[1];
      var ids = setNewToValues(model, refList, values);
      model._insert(refList.idsSegments, index, ids);
      return;
    }

    if (type === 'remove') {
      var index = eventArgs[0];
      var howMany = eventArgs[1].length;
      var ids = model._remove(refList.idsSegments, index, howMany);
      // Delete the appropriate items underneath `to` if the `deleteRemoved`
      // option was set true
      if (refList.deleteRemoved) {
        for (var i = 0; i < ids.length; i++) {
          var item = refList.itemById(ids[i]);
          model._del(refList.toSegmentsByItem(item));
        }
      }
      return;
    }

    if (type === 'move') {
      var from = eventArgs[0];
      var to = eventArgs[1];
      var howMany = eventArgs[2];
      model._move(refList.idsSegments, from, to, howMany);
      return;
    }

    // Change of the entire output
    var values = (type === 'change') ?
      eventArgs[0] : model._get(refList.fromSegments);
    // Set ids to empty list if output is set to null
    if (!values) {
      model._set(refList.idsSegments, []);
      return;
    }
    // If the entire output is set, create a list of ids based on the output,
    // and update the corresponding items
    var ids = setNewToValues(model, refList, values);
    model._set(refList.idsSegments, ids);
    return;
  }

  // If mutation is on a parent of `from`, we might need to re-create the
  // entire refList output
  if (segmentsLength < fromLength) {
    model._setArrayDiff(refList.fromSegments, refList.get());
    return;
  }

  var index = segments[fromLength];
  var value = model._get(refList.fromSegments.concat(index));
  var toSegments = refList.toSegmentsByItem(value);

  // Mutation underneath a child of the `from` object.
  if (segmentsLength > fromLength + 1) {
    var message = 'Mutation on descendant of refList `from` should have been dereferenced: ' + segments.join('.');
    model.emit('error', new Error(message));
    return;
  }

  // Otherwise, mutation of a child of the `from` object

  // If changing the item itself, it will also have to be re-set on the
  // original object
  if (type === 'change') {
    model._set(toSegments, value);
    updateIdForValue(model, refList, index, value);
    return;
  }
  // The same goes for string mutations, since strings are immutable
  if (type === 'stringInsert') {
    var stringIndex = eventArgs[0];
    var stringValue = eventArgs[1];
    model._stringInsert(toSegments, stringIndex, stringValue);
    updateIdForValue(model, refList, index, value);
    return;
  }
  if (type === 'stringRemove') {
    var stringIndex = eventArgs[0];
    var howMany = eventArgs[1];
    model._stringRemove(toSegments, stringIndex, howMany);
    updateIdForValue(model, refList, index, value);
    return;
  }
  if (type === 'insert' || type === 'remove' || type === 'move') {
    var message = 'Array mutation on child of refList `from` should have been dereferenced: ' + segments.join('.');
    model.emit('error', new Error(message));
    return;
  }
}

/**
 * @private
 * @param {Model} model
 * @param {RefList} refList
 * @param {Array} values
 */
function setNewToValues(model, refList, values, fn) {
  var ids = [];
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    var id = refList.idByItem(value);
    if (id === void 0 && typeof value === 'object') {
      id = value.id = model.id();
    }
    var toSegments = refList.toSegmentsByItem(value);
    if (id === void 0 || toSegments === void 0) {
      var message = 'Unable to add item to refList: ' + value;
      return model.emit('error', new Error(message));
    }
    if (model._get(toSegments) !== value) {
      model._set(toSegments, value);
    }
    ids.push(id);
  }
  return ids;
}
function updateIdForValue(model, refList, index, value) {
  var id = refList.idByItem(value);
  var outSegments = refList.idsSegments.concat(index);
  model._set(outSegments, id);
}

function patchToEvent(type, segments, eventArgs, refList) {
  var toLength = refList.toSegments.length;
  var segmentsLength = segments.length;
  var pass = eventArgs[eventArgs.length - 1];
  var model = refList.model.pass(pass, true);

  // Mutation on the `to` object itself
  if (segmentsLength === toLength) {
    if (type === 'insert') {
      var insertIndex = eventArgs[0];
      var values = eventArgs[1];
      for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var indices = refList.indicesByItem(value);
        if (!indices) continue;
        for (var j = 0; j < indices.length; j++) {
          var outSegments = refList.fromSegments.concat(indices[j]);
          model._set(outSegments, value);
        }
      }
      return;
    }

    if (type === 'remove') {
      var removeIndex = eventArgs[0];
      var values = eventArgs[1];
      var howMany = values.length;
      for (var i = removeIndex, len = removeIndex + howMany; i < len; i++) {
        var indices = refList.indicesByItem(values[i]);
        if (!indices) continue;
        for (var j = 0, indicesLen = indices.length; j < indicesLen; j++) {
          var outSegments = refList.fromSegments.concat(indices[j]);
          model._set(outSegments, void 0);
        }
      }
      return;
    }

    if (type === 'move') {
      // Moving items in the `to` object should have no effect on the output
      return;
    }
  }

  // Mutation on or above the `to` object
  if (segmentsLength <= toLength) {
    // If the entire `to` object is updated, we need to re-create the
    // entire refList output and apply what is different
    model._setArrayDiff(refList.fromSegments, refList.get());
    return;
  }

  // Mutation underneath a child of the `to` object. The item will already
  // be up to date, since it is under an object reference. Just re-emit
  if (segmentsLength > toLength + 1) {
    var value = model._get(segments.slice(0, toLength + 1));
    var indices = refList.indicesByItem(value);
    if (!indices) return;
    var remaining = segments.slice(toLength + 1);
    for (var i = 0; i < indices.length; i++) {
      var index = indices[i];
      var dereferenced = refList.fromSegments.concat(index, remaining);
      dereferenced = model._dereference(dereferenced, null, refList);
      eventArgs = eventArgs.slice();
      eventArgs[eventArgs.length - 1] = model._pass;
      model.emit(type, dereferenced, eventArgs);
    }
    return;
  }

  // Otherwise, mutation of a child of the `to` object

  // If changing the item itself, it will also have to be re-set on the
  // array created by the refList
  if (type === 'change' || type === 'load' || type === 'unload') {
    var value, previous;
    if (type === 'change') {
      value = eventArgs[0];
      previous = eventArgs[1];
    } else if (type === 'load') {
      value = eventArgs[0];
      previous = void 0;
    } else if (type === 'unload') {
      value = void 0;
      previous = eventArgs[0];
    }
    var newIndices = refList.indicesByItem(value);
    var oldIndices = refList.indicesByItem(previous);
    if (!newIndices && !oldIndices) return;
    if (oldIndices && !equivalentArrays(oldIndices, newIndices)) {
      // The changed item used to refer to some indices, but no longer does
      for (var i = 0; i < oldIndices.length; i++) {
        var outSegments = refList.fromSegments.concat(oldIndices[i]);
        model._set(outSegments, void 0);
      }
    }
    if (newIndices) {
      for (var i = 0; i < newIndices.length; i++) {
        var outSegments = refList.fromSegments.concat(newIndices[i]);
        model._set(outSegments, value);
      }
    }
    return;
  }

  var value = model._get(segments.slice(0, toLength + 1));
  var indices = refList.indicesByItem(value);
  if (!indices) return;

  // The same goes for string mutations, since strings are immutable
  if (type === 'stringInsert') {
    var stringIndex = eventArgs[0];
    var value = eventArgs[1];
    for (var i = 0; i < indices.length; i++) {
      var outSegments = refList.fromSegments(indices[i]);
      model._stringInsert(outSegments, stringIndex, value);
    }
    return;
  }
  if (type === 'stringRemove') {
    var stringIndex = eventArgs[0];
    var howMany = eventArgs[1];
    for (var i = 0; i < indices.length; i++) {
      var outSegments = refList.fromSegments(indices[i]);
      model._stringRemove(outSegments, stringIndex, howMany);
    }
    return;
  }
  if (type === 'insert' || type === 'remove' || type === 'move') {
    // Array mutations will have already been updated via an object
    // reference, so only re-emit
    for (var i = 0; i < indices.length; i++) {
      var dereferenced = refList.fromSegments.concat(indices[i]);
      dereferenced = model._dereference(dereferenced, null, refList);
      eventArgs = eventArgs.slice();
      eventArgs[eventArgs.length - 1] = model._pass;
      model.emit(type, dereferenced, eventArgs);
    }
  }
}
function equivalentArrays(a, b) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function patchIdsEvent(type, segments, eventArgs, refList) {
  var idsLength = refList.idsSegments.length;
  var segmentsLength = segments.length;
  var pass = eventArgs[eventArgs.length - 1];
  var model = refList.model.pass(pass, true);

  // An array mutation of the ids should be mirrored with a like change in
  // the output array
  if (segmentsLength === idsLength) {
    if (type === 'insert') {
      var index = eventArgs[0];
      var inserted = eventArgs[1];
      var values = [];
      for (var i = 0; i < inserted.length; i++) {
        var value = refList.itemById(inserted[i]);
        values.push(value);
      }
      model._insert(refList.fromSegments, index, values);
      return;
    }

    if (type === 'remove') {
      var index = eventArgs[0];
      var howMany = eventArgs[1].length;
      model._remove(refList.fromSegments, index, howMany);
      return;
    }

    if (type === 'move') {
      var from = eventArgs[0];
      var to = eventArgs[1];
      var howMany = eventArgs[2];
      model._move(refList.fromSegments, from, to, howMany);
      return;
    }
  }

  // Mutation on the `ids` list itself
  if (segmentsLength <= idsLength) {
    // If the entire `ids` array is updated, we need to re-create the
    // entire refList output and apply what is different
    model._setArrayDiff(refList.fromSegments, refList.get());
    return;
  }

  // Otherwise, direct mutation of a child in the `ids` object or mutation
  // underneath an item in the `ids` list. Update the item for the appropriate
  // id if it has changed
  var index = segments[idsLength];
  var id = refList.idByIndex(index);
  var item = refList.itemById(id);
  var itemSegments = refList.fromSegments.concat(index);
  if (model._get(itemSegments) !== item) {
    model._set(itemSegments, item);
  }
}

Model.prototype.refList = function() {
  var from, to, ids, options;
  if (arguments.length === 2) {
    to = arguments[0];
    ids = arguments[1];
  } else if (arguments.length === 3) {
    if (this.isPath(arguments[2])) {
      from = arguments[0];
      to = arguments[1];
      ids = arguments[2];
    } else {
      to = arguments[0];
      ids = arguments[1];
      options = arguments[2];
    }
  } else {
    from = arguments[0];
    to = arguments[1];
    ids = arguments[2];
    options = arguments[3];
  }
  var fromPath = this.path(from);
  if (Array.isArray(to)) {
    var toPath = [];
    for (var i = 0; i < to.length; i++) {
      toPath.push(this.path(to[i]));
    }
  } else {
    var toPath = this.path(to);
  }
  var idsPath = this.path(ids);
  var refList = this.root._refLists.add(fromPath, toPath, idsPath, options);
  this.pass({$refList: refList})._setArrayDiff(refList.fromSegments, refList.get());
  return this.scope(fromPath);
};

Model.prototype.removeRefList = function(from) {
  var fromPath = this.path(from);
  var refList = this.root._refLists.remove(fromPath);
  if (refList) this._del(refList.fromSegments);
};

function RefList(model, from, to, ids, options) {
  this.model = model && model.pass({$refList: this});
  this.from = from;
  this.to = to;
  this.ids = ids;
  this.fromSegments = from && from.split('.');
  this.toSegments = to && to.split('.');
  this.idsSegments = ids && ids.split('.');
  this.options = options;
  this.deleteRemoved = options && options.deleteRemoved;
}

// The default implementation assumes that the ids array is a flat list of
// keys on the to object. Ideally, this mapping could be customized via
// inheriting from RefList and overriding these methods without having to
// modify the above event handling code.
// 
// In the default refList implementation, `key` and `id` are equal.
// 
// Terms in the below methods:
//   `item`  - Object on the `to` path, which gets mirrored on the `from` path
//   `key`   - The property under `to` at which an item is located
//   `id`    - String or object in the array at the `ids` path
//   `index` - The index of an id, which corresponds to an index on `from`
RefList.prototype.get = function() {
  var ids = this.model._get(this.idsSegments);
  if (!ids) return [];
  var items = this.model._get(this.toSegments);
  var out = [];
  for (var i = 0; i < ids.length; i++) {
    var key = ids[i];
    out.push(items && items[key]);
  }
  return out;
};
RefList.prototype.dereference = function(segments, i) {
  var remaining = segments.slice(i + 1);
  var key = this.idByIndex(remaining[0]);
  if (key == null) return [];
  remaining[0] = key;
  return this.toSegments.concat(remaining);
};
RefList.prototype.toSegmentsByItem = function(item) {
  var key = this.idByItem(item);
  if (key === void 0) return;
  return this.toSegments.concat(key);
};
RefList.prototype.idByItem = function(item) {
  if (item && item.id) return item.id;
  var items = this.model._get(this.toSegments);
  for (var key in items) {
    if (item === items[key]) return key;
  }
};
RefList.prototype.indicesByItem = function(item) {
  var id = this.idByItem(item);
  var ids = this.model._get(this.idsSegments);
  if (!ids) return;
  var indices;
  var index = -1;
  while (true) {
    index = ids.indexOf(id, index + 1);
    if (index === -1) break;
    if (indices) {
      indices.push(index);
    } else {
      indices = [index];
    }
  }
  return indices;
};
RefList.prototype.itemById = function(id) {
  return this.model._get(this.toSegments.concat(id));
};
RefList.prototype.idByIndex = function(index) {
  return this.model._get(this.idsSegments.concat(index));
};
RefList.prototype.onMutation = function(type, segments, eventArgs) {
  if (util.mayImpact(this.toSegments, segments)) {
    patchToEvent(type, segments, eventArgs, this);
  } else if (util.mayImpact(this.idsSegments, segments)) {
    patchIdsEvent(type, segments, eventArgs, this);
  } else if (util.mayImpact(this.fromSegments, segments)) {
    patchFromEvent(type, segments, eventArgs, this);
  }
};

function FromMap() {}

function RefLists(model) {
  this.model = model;
  this.fromMap = new FromMap;
}

RefLists.prototype.add = function(from, to, ids, options) {
  var refList = new RefList(this.model, from, to, ids, options);
  this.fromMap[from] = refList;
  return refList;
};

RefLists.prototype.remove = function(from) {
  var refList = this.fromMap[from];
  delete this.fromMap[from];
  return refList;
};

RefLists.prototype.toJSON = function() {
  var out = [];
  for (var from in this.fromMap) {
    var refList = this.fromMap[from];
    out.push([refList.from, refList.to, refList.ids, refList.options]);
  }
  return out;
};

},{"../util":12,"./Model":29}],42:[function(require,module,exports){
var util = require('../util');
var Model = require('./Model');

Model.INITS.push(function(model) {
  var root = model.root;
  root._refs = new Refs(root);
  addIndexListeners(root);
  addListener(root, 'change', refChange);
  addListener(root, 'load', refLoad);
  addListener(root, 'unload', refUnload);
  addListener(root, 'insert', refInsert);
  addListener(root, 'remove', refRemove);
  addListener(root, 'move', refMove);
  addListener(root, 'stringInsert', refStringInsert);
  addListener(root, 'stringRemove', refStringRemove);
});

function addIndexListeners(model) {
  model.on('insert', function refInsertIndex(segments, eventArgs) {
    var index = eventArgs[0];
    var howMany = eventArgs[1].length;
    function patchInsert(refIndex) {
      return (index <= refIndex) ? refIndex + howMany : refIndex;
    }
    onIndexChange(segments, patchInsert);
  });
  model.on('remove', function refRemoveIndex(segments, eventArgs) {
    var index = eventArgs[0];
    var howMany = eventArgs[1].length;
    function patchRemove(refIndex) {
      return (index <= refIndex) ? refIndex - howMany : refIndex;
    }
    onIndexChange(segments, patchRemove);
  });
  model.on('move', function refMoveIndex(segments, eventArgs) {
    var from = eventArgs[0];
    var to = eventArgs[1];
    var howMany = eventArgs[2];
    function patchMove(refIndex) {
      // If the index was moved itself
      if (from <= refIndex && refIndex < from + howMany) {
        return refIndex + to - from;
      }
      // Remove part of a move
      if (from <= refIndex) refIndex -= howMany;
      // Insert part of a move
      if (to <= refIndex) refIndex += howMany;
      return refIndex;
    }
    onIndexChange(segments, patchMove);
  });
  function onIndexChange(segments, patch) {
    var fromMap = model._refs.fromMap;
    for (var from in fromMap) {
      var ref = fromMap[from];
      if (!(ref.updateIndices &&
        util.contains(segments, ref.toSegments) &&
        ref.toSegments.length > segments.length)) continue;
      var index = +ref.toSegments[segments.length];
      var patched = patch(index);
      if (index === patched) continue;
      model._refs.remove(from);
      ref.toSegments[segments.length] = '' + patched;
      ref.to = ref.toSegments.join('.');
      model._refs._add(ref);
    }
  }
}

function refChange(model, dereferenced, eventArgs) {
  var value = eventArgs[0];
  model._set(dereferenced, value);
}
function refLoad(model, dereferenced, eventArgs) {
  var value = eventArgs[0];
  model._set(dereferenced, value);
}
function refUnload(model, dereferenced, eventArgs) {
  model._del(dereferenced);
}
function refInsert(model, dereferenced, eventArgs) {
  var index = eventArgs[0];
  var values = eventArgs[1];
  model._insert(dereferenced, index, values);
}
function refRemove(model, dereferenced, eventArgs) {
  var index = eventArgs[0];
  var howMany = eventArgs[1].length;
  model._remove(dereferenced, index, howMany);
}
function refMove(model, dereferenced, eventArgs) {
  var from = eventArgs[0];
  var to = eventArgs[1];
  var howMany = eventArgs[2];
  model._move(dereferenced, from, to, howMany);
}
function refStringInsert(model, dereferenced, eventArgs) {
  var index = eventArgs[0];
  var text = eventArgs[1];
  model._stringInsert(dereferenced, index, text);
}
function refStringRemove(model, dereferenced, eventArgs) {
  var index = eventArgs[0];
  var howMany = eventArgs[1];
  model._stringRemove(dereferenced, index, howMany);
}

function addListener(model, type, fn) {
  model.on(type, refListener);
  function refListener(segments, eventArgs) {
    var pass = eventArgs[eventArgs.length - 1];
    // Find cases where an event is emitted on a path where a reference
    // is pointing. All original mutations happen on the fully dereferenced
    // location, so this detection only needs to happen in one direction
    var toMap = model._refs.toMap;
    for (var i = 0, len = segments.length; i < len; i++) {
      var subpath = (subpath) ? subpath + '.' + segments[i] : segments[i];
      // If a ref is found pointing to a matching subpath, re-emit on the
      // place where the reference is coming from as if the mutation also
      // occured at that path
      var refs = toMap[subpath];
      if (!refs) continue;
      var remaining = segments.slice(i + 1);
      for (var refIndex = 0, numRefs = refs.length; refIndex < numRefs; refIndex++) {
        var ref = refs[refIndex];
        var dereferenced = ref.fromSegments.concat(remaining);
        // The value may already be up to date via object reference. If so,
        // simply re-emit the event. Otherwise, perform the same mutation on
        // the ref's path
        if (pass.$original || model._get(dereferenced) === model._get(segments)) {
          model.emit(type, dereferenced, eventArgs);
        } else {
          var setterModel = ref.model.pass(pass, true);
          setterModel._dereference = noopDereference;
          fn(setterModel, dereferenced, eventArgs);
        }
      }
    }
    // If a ref points to a child of a matching subpath, get the value in
    // case it has changed and set if different
    var parentToMap = model._refs.parentToMap;
    var refs = parentToMap[subpath];
    if (!refs) return;
    for (var refIndex = 0, numRefs = refs.length; refIndex < numRefs; refIndex++) {
      var ref = refs[refIndex];
      var value = model._get(ref.toSegments);
      var previous = model._get(ref.fromSegments);
      if (previous !== value) {
        var setterModel = ref.model.pass(pass, true);
        setterModel._dereference = noopDereference;
        setterModel._set(ref.fromSegments, value);
      }
    }
  }
}

Model.prototype.ref = function() {
  var from, to, options;
  if (arguments.length === 1) {
    to = arguments[0];
  } else if (arguments.length === 2) {
    if (this.isPath(arguments[1])) {
      from = arguments[0];
      to = arguments[1];
    } else {
      to = arguments[0];
      options = arguments[1];
    }
  } else {
    from = arguments[0];
    to = arguments[1];
    options = arguments[2];
  }
  var fromPath = this.path(from);
  var toPath = this.path(to);
  var fromSegments = fromPath.split('.');
  if (fromSegments.length < 2) {
    var message = 'ref must be performed under a collection ' +
      'and document id. Invalid path: ' + fromPath;
    this.emit('error', new Error(message));
  }
  this.root._refs.remove(fromPath);
  var value = this.get(to);
  this._set(fromSegments, value);
  this.root._refs.add(fromPath, toPath, options);
  return this.scope(fromPath);
};

Model.prototype.removeRef = function(from) {
  var fromPath = this.path(from);
  this.root._refs.remove(fromPath);
  this.del(from);
};

Model.prototype.removeAllRefs = function(subpath) {
  var segments = this._splitPath(subpath);
  var refs = this.root._refs.fromMap;
  var refLists = this.root._refLists.fromMap;
  for (var from in refs) {
    if (util.contains(segments, refs[from].fromSegments)) {
      this.removeRef(from);
    }
  }
  for (var from in refLists) {
    if (util.contains(segments, refLists[from].fromSegments)) {
      this.removeRefList(from);
    }
  }
};

Model.prototype.dereference = function(subpath) {
  var segments = this._splitPath(subpath);
  return this._dereference(segments).join('.');
};

Model.prototype._dereference = function(segments, forArrayMutator, ignore) {
  if (segments.length === 0) return segments;
  var refs = this.root._refs.fromMap;
  var refLists = this.root._refLists.fromMap;
  do {
    var subpath = '';
    var doAgain = false;
    for (var i = 0, len = segments.length; i < len; i++) {
      subpath = (subpath) ? subpath + '.' + segments[i] : segments[i];

      var ref = refs[subpath];
      if (ref) {
        var remaining = segments.slice(i + 1);
        segments = ref.toSegments.concat(remaining);
        doAgain = true;
        break;
      }

      var refList = refLists[subpath];
      if (refList && refList !== ignore) {
        var belowDescendant = i + 2 < len;
        var belowChild = i + 1 < len;
        if (!(belowDescendant || forArrayMutator && belowChild)) continue;
        segments = refList.dereference(segments, i);
        doAgain = true;
        break;
      }
    }
  } while (doAgain);
  // If a dereference fails, return a path that will result in a null value
  // instead of a path to everything in the model
  if (segments.length === 0) return ['$null'];
  return segments;
};

function noopDereference(segments) {
  return segments;
}

function Ref(model, from, to, options) {
  this.model = model && model.pass({$ref: this});
  this.from = from;
  this.to = to;
  this.fromSegments = from.split('.');
  this.toSegments = to.split('.');
  this.parentTos = [];
  for (var i = 1, len = this.toSegments.length; i < len; i++) {
    var parentTo = this.toSegments.slice(0, i).join('.');
    this.parentTos.push(parentTo);
  }
  this.updateIndices = options && options.updateIndices;
}
function FromMap() {}
function ToMap() {}

function Refs(model) {
  this.model = model;
  this.fromMap = new FromMap;
  this.toMap = new ToMap;
  this.parentToMap = new ToMap;
}

Refs.prototype.add = function(from, to, options) {
  var ref = new Ref(this.model, from, to, options);
  return this._add(ref);
};

Refs.prototype._add = function(ref) {
  this.fromMap[ref.from] = ref;
  listMapAdd(this.toMap, ref.to, ref);
  for (var i = 0, len = ref.parentTos.length; i < len; i++) {
    listMapAdd(this.parentToMap, ref.parentTos[i], ref);
  }
  return ref;
};

Refs.prototype.remove = function(from) {
  var ref = this.fromMap[from];
  if (!ref) return;
  delete this.fromMap[from];
  listMapRemove(this.toMap, ref.to, ref);
  for (var i = 0, len = ref.parentTos.length; i < len; i++) {
    listMapRemove(this.parentToMap, ref.parentTos[i], ref);
  }
  return ref;
};

Refs.prototype.toJSON = function() {
  var out = [];
  for (var from in this.fromMap) {
    var ref = this.fromMap[from];
    out.push([ref.from, ref.to]);
  }
  return out;
};

function listMapAdd(map, name, item) {
  map[name] || (map[name] = []);
  map[name].push(item);
}

function listMapRemove(map, name, item) {
  var items = map[name];
  if (!items) return;
  var index = items.indexOf(item);
  if (index === -1) return;
  items.splice(index, 1);
  if (!items.length) delete map[name];
}

},{"../util":12,"./Model":29}],47:[function(require,module,exports){
var punycode = { encode : function (s) { return s } };

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

function arrayIndexOf(array, subject) {
    for (var i = 0, j = array.length; i < j; i++) {
        if(array[i] == subject) return i;
    }
    return -1;
}

var objectKeys = Object.keys || function objectKeys(object) {
    if (object !== Object(object)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in object) if (object.hasOwnProperty(key)) keys[keys.length] = key;
    return keys;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]+$/,
    // RFC 2396: characters reserved for delimiting URLs.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '~', '[', ']', '`'].concat(delims),
    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''],
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#']
      .concat(unwise).concat(autoEscape),
    nonAuthChars = ['/', '@', '?', '#'].concat(delims),
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-zA-Z0-9][a-z0-9A-Z_-]{0,62}$/,
    hostnamePartStart = /^([a-zA-Z0-9][a-z0-9A-Z_-]{0,62})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always have a path component.
    pathedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && typeof(url) === 'object' && url.href) return url;

  if (typeof url !== 'string') {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var out = {},
      rest = url;

  // cut off any delimiters.
  // This is to support parse stuff like "<http://foo.com>"
  for (var i = 0, l = rest.length; i < l; i++) {
    if (arrayIndexOf(delims, rest.charAt(i)) === -1) break;
  }
  if (i !== 0) rest = rest.substr(i);


  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    out.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      out.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {
    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    // don't enforce full RFC correctness, just be unstupid about it.

    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the first @ sign, unless some non-auth character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    var atSign = arrayIndexOf(rest, '@');
    if (atSign !== -1) {
      // there *may be* an auth
      var hasAuth = true;
      for (var i = 0, l = nonAuthChars.length; i < l; i++) {
        var index = arrayIndexOf(rest, nonAuthChars[i]);
        if (index !== -1 && index < atSign) {
          // not a valid auth.  Something like http://foo.com/bar@baz/
          hasAuth = false;
          break;
        }
      }
      if (hasAuth) {
        // pluck off the auth portion.
        out.auth = rest.substr(0, atSign);
        rest = rest.substr(atSign + 1);
      }
    }

    var firstNonHost = -1;
    for (var i = 0, l = nonHostChars.length; i < l; i++) {
      var index = arrayIndexOf(rest, nonHostChars[i]);
      if (index !== -1 &&
          (firstNonHost < 0 || index < firstNonHost)) firstNonHost = index;
    }

    if (firstNonHost !== -1) {
      out.host = rest.substr(0, firstNonHost);
      rest = rest.substr(firstNonHost);
    } else {
      out.host = rest;
      rest = '';
    }

    // pull out port.
    var p = parseHost(out.host);
    var keys = objectKeys(p);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      out[key] = p[key];
    }

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    out.hostname = out.hostname || '';

    // validate a little.
    if (out.hostname.length > hostnameMaxLen) {
      out.hostname = '';
    } else {
      var hostparts = out.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            out.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    // hostnames are always lower case.
    out.hostname = out.hostname.toLowerCase();

    // IDNA Support: Returns a puny coded representation of "domain".
    // It only converts the part of the domain name that
    // has non ASCII characters. I.e. it dosent matter if
    // you call it with a domain that already is in ASCII.
    var domainArray = out.hostname.split('.');
    var newOut = [];
    for (var i = 0; i < domainArray.length; ++i) {
      var s = domainArray[i];
      newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
          'xn--' + punycode.encode(s) : s);
    }
    out.hostname = newOut.join('.');

    out.host = (out.hostname || '') +
        ((out.port) ? ':' + out.port : '');
    out.href += out.host;
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }

    // Now make sure that delims never appear in a url.
    var chop = rest.length;
    for (var i = 0, l = delims.length; i < l; i++) {
      var c = arrayIndexOf(rest, delims[i]);
      if (c !== -1) {
        chop = Math.min(c, chop);
      }
    }
    rest = rest.substr(0, chop);
  }


  // chop off from the tail first.
  var hash = arrayIndexOf(rest, '#');
  if (hash !== -1) {
    // got a fragment string.
    out.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = arrayIndexOf(rest, '?');
  if (qm !== -1) {
    out.search = rest.substr(qm);
    out.query = rest.substr(qm + 1);
    if (parseQueryString) {
      out.query = querystring.parse(out.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    out.search = '';
    out.query = {};
  }
  if (rest) out.pathname = rest;
  if (slashedProtocol[proto] &&
      out.hostname && !out.pathname) {
    out.pathname = '/';
  }

  //to support http.request
  if (out.pathname || out.search) {
    out.path = (out.pathname ? out.pathname : '') +
               (out.search ? out.search : '');
  }

  // finally, reconstruct the href based on what has been validated.
  out.href = urlFormat(out);
  return out;
}

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (typeof(obj) === 'string') obj = urlParse(obj);

  var auth = obj.auth || '';
  if (auth) {
    auth = auth.split('@').join('%40');
    for (var i = 0, l = nonAuthChars.length; i < l; i++) {
      var nAC = nonAuthChars[i];
      auth = auth.split(nAC).join(encodeURIComponent(nAC));
    }
    auth += '@';
  }

  var protocol = obj.protocol || '',
      host = (obj.host !== undefined) ? auth + obj.host :
          obj.hostname !== undefined ? (
              auth + obj.hostname +
              (obj.port ? ':' + obj.port : '')
          ) :
          false,
      pathname = obj.pathname || '',
      query = obj.query &&
              ((typeof obj.query === 'object' &&
                objectKeys(obj.query).length) ?
                 querystring.stringify(obj.query) :
                 '') || '',
      search = obj.search || (query && ('?' + query)) || '',
      hash = obj.hash || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (obj.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  return protocol + host + pathname + search + hash;
}

function urlResolve(source, relative) {
  return urlFormat(urlResolveObject(source, relative));
}

function urlResolveObject(source, relative) {
  if (!source) return relative;

  source = urlParse(urlFormat(source), false, true);
  relative = urlParse(urlFormat(relative), false, true);

  // hash is always overridden, no matter what.
  source.hash = relative.hash;

  if (relative.href === '') {
    source.href = urlFormat(source);
    return source;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    relative.protocol = source.protocol;
    //urlParse appends trailing / to urls like http:http://www.example.com
    if (slashedProtocol[relative.protocol] &&
        relative.hostname && !relative.pathname) {
      relative.path = relative.pathname = '/';
    }
    relative.href = urlFormat(relative);
    return relative;
  }

  if (relative.protocol && relative.protocol !== source.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      relative.href = urlFormat(relative);
      return relative;
    }
    source.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      relative.pathname = relPath.join('/');
    }
    source.pathname = relative.pathname;
    source.search = relative.search;
    source.query = relative.query;
    source.host = relative.host || '';
    source.auth = relative.auth;
    source.hostname = relative.hostname || relative.host;
    source.port = relative.port;
    //to support http.request
    if (source.pathname !== undefined || source.search !== undefined) {
      source.path = (source.pathname ? source.pathname : '') +
                    (source.search ? source.search : '');
    }
    source.slashes = source.slashes || relative.slashes;
    source.href = urlFormat(source);
    return source;
  }

  var isSourceAbs = (source.pathname && source.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host !== undefined ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (source.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = source.pathname && source.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = source.protocol &&
          !slashedProtocol[source.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // source.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {

    delete source.hostname;
    delete source.port;
    if (source.host) {
      if (srcPath[0] === '') srcPath[0] = source.host;
      else srcPath.unshift(source.host);
    }
    delete source.host;
    if (relative.protocol) {
      delete relative.hostname;
      delete relative.port;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      delete relative.host;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    source.host = (relative.host || relative.host === '') ?
                      relative.host : source.host;
    source.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : source.hostname;
    source.search = relative.search;
    source.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    source.search = relative.search;
    source.query = relative.query;
  } else if ('search' in relative) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      source.hostname = source.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = source.host && arrayIndexOf(source.host, '@') > 0 ?
                       source.host.split('@') : false;
      if (authInHost) {
        source.auth = authInHost.shift();
        source.host = source.hostname = authInHost.shift();
      }
    }
    source.search = relative.search;
    source.query = relative.query;
    //to support http.request
    if (source.pathname !== undefined || source.search !== undefined) {
      source.path = (source.pathname ? source.pathname : '') +
                    (source.search ? source.search : '');
    }
    source.href = urlFormat(source);
    return source;
  }
  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    delete source.pathname;
    //to support http.request
    if (!source.search) {
      source.path = '/' + source.search;
    } else {
      delete source.path;
    }
    source.href = urlFormat(source);
    return source;
  }
  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (source.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    source.hostname = source.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = source.host && arrayIndexOf(source.host, '@') > 0 ?
                     source.host.split('@') : false;
    if (authInHost) {
      source.auth = authInHost.shift();
      source.host = source.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (source.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  source.pathname = srcPath.join('/');
  //to support request.http
  if (source.pathname !== undefined || source.search !== undefined) {
    source.path = (source.pathname ? source.pathname : '') +
                  (source.search ? source.search : '');
  }
  source.auth = relative.auth || source.auth;
  source.slashes = source.slashes || relative.slashes;
  source.href = urlFormat(source);
  return source;
}

function parseHost(host) {
  var out = {};
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    out.port = port.substr(1);
    host = host.substr(0, host.length - port.length);
  }
  if (host) out.hostname = host;
  return out;
}

},{"querystring":55}],20:[function(require,module,exports){
var racer = require('racer')
  , domShim = require('dom-shim')
  , EventDispatcher = require('./EventDispatcher')
  , viewPath = require('./viewPath')
  , escapeHtml = require('html-util').escapeHtml
  , textOt = require('./textOt')
  , merge = racer.util.merge
  , markers = {}
  , markersDirty = true
  , globalElements = {
      $_win: window
    , $_doc: document
    }
  , addListener, removeListener;

module.exports = Dom;

function Dom(model) {
  var dom = this
  var fns = this.fns

  // Map dom event name -> true
  var listenerAdded = {};
  var captureListenerAdded = {}

  // DOM listener capturing allows blur and focus to be delegated
  // http:http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
  var captureEvents = this._captureEvents = new EventDispatcher({
    onTrigger: onCaptureTrigger
  , onBind: onCaptureBind
  });
  function onCaptureTrigger(name, listener, e) {
    var id = listener.id
      , el = document.getElementById(id);

    // Remove listener if element isn't found
    if (!el) return false;

    if (el.tagName === 'HTML' || el.contains(e.target)) {
      onDomTrigger(name, listener, id, e, el);
    }
  }
  function onCaptureBind(name, listener) {
    if (captureListenerAdded[name]) return;
    addListener(document, name, captureTrigger, true);
    captureListenerAdded[name] = true;
  }

  var events = this._events = new EventDispatcher({
    onTrigger: onDomTrigger
  , onBind: onDomBind
  });
  function onDomTrigger(name, listener, id, e, el, next) {
    var delay = listener.delay
      , finish = listener.fn;

    e.path = function(name) {
      if (!name) return model.__pathMap.paths[listener.pathId];
      return viewPath.ctxPath(listener.view, listener.ctx, name);
    };
    e.get = function(name) {
      var path = e.path(name);
      return viewPath.dataValue(listener.view, listener.ctx, model, path);
    };
    e.at = function(name) {
      return model.at(e.path(name));
    };

    if (!finish) {
      // Update the model when the element's value changes
      finish = function() {
        var value = dom.getMethods[listener.method](el, listener.property)
          , setValue = listener.setValue;

        // Allow the listener to override the setting function
        if (setValue) {
          setValue(model, value);
          return;
        }

        // Remove this listener if its path id is no longer registered
        var path = model.__pathMap.paths[listener.pathId];
        if (!path) return false;

        // Set the value if changed
        if (model.get(path) === value) return;

        var setterModel = model.pass({$e: e, $el: el});
        if (listener.method === 'propOt') {
          return textOt.onTextInput(setterModel, path, value);
        }
        setterModel.set(path, value);
      }
    }

    if (delay != null) {
      setTimeout(finish, delay, e, el, next, dom);
    } else {
      finish(e, el, next, dom);
    }
  }
  function onDomBind(name, listener, eventName) {
    if (listenerAdded[eventName]) return;
    addListener(document, eventName, triggerDom, true);
    listenerAdded[eventName] = true;
  }

  function triggerDom(e, el, noBubble, continued) {
    if (!el) el = e.target;
    var prefix = e.type + ':'
      , id;

    // Next can be called from a listener to continue bubbling
    function next() {
      triggerDom(e, el.parentNode, false, true);
    }
    next.firstTrigger = !continued;
    if (noBubble && (id = el.id)) {
      return events.trigger(prefix + id, id, e, el, next);
    }
    while (true) {
      while (!(id = el.id)) {
        if (!(el = el.parentNode)) return;
      }
      // Stop bubbling once the event is handled
      if (events.trigger(prefix + id, id, e, el, next)) return;
      if (!(el = el.parentNode)) return;
    }
  }

  function captureTrigger(e) {
    captureEvents.trigger(e.type, e);
  }

  this.trigger = triggerDom;
  this.captureTrigger = captureTrigger;

  this._listeners = [];
  this._components = [];
  this._pendingUpdates = [];

  function componentCleanup() {
    var components = dom._components
      , map = getMarkers()
      , i, component
    for (i = components.length; i--;) {
      component = components[i];
      if (component && !getMarker(map, component.scope)) {
        component.emit('destroy');
      }
    }
  }
  // TODO This 'cleanup' event is never emitted; deal with later
  // This cleanup listeners is placed at the beginning so that component
  // scopes are cleared before any ref cleanups are checked
  model.listeners('cleanup').unshift(componentCleanup);
}

Dom.prototype = {
  clear: domClear
, bind: domBind
, item: domItem
, marker: domMarker
, update: domUpdate
, addListener: domAddListener
, removeListener: domRemoveListener
, addComponent: addComponent
, _setDirty: setDirty

, getMethods: {
    attr: getAttr
  , prop: getProp
  , propOt: getPropOt
  , stringInsert: getPropOt
  , stringRemove: getPropOt
  , html: getHtml
    // These methods return NaN, because it never equals anything else. Thus,
    // when compared against the new value, the new value will always be set
  , insert: getNaN
  , remove: getNaN
  , move: getNaN
  }

, setMethods: {
    attr: setAttr
  , prop: setProp
  , propOt: setPropOt
  , stringInsert: setStringInsert
  , stringRemove: setStringRemove
  , html: setHtml
  , insert: setInsert
  , remove: setRemove
  , move: setMove
  }

, fns: {
    $forChildren: forChildren
  , $forName: forName
  }
}

function domClear() {
  this._events.clear();
  this._captureEvents.clear();
  var components = this._components
    , listeners = this._listeners
    , i, component
  for (i = listeners.length; i--;) {
    removeListener.apply(null, listeners[i]);
  }
  this._listeners = [];
  for (i = components.length; i--;) {
    component = components[i];
    component && component.emit('destroy');
  }
  this._components = [];
  markers = {};
}

function domListenerHash() {
  var out = {}
    , key
  for (key in this) {
    if (key === 'view' || key === 'ctx' || key === 'pathId') continue;
    out[key] = this[key];
  }
  return out;
}

function domBind(eventName, id, listener) {
  listener.toJSON = domListenerHash;
  if (listener.capture) {
    listener.id = id;
    this._captureEvents.bind(eventName, listener);
  } else {
    this._events.bind("" + eventName + ":" + id, listener, eventName);
  }
}

function domItem(id) {
  return document.getElementById(id) || globalElements[id] || getRange(id);
}

// HACK: Crappy interface. Should refactor marker getting to be a prototype
// method and make dirty a property of dom instance
function setDirty(value) {
  markersDirty = value;
}

function domUpdate(el, method, ignore, value, property, index, arg) {
  // Wrapped in a try / catch so that errors thrown on DOM updates don't
  // stop subsequent code from running
  try {
    // Don't do anything if the element is already up to date
    if (value === this.getMethods[method](el, property)) return;
    this.setMethods[method](el, ignore, value, property, index, arg);
    markersDirty = true;
  } catch (err) {
    setTimeout(function() {
      throw err;
    }, 0);
  }
}

function domAddListener(el, name, callback, captures) {
  this._listeners.push([el, name, callback, captures]);
  addListener(el, name, callback, captures);
}
function domRemoveListener(el, name, callback, captures) {
  removeListener(el, name, callback, captures);
}

function addComponent(ctx, component) {
  var components = this._components
    , dom = component.dom = Object.create(this);

  components.push(component);
  component.on('destroy', function() {
    var index = components.indexOf(component);
    if (index === -1) return;
    // The components array gets replaced on a dom.clear, so we allow
    // it to get sparse as individual components are destroyed
    delete components[index];
  });

  dom.addListener = function(el, name, callback, captures) {
    component.on('destroy', function() {
      removeListener(el, name, callback, captures);
    });
    addListener(el, name, callback, captures);
  };

  dom.element = function(name) {
    var id = ctx.$elements[name];
    return document.getElementById(id);
  };

  return dom;
}


function getAttr(el, attr) {
  return el.getAttribute && el.getAttribute(attr);
}
function getProp(el, prop) {
  return el[prop];
}
function getPropOt(el, prop) {
  // IE and Opera replace \n with \r\n
  var value = el[prop];
  return value && value.replace && value.replace(/\r\n/g, '\n');
}
function getHtml(el) {
  return el.innerHTML;
}
function getNaN() {
  return NaN;
}

function setAttr(el, ignore, value, attr) {
  el.setAttribute && el.setAttribute(attr, value);
}
function setProp(el, ignore, value, prop) {
  el[prop] = value;
}
function setPropOt(el, ignore, value, prop) {
  el[prop] = value;
}
function setStringInsert(el, ignore, value, prop, index, text) {
  var previous = getPropOt(el, prop);
  textOt.onStringInsert(el, previous, index, text);
}
function setStringRemove(el, ignore, value, prop, index, howMany) {
  var previous = getPropOt(el, prop);
  textOt.onStringRemove(el, previous, index, howMany);
}

function makeSVGFragment(fragment, svgElement) {
  // TODO: Allow optional namespace declarations
  var pre = '<svg xmlns=http:http://www.w3.org/2000/svg xmlns:xlink=http:http://www.w3.org/1999/xlink>' 
    , post = '</svg>'
    , range = document.createRange()
  range.selectNode(svgElement);
  return range.createContextualFragment(pre + fragment + post);
}
function appendSVG(element, fragment, svgElement) {
  var frag = makeSVGFragment(fragment, svgElement)
    , children = frag.childNodes[0].childNodes
    , i
  for (i = children.length; i--;) {
    element.appendChild(children[0]);
  }
}
function insertBeforeSVG(element, fragment, svgElement) {
  var frag = makeSVGFragment(fragment, svgElement)
    , children = frag.childNodes[0].childNodes
    , parent = element.parentNode
    , i
  for (i = children.length; i--;) {
    parent.insertBefore(children[0], element);
  }
}
function removeChildren(element) {
  var children = element.childNodes
    , i
  for (i = children.length; i--;) {
    element.removeChild(children[0]);
  }
}

function isSVG(obj) {
  return !!obj.ownerSVGElement || obj.tagName === "svg";
}
function svgRoot(obj) {
  return obj.ownerSVGElement || obj;
}
function isRange(obj) {
  return !!obj.cloneRange;
}

function setHtml(obj, ignore, value, escape) {
  if (escape) value = escapeHtml(value);
  if(isRange(obj)) {
    if(isSVG(obj.startContainer)) {
      // SVG Element
      obj.deleteContents();
      var svgElement = svgRoot(obj.startContainer);
      obj.insertNode(makeSVGFragment(value, svgElement));
      return;
    } else {
      // Range
      obj.deleteContents();
      obj.insertNode(obj.createContextualFragment(value));
      return;
    }
  }
  if (isSVG(obj)) {
    // SVG Element
    var svgElement = svgRoot(obj);
    removeChildren(obj);
    appendSVG(obj, value, svgElement);
    return;
  }
  // HTML Element
  if (ignore && obj.id === ignore) return;
  obj.innerHTML = value;
}
function setInsert(obj, ignore, value, escape, index) {
  if (escape) value = escapeHtml(value);
  if (obj.nodeType) {
    // Element
    if (ref = obj.childNodes[index]) {
      if (isSVG(obj)) {
        var svgElement = obj.ownerSVGElement || obj;
        insertBeforeSVG(ref, value, svgElement);
        return;
      }
      var range = document.createRange();
      range.selectNodeContents(obj);
      obj.insertBefore(range.createContextualFragment(value), ref);
    } else {
      if (isSVG(obj)) {
        var svgElement = obj.ownerSVGElement || obj;
        appendSVG(obj, value, svgElement);
        return;
      }
      var range = document.createRange();
      range.selectNodeContents(obj);
      obj.appendChild(range.createContextualFragment(value));
    }
  } else {
    // Range
    if (isSVG(obj.startContainer)) {
      var el = obj.startContainer
      , ref = el.childNodes[obj.startOffset + index];
      var svgElement = svgRoot(ref);
      el.insertBefore(makeSVGFragment(value, svgElement), ref)
    } else {
      var el = obj.startContainer
        , ref = el.childNodes[obj.startOffset + index];
      el.insertBefore(obj.createContextualFragment(value), ref);
    }
  }
}
function setRemove(el, ignore, index) {
  if (!el.nodeType) {
    // Range
    index += el.startOffset;
    el = el.startContainer;
  }
  var child = el.childNodes[index];
  if (child) el.removeChild(child);
}
function setMove(el, ignore, from, property, to, howMany) {
  var child, fragment, nextChild, offset, ref, toEl;
  if (!el.nodeType) {
    offset = el.startOffset;
    from += offset;
    to += offset;
    el = el.startContainer;
  }
  child = el.childNodes[from];

  // Don't move if the item at the destination is passed as the ignore
  // option, since this indicates the intended item was already moved
  // Also don't move if the child to move matches the ignore option
  if (!child || ignore && (toEl = el.childNodes[to]) &&
      toEl.id === ignore || child.id === ignore) return;

  ref = el.childNodes[to > from ? to + howMany : to];
  if (howMany > 1) {
    fragment = document.createDocumentFragment();
    while (howMany--) {
      nextChild = child.nextSibling;
      fragment.appendChild(child);
      if (!(child = nextChild)) break;
    }
    el.insertBefore(fragment, ref);
    return;
  }
  el.insertBefore(child, ref);
}

function forChildren(e, el, next, dom) {
  // Prevent infinte emission
  if (!next.firstTrigger) return;

  // Re-trigger the event on all child elements
  var children = el.childNodes;
  for (var i = 0, len = children.length, child; i < len; i++) {
    child = children[i];
    if (child.nodeType !== 1) continue;  // Node.ELEMENT_NODE
    dom.trigger(e, child, true, true);
    forChildren(e, child, next, dom);
  }
}

function forName(e, el, next, dom) {
  // Prevent infinte emission
  if (!next.firstTrigger) return;

  var name = el.getAttribute('name');
  if (!name) return;

  // Re-trigger the event on all other elements with
  // the same 'name' attribute
  var elements = document.getElementsByName(name)
    , len = elements.length;
  if (!(len > 1)) return;
  for (var i = 0, element; i < len; i++) {
    element = elements[i];
    if (element === el) continue;
    dom.trigger(e, element, false, true);
  }
}

function getMarkers() {
  var map = {};
  // NodeFilter.SHOW_COMMENT == 128
  var commentIterator = document.createTreeWalker(document, 128, null, false);
  var comment;
  while (comment = commentIterator.nextNode()) {
    map[comment.data] = comment;
  }
  return map;
}

function getMarker(map, name) {
  var marker = map[name];
  if (!marker) return;

  // Comment nodes may continue to exist even if they have been removed from
  // the page. Thus, make sure they are still somewhere in the page body
  if (!document.contains(marker)) {
    delete map[name];
    return;
  }
  return marker;
}

function domMarker(name) {
  var marker = getMarker(markers, name);
  if (!marker && markersDirty) {
    markers = getMarkers();
    markersDirty = false;
    marker = getMarker(markers, name);
  }
  return marker;
}

function getRange(name) {
  var start = domMarker(name);
  if (!start) return;
  var end = domMarker('$' + name);
  if (!end) return;

  var range = document.createRange();
  range.setStartAfter(start);
  range.setEndBefore(end);
  return range;
}

if (document.addEventListener) {
  addListener = function(el, name, callback, captures) {
    el.addEventListener(name, callback, captures || false);
  };
  removeListener = function(el, name, callback, captures) {
    el.removeEventListener(name, callback, captures || false);
  };
}

},{"racer":"eS5xJL","./EventDispatcher":27,"./viewPath":56,"./textOt":44,"html-util":48,"dom-shim":57}],54:[function(require,module,exports){
var defaultFns = module.exports = new DefaultFns;

defaultFns.reverse = new FnPair(getReverse, setReverse);
defaultFns.asc = asc;
defaultFns.desc = desc;

function DefaultFns() {}
function FnPair(get, set) {
  this.get = get;
  this.set = set;
}

function getReverse(array) {
  return array && array.slice().reverse();
}
function setReverse(values) {
  return {0: getReverse(values)};
}

function asc(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
function desc(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

},{}],25:[function(require,module,exports){
(function(global){var htmlUtil = require('html-util')
var md5 = require('MD5')
var parseHtml = htmlUtil.parse
var trimText = htmlUtil.trimText
var unescapeEntities = htmlUtil.unescapeEntities
var escapeHtml = htmlUtil.escapeHtml
var escapeAttribute = htmlUtil.escapeAttribute
var isVoid = htmlUtil.isVoid
var conditionalComment = htmlUtil.conditionalComment
var markup = require('./markup')
var viewPath = require('./viewPath')
var wrapRemainder = viewPath.wrapRemainder
var ctxPath = viewPath.ctxPath
var extractPlaceholder = viewPath.extractPlaceholder
var dataValue = viewPath.dataValue
var pathFnArgs = viewPath.pathFnArgs
var isBound = viewPath.isBound
var eventBinding = require('./eventBinding')
var splitEvents = eventBinding.splitEvents
var fnListener = eventBinding.fnListener
var derby = require('./derby')

module.exports = View;

function empty() {
  return '';
}

var defaultCtx = {
  $aliases: {}
, $paths: []
, $indices: []
};

var CAMEL_REGEXP = /([a-z])([A-Z])/g;

var defaultGetFns = {
  equal: function getEqual(a, b) {
    return a === b;
  }
, not: function getNot(value) {
    return !value;
  }
, or: function getOr() {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (arg) return arg;
    };
    return arg;
  }
, and: function getAnd() {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (!arg) return arg;
    };
    return arg;
  }
, gt: function getGt(a, b) {
    return a > b;
  }
, lt: function getLt(a, b) {
    return a < b;
  }
, gte: function getGte(a, b) {
    return a >= b;
  }
, lte: function getLte(a, b) {
    return a <= b;
  }
, dash: function getDash(value) {
    return value && value
      .replace(/[:_\s]/g, '-')
      .replace(CAMEL_REGEXP, '$1-$2')
      .toLowerCase()
  }
, join: function getJoin(items, property, separator) {
    var list, i;
    if (!items) return;
    if (property) {
      list = [];
      for (i = items.length; i--;) {
        list[i] = items[i][property];
      }
    } else {
      list = items;
    }
    return list.join(separator || ', ');
  }
, log: function getLog() {
    console.log.apply(console, arguments);
  }
, trace: function getTrace() {
    console.trace();
  }
, debugger: function getDebugger() {
    debugger;
  }
, path: function getPath(name) {
    return ctxPath(this.view, this.ctx, name);
  }
, noop: function noop() {}
, lookup: viewPath.lookup
};

var defaultSetFns = {
  equal: function setEqual(value, a, b) {
    return value && [b];
  }
, not: function setNot(value) {
    return [!value];
  }
};

function View(libraries, app, appFilename) {
  this._libraries = libraries || [];
  this.app = app || {};
  this._appFilename = appFilename;
  this._inline = '';
  this.clear();
  this.getFns = derby.util.copyObject(defaultGetFns);
  this.setFns = derby.util.copyObject(defaultSetFns);
  if (this._init) this._init();
  this._idCount = 0;
  this._uncreated = [];
}
View.prototype = {
  defaultViews: {
    doctype: function() {
      return '<!DOCTYPE html>';
    }
  , root: empty
  , charset: function() {
      return '<meta charset=utf-8>';
    }
  , title$s: empty
  , head: empty
  , header: empty
  , body: empty
  , footer: empty
  , scripts: empty
  , tail: empty
  }

, _selfNs: 'app'

  // All automatically created ids start with a dollar sign
  // TODO: change this since it messes up query selectors unless escaped
, _uniqueId: uniqueId

, clear: clear
, _resetForRender: resetForRender
, make: make
, _makeAll: makeAll
, _makeComponents: makeComponents
, _findView: findView
, _find: find
, get: get
, fn: fn
, render: render
, componentsByName: componentsByName
, _componentConstructor: componentConstructor
, _flushUncreated: flushUncreated
, _beforeRender: beforeRender
, _afterRender: afterRender
, _beforeRoute: beforeRoute

, inline: empty

, escapeHtml: escapeHtml
, escapeAttribute: escapeAttribute
}

View.valueBinding = valueBinding;

function clear() {
  this._views = derby.util.copyObject(this.defaultViews);
  this._renders = {};
  this._resetForRender();
}

function resetForRender(model, componentInstances) {
  componentInstances || (componentInstances = {});
  if (model) this.model = model;
  this._componentInstances = componentInstances;
  var libraries = this._libraries
    , i
  for (i = libraries.length; i--;) {
    libraries[i].view._resetForRender(model, componentInstances);
  }
}

function componentsByName(name) {
  return this._componentInstances[name] || [];
}

function componentConstructor(name) {
  return this._selfLibrary && this._selfLibrary.constructors[name];
}

function uniqueId() {
  return '$' + (this._idCount++).toString(36);
}

function make(name, template, options, templatePath) {
  var view = this
    , isString = options && options.literal
    , noMinify = isString
    , onBind, renderer, render, matchTitle;

  if (templatePath && (render = this._renders[templatePath])) {
    this._views[name] = render;
    return
  }

  name = name.toLowerCase();
  matchTitle = /(?:^|\:)title(\$s)?$/.exec(name);
  if (matchTitle) {
    isString = !!matchTitle[1];
    if (isString) {
      onBind = function(events, name) {
        return bindEvents(events, name, render, ['$_doc', 'prop', 'title']);
      };
    } else {
      this.make(name + '$s', template, options, templatePath);
    }
  }

  render = function(ctx, model, triggerId) {
    if (!renderer) {
      renderer = parse(view, name, template, isString, onBind, noMinify);
    }
    return renderer(ctx, model, triggerId);
  }

  render.nonvoid = options && options.nonvoid;

  this._views[name] = render;
  if (templatePath) this._renders[templatePath] = render;
}

function makeAll(templates, instances) {
  var name, instance, options, templatePath;
  if (!instances) return;
  this.clear();
  for (name in instances) {
    instance = instances[name];
    templatePath = instance[0];
    options = instance[1];
    this.make(name, templates[templatePath], options, templatePath);
  }
}

function makeComponents(components) {
  var librariesMap = this._libraries.map
    , name, component, library;
  for (name in components) {
    component = components[name];
    library = librariesMap[name];
    library && library.view._makeAll(component.templates, component.instances);
  }
}

function findView(name, ns) {
  var items = this._views
    , item, i, segments, testNs;
  name = name.toLowerCase();
  if (ns) {
    ns = ns.toLowerCase();
    item = items[ns + ':' + name];
    if (item) return item;

    segments = ns.split(':');
    for (i = segments.length; i-- > 1;) {
      testNs = segments.slice(0, i).join(':');
      item = items[testNs + ':' + name];
      if (item) return item;
    }
  }
  return items[name];
}

function find(name, ns, optional) {
  var view = this._findView(name, ns);
  if (view) return view;
  if (optional) return empty;
  if (ns) name = ns + ':' + name;
  throw new Error("Can't find template: \n  " + name + '\n\n' +
    'Available templates: \n  ' + Object.keys(this._views).join('\n  ')
  );
}

function get(name, ns, ctx) {
  if (typeof ns === 'object') {
    ctx = ns;
    ns = '';
  }
  ctx = ctx ? extend(ctx, defaultCtx) : derby.util.copyObject(defaultCtx);
  this.app.model = this.model;
  ctx.$fnCtx = [this.app];
  ctx.$pathIds = {};
  return this._find(name, ns)(ctx);
}

function fn(name, value) {
  if (typeof name === 'object') {
    for (var k in name) {
      this.fn(k, name[k]);
    }
    return;
  }
  var get, set;
  if (typeof value === 'object') {
    get = value.get;
    set = value.set;
  } else {
    get = value;
  }
  this.getFns[name] = get;
  if (set) this.setFns[name] = set;
}

function emitRender(view, ns, ctx, name) {
  if (view.isServer) return;
  view.app.emit(name, ctx);
  if (ns) view.app.emit(name + ':' + ns, ctx);
}
function beforeRender(model, ns, ctx) {
  ctx = (ctx && Object.create(ctx)) || {};
  ctx.$ns = ns;
  emitRender(this, ns, ctx, 'pre:render');
  return ctx;
}
function afterRender(ns, ctx) {
  emitRender(this, ns, ctx, 'render');
}
function beforeRoute() {
  this.app.dom.clear();
  // Remove all data, refs, listeners, and reactive functions
  // for the previous page
  var silentModel = this.model.silent();
  silentModel.destroy('_page');
  silentModel.destroy('$components');
  // Unfetch and unsubscribe from all queries and documents
  silentModel.unload();
  var lastRender = this._lastRender;
  if (!lastRender) return;
  emitRender(this, lastRender.ns, lastRender.ctx, 'replace');
}

function render(model, ns, ctx, renderHash) {
  if (typeof ns === 'object') {
    renderHash = ctx;
    ctx = ns;
    ns = '';
  }
  this.model = model;

  if (!ctx.$isServer) ctx = this._beforeRender(model, ns, ctx);
  this._lastRender = {
    ns: ns
  , ctx: ctx
  };

  this._resetForRender();
  model.__pathMap.clear();
  model.__events.clear();
  model.__blockPaths = {};
  this.app.dom.clear();
  model.silent().destroy('$components');

  var title = this.get('title$s', ns, ctx)
    , headHtml = this.get('head', ns, ctx)
    , rootHtml = this.get('root', ns, ctx)
    , bodyHtml = this.get('header', ns, ctx) +
        this.get('body', ns, ctx) +
        this.get('footer', ns, ctx)
    , doc = window.document
    , err

  if (renderHash) {
    // Check hashes in development to help find rendering bugs
    if (renderHash === md5(bodyHtml)) {
      this._flushUncreated();
      return;
    }
    err = new Error('Server and client page renders do not match');
    setTimeout(function() {
      throw err;
    }, 0);
  } else if (ctx.$isServer) {
    // Don't finish rendering client side on the very first load, since
    // the page should already have the same HTML from the server
    this._flushUncreated();
    return;
  }

  var documentElement = doc.documentElement
    , attrs = documentElement.attributes
    , i, attr, fakeRoot, body;

  // Remove all current attributes on the documentElement and replace
  // them with the attributes in the rendered rootHtml
  for (i = attrs.length; i--;) {
    attr = attrs[i];
    documentElement.removeAttribute(attr.name);
  }
  // Using the DOM to get the attributes on an <html> tag would require
  // some sort of iframe hack until DOMParser has better browser support.
  // String parsing the html should be simpler and more efficient
  parseHtml(rootHtml, {
    start: function(tag, tagName, attrs) {
      if (tagName !== 'html') return;
      for (var attr in attrs) {
        documentElement.setAttribute(attr, attrs[attr]);
      }
    }
  });

  fakeRoot = doc.createElement('html');
  fakeRoot.innerHTML = bodyHtml;
  body = fakeRoot.getElementsByTagName('body')[0];
  documentElement.replaceChild(body, doc.body);
  doc.title = title;

  this.app.dom._setDirty(true);
  this._flushUncreated();
  this._afterRender(ns, ctx);
}


function extend(parent, obj) {
  var out = Object.create(parent)
    , key;
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return out;
  }
  for (key in obj) {
    out[key] = obj[key];
  }
  return out;
}

function modelListener(params, triggerId, blockPaths, pathId, partial, ctx, saveBlockPath) {
  var listener = typeof params === 'function'
    ? params(triggerId, blockPaths, saveBlockPath && pathId)
    : params;
  listener.partial = partial;
  listener.ctx = ctx.$stringCtx || ctx;
  return listener;
}

function bindPathEvent(events, bindName, getName, partial, params, saveBlockPath) {
  events.push(function(ctx, modelEvents, dom, pathMap, view, blockPaths, triggerId) {
    var path = ctxPath(view, ctx, bindName)
    if (!path) return;
    var pathId = pathMap.id(path);
    var listener = modelListener(params, triggerId, blockPaths, pathId, partial, ctx, saveBlockPath);
    if (bindName !== getName) {
      listener.getValue = function(model) {
        return dataValue(view, ctx, model, getName);
      };
    }
    modelEvents.bind(pathId, listener);
  });
}
function bindEachPathEvent(events, name, getName, partial, params) {
  var bracketIndex = name.indexOf('[');
  if (~bracketIndex) {
    // Bind to each of the items inside brackets
    var paths = viewPath.squareBracketsArgs(name);
    for (var i = paths.length; i--;) {
      bindEachPathEvent(events, paths[i], getName, partial, params);
    }
    // Bind to anything under the root. This ins't very efficent, but it
    // should cover various cases that would require updating the bindings
    // when the arguments inside of the brackets change, which I don't feel
    // like figuring out at the moment
    var before = name.slice(0, bracketIndex);
    if (before) bindEachPathEvent(events, before + '*', getName, partial, params);
    return;
  }
  var match = /(\.*)(.*)/.exec(name);
  var prefix = match[1] || '';
  var relativeName = match[2] || '';
  var segments = relativeName.split('.');
  // This loop stops before reaching zero
  var saveBlockPath = true;
  for (var i = segments.length; i; i--) {
    var bindName = prefix + segments.slice(0, i).join('.');
    bindPathEvent(events, bindName, getName, partial, params, saveBlockPath);
    saveBlockPath = false;
  }
}
function bindEvents(events, name, partial, params) {
  if (~name.indexOf('(')) {
    var args = pathFnArgs(name);
    for (var i = args.length; i--;) {
      bindEachPathEvent(events, args[i] + '*', name, partial, params);
    }
    return;
  }
  bindEachPathEvent(events, name, name, partial, params);
}

function bindEventsById(events, name, partial, attrs, method, prop, blockType) {
  function params(triggerId, blockPaths, pathId) {
    var id = attrs._id || attrs.id;
    if (blockType && pathId) {
      blockPaths[id] = {id: pathId, type: blockType};
    }
    return [id, method, prop];
  }
  bindEvents(events, name, partial, params);
}

function bindEventsByIdString(events, name, partial, attrs, method, prop) {
  function params(triggerId) {
    var id = triggerId || attrs._id || attrs.id;
    return [id, method, prop];
  }
  bindEvents(events, name, partial, params);
}

function addId(view, attrs) {
  if (attrs.id == null) {
    attrs.id = function() {
      return attrs._id = view._uniqueId();
    };
  }
}

function pushValue(html, i, value, isAttr) {
  if (typeof value === 'function') {
    i = html.push(value, '') - 1;
  } else {
    html[i] += isAttr ? escapeAttribute(value) : value;
  }
  return i;
}

function reduceStack(stack) {
  var html = ['']
    , i = 0
    , attrs, bool, item, key, value, j, len;

  for (j = 0, len = stack.length; j < len; j++) {
    item = stack[j];
    switch (item[0]) {
      case 'start':
        html[i] += '<' + item[1];
        attrs = item[2];
        // Make sure that the id attribute is rendered first
        if ('id' in attrs) {
          html[i] += ' id=';
          i = pushValue(html, i, attrs.id, true);
        }
        for (key in attrs) {
          if (key === 'id') continue;
          value = attrs[key];
          if (value != null) {
            if (bool = value.bool) {
              i = pushValue(html, i, bool);
              continue;
            }
            html[i] += ' ' + key + '=';
            i = pushValue(html, i, value, true);
          } else {
            html[i] += ' ' + key;
          }
        }
        html[i] += '>';
        break;
      case 'text':
        i = pushValue(html, i, item[1]);
        break;
      case 'end':
        html[i] += '</' + item[1] + '>';
        break;
      case 'marker':
        html[i] += '<!--' + item[1];
        i = pushValue(html, i, item[2].id);
        html[i] += '-->';
    }
  }
  return html;
}

function renderer(view, items, events, onRender) {
  return function(ctx, model, triggerId) {
    if (!model) model = view.model;  // Needed, since model parameter is optional

    if (onRender) ctx = onRender(ctx);

    var html = '';
    for (var i = 0, len = items.length; i < len; i++) {
      item = items[i];
      html += (typeof item === 'function') ? item(ctx, model) || '' : item;
    }
    if (view.isServer) return html;

    var pathMap = model.__pathMap;
    var modelEvents = model.__events;
    var blockPaths = model.__blockPaths;
    var dom = global.DERBY && global.DERBY.app.dom;
    // Note that the events array can grow during rendering
    var i = 0;
    var event;
    while (event = events[i++]) {
      event(ctx, modelEvents, dom, pathMap, view, blockPaths, triggerId);
    }
    return html;
  }
}

function bindComponentEvent(component, name, listener) {
  if (name === 'init' || name === 'create') {
    component.once(name, listener.fn);
  } else {
    // Extra indirection allows listener to overwrite itself after first run
    component.on(name, function() {
      listener.fn.apply(null, arguments);
    });
  }
}
function bindComponentEvents(ctx, component, events) {
  var view = events.$view
    , items = events.$events
    , listenerCtx = Object.create(ctx)
    , i, item, name, listener
  // The fnCtx will include this component, but we want to emit
  // on the parent component or app
  listenerCtx.$fnCtx = listenerCtx.$fnCtx.slice(0, -1);
  for (i = items.length; i--;) {
    item = items[i];
    name = item[0];
    listener = fnListener(view, listenerCtx, item[2]);
    bindComponentEvent(component, name, listener);
  }
}

function createComponent(view, model, Component, scope, ctx, macroCtx) {
  var scoped = model.scope(scope);
  var marker = '<!--' + scope + '-->';
  var prefix = scope + '.';
  var component = new Component(scoped, scope);
  var parentFnCtx = model.__fnCtx || ctx.$fnCtx;
  var silentCtx = Object.create(ctx);
  silentCtx.$silent = true;
  var silentModel = model.silent();
  var i, key, path, value, instanceName, instances;

  ctx.$fnCtx = model.__fnCtx = parentFnCtx.concat(component);

  // HACK: Ensure that scoped model has something set
  scoped.set('$null', null);

  for (key in macroCtx) {
    value = macroCtx[key];
    if (key === 'bind') {
      bindComponentEvents(ctx, component, value);
      continue;
    }
    if (value && value.$matchName) {
      path = ctxPath(view, ctx, value.$matchName);
      if (value.$bound) {
        silentModel.ref(prefix + key, path, {updateIndices: true});
        continue;
      }
      value = dataValue(view, ctx, model, path);
      silentModel.set(prefix + key, value);
      continue;
    }
    // TODO: Figure out how to get value of templatized attributes
    if (typeof value === 'function') continue;
    silentModel.set(prefix + key, value);
  }

  instanceName = scoped.get('name');
  if (instanceName) {
    instances = view._componentInstances[instanceName] ||
      (view._componentInstances[instanceName] = []);
    instances.push(component);
  }

  if (component.init) component.init(scoped);
  component.emit('init', component);

  if (view.isServer || ctx.$silent) return marker;

  var app = global.DERBY && global.DERBY.app
    , dom = app.dom
  component.dom = dom;
  component.history = app.history;

  var uncreated = new UncreatedComponent(component, scoped, dom, scope, ctx);
  view._uncreated.push(uncreated);

  return marker;
}

function UncreatedComponent(component, model, dom, scope, ctx) {
  this.component = component;
  this.model = model;
  this.dom = dom;
  this.scope = scope;
  this.ctx = ctx;
}
UncreatedComponent.prototype.create = function() {
  // TODO: Figure out underlying issue and remove
  // If for some reason, component's scoped model does not have any data,
  // do nothing. Not sure why it would get to this state, but it does.
  if (!this.model.get()) return;

  // Destroy in case component was created and replaced within rendering
  if (!this.dom.marker(this.scope)) {
    this.component.emit('destroy');
    return;
  }

  this.dom.addComponent(this.ctx, this.component);
  if (this.component.create) this.component.create(this.model, this.component.dom);
  this.component.emit('create', this.component);
};

function flushUncreated() {
  var uncreated;
  while (uncreated = this._uncreated.shift()) {
    uncreated.create();
  }
};

function extendCtx(view, ctx, value, name, alias, isEach) {
  var path = ctxPath(view, ctx, name)
    , aliases;
  ctx = extend(ctx, value);
  ctx['this'] = value;
  if (alias) {
    aliases = ctx.$aliases = Object.create(ctx.$aliases);
    aliases[alias] = ctx.$paths.length;
    if (isEach) aliases[alias]++;
  }
  if (path) {
    ctx.$paths = [path].concat(ctx.$paths);
  }
  ctx.$pathIds = Object.create(ctx.$pathIds);
  return ctx;
}

function partialValue(view, ctx, model, name, value, listener) {
  if (listener) return value;
  return name ? dataValue(view, ctx, model, name) : true;
}

function partialFn(view, name, type, alias, render, ns, macroCtx) {
  function partialBlock (ctx, model, triggerId, value, index, listener) {
    // Inherit & render attribute context values
    var renderMacroCtx = {}
      , parentMacroCtx = ctx.$macroCtx
      , mergedMacroCtx = macroCtx
      , key, val, matchName
    if (macroCtx.inherit) {
      mergedMacroCtx = {};
      derby.util.mergeInto(mergedMacroCtx, parentMacroCtx);
      derby.util.mergeInto(mergedMacroCtx, macroCtx);
      delete mergedMacroCtx.inherit;
    }
    for (key in mergedMacroCtx) {
      val = mergedMacroCtx[key];
      if (val && val.$matchName) {
        matchName = ctxPath(view, ctx, val.$matchName);
        if (matchName.charAt(0) === '@') {
          val = dataValue(view, ctx, model, matchName);
        } else {
          val = derby.util.copyObject(val);
          val.$matchName = matchName;
        }
      }
      renderMacroCtx[key] = val;
    }

    // Find the appropriate partial template
    var partialNs, partialName, partialOptional, arr;
    if (name === 'derby:view') {
      partialNs = mergedMacroCtx.ns || view._selfNs;
      partialName = mergedMacroCtx.view;
      partialOptional = mergedMacroCtx.optional;
      if (!partialName) throw new Error('<derby:view> tag without a "view" attribute')
      if (partialNs.$matchName) {
        partialNs = dataValue(view, ctx, model, partialNs.$matchName);
      }
      if (partialName.$matchName) {
        partialName = dataValue(view, ctx, model, partialName.$matchName);
      }
    } else {
      arr = splitPartial(name);
      partialNs = arr[0];
      partialName = arr[1];
    }
    // This can happen when using <derby:view view={{...}}>
    if (typeof partialName === 'function') {
      partialName = partialName(Object.create(ctx), model);
    }
    var partialView = nsView(view, partialNs)
      , render = partialView._find(partialName, ns, partialOptional)
      , Component = partialView._componentConstructor(partialName)
      , renderCtx, scope, out, marker

    // Prepare the context for rendering
    if (Component) {
      scope = '$components.' + view._uniqueId();
      renderCtx = extendCtx(view, ctx, null, scope, 'self');
      renderCtx.$elements = {};
      marker = createComponent(view, model, Component, scope, renderCtx, renderMacroCtx);
    } else {
      renderCtx = Object.create(ctx);
    }
    renderCtx.$macroCtx = renderMacroCtx;

    out = render(renderCtx, model);
    if (Component) {
      if (model.__fnCtx) {
        model.__fnCtx = model.__fnCtx.slice(0, -1);
      }
      out = marker + out;
    }
    return out;
  }

  function withBlock(ctx, model, triggerId, value, index, listener) {
    value = partialValue(view, ctx, model, name, value, listener);
    var renderCtx = extendCtx(view, ctx, value, name, alias);
    return render(renderCtx, model);
  }

  function ifBlock(ctx, model, triggerId, value, index, listener) {
    value = partialValue(view, ctx, model, name, value, listener);
    if (!(Array.isArray(value) ? value.length : value)) return;
    var renderCtx = extendCtx(view, ctx, value, name, alias);
    return render(renderCtx, model);
  }

  function unlessBlock(ctx, model, triggerId, value, index, listener) {
    value = partialValue(view, ctx, model, name, value, listener);
    if (Array.isArray(value) ? value.length : value) return;
    var renderCtx = extendCtx(view, ctx, value, name, alias);
    return render(renderCtx, model);
  }

  function eachBlock(ctx, model, triggerId, value, index, listener) {
    value = partialValue(view, ctx, model, name, value, listener);
    var isArray = Array.isArray(value);

    if (listener && !isArray) {
      if (value === void 0) return;
      var listCtx = extendCtx(view, ctx, null, name, alias, true);
      var itemPath = listCtx.$paths[0] + '.' + index;
      var item = partialValue(view, listCtx, model, itemPath, value, listener);
      renderCtx = extend(listCtx, item);
      renderCtx['this'] = item;
      renderCtx.$indices = [index].concat(renderCtx.$indices);
      renderCtx.$index = index;
      renderCtx.$paths = [itemPath].concat(renderCtx.$paths);
      return render(renderCtx, model);
    }

    if (!isArray || !value.length) return;

    var listCtx = extendCtx(view, ctx, null, name, alias, true);

    var out = '';
    var indices = listCtx.$indices;
    var paths = listCtx.$paths;
    var basePath = paths[0];
    for (var i = 0, len = value.length; i < len; i++) {
      var item = value[i];
      var renderCtx = extend(listCtx, item);
      renderCtx['this'] = item;
      renderCtx.$indices = [i].concat(indices);
      renderCtx.$index = i;
      renderCtx.$paths = [basePath + '.' + i].concat(paths);
      out += (item === void 0) ?
        '<!--empty-->' :
        render(renderCtx, model);
    }
    return out;
  }

  var block =
      (type === 'partial') ? partialBlock
    : (type === 'with' || type === 'else') ? withBlock
    : (type === 'if' || type === 'else if') ? ifBlock
    : (type === 'unless') ? unlessBlock
    : (type === 'each') ? eachBlock
    : null

  if (!block) throw new Error('Unknown block type: ' + type);
  block.type = type;
  return block;
}

var objectToString = Object.prototype.toString;
var arrayToString = Array.prototype.toString;

function valueBinding(value) {
  return value == null ? '' :
    (value.toString === objectToString || value.toString === arrayToString) ?
    JSON.stringify(value) : value;
}

function valueText(value) {
  return valueBinding(value).toString();
}

function textFn(view, name, escape, force) {
  var filter = escape ? function(value) {
    return escape(valueText(value));
  } : valueText;
  return function(ctx, model) {
    return dataValue(view, ctx, model, name, filter, force);
  }
}

function sectionFn(view, queue) {
  var render = renderer(view, reduceStack(queue.stack), queue.events);
  var block = queue.block;
  return partialFn(view, block.name, block.type, block.alias, render);
}

function blockFn(view, sections) {
  var len = sections.length;
  if (!len) return;
  if (len === 1) {
    return sectionFn(view, sections[0]);

  } else {
    var fns = []
      , i, out;
    for (i = 0; i < len; i++) {
      fns.push(sectionFn(view, sections[i]));
    }
    out = function(ctx, model, triggerId, value, index, listener) {
      var out;
      for (i = 0; i < len; i++) {
        out = fns[i](ctx, model, triggerId, value, index, listener);
        if (out != null) return out;
      }
    }
    return out;
  }
}

function parseMarkup(type, attr, tagName, events, attrs, value) {
  var parser = markup[type][attr]
    , anyOut, anyParser, elOut, elParser, out;
  if (!parser) return;
  if (anyParser = parser['*']) {
    anyOut = anyParser(events, attrs, value);
  }
  if (elParser = parser[tagName]) {
    elOut = elParser(events, attrs, value);
  }
  out = anyOut ? extend(anyOut, elOut) : elOut;
  if (out && out.del) delete attrs[attr];
  return out;
}

function pushText(stack, text) {
  if (text) stack.push(['text', text]);
}

function pushVarFn(view, stack, fn, name, escapeFn) {
  if (fn) {
    pushText(stack, fn);
  } else {
    pushText(stack, textFn(view, name, escapeFn));
  }
}

function isPartial(view, tagName) {
  if (tagName === 'derby:view') return true;
  var split = splitPartial(tagName);
  if (!split) return false;
  var tagNs = split[0];
  return (
    tagNs === 'app' ||
    tagNs === 'lib' ||
    !!libraryForNs(view, tagNs)
  );
}

function isPartialSection(tagName) {
  return tagName.charAt(0) === '@';
}

function partialSectionName(tagName) {
  return isPartialSection(tagName) ? tagName.slice(1) : null;
}

function libraryForNs(view, ns) {
  var library = view._libraries.map[ns];
  if (library) return library;
  if (view.parent) return view.parent.view._libraries.map[ns];
}

function nsView(view, ns) {
  if (ns === view._selfNs) return view;
  if (view.parent && ns === view.parent.view._selfNs) return view.parent.view;
  var library = libraryForNs(view, ns);
  if (!library) throw new Error('No library found with namespace ' + ns);
  var partialView = library.view;
  partialView._uniqueId = function() {
    return view._uniqueId();
  };
  partialView.model = view.model;
  partialView._uncreated = view._uncreated;
  return partialView;
}

function splitPartial(partial) {
  var i = partial.indexOf(':');
  if (i === -1) return;
  var partialNs = partial.slice(0, i);
  var partialName = partial.slice(i + 1);
  return [partialNs, partialName];
}

function findComponent(view, partial, ns) {
  var arr = splitPartial(partial)
    , partialNs = arr[0]
    , partialName = arr[1]
    , partialView = nsView(view, partialNs)
  return partialView._find(partialName, ns);
}

function isVoidComponent(view, partial, ns) {
  if (partial === 'derby:view') return true;
  return !findComponent(view, partial, ns).nonvoid;
}

function pushVar(view, ns, stack, events, remainder, match, fn) {
  var name = match.name
    , partial = match.partial
    , escapeFn = match.escaped && escapeHtml
    , attr, attrs, boundOut, last, tagName, wrap;

  if (partial) {
    fn = partialFn(view, partial, 'partial', null, null, ns, match.macroCtx);
  }

  else if (match.bound) {
    last = lastItem(stack);
    wrap = match.pre ||
      !last ||
      (last[0] !== 'start') ||
      isVoid(tagName = last[1]) ||
      wrapRemainder(tagName, remainder);

    if (wrap) {
      stack.push(['marker', '', attrs = {}]);
    } else {
      attrs = last[2];
      for (attr in attrs) {
        parseMarkup('boundParent', attr, tagName, events, attrs, match);
      }
      boundOut = parseMarkup('boundParent', '*', tagName, events, attrs, match);
      if (boundOut) {
        bindEventsById(events, name, null, attrs, boundOut.method, boundOut.property);
      }
    }
    addId(view, attrs);

    if (!boundOut) {
      bindEventsById(events, name, fn, attrs, 'html', !fn && escapeFn, match.type);
    }
  }

  pushVarFn(view, stack, fn, name, escapeFn);
  if (wrap) {
    stack.push([
      'marker'
    , '$'
    , { id: function() { return attrs._id } }
    ]);
  }
}

function pushVarString(view, ns, stack, events, remainder, match, fn) {
  var name = match.name
    , escapeFn = !match.escaped && unescapeEntities;
  function bindOnce(ctx) {
    ctx.$onBind(events, name);
    bindOnce = empty;
  }
  if (match.bound) {
    events.push(function(ctx) {
      bindOnce(ctx);
    });
  }
  pushVarFn(view, stack, fn, name, escapeFn);
}

function parseMatchError(text, message) {
  throw new Error(message + '\n\n' + text + '\n');
}

function onBlock(start, end, block, queues, callbacks) {
  var lastQueue, queue;
  if (end) {
    lastQueue = queues.pop();
    queue = lastItem(queues);
    queue.sections.push(lastQueue);
  } else {
    queue = lastItem(queues);
  }

  if (start) {
    queue = {
      stack: []
    , events: []
    , block: block
    , sections: []
    };
    queues.push(queue);
    callbacks.onStart(queue);
  } else {
    if (end) {
      callbacks.onStart(queue);
      callbacks.onEnd(queue.sections);
      queue.sections = [];
    } else {
      callbacks.onContent(block);
    }
  }
}

function parseMatch(text, match, queues, callbacks) {
  var hash = match.hash
    , type = match.type
    , name = match.name
    , block = lastItem(queues).block
    , blockType = block && block.type
    , startBlock, endBlock;

  if (type === 'if' || type === 'unless' || type === 'each' || type === 'with') {
    if (hash === '#') {
      startBlock = true;
    } else if (hash === '/') {
      endBlock = true;
    } else {
      parseMatchError(text, type + ' blocks must begin with a #');
    }

  } else if (type === 'else' || type === 'else if') {
    if (hash) {
      parseMatchError(text, type + ' blocks may not start with ' + hash);
    }
    if (blockType !== 'if' && blockType !== 'else if' &&
        blockType !== 'unless' && blockType !== 'each') {
      parseMatchError(text, type + ' may only follow `if`, `else if`, `unless`, or `each`');
    }
    startBlock = true;
    endBlock = true;

  } else if (hash === '/') {
    endBlock = true;

  } else if (hash === '#') {
    parseMatchError(text, '# must be followed by `if`, `unless`, `each`, or `with`');
  }

  if (endBlock && !block) {
    parseMatchError(text, 'Unmatched template end tag');
  }

  onBlock(startBlock, endBlock, match, queues, callbacks);
}

function parseAttr(view, viewName, events, tagName, attrs, attr) {
  var value = attrs[attr];
  if (typeof value === 'function') return;

  var attrOut = parseMarkup('attr', attr, tagName, events, attrs, value) || {}
    , boundOut, match, name, render, method, property;
  if (attrOut.addId) addId(view, attrs);

  if (match = extractPlaceholder(value)) {
    name = match.name;

    if (match.pre || match.post) {
      // Attributes must be a single string, so create a string partial
      addId(view, attrs);
      render = parse(view, viewName, value, true, function(events, name) {
        bindEventsByIdString(events, name, render, attrs, 'attr', attr);
      });

      attrs[attr] = attr === 'id' ? function(ctx, model) {
        return attrs._id = escapeAttribute(render(ctx, model));
      } : function(ctx, model) {
        return escapeAttribute(render(ctx, model));
      }
      return;
    }

    if (match.bound) {
      boundOut = parseMarkup('bound', attr, tagName, events, attrs, match) || {};
      addId(view, attrs);
      method = boundOut.method || 'attr';
      property = boundOut.property || attr;
      bindEventsById(events, name, null, attrs, method, property);
    }

    if (!attrOut.del) {
      attrs[attr] = attrOut.bool ? {
        bool: function(ctx, model) {
          return (dataValue(view, ctx, model, name)) ? ' ' + attr : '';
        }
      } : textFn(view, name, escapeAttribute, true);
    }
  }
}

function parsePartialAttr(view, viewName, events, attrs, attr) {
  var value = attrs[attr]
    , match;

  if (!value) {
    // A true boolean attribute will have a value of null
    if (value === null) attrs[attr] = true;
    return;
  }

  if (attr === 'bind') {
    attrs[attr] = {$events: splitEvents(value), $view: view};
    return;
  }

  if (match = extractPlaceholder(value)) {
    // This attribute needs to be treated as a section
    if (match.pre || match.post) return true;

    attrs[attr] = {$matchName: match.name, $bound: match.bound};

  } else if (value === 'true') {
    attrs[attr] = true;
  } else if (value === 'false') {
    attrs[attr] = false;
  } else if (value === 'null') {
    attrs[attr] = null;
  } else if (!isNaN(value)) {
    attrs[attr] = +value;
  } else if (/^[{[]/.test(value)) {
    try {
      attrs[attr] = JSON.parse(value)
    } catch (err) {}
  }
}

function lastItem(arr) {
  return arr[arr.length - 1];
}

function parse(view, viewName, template, isString, onBind, noMinify) {
  var queues, stack, events, onRender, push;

  queues = [{
    stack: stack = []
  , events: events = []
  , sections: []
  }];

  function onStart(queue) {
    stack = queue.stack;
    events = queue.events;
  }

  if (isString) {
    push = pushVarString;
    onRender = function(ctx) {
      if (ctx.$stringCtx) return ctx;
      ctx = Object.create(ctx);
      ctx.$onBind = onBind;
      ctx.$stringCtx = ctx;
      return ctx;
    }
  } else {
    push = pushVar;
  }

  var index = viewName.lastIndexOf(':')
    , ns = ~index ? viewName.slice(0, index) : ''

  function parseStart(tag, tagName, attrs) {
    var attr, block, out, parser, isSection, attrBlock
    if ('x-no-minify' in attrs) {
      delete attrs['x-no-minify'];
      noMinify = true;
    }

    if (isPartial(view, tagName)) {
      block = {
        partial: tagName
      , macroCtx: attrs
      };
      onBlock(true, false, block, queues, {onStart: onStart});

      for (attr in attrs) {
        isSection = parsePartialAttr(view, viewName, events, attrs, attr);
        if (!isSection) continue;
        attrBlock = {
          partial: '@' + attr
        , macroCtx: lastItem(queues).block.macroCtx
        };
        onBlock(true, false, attrBlock, queues, {onStart: onStart});
        parseText(attrs[attr]);
        parseEnd(tag, '@' + attr);
      }

      if (isVoidComponent(view, tagName, ns)) {
        onBlock(false, true, null, queues, {
          onStart: onStart
        , onEnd: function(queues) {
            push(view, ns, stack, events, '', block);
          }
        })
      }
      return;
    }

    if (isPartialSection(tagName)) {
      block = {
        partial: tagName
      , macroCtx: lastItem(queues).block.macroCtx
      };
      onBlock(true, false, block, queues, {onStart: onStart});
      return;
    }

    if (parser = markup.element[tagName]) {
      out = parser(events, attrs);
      if (out != null ? out.addId : void 0) {
        addId(view, attrs);
      }
    }

    for (attr in attrs) {
      parseAttr(view, viewName, events, tagName, attrs, attr);
    }
    stack.push(['start', tagName, attrs]);
  }

  function parseText(text, isRawText, remainder) {
    var match = extractPlaceholder(text)
      , post, pre;
    if (!match || isRawText) {
      if (!noMinify) {
        text = isString ? unescapeEntities(trimText(text)) : trimText(text);
      }
      pushText(stack, text);
      return;
    }

    pre = match.pre;
    post = match.post;
    if (isString) pre = unescapeEntities(pre);
    pushText(stack, pre);
    remainder = post || remainder;

    parseMatch(text, match, queues, {
      onStart: onStart
    , onEnd: function(sections) {
        var fn = blockFn(view, sections);
        push(view, ns, stack, events, remainder, sections[0].block, fn);
      }
    , onContent: function(match) {
        push(view, ns, stack, events, remainder, match);
      }
    });

    if (post) return parseText(post);
  }

  function parseEnd(tag, tagName) {
    var sectionName = partialSectionName(tagName)
      , endsPartial = isPartial(view, tagName)
    if (endsPartial && isVoidComponent(view, tagName, ns)) {
      throw new Error('End tag "' + tag + '" is not allowed for void component')
    }
    if (sectionName || endsPartial) {
      onBlock(false, true, null, queues, {
        onStart: onStart
      , onEnd: function(queues) {
          var queue = queues[0]
            , block = queue.block
            , fn = renderer(view, reduceStack(queue.stack), queue.events)
          fn.unescaped = true;
          if (sectionName) {
            block.macroCtx[sectionName] = fn;
            return;
          }
          // Put the remaining content not in a section in the default "content" section,
          // unless "inherit" is specified and there is no content, so that the parent
          // content can be inherited
          if (queue.stack.length || !block.macroCtx.inherit) {
            block.macroCtx.content = fn;
          }
          push(view, ns, stack, events, '', block);
        }
      })
      return;
    }
    stack.push(['end', tagName]);
  }

  if (isString) {
    parseText(template);
  } else {
    parseHtml(template, {
      start: parseStart
    , text: parseText
    , end: parseEnd
    , comment: function(tag) {
        if (conditionalComment(tag)) pushText(stack, tag);
      }
    , other: function(tag) {
        pushText(stack, tag);
      }
    });
  }
  return renderer(view, reduceStack(stack), events, onRender);
}

})(window)
},{"./markup":58,"./viewPath":56,"./eventBinding":59,"./derby":"dhy1vc","html-util":48,"MD5":60}],58:[function(require,module,exports){
var eventBinding = require('./eventBinding')
  , splitEvents = eventBinding.splitEvents
  , containsEvent = eventBinding.containsEvent
  , addDomEvent = eventBinding.addDomEvent
  , TEXT_EVENTS = 'keyup,keydown/0,cut/0,paste/0,dragover/0,blur'
  , AUTOCOMPLETE_OFF = {
      checkbox: true
    , radio: true
    }
  , onBindA, onBindForm;

module.exports = {
  bound: {
    'value': {
      'input': function(events, attrs, match) {
        var type = attrs.type
          , eventNames, method;
        if (type === 'radio' || type === 'checkbox') return;
        if (type === 'range' || 'x-blur' in attrs) {
          // Only update after the element loses focus
          delete attrs['x-blur'];
          eventNames = 'change,blur';
        } else {
          // By default, update as the user types
          eventNames = TEXT_EVENTS;
        }
        if ('x-atomic' in attrs) {
          delete attrs['x-atomic'];
          method = 'prop';
        } else if (type === 'text' || !type) {
          method = 'propOt';
        } else {
          method = 'prop';
        }
        addDomEvent(events, attrs, eventNames, match, {
          method: method
        , property: 'value'
        });
        return {method: method};
      }
    }

  , 'checked': {
      '*': function(events,  attrs, match) {
        addDomEvent(events, attrs, 'change', match, {
          method: 'prop'
        , property: 'checked'
        });
        return {method: 'prop'};
      }
    }

  , 'selected': {
      '*': function(events, attrs, match) {
        addDomEvent(events, attrs, 'change', match, {
          method: 'prop'
        , property: 'selected'
        });
        return {method: 'prop'};
      }
    }

  , 'disabled': {
      '*': function() {
        return {method: 'prop'};
      }
    }
  }

, boundParent: {
    'contenteditable': {
      '*': function(events, attrs, match) {
        addDomEvent(events, attrs, TEXT_EVENTS, match, {
          method: 'html'
        });
      }
    }

  , '*': {
      'textarea': function(events, attrs, match) {
        if ('x-atomic' in attrs) {
          delete attrs['x-atomic'];
          var method = 'prop';
        } else {
          var method = 'propOt';
        }
        addDomEvent(events, attrs, TEXT_EVENTS, match, {
          method: method
        , property: 'value'
        });
        return {method: method, property: 'value'};
      }
    }
  }

, element: {
    'select': function(events, attrs) {
      // Distribute change event to child nodes of select elements
      addDomEvent(events, attrs, 'change:$forChildren');
      return {addId: true};
    }

  , 'input': function(events, attrs) {
      if (AUTOCOMPLETE_OFF[attrs.type] && !('autocomplete' in attrs)) {
        attrs.autocomplete = 'off';
      }
      if (attrs.type === 'radio') {
        // Distribute change events to other elements with the same name
        addDomEvent(events, attrs, 'change:$forName');
      }
    }
  }

, attr: {
    'x-bind': {
      '*': function(events, attrs, eventNames) {
        addDomEvent(events, attrs, eventNames);
        return {addId: true, del: true};
      }

    , 'a': onBindA = function(events, attrs, eventNames) {
        if (containsEvent(eventNames, ['click', 'focus']) && !('href' in attrs)) {
          attrs.href = '#';
          if (!('onclick' in attrs)) {
            attrs.onclick = 'return false';
          }
        }
      }

    , 'form': onBindForm = function(events, attrs, eventNames) {
        if (containsEvent(eventNames, 'submit')) {
          if (!('onsubmit' in attrs)) {
            attrs.onsubmit = 'return false';
          }
        }
      }
    }

  , 'x-capture': {
      '*': function(events, attrs, eventNames) {
        addDomEvent(events, attrs, eventNames, null, {capture: true});
        return {addId: true, del: true};
      }
    , 'a': onBindA
    , 'form': onBindForm
    }

  , 'x-as': {
      '*': function(events, attrs, name) {
        events.push(function(ctx) {
          ctx.$elements[name] = attrs._id || attrs.id;
        });
        return {addId: true, del: true}
      }
  }

  , 'checked': {
      '*': function() {
        return {bool: true};
      }
    }

  , 'selected': {
      '*': function() {
        return {bool: true};
      }
    }

  , 'disabled': {
      '*': function() {
        return {bool: true};
      }
    }

  , 'autofocus': {
      '*': function() {
        return {bool: true};
      }
    }
  }

, TEXT_EVENTS: TEXT_EVENTS
, AUTOCOMPLETE_OFF: AUTOCOMPLETE_OFF
};

},{"./eventBinding":59}],59:[function(require,module,exports){
var util = require('racer').util
  , viewPath = require('./viewPath')
  , extractPlaceholder = viewPath.extractPlaceholder
  , dataValue = viewPath.dataValue
  , ctxPath = viewPath.ctxPath
  , pathFnArgs = viewPath.pathFnArgs
  , setBoundFn = viewPath.setBoundFn
  , arraySlice = [].slice

exports.splitEvents = splitEvents;
exports.fnListener = fnListener;
exports.containsEvent = containsEvent;
exports.addDomEvent = util.isServer ? empty : addDomEvent;

function splitEvents(eventNames) {
  var pairs = eventNames.split(',')
    , eventList = []
    , i, j, pair, segments, name, eventName, delay, fns, fn;
  for (i = pairs.length; i--;) {
    pair = pairs[i];
    segments = pair.split(':');
    name = segments[0].split('/');
    eventName = name[0].trim();
    delay = name[1];
    fns = (segments[1] || '').trim().split(/\s+/);
    for (j = fns.length; j--;) {
      fn = fns[j];
      fns[j] = extractPlaceholder(fn) || fn;
    }
    eventList.push([eventName, delay, fns]);
  }
  return eventList;
}

function containsEvent(eventNames, expected) {
  if (!Array.isArray(expected)) expected = [expected];
  var eventList = splitEvents(eventNames)
    , i, j, eventName
  for (i = eventList.length; i--;) {
    eventName = eventList[i][0];
    for (j = expected.length; j--;) {
      if (eventName === expected[j]) return true;
    }
  }
  return false;
}

function addDomEvent(events, attrs, eventNames, match, options) {
  var eventList = splitEvents(eventNames)
    , args, name;

  if (match) {
    name = match.name;

    if (~name.indexOf('(')) {
      args = pathFnArgs(name);
      if (!args.length) return;

      events.push(function(ctx, modelEvents, dom, pathMap, view) {
        var id = attrs._id || attrs.id
          , paths = []
          , arg, path, pathId, event, eventName, eventOptions, i, j;
        options.setValue = function(model, value) {
          return setBoundFn(view, ctx, model, name, value);
        }
        for (i = args.length; i--;) {
          arg = args[i];
          path = ctxPath(view, ctx, arg);
          paths.push(path);
          pathId = pathMap.id(path);
          for (j = eventList.length; j--;) {
            event = eventList[j];
            eventName = event[0];
            eventOptions = util.mergeInto({view: view, ctx: ctx, pathId: pathId, delay: event[1]}, options);
            dom.bind(eventName, id, eventOptions);
          }
        }
      });
      return;
    }

    events.push(function(ctx, modelEvents, dom, pathMap, view) {
      var id = attrs._id || attrs.id
        , pathId = pathMap.id(ctxPath(view, ctx, name))
        , event, eventName, eventOptions, i;
      for (i = eventList.length; i--;) {
        event = eventList[i];
        eventName = event[0];
        eventOptions = util.mergeInto({view: view, ctx: ctx, pathId: pathId, delay: event[1]}, options);
        dom.bind(eventName, id, eventOptions);
      }
    });
    return;
  }

  events.push(function(ctx, modelEvents, dom, pathMap, view) {
    var id = attrs._id || attrs.id
      , pathId = pathMap.id(ctxPath(view, ctx, '.'))
      , event, eventName, eventOptions, i;
    for (i = eventList.length; i--;) {
      event = eventList[i];
      eventName = event[0];
      eventOptions = fnListener(view, ctx, event[2], dom);
      eventOptions.delay = event[1];
      util.mergeInto(eventOptions, options);
      util.mergeInto(eventOptions, {view: view, ctx: ctx, pathId: pathId});
      dom.bind(eventName, id, eventOptions);
    }
  });
}

function eachFnListener(view, ctx, fnObj, dom) {
  var fnName, fn, fnCtxs, i, fnCtx;

  fnName = typeof fnObj === 'object'
    ? dataValue(view, ctx, view.model, fnObj.name)
    : fnName = fnObj;

  // If a placeholder for an event name does not have a value, do nothing
  if (!fnName) return empty;

  // See if it is a built-in function
  fn = dom && dom.fns[fnName];

  // Lookup the function name on the component script or app

  // TODO: This simply looks in the local scope for the function
  // and then goes up the scope if a function name is not found.
  // Better would be to actually figure out the scope of where the
  // function name is specfied, since there could easily be namespace
  // conflicts between functions in a component and functions in an
  // app using that component. How to implement this correctly is not
  // obvious at the moment.
  if (!fn) {
    fnCtxs = ctx.$fnCtx;
    for (i = fnCtxs.length; i--;) {
      fnCtx = fnCtxs[i];
      fn = fnCtx[fnName] || viewPath.lookup(fnName, fnCtx);
      if (fn) break;
    }
  }
  if (!fn) throw new Error('Bound function not found: ' + fnName);

  // Bind the listener to the app or component object on which it
  // was defined so that the `this` context will be the instance
  return fn.bind(fnCtx);
}

function fnListener(view, ctx, fnNames, dom) {
  var listener = {
    fn: function() {
      var len = fnNames.length
        , args = arraySlice.call(arguments)
        , i, fn, boundFns

      if (len === 0) {
        // Don't do anything if no handler functions were specified
        return listener.fn = empty;

      } else if (len === 1) {
        fn = eachFnListener(view, ctx, fnNames[0], dom);

      } else {
        boundFns = [];
        for (i = len; i--;) {
          boundFns.push(eachFnListener(view, ctx, fnNames[i], dom));
        }
        fn = function() {
          var args = arraySlice.call(arguments)
          for (var i = boundFns.length; i--;) {
            boundFns[i].apply(null, args);
          }
        }
      }

      listener.fn = fn;
      fn.apply(null, args);
    }
  };
  return listener;
}

function empty() {}

},{"racer":"eS5xJL","./viewPath":56}],48:[function(require,module,exports){
var entityCode = require('./entityCode')
  , parse = require('./parse')

module.exports = {
  parse: parse
, escapeHtml: escapeHtml
, escapeAttribute: escapeAttribute
, unescapeEntities: unescapeEntities
, isVoid: isVoid
, conditionalComment: conditionalComment
, trimLeading: trimLeading
, trimText: trimText
, trimTag: trimTag
, minify: minify
}

function escapeHtml(value) {
  if (value == null) return ''

  return value
    .toString()
    .replace(/&(?!\s)|</g, function(match) {
      return match === '&' ? '&amp;' : '&lt;'
    })
}

function escapeAttribute(value) {
  if (value == null || value === '') return '""'

  value = value
    .toString()
    .replace(/&(?!\s)|"/g, function(match) {
      return match === '&' ? '&amp;' : '&quot;'
    })
  return /[ =<>']/.test(value) ? '"' + value + '"' : value
}

// Based on:
// http://code.google.com/p/jslibs/wiki/JavascriptTips#Escape_and_unescape_HTML_entities
function unescapeEntities(html) {
  return html.replace(/&([^;]+);/g, function(match, entity) {
    var charCode = entity.charAt(0) === '#'
          ? entity.charAt(1) === 'x'
            ? entity.slice(2, 17)
            : entity.slice(1)
          : entityCode[entity]
    return String.fromCharCode(charCode)
  })
}

var voidElement = {
  area: 1
, base: 1
, br: 1
, col: 1
, command: 1
, embed: 1
, hr: 1
, img: 1
, input: 1
, keygen: 1
, link: 1
, meta: 1
, param: 1
, source: 1
, track: 1
, wbr: 1
}
function isVoid(name) {
  return name in voidElement
}

// Assume any HTML comment that starts with `<!--[` or ends with `]-->`
// is a conditional comment. This can also be used to keep comments in
// minified HTML, such as `<!--[ Copyright John Doe, MIT Licensed ]-->`
function conditionalComment(tag) {
  return /(?:^<!--\[)|(?:\]-->$)/.test(tag)
}

// Remove leading whitespace and newlines from a string. Whitespace at the end
// of a line will be maintained
function trimLeading(text) {
  return text ? text.replace(/\r?\n\s*/g, '') : ''
}

// Remove leading & trailing whitespace and newlines from a string
function trimText(text) {
  return text ? text.replace(/\s*\r?\n\s*/g, '') : ''
}

// Within a tag, remove leading & trailing whitespace. Keep a linebreak, since
// this could be the separator between attributes
function trimTag(tag) {
  return tag.replace(/(?:\s*\r?\n\s*)+/g, '\n')
}

// Remove linebreaks, leading & trailing space, and comments. Maintain a
// linebreak between HTML tag attributes and maintain conditional comments.
function minify(html) {
  var minified = ''
    , minifyContent = true

  parse(html, {
    start: function(tag, tagName, attrs) {
      minifyContent = !('x-no-minify' in attrs)
      minified += trimTag(tag)
    }
  , end: function(tag) {
      minified += trimTag(tag)
    }
  , text: function(text) {
      minified += minifyContent ? trimText(text) : text
    }
  , comment: function(tag) {
      if (conditionalComment(tag)) minified += tag
    }
  , other: function(tag) {
      minified += tag
    }
  })
  return minified
}

},{"./entityCode":61,"./parse":62}],52:[function(require,module,exports){
var router = module.exports = require('./router')

module.exports = {
  transition: transition
}

/**
 * @param {Function} add (e.g., app.get, app.post, etc.)
 * @param {Array} transitionCalls is an array of objects that look 
 *   like {from, to, forward, back}
 * @param {String} from
 * @param {String} to
 * @param {Function} forward
 * @param {Function} back
 */
function transition(add, calls, from, to, forward, back) {
  if (from === to) return
  for (var i = 0, len = calls.length; i < len; i++) {
    var call = calls[i]
    if (call.from === to) {
      if (hasTransition(calls, from, call.to)) continue
      var composedForward = composeCallbacks(forward, call.forward, to)
      if (back && call.back) {
        var composedBack = composeCallbacks(call.back, back, to)
      }
      add({
        from: from
      , to: call.to
      , forward: composedForward
      , back: composedBack
      })
    } else if (call.to === from) {
      if (hasTransition(calls, call.from, to)) continue
      var composedForward = composeCallbacks(call.forward, forward, from)
      if (back && call.back) {
        var composedBack = composeCallbacks(back, call.back, from)
      }
      add({
        from: call.from
      , to: to
      , forward: composedForward
      , back: composedBack
      })
    }
  }
}

function hasTransition(calls, from, to) {
  for (var i = calls.length; i--;) {
    var call = calls[i];
    if (call.from === from && call.to === to) return true
  }
  return false
}

// TODO: Async support
function composeCallbacks(first, second, intermediatePath) {
  function composed(self, model, params, next, done) {
    var intermediateUrl = router.mapRoute(intermediatePath, params)
    var url = params.url
    var skipped = false
    function wrapNext(err) {
      skipped = true
      next(err)
    }
    params.url = intermediateUrl
    if (first.length === 4) {
      first.call(self, model, params, wrapNext, doneFirst)
    } else {
      first.call(self, model, params, wrapNext)
      doneFirst()
    }
    function doneFirst() {
      if (skipped) return
      params.previous = intermediateUrl
      params.url = url
      if (second.length === 4) {
        second.call(self, model, params, next, done)
      } else {
        second.call(self, model, params, next)
        done && done()
      }
    }
  }
  // These need to be defined individually, since their
  // argument length will be checked
  function asyncComposedCallback(model, params, next, done) {
    composed(this, model, params, next, done);
  }
  function composedCallback(model, params, next) {
    composed(this, model, params, next);
  }
  return (first.length === 4 || second.length === 4) ?
    asyncComposedCallback : composedCallback;
}

},{"./router":51}],57:[function(require,module,exports){
var doc = document
  , elementProto = HTMLElement.prototype
  , nodeProto = Node.prototype

// Add support for Node.contains for Firefox < 9
if (!doc.contains) {
  nodeProto.contains = function(node) {
    return !!(this.compareDocumentPosition(node) & 16)
  }
}

// Add support for insertAdjacentHTML for Firefox < 8
// Based on insertAdjacentHTML.js by Eli Grey, http://eligrey.com
if (!doc.body.insertAdjacentHTML) {
  elementProto.insertAdjacentHTML = function(position, html) {
    var position = position.toLowerCase()
      , ref = this
      , parent = ref.parentNode
      , container = doc.createElement(parent.tagName)
      , firstChild, nextSibling, node

    container.innerHTML = html
    if (position === 'beforeend') {
      while (node = container.firstChild) {
        ref.appendChild(node)
      }
    } else if (position === 'beforebegin') {
      while (node = container.firstChild) {
        parent.insertBefore(node, ref)
      }
    } else if (position === 'afterend') {
      nextSibling = ref.nextSibling
      while (node = container.lastChild) {
        nextSibling = parent.insertBefore(node, nextSibling)
      }
    } else if (position === 'afterbegin') {
      firstChild = ref.firstChild
      while (node = container.lastChild) {
        firstChild = ref.insertBefore(node, firstChild)
      }
    }
  }
}

elementProto.matches =
  elementProto.webkitMatchesSelector ||
  elementProto.mozMatchesSelector ||
  elementProto.oMatchesSelector ||
  elementProto.msMatchesSelector

},{}],55:[function(require,module,exports){
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    };

var objectKeys = Object.keys || function objectKeys(object) {
    if (object !== Object(object)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in object) if (object.hasOwnProperty(key)) keys[keys.length] = key;
    return keys;
}


/*!
 * querystring
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Library version.
 */

exports.version = '0.3.1';

/**
 * Object#toString() ref for stringify().
 */

var toString = Object.prototype.toString;

/**
 * Cache non-integer test regexp.
 */

var notint = /[^0-9]/;

/**
 * Parse the given query `str`, returning an object.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if (null == str || '' == str) return {};

  function promote(parent, key) {
    if (parent[key].length == 0) return parent[key] = {};
    var t = {};
    for (var i in parent[key]) t[i] = parent[key][i];
    parent[key] = t;
    return t;
  }

  return String(str)
    .split('&')
    .reduce(function(ret, pair){
      try{ 
        pair = decodeURIComponent(pair.replace(/\+/g, ' '));
      } catch(e) {
        // ignore
      }

      var eql = pair.indexOf('=')
        , brace = lastBraceInKey(pair)
        , key = pair.substr(0, brace || eql)
        , val = pair.substr(brace || eql, pair.length)
        , val = val.substr(val.indexOf('=') + 1, val.length)
        , parent = ret;

      // ?foo
      if ('' == key) key = pair, val = '';

      // nested
      if (~key.indexOf(']')) {
        var parts = key.split('[')
          , len = parts.length
          , last = len - 1;

        function parse(parts, parent, key) {
          var part = parts.shift();

          // end
          if (!part) {
            if (isArray(parent[key])) {
              parent[key].push(val);
            } else if ('object' == typeof parent[key]) {
              parent[key] = val;
            } else if ('undefined' == typeof parent[key]) {
              parent[key] = val;
            } else {
              parent[key] = [parent[key], val];
            }
          // array
          } else {
            obj = parent[key] = parent[key] || [];
            if (']' == part) {
              if (isArray(obj)) {
                if ('' != val) obj.push(val);
              } else if ('object' == typeof obj) {
                obj[objectKeys(obj).length] = val;
              } else {
                obj = parent[key] = [parent[key], val];
              }
            // prop
            } else if (~part.indexOf(']')) {
              part = part.substr(0, part.length - 1);
              if(notint.test(part) && isArray(obj)) obj = promote(parent, key);
              parse(parts, obj, part);
            // key
            } else {
              if(notint.test(part) && isArray(obj)) obj = promote(parent, key);
              parse(parts, obj, part);
            }
          }
        }

        parse(parts, parent, 'base');
      // optimize
      } else {
        if (notint.test(key) && isArray(parent.base)) {
          var t = {};
          for(var k in parent.base) t[k] = parent.base[k];
          parent.base = t;
        }
        set(parent.base, key, val);
      }

      return ret;
    }, {base: {}}).base;
};

/**
 * Turn the given `obj` into a query string
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

var stringify = exports.stringify = function(obj, prefix) {
  if (isArray(obj)) {
    return stringifyArray(obj, prefix);
  } else if ('[object Object]' == toString.call(obj)) {
    return stringifyObject(obj, prefix);
  } else if ('string' == typeof obj) {
    return stringifyString(obj, prefix);
  } else {
    return prefix;
  }
};

/**
 * Stringify the given `str`.
 *
 * @param {String} str
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyString(str, prefix) {
  if (!prefix) throw new TypeError('stringify expects an object');
  return prefix + '=' + encodeURIComponent(str);
}

/**
 * Stringify the given `arr`.
 *
 * @param {Array} arr
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyArray(arr, prefix) {
  var ret = [];
  if (!prefix) throw new TypeError('stringify expects an object');
  for (var i = 0; i < arr.length; i++) {
    ret.push(stringify(arr[i], prefix + '[]'));
  }
  return ret.join('&');
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyObject(obj, prefix) {
  var ret = []
    , keys = objectKeys(obj)
    , key;
  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    ret.push(stringify(obj[key], prefix
      ? prefix + '[' + encodeURIComponent(key) + ']'
      : encodeURIComponent(key)));
  }
  return ret.join('&');
}

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (undefined === v) {
    obj[key] = val;
  } else if (isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}

},{}],56:[function(require,module,exports){
var trimLeading = require('html-util').trimLeading;

exports.wrapRemainder = wrapRemainder;
exports.extractPlaceholder = extractPlaceholder;
exports.pathFnArgs = pathFnArgs;
exports.squareBracketsArgs = squareBracketsArgs;
exports.ctxPath = ctxPath;
exports.getValue = getValue;
exports.dataValue = dataValue;
exports.setBoundFn = setBoundFn;
exports.lookup = lookup;
exports.replaceSquareBrackets = replaceSquareBrackets;

function wrapRemainder(tagName, remainder) {
  if (!remainder) return false;
  return !(new RegExp('^<\/' + tagName, 'i')).test(remainder);
}

var openPlaceholder = /^([\s\S]*?)(\{{1,3})\s*([\s\S]*)/
  , aliasContent = /^([\s\S]*)\s+as\s+:(\S+)\s*$/
  , blockContent = /^([\#\/]?)(else\sif|if|else|unless|each|with|unescaped)?\s*([\s\S]*?)\s*$/
  , closeMap = { 1: '}', 2: '}}' }
function extractPlaceholder(text) {
  var match = openPlaceholder.exec(text);
  if (!match) return;
  var pre = match[1]
    , open = match[2]
    , remainder = match[3]
    , openLen = open.length
    , bound = openLen === 1
    , end = matchBraces(remainder, openLen, 0, '{', '}')
    , endInner = end - openLen
    , inner = remainder.slice(0, endInner)
    , post = remainder.slice(end)
    , alias, hash, type, name, escaped;

  if (/["{[]/.test(inner)) {
    // Make sure that we didn't accidentally match a JSON literal
    try {
      JSON.parse(open + inner + closeMap[openLen]);
      return;
    } catch (e) {}
  }

  match = aliasContent.exec(inner);
  if (match) {
    inner = match[1];
    alias = match[2];
  }

  match = blockContent.exec(inner)
  if (!match) return;
  hash = match[1];
  type = match[2];
  name = match[3];

  escaped = true;
  if (type === 'unescaped') {
    escaped = false;
    type = '';
  }
  if (bound) name = name.replace(/\bthis\b/, '.');
  return {
    pre: pre
  , post: post
  , bound: bound
  , alias: alias
  , hash: hash
  , type: type
  , name: name
  , escaped: escaped
  , source: text
  };
}

function matchBraces(text, num, i, openChar, closeChar) {
  var close, hasClose, hasOpen, open;
  i++;
  while (num) {
    close = text.indexOf(closeChar, i);
    open = text.indexOf(openChar, i);
    hasClose = ~close;
    hasOpen = ~open;
    if (hasClose && (!hasOpen || (close < open))) {
      i = close + 1;
      num--;
      continue;
    } else if (hasOpen) {
      i = open + 1;
      num++;
      continue;
    } else {
      return -1;
    }
  }
  return i;
}

var fnCall = /^([^(]+)\s*\(\s*([\s\S]*?)\s*\)\s*$/
  , argSeparator = /\s*([,(])\s*/g
  , notSeparator = /[^,\s]/g
  , notPathArg = /(?:^['"\d\-[{])|(?:^null$)|(?:^true$)|(?:^false$)/;

function fnArgs(inner) {
  var args = []
    , lastIndex = 0
    , match, end, last;
  while (match = argSeparator.exec(inner)) {
    if (match[1] === '(') {
      end = matchBraces(inner, 1, argSeparator.lastIndex, '(', ')');
      args.push(inner.slice(lastIndex, end));
      notSeparator.lastIndex = end;
      lastIndex = argSeparator.lastIndex =
        notSeparator.test(inner) ? notSeparator.lastIndex - 1 : end;
      continue;
    }
    args.push(inner.slice(lastIndex, match.index));
    lastIndex = argSeparator.lastIndex;
  }
  last = inner.slice(lastIndex);
  if (last) args.push(last);
  return args;
}

function fnCallError(name) {
  throw new Error('malformed view function call: ' + name);
}

function fnArgValue(view, ctx, model, name, arg) {
  var literal = literalValue(arg);
  if (literal !== void 0) return literal;

  var pathMap = model.__pathMap;
  if (!pathMap) return dataValue(view, ctx, model, arg);

  var argIds = ctx.hasOwnProperty('$fnArgIds') ?
    ctx.$fnArgIds : (ctx.$fnArgIds = {});
  var pathId = argIds[arg];
  var path;
  if (pathId) {
    path = pathMap.paths[pathId];
  } else {
    path = ctxPath(view, ctx, arg);
    argIds[arg] = pathMap.id(path);
  }
  return dataValue(view, ctx, model, path);
}

function fnValue(view, ctx, model, name) {
  var match = fnCall.exec(name) || fnCallError(name)
    , fnName = match[1]
    , args = fnArgs(match[2])
    , fn, fnName, i;
  for (i = args.length; i--;) {
    args[i] = fnArgValue(view, ctx, model, name, args[i]);
  }
  if (!(fn = view.getFns[fnName])) {
    throw new Error('view function "' + fnName + '" not found for call: ' + name);
  }
  return fn.apply({view: view, ctx: ctx, model: model}, args);
}

function pathFnArgs(name, paths) {
  var match = fnCall.exec(name) || fnCallError(name)
    , args = fnArgs(match[2])
    , i, arg;
  if (paths == null) paths = [];
  for (i = args.length; i--;) {
    arg = args[i];
    if (notPathArg.test(arg)) continue;
    if (~arg.indexOf('(')) {
      pathFnArgs(arg, paths);
      continue;
    }
    paths.push(arg);
  }
  return paths;
}

function relativePath(view, ctx, i, remainder) {
  var name = ctx.$paths[i - 1] + remainder;

  // pathMap is only created in the browser
  var pathMap = view.model.__pathMap;
  if (!pathMap) return name;
  var pathId = ctx.$pathIds[name] || (ctx.$pathIds[name] = pathMap.id(name));
  return pathMap.paths[pathId];
}

function macroName(view, ctx, name) {
  if (name.charAt(0) !== '@') return;

  var segments = name.slice(1).split('.');
  var base = segments.shift().toLowerCase();
  var value = lookup(base, ctx.$macroCtx);
  var matchName = value && value.$matchName;
  var remainder = segments.join('.');

  if (matchName) {
    if (!remainder) return value;
    return {$matchName: matchName + '.' + remainder};
  }
  return (remainder) ? base + '.' + remainder : base;
}

function ctxPath(view, ctx, name) {
  var isWildcard = name.charAt(name.length - 1) === '*';
  if (isWildcard) name = name.slice(0, -1);

  var macroPath = macroName(view, ctx, name);
  if (macroPath && macroPath.$matchName) name = macroPath.$matchName;

  var firstChar = name.charAt(0)
    , i, aliasName, remainder

  // Resolve path aliases
  if (firstChar === ':') {
    if (~(i = name.search(/[.[]/))) {
      aliasName = name.slice(1, i);
      remainder = name.slice(i);
    } else {
      aliasName = name.slice(1);
      remainder = '';
    }
    aliasName = aliasName;
    i = ctx.$paths.length - ctx.$aliases[aliasName];
    if (i !== i) throw new Error('Cannot find alias: ' + name);

    name = relativePath(view, ctx, i, remainder);

  // Resolve relative paths
  } else if (firstChar === '.') {
    i = 0;
    while (name.charAt(i) === '.') {
      i++;
    }
    remainder = i === name.length ? '' : name.slice(i - 1);

    name = relativePath(view, ctx, i, remainder);
  }

  name = replaceSquareBrackets(view, ctx, name);
  if (isWildcard) name += '*';
  return name;
}

function replaceSquareBrackets(view, ctx, name) {
  if (!name) return '';
  var i = name.indexOf('[');
  if (i === -1) return name;

  var end = matchBraces(name, 1, i, '[', ']');
  // This shouldn't normally happen, but just in case return
  if (end === -1) return;
  var before = name.slice(0, i);
  var inside = name.slice(i + 1, end - 1);
  var after = name.slice(end);

  name = replaceSquareBrackets(view, ctx, inside);
  var value = getValue(view, ctx, view.model, name);
  name = (value == null) ? '$null' : value;
  var out = (before) ? before + '.' + name : name;

  while (after) {
    i = after.indexOf('[');
    if (i === -1) return out + after;

    name = after;
    end = matchBraces(name, 1, i, '[', ']');
    if (end === -1) return;
    before = name.slice(0, i);
    inside = name.slice(i + 1, end - 1);
    after = name.slice(end);

    if (before) out += before;

    name = replaceSquareBrackets(view, ctx, inside);
    value = getValue(view, ctx, view.model, name);
    value = (value == null) ? '$null' : value;
    out += '.' + value;
  }
  return out;
}

function squareBracketsArgs(name, paths) {
  paths || (paths = []);

  while (name) {
    i = name.indexOf('[');
    if (i === -1) return paths;

    end = matchBraces(name, 1, i, '[', ']');
    if (end === -1) return paths;
    inside = name.slice(i + 1, end - 1);
    name = name.slice(end);

    if (inside.indexOf('[') === -1) {
      paths.push(inside);
    } else {
      squareBracketsArgs(inside, paths);
    }
  }
  return paths;
}

function escapeValue(value, escape) {
  return escape ? escape(value) : value;
}

function literalValue(value) {
  if (value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  var firstChar = value.charAt(0)
    , match;
  if (firstChar === "'") {
    match = /^'(.*)'$/.exec(value) || fnCallError(value);
    return match[1];
  }
  if (firstChar === '"') {
    match = /^"(.*)"$/.exec(value) || fnCallError(value);
    return match[1];
  }
  if (/^[\d\-]/.test(firstChar) && !isNaN(value)) {
    return +value;
  }
  if (firstChar === '[' || firstChar === '{') {
    try {
      return JSON.parse(value);
    } catch (e) {}
  }
  return undefined;
}

function getValue(view, ctx, model, name, escape, forceEscape) {
  var literal = literalValue(name)
  if (literal === undefined) {
    return dataValue(view, ctx, model, name, escape, forceEscape);
  }
  return literal;
}

function dataValue(view, ctx, model, name, escape, forceEscape) {
  var macroPath, path, value;
  if (!name) return;
  if (~name.indexOf('(')) {
    value = fnValue(view, ctx, model, name);
    return escapeValue(value, escape);
  }
  path = ctxPath(view, ctx, name);
  macroPath = macroName(view, ctx, path);
  if (macroPath) {
    if (macroPath.$matchName) {
      path = macroPath.$matchName;
    } else {
      value = lookup(macroPath, ctx.$macroCtx);
      if (typeof value === 'function') {
        if (value.unescaped && !forceEscape) return value(ctx, model);
        value = value(ctx, model);
      }
      return escapeValue(value, escape);
    }
  }
  value = lookup(path, ctx);
  if (value === void 0) value = model.get(path)
  return escapeValue(value, escape);
}

function setBoundFn(view, ctx, model, name, value) {
  var match = fnCall.exec(name) || fnCallError(name)
    , fnName = match[1]
    , args = fnArgs(match[2])
    , get = view.getFns[fnName]
    , set = view.setFns[fnName]
    , numInputs = set && set.length - 1
    , arg, i, inputs, out, key, path, len;

  if (!(get && set)) {
    throw new Error('view function "' + fnName + '" setter not found for binding to: ' + name);
  }

  if (numInputs) {
    inputs = [value];
    i = 0;
    while (i < numInputs) {
      inputs.push(fnArgValue(view, ctx, model, name, args[i++]));
    }
    out = set.apply(null, inputs);
  } else {
    out = set(value);
  }
  if (!out) return;

  for (key in out) {
    value = out[key];
    arg = args[key];
    if (~arg.indexOf('(')) {
      setBoundFn(view, ctx, model, arg, value);
      continue;
    }
    if (value === void 0 || notPathArg.test(arg)) continue;
    path = ctxPath(view, ctx, arg);
    if (model.get(path) === value) continue;
    model.set(path, value);
  }
}

function lookup(path, obj) {
  if (!path || !obj) return;
  if (path.indexOf('.') === -1) return obj[path];

  var parts = path.split('.');
  for (var i = 0, l = parts.length; i < l; i++) {
    if (!obj) return obj;

    var prop = parts[i];
    obj = obj[prop];
  }
  return obj;
}

},{"html-util":48}],63:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;
var util = require('./util');

module.exports = Channel;

function Channel(socket) {
  EventEmitter.call(this);

  this.socket = socket;
  this.messages = new Messages;

  var channel = this;
  var onmessage = socket.onmessage;
  socket.onmessage = function(data) {
    if (data && data.racer) return channel._onMessage(data);
    onmessage && onmessage.call(socket, data);
  };
}

util.mergeInto(Channel.prototype, EventEmitter.prototype);

Channel.prototype.send = function(name, data, cb) {
  var message = this.messages.add(name, data, cb);
  // Proactively call the toJSON function, since the Google Closure JSON
  // serializer doesn't check for it
  this.socket.send(message.toJSON());
};

Channel.prototype._reply = function(id, name, data) {
  var message = new Message(id, true, name, data);
  this.socket.send(message.toJSON());
};

Channel.prototype._onMessage = function(data) {
  if (data.ack) {
    var message = this.messages.remove(data.id);
    if (message && message.cb) message.cb.apply(data.data);
    return;
  }
  var name = data.racer;
  if (data.cb) {
    var channel = this;
    var hasListeners = this.emit(name, data.data, function() {
      var args = Array.prototype.slice.call(arguments);
      channel._reply(data.id, name, args);
    });
    if (!hasListeners) this._reply(data.id, name);
  } else {
    this.emit(name, data.data);
    this._reply(data.id, name);
  }
};

function MessagesMap() {}

function Messages() {
  this.map = new MessagesMap();
  this.idCount = 0;
}
Messages.prototype.id = function() {
  return (++this.idCount).toString(36);
};
Messages.prototype.add = function(name, data, cb) {
  var message = new Message(this.id(), false, name, data, cb);
  this.map[message.id] = message;
  return message;
};
Messages.prototype.remove = function(id) {
  var message = this.map[id];
  delete this.map[id];
  return message;
};

function Message(id, ack, name, data, cb) {
  this.id = id;
  this.ack = ack;
  this.name = name;
  this.data = data;
  this.cb = cb;
}
Message.prototype.toJSON = function() {
  return {
    racer: this.name
  , id: this.id
  , data: this.data
  , ack: +this.ack
  , cb: (this.cb) ? 1 : 0
  };
};

},{"events":11,"./util":12}],49:[function(require,module,exports){

/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * Expose `Route`.
 */

module.exports = Route;

/**
 * Initialize `Route` with the given HTTP `method`, `path`,
 * and an array of `callbacks` and `options`.
 *
 * Options:
 *
 *   - `sensitive`    enable case-sensitive routes
 *   - `strict`       enable strict matching for trailing slashes
 *
 * @param {String} method
 * @param {String} path
 * @param {Array} callbacks
 * @param {Object} options.
 * @api private
 */

function Route(method, path, callbacks, options) {
  options = options || {};
  this.path = path;
  this.method = method;
  this.callbacks = callbacks;
  this.regexp = utils.pathRegexp(path
    , this.keys = []
    , options.sensitive
    , options.strict);
}

/**
 * Check if this route matches `path`, if so
 * populate `.params`.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

Route.prototype.match = function(path){
  var keys = this.keys
    , params = this.params = []
    , m = this.regexp.exec(path);

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];

    var val = 'string' == typeof m[i]
      ? decodeURIComponent(m[i])
      : m[i];

    if (key) {
      params[key.name] = val;
    } else {
      params.push(val);
    }
  }

  return true;
};

},{"../utils":64}],61:[function(require,module,exports){
module.exports = {
  quot: 0x0022
, amp: 0x0026
, apos: 0x0027
, lpar: 0x0028
, rpar: 0x0029
, lt: 0x003C
, gt: 0x003E
, nbsp: 0x00A0
, iexcl: 0x00A1
, cent: 0x00A2
, pound: 0x00A3
, curren: 0x00A4
, yen: 0x00A5
, brvbar: 0x00A6
, sect: 0x00A7
, uml: 0x00A8
, copy: 0x00A9
, ordf: 0x00AA
, laquo: 0x00AB
, not: 0x00AC
, shy: 0x00AD
, reg: 0x00AE
, macr: 0x00AF
, deg: 0x00B0
, plusmn: 0x00B1
, sup2: 0x00B2
, sup3: 0x00B3
, acute: 0x00B4
, micro: 0x00B5
, para: 0x00B6
, middot: 0x00B7
, cedil: 0x00B8
, sup1: 0x00B9
, ordm: 0x00BA
, raquo: 0x00BB
, frac14: 0x00BC
, frac12: 0x00BD
, frac34: 0x00BE
, iquest: 0x00BF
, Agrave: 0x00C0
, Aacute: 0x00C1
, Acirc: 0x00C2
, Atilde: 0x00C3
, Auml: 0x00C4
, Aring: 0x00C5
, AElig: 0x00C6
, Ccedil: 0x00C7
, Egrave: 0x00C8
, Eacute: 0x00C9
, Ecirc: 0x00CA
, Euml: 0x00CB
, Igrave: 0x00CC
, Iacute: 0x00CD
, Icirc: 0x00CE
, Iuml: 0x00CF
, ETH: 0x00D0
, Ntilde: 0x00D1
, Ograve: 0x00D2
, Oacute: 0x00D3
, Ocirc: 0x00D4
, Otilde: 0x00D5
, Ouml: 0x00D6
, times: 0x00D7
, Oslash: 0x00D8
, Ugrave: 0x00D9
, Uacute: 0x00DA
, Ucirc: 0x00DB
, Uuml: 0x00DC
, Yacute: 0x00DD
, THORN: 0x00DE
, szlig: 0x00DF
, agrave: 0x00E0
, aacute: 0x00E1
, acirc: 0x00E2
, atilde: 0x00E3
, auml: 0x00E4
, aring: 0x00E5
, aelig: 0x00E6
, ccedil: 0x00E7
, egrave: 0x00E8
, eacute: 0x00E9
, ecirc: 0x00EA
, euml: 0x00EB
, igrave: 0x00EC
, iacute: 0x00ED
, icirc: 0x00EE
, iuml: 0x00EF
, eth: 0x00F0
, ntilde: 0x00F1
, ograve: 0x00F2
, oacute: 0x00F3
, ocirc: 0x00F4
, otilde: 0x00F5
, ouml: 0x00F6
, divide: 0x00F7
, oslash: 0x00F8
, ugrave: 0x00F9
, uacute: 0x00FA
, ucirc: 0x00FB
, uuml: 0x00FC
, yacute: 0x00FD
, thorn: 0x00FE
, yuml: 0x00FF
, OElig: 0x0152
, oelig: 0x0153
, Scaron: 0x0160
, scaron: 0x0161
, Yuml: 0x0178
, fnof: 0x0192
, circ: 0x02C6
, tilde: 0x02DC
, Alpha: 0x0391
, Beta: 0x0392
, Gamma: 0x0393
, Delta: 0x0394
, Epsilon: 0x0395
, Zeta: 0x0396
, Eta: 0x0397
, Theta: 0x0398
, Iota: 0x0399
, Kappa: 0x039A
, Lambda: 0x039B
, Mu: 0x039C
, Nu: 0x039D
, Xi: 0x039E
, Omicron: 0x039F
, Pi: 0x03A0
, Rho: 0x03A1
, Sigma: 0x03A3
, Tau: 0x03A4
, Upsilon: 0x03A5
, Phi: 0x03A6
, Chi: 0x03A7
, Psi: 0x03A8
, Omega: 0x03A9
, alpha: 0x03B1
, beta: 0x03B2
, gamma: 0x03B3
, delta: 0x03B4
, epsilon: 0x03B5
, zeta: 0x03B6
, eta: 0x03B7
, theta: 0x03B8
, iota: 0x03B9
, kappa: 0x03BA
, lambda: 0x03BB
, mu: 0x03BC
, nu: 0x03BD
, xi: 0x03BE
, omicron: 0x03BF
, pi: 0x03C0
, rho: 0x03C1
, sigmaf: 0x03C2
, sigma: 0x03C3
, tau: 0x03C4
, upsilon: 0x03C5
, phi: 0x03C6
, chi: 0x03C7
, psi: 0x03C8
, omega: 0x03C9
, thetasym: 0x03D1
, upsih: 0x03D2
, piv: 0x03D6
, ensp: 0x2002
, emsp: 0x2003
, thinsp: 0x2009
, zwnj: 0x200C
, zwj: 0x200D
, lrm: 0x200E
, rlm: 0x200F
, ndash: 0x2013
, mdash: 0x2014
, lsquo: 0x2018
, rsquo: 0x2019
, sbquo: 0x201A
, ldquo: 0x201C
, rdquo: 0x201D
, bdquo: 0x201E
, dagger: 0x2020
, Dagger: 0x2021
, bull: 0x2022
, hellip: 0x2026
, permil: 0x2030
, prime: 0x2032
, Prime: 0x2033
, lsaquo: 0x2039
, rsaquo: 0x203A
, oline: 0x203E
, frasl: 0x2044
, euro: 0x20AC
, image: 0x2111
, weierp: 0x2118
, real: 0x211C
, trade: 0x2122
, alefsym: 0x2135
, larr: 0x2190
, uarr: 0x2191
, rarr: 0x2192
, darr: 0x2193
, harr: 0x2194
, crarr: 0x21B5
, lArr: 0x21D0
, uArr: 0x21D1
, rArr: 0x21D2
, dArr: 0x21D3
, hArr: 0x21D4
, forall: 0x2200
, part: 0x2202
, exist: 0x2203
, empty: 0x2205
, nabla: 0x2207
, isin: 0x2208
, notin: 0x2209
, ni: 0x220B
, prod: 0x220F
, sum: 0x2211
, minus: 0x2212
, lowast: 0x2217
, radic: 0x221A
, prop: 0x221D
, infin: 0x221E
, ang: 0x2220
, and: 0x2227
, or: 0x2228
, cap: 0x2229
, cup: 0x222A
, int: 0x222B
, there4: 0x2234
, sim: 0x223C
, cong: 0x2245
, asymp: 0x2248
, ne: 0x2260
, equiv: 0x2261
, le: 0x2264
, ge: 0x2265
, sub: 0x2282
, sup: 0x2283
, nsub: 0x2284
, sube: 0x2286
, supe: 0x2287
, oplus: 0x2295
, otimes: 0x2297
, perp: 0x22A5
, sdot: 0x22C5
, lceil: 0x2308
, rceil: 0x2309
, lfloor: 0x230A
, rfloor: 0x230B
, lang: 0x2329
, rang: 0x232A
, loz: 0x25CA
, spades: 0x2660
, clubs: 0x2663
, hearts: 0x2665
, diams: 0x2666
}

},{}],62:[function(require,module,exports){
var startTag = /^<([^\s=\/!>]+)((?:\s+[^\s=\/>]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+)?)?)*)\s*(\/?)\s*>/
  , endTag = /^<\/([^\s=\/!>]+)[^>]*>/
  , comment = /^<!--([\s\S]*?)-->/
  , commentInside = /<!--[\s\S]*?-->/
  , other = /^<([\s\S]*?)>/
  , attr = /([^\s=]+)(?:\s*(=)\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+))?)?/g
  , rawTagsDefault = /^(style|script)$/i

function empty() {}

function matchEndDefault(tagName) {
  return new RegExp('</' + tagName, 'i')
}

function onStartTag(html, match, handler) {
  var attrs = {}
    , tag = match[0]
    , tagName = match[1]
    , remainder = match[2]
  html = html.slice(tag.length)

  remainder.replace(attr, function(match, name, equals, attr0, attr1, attr2) {
    attrs[name.toLowerCase()] = attr0 || attr1 || attr2 || (equals ? '' : null)
  })
  handler(tag, tagName.toLowerCase(), attrs, html)

  return html
}

function onTag(html, match, handler) {
  var tag = match[0]
    , data = match[1]
  html = html.slice(tag.length)

  handler(tag, data, html)

  return html
}

function onText(html, index, isRawText, handler) {
  var text
  if (~index) {
    text = html.slice(0, index)
    html = html.slice(index)
  } else {
    text = html
    html = ''
  }

  if (text) handler(text, isRawText, html)

  return html
}

function rawEnd(html, ending, offset) {
  offset || (offset = 0)
  var index = html.search(ending)
    , commentMatch = html.match(commentInside)
    , commentEnd
  // Make sure that the ending condition isn't inside of an HTML comment
  if (commentMatch && commentMatch.index < index) {
    commentEnd = commentMatch.index + commentMatch[0].length
    offset += commentEnd
    html = html.slice(commentEnd)
    return rawEnd(html, ending, offset)
  }
  return index + offset
}

module.exports = function(html, options) {
  if (options == null) options = {}

  if (!html) return

  var startHandler = options.start || empty
    , endHandler = options.end || empty
    , textHandler = options.text || empty
    , commentHandler = options.comment || empty
    , otherHandler = options.other || empty
    , matchEnd = options.matchEnd || matchEndDefault
    , errorHandler = options.error
    , rawTags = options.rawTags || rawTagsDefault
    , index, last, match, tagName, err

  while (html) {
    if (html === last) {
      err = new Error('HTML parse error: ' + html)
      if (errorHandler) {
        errorHandler(err)
      } else {
        throw err
      }
    }
    last = html

    if (html[0] === '<') {
      if (match = html.match(startTag)) {
        html = onStartTag(html, match, startHandler)

        tagName = match[1]
        if (rawTags.test(tagName)) {
          index = rawEnd(html, matchEnd(tagName))
          html = onText(html, index, true, textHandler)
        }
        continue
      }

      if (match = html.match(endTag)) {
        match[1] = match[1].toLowerCase()  // tagName
        html = onTag(html, match, endHandler)
        continue
      }

      if (match = html.match(comment)) {
        html = onTag(html, match, commentHandler)
        continue
      }

      if (match = html.match(other)) {
        html = onTag(html, match, otherHandler)
        continue
      }
    }

    index = html.indexOf('<')
    html = onText(html, index, false, textHandler)
  }
}

},{}],53:[function(require,module,exports){
var Doc = require('./Doc');
var util = require('../util');

module.exports = LocalDoc;

function LocalDoc(model, collectionName, id, snapshot) {
  Doc.call(this, model, collectionName, id);
  this.snapshot = snapshot;
  this._updateCollectionData();
}

LocalDoc.prototype = new Doc;

LocalDoc.prototype._updateCollectionData = function() {
  this.collectionData[this.id] = this.snapshot;
};

LocalDoc.prototype.set = function(segments, value, cb) {
  function set(node, key) {
    var previous = node[key];
    node[key] = value;
    return previous;
  }
  return this._apply(segments, set, cb);
};

LocalDoc.prototype.del = function(segments, cb) {
  // Don't do anything if the value is already undefined, since
  // apply creates objects as it traverses, and the del method
  // should not create anything
  var previous = this.get(segments);
  if (previous === void 0) {
    cb();
    return;
  }
  function del(node, key) {
    delete node[key];
    return previous;
  }
  return this._apply(segments, del, cb);
};

LocalDoc.prototype.increment = function(segments, byNumber, cb) {
  var self = this;
  function validate(value) {
    if (typeof value === 'number' || value == null) return;
    return new TypeError(self._errorMessage(
      'increment on non-number', segments, value
    ));
  }
  function increment(node, key) {
    var value = (node[key] || 0) + byNumber;
    node[key] = value;
    return value;
  }
  return this._validatedApply(segments, validate, increment, cb);
};

LocalDoc.prototype.push = function(segments, value, cb) {
  function push(arr) {
    return arr.push(value);
  }
  return this._arrayApply(segments, push, cb);
};

LocalDoc.prototype.unshift = function(segments, value, cb) {
  function unshift(arr) {
    return arr.unshift(value);
  }
  return this._arrayApply(segments, unshift, cb);
};

LocalDoc.prototype.insert = function(segments, index, values, cb) {
  function insert(arr) {
    arr.splice.apply(arr, [index, 0].concat(values));
    return arr.length;
  }
  return this._arrayApply(segments, insert, cb);
};

LocalDoc.prototype.pop = function(segments, cb) {
  function pop(arr) {
    return arr.pop();
  }
  return this._arrayApply(segments, pop, cb);
};

LocalDoc.prototype.shift = function(segments, cb) {
  function shift(arr) {
    return arr.shift();
  }
  return this._arrayApply(segments, shift, cb);
};

LocalDoc.prototype.remove = function(segments, index, howMany, cb) {
  function remove(arr) {
    return arr.splice(index, howMany);
  }
  return this._arrayApply(segments, remove, cb);
};

LocalDoc.prototype.move = function(segments, from, to, howMany, cb) {
  function move(arr) {
    // Remove from old location
    var values = arr.splice(from, howMany);
    // Insert in new location
    arr.splice.apply(arr, [to, 0].concat(values));
    return values;
  }
  return this._arrayApply(segments, move, cb);
};

LocalDoc.prototype.stringInsert = function(segments, index, value, cb) {
  var self = this;
  function validate(value) {
    if (typeof value === 'string' || value == null) return;
    return new TypeError(self._errorMessage(
      'stringInsert on non-string', segments, value
    ));
  }
  function stringInsert(node, key) {
    var previous = node[key];
    if (previous == null) {
      node[key] = value;
      return previous;
    }
    node[key] = previous.slice(0, index) + value + previous.slice(index);
    return previous;
  }
  return this._validatedApply(segments, validate, stringInsert, cb);
};

LocalDoc.prototype.stringRemove = function(segments, index, howMany, cb) {
  var self = this;
  function validate(value) {
    if (typeof value === 'string' || value == null) return;
    return new TypeError(self._errorMessage(
      'stringRemove on non-string', segments, value
    ));
  }
  function stringRemove(node, key) {
    var previous = node[key];
    if (previous == null) return previous;
    if (index < 0) index += previous.length;
    node[key] = previous.slice(0, index) + previous.slice(index + howMany);
    return previous;
  }
  return this._validatedApply(segments, validate, stringRemove, cb);
};

LocalDoc.prototype.get = function(segments) {
  return util.lookup(segments, this.snapshot);
};

/**
 * @param {Array} segments is the array representing a path
 * @param {Function} fn(node, key) applies a mutation on node[key]
 * @return {Object} returns the return value of fn(node, key)
 */
LocalDoc.prototype._createImplied = function(segments, fn) {
  var node = this;
  var key = 'snapshot';
  var i = 0;
  var nextKey = segments[i++];
  while (nextKey != null) {
    // Get or create implied object or array
    node = node[key] || (node[key] = /^\d+$/.test(nextKey) ? [] : {});
    key = nextKey;
    nextKey = segments[i++];
  }
  return fn(node, key);
};

LocalDoc.prototype._apply = function(segments, fn, cb) {
  var out = this._createImplied(segments, fn);
  this._updateCollectionData();
  cb();
  return out;
};

LocalDoc.prototype._validatedApply = function(segments, validate, fn, cb) {
  var out = this._createImplied(segments, function(node, key) {
    var err = validate(node[key]);
    if (err) return cb(err);
    return fn(node, key);
  });
  this._updateCollectionData();
  cb();
  return out;
};

LocalDoc.prototype._arrayApply = function(segments, fn, cb) {
  // Lookup a pointer to the property or nested property &
  // return the current value or create a new array
  var arr = this._createImplied(segments, nodeCreateArray);

  if (!Array.isArray(arr)) {
    var message = this._errorMessage(fn.name + ' on non-array', segments, arr);
    var err = new TypeError(message);
    return cb(err);
  }
  var out = fn(arr);
  this._updateCollectionData();
  cb();
  return out;
};

function nodeCreateArray(node, key) {
  return node[key] || (node[key] = []);
}

},{"./Doc":65,"../util":12}],66:[function(require,module,exports){
/**
 * RemoteDoc adapts the ShareJS operation protocol to Racer's mutator
 * interface.
 *
 * 1. It maps Racer's mutator methods to outgoing ShareJS operations.
 * 2. It maps incoming ShareJS operations to Racer events.
 */

var Doc = require('./Doc');
var util = require('../util');

module.exports = RemoteDoc;

function RemoteDoc(model, collectionName, id, data) {
  Doc.call(this, model, collectionName, id);
  var shareDoc = this.shareDoc = model._getOrCreateShareDoc(collectionName, id, data);
  this.createdLocally = false;
  this.model = model = model.pass({$remote: true});
  this._passStringInsert = model.pass({$original: 'stringInsert'})._pass;
  this._passStringRemove = model.pass({$original: 'stringRemove'})._pass;
  this._updateCollectionData();

  var doc = this;
  shareDoc.on('op', function(op, isLocal) {
    // Don't emit on local operations, since they are emitted in the mutator
    if (isLocal) return;
    doc._updateCollectionData();
    doc._onOp(op);
  });
  shareDoc.on('del', function(isLocal, previous) {
    // Calling the shareDoc.del method does not emit an operation event,
    // so we create the appropriate event here.
    if (isLocal) return;
    doc._updateCollectionData();
    model.emit('change', [collectionName, id], [void 0, previous, model._pass]);
  });
  shareDoc.on('create', function(isLocal) {
    // Local creates should not emit an event, since they only happen
    // implicitly as a result of another mutation, and that operation will
    // emit the appropriate event. Remote creates can set the snapshot data
    // without emitting an operation event, so an event needs to be emitted
    // for them.
    if (isLocal) {
      // Track when a document was created by this client, so that we don't
      // emit a load event when subsequently subscribed
      doc.createdLocally = true;
      return;
    }
    doc._updateCollectionData();
    var value = shareDoc.snapshot;
    model.emit('change', [collectionName, id], [value, void 0, model._pass]);
  });
}

RemoteDoc.prototype = new Doc;

RemoteDoc.prototype._updateCollectionData = function() {
  this.collectionData[this.id] = this.shareDoc.snapshot;
};

RemoteDoc.prototype.set = function(segments, value, cb) {
  if (segments.length === 0 && !this.shareDoc.type) {
    this.shareDoc.create('json0', value, cb);
    this._updateCollectionData();
    return;
  }
  var previous = this._createImplied(segments);
  var lastSegment = segments[segments.length - 1];
  if (previous instanceof ImpliedOp) {
    previous.value[lastSegment] = value;
    this.shareDoc.submitOp(previous.op, cb);
    this._updateCollectionData();
    return;
  }
  var op = (isArrayIndex(lastSegment)) ?
    (previous == null) ?
      [new ListInsertOp(segments.slice(0, -1), lastSegment, value)] :
      [new ListReplaceOp(segments.slice(0, -1), lastSegment, previous, value)] :
    (previous == null) ?
      [new ObjectInsertOp(segments, value)] :
      [new ObjectReplaceOp(segments, previous, value)];
  this.shareDoc.submitOp(op, cb);
  this._updateCollectionData();
  return previous;
};

RemoteDoc.prototype.del = function(segments, cb) {
  if (segments.length === 0) {
    var previous = this.get();
    this.shareDoc.del(cb);
    this._updateCollectionData();
    return previous;
  }
  // Don't do anything if the value is already undefined, since
  // the del method should not create anything
  var previous = this.get(segments);
  if (previous === void 0) {
    cb();
    return;
  }
  var op = [new ObjectDeleteOp(segments, previous)];
  this.shareDoc.submitOp(op, cb);
  this._updateCollectionData();
  return previous;
};

RemoteDoc.prototype.increment = function(segments, byNumber, cb) {
  var previous = this._createImplied(segments);
  if (previous instanceof ImpliedOp) {
    var lastSegment = segments[segments.length - 1];
    previous.value[lastSegment] = byNumber;
    this.shareDoc.submitOp(previous.op, cb);
    this._updateCollectionData();
    return byNumber;
  }
  if (previous == null) {
    var lastSegment = segments[segments.length - 1];
    var op = (isArrayIndex(lastSegment)) ?
      [new ListInsertOp(segments.slice(0, -1), lastSegment, byNumber)] :
      [new ObjectInsertOp(segments, byNumber)];
    this.shareDoc.submitOp(op, cb);
    this._updateCollectionData();
    return byNumber;
  }
  var op = [new IncrementOp(segments, byNumber)];
  this.shareDoc.submitOp(op, cb);
  this._updateCollectionData();
  return previous + byNumber;
};

RemoteDoc.prototype.push = function(segments, value, cb) {
  var shareDoc = this.shareDoc;
  function push(arr, fnCb) {
    var op = [new ListInsertOp(segments, arr.length, value)];
    shareDoc.submitOp(op, fnCb);
    return arr.length;
  }
  return this._arrayApply(segments, push, cb);
};

RemoteDoc.prototype.unshift = function(segments, value, cb) {
  var shareDoc = this.shareDoc;
  function unshift(arr, fnCb) {
    var op = [new ListInsertOp(segments, 0, value)];
    shareDoc.submitOp(op, fnCb);
    return arr.length;
  }
  return this._arrayApply(segments, unshift, cb);
};

RemoteDoc.prototype.insert = function(segments, index, values, cb) {
  var shareDoc = this.shareDoc;
  function insert(arr, fnCb) {
    var op = createInsertOp(segments, index, values);
    shareDoc.submitOp(op, fnCb);
    return arr.length;
  }
  return this._arrayApply(segments, insert, cb);
};

function createInsertOp(segments, index, values) {
  if (!Array.isArray(values)) {
    return [new ListInsertOp(segments, index, values)];
  }
  var op = [];
  for (var i = 0, len = values.length; i < len; i++) {
    op.push(new ListInsertOp(segments, index++, values[i]));
  }
  return op;
}

RemoteDoc.prototype.pop = function(segments, cb) {
  var shareDoc = this.shareDoc;
  function pop(arr, fnCb) {
    var index = arr.length - 1;
    var value = arr[index];
    var op = [new ListRemoveOp(segments, index, value)];
    shareDoc.submitOp(op, fnCb);
    return value;
  }
  return this._arrayApply(segments, pop, cb);
};

RemoteDoc.prototype.shift = function(segments, cb) {
  var shareDoc = this.shareDoc;
  function shift(arr, fnCb) {
    var value = arr[0];
    var op = [new ListRemoveOp(segments, 0, value)];
    shareDoc.submitOp(op, fnCb);
    return value;
  }
  return this._arrayApply(segments, shift, cb);
};

RemoteDoc.prototype.remove = function(segments, index, howMany, cb) {
  var shareDoc = this.shareDoc;
  function remove(arr, fnCb) {
    var values = arr.slice(index, index + howMany);
    var op = [];
    for (var i = 0, len = values.length; i < len; i++) {
      op.push(new ListRemoveOp(segments, index, values[i]));
    }
    shareDoc.submitOp(op, fnCb);
    return values;
  }
  return this._arrayApply(segments, remove, cb);
};

RemoteDoc.prototype.move = function(segments, from, to, howMany, cb) {
  var shareDoc = this.shareDoc;
  function move(arr, fnCb) {
    // Get the return value
    var values = arr.slice(from, from + howMany);

    // Build an op that moves each item individually
    var op = [];
    for (var i = 0; i < howMany; i++) {
      op.push(new ListMoveOp(segments, (from < to) ? from : from + howMany - 1, (from < to) ? to + howMany - 1 : to));
    }
    shareDoc.submitOp(op, fnCb);

    return values;
  }
  return this._arrayApply(segments, move, cb);
};

RemoteDoc.prototype.stringInsert = function(segments, index, value, cb) {
  var previous = this._createImplied(segments);
  if (previous instanceof ImpliedOp) {
    var lastSegment = segments[segments.length - 1];
    previous.value[lastSegment] = value;
    this.shareDoc.submitOp(previous.op, cb);
    this._updateCollectionData();
    return;
  }
  if (previous == null) {
    var lastSegment = segments[segments.length - 1];
    var op = (isArrayIndex(lastSegment)) ?
      [new ListInsertOp(segments.slice(0, -1), lastSegment, value)] :
      [new ObjectInsertOp(segments, value)];
    this.shareDoc.submitOp(op, cb);
    this._updateCollectionData();
    return previous;
  }
  var op = [new StringInsertOp(segments, index, value)];
  this.shareDoc.submitOp(op, cb);
  this._updateCollectionData();
  return previous;
};

RemoteDoc.prototype.stringRemove = function(segments, index, howMany, cb) {
  var previous = this._createImplied(segments);
  if (previous instanceof ImpliedOp) return;
  if (previous == null) return previous;
  var removed = previous.slice(index, index + howMany);
  var op = [new StringRemoveOp(segments, index, removed)];
  this.shareDoc.submitOp(op, cb);
  this._updateCollectionData();
  return previous;
};

RemoteDoc.prototype.get = function(segments) {
  return util.lookup(segments, this.shareDoc.snapshot);
};

RemoteDoc.prototype._createImplied = function(segments) {
  if (!this.shareDoc.type) {
    this.shareDoc.create('json0');
  }
  var parent = this.shareDoc;
  var key = 'snapshot';
  var node = parent[key];
  var i = 0;
  var nextKey = segments[i++];
  var op, value;
  while (nextKey != null) {
    if (!node) {
      if (op) {
        value = value[key] = isArrayIndex(nextKey) ? [] : {};
      } else {
        value = isArrayIndex(nextKey) ? [] : {};
        op = (Array.isArray(parent)) ?
          new ListInsertOp(segments.slice(0, i - 2), key, value) :
          new ObjectInsertOp(segments.slice(0, i - 1), value);
      }
      node = value;
    }
    parent = node;
    key = nextKey;
    node = parent[key];
    nextKey = segments[i++];
  }
  if (op) return new ImpliedOp(op, value);
  return node;
};

function ImpliedOp(op, value) {
  this.op = op;
  this.value = value;
}

RemoteDoc.prototype._arrayApply = function(segments, fn, cb) {
  var arr = this._createImplied(segments);
  if (arr instanceof ImpliedOp) {
    this.shareDoc.submitOp(arr.op);
    arr = this.get(segments);
  } else if (arr == null) {
    var lastSegment = segments[segments.length - 1];
    var op = (isArrayIndex(lastSegment)) ?
      [new ListInsertOp(segments.slice(0, -1), lastSegment, [])] :
      [new ObjectInsertOp(segments, [])];
    this.shareDoc.submitOp(op);
    arr = this.get(segments);
  }

  if (!Array.isArray(arr)) {
    var message = this._errorMessage(fn.name + ' on non-array', segments, arr);
    var err = new TypeError(message);
    return cb(err);
  }
  var out = fn(arr, cb);
  this._updateCollectionData();
  return out;
};

RemoteDoc.prototype._onOp = function(op) {
  var item = op[0];
  var segments = [this.collectionName, this.id].concat(item.p);
  var model = this.model;

  // ObjectReplaceOp, ObjectInsertOp, or ObjectDeleteOp
  if (defined(item.oi) || defined(item.od)) {
    var value = item.oi;
    var previous = item.od;
    model.emit('change', segments, [value, previous, model._pass]);

  // ListReplaceOp
  } else if (defined(item.li) && defined(item.ld)) {
    var value = item.li;
    var previous = item.ld;
    model.emit('change', segments, [value, previous, model._pass]);

  // ListInsertOp
  } else if (defined(item.li)) {
    var index = segments[segments.length - 1];
    var values = [item.li];
    model.emit('insert', segments.slice(0, -1), [index, values, model._pass]);

  // ListRemoveOp
  } else if (defined(item.ld)) {
    var index = segments[segments.length - 1];
    var removed = [item.ld];
    model.emit('remove', segments.slice(0, -1), [index, removed, model._pass]);

  // ListMoveOp
  } else if (defined(item.lm)) {
    var from = segments[segments.length - 1];
    var to = item.lm - 1;
    var howMany = 1;
    model.emit('move', segments.slice(0, -1), [from, to, howMany, model._pass]);

  // StringInsertOp
  } else if (defined(item.si)) {
    var index = segments[segments.length - 1];
    var text = item.si;
    segments = segments.slice(0, -1);
    model.emit('stringInsert', segments, [index, text, model._pass]);
    var value = model._get(segments);
    var previous = value.slice(0, index) + value.slice(index + text.length);
    model.emit('change', segments, [value, previous, this._passStringInsert]);

  // StringRemoveOp
  } else if (defined(item.sd)) {
    var index = segments[segments.length - 1];
    var text = item.sd;
    var howMany = text.length;
    segments = segments.slice(0, -1);
    model.emit('stringRemove', segments, [index, howMany, model._pass]);
    var value = model._get(segments);
    var previous = value.slice(0, index) + text + value.slice(index);
    model.emit('change', segments, [value, previous, this._passStringRemove]);

  // IncrementOp
  } else if (defined(item.na)) {
    var value = this.get(item.p);
    var previous = value - item.na;
    model.emit('change', segments, [value, previous, model._pass]);
  }
};

function ObjectReplaceOp(segments, before, after) {
  this.p = castSegments(segments);
  this.od = before;
  this.oi = (after === void 0) ? null : after;
}
function ObjectInsertOp(segments, value) {
  this.p = castSegments(segments);
  this.oi = (value === void 0) ? null : value;
}
function ObjectDeleteOp(segments, value) {
  this.p = castSegments(segments);
  this.od = (value === void 0) ? null : value;
}
function ListReplaceOp(segments, index, before, after) {
  this.p = castSegments(segments.concat(index));
  this.ld = before;
  this.li = (after === void 0) ? null : after;
}
function ListInsertOp(segments, index, value) {
  this.p = castSegments(segments.concat(index));
  this.li = (value === void 0) ? null : value;
}
function ListRemoveOp(segments, index, value) {
  this.p = castSegments(segments.concat(index));
  this.ld = (value === void 0) ? null : value;
}
function ListMoveOp(segments, from, to) {
  this.p = castSegments(segments.concat(from));
  this.lm = to;
}
function StringInsertOp(segments, index, value) {
  this.p = castSegments(segments.concat(index));
  this.si = value;
}
function StringRemoveOp(segments, index, value) {
  this.p = castSegments(segments.concat(index));
  this.sd = value;
}
function IncrementOp(segments, byNumber) {
  this.p = castSegments(segments);
  this.na = byNumber;
}

function defined(value) {
  return value !== void 0;
}

function castSegments(segments) {
  // Cast number path segments from strings to numbers
  for (var i = segments.length; i--;) {
    var segment = segments[i];
    if (typeof segment === 'string' && isArrayIndex(segment)) {
      segments[i] = +segment;
    }
  }
  return segments;
}

function isArrayIndex(segment) {
  return (/^[0-9]+$/).test(segment);
}

},{"./Doc":65,"../util":12}],35:[function(require,module,exports){
var share = require('share/lib/client');
var Channel = require('../Channel');
var Model = require('./Model');
var LocalDoc = require('./LocalDoc');
var RemoteDoc = require('./RemoteDoc');

Model.prototype._createConnection = function(bundle) {
  // Model::_createSocket should be defined by the socket plugin
  this.root.socket = this._createSocket(bundle);

  // The Share connection will bind to the socket by defining the onopen,
  // onmessage, etc. methods
  var shareConnection = this.root.shareConnection = new share.Connection(this.root.socket);
  var segments = ['$connection', 'state'];
  var states = ['connecting', 'connected', 'disconnected', 'stopped'];
  var model = this;
  states.forEach(function(state) {
    shareConnection.on(state, function() {
      model._set(segments, state);
    });
  });
  this._set(segments, 'connected');

  // Wrap the socket methods on top of Share's methods
  this._createChannel();
};

Model.prototype.connect = function() {
  this.root.socket.open();
};
Model.prototype.disconnect = function() {
  this.root.socket.close();
};
Model.prototype.reconnect = function() {
  this.disconnect();
  this.connect();
};

Model.prototype._createChannel = function() {
  this.root.channel = new Channel(this.root.socket);
};

Model.prototype._getOrCreateShareDoc = function(collectionName, id, data) {
  var shareDoc = this.root.shareConnection.get(collectionName, id, data);
  shareDoc.incremental = true;
  return shareDoc;
};

Model.prototype._getDocConstructor = function(name) {
  // Whether the collection is local or remote is determined by its name.
  // Collections starting with an underscore ('_') are for user-defined local
  // collections, those starting with a dollar sign ('$'') are for
  // framework-defined local collections, and all others are remote.
  var firstCharcter = name.charAt(0);
  var isLocal = (firstCharcter === '_' || firstCharcter === '$');
  return (isLocal) ? LocalDoc : RemoteDoc;
};

},{"../Channel":63,"./Model":29,"./LocalDoc":53,"./RemoteDoc":66,"share/lib/client":67}],64:[function(require,module,exports){
(function(){
/**
 * Module dependencies.
 */

/**
 * toString ref.
 */

var toString = {}.toString;

/**
 * Return ETag for `body`.
 *
 * @param {String|Buffer} body
 * @return {String}
 * @api private
 */

exports.etag = function(body){
  return '"' + crc32.signed(body) + '"';
};

/**
 * Make `locals()` bound to the given `obj`.
 *
 * This is used for `app.locals` and `res.locals`.
 *
 * @param {Object} obj
 * @return {Function}
 * @api private
 */

exports.locals = function(obj){
  function locals(obj){
    for (var key in obj) locals[key] = obj[key];
    return obj;
  };

  return locals;
};

/**
 * Check if `path` looks absolute.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

exports.isAbsolute = function(path){
  if ('/' == path[0]) return true;
  if (':' == path[1] && '\\' == path[2]) return true;
};

/**
 * Flatten the given `arr`.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

exports.flatten = function(arr, ret){
  var ret = ret || []
    , len = arr.length;
  for (var i = 0; i < len; ++i) {
    if (Array.isArray(arr[i])) {
      exports.flatten(arr[i], ret);
    } else {
      ret.push(arr[i]);
    }
  }
  return ret;
};

/**
 * Normalize the given `type`, for example "html" becomes "text/html".
 *
 * @param {String} type
 * @return {Object}
 * @api private
 */

exports.normalizeType = function(type){
  return ~type.indexOf('/')
    ? acceptParams(type)
    : { value: mime.lookup(type), params: {} };
};

/**
 * Normalize `types`, for example "html" becomes "text/html".
 *
 * @param {Array} types
 * @return {Array}
 * @api private
 */

exports.normalizeTypes = function(types){
  var ret = [];

  for (var i = 0; i < types.length; ++i) {
    ret.push(exports.normalizeType(types[i]));
  }

  return ret;
};

/**
 * Return the acceptable type in `types`, if any.
 *
 * @param {Array} types
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.acceptsArray = function(types, str){
  // accept anything when Accept is not present
  if (!str) return types[0];

  // parse
  var accepted = exports.parseAccept(str)
    , normalized = exports.normalizeTypes(types)
    , len = accepted.length;

  for (var i = 0; i < len; ++i) {
    for (var j = 0, jlen = types.length; j < jlen; ++j) {
      if (exports.accept(normalized[j], accepted[i])) {
        return types[j];
      }
    }
  }
};

/**
 * Check if `type(s)` are acceptable based on
 * the given `str`.
 *
 * @param {String|Array} type(s)
 * @param {String} str
 * @return {Boolean|String}
 * @api private
 */

exports.accepts = function(type, str){
  if ('string' == typeof type) type = type.split(/ *, */);
  return exports.acceptsArray(type, str);
};

/**
 * Check if `type` array is acceptable for `other`.
 *
 * @param {Object} type
 * @param {Object} other
 * @return {Boolean}
 * @api private
 */

exports.accept = function(type, other){
  var t = type.value.split('/');
  return (t[0] == other.type || '*' == other.type)
    && (t[1] == other.subtype || '*' == other.subtype)
    && paramsEqual(type.params, other.params);
};

/**
 * Check if accept params are equal.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 * @api private
 */

function paramsEqual(a, b){
  return !Object.keys(a).some(function(k) {
    return a[k] != b[k];
  });
}

/**
 * Parse accept `str`, returning
 * an array objects containing
 * `.type` and `.subtype` along
 * with the values provided by
 * `parseQuality()`.
 *
 * @param {Type} name
 * @return {Type}
 * @api private
 */

exports.parseAccept = function(str){
  return exports
    .parseParams(str)
    .map(function(obj){
      var parts = obj.value.split('/');
      obj.type = parts[0];
      obj.subtype = parts[1];
      return obj;
    });
};

/**
 * Parse quality `str`, returning an
 * array of objects with `.value`,
 * `.quality` and optional `.params`
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

exports.parseParams = function(str){
  return str
    .split(/ *, */)
    .map(acceptParams)
    .filter(function(obj){
      return obj.quality;
    })
    .sort(function(a, b){
      if (a.quality === b.quality) {
        return a.originalIndex - b.originalIndex;
      } else {
        return b.quality - a.quality;
      }
    });
};

/**
 * Parse accept params `str` returning an
 * object with `.value`, `.quality` and `.params`.
 * also includes `.originalIndex` for stable sorting
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function acceptParams(str, index) {
  var parts = str.split(/ *; */);
  var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };

  for (var i = 1; i < parts.length; ++i) {
    var pms = parts[i].split(/ *= */);
    if ('q' == pms[0]) {
      ret.quality = parseFloat(pms[1]);
    } else {
      ret.params[pms[0]] = pms[1];
    }
  }

  return ret;
}

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Boolean} sensitive
 * @param  {Boolean} strict
 * @return {RegExp}
 * @api private
 */

exports.pathRegexp = function(path, keys, sensitive, strict) {
  if (toString.call(path) == '[object RegExp]') return path;
  if (Array.isArray(path)) path = '(' + path.join('|') + ')';
  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
      keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
        + (optional || '')
        + (star ? '(/*)?' : '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
  return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}

})()
},{}],29:[function(require,module,exports){
var uuid = require('node-uuid');

Model.INITS = [];

module.exports = Model;

function Model(options) {
  this.root = this;

  var inits = Model.INITS;
  options || (options = {});
  for (var i = 0; i < inits.length; i++) {
    inits[i](this, options);
  }
}

Model.prototype.id = function() {
  return uuid.v4();
};

Model.prototype._child = function() {
  return new ChildModel(this);
};

function ChildModel(model) {
  // Shared properties should be accessed via the root. This makes inheritance
  // cheap and easily extensible
  this.root = model.root;

  // EventEmitter methods access these properties directly, so they must be
  // inherited manually instead of via the root
  this._events = model._events;
  this._maxListeners = model._maxListeners;

  // Properties specific to a child instance
  this._context = model._context;
  this._at = model._at;
  this._pass = model._pass;
  this._silent = model._silent;
}
ChildModel.prototype = new Model;

},{"node-uuid":68}],65:[function(require,module,exports){
module.exports = Doc;

function Doc(model, collectionName, id) {
  this.collectionName = collectionName;
  this.id = id;
  this.collectionData = model && model.data[collectionName];
}

Doc.prototype.path = function(segments) {
  return this.collectionName + '.' + this.id + '.' + segments.join('.');
};

Doc.prototype._errorMessage = function(description, segments, value) {
  return description + ' at ' + this.path(segments) + ': ' +
    JSON.stringify(value, null, 2);
};

},{}],34:[function(require,module,exports){
var util = require('../util');
var Model = require('./Model');
var arrayDiff = require('arraydiff');

Model.prototype.setDiff = function() {
  var subpath, value, options, cb;
  if (arguments.length === 1) {
    value = arguments[0];
  } else if (arguments.length === 2) {
    subpath = arguments[0];
    value = arguments[1];
  } else if (arguments.length === 3) {
    subpath = arguments[0];
    value = arguments[1];
    if (typeof arguments[2] === 'function') {
      cb = arguments[2];
    } else {
      options = arguments[2];
    }
  } else {
    subpath = arguments[0];
    value = arguments[1];
    options = arguments[2];
    cb = arguments[3];
  }
  var segments = this._splitPath(subpath);
  return this._setDiff(segments, value, options, cb);
};
Model.prototype._setDiff = function(segments, value, options, cb) {
  segments = this._dereference(segments);
  var equalFn = (options && options.equal) || util.equal;
  var isEach = options && options.each;
  var model = this;
  function setDiff(doc, docSegments, fnCb) {
    var before = doc.get(docSegments);
    if (equalFn(before, value)) return fnCb();
    var group = util.asyncGroup(fnCb);
    doDiff(model, doc, segments, before, value, equalFn, group, isEach);
  }
  return this._mutate(segments, setDiff, cb);
};
Model.prototype._setArrayDiff = function(segments, value, cb) {
  segments = this._dereference(segments);
  var model = this;
  function setArrayDiff(doc, docSegments, fnCb) {
    var before = doc.get(docSegments);
    if (before === value) return fnCb();
    if (!Array.isArray(before) || !Array.isArray(value)) {
      applySet(model, doc, segments, value, fnCb);
      return;
    }
    var diff = arrayDiff(before, value);
    if (!diff.length) return fnCb();
    var group = util.asyncGroup(fnCb);
    applyArrayDiff(model, doc, segments, diff, group);
  }
  return this._mutate(segments, setArrayDiff, cb);
};

/**
 * @param {Object} doc
 * @param {String} doc.collectionName
 * @param {String} doc.id
 * @param {Object} doc.snapshot
 * @param {Array} segments
 * @param {Object} before
 * @param {Object} after
 * @param {Function} group
 * @param {Boolean} isEach
 */
function doDiff(model, doc, segments, before, after, equalFn, group, isEach) {
  if (typeof before !== 'object' || !before ||
      typeof after !== 'object' || !after) {
    // Set the entire value if not diffable
    applySet(model, doc, segments, after, group());
    return;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    var diff = arrayDiff(before, after, equalFn);
    if (!diff.length) return group()();
    // If the only change is a single item replacement, diff the item instead
    if (
      diff.length === 2 &&
      diff[0].index === diff[1].index &&
      diff[0] instanceof arrayDiff.RemoveDiff &&
      diff[0].howMany === 1 &&
      diff[1] instanceof arrayDiff.InsertDiff &&
      diff[1].values.length === 1
    ) {
      var index = diff[0].index;
      var itemSegments = segments.concat(index);
      doDiff(model, doc, itemSegments, before[index], after[index], equalFn, group);
      return;
    }
    applyArrayDiff(model, doc, segments, diff, group);
    return;
  }
  if (!isEach) {
    // Delete keys that were in before but not after
    for (var key in before) {
      if (key in after) continue;
      var itemSegments = segments.concat(key);
      var docSegments = itemSegments.slice(2);
      var previous = doc.del(docSegments, group());
      model.emit('change', itemSegments, [void 0, previous, model._pass]);
    }
  }
  // Diff each property in after
  for (var key in after) {
    if (equalFn(before[key], after[key])) continue;
    var itemSegments = segments.concat(key);
    doDiff(model, doc, itemSegments, before[key], after[key], equalFn, group);
  }
}

function applySet(model, doc, segments, after, cb) {
  var docSegments = segments.slice(2);
  var previous = doc.set(docSegments, after, cb);
  model.emit('change', segments, [after, previous, model._pass]);
}

function applyArrayDiff(model, doc, segments, diff, group) {
  var docSegments = segments.slice(2);
  for (var i = 0, len = diff.length; i < len; i++) {
    var item = diff[i];
    if (item instanceof arrayDiff.InsertDiff) {
      // Insert
      doc.insert(docSegments, item.index, item.values, group());
      model.emit('insert', segments, [item.index, item.values, model._pass]);
    } else if (item instanceof arrayDiff.RemoveDiff) {
      // Remove
      var removed = doc.remove(docSegments, item.index, item.howMany, group());
      model.emit('remove', segments, [item.index, removed, model._pass]);
    } else if (item instanceof arrayDiff.MoveDiff) {
      // Move
      var moved = doc.move(docSegments, item.from, item.to, item.howMany, group());
      model.emit('move', segments, [item.from, item.to, moved.length, model._pass]);
    }
  }
}

},{"../util":12,"./Model":29,"arraydiff":69}],37:[function(require,module,exports){
(function(process){var util = require('../util');
var Model = require('./Model');
var arrayDiff = require('arraydiff');
var deepEquals = require('deep-is');

module.exports = Query;

Model.INITS.push(function(model) {
  model.root._queries = new Queries;
  if (model.root.fetchOnly) return;
  model.on('all', function(segments) {
    // Updated async, since this is likely the result of an operation that
    // includes creating the doc, and we would like that to happen before
    // sending the subscribe message
    process.nextTick(function() {
      var map = model.root._queries.map;
      for (var hash in map) {
        var query = map[hash];
        if (query.isPathQuery && query.shareQuery && util.mayImpact(query.expression, segments)) {
          var ids = pathIds(model, query.expression);
          var previousIds = model._get(query.idSegments);
          query._onChange(ids, previousIds);
        }
      }
    });
  });
});

/**
 * @param {String} collectionName
 * @param {Object} expression
 * @param {String} source
 * @return {Query}
 */
Model.prototype.query = function(collectionName, expression, source) {
  if (typeof expression.path === 'function' || typeof expression !== 'object') {
    expression = this._splitPath(expression);
  }
  var query = this.root._queries.get(collectionName, expression, source);
  if (query) return query;
  query = new Query(this, collectionName, expression, source);
  this.root._queries.add(query);
  return query;
};

/**
 * Called during initialization of the bundle on page load.
 * @param {Array} items
 * @param {Array} items[*]
 * @param {String} items[*][0] collectionName
 * @param {Object} items[*][1] expression
 * @param {String} items[*][2] source
 * @param {Number} items[*][3] subscribeCount
 * @param {Number} items[*][4] fetchCount
 * @param {Array}  items[*][5] fetchIds
 */
Model.prototype._initQueries = function(items) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var query = new Query(this, item[0], item[1], item[2], item[3], item[4], item[5]);
    var count = query.fetchCount;
    while (count--) this.emit('fetchQuery', query, this._context);
    var count = query.subscribeCount;
    query.subscribeCount = 0;
    while (count--) query.subscribe();
  }
};

function QueriesMap() {}

function Queries() {
  this.map = new QueriesMap;
}
Queries.prototype.add = function(query) {
  this.map[query.hash] = query;
};
Queries.prototype.remove = function(query) {
  delete this.map[query.hash];
};
Queries.prototype.get = function(collectionName, expression, source) {
  var hash = queryHash(collectionName, expression, source);
  return this.map[hash];
};
Queries.prototype.toJSON = function() {
  var out = [];
  for (var hash in this.map) {
    var query = this.map[hash];
    if (query.subscribeCount || query.fetchCount) {
      out.push(query.serialize());
    }
  }
  return out;
};

/**
 * @private
 * @constructor
 * @param {Model} model
 * @param {Object} collectionName
 * @param {Object} expression
 * @param {String} source (e.g., 'solr')
 * @param {Number} subscribeCount
 * @param {Number} fetchCount
 * @param {Array<Array<String>>} fetchIds
 */
function Query(model, collectionName, expression, source, subscribeCount, fetchCount, fetchIds) {
  this.model = model.pass({$query: this});
  this.collectionName = collectionName;
  this.expression = expression;
  this.source = source;
  this.hash = queryHash(collectionName, expression, source);
  this.segments = ['$queries', this.hash];
  this.idSegments = ['$queries', this.hash, 'ids'];
  this.extraSegments = ['$queries', this.hash, 'extra'];
  this.isPathQuery = Array.isArray(expression);

  this._pendingSubscribeCallbacks = [];

  // These are used to help cleanup appropriately when calling unsubscribe and
  // unfetch. A query won't be fully cleaned up until unfetch and unsubscribe
  // are called the same number of times that fetch and subscribe were called.
  this.subscribeCount = subscribeCount || 0;
  this.fetchCount = fetchCount || 0;
  // The list of ids at the time of each fetch is pushed onto fetchIds, so
  // that unfetchDoc can be called the same number of times as fetchDoc
  this.fetchIds = fetchIds || [];

  this.created = false;
  this.shareQuery = null;
}

Query.prototype.create = function() {
  this.created = true;
  this.model.root._queries.add(this);
};

Query.prototype.destroy = function() {
  this.created = false;
  if (this.shareQuery) {
    this.shareQuery.destroy();
    this.shareQuery = null;
  }
  this.model.root._queries.remove(this);
  this.model._del(this.segments);
};

Query.prototype.sourceQuery = function() {
  if (this.isPathQuery) {
    var ids = pathIds(this.model, this.expression);
    return {_id: {$in: ids}};
  }
  return this.expression;
};

/**
 * @param {Function} [cb] cb(err)
 */
Query.prototype.fetch = function(cb) {
  if (!cb) cb = this.model.root._defaultCallback;
  this.model.emit('fetchQuery', this, this.model._context);

  this.fetchCount++;

  if (!this.created) this.create();
  var query = this;

  var model = this.model;
  var shareDocs = collectionShareDocs(this.model, this.collectionName);
  var options = {docMode: 'fetch', knownDocs: shareDocs};
  if (this.source) options.source = this.source;

  model.root.shareConnection.createFetchQuery(
    this.collectionName, this.sourceQuery(), options, fetchQueryCallback
  );
  function fetchQueryCallback(err, results, extra) {
    if (err) return cb(err);
    var ids = resultsIds(results);

    // Keep track of the ids at fetch time for use in unfetch
    query.fetchIds.push(ids.slice());
    // Update the results ids and extra
    model._setDiff(query.idSegments, ids);
    if (extra !== void 0) {
      model._setDiff(query.extraSegments, extra, {equal: deepEquals});
    }

    if (!ids.length) return cb();

    // Call fetchDoc for each document returned so that the proper load events
    // and internal counts are maintained. However, specify that we already
    // loaded the documents as part of the query, since we don't want to
    // actually fetch the documents again
    var alreadyLoaded = true;
    var group = util.asyncGroup(cb);
    for (var i = 0; i < ids.length; i++) {
      model.fetchDoc(query.collectionName, ids[i], group(), alreadyLoaded);
    }
  }
  return this;
};

/**
 * Sets up a subscription to `this` query.
 * @param {Function} cb(err)
 */
Query.prototype.subscribe = function(cb) {
  if (!cb) cb = this.model.root._defaultCallback;
  this.model.emit('subscribeQuery', this, this.model._context);

  var query = this;

  if (this.subscribeCount++) {
    process.nextTick(function () {
      var data = query.model._get(query.segments);
      if (data) cb();
      else query._pendingSubscribeCallbacks.push(cb);
    });
    return this;
  }

  if (!this.created) this.create();

  // When doing server-side rendering, we actually do a fetch the first time
  // that subscribe is called, but keep track of the state as if subscribe
  // were called for proper initialization in the client
  var shareDocs = collectionShareDocs(this.model, this.collectionName);
  var options = {docMode: 'sub', knownDocs: shareDocs};
  if (this.source) options.source = this.source;

  if (!this.model.root.fetchOnly) {
    this._shareSubscribe(options, cb);
    return this;
  }

  var model = this.model;
  options.docMode = 'fetch';
  model.root.shareConnection.createFetchQuery(
    this.collectionName, this.sourceQuery(), options, function(err, results, extra) {
      if (err) return cb(err);
      var ids = resultsIds(results);
      if (extra !== void 0) {
        model._setDiff(query.extraSegments, extra, {equal: deepEquals});
      }
      query._onChange(ids, null, cb);
      while (cb = query._pendingSubscribeCallbacks.shift()) {
        query._onChange(ids, null, cb);
      }
    }
  );
  return this;
};

/**
 * @private
 * @param {Object} options
 * @param {String} [options.source]
 * @param {Boolean} [options.poll]
 * @param {Boolean} [options.docMode = fetch or subscribe]
 * @param {Function} cb(err, results)
 */
Query.prototype._shareSubscribe = function(options, cb) {
  var query = this;
  var model = this.model;
  this.shareQuery = this.model.root.shareConnection.createSubscribeQuery(
    this.collectionName, this.sourceQuery(), options, function (err, results, extra) {
      if (err) return cb(err);
      if (extra !== void 0) {
        model._setDiff(query.extraSegments, extra, {equal: deepEquals});
      }
      // Results are not set in the callback, because the shareQuery should
      // emit a 'change' event before calling back
      cb();
    }
  );
  var query = this;
  this.shareQuery.on('insert', function(shareDocs, index) {
    query._onInsert(shareDocs, index);
  });
  this.shareQuery.on('remove', function(shareDocs, index) {
    query._onRemove(shareDocs, index);
  });
  this.shareQuery.on('move', function(shareDocs, from, to) {
    query._onMove(shareDocs, from, to);
  });
  this.shareQuery.on('change', function(results, previous) {
    // Get the new and previous list of ids when the entire results set changes
    var ids = resultsIds(results);
    var previousIds = previous && resultsIds(previous);
    query._onChange(ids, previousIds);
  });
  this.shareQuery.on('extra', function (extra) {
    model._setDiff(query.extraSegments, extra, {equal: deepEquals});
  });
};

/**
 * @public
 * @param {Function} cb(err, newFetchCount)
 */
Query.prototype.unfetch = function(cb) {
  if (!cb) cb = this.model.root._defaultCallback;
  this.model.emit('unfetchQuery', this, this.model._context);

  // No effect if the query is not currently fetched
  if (!this.fetchCount) {
    cb();
    return this;
  }

  var ids = this.fetchIds.shift() || [];
  for (var i = 0; i < ids.length; i++) {
    this.model.unfetchDoc(this.collectionName, ids[i]);
  }

  var query = this;
  if (this.model.root.unloadDelay) {
    setTimeout(finishUnfetchQuery, this.model.root.unloadDelay);
  } else {
    finishUnfetchQuery();
  }
  function finishUnfetchQuery() {
    var count = --query.fetchCount;
    if (count) return cb(null, count);
    // Cleanup when no fetches or subscribes remain
    if (!query.subscribeCount) query.destroy();
    cb(null, 0);
  }
  return this;
};

Query.prototype.unsubscribe = function(cb) {
  if (!cb) cb = this.model.root._defaultCallback;
  this.model.emit('unsubscribeQuery', this, this.model._context);

  // No effect if the query is not currently subscribed
  if (!this.subscribeCount) {
    cb();
    return this;
  }

  var query = this;
  if (this.model.root.unloadDelay) {
    setTimeout(finishUnsubscribeQuery, this.model.root.unloadDelay);
  } else {
    finishUnsubscribeQuery();
  }
  function finishUnsubscribeQuery() {
    var count = --query.subscribeCount;
    if (count) return cb(null, count);

    if (query.shareQuery) {
      var ids = resultsIds(query.shareQuery.results);
      query.shareQuery.destroy();
      query.shareQuery = null;
    }

    if (!query.model.root.fetchOnly && ids && ids.length) {
      // Unsubscribe all documents that this query currently has in results
      var group = util.asyncGroup(unsubscribeQueryCallback);
      for (var i = 0; i < ids.length; i++) {
        query.model.unsubscribeDoc(query.collectionName, ids[i], group());
      }
    }
    unsubscribeQueryCallback();
  }
  function unsubscribeQueryCallback(err) {
    if (err) return cb(err);
    // Cleanup when no fetches or subscribes remain
    if (!query.fetchCount) query.destroy();
    cb(null, 0);
  }
  return this;
};

Query.prototype._onInsert = function(shareDocs, index) {
  var ids = [];
  for (var i = 0; i < shareDocs.length; i++) {
    var id = shareDocs[i].name;
    ids.push(id);
    this.model.subscribeDoc(this.collectionName, id);
  }
  this.model._insert(this.idSegments, index, ids);
};
Query.prototype._onRemove = function(shareDocs, index) {
  this.model._remove(this.idSegments, index, shareDocs.length);
  for (var i = 0; i < shareDocs.length; i++) {
    this.model.unsubscribeDoc(this.collectionName, shareDocs[i].name);
  }
};
Query.prototype._onMove = function(shareDocs, from, to) {
  this.model._move(this.idSegments, from, to, shareDocs.length);
};

Query.prototype._onChange = function(ids, previousIds, cb) {
  // Diff the new and previous list of ids, subscribing to documents for
  // inserted ids and unsubscribing from documents for removed ids
  var diff = (previousIds) ?
    arrayDiff(previousIds, ids) :
    [new arrayDiff.InsertDiff(0, ids)];
  var previousCopy = previousIds && previousIds.slice();

  // The results are updated via a different diff, since they might already
  // have a value from a fetch or previous shareQuery instance
  this.model._setDiff(this.idSegments, ids);

  if (cb) {
    var group = util.asyncGroup(cb);
    var finished = group();
  }
  for (var i = 0; i < diff.length; i++) {
    var item = diff[i];
    if (item instanceof arrayDiff.InsertDiff) {
      // Subscribe to the document for each inserted id
      var values = item.values;
      for (var j = 0; j < values.length; j++) {
        this.model.subscribeDoc(this.collectionName, values[j], cb && group());
      }
    } else if (item instanceof arrayDiff.RemoveDiff) {
      var values = previousCopy.splice(item.index, item.howMany);
      // Unsubscribe from the document for each removed id
      for (var j = 0; j < values.length; j++) {
        this.model.unsubscribeDoc(this.collectionName, values[j], cb && group());
      }
    }
    // Moving doesn't change document subscriptions, so that is ignored.
  }
  // Make sure that the callback gets called if the diff is empty or it
  // contains no inserts or removes
  finished && finished();
};

Query.prototype.get = function() {
  var results = [];
  var data = this.model._get(this.segments);
  if (!data) {
    console.warn('You must fetch or subscribe to a query before getting its results.');
    return results;
  }
  var ids = data.ids;
  if (!ids) return results;

  var collection = this.model.getCollection(this.collectionName);
  for (var i = 0, l = ids.length; i < l; i++) {
    var id = ids[i];
    var doc = collection && collection.docs[id];
    results.push(doc && doc.get());
  }
  return (data.extra === void 0) ?
    results :
    {results: results, extra: data.extra};
};

/**
 * Lazily creates or gets a ref to our resultset's results.
 */
Query.prototype.ref = function(from) {
  var idsPath = this.idSegments.join('.');
  return this.model.refList(from, this.collectionName, idsPath);
};

/**
 * Lazily creates or gets a ref to our resultset's extra data.
 */
Query.prototype.extraRef = function(from, relPath) {
  var extraPath = this.extraSegments.join('.') + (relPath ? '.' + relPath : '');
  return this.model.ref(from, extraPath);
};

Query.prototype.serialize = function() {
  return [
    this.collectionName
  , this.expression
  , this.source
  , this.subscribeCount
  , this.fetchCount
  , this.fetchIds
  ];
};

function queryHash(collectionName, expression, source) {
  var args = [collectionName, expression, source];
  return JSON.stringify(args).replace(/\./g, '|');
}

function resultsIds(results) {
  var ids = [];
  for (var i = 0; i < results.length; i++) {
    var shareDoc = results[i];
    ids.push(shareDoc.name);
  }
  return ids;
}

function pathIds(model, segments) {
  var value = model._get(segments);
  return (typeof value === 'string') ? [value] :
    (Array.isArray(value)) ? value.slice() : [];
}

function collectionShareDocs(model, collectionName) {
  var collection = model.getCollection(collectionName);
  if (!collection) return;

  var results = [];
  for (var name in collection.docs) {
    results.push(collection.docs[name].shareDoc);
  }

  return results;
}


})(require("__browserify_process"))
},{"../util":12,"./Model":29,"arraydiff":69,"deep-is":46,"__browserify_process":10}],70:[function(require,module,exports){
require=(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],2:[function(require,module,exports){
(function(){// UTILITY
var util = require('util');
var Buffer = require("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

})()
},{"util":3,"buffer":4}],"buffer-browserify":[function(require,module,exports){
module.exports=require('q9TxCC');
},{}],"q9TxCC":[function(require,module,exports){
(function(){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.binaryWrite = SlowBuffer.prototype.asciiWrite;

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.binarySlice = SlowBuffer.prototype.asciiSlice;

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

SlowBuffer.prototype.fill = function(value, start, end) {
  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this.parent[i + this.offset] = subject.readUInt8(i);
        }
        else {
          this.parent[i + this.offset] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1];
    }
  } else {
    val = buffer.parent[buffer.offset + offset];
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer.parent[buffer.offset + offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

})()
},{"assert":2,"./buffer_ieee754":1,"base64-js":5}],3:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":6}],5:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],7:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],6:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":8}],4:[function(require,module,exports){
(function(){function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        this.parent[i + this.offset] = subject[i];
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    val |= buffer.parent[buffer.offset + offset + 1];
  } else {
    val = buffer.parent[buffer.offset + offset];
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset + 1] << 16;
    val |= buffer.parent[buffer.offset + offset + 2] << 8;
    val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    val = buffer.parent[buffer.offset + offset + 2] << 16;
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  buffer.parent[buffer.offset + offset] = value;
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset + 1] = value & 0x00ff;
  } else {
    buffer.parent[buffer.offset + offset + 1] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset] = value & 0x00ff;
  }
}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset + 3] = value & 0xff;
  } else {
    buffer.parent[buffer.offset + offset + 3] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset] = value & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

})()
},{"assert":2,"./buffer_ieee754":7,"base64-js":9}],9:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}]},{},[])
;;module.exports=require("buffer-browserify")

},{}],68:[function(require,module,exports){
(function(Buffer){//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng;

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  //
  // Moderately fast, high quality
  if (typeof(require) == 'function') {
    try {
      var _rb = require('crypto').randomBytes;
      _rng = _rb && function() {return _rb(16);};
    } catch(e) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    //
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var  _rnds = new Array(16);
    _rng = function() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  // Buffer class to use
  var BufferClass = typeof(Buffer) == 'function' ? Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});
  } else if (typeof(module) != 'undefined' && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else {
    // Publish as global (in browsers)
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    };

    _global.uuid = uuid;
  }
}).call(this);

})(require("__browserify_buffer").Buffer)
},{"crypto":71,"__browserify_buffer":70}],69:[function(require,module,exports){
module.exports = arrayDiff;

// Based on some rough benchmarking, this algorithm is about O(2n) worst case,
// and it can compute diffs on random arrays of length 1024 in about 34ms,
// though just a few changes on an array of length 1024 takes about 0.5ms

arrayDiff.InsertDiff = InsertDiff;
arrayDiff.RemoveDiff = RemoveDiff;
arrayDiff.MoveDiff = MoveDiff;

function InsertDiff(index, values) {
  this.index = index;
  this.values = values;
}
InsertDiff.prototype.type = 'insert';
InsertDiff.prototype.toJSON = function() {
  return {
    type: this.type
  , index: this.index
  , values: this.values
  };
};

function RemoveDiff(index, howMany) {
  this.index = index;
  this.howMany = howMany;
}
RemoveDiff.prototype.type = 'remove';
RemoveDiff.prototype.toJSON = function() {
  return {
    type: this.type
  , index: this.index
  , howMany: this.howMany
  };
};

function MoveDiff(from, to, howMany) {
  this.from = from;
  this.to = to;
  this.howMany = howMany;
}
MoveDiff.prototype.type = 'move';
MoveDiff.prototype.toJSON = function() {
  return {
    type: this.type
  , from: this.from
  , to: this.to
  , howMany: this.howMany
  };
};

function strictEqual(a, b) {
  return a === b;
}

function arrayDiff(before, after, equalFn) {
  if (!equalFn) equalFn = strictEqual;

  // Find all items in both the before and after array, and represent them
  // as moves. Many of these "moves" may end up being discarded in the last
  // pass if they are from an index to the same index, but we don't know this
  // up front, since we haven't yet offset the indices.
  // 
  // Also keep a map of all the indicies accounted for in the before and after
  // arrays. These maps are used next to create insert and remove diffs.
  var beforeLength = before.length;
  var afterLength = after.length;
  var moves = [];
  var beforeMarked = {};
  var afterMarked = {};
  for (var beforeIndex = 0; beforeIndex < beforeLength; beforeIndex++) {
    var beforeItem = before[beforeIndex];
    for (var afterIndex = 0; afterIndex < afterLength; afterIndex++) {
      if (afterMarked[afterIndex]) continue;
      if (!equalFn(beforeItem, after[afterIndex])) continue;
      var from = beforeIndex;
      var to = afterIndex;
      var howMany = 0;
      do {
        beforeMarked[beforeIndex++] = afterMarked[afterIndex++] = true;
        howMany++;
      } while (
        beforeIndex < beforeLength &&
        afterIndex < afterLength &&
        equalFn(before[beforeIndex], after[afterIndex]) &&
        !afterMarked[afterIndex]
      );
      moves.push(new MoveDiff(from, to, howMany));
      beforeIndex--;
      break;
    }
  }

  // Create a remove for all of the items in the before array that were
  // not marked as being matched in the after array as well
  var removes = [];
  for (beforeIndex = 0; beforeIndex < beforeLength;) {
    if (beforeMarked[beforeIndex]) {
      beforeIndex++;
      continue;
    }
    var index = beforeIndex;
    var howMany = 0;
    while (beforeIndex < beforeLength && !beforeMarked[beforeIndex++]) {
      howMany++;
    }
    removes.push(new RemoveDiff(index, howMany));
  }

  // Create an insert for all of the items in the after array that were
  // not marked as being matched in the before array as well
  var inserts = [];
  for (afterIndex = 0; afterIndex < afterLength;) {
    if (afterMarked[afterIndex]) {
      afterIndex++;
      continue;
    }
    var index = afterIndex;
    var howMany = 0;
    while (afterIndex < afterLength && !afterMarked[afterIndex++]) {
      howMany++;
    }
    var values = after.slice(index, index + howMany);
    inserts.push(new InsertDiff(index, values));
  }

  var insertsLength = inserts.length;
  var removesLength = removes.length;
  var movesLength = moves.length;
  var i, j;

  // Offset subsequent removes and moves by removes
  var count = 0;
  for (i = 0; i < removesLength; i++) {
    var remove = removes[i];
    remove.index -= count;
    count += remove.howMany;
    for (j = 0; j < movesLength; j++) {
      var move = moves[j];
      if (move.from >= remove.index) move.from -= remove.howMany;
    }
  }

  // Offset moves by inserts
  for (i = insertsLength; i--;) {
    var insert = inserts[i];
    var howMany = insert.values.length;
    for (j = movesLength; j--;) {
      var move = moves[j];
      if (move.to >= insert.index) move.to -= howMany;
    }
  }

  // Offset the to of moves by later moves
  for (i = movesLength; i-- > 1;) {
    var move = moves[i];
    if (move.to === move.from) continue;
    for (j = i; j--;) {
      var earlier = moves[j];
      if (earlier.to >= move.to) earlier.to -= move.howMany;
      if (earlier.to >= move.from) earlier.to += move.howMany;
    }
  }

  // Only output moves that end up having an effect after offsetting
  var outputMoves = [];

  // Offset the from of moves by earlier moves
  for (i = 0; i < movesLength; i++) {
    var move = moves[i];
    if (move.to === move.from) continue;
    outputMoves.push(move);
    for (j = i + 1; j < movesLength; j++) {
      var later = moves[j];
      if (later.from >= move.from) later.from -= move.howMany;
      if (later.from >= move.to) later.from += move.howMany;
    }
  }

  return removes.concat(outputMoves, inserts);
}

},{}],51:[function(require,module,exports){
var qs = require('qs')
var nodeUrl = require('url');

module.exports = {
  render: render
, isTransitional: isTransitional
, mapRoute: mapRoute
}

function isTransitional(pattern) {
  return pattern.hasOwnProperty('from') && pattern.hasOwnProperty('to')
}

function mapRoute(from, params) {
  var i = params.url.indexOf('?')
  var queryString = (~i) ? params.url.slice(i) : ''
  // If the route looks like /:a/:b?/:c/:d?
  // and :b and :d are missing, return /a/c
  // Thus, skip the / if the value is missing
  var i = 0
  var path = from.replace(/\/(?:(?:\:([^?\/:*]+))|\*)(\?)?/g, onMatch)
  function onMatch(match, key, optional) {
    var value = key ? params[key] : params[i++]
    return (optional && value === void 0) ? '' : '/' + value
  }
  return path + queryString
}

function render(page, options, e) {
  var req = new RenderReq(page, options, e)
  req.routeTransitional(0, function() {
    req.routeQueue(0, function() {
      req.routeAndTransition(0, function() {
        // Cancel rendering by this app if no routes match
        req.cancel()
      })
    })
  })
}

function RenderReq(page, options, e) {
  this.page = page
  this.options = options
  this.e = e
  this.setUrl(options.url.replace(/#.*/, ''))
  var queryString = nodeUrl.parse(this.url).query;
  this.query = queryString ? qs.parse(queryString) : {}
  this.method = options.method
  this.body = options.body || {}
  this.previous = options.previous
  var routes = page._routes
  this.transitional = routes.transitional[this.method]
  this.queue = routes.queue[this.method]
  this.onRoute = routes.onRoute
}

RenderReq.prototype.cancel = function() {
  var options = this.options
  // Don't do anything if this is the result of an event, since the
  // appropriate action will happen by default
  if (this.e || options.noNavigate) return
  // Otherwise, manually perform appropriate action
  if (options.form) {
    options.form.setAttribute('data-router-ignore', '')
    options.form.submit()
  } else if (options.link) {
    options.link.setAttribute('data-router-ignore', '')
    options.link.click()
  } else {
    window.location.assign(options.url)
  }
}

RenderReq.prototype.setUrl = function(url) {
  this.url = url
  this.path = this.url.replace(/\?.*/, '')
}

RenderReq.prototype.routeTransitional = function(i, next) {
  i || (i = 0)
  var item
  while (item = this.transitional[i++]) {
    if (!item.to.match(this.path) || !item.from.match(this.previous)) continue
    var req = this
    var otherParams = this.routeParams(item.from)
    var params = this.routeParams(item.to, otherParams)
    // Even though we don't need to do anything after a done, pass a
    // no op function, so that routes can expect it to be defined
    function done() {}
    this.onMatch(item.to, params, function(err) {
      if (err) return req.cancel()
      req.routeTransitional(i, next)
    }, done)
    return
  }
  next()
}

RenderReq.prototype.routeQueue = function(i, next) {
  i || (i = 0)
  var route
  while (route = this.queue[i++]) {
    if (!route.match(this.path)) continue
    var req = this
    var params = this.routeParams(route)
    this.onMatch(route, params, function(err) {
      if (err) return req.cancel()
      req.routeQueue(i, next)
    })
    return
  }
  next()
}

RenderReq.prototype.routeAndTransition = function(i, next) {
  i || (i = 0)
  var render = this.page.render
  var item
  while (item = this.transitional[i++]) {
    if (!item.to.match(this.path)) continue
    var url = this.url
    var params = this.routeParams(item.to)
    this.setUrl(mapRoute(item.from.path, params))
    var req = this
    var skipped = false
    function continueNext() {
      skipped = true
      req.setUrl(url)
      req.page.render = render
      req.routeAndTransition(i, next)
    }
    this.page.render = function() {
      var renderArguments = arguments
      function done() {
        if (skipped) return
        req.page.render = render
        render.apply(req.page, renderArguments)
      }
      req.setUrl(url)
      var isAsync = req.onMatch(item.to, params, continueNext, done)
      if (isAsync) return
      done()
    }
    this.routeQueue(0, continueNext)
    return
  }
  next()
}

RenderReq.prototype.onMatch = function(route, params, next, done) {
  // Stop the default browser action, such as clicking a link or submitting a form
  if (this.e) {
    this.e.preventDefault()
    this.e = null
  }
  this.page.params = params
  return this.onRoute(
    route.callbacks
  , this.page
  , this.page.params
  , next
  , route.isTransitional
  , done
  )
}

RenderReq.prototype.routeParams = function(route, otherParams) {
  var routeParams = route.params
  var params = routeParams.slice()
  if (otherParams) {
    for (var key in otherParams) {
      params[key] = otherParams[key]
    }
  }
  for (var key in routeParams) {
    params[key] = routeParams[key]
  }
  params.previous = this.previous
  params.url = this.url
  params.body = this.body
  params.query = this.query
  params.method = this.method
  return params
}

},{"url":47,"qs":72}],60:[function(require,module,exports){
(function(){
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      bin = require('charenc').bin,

  // The core
  md5 = function (message) {
    // Convert to byte array
    if (message.constructor == String)
      message = utf8.stringToBytes(message);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    var digestbytes = crypt.wordsToBytes(md5(message));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();

},{"crypt":73,"charenc":74}],50:[function(require,module,exports){
var qs = require('qs')
var parseUrl = require('url').parse
var resolveUrl = require('url').resolve
var renderRoute = require('./router').render
var currentPath = (window.location.pathname.slice(window.location.pathname.indexOf('index.html') + 10) + '/') + window.location.search

// Replace the initial state with the current URL immediately,
// so that it will be rendered if the state is later popped
if (window.history.replaceState) {
  window.history.replaceState({
    $render: true,
    $method: 'get'
  }, null, window.location.href)
}

module.exports = History

function History(createPage, routes) {
  this._createPage = createPage
  this._routes = routes

  if (window.history.pushState) {
    addListeners(this)
    return
  }
  this.push = function(url) {
    window.location.assign(url)
  }
  this.replace = function(url) {
    window.location.replace(url)
  }
  this.refresh = function() {
    window.location.reload()
  }
}

History.prototype.push = function(url, render, state, e) {
  this._update('pushState', url, render, state, e)
}

History.prototype.replace = function(url, render, state, e) {
  this._update('replaceState', url, render, state, e)
}

// Rerender the current url locally
History.prototype.refresh = function() {
  var path = routePath(window.location.href)
  renderRoute(this.page(), {url: path, previous: path, method: 'get'})
}

History.prototype.back = function() {
  window.history.back()
}

History.prototype.forward = function() {
  window.history.forward()
}

History.prototype.go = function(i) {
  window.history.go(i)
}

History.prototype._update = function(historyMethod, relativeUrl, render, state, e) {
  var url = resolveUrl(window.location.href, relativeUrl)
  var path = routePath(url)

  // TODO: history.push should set the window.location with external urls
  if (!path) return
  if (render == null) render = true
  if (state == null) state = {}

  // Update the URL
  var options = renderOptions(e, path)
  state.$render = true
  state.$method = options.method
  window.history[historyMethod](state, null, options.url)
  currentPath = (window.location.pathname.slice(window.location.pathname.indexOf('index.html') + 10) + '/') + window.location.search
  if (render) renderRoute(this.page(), options, e)
}

History.prototype.page = function() {
  if (this._page) return this._page

  var page = this._page = this._createPage()
  var history = this

  function redirect(url) {
    if (url === 'back') return history.back()
    // TODO: Add support for `basepath` option like Express
    if (url === 'home') url = '\\'
    history.replace(url, true)
  }

  page.redirect = redirect
  page._routes = this._routes
  return page
}

// Get the pathname if it is on the same protocol and domain
function routePath(url) {
  var match = parseUrl(url)
  return match &&
    match.protocol === window.location.protocol &&
    match.host === window.location.host &&
    match.pathname + (match.search || '')
}

function renderOptions(e, path) {
  // If this is a form submission, extract the form data and
  // append it to the url for a get or params.body for a post
  if (e && e.type === 'submit') {
    var form = e.target
    var elements = form.elements
    var query = []
    for (var i = 0, len = elements.length, el; i < len; i++) {
      el = elements[i]
      var name = el.name
      if (!name) continue
      var value = el.value
      query.push(encodeURIComponent(name) + '=' + encodeURIComponent(value))
      if (name === '_method') {
        var override = value.toLowerCase()
        if (override === 'delete') override = 'del'
      }
    }
    query = query.join('&')
    if (form.method.toLowerCase() === 'post') {
      var method = override || 'post'
      var body = qs.parse(query)
    } else {
      method = 'get'
      path += '?' + query
    }
  } else {
    method = 'get'
  }
  return {
    method: method
  , url: path
  , previous: (window.location.pathname.slice(window.location.pathname.indexOf('index.html') + 10) + '/') + window.location.search
  , body: body
  , form: form
  , link: e && e._tracksLink
  }
}

function addListeners(history) {

  // Detect clicks on links
  function onClick(e) {
    var el = e.target

    // Ignore command click, control click, and non-left click
    if (e.metaKey || e.which !== 1) return

    // Ignore if already prevented
    if (e.defaultPrevented || e.returnValue === false) return

    // Also look up for parent links (<a><img></a>)
    while (el) {
      var url = el.href
      if (url) {

        // Ignore if created by Tracks
        if (el.hasAttribute && el.hasAttribute('data-router-ignore')) return

        // Ignore links meant to open in a different window or frame
        if (el.target && el.target !== '_self') return

        // Ignore hash links to the same page
        var hashIndex = url.indexOf('#')
        if (~hashIndex && url.slice(0, hashIndex) === window.location.href.replace(/#.*/, '')) {
          return
        }

        e._tracksLink = el
        history.push(url, true, null, e)
        return
      }

      el = el.parentNode
    }
  }

  function onSubmit(e) {
    var target = e.target

    // Ignore if already prevented
    if (e.defaultPrevented || e.returnValue === false) return

    // Only handle if emitted on a form element that isn't multipart
    if (target.tagName.toLowerCase() !== 'form') return
    if (target.enctype === 'multipart/form-data') return

    // Ignore if created by Tracks
    if (target.hasAttribute && target.hasAttribute('data-router-ignore')) return

    // Use the url from the form action, defaulting to the current url
    var url = target.action || window.location.href
    history.push(url, true, null, e)
  }

  function onPopState(e) {
    var previous = currentPath
    var state = e.state
    currentPath = (window.location.pathname.slice(window.location.pathname.indexOf('index.html') + 10) + '/') + window.location.search

    var options = {
      previous: previous
    , url: currentPath
    }

    if (state) {
      if (!state.$render) return
      options.method = state.$method
      // Note that the post body is only sent on the initial reqest
      // and it is empty if the state is later popped
      return renderRoute(history.page(), options)
    }

    // The state object will be null for states created by jump links.
    // window.location.hash cannot be used, because it returns nothing
    // if the url ends in just a hash character
    var url = window.location.href
      , hashIndex = url.indexOf('#')
      , el, id
    if (~hashIndex && currentPath !== previous) {
      options.method = 'get'
      renderRoute(history.page(), options)
      id = url.slice(hashIndex + 1)
      if (el = document.getElementById(id) || document.getElementsByName(id)[0]) {
        el.scrollIntoView()
      }
    }
  }

  document.addEventListener('click', onClick, false)
  document.addEventListener('submit', onSubmit, false)
  window.addEventListener('popstate', onPopState, false)
}

},{"url":47,"./router":51,"qs":72}],67:[function(require,module,exports){

exports.Connection = require('./connection').Connection;
exports.Doc = require('./doc').Doc;

},{"./connection":75,"./doc":76}],72:[function(require,module,exports){
/**
 * Object#toString() ref for stringify().
 */

var toString = Object.prototype.toString;

/**
 * Object#hasOwnProperty ref
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Array#indexOf shim.
 */

var indexOf = typeof Array.prototype.indexOf === 'function'
  ? function(arr, el) { return arr.indexOf(el); }
  : function(arr, el) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === el) return i;
      }
      return -1;
    };

/**
 * Array.isArray shim.
 */

var isArray = Array.isArray || function(arr) {
  return toString.call(arr) == '[object Array]';
};

/**
 * Object.keys shim.
 */

var objectKeys = Object.keys || function(obj) {
  var ret = [];
  for (var key in obj) ret.push(key);
  return ret;
};

/**
 * Array#forEach shim.
 */

var forEach = typeof Array.prototype.forEach === 'function'
  ? function(arr, fn) { return arr.forEach(fn); }
  : function(arr, fn) {
      for (var i = 0; i < arr.length; i++) fn(arr[i]);
    };

/**
 * Array#reduce shim.
 */

var reduce = function(arr, fn, initial) {
  if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
  var res = initial;
  for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
  return res;
};

/**
 * Create a nullary object if possible
 */

function createObject() {
  return Object.create
    ? Object.create(null)
    : {};
}

/**
 * Cache non-integer test regexp.
 */

var isint = /^[0-9]+$/;

function promote(parent, key) {
  if (parent[key].length == 0) return parent[key] = createObject();
  var t = createObject();
  for (var i in parent[key]) {
    if (hasOwnProperty.call(parent[key], i)) {
      t[i] = parent[key][i];
    }
  }
  parent[key] = t;
  return t;
}

function parse(parts, parent, key, val) {
  var part = parts.shift();
  // end
  if (!part) {
    if (isArray(parent[key])) {
      parent[key].push(val);
    } else if ('object' == typeof parent[key]) {
      parent[key] = val;
    } else if ('undefined' == typeof parent[key]) {
      parent[key] = val;
    } else {
      parent[key] = [parent[key], val];
    }
    // array
  } else {
    var obj = parent[key] = parent[key] || [];
    if (']' == part) {
      if (isArray(obj)) {
        if ('' != val) obj.push(val);
      } else if ('object' == typeof obj) {
        obj[objectKeys(obj).length] = val;
      } else {
        obj = parent[key] = [parent[key], val];
      }
      // prop
    } else if (~indexOf(part, ']')) {
      part = part.substr(0, part.length - 1);
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
      // key
    } else {
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
    }
  }
}

/**
 * Merge parent key/val pair.
 */

function merge(parent, key, val){
  if (~indexOf(key, ']')) {
    var parts = key.split('[')
      , len = parts.length
      , last = len - 1;
    parse(parts, parent, 'base', val);
    // optimize
  } else {
    if (!isint.test(key) && isArray(parent.base)) {
      var t = createObject();
      for (var k in parent.base) t[k] = parent.base[k];
      parent.base = t;
    }
    set(parent.base, key, val);
  }

  return parent;
}

/**
 * Compact sparse arrays.
 */

function compact(obj) {
  if ('object' != typeof obj) return obj;

  if (isArray(obj)) {
    var ret = [];

    for (var i in obj) {
      if (hasOwnProperty.call(obj, i)) {
        ret.push(obj[i]);
      }
    }

    return ret;
  }

  for (var key in obj) {
    obj[key] = compact(obj[key]);
  }

  return obj;
}

/**
 * Restore Object.prototype.
 * see pull-request #58
 */

function restoreProto(obj) {
  if (!Object.create) return obj;
  if (isArray(obj)) return obj;
  if (obj && 'object' != typeof obj) return obj;

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      obj[key] = restoreProto(obj[key]);
    }
  }

  obj.__proto__ = Object.prototype;
  return obj;
}

/**
 * Parse the given obj.
 */

function parseObject(obj){
  var ret = { base: {} };

  forEach(objectKeys(obj), function(name){
    merge(ret, name, obj[name]);
  });

  return compact(ret.base);
}

/**
 * Parse the given str.
 */

function parseString(str){
  var ret = reduce(String(str).split('&'), function(ret, pair){
    var eql = indexOf(pair, '=')
      , brace = lastBraceInKey(pair)
      , key = pair.substr(0, brace || eql)
      , val = pair.substr(brace || eql, pair.length)
      , val = val.substr(indexOf(val, '=') + 1, val.length);

    // ?foo
    if ('' == key) key = pair, val = '';
    if ('' == key) return ret;

    return merge(ret, decode(key), decode(val));
  }, { base: createObject() }).base;

  return restoreProto(compact(ret));
}

/**
 * Parse the given query `str` or `obj`, returning an object.
 *
 * @param {String} str | {Object} obj
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if (null == str || '' == str) return {};
  return 'object' == typeof str
    ? parseObject(str)
    : parseString(str);
};

/**
 * Turn the given `obj` into a query string
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

var stringify = exports.stringify = function(obj, prefix) {
  if (isArray(obj)) {
    return stringifyArray(obj, prefix);
  } else if ('[object Object]' == toString.call(obj)) {
    return stringifyObject(obj, prefix);
  } else if ('string' == typeof obj) {
    return stringifyString(obj, prefix);
  } else {
    return prefix + '=' + encodeURIComponent(String(obj));
  }
};

/**
 * Stringify the given `str`.
 *
 * @param {String} str
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyString(str, prefix) {
  if (!prefix) throw new TypeError('stringify expects an object');
  return prefix + '=' + encodeURIComponent(str);
}

/**
 * Stringify the given `arr`.
 *
 * @param {Array} arr
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyArray(arr, prefix) {
  var ret = [];
  if (!prefix) throw new TypeError('stringify expects an object');
  for (var i = 0; i < arr.length; i++) {
    ret.push(stringify(arr[i], prefix + '[' + i + ']'));
  }
  return ret.join('&');
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyObject(obj, prefix) {
  var ret = []
    , keys = objectKeys(obj)
    , key;

  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    if ('' == key) continue;
    if (null == obj[key]) {
      ret.push(encodeURIComponent(key) + '=');
    } else {
      ret.push(stringify(obj[key], prefix
        ? prefix + '[' + encodeURIComponent(key) + ']'
        : encodeURIComponent(key)));
    }
  }

  return ret.join('&');
}

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (undefined === v) {
    obj[key] = val;
  } else if (isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}

/**
 * Decode `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function decode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (err) {
    return str;
  }
}

},{}],73:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],74:[function(require,module,exports){
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],77:[function(require,module,exports){
// This is a simple rewrite of microevent.js. I've changed the
// function names to be consistent with node.js EventEmitter.
//
// microevent.js is copyright Jerome Etienne, and licensed under the MIT license:
// https://github.com/jeromeetienne/microevent.js

var MicroEvent = function() {};

MicroEvent.prototype.on = function(event, fn) {
  var events = this._events = this._events || {};
  (events[event] = events[event] || []).push(fn);
};

MicroEvent.prototype.removeListener = function(event, fn) {
  var events = this._events = this._events || {};
  var listeners = events[event] = events[event] || [];

  // Sadly, no IE8 support for indexOf.
  var i = 0;
  while (i < listeners.length) {
    if (listeners[i] === fn) {
      listeners[i] = undefined;
    }
    i++;
  }

  // Compact the list when no event handler is actually running.
  setTimeout(function() {
    events[event] = [];
    var fn;
    for (var i = 0; i < listeners.length; i++) {
      // Only add back event handlers which exist.
      if ((fn = listeners[i])) events[event].push(fn);
    }
  }, 0);
};

MicroEvent.prototype.emit = function(event) {
  var events = this._events;
  var args = Array.prototype.splice.call(arguments, 1);

  if (!events || !events[event]) {
    if (event == 'error') {
      if (console) {
        console.error.apply(console, args);
      }
    }
    return;
  }

  var listeners = events[event];
  for (var i = 0; i < listeners.length; i++) {
    if (listeners[i]) {
      listeners[i].apply(this, args);
    }
  }
};

MicroEvent.prototype.once = function(event, fn) {
  var listener, _this = this;
  this.on(event, listener = function() {
    _this.removeListener(event, listener);
    fn.apply(_this, arguments);
  });
};

MicroEvent.mixin = function(obj) {
  var proto = obj.prototype || obj;
  proto.on = MicroEvent.prototype.on;
  proto.removeListener = MicroEvent.prototype.removeListener;
  proto.emit = MicroEvent.prototype.emit;
  proto.once = MicroEvent.prototype.once;
  return obj;
};

if (typeof module !== "undefined") module.exports = MicroEvent;


},{}],78:[function(require,module,exports){
var Doc;
if (typeof require !== 'undefined') {
  Doc = require('./doc').Doc;
}

// Queries are live requests to the database for particular sets of fields.
//
// The server actively tells the client when there's new data that matches
// a set of conditions.
var Query = exports.Query = function(type, connection, id, collection, query, options, callback) {
  // 'fetch' or 'sub'
  this.type = type;

  this.connection = connection;
  this.id = id;
  this.collection = collection;

  // The query itself. For mongo, this should look something like {"data.x":5}
  this.query = query;

  // Resultant document action for the server. Fetch mode will automatically
  // fetch all results. Subscribe mode will automatically subscribe all
  // results. Results are never unsubscribed.
  this.docMode = options.docMode; // undefined, 'fetch' or 'sub'.
  if (this.docMode === 'subscribe') this.docMode = 'sub';

  // Do we repoll the entire query whenever anything changes? (As opposed to
  // just polling the changed item). This needs to be enabled to be able to use
  // ordered queries (sortby:) and paginated queries. Set to undefined, it will
  // be enabled / disabled automatically based on the query's properties.
  this.poll = options.poll;

  // The backend we actually hit. If this isn't defined, it hits the snapshot
  // database. Otherwise this can be used to hit another configured query
  // index.
  this.backend = options.backend || options.source;

  // A list of resulting documents. These are actual documents, complete with
  // data and all the rest. If fetch is false, these documents will not
  // have any data. You should manually call fetch() or subscribe() on them.
  //
  // Calling subscribe() might be a good idea anyway, as you won't be
  // subscribed to the documents by default.
  this.knownDocs = options.knownDocs || [];
  this.results = [];

  // Do we have some initial data?
  this.ready = false;

  this.callback = callback;
};
Query.prototype.action = 'qsub';

// Helper for subscribe & fetch, since they share the same message format.
//
// This function actually issues the query.
Query.prototype._execute = function() {
  if (!this.connection.canSend) return;

  if (this.docMode) {
    var collectionVersions = {};
    // Collect the version of all the documents in the current result set so we
    // don't need to be sent their snapshots again.
    for (var i = 0; i < this.knownDocs.length; i++) {
      var doc = this.knownDocs[i];
      var c = collectionVersions[doc.collection] = collectionVersions[doc.collection] || {};
      c[doc.name] = doc.version;
    }
  }

  var msg = {
    a: 'q' + this.type,
    id: this.id,
    c: this.collection,
    o: {},
    q: this.query,
  };

  if (this.docMode) {
    msg.o.m = this.docMode;
    // This should be omitted if empty, but whatever.
    msg.o.vs = collectionVersions;
  }
  if (this.backend != null) msg.o.b = this.backend;
  if (this.poll !== undefined) msg.o.p = this.poll;

  this.connection.send(msg);
};

// Make a list of documents from the list of server-returned data objects
Query.prototype._dataToDocs = function(data) {
  var results = [];
  var lastType;
  for (var i = 0; i < data.length; i++) {
    var docData = data[i];

    // Types are only put in for the first result in the set and every time the type changes in the list.
    if (docData.type) {
      lastType = docData.type;
    } else {
      docData.type = lastType;
    }

    var doc = this.connection.get(docData.c || this.collection, docData.d, docData);
    // Force the document to know its subscribed if we're in docmode:subscribe.
    if (this.docMode === 'sub') {
      doc.subscribed = true; // Set before setWantSubscribe() so flush doesn't send a subscribe request.
      doc._setWantSubscribe(true); // this will call any subscribe callbacks or whatever.
      doc.emit('subscribe');
      doc._finishSub(true); // this doesn't actually do anything here, but its more correct to have it.
    }
    results.push(doc);
  }
  return results;
};

// Destroy the query object. Any subsequent messages for the query will be
// ignored by the connection. You should unsubscribe from the query before
// destroying it.
Query.prototype.destroy = function() {
  if (this.connection.canSend && this.type === 'sub') {
    this.connection.send({a:'qunsub', id:this.id});
  }

  this.connection._destroyQuery(this);
};

Query.prototype._onConnectionStateChanged = function(state, reason) {
  if (this.connection.state === 'connecting') {
    this._execute();
  }
};

// Internal method called from connection to pass server messages to the query.
Query.prototype._onMessage = function(msg) {
  if ((msg.a === 'qfetch') !== (this.type === 'fetch')) {
    if (console) console.warn('Invalid message sent to query', msg, this);
    return;
  }

  if (msg.error) this.emit('error', msg.error);

  switch (msg.a) {
    case 'qfetch':
      var results = msg.data ? this._dataToDocs(msg.data) : undefined;
      if (this.callback) this.callback(msg.error, results, msg.extra);
      // Once a fetch query gets its data, it is destroyed.
      this.connection._destroyQuery(this);
      break;

    case 'q':
      // Query diff data (inserts and removes)
      if (msg.diff) {
        // We need to go through the list twice. First, we'll injest all the
        // new documents and set them as subscribed.  After that we'll emit
        // events and actually update our list. This avoids race conditions
        // around setting documents to be subscribed & unsubscribing documents
        // in event callbacks.
        for (var i = 0; i < msg.diff.length; i++) {
          var d = msg.diff[i];
          if (d.type === 'insert') d.values = this._dataToDocs(d.values);
        }

        for (var i = 0; i < msg.diff.length; i++) {
          var d = msg.diff[i];
          switch (d.type) {
            case 'insert':
              var newDocs = d.values;
              Array.prototype.splice.apply(this.results, [d.index, 0].concat(newDocs));
              this.emit('insert', newDocs, d.index);
              break;
            case 'remove':
              var howMany = d.howMany || 1;
              var removed = this.results.splice(d.index, howMany);
              this.emit('remove', removed, d.index);
              break;
            case 'move':
              var howMany = d.howMany || 1;
              var docs = this.results.splice(d.from, howMany);
              Array.prototype.splice.apply(this.results, [d.to, 0].concat(docs));
              this.emit('move', docs, d.from, d.to);
              break;
          }
        }
      }

      if (msg.extra) {
        this.emit('extra', msg.extra);
      }
      break;
    case 'qsub':
      // This message replaces the entire result set with the set passed.
      if (!msg.error) {
        var previous = this.results;

        // Then add everything in the new result set.
        this.results = this.knownDocs = this._dataToDocs(msg.data);
        this.extra = msg.extra;

        this.ready = true;
        this.emit('change', this.results, previous);
      }
      if (this.callback) {
        this.callback(msg.error, this.results, this.extra);
        delete this.callback;
      }
      break;
  }
};

// Change the thing we're searching for. This isn't fully supported on the
// backend (it destroys the old query and makes a new one) - but its
// programatically useful and I might add backend support at some point.
Query.prototype.setQuery = function(q) {
  if (this.type !== 'sub') throw new Error('cannot change a fetch query');

  this.query = q;
  if (this.connection.canSend) {
    // There's no 'change' message to send to the server. Just resubscribe.
    this.connection.send({a:'qunsub', id:this.id});
    this._execute();
  }
};

var MicroEvent;
if (typeof require !== 'undefined') {
  MicroEvent = require('./microevent');
}

MicroEvent.mixin(Query);


},{"./doc":76,"./microevent":77}],75:[function(require,module,exports){
// A Connection wraps a persistant BC connection to a sharejs server.
//
// This class implements the client side of the protocol defined here:
// https://github.com/josephg/ShareJS/wiki/Wire-Protocol
//
// The equivalent server code is in src/server/session.
//
// This file is a bit of a mess. I'm dreadfully sorry about that. It passes all the tests,
// so I have hope that its *correct* even if its not clean.
//
// To make a connection, use:
//  new sharejs.Connection(socket)
//
// The socket should look like a websocket connection. It should have the following properties:
//  send(msg): Send the given message. msg may be an object - if so, you might need to JSON.stringify it.
//  close(): Disconnect the session
//
//  onmessage = function(msg){}: Event handler which is called whenever a message is received. The message
//     passed in should already be an object. (It may need to be JSON.parsed)
//  onclose
//  onerror
//  onopen
//  onconnecting
//
// The socket should probably automatically reconnect. If so, it should emit the appropriate events as it
// disconnects & reconnects. (onclose(), onconnecting(), onopen()).

var types, Doc;
if (typeof require !== 'undefined') {
  types = require('ottypes');
  Doc = require('./doc').Doc;
  Query = require('./query').Query;
} else {
  types = window.ottypes;
  Doc = exports.Doc;
}

var Connection = exports.Connection = function (socket) {
  this.socket = socket;

  // Map of collection -> docName -> doc object for created documents.
  // (created documents MUST BE UNIQUE)
  this.collections = {};

  // Each query is created with an id that the server uses when it sends us
  // info about the query (updates, etc).
  //this.nextQueryId = (Math.random() * 1000) |0;
  this.nextQueryId = 1;

  // Map from query ID -> query object.
  this.queries = {};

  // Connection state.
  // 
  // States:
  // - 'connecting': The connection has been established, but we don't have our client ID yet
  // - 'connected': We have connected and recieved our client ID. Ready for data.
  // - 'disconnected': The connection is closed, but it will reconnect automatically.
  // - 'stopped': The connection is closed, and should not reconnect.
  this.state = (socket.readyState === 0 || socket.readyState === 1) ? 'connecting' : 'disconnected';

  // This is a helper variable the document uses to see whether we're currently
  // in a 'live' state. It is true if the state is 'connecting' or 'connected'.
  this.canSend = this.state === 'connecting';

  // Reset some more state variables.
  this.reset();

  this.debug = false;
  // I'll store the most recent 100 messages so when errors occur we can see what happened.
  this.messageBuffer = [];

  var connection = this;

  var handleMessage = function(msg) {
    // Switch on the message action. Most messages are for documents and are
    // handled in the doc class.
    switch (msg.a) {
      case 'init':
        // Client initialization packet. This bundle of joy contains our client
        // ID.
        if (msg.protocol !== 0) throw new Error('Invalid protocol version');
        if (typeof msg.id != 'string') throw new Error('Invalid client id');

        connection.id = msg.id;
        connection._setState('connected');
        break;

      case 'qfetch':
      case 'qsub':
      case 'q':
      case 'qunsub':
        // Query message. Pass this to the appropriate query object.
        var query = connection.queries[msg.id];
        if (query) query._onMessage(msg);
        break;

      case 'bs':
        // Bulk subscribe response. The responses for each document are contained within.
        var result = msg.s;
        for (var cName in result) {
          for (var docName in result[cName]) {
            var doc = connection.get(cName, docName);
            if (!doc) {
              if (console) console.error('Message for unknown doc. Ignoring.', msg);
              break;
            }

            var msg = result[cName][docName];
            if (typeof msg === 'object') {
              doc._handleSubscribe(msg.error, msg.data);
            } else {
              // The msg will be true if we simply resubscribed.
              doc._handleSubscribe(null, null);
            }
          }
        }
        break;

      default:
        // Document message. Pull out the referenced document and forward the
        // message.
        var collection, docName, doc;
        if (msg.d) {
          collection = connection._lastReceivedCollection = msg.c;
          docName = connection._lastReceivedDoc = msg.d;
        } else {
          collection = msg.c = connection._lastReceivedCollection;
          docName = msg.d = connection._lastReceivedDoc;
        }

        doc = connection.get(collection, docName);
        if (!doc) {
          if (console) console.error('Message for unknown doc. Ignoring.', msg);
          break;
        }
        doc._onMessage(msg);
    }
  };

  // Attach event handlers to the socket.
  socket.onmessage = function(msg) {
    if (connection.debug) console.log('RECV', JSON.stringify(msg));
    connection.messageBuffer.push({t:(new Date()).toTimeString(), recv:JSON.stringify(msg)});
    while (connection.messageBuffer.length > 100) {
      connection.messageBuffer.shift();
    }

    try {
      handleMessage(msg);
    } catch (e) {
      connection.emit('error', e);
      // We could also restart the connection here, although that might result
      // in infinite reconnection bugs.
    }
  }

  socket.onopen = function() {
    connection._setState('connecting');
  };

  socket.onerror = function(e) {
    // This isn't the same as a regular error, because it will happen normally
    // from time to time. Your connection should probably automatically
    // reconnect anyway, but that should be triggered off onclose not onerror.
    // (onclose happens when onerror gets called anyway).
    connection.emit('connection error', e);
  };

  socket.onclose = function(reason) {
    connection._setState('disconnected', reason);
    if (reason === 'Closed' || reason === 'Stopped by server') {
      connection._setState('stopped', reason);
    }
  };
}

/* Why does this function exist? Is it important?
Connection.prototype._error = function(e) {
  this._setState('stopped', e);
  return this.disconnect(e);
};
*/

Connection.prototype.reset = function() {
  this.id = this.lastError =
    this._lastReceivedCollection = this._lastReceivedDoc =
    this._lastSentCollection = this._lastSentDoc = null;

  this.seq = 1;
};

// Set the connection's state. The connection is basically a state machine.
Connection.prototype._setState = function(newState, data) {
  if (this.state === newState) return;

  // I made a state diagram. The only invalid transitions are getting to
  // 'connecting' from anywhere other than 'disconnected' and getting to
  // 'connected' from anywhere other than 'connecting'.
  if ((newState === 'connecting' && (this.state !== 'disconnected' && this.state !== 'stopped'))
      || (newState === 'connected' && this.state !== 'connecting')) {
    throw new Error("Cannot transition directly from " + this.state + " to " + newState);
  }

  this.state = newState;
  this.canSend = newState === 'connecting' || newState === 'connected';

  if (newState === 'disconnected') this.reset();

  this.emit(newState, data);

  // & Emit the event to all documents & queries. It might make sense for
  // documents to just register for this stuff using events, but that couples
  // connections and documents a bit much. Its not a big deal either way.
  this.opQueue = [];
  this.subscribeData = {};
  for (var c in this.collections) {
    var collection = this.collections[c];
    for (var docName in collection) {
      collection[docName]._onConnectionStateChanged(newState, data);
    }
  }


  // Its important that operations are resent in the same order that they were
  // originally sent. If we don't sort, an op with a high sequence number will
  // convince the server not to accept any ops with earlier sequence numbers.
  this.opQueue.sort(function(a, b) { return a.seq - b.seq; });
  for (var i = 0; i < this.opQueue.length; i++) {
    this.send(this.opQueue[i]);
  }

  // Only send bulk subscribe if not empty. Its weird using a for loop for
  // this, but it works pretty well.
  for (var __unused in this.subscribeData) { 
    this.send({a:'bs', s:this.subscribeData});
    break;
  }

  this.opQueue = null;
  this.subscribeData = null;
  
  // No bulk subscribe for queries yet.
  for (var id in this.queries) {
    this.queries[id]._onConnectionStateChanged(newState, data);
  }
};

// So, there's an awful error case where the client sends two requests (which
// fail), then reconnects. The documents could have _onConnectionStateChanged
// called in the wrong order and the operations then get sent with reversed
// sequence numbers. This causes the server to incorrectly reject the second
// sent op. So we need to queue the operations while we're reconnecting and
// resend them in the correct order.
Connection.prototype.sendOp = function(data) {
  if (this.opQueue) {
    this.opQueue.push(data);
  } else {
    this.send(data);
  }
};

// This is called by the document class when the document wants to subscribe.
// We could just send a subscribe message, but during reconnect that causes a
// bajillion messages over browserchannel. During reconnect we'll aggregate,
// similar to sendOp.
Connection.prototype.sendSubscribe = function(collection, name, v) {
  if (this.subscribeData) {
    var data = this.subscribeData;
    if (!data[collection]) data[collection] = {};

    data[collection][name] = v || null;
  } else {
    var msg = {a:'sub', c:collection, d:name};
    if (v != null) msg.v = v;
    this.send(msg);
  }
};

// Send a message to the connection.
Connection.prototype.send = function(msg) {
  if (this.debug) console.log("SEND", JSON.stringify(msg));
  this.messageBuffer.push({t:Date.now(), send:JSON.stringify(msg)});
  while (this.messageBuffer.length > 100) {
    this.messageBuffer.shift();
  }

  if (msg.d) { // The document the message refers to. Not set for queries.
    var collection = msg.c;
    var docName = msg.d;
    if (collection === this._lastSentCollection && docName === this._lastSentDoc) {
      delete msg.c;
      delete msg.d;
    } else {
      this._lastSentCollection = collection;
      this._lastSentDoc = docName;
    }
  }

  this.socket.send(msg);
};

Connection.prototype.disconnect = function() {
  // This will call @socket.onclose(), which in turn will emit the 'disconnected' event.
  this.socket.close();
};


// ***** Document management

Connection.prototype.getExisting = function(collection, name) {
  if (this.collections[collection]) return this.collections[collection][name];
};

Connection.prototype.getOrCreate = function(collection, name, data) {
  console.trace('getOrCreate is deprecated. Use get() instead');
  return this.get(collection, name, data);
};

// Create a document if it doesn't exist. Returns the document synchronously.
Connection.prototype.get = function(collection, name, data) {
  var doc = this.getExisting(collection, name);

  if (!doc) {
    // Create it.
    doc = new Doc(this, collection, name);

    var collectionObject = this.collections[collection] =
      (this.collections[collection] || {});
    collectionObject[name] = doc;
  }

  // Even if the document isn't new, its possible the document was created
  // manually and then tried to be re-created with data (suppose a query
  // returns with data for the document). We should hydrate the document
  // immediately if we can because the query callback will expect the document
  // to have data.
  if (data && data.data !== undefined && !doc.state) {
    doc.injestData(data);
  }

  return doc;
};

// Call doc.destroy()
Connection.prototype._destroyDoc = function(doc) {
  var collectionObject = this.collections[doc.collection];
  if (!collectionObject) return;

  delete collectionObject[doc.name];

  // Delete the collection container if its empty. This could be a source of
  // memory leaks if you slowly make a billion collections, which you probably
  // won't do anyway, but whatever.
  if (!hasKeys(collectionObject))
    delete this.collections[doc.collection];
};
 
function hasKeys(object) {
  for (var key in object) return true;
  return false;
};

// **** Queries.

// Helper for createFetchQuery and createSubscribeQuery, below.
Connection.prototype._createQuery = function(type, collection, q, options, callback) {
  if (type !== 'fetch' && type !== 'sub')
    throw new Error('Invalid query type: ' + type);

  if (!options) options = {};
  var id = this.nextQueryId++;
  var query = new Query(type, this, id, collection, q, options, callback);
  this.queries[id] = query;
  query._execute();
  return query;
};

// Internal function. Use query.destroy() to remove queries.
Connection.prototype._destroyQuery = function(query) {
  delete this.queries[query.id];
};

// The query options object can contain the following fields:
//
// docMode: What to do with documents that are in the result set. Can be
//   null/undefined (default), 'fetch' or 'subscribe'. Fetch mode indicates
//   that the server should send document snapshots to the client for all query
//   results. These will be hydrated into the document objects before the query
//   result callbacks are returned. Subscribe mode gets document snapshots and
//   automatically subscribes the client to all results. Note that the
//   documents *WILL NOT* be automatically unsubscribed when the query is
//   destroyed. (ShareJS doesn't have enough information to do that safely).
//   Beware of memory leaks when using this option.
//
// poll: Forcably enable or disable polling mode. Polling mode will reissue the query
//   every time anything in the collection changes (!!) so, its quite
//   expensive.  It is automatically enabled for paginated and sorted queries.
//   By default queries run with polling mode disabled; which will only check
//   changed documents to test if they now match the specified query.
//   Set to false to disable polling mode, or true to enable it. If you don't
//   specify a poll option, polling mode is enabled or disabled automatically
//   by the query's backend.
//
// backend: Set the backend source for the query. You can attach different
//   query backends to livedb and pick which one the query should hit using
//   this parameter.
//
// results: (experimental) Initial list of resultant documents. This is
//   useful for rehydrating queries when you're using autoFetch / autoSubscribe
//   so the server doesn't have to send over snapshots for documents the client
//   already knows about. This is experimental - the API may change in upcoming
//   versions.

// Create a fetch query. Fetch queries are only issued once, returning the
// results directly into the callback.
//
// The index is specific to the source, but if you're using mongodb it'll be
// the collection to which the query is made.
// The callback should have the signature function(error, results, extraData)
// where results is a list of Doc objects.
Connection.prototype.createFetchQuery = function(index, q, options, callback) {
  return this._createQuery('fetch', index, q, options, callback);
};

// Create a subscribe query. Subscribe queries return with the initial data
// through the callback, then update themselves whenever the query result set
// changes via their own event emitter.
//
// If present, the callback should have the signature function(error, results, extraData)
// where results is a list of Doc objects.
Connection.prototype.createSubscribeQuery = function(index, q, options, callback) {
  return this._createQuery('sub', index, q, options, callback);
};

if (typeof require !== 'undefined') {
  MicroEvent = require('./microevent');
}

MicroEvent.mixin(Connection);


},{"./doc":76,"./query":78,"./microevent":77,"ottypes":79}],76:[function(require,module,exports){
var types, MicroEvent;

if (typeof require !== "undefined") {
  types = require('ottypes');
  MicroEvent = require('./microevent');
} else {
  types = window.ottypes;
}

/*
 * A Doc is a client's view on a sharejs document.
 *
 * Documents should not be created directly. Create them by calling the
 * document getting functions in connection.
 *
 * Documents are event emitters. Use doc.on(eventname, fn) to subscribe.
 *
 * Documents currently get mixed in with their type's API methods. So, you can
 * .insert('foo', 0) into a text document and stuff like that.
 *
 * Events:
 * - before op (op, localSite): Fired before an operation is applied to the
 *   document.
 * - op (op, localSite): Fired right after an operation (or part of an
 *   operation) has been applied to the document. Submitting another op here is
 *   invalid - wait until 'after op' if you want to submit more operations.  -
 *   changed (op)
 * - after op (op, localSite): Fired after an operation has been applied. You
 *   can submit more ops here.
 * - subscribed (error): The document was subscribed
 * - unsubscribed (error): The document was unsubscribed
 * - created: The document was created. That means its type was set and it has
 *   some initial data.
 * - error
 */
var Doc = exports.Doc = function(connection, collection, name) {
  this.connection = connection;

  this.collection = collection;
  this.name = name;

  this.version = this.type = null;

  // **** State in document:
 
  // Action. This is either null, or one of the actions (subscribe,
  // unsubscribe, fetch, submit). Only one action can be happening at a time to
  // prevent me from going mad.
  //
  // Possible values:
  // - subscribe
  // - unsubscribe
  // - fetch
  // - submit
  this.action = null;
 
  // The data the document object stores can be in one of the following three states:
  //   - No data. (null) We honestly don't know whats going on.
  //   - Floating ('floating'): we have a locally created document that hasn't
  //     been created on the server yet)
  //   - Live ('ready') (we have data thats current on the server at some version).
  this.state = null;

  // Our subscription status. Either we're subscribed on the server, or we aren't.
  this.subscribed = false;
  // Either we want to be subscribed (true), we want a new snapshot from the
  // server ('fetch'), or we don't care (false).  This is also used when we
  // disconnect & reconnect to decide what to do.
  this.wantSubscribe = false;
  // This list is used for subscribe and unsubscribe, since we'll only want to
  // do one thing at a time.
  this._subscribeCallbacks = [];


  // *** end state stuff.

  // This doesn't provide any standard API access right now.
  this.provides = {};

  // The editing contexts. These are usually instances of the type API when the
  // document is ready for edits.
  this.editingContexts = [];
  
  // The op that is currently roundtripping to the server, or null.
  //
  // When the connection reconnects, the inflight op is resubmitted.
  //
  // This has the same format as an entry in pendingData, which is:
  // {[create:{...}], [del:true], [op:...], callbacks:[...], src:, seq:}
  this.inflightData = null;

  // All ops that are waiting for the server to acknowledge @inflightData
  // This used to just be a single operation, but creates & deletes can't be composed with
  // regular operations.
  //
  // This is a list of {[create:{...}], [del:true], [op:...], callbacks:[...]}
  this.pendingData = [];
};

MicroEvent.mixin(Doc);

Doc.prototype.destroy = function(callback) {
  var doc = this;
  this.unsubscribe(function() {
    // Don't care if there's an error unsubscribing.

    setTimeout(function() {
      // There'll probably be nothing here seeing as how we just unsubscribed.
      for (var i = 0; i < doc._subscribeCallbacks.length; i++) {
        doc._subscribeCallbacks[i]('Document destroyed');
      }
      doc._subscribeCallbacks.length = 0;
    }, 0);

    doc.connection._destroyDoc(doc);
    doc.removeContexts();
    if (callback) callback();
  });
};


// ****** Manipulating the document snapshot, version and type.

// Set the document's type, and associated properties. Most of the logic in
// this function exists to update the document based on any added & removed API
// methods.
Doc.prototype._setType = function(newType) {
  if (typeof newType === 'string') {
    if (!types[newType]) throw new Error("Missing type " + newType);
    newType = types[newType];
  }
  this.removeContexts();

  // Set the new type
  this.type = newType;

  // If we removed the type from the object, also remove its snapshot.
  if (!newType) {
    this.provides = {};
  } else if (newType.api) {
    // Register the new type's API.
    this.provides = newType.api.provides;
  }
};

// Injest snapshot data. This data must include a version, snapshot and type.
// This is used both to injest data that was exported with a webpage and data
// that was received from the server during a fetch.
Doc.prototype.injestData = function(data) {
  if (this.state) {
    if (typeof console !== "undefined") console.warn('Ignoring attempt to injest data in state', this.state);
    return;
  }
  if (typeof data.v !== 'number') throw new Error('Missing version in injested data');


  this.version = data.v;
  // data.data is what the server will actually send. data.snapshot is the old
  // field name - supported now for backwards compatibility.
  this.snapshot = data.data || data.snapshot;
  this._setType(data.type);

  this.state = 'ready';
  this.emit('ready');
};

// Get and return the current document snapshot.
Doc.prototype.getSnapshot = function() {
  return this.snapshot;
};

// The callback will be called at a time when the document has a snapshot and
// you can start applying operations. This may be immediately.
Doc.prototype.whenReady = function(fn) {
  if (this.state === 'ready') {
    fn();
  } else {
    this.on('ready', fn);
  }
};

Doc.prototype.hasPending = function() {
  return this.inflightData != null || !!this.pendingData.length;
};


// **** Helpers for network messages

// Send a message to the connection from this document.
Doc.prototype._send = function(message) {
  message.c = this.collection;
  message.d = this.name;
  this.connection.send(message);
};

// This function exists so connection can call it directly for bulk subscribes.
// It could just make a temporary object literal, thats pretty slow.
Doc.prototype._handleSubscribe = function(err, data) {
  if (err && err !== 'Already subscribed') {
    if (console) console.error("Could not subscribe: " + err);
    this.emit('error', err);
    // There's probably a reason we couldn't subscribe. Don't retry.
    this._setWantSubscribe(false, null, err)
  } else {
    if (data) this.injestData(data);
    this.subscribed = true;
    this.emit('subscribe');
    this._finishSub(true);
  }

  this._clearAction('subscribe');
};

// This is called by the connection when it receives a message for the document.
Doc.prototype._onMessage = function(msg) {
  if (!(msg.c === this.collection && msg.d === this.name)) {
    // This should never happen - its a sanity check for bugs in the connection code.
    throw new Error("Got message for wrong document.");
  }

  // msg.a = the action.
  switch (msg.a) {
    case 'fetch':
      // We're done fetching. This message has no other information.
      if (msg.data) this.injestData(msg.data);
      this._finishSub('fetch', msg.error);
      if (this.wantSubscribe === 'fetch') this.wantSubscribe = false;
      this._clearAction('fetch');
      break;

    case 'sub':
      // Subscribe reply.
      this._handleSubscribe(msg.error, msg.data);
      break;

    case 'unsub':
      // Unsubscribe reply
      this.subscribed = false;
      this.emit('unsubscribe');

      this._finishSub(false, msg.error);
      this._clearAction('unsubscribe');
      break;

    case 'ack':
      // Acknowledge a locally submitted operation.
      //
      // Usually we do nothing here - all the interesting logic happens when we
      // get sent our op back in the op stream (which happens even if we aren't
      // subscribed). However, if the op doesn't get accepted, we still need to
      // clear some state.
      //
      // If the message error is 'Op already submitted', that means we've
      // resent an op that the server already got. It will also be confirmed
      // normally.
      if (msg.error && msg.error !== 'Op already submitted') {
        // The server has rejected an op from the client for some reason.
        // We'll send the error message to the user and try to roll back the change.
        if (this.inflightData) {
          console.warn('Operation was rejected (' + msg.error + '). Trying to rollback change locally.');
          this._tryRollback(this.inflightData);
        } else {
          // I managed to get into this state once. I'm not sure how it happened.
          // The op was maybe double-acknowledged?
          if (console) console.warn('Second acknowledgement message (error) received', msg, this);
        }
          
        this._clearInflightOp(msg.error);
      }
      break;

    case 'op':
      if (this.inflightData &&
          msg.src === this.inflightData.src &&
          msg.seq === this.inflightData.seq) {
        // This one is mine. Accept it as acknowledged.
        this._opAcknowledged(msg);
        break;
      }

      if (msg.v !== this.version) {
        // This will happen naturally in the following (or similar) cases:
        //
        // Client is not subscribed to document.
        // -> client submits an operation (v=10)
        // -> client subscribes to a query which matches this document. Says we
        //    have v=10 of the doc.
        //
        // <- server acknowledges the operation (v=11). Server acknowledges the
        //    operation because the doc isn't subscribed
        // <- server processes the query, which says the client only has v=10.
        //    Server subscribes at v=10 not v=11, so we get another copy of the
        //    v=10 operation.
        //
        // In this case, we can safely ignore the old (duplicate) operation.
        break;
      }

      if (this.inflightData) xf(this.inflightData, msg);

      for (var i = 0; i < this.pendingData.length; i++) {
        xf(this.pendingData[i], msg);
      }

      this.version++;
      this._otApply(msg, false);
      this._afterOtApply(msg, false);
      //console.log('applied', JSON.stringify(msg));
      break;

    case 'meta':
      if (console) console.warn('Unhandled meta op:', msg);
      break;

    default:
      if (console) console.warn('Unhandled document message:', msg);
      break;
  }
};

// Called whenever (you guessed it!) the connection state changes. This will
// happen when we get disconnected & reconnect.
Doc.prototype._onConnectionStateChanged = function(state, reason) {
  if (state === 'connecting') {
    if (this.inflightData) {
      this._sendOpData();
    } else {
      this.flush();
    }
  } else if (state === 'connected') {
    // We go into the connected state once we have a sessionID. We can't send
    // new ops until then, so we need to flush again.
    this.flush();
  } else if (state === 'disconnected') {
    this.action = null;
    this.subscribed = false;
    if (this.subscribed) this.emit('unsubscribed');
  }
};




// ****** Dealing with actions

Doc.prototype._clearAction = function(expectedAction) {
  if (this.action !== expectedAction) {
    console.warn('Unexpected action ' + this.action + ' expected: ' + expectedAction);
  }
  this.action = null;
  this.flush();
};



// Send the next pending op to the server, if we can.
//
// Only one operation can be in-flight at a time. If an operation is already on
// its way, or we're not currently connected, this method does nothing.
Doc.prototype.flush = function() {
  if (!this.connection.canSend || this.action) return;

  var opData;
  // Pump and dump any no-ops from the front of the pending op list.
  while (this.pendingData.length && isNoOp(opData = this.pendingData[0])) {
    var callbacks = opData.callbacks;
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](opData.error);
    }
    this.pendingData.shift();
  }

  // First consider changing state
  if (this.subscribed && !this.wantSubscribe) {
    this.action = 'unsubscribe';
    this._send({a:'unsub'});
  } else if (!this.subscribed && this.wantSubscribe === 'fetch') {
    this.action = 'fetch';
    this._send(this.state === 'ready' ? {a:'fetch', v:this.version} : {a:'fetch'});
  } else if (!this.subscribed && this.wantSubscribe) {
    this.action = 'subscribe';
    // Special send method needed for bulk subscribes on reconnect.
    this.connection.sendSubscribe(this.collection, this.name, this.state === 'ready' ? this.version : null);
  } else if (!this.paused && this.pendingData.length && this.connection.state === 'connected') {
    // Try and send any pending ops. We can't send ops while in 
    this.inflightData = this.pendingData.shift();

    // Delay for debugging.
    //var that = this;
    //setTimeout(function() { that._sendOpData(); }, 1000);

    // This also sets action to 'submit'.
    this._sendOpData();
  }
};


// ****** Subscribing, unsubscribing and fetching

// These functions iare copied into the query class as well, so be careful making
// changes here.

// Value is true, false or 'fetch'.
Doc.prototype._setWantSubscribe = function(value, callback, err) {
  if (this.subscribed === this.wantSubscribe &&
      (this.subscribed === value || value === 'fetch' && this.subscribed)) {
    if (callback) callback(err);
    return;
  }
  
  if (!this.wantSubscribe !== !value) {
    // Call all the current subscribe/unsubscribe callbacks.
    for (var i = 0; i < this._subscribeCallbacks.length; i++) {
      // Should I return an error here? What happened is the user unsubcribed
      // with a callback then resubscribed straight after. Does that mean the
      // unsubscribe failed?
      this._subscribeCallbacks[i](err);
    }
    this._subscribeCallbacks.length = 0;
  }

  // If we want to subscribe, don't weaken it to a fetch.
  if (value !== 'fetch' || this.wantSubscribe !== true)
    this.wantSubscribe = value;

  if (callback) this._subscribeCallbacks.push(callback);
  this.flush();
};

// Open the document. There is no callback and no error handling if you're
// already connected.
//
// Only call this once per document.
Doc.prototype.subscribe = function(callback) {
  this._setWantSubscribe(true, callback);
};

// Unsubscribe. The data will stay around in local memory, but we'll stop
// receiving updates.
Doc.prototype.unsubscribe = function(callback) {
  this._setWantSubscribe(false, callback);
};

// Call to request fresh data from the server.
Doc.prototype.fetch = function(callback) {
  this._setWantSubscribe('fetch', callback);
};

// Called when our subscribe, fetch or unsubscribe messages are acknowledged.
Doc.prototype._finishSub = function(value, error) {
  if (value === this.wantSubscribe) {
    for (var i = 0; i < this._subscribeCallbacks.length; i++) {
      this._subscribeCallbacks[i](error);
    }
    this._subscribeCallbacks.length = 0;
  }
};


// Operations


// ************ Dealing with operations.

// Helper function to set opData to contain a no-op.
var setNoOp = function(opData) {
  delete opData.op;
  delete opData.create;
  delete opData.del;
};

var isNoOp = function(opData) {
  return !opData.op && !opData.create && !opData.del;
}

// Try to compose data2 into data1. Returns truthy if it succeeds, otherwise falsy.
var tryCompose = function(type, data1, data2) {
  if (data1.create && data2.del) {
    setNoOp(data1);
  } else if (data1.create && data2.op) {
    // Compose the data into the create data.
    var data = (data1.create.data === undefined) ? type.create() : data1.create.data;
    data1.create.data = type.apply(data, data2.op);
  } else if (isNoOp(data1)) {
    data1.create = data2.create;
    data1.del = data2.del;
    data1.op = data2.op;
  } else if (data1.op && data2.op && type.compose) {
    data1.op = type.compose(data1.op, data2.op);
  } else {
    return false;
  }
  return true;
};

// Transform server op data by a client op, and vice versa. Ops are edited in place.
var xf = function(client, server) {
  // In this case, we're in for some fun. There are some local operations
  // which are totally invalid - either the client continued editing a
  // document that someone else deleted or a document was created both on the
  // client and on the server. In either case, the local document is way
  // invalid and the client's ops are useless.
  //
  // The client becomes a no-op, and we keep the server op entirely.
  if (server.create || server.del) return setNoOp(client);
  if (client.create) throw new Error('Invalid state. This is a bug.');

  // The client has deleted the document while the server edited it. Kill the
  // server's op.
  if (client.del) return setNoOp(server);

  // We only get here if either the server or client ops are no-op. Carry on,
  // nothing to see here.
  if (!server.op || !client.op) return;

  // They both edited the document. This is the normal case for this function -
  // as in, most of the time we'll end up down here.
  //
  // You should be wondering why I'm using client.type instead of this.type.
  // The reason is, if we get ops at an old version of the document, this.type
  // might be undefined or a totally different type. By pinning the type to the
  // op data, we make sure the right type has its transform function called.
  if (client.type.transformX) {
    var result = client.type.transformX(client.op, server.op);
    client.op = result[0];
    server.op = result[1];
  } else {
    //console.log('xf', JSON.stringify(client.op), JSON.stringify(server.op));
    var _c = client.type.transform(client.op, server.op, 'left');
    var _s = client.type.transform(server.op, client.op, 'right');
    client.op = _c; server.op = _s;
    //console.log('->', JSON.stringify(client.op), JSON.stringify(server.op));
  }
};

// Internal method to actually apply the given op data to our local model.
//
// _afterOtApply() should always be called synchronously afterwards.
Doc.prototype._otApply = function(opData, context) {
  // Lock the document. Nobody is allowed to call submitOp() until _afterOtApply is called.
  this.locked = true;

  if (opData.create) {
    // If the type is currently set, it means we tried creating the document
    // and someone else won. client create x server create = server create.
    var create = opData.create;
    this._setType(create.type);
    this.snapshot = this.type.create(create.data);

    // This is a bit heavyweight, but I want the created event to fire outside of the lock.
    this.once('unlock', function() {
      this.emit('create', context);
    });
  } else if (opData.del) {
    // The type should always exist in this case. del x _ = del
    var oldSnapshot = this.snapshot;
    this._setType(null);
    this.once('unlock', function() {
      this.emit('del', context, oldSnapshot);
    });
  } else if (opData.op) {
    if (!this.type) throw new Error('Document does not exist');

    var type = this.type;

    var op = opData.op;
    
    // The context needs to be told we're about to edit, just in case it needs
    // to store any extra data. (text-tp2 has this constraint.)
    for (var i = 0; i < this.editingContexts.length; i++) {
      var c = this.editingContexts[i];
      if (c != context && c._beforeOp) c._beforeOp(opData.op);
    }

    this.emit('before op', op, context);

    // This exists so clients can pull any necessary data out of the snapshot
    // before it gets changed.  Previously we kept the old snapshot object and
    // passed it to the op event handler. However, apply no longer guarantees
    // the old object is still valid.
    //
    // Because this could be totally unnecessary work, its behind a flag. set
    // doc.incremental to enable.
    if (this.incremental && type.incrementalApply) {
      var _this = this;
      type.incrementalApply(this.snapshot, op, function(o, snapshot) {
        _this.snapshot = snapshot;
        _this.emit('op', o, context);
      });
    } else {
      // This is the most common case, simply applying the operation to the local snapshot.
      this.snapshot = type.apply(this.snapshot, op);
      this.emit('op', op, context);
    }
  }
  // Its possible for none of the above cases to match, in which case the op is
  // a no-op. This will happen when a document has been deleted locally and
  // remote ops edit the document.
};

// This should be called right after _otApply.
Doc.prototype._afterOtApply = function(opData, context) {
  this.locked = false;
  this.emit('unlock');
  if (opData.op) {
    var contexts = this.editingContexts;
    // Notify all the contexts about the op (well, all the contexts except
    // the one which initiated the submit in the first place).
    for (var i = 0; i < contexts.length; i++) {
      var c = contexts[i];
      if (c != context && c._onOp) c._onOp(opData.op);
    }
    for (var i = 0; i < contexts.length; i++) {
      if (contexts.remove) contexts.splice(i--, 1);
    }

    return this.emit('after op', opData.op, context);
  }
};



// ***** Sending operations


// Actually send op data to the server.
Doc.prototype._sendOpData = function() {
  var d = this.inflightData;

  if (this.action) throw new Error('invalid state ' + this.action + ' for sendOpData');
  this.action = 'submit';

  var msg = {a:'op', v:this.version};
  if (d.src) {
    msg.src = d.src;
    msg.seq = d.seq;
  }

  // The server autodetects this.
  //if (this.state === 'unsubscribed') msg.f = true; // fetch intermediate ops

  if (d.op) msg.op = d.op;
  if (d.create) msg.create = d.create;
  if (d.del) msg.del = d.del;

  msg.c = this.collection;
  msg.d = this.name;

  this.connection.sendOp(msg);
   
  // The first time we send an op, its id and sequence number is implicit.
  if (!d.src) {
    d.src = this.connection.id;
    d.seq = this.connection.seq++;
  }
};


// Internal method called to do the actual work for submitOp(), create() and del().
//
// context is optional.
Doc.prototype._submitOpData = function(opData, context, callback) {
  //console.log('submit', JSON.stringify(opData), 'v=', this.version);

  if (typeof context === 'function') {
    callback = context;
    context = true; // The default context is true.
  }
  if (context == null) context = true;

  var error = function(err) {
    if (callback) callback(err);
    else if (console) console.warn('Failed attempt to submitOp:', err);
  };

  if (this.locked) {
    return error("Cannot call submitOp from inside an 'op' event handler");
  }

  // The opData contains either op, create, delete, or none of the above (a no-op).

  if (opData.op) {
    if (!this.type) return error('Document has not been created');

    // Try to normalize the op. This removes trailing skip:0's and things like that.
    if (this.type.normalize) opData.op = this.type.normalize(opData.op);
  }

  if (!this.state) {
    this.state = 'floating';
  }

  // Actually apply the operation locally.
  this._otApply(opData, context);

  // If the type supports composes, try to compose the operation onto the end
  // of the last pending operation.
  var entry = this.pendingData[this.pendingData.length - 1];

  if (this.pendingData.length &&
      (entry = this.pendingData[this.pendingData.length - 1],
       tryCompose(this.type, entry, opData))) {
  } else {
    entry = opData;
    opData.type = this.type;
    opData.callbacks = [];
    this.pendingData.push(opData);
  }

  if (callback) entry.callbacks.push(callback);

  this._afterOtApply(opData, context);

  // The call to flush is in a timeout so if submitOp() is called multiple
  // times in a closure all the ops are combined before being sent to the
  // server. It doesn't matter if flush is called a bunch of times.
  var _this = this;
  setTimeout((function() { _this.flush(); }), 0);
};


// *** Client OT entrypoints.

// Submit an operation to the document. The op must be valid given the current OT type.
Doc.prototype.submitOp = function(op, context, callback) {
  this._submitOpData({op: op}, context, callback);
};

// Create the document, which in ShareJS semantics means to set its type. Every
// object implicitly exists in the database but has no data and no type. Create
// sets the type of the object and can optionally set some initial data on the
// object, depending on the type.
Doc.prototype.create = function(type, data, context, callback) {
  if (typeof data === 'function') {
    // Setting the context to be the callback function in this case so _submitOpData
    // can handle the default value thing.
    context = data;
    data = undefined;
  }
  if (this.type) {
    if (callback) callback('Document already exists');
    return 
  }

  this._submitOpData({create: {type:type, data:data}}, context, callback);
};

// Delete the document. This creates and submits a delete operation to the
// server. Deleting resets the object's type to null and deletes its data. The
// document still exists, and still has the version it used to have before you
// deleted it (well, old version +1).
Doc.prototype.del = function(context, callback) {
  if (!this.type) {
    if (callback) callback('Document does not exist');
    return;
  }

  this._submitOpData({del: true}, context, callback);
};


// Pausing stops the document from sending any operations to the server.
Doc.prototype.pause = function() {
  this.paused = true;
};

Doc.prototype.resume = function() {
  this.paused = false;
  this.flush();
};


// *** Receiving operations


// This will be called when the server rejects our operations for some reason.
// There's not much we can do here if the OT type is noninvertable, but that
// shouldn't happen too much in real life because readonly documents should be
// flagged as such. (I should probably figure out a flag for that).
//
// This does NOT get called if our op fails to reach the server for some reason
// - we optimistically assume it'll make it there eventually.
Doc.prototype._tryRollback = function(opData) {
  // This is probably horribly broken.
  if (opData.create) {
    this._setType(null);

    // I don't think its possible to get here if we aren't in a floating state.
    if (this.state === 'floating')
      this.state = null;
    else
      console.warn('Rollback a create from state ' + this.state);

  } else if (opData.op && opData.type.invert) {
    opData.op = opData.type.invert(opData.op);

    // Transform the undo operation by any pending ops.
    for (var i = 0; i < this.pendingData.length; i++) {
      xf(this.pendingData[i], opData);
    }

    // ... and apply it locally, reverting the changes.
    // 
    // This operation is applied to look like it comes from a remote context.
    // I'm still not 100% sure about this functionality, because its really a
    // local op. Basically, the problem is that if the client's op is rejected
    // by the server, the editor window should update to reflect the undo.
    this._otApply(opData, false);
    this._afterOtApply(opData, false);
  } else if (opData.op || opData.del) {
    // This is where an undo stack would come in handy.
    this._setType(null);
    this.version = null;
    this.state = null;
    this.subscribed = false;
    this.emit('error', "Op apply failed and the operation could not be reverted");

    // Trigger a fetch. In our invalid state, we can't really do anything.
    this.fetch();
    this.flush();
  }
};

Doc.prototype._clearInflightOp = function(error) {
  var callbacks = this.inflightData.callbacks;
  for (var i = 0; i < callbacks.length; i++) {
    callbacks[i](error || this.inflightData.error);
  }

  this.inflightData = null;
  this._clearAction('submit');

  if (!this.pendingData.length) {
    // This isn't a very good name.
    this.emit('nothing pending');
  }
};

// This is called when the server acknowledges an operation from the client.
Doc.prototype._opAcknowledged = function(msg) {
  // Our inflight op has been acknowledged, so we can throw away the inflight data.
  // (We were only holding on to it incase we needed to resend the op.)
  if (!this.state) {
    throw new Error('opAcknowledged called from a null state. This should never happen.');
  } else if (this.state === 'floating') {
    if (!this.inflightData.create) throw new Error('Cannot acknowledge an op.');

    // Our create has been acknowledged. This is the same as injesting some data.
    this.version = msg.v;
    this.state = 'ready';
    var _this = this;
    setTimeout(function() { _this.emit('ready'); }, 0);
  } else {
    // We already have a snapshot. The snapshot should be at the acknowledged
    // version, because the server has sent us all the ops that have happened
    // before acknowledging our op.

    // This should never happen - something is out of order.
    if (msg.v !== this.version)
      throw new Error('Invalid version from server. This can happen when you submit ops in a submitOp callback.');
  }
  
  // The op was committed successfully. Increment the version number
  this.version++;

  this._clearInflightOp();
};


// API Contexts

// This creates and returns an editing context using the current OT type.
Doc.prototype.createContext = function() {
  var type = this.type;
  if (!type) throw new Error('Missing type');

  // I could use the prototype chain to do this instead, but Object.create
  // isn't defined on old browsers. This will be fine.
  var doc = this;
  var context = {
    getSnapshot: function() {
      return doc.snapshot;
    },
    submitOp: function(op, callback) {
      doc.submitOp(op, context, callback);
    },
    destroy: function() {
      if (this.detach) {
        this.detach();
        // Don't double-detach.
        delete this.detach;
      }
      // It will be removed from the actual editingContexts list next time
      // we receive an op on the document (and the list is iterated through).
      //
      // This is potentially dodgy, allowing a memory leak if you create &
      // destroy a whole bunch of contexts without receiving or sending any ops
      // to the document.
      delete this._onOp;
      this.remove = true;
    },

    // This is dangerous, but really really useful for debugging. I hope people
    // don't depend on it.
    _doc: this,
  };

  if (type.api) {
    // Copy everything else from the type's API into the editing context.
    for (var k in type.api) {
      context[k] = type.api[k];
    }
  } else {
    context.provides = {};
  }

  this.editingContexts.push(context);

  return context;
};

Doc.prototype.removeContexts = function() {
  for (var i = 0; i < this.editingContexts.length; i++) {
    this.editingContexts[i].destroy();
  }
  this.editingContexts.length = 0;
};


},{"./microevent":77,"ottypes":79}],71:[function(require,module,exports){
var sha = require('./sha')
var rng = require('./rng')
var md5 = require('./md5')

var algorithms = {
  sha1: {
    hex: sha.hex_sha1,
    binary: sha.b64_sha1,
    ascii: sha.str_sha1
  },
  md5: {
    hex: md5.hex_md5,
    binary: md5.b64_md5,
    ascii: md5.any_md5
  }
}

function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/dominictarr/crypto-browserify'
    ].join('\n'))
}

exports.createHash = function (alg) {
  alg = alg || 'sha1'
  if(!algorithms[alg])
    error('algorithm:', alg, 'is not yet supported')
  var s = ''
  var _alg = algorithms[alg]
  return {
    update: function (data) {
      s += data
      return this
    },
    digest: function (enc) {
      enc = enc || 'binary'
      var fn
      if(!(fn = _alg[enc]))
        error('encoding:', enc , 'is not yet supported for algorithm', alg)
      var r = fn(s)
      s = null //not meant to use the hash after you've called digest.
      return r
    }
  }
}

exports.randomBytes = function(size, callback) {
  if (callback && callback.call) {
    try {
      callback.call(this, undefined, rng(size));
    } catch (err) { callback(err); }
  } else {
    return rng(size);
  }
}

// the least I can do is make error messages for the rest of the node.js/crypto api.
;['createCredentials'
, 'createHmac'
, 'createCypher'
, 'createCypheriv'
, 'createDecipher'
, 'createDecipheriv'
, 'createSign'
, 'createVerify'
, 'createDeffieHellman'
, 'pbkdf2'].forEach(function (name) {
  exports[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
})

},{"./sha":80,"./rng":81,"./md5":82}],79:[function(require,module,exports){

var register = function(type) {
  exports[type.name] = type;
  if (type.uri) {
    return exports[type.uri] = type;
  }
};

// Import all the built-in types. Requiring directly rather than in register()
// so browserify works.
register(require('./simple'));

register(require('./text'));
register(require('./text-tp2'));

register(require('./json0'));


},{"./simple":83,"./text":84,"./text-tp2":85,"./json0":86}],81:[function(require,module,exports){
// Original code adapted from Robert Kieffer.
// details at https://github.com/broofa/node-uuid
(function() {
  var _global = this;

  var mathRNG, whatwgRNG;

  // NOTE: Math.random() does not guarantee "cryptographic quality"
  mathRNG = function(size) {
    var bytes = new Array(size);
    var r;

    for (var i = 0, r; i < size; i++) {
      if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
      bytes[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return bytes;
  }

  // currently only available in webkit-based browsers.
  if (_global.crypto && crypto.getRandomValues) {
    var _rnds = new Uint32Array(4);
    whatwgRNG = function(size) {
      var bytes = new Array(size);
      crypto.getRandomValues(_rnds);

      for (var c = 0 ; c < size; c++) {
        bytes[c] = _rnds[c >> 2] >>> ((c & 0x03) * 8) & 0xff;
      }
      return bytes;
    }
  }

  module.exports = whatwgRNG || mathRNG;

}())
},{}],83:[function(require,module,exports){
// This is a really simple OT type. Its not compiled with the web client, but it could be.
//
// Its mostly included for demonstration purposes and its used in the meta unit tests.
//
// This defines a really simple text OT type which only allows inserts. (No deletes).
//
// Ops look like:
//   {position:#, text:"asdf"}
//
// Document snapshots look like:
//   {str:string}

module.exports = {
  // The name of the OT type. The type itself is exposed to ottypes[type.name] and ottypes[type.uri].
  // The name can be used instead of the actual type in all API methods in ShareJS.
  name: 'simple',

  // Canonical name.
  uri: 'http://sharejs.org/types/simple',

  // Create a new document snapshot. Initial data can be passed in.
  create: function(initial) {
    if (initial == null)
      initial = '';

    return {str: initial};
  },

  // Apply the given op to the document snapshot. Returns the new snapshot.
  apply: function(snapshot, op) {
    if (op.position < 0 || op.position > snapshot.str.length)
      throw new Error('Invalid position');

    var str = snapshot.str;
    str = str.slice(0, op.position) + op.text + str.slice(op.position);
    return {str: str};
  },

  // Transform op1 by op2. Returns transformed version of op1.
  // Sym describes the symmetry of the operation. Its either 'left' or 'right'
  // depending on whether the op being transformed comes from the client or the
  // server.
  transform: function(op1, op2, sym) {
    var pos = op1.position;

    if (op2.position < pos || (op2.position === pos && sym === 'left')) {
      pos += op2.text.length;
    }

    return {position: pos, text: op1.text};
  }
};


},{}],84:[function(require,module,exports){
/* Text OT!
 *
 * This is an OT implementation for text. It is the standard implementation of
 * text used by ShareJS.
 *
 * This type is composable but non-invertable. Its similar to ShareJS's old
 * text-composable type, but its not invertable and its very similar to the
 * text-tp2 implementation but it doesn't support tombstones or purging.
 *
 * Ops are lists of components which iterate over the document.
 * Components are either:
 *   A number N: Skip N characters in the original document
 *   "str"     : Insert "str" at the current position in the document
 *   {d:'str'} : Delete 'str', which appears at the current position in the document
 *
 * Eg: [3, 'hi', 5, {d:8}]
 *
 * The operation does not have to skip the last characters in the document.
 *
 * Snapshots are strings.
 *
 * Cursors are either a single number (which is the cursor position) or a pair of
 * [anchor, focus] (aka [start, end]). Be aware that end can be before start.
 */

/** @module text */

exports.name = 'text';
exports.uri = 'http://sharejs.org/types/textv1';

/** Create a new text snapshot.
 *
 * @param {string} initial - initial snapshot data. Optional. Defaults to ''.
 */
exports.create = function(initial) {
  if ((initial != null) && typeof initial !== 'string') {
    throw new Error('Initial data must be a string');
  }
  return initial || '';
};

var isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

/** Check the operation is valid. Throws if not valid. */
var checkOp = function(op) {
  if (!isArray(op)) throw new Error('Op must be an array of components');

  var last = null;
  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    switch (typeof c) {
      case 'object':
        // The only valid objects are {d:X} for +ive values of X.
        if (!(typeof c.d === 'number' && c.d > 0)) throw new Error('Object components must be deletes of size > 0');
        break;
      case 'string':
        // Strings are inserts.
        if (!(c.length > 0)) throw new Error('Inserts cannot be empty');
        break;
      case 'number':
        // Numbers must be skips. They have to be +ive numbers.
        if (!(c > 0)) throw new Error('Skip components must be >0');
        if (typeof last === 'number') throw new Error('Adjacent skip components should be combined');
        break;
    }
    last = c;
  }

  if (typeof last === 'number') throw new Error('Op has a trailing skip');
};

/** Make a function that appends to the given operation. */
var makeAppend = function(op) {
  return function(component) {
    if (!component || component.d === 0) {
      // The component is a no-op. Ignore!
 
    } else if (op.length === 0) {
      return op.push(component);

    } else if (typeof component === typeof op[op.length - 1]) {
      if (typeof component === 'object') {
        return op[op.length - 1].d += component.d;
      } else {
        return op[op.length - 1] += component;
      }
    } else {
      return op.push(component);
    }
  };
};

/** Makes and returns utility functions take and peek. */
var makeTake = function(op) {
  // The index of the next component to take
  var idx = 0;
  // The offset into the component
  var offset = 0;

  // Take up to length n from the front of op. If n is -1, take the entire next
  // op component. If indivisableField == 'd', delete components won't be separated.
  // If indivisableField == 'i', insert components won't be separated.
  var take = function(n, indivisableField) {
    // We're at the end of the operation. The op has skips, forever. Infinity
    // might make more sense than null here.
    if (idx === op.length)
      return n === -1 ? null : n;

    var part;
    var c = op[idx];
    if (typeof c === 'number') {
      // Skip
      if (n === -1 || c - offset <= n) {
        part = c - offset;
        ++idx;
        offset = 0;
        return part;
      } else {
        offset += n;
        return n;
      }
    } else if (typeof c === 'string') {
      // Insert
      if (n === -1 || indivisableField === 'i' || c.length - offset <= n) {
        part = c.slice(offset);
        ++idx;
        offset = 0;
        return part;
      } else {
        part = c.slice(offset, offset + n);
        offset += n;
        return part;
      }
    } else {
      // Delete
      if (n === -1 || indivisableField === 'd' || c.d - offset <= n) {
        part = {d: c.d - offset};
        ++idx;
        offset = 0;
        return part;
      } else {
        offset += n;
        return {d: n};
      }
    }
  };

  // Peek at the next op that will be returned.
  var peekType = function() { return op[idx]; };

  return [take, peekType];
};

/** Get the length of a component */
var componentLength = function(c) {
  // Uglify will compress this down into a ternary
  if (typeof c === 'number') {
    return c;
  } else {
    return c.length || c.d;
  }
};

/** Trim any excess skips from the end of an operation.
 *
 * There should only be at most one, because the operation was made with append.
 */
var trim = function(op) {
  if (op.length > 0 && typeof op[op.length - 1] === 'number') {
    op.pop();
  }
  return op;
};

exports.normalize = function(op) {
  var newOp = [];
  var append = makeAppend(newOp);
  for (var i = 0; i < op.length; i++) {
    append(op[i]);
  }
  return trim(newOp);
};

/** Apply an operation to a document snapshot */
exports.apply = function(str, op) {
  if (typeof str !== 'string') {
    throw new Error('Snapshot should be a string');
  }
  checkOp(op);

  // We'll gather the new document here and join at the end.
  var newDoc = [];

  for (var i = 0; i < op.length; i++) {
    var component = op[i];
    switch (typeof component) {
      case 'number':
        if (component > str.length) throw new Error('The op is too long for this document');

        newDoc.push(str.slice(0, component));
        // This might be slow for big strings. Consider storing the offset in
        // str instead of rewriting it each time.
        str = str.slice(component);
        break;
      case 'string':
        newDoc.push(component);
        break;
      case 'object':
        str = str.slice(component.d);
        break;
    }
  }

  return newDoc.join('') + str;
};

/** Transform op by otherOp.
 *
 * @param op - The operation to transform
 * @param otherOp - Operation to transform it by
 * @param side - Either 'left' or 'right'
 */
exports.transform = function(op, otherOp, side) {
  if (side != 'left' && side != 'right') throw new Error("side (" + side + ") must be 'left' or 'right'");

  checkOp(op);
  checkOp(otherOp);

  var newOp = [];
  var append = makeAppend(newOp);

  var _fns = makeTake(op);
  var take = _fns[0],
      peek = _fns[1];

  for (var i = 0; i < otherOp.length; i++) {
    var component = otherOp[i];

    var length, chunk;
    switch (typeof component) {
      case 'number': // Skip
        length = component;
        while (length > 0) {
          chunk = take(length, 'i');
          append(chunk);
          if (typeof chunk !== 'string') {
            length -= componentLength(chunk);
          }
        }
        break;

      case 'string': // Insert
        if (side === 'left') {
          // The left insert should go first.
          if (typeof peek() === 'string') {
            append(take(-1));
          }
        }

        // Otherwise skip the inserted text.
        append(component.length);
        break;

      case 'object': // Delete
        length = component.d;
        while (length > 0) {
          chunk = take(length, 'i');
          switch (typeof chunk) {
            case 'number':
              length -= chunk;
              break;
            case 'string':
              append(chunk);
              break;
            case 'object':
              // The delete is unnecessary now - the text has already been deleted.
              length -= chunk.d;
          }
        }
        break;
    }
  }
  
  // Append any extra data in op1.
  while ((component = take(-1)))
    append(component);
  
  return trim(newOp);
};

/** Compose op1 and op2 together and return the result */
exports.compose = function(op1, op2) {
  checkOp(op1);
  checkOp(op2);

  var result = [];
  var append = makeAppend(result);
  var take = makeTake(op1)[0];

  for (var i = 0; i < op2.length; i++) {
    var component = op2[i];
    var length, chunk;
    switch (typeof component) {
      case 'number': // Skip
        length = component;
        while (length > 0) {
          chunk = take(length, 'd');
          append(chunk);
          if (typeof chunk !== 'object') {
            length -= componentLength(chunk);
          }
        }
        break;

      case 'string': // Insert
        append(component);
        break;

      case 'object': // Delete
        length = component.d;

        while (length > 0) {
          chunk = take(length, 'd');

          switch (typeof chunk) {
            case 'number':
              append({d: chunk});
              length -= chunk;
              break;
            case 'string':
              length -= chunk.length;
              break;
            case 'object':
              append(chunk);
          }
        }
        break;
    }
  }

  while ((component = take(-1)))
    append(component);

  return trim(result);
};

var transformPosition = function(cursor, op) {
  var pos = 0;
  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (cursor <= pos) break;

    // I could actually use the op_iter stuff above - but I think its simpler
    // like this.
    switch (typeof c) {
      case 'number':
        if (cursor <= pos + c)
          return cursor;
        pos += c;
        break;

      case 'string':
        pos += c.length;
        cursor += c.length;
        break;

      case 'object':
        cursor -= Math.min(c.d, cursor - pos);
        break;
    }
  }
  return cursor;
};

exports.transformCursor = function(cursor, op, isOwnOp) {
  var pos = 0;
  if (isOwnOp) {
    // Just track the position. We'll teleport the cursor to the end anyway.
    // This works because text ops don't have any trailing skips at the end - so the last
    // component is the last thing.
    for (var i = 0; i < op.length; i++) {
      var c = op[i];
      switch (typeof c) {
        case 'number':
          pos += c;
          break;
        case 'string':
          pos += c.length;
          break;
        // Just eat deletes.
      }
    }
    return [pos, pos];
  } else {
    return [transformPosition(cursor[0], op), transformPosition(cursor[1], op)];
  }
};

},{}],80:[function(require,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

exports.hex_sha1 = hex_sha1;
exports.b64_sha1 = b64_sha1;
exports.str_sha1 = str_sha1;
exports.hex_hmac_sha1 = hex_hmac_sha1;
exports.b64_hmac_sha1 = b64_hmac_sha1;
exports.str_hmac_sha1 = str_hmac_sha1;

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}


},{}],85:[function(require,module,exports){
(function(){// A TP2 implementation of text, following this spec:
// http://code.google.com/p/lightwave/source/browse/trunk/experimental/ot/README
//
// A document is made up of a string and a set of tombstones inserted throughout
// the string. For example, 'some ', (2 tombstones), 'string'.
//
// This is encoded in a document as: {s:'some string', t:[5, -2, 6]}
//
// Ops are lists of components which iterate over the whole document. (I might
// change this at some point, but a version thats less strict is backwards
// compatible.)
//
// Components are either:
//   N:         Skip N characters in the original document
//   {i:'str'}: Insert 'str' at the current position in the document
//   {i:N}:     Insert N tombstones at the current position in the document
//   {d:N}:     Delete (tombstone) N characters at the current position in the document
//
// Eg: [3, {i:'hi'}, 5, {d:8}]
//
// Snapshots are lists with characters and tombstones. Characters are stored in strings
// and adjacent tombstones are flattened into numbers.
//
// Eg, the document: 'Hello .....world' ('.' denotes tombstoned (deleted) characters)
// would be represented by a document snapshot of ['Hello ', 5, 'world']

//var append, appendDoc, componentLength, makeTake, takeDoc, transformer;

var type = module.exports = {
  name: 'text-tp2',
  tp2: true,
  uri: 'http://sharejs.org/types/text-tp2v1',
  create: function(initial) {
    if (initial == null) {
      initial = '';
    } else {
      if (typeof initial != 'string') throw new Error('Initial data must be a string');
    }

    return {
      charLength: initial.length,
      totalLength: initial.length,
      data: initial.length ? [initial] : []
    };
  },

  serialize: function(doc) {
    if (!doc.data) {
      throw new Error('invalid doc snapshot');
    }
    return doc.data;
  },

  deserialize: function(data) {
    var doc = type.create();
    doc.data = data;

    for (var i = 0; i < data.length; i++) {
      var component = data[i];

      if (typeof component === 'string') {
        doc.charLength += component.length;
        doc.totalLength += component.length;
      } else {
        doc.totalLength += component;
      }
    }

    return doc;
  }
};

var isArray = Array.isArray || function(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
};

var checkOp = function(op) {
  if (!isArray(op)) throw new Error('Op must be an array of components');

  var last = null;
  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (typeof c == 'object') {
      // The component is an insert or a delete.
      if (c.i !== undefined) { // Insert.
        if (!((typeof c.i === 'string' && c.i.length > 0) // String inserts
              || (typeof c.i === 'number' && c.i > 0))) // Tombstone inserts
          throw new Error('Inserts must insert a string or a +ive number');

      } else if (c.d !== undefined) { // Delete
        if (!(typeof c.d === 'number' && c.d > 0))
          throw new Error('Deletes must be a +ive number');

      } else throw new Error('Operation component must define .i or .d');

    } else {
      // The component must be a skip.
      if (typeof c != 'number') throw new Error('Op components must be objects or numbers');

      if (c <= 0) throw new Error('Skip components must be a positive number');
      if (typeof last === 'number') throw new Error('Adjacent skip components should be combined');
    }

    last = c;
  }
};

// Take the next part from the specified position in a document snapshot.
// position = {index, offset}. It will be updated.
var takeDoc = type._takeDoc = function(doc, position, maxlength, tombsIndivisible) {
  if (position.index >= doc.data.length)
    throw new Error('Operation goes past the end of the document');

  var part = doc.data[position.index];

  // This can be written as an ugly-arsed giant ternary statement, but its much
  // more readable like this. Uglify will convert it into said ternary anyway.
  var result;
  if (typeof part == 'string') {
    if (maxlength != null) {
      result = part.slice(position.offset, position.offset + maxlength);
    } else {
      result = part.slice(position.offset);
    }
  } else {
    if (maxlength == null || tombsIndivisible) {
      result = part - position.offset;
    } else {
      result = Math.min(maxlength, part - position.offset);
    }
  }

  var resultLen = result.length || result;

  if ((part.length || part) - position.offset > resultLen) {
    position.offset += resultLen;
  } else {
    position.index++;
    position.offset = 0;
  }

  return result;
};

// Append a part to the end of a document
var appendDoc = type._appendDoc = function(doc, p) {
  if (p === 0 || p === '') return;

  if (typeof p === 'string') {
    doc.charLength += p.length;
    doc.totalLength += p.length;
  } else {
    doc.totalLength += p;
  }

  var data = doc.data;
  if (data.length === 0) {
    data.push(p);
  } else if (typeof data[data.length - 1] === typeof p) {
    data[data.length - 1] += p;
  } else {
    data.push(p);
  }
};

// Apply the op to the document. The document is not modified in the process.
type.apply = function(doc, op) {
  if (doc.totalLength == null || doc.charLength == null || !isArray(doc.data)) {
    throw new Error('Snapshot is invalid');
  }
  checkOp(op);

  var newDoc = type.create();
  var position = {index: 0, offset: 0};

  for (var i = 0; i < op.length; i++) {
    var component = op[i];
    var remainder, part;

    if (typeof component == 'number') { // Skip
      remainder = component;
      while (remainder > 0) {
        part = takeDoc(doc, position, remainder);
        appendDoc(newDoc, part);
        remainder -= part.length || part;
      }

    } else if (component.i !== undefined) { // Insert
      appendDoc(newDoc, component.i);

    } else if (component.d !== undefined) { // Delete
      remainder = component.d;
      while (remainder > 0) {
        part = takeDoc(doc, position, remainder);
        remainder -= part.length || part;
      }
      appendDoc(newDoc, component.d);
    }
  }
  return newDoc;
};

// Append an op component to the end of the specified op.  Exported for the
// randomOpGenerator.
var append = type._append = function(op, component) {
  var last;

  if (component === 0 || component.i === '' || component.i === 0 || component.d === 0) {
    // Drop the new component.
  } else if (op.length === 0) {
    op.push(component);
  } else {
    last = op[op.length - 1];
    if (typeof component == 'number' && typeof last == 'number') {
      op[op.length - 1] += component;
    } else if (component.i != null && (last.i != null) && typeof last.i === typeof component.i) {
      last.i += component.i;
    } else if (component.d != null && (last.d != null)) {
      last.d += component.d;
    } else {
      op.push(component);
    }
  }
};

// Makes 2 functions for taking components from the start of an op, and for
// peeking at the next op that could be taken.
var makeTake = function(op) {
  // The index of the next component to take
  var index = 0;
  // The offset into the component
  var offset = 0;

  var take = function(maxlength, insertsIndivisible) {
    if (index === op.length) return null;
    var e = op[index];
    var current;
    var result;

    // if the current element is a skip, an insert of a number or a delete
    if (typeof (current = e) == 'number' || typeof (current = e.i) == 'number' || (current = e.d) != null) {
      var c;
      if ((maxlength == null) || current - offset <= maxlength || (insertsIndivisible && e.i != null)) {
        // Return the rest of the current element.
        c = current - offset;
        ++index;
        offset = 0;
      } else {
        offset += maxlength;
        c = maxlength;
      }

      // Package the component back up.
      if (e.i != null) {
        return {i: c};
      } else if (e.d != null) {
        return {d: c};
      } else {
        return c;
      }
    } else { // Insert of a string.
      if ((maxlength == null) || e.i.length - offset <= maxlength || insertsIndivisible) {
        result = {i: e.i.slice(offset)};
        ++index;
        offset = 0;
      } else {
        result = {i: e.i.slice(offset, offset + maxlength)};
        offset += maxlength;
      }
      return result;
    }
  };

  var peekType = function() {return op[index];};
  return [take, peekType];
};

// Find and return the length of an op component
var componentLength = function(component) {
  if (typeof component === 'number') {
    return component;
  } else if (typeof component.i === 'string') {
    return component.i.length;
  } else {
    return component.d || component.i;
  }
};

// Normalize an op, removing all empty skips and empty inserts / deletes.
// Concatenate adjacent inserts and deletes.
type.normalize = function(op) {
  var newOp = [];
  for (var i = 0; i < op.length; i++) {
    append(newOp, op[i]);
  }
  return newOp;
};

// This is a helper method to transform and prune. goForwards is true for transform, false for prune.
var transformer = function(op, otherOp, goForwards, side) {
  checkOp(op);
  checkOp(otherOp);

  var newOp = [];

  var fns = makeTake(op),
      take = fns[0],
      peek = fns[1];

  for (var i = 0; i < otherOp.length; i++) {
    var component = otherOp[i];
    var len = componentLength(component);
    var chunk;

    if (component.i != null) { // Insert text or tombs
      if (goForwards) { // Transform - insert skips over deleted parts.
        if (side === 'left') {
          // The left side insert should go first.
          var next;
          while ((next = peek()) && next.i != null) {
            append(newOp, take());
          }
        }
        // In any case, skip the inserted text.
        append(newOp, len);

      } else { // Prune. Remove skips for inserts.
        while (len > 0) {
          chunk = take(len, true);

          // The chunk will be null if we run out of components in the other op.
          if (chunk === null) throw new Error('The transformed op is invalid');
          if (chunk.d != null)
            throw new Error('The transformed op deletes locally inserted characters - it cannot be purged of the insert.');

          if (typeof chunk == 'number')
            len -= chunk;
          else
            append(newOp, chunk);
        }
      }
    } else { // Skips or deletes.
      while (len > 0) {
        chunk = take(len, true);
        if (chunk === null) throw new Error('The op traverses more elements than the document has');

        append(newOp, chunk);
        if (!chunk.i) len -= componentLength(chunk);
      }
    }
  }

  // Append extras from op1.
  var component;
  while ((component = take())) {
    if (component.i === undefined) {
      throw new Error("Remaining fragments in the op: " + component);
    }
    append(newOp, component);
  }
  return newOp;
};

// transform op1 by op2. Return transformed version of op1. op1 and op2 are
// unchanged by transform. Side should be 'left' or 'right', depending on if
// op1.id <> op2.id.
//
// 'left' == client op for ShareJS.
type.transform = function(op, otherOp, side) {
  if (side != 'left' && side != 'right')
    throw new Error("side (" + side + ") should be 'left' or 'right'");

  return transformer(op, otherOp, true, side);
};

type.prune = function(op, otherOp) {
  return transformer(op, otherOp, false);
};

type.compose = function(op1, op2) {
  //var chunk, chunkLength, component, length, result, take, _, _i, _len, _ref;
  if (op1 == null) return op2;

  checkOp(op1);
  checkOp(op2);

  var result = [];
  var take = makeTake(op1)[0];
  var component;

  for (var i = 0; i < op2.length; i++) {
    component = op2[i];
    var len, chunk;

    if (typeof component === 'number') { // Skip
      // Just copy from op1.
      len = component;
      while (len > 0) {
        chunk = take(len);
        if (chunk === null)
          throw new Error('The op traverses more elements than the document has');

        append(result, chunk);
        len -= componentLength(chunk);
      }

    } else if (component.i !== undefined) { // Insert
      append(result, {i: component.i});

    } else { // Delete
      len = component.d;
      while (len > 0) {
        chunk = take(len);
        if (chunk === null)
          throw new Error('The op traverses more elements than the document has');

        var chunkLength = componentLength(chunk);

        if (chunk.i !== undefined)
          append(result, {i: chunkLength});
        else
          append(result, {d: chunkLength});

        len -= chunkLength;
      }
    }
  }

  // Append extras from op1.
  while ((component = take())) {
    if (component.i === undefined) {
      throw new Error("Remaining fragments in op1: " + component);
    }
    append(result, component);
  }
  return result;
};


})()
},{}],82:[function(require,module,exports){
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
function hex_hmac_md5(k, d)
  { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_md5(k, d)
  { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_md5(k, d, e)
  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of a raw string
 */
function rstr_md5(s)
{
  return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
}

/*
 * Calculate the HMAC-MD5, of a key and some data (raw strings)
 */
function rstr_hmac_md5(key, data)
{
  var bkey = rstr2binl(key);
  if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var i, j, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. All remainders are stored for later
   * use.
   */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)));
  var remainders = Array(full_length);
  for(j = 0; j < full_length; j++)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[j] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
  return output;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length.
 */
function binl_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}


exports.hex_md5 = hex_md5;
exports.b64_md5 = b64_md5;
exports.any_md5 = any_md5;

},{}],86:[function(require,module,exports){
/*
 This is the implementation of the JSON OT type.

 Spec is here: https://github.com/josephg/ShareJS/wiki/JSON-Operations

 Note: This is being made obsolete. It will soon be replaced by the JSON2 type.
*/

/**
 * UTILITY FUNCTIONS
 */

/**
 * Checks if the passed object is an Array instance. Can't use Array.isArray
 * yet because its not supported on IE8.
 *
 * @param obj
 * @returns {boolean}
 */
var isArray = function(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
};

/**
 * Clones the passed object using JSON serialization (which is slow).
 *
 * hax, copied from test/types/json. Apparently this is still the fastest way
 * to deep clone an object, assuming we have browser support for JSON.  @see
 * http://jsperf.com/cloning-an-object/12
 */
var clone = function(o) {
  return JSON.parse(JSON.stringify(o));
};



/**
 * Reference to the Text OT type. This is used for the JSON String operations.
 * @type {*}
 */
var text = typeof require !== "undefined" ? require('./text-old') : window.ottypes.text;



/**
 * JSON OT Type
 * @type {*}
 */
var json = { 
  name: 'json0',
  uri: 'http://sharejs.org/types/JSONv0'
};

json.create = function(data) {
  // Null instead of undefined if you don't pass an argument.
  return data === undefined ? null : data;
};

json.invertComponent = function(c) {
  var c_ = {p: c.p};

  if (c.si !== void 0) c_.sd = c.si;
  if (c.sd !== void 0) c_.si = c.sd;
  if (c.oi !== void 0) c_.od = c.oi;
  if (c.od !== void 0) c_.oi = c.od;
  if (c.li !== void 0) c_.ld = c.li;
  if (c.ld !== void 0) c_.li = c.ld;
  if (c.na !== void 0) c_.na = -c.na;

  if (c.lm !== void 0) {
    c_.lm = c.p[c.p.length-1];
    c_.p = c.p.slice(0,c.p.length-1).concat([c.lm]);
  }

  return c_;
};

json.invert = function(op) {
  var op_ = op.slice().reverse();
  var iop = [];
  for (var i = 0; i < op_.length; i++) {
    iop.push(json.invertComponent(op_[i]));
  }
  return iop;
};

json.checkValidOp = function(op) {
  for (var i = 0; i < op.length; i++) {
  if (!isArray(op[i].p))
    throw new Error('Missing path');
  }
};

json.checkList = function(elem) {
  if (!isArray(elem))
    throw new Error('Referenced element not a list');
};

json.checkObj = function(elem) {
  if (elem.constructor !== Object) {
    throw new Error("Referenced element not an object (it was " + JSON.stringify(elem) + ")");
  }
};

json.apply = function(snapshot, op) {
  json.checkValidOp(op);

  op = clone(op);

  var container = {
    data: snapshot
  };

  for (var i = 0; i < op.length; i++) {
    var c = op[i];

    var parent = null;
    var parentKey = null;
    var elem = container;
    var key = 'data';

    for (var j = 0; j < c.p.length; j++) {
      var p = c.p[j];

      parent = elem;
      parentKey = key;
      elem = elem[key];
      key = p;

      if (parent == null)
        throw new Error('Path invalid');
    }

    // Number add
    if (c.na !== void 0) {
      if (typeof elem[key] != 'number')
        throw new Error('Referenced element not a number');

      elem[key] += c.na;
    }

    // String insert
    else if (c.si !== void 0) {
      if (typeof elem != 'string')
        throw new Error('Referenced element not a string (it was '+JSON.stringify(elem)+')');

      parent[parentKey] = elem.slice(0,key) + c.si + elem.slice(key);
    }

    // String delete
    else if (c.sd !== void 0) {
      if (typeof elem != 'string')
        throw new Error('Referenced element not a string');

      if (elem.slice(key,key + c.sd.length) !== c.sd)
        throw new Error('Deleted string does not match');

      parent[parentKey] = elem.slice(0,key) + elem.slice(key + c.sd.length);
    }

    // List replace
    else if (c.li !== void 0 && c.ld !== void 0) {
      json.checkList(elem);
      // Should check the list element matches c.ld
      elem[key] = c.li;
    }

    // List insert
    else if (c.li !== void 0) {
      json.checkList(elem);
      elem.splice(key,0, c.li);
    }

    // List delete
    else if (c.ld !== void 0) {
      json.checkList(elem);
      // Should check the list element matches c.ld here too.
      elem.splice(key,1);
    }

    // List move
    else if (c.lm !== void 0) {
      json.checkList(elem);
      if (c.lm != key) {
        var e = elem[key];
        // Remove it...
        elem.splice(key,1);
        // And insert it back.
        elem.splice(c.lm,0,e);
      }
    }

    // Object insert / replace
    else if (c.oi !== void 0) {
      json.checkObj(elem);

      // Should check that elem[key] == c.od
      elem[key] = c.oi;
    }

    // Object delete
    else if (c.od !== void 0) {
      json.checkObj(elem);

      // Should check that elem[key] == c.od
      delete elem[key];
    }

    else {
      throw new Error('invalid / missing instruction in op');
    }
  }

  return container.data;
};

// Helper for incrementally applying an operation to a snapshot. Calls yield
// after each op component has been applied.
json.incrementalApply = function(snapshot, op, _yield) {
  for (var i = 0; i < op.length; i++) {
    var smallOp = [op[i]];
    snapshot = json.apply(snapshot, smallOp);
    // I'd just call this yield, but thats a reserved keyword. Bah!
    _yield(smallOp, snapshot);
  }
  
  return snapshot;
};

// Checks if two paths, p1 and p2 match.
var pathMatches = json.pathMatches = function(p1, p2, ignoreLast) {
  if (p1.length != p2.length)
    return false;

  for (var i = 0; i < p1.length; i++) {
    if (p1[i] !== p2[i] && (!ignoreLast || i !== p1.length - 1))
      return false;
  }

  return true;
};

var _convertToTextComponent = function(component) {
  var newC = {p: component.p[component.p.length - 1]};
  if (component.si != null) {
    newC.i = component.si;
  } else {
    newC.d = component.sd;
  }
  return newC;
};

json.append = function(dest,c) {
  c = clone(c);

  var last;

  if (dest.length != 0 && pathMatches(c.p, (last = dest[dest.length - 1]).p)) {
    if (last.na != null && c.na != null) {
      dest[dest.length - 1] = {p: last.p, na: last.na + c.na};
    } else if (last.li !== undefined && c.li === undefined && c.ld === last.li) {
      // insert immediately followed by delete becomes a noop.
      if (last.ld !== undefined) {
        // leave the delete part of the replace
        delete last.li;
      } else {
        dest.pop();
      }
    } else if (last.od !== undefined && last.oi === undefined && c.oi !== undefined && c.od === undefined) {
      last.oi = c.oi;
    } else if (last.oi !== undefined && c.od !== undefined) {
      // The last path component inserted something that the new component deletes (or replaces).
      // Just merge them.
      if (c.oi !== undefined) {
        last.oi = c.oi;
      } else if (last.od !== undefined) {
        delete last.oi;
      } else {
        // An insert directly followed by a delete turns into a no-op and can be removed.
        dest.pop();
      }
    } else if (c.lm !== undefined && c.p[c.p.length - 1] === c.lm) {
      // don't do anything
    } else {
      dest.push(c);
    }
  } else if (dest.length != 0 && pathMatches(c.p, last.p, true)) {
    if ((c.si != null || c.sd != null) && (last.si != null || last.sd != null)) {
      // Try to compose the string ops together using text's equivalent methods
      var textOp = [_convertToTextComponent(last)];
      text._append(textOp, _convertToTextComponent(c));
      
      // Then convert back.
      if (textOp.length !== 1) {
        dest.push(c);
      } else {
        var textC = textOp[0];
        last.p[last.p.length - 1] = textC.p;
        if (textC.i != null)
          last.si = textC.i;
        else
          last.sd = textC.d;
      }
    } else {
      dest.push(c);
    }
  } else {
    dest.push(c);
  }
};

json.compose = function(op1,op2) {
  json.checkValidOp(op1);
  json.checkValidOp(op2);

  var newOp = clone(op1);

  for (var i = 0; i < op2.length; i++) {
    json.append(newOp,op2[i]);
  }

  return newOp;
};

json.normalize = function(op) {
  var newOp = [];

  op = isArray(op) ? op : [op];

  for (var i = 0; i < op.length; i++) {
    var c = op[i];
    if (c.p == null) c.p = [];

    json.append(newOp,c);
  }

  return newOp;
};

// Returns true if an op at otherPath may affect an op at path
json.canOpAffectOp = function(otherPath,path) {
  if (otherPath.length === 0) return true;
  if (path.length === 0) return false;

  path = path.slice(0,path.length - 1);
  otherPath = otherPath.slice(0,otherPath.length - 1);

  for (var i = 0; i < otherPath.length; i++) {
    var p = otherPath[i];
    if (i >= path.length || p != path[i]) return false;
  }

  // Same
  return true;
};

// transform c so it applies to a document with otherC applied.
json.transformComponent = function(dest, c, otherC, type) {
  c = clone(c);

  if (c.na !== void 0)
    c.p.push(0);

  if (otherC.na !== void 0)
    otherC.p.push(0);

  var common;
  if (json.canOpAffectOp(otherC.p, c.p))
    common = otherC.p.length - 1;

  var common2;
  if (json.canOpAffectOp(c.p,otherC.p))
    common2 = c.p.length - 1;

  var cplength = c.p.length;
  var otherCplength = otherC.p.length;

  if (c.na !== void 0) // hax
    c.p.pop();

  if (otherC.na !== void 0)
    otherC.p.pop();

  if (otherC.na) {
    if (common2 != null && otherCplength >= cplength && otherC.p[common2] == c.p[common2]) {
      if (c.ld !== void 0) {
        var oc = clone(otherC);
        oc.p = oc.p.slice(cplength);
        c.ld = json.apply(clone(c.ld),[oc]);
      } else if (c.od !== void 0) {
        var oc = clone(otherC);
        oc.p = oc.p.slice(cplength);
        c.od = json.apply(clone(c.od),[oc]);
      }
    }
    json.append(dest,c);
    return dest;
  }

  // if c is deleting something, and that thing is changed by otherC, we need to
  // update c to reflect that change for invertibility.
  // TODO this is probably not needed since we don't have invertibility
  if (common2 != null && otherCplength > cplength && c.p[common2] == otherC.p[common2]) {
    if (c.ld !== void 0) {
      var oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.ld = json.apply(clone(c.ld),[oc]);
    } else if (c.od !== void 0) {
      var oc = clone(otherC);
      oc.p = oc.p.slice(cplength);
      c.od = json.apply(clone(c.od),[oc]);
    }
  }

  if (common != null) {
    var commonOperand = cplength == otherCplength;

    // transform based on otherC
    if (otherC.na !== void 0) {
      // this case is handled above due to icky path hax
    } else if (otherC.si !== void 0 || otherC.sd !== void 0) {
      // String op vs string op - pass through to text type
      if (c.si !== void 0 || c.sd !== void 0) {
        if (!commonOperand) throw new Error('must be a string?');

        // Convert an op component to a text op component so we can use the
        // text type's transform function
        var tc1 = _convertToTextComponent(c);
        var tc2 = _convertToTextComponent(otherC);

        var res = [];

        // actually transform
        text._tc(res, tc1, tc2, type);
        
        // .... then convert the result back into a JSON op again.
        for (var i = 0; i < res.length; i++) {
          // Text component
          var tc = res[i];
          // JSON component
          var jc = {p: c.p.slice(0, common)};
          jc.p.push(tc.p);

          if (tc.i != null) jc.si = tc.i;
          if (tc.d != null) jc.sd = tc.d;
          json.append(dest, jc);
        }
        return dest;
      }
    } else if (otherC.li !== void 0 && otherC.ld !== void 0) {
      if (otherC.p[common] === c.p[common]) {
        // noop

        if (!commonOperand) {
          return dest;
        } else if (c.ld !== void 0) {
          // we're trying to delete the same element, -> noop
          if (c.li !== void 0 && type === 'left') {
            // we're both replacing one element with another. only one can survive
            c.ld = clone(otherC.li);
          } else {
            return dest;
          }
        }
      }
    } else if (otherC.li !== void 0) {
      if (c.li !== void 0 && c.ld === undefined && commonOperand && c.p[common] === otherC.p[common]) {
        // in li vs. li, left wins.
        if (type === 'right')
          c.p[common]++;
      } else if (otherC.p[common] <= c.p[common]) {
        c.p[common]++;
      }

      if (c.lm !== void 0) {
        if (commonOperand) {
          // otherC edits the same list we edit
          if (otherC.p[common] <= c.lm)
            c.lm++;
          // changing c.from is handled above.
        }
      }
    } else if (otherC.ld !== void 0) {
      if (c.lm !== void 0) {
        if (commonOperand) {
          if (otherC.p[common] === c.p[common]) {
            // they deleted the thing we're trying to move
            return dest;
          }
          // otherC edits the same list we edit
          var p = otherC.p[common];
          var from = c.p[common];
          var to = c.lm;
          if (p < to || (p === to && from < to))
            c.lm--;

        }
      }

      if (otherC.p[common] < c.p[common]) {
        c.p[common]--;
      } else if (otherC.p[common] === c.p[common]) {
        if (otherCplength < cplength) {
          // we're below the deleted element, so -> noop
          return dest;
        } else if (c.ld !== void 0) {
          if (c.li !== void 0) {
            // we're replacing, they're deleting. we become an insert.
            delete c.ld;
          } else {
            // we're trying to delete the same element, -> noop
            return dest;
          }
        }
      }

    } else if (otherC.lm !== void 0) {
      if (c.lm !== void 0 && cplength === otherCplength) {
        // lm vs lm, here we go!
        var from = c.p[common];
        var to = c.lm;
        var otherFrom = otherC.p[common];
        var otherTo = otherC.lm;
        if (otherFrom !== otherTo) {
          // if otherFrom == otherTo, we don't need to change our op.

          // where did my thing go?
          if (from === otherFrom) {
            // they moved it! tie break.
            if (type === 'left') {
              c.p[common] = otherTo;
              if (from === to) // ugh
                c.lm = otherTo;
            } else {
              return dest;
            }
          } else {
            // they moved around it
            if (from > otherFrom) c.p[common]--;
            if (from > otherTo) c.p[common]++;
            else if (from === otherTo) {
              if (otherFrom > otherTo) {
                c.p[common]++;
                if (from === to) // ugh, again
                  c.lm++;
              }
            }

            // step 2: where am i going to put it?
            if (to > otherFrom) {
              c.lm--;
            } else if (to === otherFrom) {
              if (to > from)
                c.lm--;
            }
            if (to > otherTo) {
              c.lm++;
            } else if (to === otherTo) {
              // if we're both moving in the same direction, tie break
              if ((otherTo > otherFrom && to > from) ||
                  (otherTo < otherFrom && to < from)) {
                if (type === 'right') c.lm++;
              } else {
                if (to > from) c.lm++;
                else if (to === otherFrom) c.lm--;
              }
            }
          }
        }
      } else if (c.li !== void 0 && c.ld === undefined && commonOperand) {
        // li
        var from = otherC.p[common];
        var to = otherC.lm;
        p = c.p[common];
        if (p > from) c.p[common]--;
        if (p > to) c.p[common]++;
      } else {
        // ld, ld+li, si, sd, na, oi, od, oi+od, any li on an element beneath
        // the lm
        //
        // i.e. things care about where their item is after the move.
        var from = otherC.p[common];
        var to = otherC.lm;
        p = c.p[common];
        if (p === from) {
          c.p[common] = to;
        } else {
          if (p > from) c.p[common]--;
          if (p > to) c.p[common]++;
          else if (p === to && from > to) c.p[common]++;
        }
      }
    }
    else if (otherC.oi !== void 0 && otherC.od !== void 0) {
      if (c.p[common] === otherC.p[common]) {
        if (c.oi !== void 0 && commonOperand) {
          // we inserted where someone else replaced
          if (type === 'right') {
            // left wins
            return dest;
          } else {
            // we win, make our op replace what they inserted
            c.od = otherC.oi;
          }
        } else {
          // -> noop if the other component is deleting the same object (or any parent)
          return dest;
        }
      }
    } else if (otherC.oi !== void 0) {
      if (c.oi !== void 0 && c.p[common] === otherC.p[common]) {
        // left wins if we try to insert at the same place
        if (type === 'left') {
          json.append(dest,{p: c.p, od:otherC.oi});
        } else {
          return dest;
        }
      }
    } else if (otherC.od !== void 0) {
      if (c.p[common] == otherC.p[common]) {
        if (!commonOperand)
          return dest;
        if (c.oi !== void 0) {
          delete c.od;
        } else {
          return dest;
        }
      }
    }
  }

  json.append(dest,c);
  return dest;
};

if (typeof require !== "undefined") {
  require('./helpers')._bootstrapTransform(json, json.transformComponent, json.checkValidOp, json.append);
} else {
  // This is kind of awful - come up with a better way to hook this helper code up.
  exports._bootstrapTransform(json, json.transformComponent, json.checkValidOp, json.append);
}

module.exports = json;

},{"./text-old":87,"./helpers":88}],88:[function(require,module,exports){
// Generated by CoffeeScript 1.6.2
exports._bootstrapTransform = function(type, transformComponent, checkValidOp, append) {
  var transformComponentX, transformX;

  transformComponentX = function(left, right, destLeft, destRight) {
    transformComponent(destLeft, left, right, 'left');
    return transformComponent(destRight, right, left, 'right');
  };
  type.transformX = type.transformX = transformX = function(leftOp, rightOp) {
    var k, l, l_, newLeftOp, newRightOp, nextC, r, r_, rightComponent, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;

    checkValidOp(leftOp);
    checkValidOp(rightOp);
    newRightOp = [];
    for (_i = 0, _len = rightOp.length; _i < _len; _i++) {
      rightComponent = rightOp[_i];
      newLeftOp = [];
      k = 0;
      while (k < leftOp.length) {
        nextC = [];
        transformComponentX(leftOp[k], rightComponent, newLeftOp, nextC);
        k++;
        if (nextC.length === 1) {
          rightComponent = nextC[0];
        } else if (nextC.length === 0) {
          _ref = leftOp.slice(k);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            l = _ref[_j];
            append(newLeftOp, l);
          }
          rightComponent = null;
          break;
        } else {
          _ref1 = transformX(leftOp.slice(k), nextC), l_ = _ref1[0], r_ = _ref1[1];
          for (_k = 0, _len2 = l_.length; _k < _len2; _k++) {
            l = l_[_k];
            append(newLeftOp, l);
          }
          for (_l = 0, _len3 = r_.length; _l < _len3; _l++) {
            r = r_[_l];
            append(newRightOp, r);
          }
          rightComponent = null;
          break;
        }
      }
      if (rightComponent != null) {
        append(newRightOp, rightComponent);
      }
      leftOp = newLeftOp;
    }
    return [leftOp, newRightOp];
  };
  return type.transform = type['transform'] = function(op, otherOp, type) {
    if (!(type === 'left' || type === 'right')) {
      throw new Error("type must be 'left' or 'right'");
    }
    if (otherOp.length === 0) {
      return op;
    }
    if (op.length === 1 && otherOp.length === 1) {
      return transformComponent([], op[0], otherOp[0], type);
    }
    if (type === 'left') {
      return transformX(op, otherOp)[0];
    } else {
      return transformX(otherOp, op)[1];
    }
  };
};

},{}],87:[function(require,module,exports){
// Generated by CoffeeScript 1.6.2
var append, checkValidComponent, checkValidOp, invertComponent, strInject, text, transformComponent, transformPosition;

text = {
  name: 'text-old',
  uri: 'http://sharejs.org/types/textv0',
  create: function() {
    return '';
  }
};

strInject = function(s1, pos, s2) {
  return s1.slice(0, pos) + s2 + s1.slice(pos);
};

checkValidComponent = function(c) {
  var d_type, i_type;

  if (typeof c.p !== 'number') {
    throw new Error('component missing position field');
  }
  i_type = typeof c.i;
  d_type = typeof c.d;
  if (!((i_type === 'string') ^ (d_type === 'string'))) {
    throw new Error('component needs an i or d field');
  }
  if (!(c.p >= 0)) {
    throw new Error('position cannot be negative');
  }
};

checkValidOp = function(op) {
  var c, _i, _len;

  for (_i = 0, _len = op.length; _i < _len; _i++) {
    c = op[_i];
    checkValidComponent(c);
  }
  return true;
};

text.apply = function(snapshot, op) {
  var component, deleted, _i, _len;

  checkValidOp(op);
  for (_i = 0, _len = op.length; _i < _len; _i++) {
    component = op[_i];
    if (component.i != null) {
      snapshot = strInject(snapshot, component.p, component.i);
    } else {
      deleted = snapshot.slice(component.p, component.p + component.d.length);
      if (component.d !== deleted) {
        throw new Error("Delete component '" + component.d + "' does not match deleted text '" + deleted + "'");
      }
      snapshot = snapshot.slice(0, component.p) + snapshot.slice(component.p + component.d.length);
    }
  }
  return snapshot;
};

text._append = append = function(newOp, c) {
  var last, _ref, _ref1;

  if (c.i === '' || c.d === '') {
    return;
  }
  if (newOp.length === 0) {
    return newOp.push(c);
  } else {
    last = newOp[newOp.length - 1];
    if ((last.i != null) && (c.i != null) && (last.p <= (_ref = c.p) && _ref <= (last.p + last.i.length))) {
      return newOp[newOp.length - 1] = {
        i: strInject(last.i, c.p - last.p, c.i),
        p: last.p
      };
    } else if ((last.d != null) && (c.d != null) && (c.p <= (_ref1 = last.p) && _ref1 <= (c.p + c.d.length))) {
      return newOp[newOp.length - 1] = {
        d: strInject(c.d, last.p - c.p, last.d),
        p: c.p
      };
    } else {
      return newOp.push(c);
    }
  }
};

text.compose = function(op1, op2) {
  var c, newOp, _i, _len;

  checkValidOp(op1);
  checkValidOp(op2);
  newOp = op1.slice();
  for (_i = 0, _len = op2.length; _i < _len; _i++) {
    c = op2[_i];
    append(newOp, c);
  }
  return newOp;
};

text.compress = function(op) {
  return text.compose([], op);
};

text.normalize = function(op) {
  var c, newOp, _i, _len, _ref;

  newOp = [];
  if ((op.i != null) || (op.p != null)) {
    op = [op];
  }
  for (_i = 0, _len = op.length; _i < _len; _i++) {
    c = op[_i];
    if ((_ref = c.p) == null) {
      c.p = 0;
    }
    append(newOp, c);
  }
  return newOp;
};

transformPosition = function(pos, c, insertAfter) {
  if (c.i != null) {
    if (c.p < pos || (c.p === pos && insertAfter)) {
      return pos + c.i.length;
    } else {
      return pos;
    }
  } else {
    if (pos <= c.p) {
      return pos;
    } else if (pos <= c.p + c.d.length) {
      return c.p;
    } else {
      return pos - c.d.length;
    }
  }
};

text.transformCursor = function(position, op, side) {
  var c, insertAfter, _i, _len;

  insertAfter = side === 'right';
  for (_i = 0, _len = op.length; _i < _len; _i++) {
    c = op[_i];
    position = transformPosition(position, c, insertAfter);
  }
  return position;
};

text._tc = transformComponent = function(dest, c, otherC, side) {
  var cIntersect, intersectEnd, intersectStart, newC, otherIntersect, s;

  checkValidOp([c]);
  checkValidOp([otherC]);
  if (c.i != null) {
    append(dest, {
      i: c.i,
      p: transformPosition(c.p, otherC, side === 'right')
    });
  } else {
    if (otherC.i != null) {
      s = c.d;
      if (c.p < otherC.p) {
        append(dest, {
          d: s.slice(0, otherC.p - c.p),
          p: c.p
        });
        s = s.slice(otherC.p - c.p);
      }
      if (s !== '') {
        append(dest, {
          d: s,
          p: c.p + otherC.i.length
        });
      }
    } else {
      if (c.p >= otherC.p + otherC.d.length) {
        append(dest, {
          d: c.d,
          p: c.p - otherC.d.length
        });
      } else if (c.p + c.d.length <= otherC.p) {
        append(dest, c);
      } else {
        newC = {
          d: '',
          p: c.p
        };
        if (c.p < otherC.p) {
          newC.d = c.d.slice(0, otherC.p - c.p);
        }
        if (c.p + c.d.length > otherC.p + otherC.d.length) {
          newC.d += c.d.slice(otherC.p + otherC.d.length - c.p);
        }
        intersectStart = Math.max(c.p, otherC.p);
        intersectEnd = Math.min(c.p + c.d.length, otherC.p + otherC.d.length);
        cIntersect = c.d.slice(intersectStart - c.p, intersectEnd - c.p);
        otherIntersect = otherC.d.slice(intersectStart - otherC.p, intersectEnd - otherC.p);
        if (cIntersect !== otherIntersect) {
          throw new Error('Delete ops delete different text in the same region of the document');
        }
        if (newC.d !== '') {
          newC.p = transformPosition(newC.p, otherC);
          append(dest, newC);
        }
      }
    }
  }
  return dest;
};

invertComponent = function(c) {
  if (c.i != null) {
    return {
      d: c.i,
      p: c.p
    };
  } else {
    return {
      i: c.d,
      p: c.p
    };
  }
};

text.invert = function(op) {
  var c, _i, _len, _ref, _results;

  _ref = op.slice().reverse();
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    c = _ref[_i];
    _results.push(invertComponent(c));
  }
  return _results;
};

if (typeof require === 'undefined') {
  exports._bootstrapTransform(text, text.transformComponent, text.checkValidOp, text.append);
} else {
  require('./helpers')._bootstrapTransform(text, text.transformComponent, text.checkValidOp, text.append);
}

module.exports = text;

},{"./helpers":88}]},{},[14,8])
;
(function() {
var view = require("derby").app.view;
view._makeAll({
  "app/403.html:body": "<div class=\"container\"><div class=\"page-header\"><h1>403</h1></div><p class=\"lead\">We're sorry, page is forbidden.</p></div>",
  "app/403.html:title": "403",
  "app/404.html:body": "<div class=\"container\"><div class=\"page-header\"><h1>404</h1></div><p class=\"lead\">We're sorry, page not found.</p></div>",
  "app/404.html:title": "404",
  "app/500.html:body": "<div class=\"container\"><div class=\"page-header\"><h1>500</h1></div><p class=\"lead\">We're sorry, something went wrong.</p></div>",
  "app/500.html:title": "500",
  "app/forgot.html:body": "<div class=\"container\"><div class=\"page-header\"><h1>Forgotten password?</h1></div>{#with _page.form}{#if .success}<p class=\"alert alert-success\"><i class=\"fa fa-check-circle\"></i> Password reset instructions were sent to your address.</p>{/}<form role=\"form\" x-bind=\"submit: user.forgotPassword\"><div class=\"form-group\"><label class=\"control-label\" for=\"usernameOrEmail\">Username or email</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-user\"></i></span><input id=\"usernameOrEmail\" class=\"form-control\" autofocus placeholder=\"Username or email\" type=\"text\" value=\"{.usernameOrEmail}\"></div></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\"><i class=\"fa fa-envelope\"></i> Send</button></div></form>{/}</div>",
  "app/forgot.html:title": "Forgotten password?",
  "app/home.html:body": "<div class=\"jumbotron\"><div class=\"container\"><h1><i class=\"fa fa-user\"></i> Derby User</h1><p>A user management system for <a href=\"http://derbyjs.com\">Derby JS</a>.</p><p><a class=\"btn btn-primary btn-lg\" role=\"button\" href=\"{{$config.repository.url}}\"><i class=\"fa fa-github\"></i> View on GitHub</a></p><ghbtns:button count=\"true\" giturl=\"{{$config.repository.url}}\" type=\"watch\" width=\"90\"><ghbtns:button count=\"true\" giturl=\"{{$config.repository.url}}\" type=\"fork\" width=\"90\"><ghbtns:button count=\"true\" giturl=\"{{$config.repository.url}}\" type=\"follow\" width=\"180\"></div></div>",
  "app/home.html:title": "Derby User",
  "app/index.html:footer": "<hr><div class=\"container\"><div id=\"footer\"><p class=\"text-muted credit\">Derby User {{$config.version}} · <a href=\"{{$config.repository.url}}\"><i class=\"fa fa-github\"></i> GitHub Project</a></p></div></div>",
  "app/index.html:header": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><link href=\"/shared/bower_components/bootstrap/dist/css/bootstrap.min.css\" rel=\"stylesheet\"><link href=\"/shared/bower_components/bootstrap/examples/jumbotron/jumbotron.css\" rel=\"stylesheet\"><link href=\"/shared/bower_components/font-awesome/css/font-awesome.min.css\" rel=\"stylesheet\"><ui:connectionAlert><header class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\"><div class=\"container\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button><a class=\"navbar-brand\" href=\"/\"><i class=\"fa fa-user\"></i> Derby User</a></div><div class=\"navbar-collapse collapse\"><ul class=\"nav navbar-nav\"><app:navitem href=\"/\" title=\"Home\">{#if _page.user.public.isRegistered}<app:navitem href=\"/settings\" title=\"Settings\"><li><a x-bind=\"click: user.signout\">Sign out</a></li>{else}<app:navitem href=\"/signup\" title=\"Sign up\"><app:navitem href=\"/signin\" title=\"Sign in\"><app:navitem href=\"/forgot\" title=\"Forgot\">{/}</ul>{#if _page.user.public.isRegistered}<ul class=\"nav navbar-nav navbar-right dropdown\"><li class=\"dropdown\"><a class=\"dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">{#if user.photoUrl(_page.user.public)}<img alt=\"\" height=\"20\" src=\"{user.photoUrl(_page.user.public)}\" width=\"20\">{else}<i class=\"fa fa-user\"></i>{/}&nbsp;{user.displayName(_page.user.public)} <i class=\"fa fa-caret-down\"></i></a><ul class=\"dropdown-menu\"><li><a href=\"/settings\">Settings</a></li><li class=\"divider\"></li><li><a x-bind=\"click: user.signout\"><i class=\"fa fa-sign-out\"></i> Sign out</a></li></ul></li></ul>{else}{#with _page.form.navbar}<form class=\"navbar-form navbar-right\" x-bind=\"submit: user.signin\"><div class=\"form-group\"><label class=\"sr-only\" for=\"navUsernameOrEmail\">Username or email</label><input id=\"navUsernameOrEmail\" class=\"form-control\" placeholder=\"Username or email\" type=\"text\" value=\"{.usernameOrEmail}\"></div>&nbsp;<div class=\"form-group\"><label class=\"sr-only\" for=\"navPassword\">Password</label><input id=\"navPassword\" class=\"form-control\" placeholder=\"Password\" type=\"password\" value=\"{.password}\"></div>&nbsp;<div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\"><i class=\"fa fa-sign-in\"></i> Sign in</button>&nbsp;<div class=\"btn-group\"><a class=\"btn btn-primary\" x-bind=\"click: user.connect.facebook\"><i class=\"fa fa-facebook\"></i></a><a class=\"btn btn-primary\" x-bind=\"click: user.connect.google\"><i class=\"fa fa-google-plus\"></i></a><a class=\"btn btn-primary\" x-bind=\"click: user.connect.twitter\"><i class=\"fa fa-twitter\"></i></a></div></div></form>{/}{/}</div></div></header>{#if _page.user.public.isRegistered}{#if not(_page.user.private.local.emails.0.value)}<div class=\"container\"><div class=\"alert alert-warning\"><p><i class=\"fa fa-exclamation-circle\"></i> <a href=\"/settings\">Please set your email address</a>.</p></div></div>{else if not(_page.user.private.local.emails.0.verified)}<div class=\"container\"><div class=\"alert alert-warning\"><p>Please confirm your email address. A confirmation message was sent to <strong>{_page.user.private.local.emails.0.value}</strong>.</p>{#with _page.form.verifyEmail}<p><a class=\"btn btn-default\" x-bind=\"click: user.verifyEmail\"><i class=\"fa fa-repeat\"></i> Resend confirmation</a> <a href=\"/settings\">Update email address</a>.</p>{/}</div></div>{/}{/}",
  "app/index.html:navitem": "<li class=\"{{#if equal($url, @href)}}active{{/}}\"><a href=\"{{@href}}\">{{@title}}</a></li>",
  "app/index.html:scripts": "<script src=\"/shared/bower_components/jquery/jquery.min.js\"></script><script src=\"/shared/bower_components/bootstrap/dist/js/bootstrap.min.js\"></script><script src=\"/shared/bower_components/jquery-popupwindow/jquery.popupwindow.js\"></script>",
  "app/reset.html:body": "<div class=\"container\"><div class=\"page-header\"><h1>Reset your password</h1></div>{#with _page.form}<form role=\"form\" x-bind=\"submit: user.resetPassword\"><div class=\"form-group\"><label class=\"control-label\" for=\"password\">Password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-key\"></i></span><input id=\"password\" class=\"form-control\" autofocus placeholder=\"Password\" type=\"password\" value=\"{.password}\"></div></div><div class=\"form-group\"><label class=\"control-label\" for=\"confirmPassword\">Confirm password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-key\"></i></span><input id=\"confirmPassword\" class=\"form-control\" placeholder=\"Confirm password\" type=\"password\" value=\"{.confirmPassword}\"></div></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\">Reset</button></div><input name=\"token\" type=\"hidden\" value=\"{{.token}}\"><input name=\"userId\" type=\"hidden\" value=\"{{.userId}}\"></form>{/}</div>",
  "app/reset.html:title": "Reset your password",
  "app/settings.html:body": "<div class=\"container\"><div class=\"page-header\"><h1>Settings</h1></div>{#with _page.form.username}<form role=\"form\" x-bind=\"submit: user.changeUsername\"><legend>Change username</legend><div class=\"form-group\"><label class=\"control-label\" for=\"username\">Username</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-user\"></i></span><input id=\"username\" class=\"form-control\" placeholder=\"Username\" type=\"text\" value=\"{.username}\"></div></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\">Change</button></div></form>{/}{#with _page.form.email}<form role=\"form\" x-bind=\"submit: user.changeEmail\"><legend>Change email</legend><div class=\"form-group\"><label class=\"control-label\" for=\"email\">Email</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-envelope\"></i></span><input id=\"email\" class=\"form-control\" placeholder=\"Email\" type=\"text\" value=\"{.email}\"></div><p class=\"help-block\">Change your avatar at <i class=\"fa fa-external-link-square\"></i> <a href=\"http:http://www.gravatar.com\">Gravatar.com</a>.</p></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\">Change</button></div></form>{/}{#with _page.form.password}<form role=\"form\" x-bind=\"submit: user.changePassword\"><legend>Change password</legend><div class=\"form-group\"><label class=\"control-label\" for=\"password\">Password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-key\"></i></span><input id=\"password\" class=\"form-control\" placeholder=\"Password\" type=\"password\" value=\"{.password}\"></div></div><div class=\"form-group\"><label class=\"control-label\" for=\"confirmPassword\">Confirm password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-key\"></i></span><input id=\"confirmPassword\" class=\"form-control\" placeholder=\"Confirm password\" type=\"password\" value=\"{.confirmPassword}\"></div></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\">Change</button></div></form>{/}</div>",
  "app/settings.html:title": "Settings",
  "app/signin.html:body": "<div class=\"container\"><div class=\"page-header\"><h1>Sign in</h1></div>{#with _page.form}<form role=\"form\" x-bind=\"submit: user.signin\"><div class=\"form-group\"><label class=\"control-label\" for=\"usernameOrEmail\">Username or email</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-user\"></i></span><input id=\"usernameOrEmail\" class=\"form-control\" autofocus placeholder=\"Username or email\" type=\"text\" value=\"{.usernameOrEmail}\"></div></div><div class=\"form-group\"><label class=\"control-label\" for=\"password\">Password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-key\"></i></span><input id=\"password\" class=\"form-control\" placeholder=\"Password\" type=\"password\" value=\"{.password}\"></div></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\"><i class=\"fa fa-sign-in\"></i> Sign in</button> <a href=\"/forgot\">Forgot your password?</a></div></form>{/}<hr><p class=\"lead\">Or sign up using…</p><div class=\"visible-xs\"><a class=\"btn btn-default\" x-bind=\"click: user.connect.facebook\"><i class=\"fa fa-facebook fa-lg\"></i></a> <a class=\"btn btn-default\" x-bind=\"click: user.connect.google\"><i class=\"fa fa-google-plus fa-lg\"></i></a> <a class=\"btn btn-default\" x-bind=\"click: user.connect.twitter\"><i class=\"fa fa-twitter fa-lg\"></i></a></div><div class=\"hidden-xs\"><a class=\"btn btn-default\" x-bind=\"click: user.connect.facebook\"><i class=\"fa fa-facebook-square\"></i> Facebook</a> <a class=\"btn btn-default\" x-bind=\"click: user.connect.google\"><i class=\"fa fa-google-plus-square\"></i> Google+</a> <a class=\"btn btn-default\" x-bind=\"click: user.connect.twitter\"><i class=\"fa fa-twitter-square\"></i> Twitter</a></div></div>",
  "app/signin.html:title": "Sign in",
  "app/signup.html:body": "<div class=\"container\"><div class=\"page-header\"><h1>Sign up</h1></div>{#with _page.form}<form role=\"form\" x-bind=\"submit: user.signup\"><div class=\"form-group\"><label class=\"control-label\" for=\"username\">Username</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-user\"></i></span><input id=\"username\" class=\"form-control\" autofocus placeholder=\"Username\" type=\"text\" value=\"{.username}\"></div></div><div class=\"form-group\"><label class=\"control-label\" for=\"email\">Email</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-envelope\"></i></span><input id=\"email\" class=\"form-control\" placeholder=\"Email\" type=\"email\" value=\"{.email}\"></div></div><div class=\"form-group\"><label class=\"control-label\" for=\"password\">Password</label><div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-key\"></i></span><input id=\"password\" class=\"form-control\" placeholder=\"Password\" type=\"password\" value=\"{.password}\"></div></div><button class=\"btn btn-primary\" type=\"submit\">Sign up</button></form>{/}<hr><p class=\"lead\">Or sign up using…</p><div class=\"visible-xs\"><a class=\"btn btn-default\" x-bind=\"click: user.connect.facebook\"><i class=\"fa fa-facebook fa-lg\"></i></a> <a class=\"btn btn-default\" x-bind=\"click: user.connect.google\"><i class=\"fa fa-google-plus fa-lg\"></i></a> <a class=\"btn btn-default\" x-bind=\"click: user.connect.twitter\"><i class=\"fa fa-twitter fa-lg\"></i></a></div><div class=\"hidden-xs\"><a class=\"btn btn-default\" x-bind=\"click: user.connect.facebook\"><i class=\"fa fa-facebook-square\"></i> Facebook</a> <a class=\"btn btn-default\" x-bind=\"click: user.connect.google\"><i class=\"fa fa-google-plus-square\"></i> Google+</a> <a class=\"btn btn-default\" x-bind=\"click: user.connect.twitter\"><i class=\"fa fa-twitter-square\"></i> Twitter</a></div></div>",
  "app/signup.html:title": "Sign up"
}, {
  "403:body": [
  "app/403.html:body",
  {}
],
  "403:title": [
  "app/403.html:title",
  {}
],
  "404:body": [
  "app/404.html:body",
  {}
],
  "404:title": [
  "app/404.html:title",
  {}
],
  "500:body": [
  "app/500.html:body",
  {}
],
  "500:title": [
  "app/500.html:title",
  {}
],
  "footer": [
  "app/index.html:footer",
  {}
],
  "forgot:body": [
  "app/forgot.html:body",
  {}
],
  "forgot:title": [
  "app/forgot.html:title",
  {}
],
  "header": [
  "app/index.html:header",
  {}
],
  "home:body": [
  "app/home.html:body",
  {}
],
  "home:title": [
  "app/home.html:title",
  {}
],
  "navitem": [
  "app/index.html:navitem",
  {}
],
  "reset:body": [
  "app/reset.html:body",
  {}
],
  "reset:title": [
  "app/reset.html:title",
  {}
],
  "scripts": [
  "app/index.html:scripts",
  {}
],
  "settings:body": [
  "app/settings.html:body",
  {}
],
  "settings:title": [
  "app/settings.html:title",
  {}
],
  "signin:body": [
  "app/signin.html:body",
  {}
],
  "signin:title": [
  "app/signin.html:title",
  {}
],
  "signup:body": [
  "app/signup.html:body",
  {}
],
  "signup:title": [
  "app/signup.html:title",
  {}
]
});
view._makeComponents({
  "ghbtns": {
  "instances": {
  "button": [
  "button/index.html:button",
  {}
]
},
  "templates": {
  "button/index.html:button": "{#if :self.show}<iframe allowtransparency=\"true\" frameborder=\"0\" height=\"{:self.height}\" scrolling=\"0\" src=\"{:self.fileurl}?user={:self.user}&repo={:self.repo}&type={@type}{#if @count}&count={@count}{/}{#if @size}&size={@size}{/}\" width=\"{@width}\"></iframe>{/}"
}
},
  "ui": {
  "instances": {
  "connectionalert": [
  "connectionAlert/index.html:connectionalert",
  {}
]
},
  "templates": {
  "connectionAlert/index.html:connectionalert": "{#unless equal($connection.state, 'connected')}<div class=\"alert alert-warning\"><div class=\"container\">{#if equal($connection.state, 'stopped')}Unable to reconnect – <a x-bind=\"click: reload\"><i class=\"fa fa-refresh\"></i> Reload</a>{else}{sentenceCase($connection.state)} – {#if :self.hideReconnect}<i class=\"fa fa-refresh fa-spin\"></i> Reconnecting…{else}<a x-bind=\"click: reconnect\"><i class=\"fa fa-refresh\"></i> Reconnect</a>{/}{/}</div></div>{/}"
}
}
});
})();
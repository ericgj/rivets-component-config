var Rivets  = require('rivets')
  , css     = require('css')
  , classes = require('classes')

/* Config for reactive- or react- style models,
 * i.e. plain objects emitting 'change '+ prop events
 *
 */
Rivets.configure({

  adapter: {
    subscribe: function(obj,keypath,cb){
      obj.on('change '+keypath,cb)
    },
    unsubscribe: function(obj,keypath,cb){
      obj.off('change '+keypath,cb)  
    },
    read: function(obj,keypath){
      return obj[keypath];  
    },
    publish: function(obj,keypath,value){
      obj[keypath]=value;
    }
  }

});

/* Non-jQuery binders 
 *
 *  Note: for completeness' sake, the `value` binder should be
 *  reimplemented to handle case of select-multiple, but I never
 *  use select-multiple (who does?) so it's not included here.
 *
 *  All the other built-in rivets binders are not dependent on
 *  jQuery and can be used as-is.
 */

Rivets.binders.enabled = function(el,value){
  if (!!value) {
    el.removeAttribute('disabled');
  } else {
    el.setAttribute('disabled','disabled');
  }
};

Rivets.binders.disabled = function(el,value){
  if (!value) {
    el.removeAttribute('disabled');
  } else {
    el.setAttribute('disabled','disabled');
  }
};

Rivets.binders.checked = {
  publishes: true,
  bind: function(el){
    this.currentListener = bindEvent(el, 'change', this.publish)
  },
  unbind: function(el){
    unbindEvent(el, 'change', this.currentListener)
  },
  routine: function(el, value){
    if (el.getAttribute('type')==='radio'){
      if (value===el.getAttribute('checked'){
        el.setAttribute('checked','checked')
      } else {
        el.removeAttribute('checked')
      }
    } else {
      if (!!value){
        el.setAttribute('checked','checked')
      } else {
        el.removeAttribute('checked')
      }
    }
  }
};

Rivets.binders.unchecked = {
  publishes: true,
  bind: function(el){
    this.currentListener = bindEvent(el, 'change', this.publish)
  },
  unbind: function(el){
    unbindEvent(el, 'change', this.currentListener)
  },
  routine: function(el, value){
    if (el.getAttribute('type')==='radio'){
      if (value!==el.getAttribute('checked'){
        el.setAttribute('checked','checked')
      } else {
        el.removeAttribute('checked')
      }
    } else {
      if (!value){
        el.setAttribute('checked','checked')
      } else {
        el.removeAttribute('checked')
      }
    }
  }
};

Rivets.binders.show = function(el,value){
  css(el, {display: (!!value ? '' : 'none')});
};

Rivets.binders.hide = function(el,value){
  css(el, {display: (!!value ? 'none' : '')});
};

Rivets.binders['class-*'] = function(el,value){
  classes(el)[(!!value ? 'add' : 'remove')](this.args[0]);
};


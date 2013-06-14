// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

//implementation lifted from underscore.js (c) 2009-2012 Jeremy Ashkenas

/* JSONPath 0.8.0 - XPath for JSON
         *
         * Copyright (c) 2007 Stefan Goessner (goessner.net)
         * Licensed under the MIT (MIT-LICENSE.txt) licence.
         */

/*!
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

define("libs/flight/lib/utils",[],function(){var e=[],t=100,n={isDomObj:function(e){return!!e.nodeType||e===window},toArray:function(t,n){return e.slice.call(t,n)},merge:function(){var e=arguments.length,t=0,n=new Array(e+1);for(;t<e;t++)n[t+1]=arguments[t];return e===0?{}:(n[0]={},n[n.length-1]===!0&&(n.pop(),n.unshift(!0)),$.extend.apply(undefined,n))},push:function(e,t,n){return e&&Object.keys(t||{}).forEach(function(r){if(e[r]&&n)throw Error("utils.push attempted to overwrite '"+r+"' while running in protected mode");typeof e[r]=="object"&&typeof t[r]=="object"?this.push(e[r],t[r]):e[r]=t[r]},this),e},isEnumerable:function(e,t){return Object.keys(e).indexOf(t)>-1},compose:function(){var e=arguments;return function(){var t=arguments;for(var n=e.length-1;n>=0;n--)t=[e[n].apply(this,t)];return t[0]}},uniqueArray:function(e){var t={},n=[];for(var r=0,i=e.length;r<i;++r){if(t.hasOwnProperty(e[r]))continue;n.push(e[r]),t[e[r]]=1}return n},debounce:function(e,n,r){typeof n!="number"&&(n=t);var i,s;return function(){var t=this,o=arguments,u=function(){i=null,r||(s=e.apply(t,o))},a=r&&!i;return clearTimeout(i),i=setTimeout(u,n),a&&(s=e.apply(t,o)),s}},throttle:function(e,n){typeof n!="number"&&(n=t);var r,i,s,o,u,a,f=this.debounce(function(){u=o=!1},n);return function(){r=this,i=arguments;var t=function(){s=null,u&&(a=e.apply(r,i)),f()};return s||(s=setTimeout(t,n)),o?u=!0:(o=!0,a=e.apply(r,i)),f(),a}},countThen:function(e,t){return function(){if(!--e)return t.apply(this,arguments)}},delegate:function(e){return function(t,n){var r=$(t.target),i;Object.keys(e).forEach(function(s){if((i=r.closest(s)).length)return n=n||{},n.el=i[0],e[s].apply(this,[t,n])},this)}}};return n}),define("libs/flight/lib/registry",["./utils"],function(e){function t(e,t){var n,r,i,s=t.length;return typeof t[s-1]=="function"&&(s-=1,i=t[s]),typeof t[s-1]=="object"&&(s-=1),s==2?(n=t[0],r=t[1]):(n=e.node,r=t[0]),{element:n,type:r,callback:i}}function n(e,t){return e.element==t.element&&e.type==t.type&&(t.callback==null||e.callback==t.callback)}function r(){function r(t){this.component=t,this.attachedTo=[],this.instances={},this.addInstance=function(e){var t=new i(e);return this.instances[e.identity]=t,this.attachedTo.push(e.node),t},this.removeInstance=function(t){delete this.instances[t.identity];var n=this.attachedTo.indexOf(t.node);n>-1&&this.attachedTo.splice(n,1),this.instances.length||e.removeComponentInfo(this)},this.isAttachedTo=function(e){return this.attachedTo.indexOf(e)>-1}}function i(t){this.instance=t,this.events=[],this.addBind=function(t){this.events.push(t),e.events.push(t)},this.removeBind=function(e){for(var t=0,r;r=this.events[t];t++)n(r,e)&&this.events.splice(t,1)}}var e=this;(this.reset=function(){this.components=[],this.allInstances={},this.events=[]}).call(this),this.addInstance=function(e){var t=this.findComponentInfo(e);t||(t=new r(e.constructor),this.components.push(t));var n=t.addInstance(e);return this.allInstances[e.identity]=n,t},this.removeInstance=function(e){var t,n=this.findInstanceInfo(e),r=this.findComponentInfo(e);r&&r.removeInstance(e),delete this.allInstances[e.identity]},this.removeComponentInfo=function(e){var t=this.components.indexOf(e);t>-1&&this.components.splice(t,1)},this.findComponentInfo=function(e){var t=e.attachTo?e:e.constructor;for(var n=0,r;r=this.components[n];n++)if(r.component===t)return r;return null},this.findInstanceInfo=function(e){return this.allInstances[e.identity]||null},this.findInstanceInfoByNode=function(e){var t=[];return Object.keys(this.allInstances).forEach(function(n){var r=this.allInstances[n];r.instance.node===e&&t.push(r)},this),t},this.on=function(n){var r=e.findInstanceInfo(this),i,s=arguments.length,o=1,u=new Array(s-1);for(;o<s;o++)u[o-1]=arguments[o];if(r){i=n.apply(null,u),i&&(u[u.length-1]=i);var a=t(this,u);r.addBind(a)}},this.off=function(n,r,i){var s=t(this,arguments),o=e.findInstanceInfo(this);o&&o.removeBind(s)},window.DEBUG&&DEBUG.enabled&&(e.trigger=new Function),this.teardown=function(){e.removeInstance(this)},this.withRegistration=function(){this.before("initialize",function(){e.addInstance(this)}),this.around("on",e.on),this.after("off",e.off),window.DEBUG&&DEBUG.enabled&&this.after("trigger",e.trigger),this.after("teardown",{obj:e,fnName:"teardown"})}}return new r}),define("libs/flight/tools/debug/debug",["../../lib/registry","../../lib/utils"],function(e,t){function r(e,t,n){var n=n||{},i=n.obj||window,o=n.path||(i==window?"window":""),u=Object.keys(i);u.forEach(function(n){(s[e]||e)(t,i,n)&&console.log([o,".",n].join(""),"->",["(",typeof i[n],")"].join(""),i[n]),Object.prototype.toString.call(i[n])=="[object Object]"&&i[n]!=i&&o.split(".").indexOf(n)==-1&&r(e,t,{obj:i[n],path:[o,n].join(".")})})}function i(e,t,n,i){!t||typeof n==t?r(e,n,i):console.error([n,"must be",t].join(" "))}function o(e,t){i("name","string",e,t)}function u(e,t){i("nameContains","string",e,t)}function a(e,t){i("type","function",e,t)}function f(e,t){i("value",null,e,t)}function l(e,t){i("valueCoerced",null,e,t)}function c(e,t){r(e,null,t)}function v(){var e=[].slice.call(arguments);n.eventNames.length||(n.eventNames=h),n.actions=e.length?e:h,b()}function m(){var e=[].slice.call(arguments);n.actions.length||(n.actions=h),n.eventNames=e.length?e:h,b()}function g(){n.actions=[],n.eventNames=[],b()}function y(){n.actions=h,n.eventNames=h,b()}function b(){window.localStorage&&(localStorage.setItem("logFilter_eventNames",n.eventNames),localStorage.setItem("logFilter_actions",n.actions))}function w(){var e={eventNames:window.localStorage&&localStorage.getItem("logFilter_eventNames")||p,actions:window.localStorage&&localStorage.getItem("logFilter_actions")||d};return Object.keys(e).forEach(function(t){var n=e[t];typeof n=="string"&&n!==h&&(e[t]=n.split(","))}),e}var n,s={name:function(e,t,n){return e==n},nameContains:function(e,t,n){return n.indexOf(e)>-1},type:function(e,t,n){return t[n]instanceof e},value:function(e,t,n){return t[n]===e},valueCoerced:function(e,t,n){return t[n]==e}},h="all",p=[],d=[],n=w();return{enable:function(e){this.enabled=!!e,e&&window.console&&(console.info("Booting in DEBUG mode"),console.info("You can configure event logging with DEBUG.events.logAll()/logNone()/logByName()/logByAction()")),window.DEBUG=this},find:{byName:o,byNameContains:u,byType:a,byValue:f,byValueCoerced:l,custom:c},events:{logFilter:n,logByAction:v,logByName:m,logAll:y,logNone:g}}}),define("libs/flight/lib/compose",["./utils","../tools/debug/debug"],function(e,t){function s(e,t){if(!n)return;var i=Object.create(null);Object.keys(e).forEach(function(n){if(r.indexOf(n)<0){var s=Object.getOwnPropertyDescriptor(e,n);s.writable=t,i[n]=s}}),Object.defineProperties(e,i)}function o(e,t,r){var i;if(!n||!e.hasOwnProperty(t)){r.call(e);return}i=Object.getOwnPropertyDescriptor(e,t).writable,Object.defineProperty(e,t,{writable:!0}),r.call(e),Object.defineProperty(e,t,{writable:i})}function u(e,t){e.mixedIn=e.hasOwnProperty("mixedIn")?e.mixedIn:[],t.forEach(function(t){e.mixedIn.indexOf(t)==-1&&(s(e,!1),t.call(e),e.mixedIn.push(t))}),s(e,!0)}var n=t.enabled&&!e.isEnumerable(Object,"getOwnPropertyDescriptor"),r=["mixedIn"];if(n)try{Object.getOwnPropertyDescriptor(Object,"keys")}catch(i){n=!1}return{mixin:u,unlockProperty:o}}),define("libs/flight/lib/advice",["./utils","./compose"],function(e,t){var n={around:function(e,t){return function(){var r=0,i=arguments.length,s=new Array(i+1);s[0]=e.bind(this);for(;r<i;r++)s[r+1]=arguments[r];return t.apply(this,s)}},before:function(e,t){var n=typeof t=="function"?t:t.obj[t.fnName];return function(){return n.apply(this,arguments),e.apply(this,arguments)}},after:function(e,t){var n=typeof t=="function"?t:t.obj[t.fnName];return function(){var r=(e.unbound||e).apply(this,arguments);return n.apply(this,arguments),r}},withAdvice:function(){["before","after","around"].forEach(function(e){this[e]=function(r,i){t.unlockProperty(this,r,function(){return typeof this[r]=="function"?this[r]=n[e](this[r],i):this[r]=i})}},this)}};return n}),define("libs/flight/lib/component",["./advice","./utils","./compose","./registry"],function(e,t,n,r){function o(e){e.events.slice().forEach(function(e){var t=[e.type];e.element&&t.unshift(e.element),typeof e.callback=="function"&&t.push(e.callback),this.off.apply(this,t)},e.instance)}function u(){o(r.findInstanceInfo(this))}function a(){var e=r.findComponentInfo(this);e&&Object.keys(e.instances).forEach(function(t){var n=e.instances[t];n.instance.teardown()})}function f(e,t){try{window.postMessage(t,"*")}catch(n){throw console.log("unserializable data for event",e,":",t),new Error(["The event",e,"on component",this.toString(),"was triggered with non-serializable data"].join(" "))}}function l(){this.trigger=function(){var e,t,n,r,i,s=arguments.length-1,o=arguments[s];return typeof o!="string"&&(!o||!o.defaultBehavior)&&(s--,n=o),s==1?(e=$(arguments[0]),r=arguments[1]):(e=this.$node,r=arguments[0]),r.defaultBehavior&&(i=r.defaultBehavior,r=$.Event(r.type)),t=r.type||r,window.DEBUG&&window.DEBUG.enabled&&window.postMessage&&f.call(this,t,n),typeof this.attr.eventData=="object"&&(n=$.extend(!0,{},this.attr.eventData,n)),e.trigger(r||t,n),i&&!r.isDefaultPrevented()&&(this[i]||i).call(this),e},this.on=function(){var e,n,r,i,s=arguments.length-1,o=arguments[s];typeof o=="object"?i=t.delegate(this.resolveDelegateRules(o)):i=o,s==2?(e=$(arguments[0]),n=arguments[1]):(e=this.$node,n=arguments[0]);if(typeof i!="function"&&typeof i!="object")throw new Error("Unable to bind to '"+n+"' because the given callback is not a function or an object");return r=i.bind(this),r.target=i,i.guid&&(r.guid=i.guid),e.on(n,r),i.guid=r.guid,r},this.off=function(){var e,t,n,r=arguments.length-1;return typeof arguments[r]=="function"&&(n=arguments[r],r-=1),r==1?(e=$(arguments[0]),t=arguments[1]):(e=this.$node,t=arguments[0]),e.off(t,n)},this.resolveDelegateRules=function(e){var t={};return Object.keys(e).forEach(function(n){if(!n in this.attr)throw new Error('Component "'+this.toString()+'" wants to listen on "'+n+'" but no such attribute was defined.');t[this.attr[n]]=e[n]},this),t},this.defaultAttrs=function(e){t.push(this.defaults,e,!0)||(this.defaults=e)},this.select=function(e){return this.$node.find(this.attr[e])},this.initialize=$.noop,this.teardown=u}function c(e){var n=arguments.length,i=new Array(n-1);for(var s=1;s<n;s++)i[s-1]=arguments[s];if(!e)throw new Error("Component needs to be attachTo'd a jQuery object, native node or selector string");var o=t.merge.apply(t,i);$(e).each(function(e,t){var n=t.jQuery?t[0]:t,i=r.findComponentInfo(this);if(i&&i.isAttachedTo(n))return;new this(t,o)}.bind(this))}function h(){function f(e,t){t=t||{},this.identity=s++;if(!e)throw new Error("Component needs a node");e.jquery?(this.node=e[0],this.$node=e):(this.node=e,this.$node=$(e)),this.toString=f.toString,window.DEBUG&&window.DEBUG.enabled&&(this.describe=this.toString());var n=Object.create(t);for(var r in this.defaults)t.hasOwnProperty(r)||(n[r]=this.defaults[r]);this.attr=n,Object.keys(this.defaults||{}).forEach(function(e){if(this.defaults[e]===null&&this.attr[e]===null)throw new Error('Required attribute "'+e+'" not specified in attachTo for component "'+this.toString()+'".')},this),this.initialize.call(this,t)}var t=arguments.length,o=new Array(t);for(var u=0;u<t;u++)o[u]=arguments[u];return f.toString=function(){var e=o.map(function(e){if(e.name==null){var t=e.toString().match(i);return t&&t[1]?t[1]:""}return e.name!="withBaseComponent"?e.name:""}).filter(Boolean).join(", ");return e},window.DEBUG&&window.DEBUG.enabled&&(f.describe=f.toString()),f.attachTo=c,f.teardownAll=a,o.unshift(l,e.withAdvice,r.withRegistration),n.mixin(f.prototype,o),f}var i=/function (.*?)\s?\(/,s=0;return h.teardownAll=function(){r.components.slice().forEach(function(e){e.component.teardownAll()}),r.reset()},h}),define("components/component_manager",["libs/flight/lib/component"],function(e){function n(n,r){var i={mixins:r,flightComponent:e.apply(this,r)};return i.flightComponent.componentName=n,t[n]=i,i}var t={},r={create:function(){var e=Array.prototype.slice.call(arguments),t=e.shift();return n(t,e).flightComponent},extend:function(){var e=Array.prototype.slice.call(arguments),r=e.shift(),i=e.shift(),s,o;return $.isFunction(r)?s=t[r.componentName]:s=t[r],o=s.mixins.concat(e),n(i,o).flightComponent},get:function(e){var n=t[e],r=null;return n?r=t[e].flightComponent:console.error('Component "'+e+'" is undefined; components :',t),r},each:function(e){$.each(t,function(t,n){e(t,n.flightComponent)})}};return r}),define("libs/jsonpath",[],function(){function jsonPath(obj,expr,arg){var P={resultType:arg&&arg.resultType||"VALUE",result:[],normalize:function(e){var t=[];return e.replace(/[\['](\??\(.*?\))[\]']/g,function(e,n){return"[#"+(t.push(n)-1)+"]"}).replace(/'?\.'?|\['?/g,";").replace(/;;;|;;/g,";..;").replace(/;$|'?\]|'$/g,"").replace(/#([0-9]+)/g,function(e,n){return t[n]})},asPath:function(e){var t=e.split(";"),n="$";for(var r=1,i=t.length;r<i;r++)n+=/^[0-9*]+$/.test(t[r])?"["+t[r]+"]":"['"+t[r]+"']";return n},store:function(e,t){return e&&(P.result[P.result.length]=P.resultType=="PATH"?P.asPath(e):t),!!e},trace:function(e,t,n){if(e){var r=e.split(";"),i=r.shift();r=r.join(";");if(t&&t.hasOwnProperty(i))P.trace(r,t[i],n+";"+i);else if(i==="*")P.walk(i,r,t,n,function(e,t,n,r,i){P.trace(e+";"+n,r,i)});else if(i==="..")P.trace(r,t,n),P.walk(i,r,t,n,function(e,t,n,r,i){typeof r[e]=="object"&&P.trace("..;"+n,r[e],i+";"+e)});else if(/,/.test(i))for(var s=i.split(/'?,'?/),o=0,u=s.length;o<u;o++)P.trace(s[o]+";"+r,t,n);else/^\(.*?\)$/.test(i)?P.trace(P.eval(i,t,n.substr(n.lastIndexOf(";")+1))+";"+r,t,n):/^\?\(.*?\)$/.test(i)?P.walk(i,r,t,n,function(e,t,n,r,i){P.eval(t.replace(/^\?\((.*?)\)$/,"$1"),r[e],e)&&P.trace(e+";"+n,r,i)}):/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(i)&&P.slice(i,r,t,n)}else P.store(n,t)},walk:function(e,t,n,r,i){if(n instanceof Array)for(var s=0,o=n.length;s<o;s++)s in n&&i(s,e,t,n,r);else if(typeof n=="object")for(var u in n)n.hasOwnProperty(u)&&i(u,e,t,n,r)},slice:function(e,t,n,r){if(n instanceof Array){var i=n.length,s=0,o=i,u=1;e.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g,function(e,t,n,r){s=parseInt(t||s),o=parseInt(n||o),u=parseInt(r||u)}),s=s<0?Math.max(0,s+i):Math.min(i,s),o=o<0?Math.max(0,o+i):Math.min(i,o);for(var a=s;a<o;a+=u)P.trace(a+";"+t,n,r)}},eval:function(x,_v,_vname){try{return $&&_v&&eval(x.replace(/@/g,"_v"))}catch(e){throw new SyntaxError("jsonPath: "+e.message+": "+x.replace(/@/g,"_v").replace(/\^/g,"_a"))}}},$=obj;if(expr&&obj&&(P.resultType=="VALUE"||P.resultType=="PATH"))return P.trace(P.normalize(expr).replace(/^\$;/,""),obj,"$"),P.result.length?P.result:!1}return jsonPath}),define("components/mixin/data_binding",["libs/jsonpath"],function(e){function t(){this.defaultAttrs({model:""}),this.after("initialize",function(){this.$node.attr("data-bind",""),this.on("changeData",function(e,t,n){t==="value"&&this.trigger("valueChange",{value:n})}),this.on("parentChange",function(t,n){var r=this.attr.model,i=n.value;r&&($.isFunction(r)?i=r(i):$.isPlainObject(r)?i=r:r.indexOf("$")===0?i=e(i,r):i=i[r]),t.stopPropagation(),this.$node.trigger("valueChange",{value:i,silent:!0})}),this.on("valueChange",function(e,t){var n=t.value,r=this.$node.find("[data-bind] [data-bind]");e.target===this.node&&this.$node.data("m2mValue",n),this.$node.find("[data-bind]").not(r).each(function(){$(this).trigger("parentChange",{value:n})}),t.silent&&e.stopPropagation()})})}return t});var Hogan={};(function(e,t){function n(e,t,n){var r,i;return t&&typeof t=="object"&&(t[e]!=null?r=t[e]:n&&t.get&&typeof t.get=="function"&&(r=t.get(e))),r}function r(e,t,n,r){function i(){}function s(){}i.prototype=e,s.prototype=e.subs;var o,u=new i;u.subs=new s,u.subsText={},u.ib();for(o in t)u.subs[o]=t[o],u.subsText[o]=r;for(o in n)u.partials[o]=n[o];return u}function l(e){return String(e===null||e===undefined?"":e)}function c(e){return e=l(e),f.test(e)?e.replace(i,"&amp;").replace(s,"&lt;").replace(o,"&gt;").replace(u,"&#39;").replace(a,"&quot;"):e}e.Template=function(e,t,n,r){e=e||{},this.r=e.code||this.r,this.c=n,this.options=r||{},this.text=t||"",this.partials=e.partials||{},this.subs=e.subs||{},this.ib()},e.Template.prototype={r:function(e,t,n){return""},v:c,t:l,render:function(t,n,r){return this.ri([t],n||{},r)},ri:function(e,t,n){return this.r(e,t,n)},ep:function(e,t){var n=this.partials[e],i=t[n.name];if(n.instance&&n.base==i)return n.instance;if(typeof i=="string"){if(!this.c)throw new Error("No compiler available.");i=this.c.compile(i,this.options)}return i?(this.partials[e].base=i,n.subs&&(this.activeSub===undefined&&(t.stackText=this.text),i=r(i,n.subs,n.partials,t.stackText||this.text)),this.partials[e].instance=i,i):null},rp:function(e,t,n,r){var i=this.ep(e,n);return i?i.ri(t,n,r):""},rs:function(e,t,n){var r=e[e.length-1];if(!h(r)){n(e,t,this);return}for(var i=0;i<r.length;i++)e.push(r[i]),n(e,t,this),e.pop()},s:function(e,t,n,r,i,s,o){var u;return h(e)&&e.length===0?!1:(typeof e=="function"&&(e=this.ms(e,t,n,r,i,s,o)),u=!!e,!r&&u&&t&&t.push(typeof e=="object"?e:t[t.length-1]),u)},d:function(e,t,r,i){var s,o=e.split("."),u=this.f(o[0],t,r,i),a=this.options.modelGet,f=null;if(e==="."&&h(t[t.length-2]))u=t[t.length-1];else for(var l=1;l<o.length;l++)s=n(o[l],u,a),s!=null?(f=u,u=s):u="";return i&&!u?!1:(!i&&typeof u=="function"&&(t.push(f),u=this.mv(u,t,r),t.pop()),u)},f:function(e,t,r,i){var s=!1,o=null,u=!1,a=this.options.modelGet;for(var f=t.length-1;f>=0;f--){o=t[f],s=n(e,o,a);if(s!=null){u=!0;break}}return u?(!i&&typeof s=="function"&&(s=this.mv(s,t,r)),s):i?!1:""},ls:function(e,t,n,r,i){var s=this.options.delimiters;return this.options.delimiters=i,this.b(this.ct(l(e.call(t,r)),t,n)),this.options.delimiters=s,!1},ct:function(e,t,n){if(this.options.disableLambda)throw new Error("Lambda features disabled.");return this.c.compile(e,this.options).render(t,n)},b:t?function(e){this.buf.push(e)}:function(e){this.buf+=e},fl:t?function(){var e=this.buf.join("");return this.buf=[],e}:function(){var e=this.buf;return this.buf="",e},ib:function(){this.buf=t?[]:""},ms:function(e,t,n,r,i,s,o){var u,a=t[t.length-1],f=e.call(a);return typeof f=="function"?r?!0:(u=this.activeSub&&this.subsText[this.activeSub]?this.subsText[this.activeSub]:this.text,this.ls(f,a,n,u.substring(i,s),o)):f},mv:function(e,t,n){var r=t[t.length-1],i=e.call(r);return typeof i=="function"?this.ct(l(i.call(r)),r,n):i},sub:function(e,t,n,r){var i=this.subs[e];i&&(this.activeSub=e,i(t,n,this,r),this.activeSub=!1)}};var i=/&/g,s=/</g,o=/>/g,u=/\'/g,a=/\"/g,f=/[&<>\"\']/,h=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"}})(typeof exports!="undefined"?exports:Hogan),function(e){function o(e){e.n.substr(e.n.length-1)==="}"&&(e.n=e.n.substring(0,e.n.length-1))}function u(e){return e.trim?e.trim():e.replace(/^\s*|\s*$/g,"")}function a(e,t,n){if(t.charAt(n)!=e.charAt(0))return!1;for(var r=1,i=e.length;r<i;r++)if(t.charAt(n+r)!=e.charAt(r))return!1;return!0}function l(t,n,r,i){var s=[],o=null,u=null,a=null;u=r[r.length-1];while(t.length>0){a=t.shift();if(!(!u||u.tag!="<"||a.tag in f))throw new Error("Illegal content in < super tag.");if(e.tags[a.tag]<=e.tags.$||c(a,i))r.push(a),a.nodes=l(t,a.tag,r,i);else{if(a.tag=="/"){if(r.length===0)throw new Error("Closing tag without opener: /"+a.n);o=r.pop();if(a.n!=o.n&&!h(a.n,o.n,i))throw new Error("Nesting error: "+o.n+" vs. "+a.n);return o.end=a.i,s}a.tag=="\n"&&(a.last=t.length==0||t[0].tag=="\n")}s.push(a)}if(r.length>0)throw new Error("missing closing tag: "+r.pop().n);return s}function c(e,t){for(var n=0,r=t.length;n<r;n++)if(t[n].o==e.n)return e.tag="#",!0}function h(e,t,n){for(var r=0,i=n.length;r<i;r++)if(n[r].c==e&&n[r].o==t)return!0}function p(e){var t=[];for(var n in e)t.push('"'+m(n)+'": function(c,p,t,i) {'+e[n]+"}");return"{ "+t.join(",")+" }"}function d(e){var t=[];for(var n in e.partials)t.push('"'+m(n)+'":{name:"'+m(e.partials[n].name)+'", '+d(e.partials[n])+"}");return"partials: {"+t.join(",")+"}, subs: "+p(e.subs)}function m(e){return e.replace(s,"\\\\").replace(n,'\\"').replace(r,"\\n").replace(i,"\\r")}function g(e){return~e.indexOf(".")?"d":"f"}function y(e,t){var n="<"+(t.prefix||""),r=n+e.n+v++;return t.partials[r]={name:e.n,partials:{}},t.code+='t.b(t.rp("'+m(r)+'",c,p,"'+(e.indent||"")+'"));',r}function b(e,t){t.code+="t.b(t.t(t."+g(e.n)+'("'+m(e.n)+'",c,p,0)));'}function w(e){return"t.b("+e+");"}var t=/\S/,n=/\"/g,r=/\n/g,i=/\r/g,s=/\\/g;e.tags={"#":1,"^":2,"<":3,$:4,"/":5,"!":6,">":7,"=":8,_v:9,"{":10,"&":11,_t:12},e.scan=function(r,i){function S(){v.length>0&&(m.push({tag:"_t",text:new String(v)}),v="")}function x(){var n=!0;for(var r=b;r<m.length;r++){n=e.tags[m[r].tag]<e.tags._v||m[r].tag=="_t"&&m[r].text.match(t)===null;if(!n)return!1}return n}function T(e,t){S();if(e&&x())for(var n=b,r;n<m.length;n++)m[n].text&&((r=m[n+1])&&r.tag==">"&&(r.indent=m[n].text.toString()),m.splice(n,1));else t||m.push({tag:"\n"});g=!1,b=m.length}function N(e,t){var n="="+E,r=e.indexOf(n,t),i=u(e.substring(e.indexOf("=",t)+1,r)).split(" ");return w=i[0],E=i[i.length-1],r+n.length-1}var s=r.length,f=0,l=1,c=2,h=f,p=null,d=null,v="",m=[],g=!1,y=0,b=0,w="{{",E="}}";i&&(i=i.split(" "),w=i[0],E=i[1]);for(y=0;y<s;y++)h==f?a(w,r,y)?(--y,S(),h=l):r.charAt(y)=="\n"?T(g):v+=r.charAt(y):h==l?(y+=w.length-1,d=e.tags[r.charAt(y+1)],p=d?r.charAt(y+1):"_v",p=="="?(y=N(r,y),h=f):(d&&y++,h=c),g=y):a(E,r,y)?(m.push({tag:p,n:u(v),otag:w,ctag:E,i:p=="/"?g-w.length:y+E.length}),v="",y+=E.length-1,h=f,p=="{"&&(E=="}}"?y++:o(m[m.length-1]))):v+=r.charAt(y);return T(g,!0),m};var f={_t:!0,"\n":!0,$:!0,"/":!0};e.stringify=function(t,n,r){return"{code: function (c,p,i) { "+e.wrapMain(t.code)+" },"+d(t)+"}"};var v=0;e.generate=function(t,n,r){v=0;var i={code:"",subs:{},partials:{}};return e.walk(t,i),r.asString?this.stringify(i,n,r):this.makeTemplate(i,n,r)},e.wrapMain=function(e){return'var t=this;t.b(i=i||"");'+e+"return t.fl();"},e.template=e.Template,e.makeTemplate=function(e,t,n){var r=this.makePartials(e);return r.code=new Function("c","p","i",this.wrapMain(e.code)),new this.template(r,t,this,n)},e.makePartials=function(e){var t,n={subs:{},partials:e.partials,name:e.name};for(t in n.partials)n.partials[t]=this.makePartials(n.partials[t]);for(t in e.subs)n.subs[t]=new Function("c","p","t","i",e.subs[t]);return n},e.codegen={"#":function(t,n){n.code+="if(t.s(t."+g(t.n)+'("'+m(t.n)+'",c,p,1),'+"c,p,0,"+t.i+","+t.end+',"'+t.otag+" "+t.ctag+'")){'+"t.rs(c,p,"+"function(c,p,t){",e.walk(t.nodes,n),n.code+="});c.pop();}"},"^":function(t,n){n.code+="if(!t.s(t."+g(t.n)+'("'+m(t.n)+'",c,p,1),c,p,1,0,0,"")){',e.walk(t.nodes,n),n.code+="};"},">":y,"<":function(t,n){var r={partials:{},code:"",subs:{},inPartial:!0};e.walk(t.nodes,r);var i=n.partials[y(t,n)];i.subs=r.subs,i.partials=r.partials},$:function(t,n){var r={subs:{},code:"",partials:n.partials,prefix:t.n};e.walk(t.nodes,r),n.subs[t.n]=r.code,n.inPartial||(n.code+='t.sub("'+m(t.n)+'",c,p,i);')},"\n":function(e,t){t.code+=w('"\\n"'+(e.last?"":" + i"))},_v:function(e,t){t.code+="t.b(t.v(t."+g(e.n)+'("'+m(e.n)+'",c,p,0)));'},_t:function(e,t){t.code+=w('"'+m(e.text)+'"')},"{":b,"&":b},e.walk=function(t,n){var r;for(var i=0,s=t.length;i<s;i++)r=e.codegen[t[i].tag],r&&r(t[i],n);return n},e.parse=function(e,t,n){return n=n||{},l(e,"",[],n.sectionTags||[])},e.cache={},e.cacheKey=function(e,t){return[e,!!t.asString,!!t.disableLambda,t.delimiters,!!t.modelGet].join("||")},e.compile=function(t,n){n=n||{};var r=e.cacheKey(t,n),i=this.cache[r];return i?i:(i=this.generate(this.parse(this.scan(t,n.delimiters),t,n),t,n),this.cache[r]=i)}}(typeof exports!="undefined"?exports:Hogan),typeof module!="undefined"&&module.exports&&(module.exports=Hogan),define("libs/hogan/hogan",function(){}),define("components/mixin/template",["components/component_manager","libs/hogan/hogan"],function(e){function t(){this.defaultAttrs({updateOnValueChange:!0}),this.after("initialize",function(){this.attr.tpl&&(this.compiledTpl=Hogan.compile(this.attr.tpl),this.$node.html(this.compiledTpl.render(this.attr)),this.attr.components&&$.each(this.attr.components,$.proxy(function(t,n){e.get(n).attachTo(t)},this)),this.on("valueChange",function(e,t){var n=$.extend({value:t.value},this.attr);$.each(n,function(e,r){$.isFunction(r)&&(n[e]=r(t.value))}),this.attr.updateOnValueChange&&this.$node.html(this.compiledTpl.render(n))})),this.attr.nodes&&$.each(this.attr.nodes,$.proxy(function(e,t){this["$"+e]=$(t,this.$node)},this))})}return t}),define("components/component",["components/component_manager","components/mixin/data_binding","components/mixin/template"],function(e,t,n){return e.create("component",t,n)}),define("components/mixin/container",["components/component_manager","components/component"],function(e){function t(){this.renderItems=function(){$.each(this.attr.items,$.proxy(function(t,n){var r=$("<"+(n.tag||"div")+">");n.className&&r.addClass(n.className),n.html&&r.html(n.html),n.style&&r.css(n.style),$.isArray(n.component)?$.each(n.component,$.proxy(function(t,i){e.get(i).attachTo(r,n)},this)):n.component?e.get(n.component).attachTo(r,n):n.items?e.get("container").attachTo(r,n):e.get("component").attachTo(r,n),this.attr.insertionPoint?r.appendTo($(this.attr.insertionPoint,this.$node)):r.appendTo(this.$node),r.on("render",function(){return!1}),this.rendered?r.trigger("render"):this.on("render",function(){return r.trigger("render"),!1})},this))},this.after("initialize",function(){this.attr.items=this.attr.items||[],this.renderItems(),this.on("render",function(){this.rendered=!0}),jQuery.contains(document.documentElement,this.node)&&this.trigger("render")})}return t}),define("components/container",["components/component_manager","components/mixin/container"],function(e,t){return e.create("container",t)}),define("components/context_menu_panel",["components/component_manager"],function(e){function t(){this.defaultAttrs({items:[]}),this.after("initialize",function(){var t;this.attr.text&&(t=$("<li>").html(this.attr.text).addClass("context-menu-title").on("click",$.proxy(function(){this.trigger("back")},this)).appendTo(this.$node),this.attr.hasBack&&t.addClass("back-link"),$('<li class="separator">').appendTo(this.$node)),$.each(this.attr.items,$.proxy(function(t,n){var r=$("<li>").html(n.text).appendTo(this.$node);n.text==="--"?(r.html(""),r.addClass("separator")):(n.items&&r.addClass("submenu"),n.component&&e.get(n.component).attachTo(r),n.className&&r.addClass(n.className),r.on("click",$.proxy(function(){this.trigger("selected",n)},this)))},this))})}return e.create("contextMenuPanel",t)}),define("components/context_menu",["components/component_manager","components/context_menu_panel"],function(e,t){function n(){var e=[];this.defaultAttrs({items:[]}),this.after("initialize",function(){this.panelWrapper=$("<div>").addClass("context-menu-wrapper"),this.panelContainer=$("<div>").addClass("context-menu-container"),this.$node.addClass("context-menu"),this.$node.append($('<div class="tooltip-arrow">')),this.panelWrapper.append(this.panelContainer),this.$node.append(this.panelWrapper),this.on("show",function(t){e=[],this.panelContainer.find("ul").remove(),this.$node.show(),this.pushPanel(this.attr),this.panelWrapper.css({height:"auto"}),t.stopPropagation()}),this.on("hide",function(e){this.$node.hide(),e.stopPropagation()}),this.on("back",function(e){this.popPanel(),e.stopPropagation()}),this.on("selected",function(e,t){t.items?this.pushPanel(t):this.attr.onSelect&&(this.attr.onSelect(t),this.$node.hide())}),this.pushPanel(this.attr)}),this.pushPanel=function(n){var r=$("<ul>");t.attachTo(r,$.extend({hasBack:e.length>0},n)),e.length?this.transitionPanel(r,this.panelContainer.find("ul")):this.panelContainer.append(r),e.push(n)},this.popPanel=function(){var n=$("<ul>");e.pop(),t.attachTo(n,e[e.length-1]),this.transitionPanel(n,this.panelContainer.find("ul"),!0)},this.transitionPanel=function(e,t,n){this.panelWrapper.css({height:this.panelWrapper.height()}),n?(e.insertBefore(t),this.panelContainer.css({marginLeft:0-e.width()})):e.insertAfter(t),this.panelContainer.css({width:1e4}),newHeight=this.$node.height(),this.panelContainer.animate({marginLeft:n?0:0-this.panelWrapper.width()},{complete:$.proxy(function(){t.remove(),this.panelContainer.css({width:"auto",marginLeft:0}),this.panelWrapper.animate({height:this.panelContainer.height()},250)},this)})}}return e.create("contextMenu",n)}),define("components/context_menu_indicator",["components/component_manager","components/context_menu"],function(e,t){function n(){this.defaultAttrs({}),this.updatePosition=function(){var e=this.$node.offset();this.$cm.css({top:e.top,left:e.left+this.$node.width()})},this.after("initialize",function(){this.$node.addClass("context-menu-indicator"),this.$cm=$("<div>").appendTo($("body")),t.attachTo(this.$cm,this.attr.contextMenu),$(window).on("resize",$.proxy(function(){this.$cm.is(":visible")&&this.updatePosition()},this)),this.$node.click($.proxy(function(){var e=this.$node.offset(),t=this.$node.width(),n=this.$cm.width(),r=$(window).width(),i=$(window).height();e.left+t+n>r&&this.$cm.addClass("right-anchor"),this.updatePosition(),this.$cm.trigger("show")},this)),$(document).on("click",$.proxy(function(e){!this.$node.is(e.target)&&!$.contains(this.$cm[0],e.target)&&this.$cm.trigger("hide")},this)),$(document).on("keyup",$.proxy(function(e){e.keyCode===27&&this.$cm.trigger("hide")},this))})}return e.create("contextMenuIndicator",n)}),define("components/dashboard/overview_panel",["components/component_manager","components/mixin/container","components/context_menu_indicator"],function(e,t,n){function r(){this.defaultAttrs({insertionPoint:".overview-content",title:"",count:10,countClass:"blue"}),this.createOverviewHeader=function(){this.$headerNode=$("<div>").addClass("overview-header"),this.$countNode=$("<span>").addClass("overview-count").appendTo(this.$headerNode).html(this.attr.count),this.$titleNode=$("<span>").addClass("overview-title").appendTo(this.$headerNode).html(this.attr.title),this.$headerNode.appendTo(this.$node),this.$contentNode=$("<div>").addClass("overview-content").appendTo(this.$node),this.attr.contextMenu&&(this.cmIndicator=$("<div>").appendTo(this.$headerNode),n.attachTo(this.cmIndicator,this.attr))},this.after("initialize",function(){this.$node.addClass("sidebar"),this.createOverviewHeader()})}return window.aa=e,e.create("overviewPanel",r,t)}),define("components/dashboard/dashboard",["components/component_manager","components/mixin/container","components/mixin/data_binding","components/container","components/dashboard/overview_panel"],function(e,t,n){function r(){this.defaultAttrs({}),this.updateData=function(){this.attr.data($.proxy(function(e){this.$node.trigger("valueChange",{value:e})},this))},this.after("initialize",function(){this.before("renderItems",function(){this.attr.items=[{component:"container",className:"main-content",items:this.attr.mainContent},{component:"overviewPanel",title:this.attr.overviewPanel.title,contextMenu:this.attr.overviewPanel.contextMenu,items:this.attr.overviewPanel.items}]}),this.after("renderItems",function(){this.updateData()})})}return e.create("dashboard",r,t,n)});
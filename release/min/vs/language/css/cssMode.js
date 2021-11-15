/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.30.1(1df7c2d3e9be83711740bbd8dc3fdca1b50adaf9)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/language/css/cssMode",[],()=>{
var moduleExports=(()=>{var qe=Object.create;var L=Object.defineProperty;var Qe=Object.getOwnPropertyDescriptor;var Ge=Object.getOwnPropertyNames;var Je=Object.getPrototypeOf,Ye=Object.prototype.hasOwnProperty;var z=n=>L(n,"__esModule",{value:!0});var Ze=(n,t)=>()=>(t||n((t={exports:{}}).exports,t),t.exports),en=(n,t)=>{z(n);for(var i in t)L(n,i,{get:t[i],enumerable:!0})},X=(n,t,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Ge(t))!Ye.call(n,r)&&r!=="default"&&L(n,r,{get:()=>t[r],enumerable:!(i=Qe(t,r))||i.enumerable});return n},nn=n=>X(z(L(n!=null?qe(Je(n)):{},"default",n&&n.__esModule&&"default"in n?{get:()=>n.default,enumerable:!0}:{value:n,enumerable:!0})),n);var fe=Ze((yn,le)=>{le.exports=self.monaco});var xn={};en(xn,{setupMode:()=>vn});var c={};z(c);X(c,nn(fe()));var tn=2*60*1e3,B=class{constructor(t){this._defaults=t,this._worker=null,this._idleCheckInterval=window.setInterval(()=>this._checkIfIdle(),30*1e3),this._lastUsedTime=0,this._configChangeListener=this._defaults.onDidChange(()=>this._stopWorker())}_stopWorker(){this._worker&&(this._worker.dispose(),this._worker=null),this._client=null}dispose(){clearInterval(this._idleCheckInterval),this._configChangeListener.dispose(),this._stopWorker()}_checkIfIdle(){if(!this._worker)return;Date.now()-this._lastUsedTime>tn&&this._stopWorker()}_getClient(){return this._lastUsedTime=Date.now(),this._client||(this._worker=c.editor.createWebWorker({moduleId:"vs/language/css/cssWorker",label:this._defaults.languageId,createData:{options:this._defaults.options,languageId:this._defaults.languageId}}),this._client=this._worker.getProxy()),this._client}getLanguageServiceWorker(...t){let i;return this._getClient().then(r=>{i=r}).then(r=>this._worker.withSyncedResources(t)).then(r=>i)}};"use strict";var ge;(function(n){n.MIN_VALUE=-2147483648,n.MAX_VALUE=2147483647})(ge||(ge={}));var U;(function(n){n.MIN_VALUE=0,n.MAX_VALUE=2147483647})(U||(U={}));var y;(function(n){function t(r,e){return r===Number.MAX_VALUE&&(r=U.MAX_VALUE),e===Number.MAX_VALUE&&(e=U.MAX_VALUE),{line:r,character:e}}n.create=t;function i(r){var e=r;return s.objectLiteral(e)&&s.uinteger(e.line)&&s.uinteger(e.character)}n.is=i})(y||(y={}));var v;(function(n){function t(r,e,a,o){if(s.uinteger(r)&&s.uinteger(e)&&s.uinteger(a)&&s.uinteger(o))return{start:y.create(r,e),end:y.create(a,o)};if(y.is(r)&&y.is(e))return{start:r,end:e};throw new Error("Range#create called with invalid arguments["+r+", "+e+", "+a+", "+o+"]")}n.create=t;function i(r){var e=r;return s.objectLiteral(e)&&y.is(e.start)&&y.is(e.end)}n.is=i})(v||(v={}));var $;(function(n){function t(r,e){return{uri:r,range:e}}n.create=t;function i(r){var e=r;return s.defined(e)&&v.is(e.range)&&(s.string(e.uri)||s.undefined(e.uri))}n.is=i})($||($={}));var pe;(function(n){function t(r,e,a,o){return{targetUri:r,targetRange:e,targetSelectionRange:a,originSelectionRange:o}}n.create=t;function i(r){var e=r;return s.defined(e)&&v.is(e.targetRange)&&s.string(e.targetUri)&&(v.is(e.targetSelectionRange)||s.undefined(e.targetSelectionRange))&&(v.is(e.originSelectionRange)||s.undefined(e.originSelectionRange))}n.is=i})(pe||(pe={}));var q;(function(n){function t(r,e,a,o){return{red:r,green:e,blue:a,alpha:o}}n.create=t;function i(r){var e=r;return s.numberRange(e.red,0,1)&&s.numberRange(e.green,0,1)&&s.numberRange(e.blue,0,1)&&s.numberRange(e.alpha,0,1)}n.is=i})(q||(q={}));var he;(function(n){function t(r,e){return{range:r,color:e}}n.create=t;function i(r){var e=r;return v.is(e.range)&&q.is(e.color)}n.is=i})(he||(he={}));var me;(function(n){function t(r,e,a){return{label:r,textEdit:e,additionalTextEdits:a}}n.create=t;function i(r){var e=r;return s.string(e.label)&&(s.undefined(e.textEdit)||b.is(e))&&(s.undefined(e.additionalTextEdits)||s.typedArray(e.additionalTextEdits,b.is))}n.is=i})(me||(me={}));var S;(function(n){n.Comment="comment",n.Imports="imports",n.Region="region"})(S||(S={}));var ve;(function(n){function t(r,e,a,o,u){var l={startLine:r,endLine:e};return s.defined(a)&&(l.startCharacter=a),s.defined(o)&&(l.endCharacter=o),s.defined(u)&&(l.kind=u),l}n.create=t;function i(r){var e=r;return s.uinteger(e.startLine)&&s.uinteger(e.startLine)&&(s.undefined(e.startCharacter)||s.uinteger(e.startCharacter))&&(s.undefined(e.endCharacter)||s.uinteger(e.endCharacter))&&(s.undefined(e.kind)||s.string(e.kind))}n.is=i})(ve||(ve={}));var Q;(function(n){function t(r,e){return{location:r,message:e}}n.create=t;function i(r){var e=r;return s.defined(e)&&$.is(e.location)&&s.string(e.message)}n.is=i})(Q||(Q={}));var T;(function(n){n.Error=1,n.Warning=2,n.Information=3,n.Hint=4})(T||(T={}));var xe;(function(n){n.Unnecessary=1,n.Deprecated=2})(xe||(xe={}));var ke;(function(n){function t(i){var r=i;return r!=null&&s.string(r.href)}n.is=t})(ke||(ke={}));var j;(function(n){function t(r,e,a,o,u,l){var g={range:r,message:e};return s.defined(a)&&(g.severity=a),s.defined(o)&&(g.code=o),s.defined(u)&&(g.source=u),s.defined(l)&&(g.relatedInformation=l),g}n.create=t;function i(r){var e,a=r;return s.defined(a)&&v.is(a.range)&&s.string(a.message)&&(s.number(a.severity)||s.undefined(a.severity))&&(s.integer(a.code)||s.string(a.code)||s.undefined(a.code))&&(s.undefined(a.codeDescription)||s.string((e=a.codeDescription)===null||e===void 0?void 0:e.href))&&(s.string(a.source)||s.undefined(a.source))&&(s.undefined(a.relatedInformation)||s.typedArray(a.relatedInformation,Q.is))}n.is=i})(j||(j={}));var A;(function(n){function t(r,e){for(var a=[],o=2;o<arguments.length;o++)a[o-2]=arguments[o];var u={title:r,command:e};return s.defined(a)&&a.length>0&&(u.arguments=a),u}n.create=t;function i(r){var e=r;return s.defined(e)&&s.string(e.title)&&s.string(e.command)}n.is=i})(A||(A={}));var b;(function(n){function t(a,o){return{range:a,newText:o}}n.replace=t;function i(a,o){return{range:{start:a,end:a},newText:o}}n.insert=i;function r(a){return{range:a,newText:""}}n.del=r;function e(a){var o=a;return s.objectLiteral(o)&&s.string(o.newText)&&v.is(o.range)}n.is=e})(b||(b={}));var E;(function(n){function t(r,e,a){var o={label:r};return e!==void 0&&(o.needsConfirmation=e),a!==void 0&&(o.description=a),o}n.create=t;function i(r){var e=r;return e!==void 0&&s.objectLiteral(e)&&s.string(e.label)&&(s.boolean(e.needsConfirmation)||e.needsConfirmation===void 0)&&(s.string(e.description)||e.description===void 0)}n.is=i})(E||(E={}));var x;(function(n){function t(i){var r=i;return typeof r=="string"}n.is=t})(x||(x={}));var C;(function(n){function t(a,o,u){return{range:a,newText:o,annotationId:u}}n.replace=t;function i(a,o,u){return{range:{start:a,end:a},newText:o,annotationId:u}}n.insert=i;function r(a,o){return{range:a,newText:"",annotationId:o}}n.del=r;function e(a){var o=a;return b.is(o)&&(E.is(o.annotationId)||x.is(o.annotationId))}n.is=e})(C||(C={}));var H;(function(n){function t(r,e){return{textDocument:r,edits:e}}n.create=t;function i(r){var e=r;return s.defined(e)&&O.is(e.textDocument)&&Array.isArray(e.edits)}n.is=i})(H||(H={}));var P;(function(n){function t(r,e,a){var o={kind:"create",uri:r};return e!==void 0&&(e.overwrite!==void 0||e.ignoreIfExists!==void 0)&&(o.options=e),a!==void 0&&(o.annotationId=a),o}n.create=t;function i(r){var e=r;return e&&e.kind==="create"&&s.string(e.uri)&&(e.options===void 0||(e.options.overwrite===void 0||s.boolean(e.options.overwrite))&&(e.options.ignoreIfExists===void 0||s.boolean(e.options.ignoreIfExists)))&&(e.annotationId===void 0||x.is(e.annotationId))}n.is=i})(P||(P={}));var D;(function(n){function t(r,e,a,o){var u={kind:"rename",oldUri:r,newUri:e};return a!==void 0&&(a.overwrite!==void 0||a.ignoreIfExists!==void 0)&&(u.options=a),o!==void 0&&(u.annotationId=o),u}n.create=t;function i(r){var e=r;return e&&e.kind==="rename"&&s.string(e.oldUri)&&s.string(e.newUri)&&(e.options===void 0||(e.options.overwrite===void 0||s.boolean(e.options.overwrite))&&(e.options.ignoreIfExists===void 0||s.boolean(e.options.ignoreIfExists)))&&(e.annotationId===void 0||x.is(e.annotationId))}n.is=i})(D||(D={}));var M;(function(n){function t(r,e,a){var o={kind:"delete",uri:r};return e!==void 0&&(e.recursive!==void 0||e.ignoreIfNotExists!==void 0)&&(o.options=e),a!==void 0&&(o.annotationId=a),o}n.create=t;function i(r){var e=r;return e&&e.kind==="delete"&&s.string(e.uri)&&(e.options===void 0||(e.options.recursive===void 0||s.boolean(e.options.recursive))&&(e.options.ignoreIfNotExists===void 0||s.boolean(e.options.ignoreIfNotExists)))&&(e.annotationId===void 0||x.is(e.annotationId))}n.is=i})(M||(M={}));var G;(function(n){function t(i){var r=i;return r&&(r.changes!==void 0||r.documentChanges!==void 0)&&(r.documentChanges===void 0||r.documentChanges.every(function(e){return s.string(e.kind)?P.is(e)||D.is(e)||M.is(e):H.is(e)}))}n.is=t})(G||(G={}));var N=function(){function n(t,i){this.edits=t,this.changeAnnotations=i}return n.prototype.insert=function(t,i,r){var e,a;if(r===void 0?e=b.insert(t,i):x.is(r)?(a=r,e=C.insert(t,i,r)):(this.assertChangeAnnotations(this.changeAnnotations),a=this.changeAnnotations.manage(r),e=C.insert(t,i,a)),this.edits.push(e),a!==void 0)return a},n.prototype.replace=function(t,i,r){var e,a;if(r===void 0?e=b.replace(t,i):x.is(r)?(a=r,e=C.replace(t,i,r)):(this.assertChangeAnnotations(this.changeAnnotations),a=this.changeAnnotations.manage(r),e=C.replace(t,i,a)),this.edits.push(e),a!==void 0)return a},n.prototype.delete=function(t,i){var r,e;if(i===void 0?r=b.del(t):x.is(i)?(e=i,r=C.del(t,i)):(this.assertChangeAnnotations(this.changeAnnotations),e=this.changeAnnotations.manage(i),r=C.del(t,e)),this.edits.push(r),e!==void 0)return e},n.prototype.add=function(t){this.edits.push(t)},n.prototype.all=function(){return this.edits},n.prototype.clear=function(){this.edits.splice(0,this.edits.length)},n.prototype.assertChangeAnnotations=function(t){if(t===void 0)throw new Error("Text edit change is not configured to manage change annotations.")},n}(),ye=function(){function n(t){this._annotations=t===void 0?Object.create(null):t,this._counter=0,this._size=0}return n.prototype.all=function(){return this._annotations},Object.defineProperty(n.prototype,"size",{get:function(){return this._size},enumerable:!1,configurable:!0}),n.prototype.manage=function(t,i){var r;if(x.is(t)?r=t:(r=this.nextId(),i=t),this._annotations[r]!==void 0)throw new Error("Id "+r+" is already in use.");if(i===void 0)throw new Error("No annotation provided for id "+r);return this._annotations[r]=i,this._size++,r},n.prototype.nextId=function(){return this._counter++,this._counter.toString()},n}(),In=function(){function n(t){var i=this;this._textEditChanges=Object.create(null),t!==void 0?(this._workspaceEdit=t,t.documentChanges?(this._changeAnnotations=new ye(t.changeAnnotations),t.changeAnnotations=this._changeAnnotations.all(),t.documentChanges.forEach(function(r){if(H.is(r)){var e=new N(r.edits,i._changeAnnotations);i._textEditChanges[r.textDocument.uri]=e}})):t.changes&&Object.keys(t.changes).forEach(function(r){var e=new N(t.changes[r]);i._textEditChanges[r]=e})):this._workspaceEdit={}}return Object.defineProperty(n.prototype,"edit",{get:function(){return this.initDocumentChanges(),this._changeAnnotations!==void 0&&(this._changeAnnotations.size===0?this._workspaceEdit.changeAnnotations=void 0:this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()),this._workspaceEdit},enumerable:!1,configurable:!0}),n.prototype.getTextEditChange=function(t){if(O.is(t)){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var i={uri:t.uri,version:t.version},r=this._textEditChanges[i.uri];if(!r){var e=[],a={textDocument:i,edits:e};this._workspaceEdit.documentChanges.push(a),r=new N(e,this._changeAnnotations),this._textEditChanges[i.uri]=r}return r}else{if(this.initChanges(),this._workspaceEdit.changes===void 0)throw new Error("Workspace edit is not configured for normal text edit changes.");var r=this._textEditChanges[t];if(!r){var e=[];this._workspaceEdit.changes[t]=e,r=new N(e),this._textEditChanges[t]=r}return r}},n.prototype.initDocumentChanges=function(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._changeAnnotations=new ye,this._workspaceEdit.documentChanges=[],this._workspaceEdit.changeAnnotations=this._changeAnnotations.all())},n.prototype.initChanges=function(){this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0&&(this._workspaceEdit.changes=Object.create(null))},n.prototype.createFile=function(t,i,r){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var e;E.is(i)||x.is(i)?e=i:r=i;var a,o;if(e===void 0?a=P.create(t,r):(o=x.is(e)?e:this._changeAnnotations.manage(e),a=P.create(t,r,o)),this._workspaceEdit.documentChanges.push(a),o!==void 0)return o},n.prototype.renameFile=function(t,i,r,e){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var a;E.is(r)||x.is(r)?a=r:e=r;var o,u;if(a===void 0?o=D.create(t,i,e):(u=x.is(a)?a:this._changeAnnotations.manage(a),o=D.create(t,i,e,u)),this._workspaceEdit.documentChanges.push(o),u!==void 0)return u},n.prototype.deleteFile=function(t,i,r){if(this.initDocumentChanges(),this._workspaceEdit.documentChanges===void 0)throw new Error("Workspace edit is not configured for document changes.");var e;E.is(i)||x.is(i)?e=i:r=i;var a,o;if(e===void 0?a=M.create(t,r):(o=x.is(e)?e:this._changeAnnotations.manage(e),a=M.create(t,r,o)),this._workspaceEdit.documentChanges.push(a),o!==void 0)return o},n}();var _e;(function(n){function t(r){return{uri:r}}n.create=t;function i(r){var e=r;return s.defined(e)&&s.string(e.uri)}n.is=i})(_e||(_e={}));var be;(function(n){function t(r,e){return{uri:r,version:e}}n.create=t;function i(r){var e=r;return s.defined(e)&&s.string(e.uri)&&s.integer(e.version)}n.is=i})(be||(be={}));var O;(function(n){function t(r,e){return{uri:r,version:e}}n.create=t;function i(r){var e=r;return s.defined(e)&&s.string(e.uri)&&(e.version===null||s.integer(e.version))}n.is=i})(O||(O={}));var Ce;(function(n){function t(r,e,a,o){return{uri:r,languageId:e,version:a,text:o}}n.create=t;function i(r){var e=r;return s.defined(e)&&s.string(e.uri)&&s.string(e.languageId)&&s.integer(e.version)&&s.string(e.text)}n.is=i})(Ce||(Ce={}));var W;(function(n){n.PlainText="plaintext",n.Markdown="markdown"})(W||(W={}));(function(n){function t(i){var r=i;return r===n.PlainText||r===n.Markdown}n.is=t})(W||(W={}));var J;(function(n){function t(i){var r=i;return s.objectLiteral(i)&&W.is(r.kind)&&s.string(r.value)}n.is=t})(J||(J={}));var p;(function(n){n.Text=1,n.Method=2,n.Function=3,n.Constructor=4,n.Field=5,n.Variable=6,n.Class=7,n.Interface=8,n.Module=9,n.Property=10,n.Unit=11,n.Value=12,n.Enum=13,n.Keyword=14,n.Snippet=15,n.Color=16,n.File=17,n.Reference=18,n.Folder=19,n.EnumMember=20,n.Constant=21,n.Struct=22,n.Event=23,n.Operator=24,n.TypeParameter=25})(p||(p={}));var V;(function(n){n.PlainText=1,n.Snippet=2})(V||(V={}));var Te;(function(n){n.Deprecated=1})(Te||(Te={}));var we;(function(n){function t(r,e,a){return{newText:r,insert:e,replace:a}}n.create=t;function i(r){var e=r;return e&&s.string(e.newText)&&v.is(e.insert)&&v.is(e.replace)}n.is=i})(we||(we={}));var Ie;(function(n){n.asIs=1,n.adjustIndentation=2})(Ie||(Ie={}));var Se;(function(n){function t(i){return{label:i}}n.create=t})(Se||(Se={}));var Ee;(function(n){function t(i,r){return{items:i||[],isIncomplete:!!r}}n.create=t})(Ee||(Ee={}));var K;(function(n){function t(r){return r.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}n.fromPlainText=t;function i(r){var e=r;return s.string(e)||s.objectLiteral(e)&&s.string(e.language)&&s.string(e.value)}n.is=i})(K||(K={}));var Re;(function(n){function t(i){var r=i;return!!r&&s.objectLiteral(r)&&(J.is(r.contents)||K.is(r.contents)||s.typedArray(r.contents,K.is))&&(i.range===void 0||v.is(i.range))}n.is=t})(Re||(Re={}));var Ae;(function(n){function t(i,r){return r?{label:i,documentation:r}:{label:i}}n.create=t})(Ae||(Ae={}));var Pe;(function(n){function t(i,r){for(var e=[],a=2;a<arguments.length;a++)e[a-2]=arguments[a];var o={label:i};return s.defined(r)&&(o.documentation=r),s.defined(e)?o.parameters=e:o.parameters=[],o}n.create=t})(Pe||(Pe={}));var R;(function(n){n.Text=1,n.Read=2,n.Write=3})(R||(R={}));var De;(function(n){function t(i,r){var e={range:i};return s.number(r)&&(e.kind=r),e}n.create=t})(De||(De={}));var h;(function(n){n.File=1,n.Module=2,n.Namespace=3,n.Package=4,n.Class=5,n.Method=6,n.Property=7,n.Field=8,n.Constructor=9,n.Enum=10,n.Interface=11,n.Function=12,n.Variable=13,n.Constant=14,n.String=15,n.Number=16,n.Boolean=17,n.Array=18,n.Object=19,n.Key=20,n.Null=21,n.EnumMember=22,n.Struct=23,n.Event=24,n.Operator=25,n.TypeParameter=26})(h||(h={}));var Me;(function(n){n.Deprecated=1})(Me||(Me={}));var We;(function(n){function t(i,r,e,a,o){var u={name:i,kind:r,location:{uri:a,range:e}};return o&&(u.containerName=o),u}n.create=t})(We||(We={}));var Fe;(function(n){function t(r,e,a,o,u,l){var g={name:r,detail:e,kind:a,range:o,selectionRange:u};return l!==void 0&&(g.children=l),g}n.create=t;function i(r){var e=r;return e&&s.string(e.name)&&s.number(e.kind)&&v.is(e.range)&&v.is(e.selectionRange)&&(e.detail===void 0||s.string(e.detail))&&(e.deprecated===void 0||s.boolean(e.deprecated))&&(e.children===void 0||Array.isArray(e.children))&&(e.tags===void 0||Array.isArray(e.tags))}n.is=i})(Fe||(Fe={}));var Le;(function(n){n.Empty="",n.QuickFix="quickfix",n.Refactor="refactor",n.RefactorExtract="refactor.extract",n.RefactorInline="refactor.inline",n.RefactorRewrite="refactor.rewrite",n.Source="source",n.SourceOrganizeImports="source.organizeImports",n.SourceFixAll="source.fixAll"})(Le||(Le={}));var Ue;(function(n){function t(r,e){var a={diagnostics:r};return e!=null&&(a.only=e),a}n.create=t;function i(r){var e=r;return s.defined(e)&&s.typedArray(e.diagnostics,j.is)&&(e.only===void 0||s.typedArray(e.only,s.string))}n.is=i})(Ue||(Ue={}));var je;(function(n){function t(r,e,a){var o={title:r},u=!0;return typeof e=="string"?(u=!1,o.kind=e):A.is(e)?o.command=e:o.edit=e,u&&a!==void 0&&(o.kind=a),o}n.create=t;function i(r){var e=r;return e&&s.string(e.title)&&(e.diagnostics===void 0||s.typedArray(e.diagnostics,j.is))&&(e.kind===void 0||s.string(e.kind))&&(e.edit!==void 0||e.command!==void 0)&&(e.command===void 0||A.is(e.command))&&(e.isPreferred===void 0||s.boolean(e.isPreferred))&&(e.edit===void 0||G.is(e.edit))}n.is=i})(je||(je={}));var He;(function(n){function t(r,e){var a={range:r};return s.defined(e)&&(a.data=e),a}n.create=t;function i(r){var e=r;return s.defined(e)&&v.is(e.range)&&(s.undefined(e.command)||A.is(e.command))}n.is=i})(He||(He={}));var Ne;(function(n){function t(r,e){return{tabSize:r,insertSpaces:e}}n.create=t;function i(r){var e=r;return s.defined(e)&&s.uinteger(e.tabSize)&&s.boolean(e.insertSpaces)}n.is=i})(Ne||(Ne={}));var Oe;(function(n){function t(r,e,a){return{range:r,target:e,data:a}}n.create=t;function i(r){var e=r;return s.defined(e)&&v.is(e.range)&&(s.undefined(e.target)||s.string(e.target))}n.is=i})(Oe||(Oe={}));var Ve;(function(n){function t(r,e){return{range:r,parent:e}}n.create=t;function i(r){var e=r;return e!==void 0&&v.is(e.range)&&(e.parent===void 0||n.is(e.parent))}n.is=i})(Ve||(Ve={}));var Ke;(function(n){function t(a,o,u,l){return new rn(a,o,u,l)}n.create=t;function i(a){var o=a;return!!(s.defined(o)&&s.string(o.uri)&&(s.undefined(o.languageId)||s.string(o.languageId))&&s.uinteger(o.lineCount)&&s.func(o.getText)&&s.func(o.positionAt)&&s.func(o.offsetAt))}n.is=i;function r(a,o){for(var u=a.getText(),l=e(o,function(I,F){var de=I.range.start.line-F.range.start.line;return de===0?I.range.start.character-F.range.start.character:de}),g=u.length,f=l.length-1;f>=0;f--){var m=l[f],_=a.offsetAt(m.range.start),d=a.offsetAt(m.range.end);if(d<=g)u=u.substring(0,_)+m.newText+u.substring(d,u.length);else throw new Error("Overlapping edit");g=_}return u}n.applyEdits=r;function e(a,o){if(a.length<=1)return a;var u=a.length/2|0,l=a.slice(0,u),g=a.slice(u);e(l,o),e(g,o);for(var f=0,m=0,_=0;f<l.length&&m<g.length;){var d=o(l[f],g[m]);d<=0?a[_++]=l[f++]:a[_++]=g[m++]}for(;f<l.length;)a[_++]=l[f++];for(;m<g.length;)a[_++]=g[m++];return a}})(Ke||(Ke={}));var rn=function(){function n(t,i,r,e){this._uri=t,this._languageId=i,this._version=r,this._content=e,this._lineOffsets=void 0}return Object.defineProperty(n.prototype,"uri",{get:function(){return this._uri},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"languageId",{get:function(){return this._languageId},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"version",{get:function(){return this._version},enumerable:!1,configurable:!0}),n.prototype.getText=function(t){if(t){var i=this.offsetAt(t.start),r=this.offsetAt(t.end);return this._content.substring(i,r)}return this._content},n.prototype.update=function(t,i){this._content=t.text,this._version=i,this._lineOffsets=void 0},n.prototype.getLineOffsets=function(){if(this._lineOffsets===void 0){for(var t=[],i=this._content,r=!0,e=0;e<i.length;e++){r&&(t.push(e),r=!1);var a=i.charAt(e);r=a==="\r"||a===`
`,a==="\r"&&e+1<i.length&&i.charAt(e+1)===`
`&&e++}r&&i.length>0&&t.push(i.length),this._lineOffsets=t}return this._lineOffsets},n.prototype.positionAt=function(t){t=Math.max(Math.min(t,this._content.length),0);var i=this.getLineOffsets(),r=0,e=i.length;if(e===0)return y.create(0,t);for(;r<e;){var a=Math.floor((r+e)/2);i[a]>t?e=a:r=a+1}var o=r-1;return y.create(o,t-i[o])},n.prototype.offsetAt=function(t){var i=this.getLineOffsets();if(t.line>=i.length)return this._content.length;if(t.line<0)return 0;var r=i[t.line],e=t.line+1<i.length?i[t.line+1]:this._content.length;return Math.max(Math.min(r+t.character,e),r)},Object.defineProperty(n.prototype,"lineCount",{get:function(){return this.getLineOffsets().length},enumerable:!1,configurable:!0}),n}(),s;(function(n){var t=Object.prototype.toString;function i(d){return typeof d!="undefined"}n.defined=i;function r(d){return typeof d=="undefined"}n.undefined=r;function e(d){return d===!0||d===!1}n.boolean=e;function a(d){return t.call(d)==="[object String]"}n.string=a;function o(d){return t.call(d)==="[object Number]"}n.number=o;function u(d,I,F){return t.call(d)==="[object Number]"&&I<=d&&d<=F}n.numberRange=u;function l(d){return t.call(d)==="[object Number]"&&-2147483648<=d&&d<=2147483647}n.integer=l;function g(d){return t.call(d)==="[object Number]"&&0<=d&&d<=2147483647}n.uinteger=g;function f(d){return t.call(d)==="[object Function]"}n.func=f;function m(d){return d!==null&&typeof d=="object"}n.objectLiteral=m;function _(d,I){return Array.isArray(d)&&d.every(I)}n.typedArray=_})(s||(s={}));var Y=class{constructor(t,i,r){this._languageId=t;this._worker=i;this._disposables=[];this._listener=Object.create(null);let e=o=>{let u=o.getLanguageId();if(u!==this._languageId)return;let l;this._listener[o.uri.toString()]=o.onDidChangeContent(()=>{window.clearTimeout(l),l=window.setTimeout(()=>this._doValidate(o.uri,u),500)}),this._doValidate(o.uri,u)},a=o=>{c.editor.setModelMarkers(o,this._languageId,[]);let u=o.uri.toString(),l=this._listener[u];l&&(l.dispose(),delete this._listener[u])};this._disposables.push(c.editor.onDidCreateModel(e)),this._disposables.push(c.editor.onWillDisposeModel(a)),this._disposables.push(c.editor.onDidChangeModelLanguage(o=>{a(o.model),e(o.model)})),r.onDidChange(o=>{c.editor.getModels().forEach(u=>{u.getLanguageId()===this._languageId&&(a(u),e(u))})}),this._disposables.push({dispose:()=>{for(let o in this._listener)this._listener[o].dispose()}}),c.editor.getModels().forEach(e)}dispose(){this._disposables.forEach(t=>t&&t.dispose()),this._disposables=[]}_doValidate(t,i){this._worker(t).then(r=>r.doValidation(t.toString())).then(r=>{let e=r.map(o=>on(t,o)),a=c.editor.getModel(t);a&&a.getLanguageId()===i&&c.editor.setModelMarkers(a,i,e)}).then(void 0,r=>{console.error(r)})}};function an(n){switch(n){case T.Error:return c.MarkerSeverity.Error;case T.Warning:return c.MarkerSeverity.Warning;case T.Information:return c.MarkerSeverity.Info;case T.Hint:return c.MarkerSeverity.Hint;default:return c.MarkerSeverity.Info}}function on(n,t){let i=typeof t.code=="number"?String(t.code):t.code;return{severity:an(t.severity),startLineNumber:t.range.start.line+1,startColumn:t.range.start.character+1,endLineNumber:t.range.end.line+1,endColumn:t.range.end.character+1,message:t.message,code:i,source:t.source}}function w(n){if(!!n)return{character:n.column-1,line:n.lineNumber-1}}function sn(n){if(!!n)return{start:{line:n.startLineNumber-1,character:n.startColumn-1},end:{line:n.endLineNumber-1,character:n.endColumn-1}}}function k(n){if(!!n)return new c.Range(n.start.line+1,n.start.character+1,n.end.line+1,n.end.character+1)}function un(n){return typeof n.insert!="undefined"&&typeof n.replace!="undefined"}function cn(n){let t=c.languages.CompletionItemKind;switch(n){case p.Text:return t.Text;case p.Method:return t.Method;case p.Function:return t.Function;case p.Constructor:return t.Constructor;case p.Field:return t.Field;case p.Variable:return t.Variable;case p.Class:return t.Class;case p.Interface:return t.Interface;case p.Module:return t.Module;case p.Property:return t.Property;case p.Unit:return t.Unit;case p.Value:return t.Value;case p.Enum:return t.Enum;case p.Keyword:return t.Keyword;case p.Snippet:return t.Snippet;case p.Color:return t.Color;case p.File:return t.File;case p.Reference:return t.Reference}return t.Property}function Z(n){if(!!n)return{range:k(n.range),text:n.newText}}function dn(n){return n&&n.command==="editor.action.triggerSuggest"?{id:n.command,title:n.title,arguments:n.arguments}:void 0}var ee=class{constructor(t){this._worker=t}get triggerCharacters(){return["/","-",":"]}provideCompletionItems(t,i,r,e){let a=t.uri;return this._worker(a).then(o=>o.doComplete(a.toString(),w(i))).then(o=>{if(!o)return;let u=t.getWordUntilPosition(i),l=new c.Range(i.lineNumber,u.startColumn,i.lineNumber,u.endColumn),g=o.items.map(f=>{let m={label:f.label,insertText:f.insertText||f.label,sortText:f.sortText,filterText:f.filterText,documentation:f.documentation,detail:f.detail,command:dn(f.command),range:l,kind:cn(f.kind)};return f.textEdit&&(un(f.textEdit)?m.range={insert:k(f.textEdit.insert),replace:k(f.textEdit.replace)}:m.range=k(f.textEdit.range),m.insertText=f.textEdit.newText),f.additionalTextEdits&&(m.additionalTextEdits=f.additionalTextEdits.map(Z)),f.insertTextFormat===V.Snippet&&(m.insertTextRules=c.languages.CompletionItemInsertTextRule.InsertAsSnippet),m});return{isIncomplete:o.isIncomplete,suggestions:g}})}};function ln(n){return n&&typeof n=="object"&&typeof n.kind=="string"}function ze(n){return typeof n=="string"?{value:n}:ln(n)?n.kind==="plaintext"?{value:n.value.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}:{value:n.value}:{value:"```"+n.language+`
`+n.value+"\n```\n"}}function fn(n){if(!!n)return Array.isArray(n)?n.map(ze):[ze(n)]}var ne=class{constructor(t){this._worker=t}provideHover(t,i,r){let e=t.uri;return this._worker(e).then(a=>a.doHover(e.toString(),w(i))).then(a=>{if(!!a)return{range:k(a.range),contents:fn(a.contents)}})}};function gn(n){switch(n){case R.Read:return c.languages.DocumentHighlightKind.Read;case R.Write:return c.languages.DocumentHighlightKind.Write;case R.Text:return c.languages.DocumentHighlightKind.Text}return c.languages.DocumentHighlightKind.Text}var te=class{constructor(t){this._worker=t}provideDocumentHighlights(t,i,r){let e=t.uri;return this._worker(e).then(a=>a.findDocumentHighlights(e.toString(),w(i))).then(a=>{if(!!a)return a.map(o=>({range:k(o.range),kind:gn(o.kind)}))})}};function Xe(n){return{uri:c.Uri.parse(n.uri),range:k(n.range)}}var re=class{constructor(t){this._worker=t}provideDefinition(t,i,r){let e=t.uri;return this._worker(e).then(a=>a.findDefinition(e.toString(),w(i))).then(a=>{if(!!a)return[Xe(a)]})}},ie=class{constructor(t){this._worker=t}provideReferences(t,i,r,e){let a=t.uri;return this._worker(a).then(o=>o.findReferences(a.toString(),w(i))).then(o=>{if(!!o)return o.map(Xe)})}};function pn(n){if(!n||!n.changes)return;let t=[];for(let i in n.changes){let r=c.Uri.parse(i);for(let e of n.changes[i])t.push({resource:r,edit:{range:k(e.range),text:e.newText}})}return{edits:t}}var ae=class{constructor(t){this._worker=t}provideRenameEdits(t,i,r,e){let a=t.uri;return this._worker(a).then(o=>o.doRename(a.toString(),w(i),r)).then(o=>pn(o))}};function hn(n){let t=c.languages.SymbolKind;switch(n){case h.File:return t.Array;case h.Module:return t.Module;case h.Namespace:return t.Namespace;case h.Package:return t.Package;case h.Class:return t.Class;case h.Method:return t.Method;case h.Property:return t.Property;case h.Field:return t.Field;case h.Constructor:return t.Constructor;case h.Enum:return t.Enum;case h.Interface:return t.Interface;case h.Function:return t.Function;case h.Variable:return t.Variable;case h.Constant:return t.Constant;case h.String:return t.String;case h.Number:return t.Number;case h.Boolean:return t.Boolean;case h.Array:return t.Array}return t.Function}var oe=class{constructor(t){this._worker=t}provideDocumentSymbols(t,i){let r=t.uri;return this._worker(r).then(e=>e.findDocumentSymbols(r.toString())).then(e=>{if(!!e)return e.map(a=>({name:a.name,detail:"",containerName:a.containerName,kind:hn(a.kind),tags:[],range:k(a.location.range),selectionRange:k(a.location.range)}))})}},se=class{constructor(t){this._worker=t}provideDocumentColors(t,i){let r=t.uri;return this._worker(r).then(e=>e.findDocumentColors(r.toString())).then(e=>{if(!!e)return e.map(a=>({color:a.color,range:k(a.range)}))})}provideColorPresentations(t,i,r){let e=t.uri;return this._worker(e).then(a=>a.getColorPresentations(e.toString(),i.color,sn(i.range))).then(a=>{if(!!a)return a.map(o=>{let u={label:o.label};return o.textEdit&&(u.textEdit=Z(o.textEdit)),o.additionalTextEdits&&(u.additionalTextEdits=o.additionalTextEdits.map(Z)),u})})}},ue=class{constructor(t){this._worker=t}provideFoldingRanges(t,i,r){let e=t.uri;return this._worker(e).then(a=>a.getFoldingRanges(e.toString(),i)).then(a=>{if(!!a)return a.map(o=>{let u={start:o.startLine+1,end:o.endLine+1};return typeof o.kind!="undefined"&&(u.kind=mn(o.kind)),u})})}};function mn(n){switch(n){case S.Comment:return c.languages.FoldingRangeKind.Comment;case S.Imports:return c.languages.FoldingRangeKind.Imports;case S.Region:return c.languages.FoldingRangeKind.Region}}var ce=class{constructor(t){this._worker=t}provideSelectionRanges(t,i,r){let e=t.uri;return this._worker(e).then(a=>a.getSelectionRanges(e.toString(),i.map(w))).then(a=>{if(!!a)return a.map(o=>{let u=[];for(;o;)u.push({range:k(o.range)}),o=o.parent;return u})})}};function vn(n){let t=[],i=[],r=new B(n);t.push(r);let e=(...o)=>r.getLanguageServiceWorker(...o);function a(){let{languageId:o,modeConfiguration:u}=n;$e(i),u.completionItems&&i.push(c.languages.registerCompletionItemProvider(o,new ee(e))),u.hovers&&i.push(c.languages.registerHoverProvider(o,new ne(e))),u.documentHighlights&&i.push(c.languages.registerDocumentHighlightProvider(o,new te(e))),u.definitions&&i.push(c.languages.registerDefinitionProvider(o,new re(e))),u.references&&i.push(c.languages.registerReferenceProvider(o,new ie(e))),u.documentSymbols&&i.push(c.languages.registerDocumentSymbolProvider(o,new oe(e))),u.rename&&i.push(c.languages.registerRenameProvider(o,new ae(e))),u.colors&&i.push(c.languages.registerColorProvider(o,new se(e))),u.foldingRanges&&i.push(c.languages.registerFoldingRangeProvider(o,new ue(e))),u.diagnostics&&i.push(new Y(o,e,n)),u.selectionRanges&&i.push(c.languages.registerSelectionRangeProvider(o,new ce(e)))}return a(),t.push(Be(i)),Be(t)}function Be(n){return{dispose:()=>$e(n)}}function $e(n){for(;n.length;)n.pop().dispose()}return xn;})();
return moduleExports;
});

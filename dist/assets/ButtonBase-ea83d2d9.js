import{r as s,P as ze,m as A,t as ie,R as W,S as fe,w as x,j as $,o as ye,U as re,s as oe,p as Ee,n as Oe,v as de,x as Ae}from"./index-469ebc4a.js";const Xe=typeof window<"u"?s.useLayoutEffect:s.useEffect,Ye=Xe;function H(e){const t=s.useRef(e);return Ye(()=>{t.current=e}),s.useCallback((...r)=>(0,t.current)(...r),[])}let G=!0,te=!1,he;const We={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function He(e){const{type:t,tagName:r}=e;return!!(r==="INPUT"&&We[t]&&!e.readOnly||r==="TEXTAREA"&&!e.readOnly||e.isContentEditable)}function Ge(e){e.metaKey||e.altKey||e.ctrlKey||(G=!0)}function ee(){G=!1}function qe(){this.visibilityState==="hidden"&&te&&(G=!0)}function Je(e){e.addEventListener("keydown",Ge,!0),e.addEventListener("mousedown",ee,!0),e.addEventListener("pointerdown",ee,!0),e.addEventListener("touchstart",ee,!0),e.addEventListener("visibilitychange",qe,!0)}function Qe(e){const{target:t}=e;try{return t.matches(":focus-visible")}catch{}return G||He(t)}function Ze(){const e=s.useCallback(n=>{n!=null&&Je(n.ownerDocument)},[]),t=s.useRef(!1);function r(){return t.current?(te=!0,window.clearTimeout(he),he=window.setTimeout(()=>{te=!1},100),t.current=!1,!0):!1}function l(n){return Qe(n)?(t.current=!0,!0):!1}return{isFocusVisibleRef:t,onFocus:l,onBlur:r,ref:e}}function et(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function se(e,t){var r=function(i){return t&&s.isValidElement(i)?t(i):i},l=Object.create(null);return e&&s.Children.map(e,function(n){return n}).forEach(function(n){l[n.key]=r(n)}),l}function tt(e,t){e=e||{},t=t||{};function r(d){return d in t?t[d]:e[d]}var l=Object.create(null),n=[];for(var i in e)i in t?n.length&&(l[i]=n,n=[]):n.push(i);var o,c={};for(var u in t){if(l[u])for(o=0;o<l[u].length;o++){var p=l[u][o];c[l[u][o]]=r(p)}c[u]=r(u)}for(o=0;o<n.length;o++)c[n[o]]=r(n[o]);return c}function F(e,t,r){return r[t]!=null?r[t]:e.props[t]}function nt(e,t){return se(e.children,function(r){return s.cloneElement(r,{onExited:t.bind(null,r),in:!0,appear:F(r,"appear",e),enter:F(r,"enter",e),exit:F(r,"exit",e)})})}function it(e,t,r){var l=se(e.children),n=tt(t,l);return Object.keys(n).forEach(function(i){var o=n[i];if(s.isValidElement(o)){var c=i in t,u=i in l,p=t[i],d=s.isValidElement(p)&&!p.props.in;u&&(!c||d)?n[i]=s.cloneElement(o,{onExited:r.bind(null,o),in:!0,exit:F(o,"exit",e),enter:F(o,"enter",e)}):!u&&c&&!d?n[i]=s.cloneElement(o,{in:!1}):u&&c&&s.isValidElement(p)&&(n[i]=s.cloneElement(o,{onExited:r.bind(null,o),in:p.props.in,exit:F(o,"exit",e),enter:F(o,"enter",e)}))}}),n}var rt=Object.values||function(e){return Object.keys(e).map(function(t){return e[t]})},ot={component:"div",childFactory:function(t){return t}},ae=function(e){ze(t,e);function t(l,n){var i;i=e.call(this,l,n)||this;var o=i.handleExited.bind(et(i));return i.state={contextValue:{isMounting:!0},handleExited:o,firstRender:!0},i}var r=t.prototype;return r.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},r.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(n,i){var o=i.children,c=i.handleExited,u=i.firstRender;return{children:u?nt(n,c):it(n,o,c),firstRender:!1}},r.handleExited=function(n,i){var o=se(this.props.children);n.key in o||(n.props.onExited&&n.props.onExited(i),this.mounted&&this.setState(function(c){var u=A({},c.children);return delete u[n.key],{children:u}}))},r.render=function(){var n=this.props,i=n.component,o=n.childFactory,c=ie(n,["component","childFactory"]),u=this.state.contextValue,p=rt(this.state.children).map(o);return delete c.appear,delete c.enter,delete c.exit,i===null?W.createElement(fe.Provider,{value:u},p):W.createElement(fe.Provider,{value:u},W.createElement(i,c,p))},t}(W.Component);ae.propTypes={};ae.defaultProps=ot;const st=ae;function at(e){const{className:t,classes:r,pulsate:l=!1,rippleX:n,rippleY:i,rippleSize:o,in:c,onExited:u,timeout:p}=e,[d,g]=s.useState(!1),b=x(t,r.ripple,r.rippleVisible,l&&r.ripplePulsate),C={width:o,height:o,top:-(o/2)+i,left:-(o/2)+n},h=x(r.child,d&&r.childLeaving,l&&r.childPulsate);return!c&&!d&&g(!0),s.useEffect(()=>{if(!c&&u!=null){const R=setTimeout(u,p);return()=>{clearTimeout(R)}}},[u,c,p]),$.jsx("span",{className:b,style:C,children:$.jsx("span",{className:h})})}const lt=ye("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),m=lt,ut=["center","classes","className"];let q=e=>e,me,be,ge,Re;const ne=550,ct=80,pt=re(me||(me=q`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`)),ft=re(be||(be=q`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`)),dt=re(ge||(ge=q`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`)),ht=oe("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),mt=oe(at,{name:"MuiTouchRipple",slot:"Ripple"})(Re||(Re=q`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`),m.rippleVisible,pt,ne,({theme:e})=>e.transitions.easing.easeInOut,m.ripplePulsate,({theme:e})=>e.transitions.duration.shorter,m.child,m.childLeaving,ft,ne,({theme:e})=>e.transitions.easing.easeInOut,m.childPulsate,dt,({theme:e})=>e.transitions.easing.easeInOut),bt=s.forwardRef(function(t,r){const l=Ee({props:t,name:"MuiTouchRipple"}),{center:n=!1,classes:i={},className:o}=l,c=ie(l,ut),[u,p]=s.useState([]),d=s.useRef(0),g=s.useRef(null);s.useEffect(()=>{g.current&&(g.current(),g.current=null)},[u]);const b=s.useRef(!1),C=s.useRef(0),h=s.useRef(null),R=s.useRef(null);s.useEffect(()=>()=>{C.current&&clearTimeout(C.current)},[]);const j=s.useCallback(f=>{const{pulsate:y,rippleX:E,rippleY:D,rippleSize:U,cb:_}=f;p(T=>[...T,$.jsx(mt,{classes:{ripple:x(i.ripple,m.ripple),rippleVisible:x(i.rippleVisible,m.rippleVisible),ripplePulsate:x(i.ripplePulsate,m.ripplePulsate),child:x(i.child,m.child),childLeaving:x(i.childLeaving,m.childLeaving),childPulsate:x(i.childPulsate,m.childPulsate)},timeout:ne,pulsate:y,rippleX:E,rippleY:D,rippleSize:U},d.current)]),d.current+=1,g.current=_},[i]),N=s.useCallback((f={},y={},E=()=>{})=>{const{pulsate:D=!1,center:U=n||y.pulsate,fakeElement:_=!1}=y;if((f==null?void 0:f.type)==="mousedown"&&b.current){b.current=!1;return}(f==null?void 0:f.type)==="touchstart"&&(b.current=!0);const T=_?null:R.current,B=T?T.getBoundingClientRect():{width:0,height:0,left:0,top:0};let v,P,L;if(U||f===void 0||f.clientX===0&&f.clientY===0||!f.clientX&&!f.touches)v=Math.round(B.width/2),P=Math.round(B.height/2);else{const{clientX:S,clientY:w}=f.touches&&f.touches.length>0?f.touches[0]:f;v=Math.round(S-B.left),P=Math.round(w-B.top)}if(U)L=Math.sqrt((2*B.width**2+B.height**2)/3),L%2===0&&(L+=1);else{const S=Math.max(Math.abs((T?T.clientWidth:0)-v),v)*2+2,w=Math.max(Math.abs((T?T.clientHeight:0)-P),P)*2+2;L=Math.sqrt(S**2+w**2)}f!=null&&f.touches?h.current===null&&(h.current=()=>{j({pulsate:D,rippleX:v,rippleY:P,rippleSize:L,cb:E})},C.current=setTimeout(()=>{h.current&&(h.current(),h.current=null)},ct)):j({pulsate:D,rippleX:v,rippleY:P,rippleSize:L,cb:E})},[n,j]),K=s.useCallback(()=>{N({},{pulsate:!0})},[N]),I=s.useCallback((f,y)=>{if(clearTimeout(C.current),(f==null?void 0:f.type)==="touchend"&&h.current){h.current(),h.current=null,C.current=setTimeout(()=>{I(f,y)});return}h.current=null,p(E=>E.length>0?E.slice(1):E),g.current=y},[]);return s.useImperativeHandle(r,()=>({pulsate:K,start:N,stop:I}),[K,N,I]),$.jsx(ht,A({className:x(m.root,i.root,o),ref:R},c,{children:$.jsx(st,{component:null,exit:!0,children:u})}))}),gt=bt;function Rt(e){return Oe("MuiButtonBase",e)}const yt=ye("MuiButtonBase",["root","disabled","focusVisible"]),Et=yt,Tt=["action","centerRipple","children","className","component","disabled","disableRipple","disableTouchRipple","focusRipple","focusVisibleClassName","LinkComponent","onBlur","onClick","onContextMenu","onDragLeave","onFocus","onFocusVisible","onKeyDown","onKeyUp","onMouseDown","onMouseLeave","onMouseUp","onTouchEnd","onTouchMove","onTouchStart","tabIndex","TouchRippleProps","touchRippleRef","type"],Mt=e=>{const{disabled:t,focusVisible:r,focusVisibleClassName:l,classes:n}=e,o=Ae({root:["root",t&&"disabled",r&&"focusVisible"]},Rt,n);return r&&l&&(o.root+=` ${l}`),o},xt=oe("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:(e,t)=>t.root})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${Et.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),Ct=s.forwardRef(function(t,r){const l=Ee({props:t,name:"MuiButtonBase"}),{action:n,centerRipple:i=!1,children:o,className:c,component:u="button",disabled:p=!1,disableRipple:d=!1,disableTouchRipple:g=!1,focusRipple:b=!1,LinkComponent:C="a",onBlur:h,onClick:R,onContextMenu:j,onDragLeave:N,onFocus:K,onFocusVisible:I,onKeyDown:f,onKeyUp:y,onMouseDown:E,onMouseLeave:D,onMouseUp:U,onTouchEnd:_,onTouchMove:T,onTouchStart:B,tabIndex:v=0,TouchRippleProps:P,touchRippleRef:L,type:S}=l,w=ie(l,Tt),z=s.useRef(null),M=s.useRef(null),Te=de(M,L),{isFocusVisibleRef:le,onFocus:Me,onBlur:xe,ref:Ce}=Ze(),[k,X]=s.useState(!1);p&&k&&X(!1),s.useImperativeHandle(n,()=>({focusVisible:()=>{X(!0),z.current.focus()}}),[]);const[J,ve]=s.useState(!1);s.useEffect(()=>{ve(!0)},[]);const we=J&&!d&&!p;s.useEffect(()=>{k&&b&&!d&&J&&M.current.pulsate()},[d,b,k,J]);function V(a,ce,_e=g){return H(pe=>(ce&&ce(pe),!_e&&M.current&&M.current[a](pe),!0))}const Ve=V("start",E),Be=V("stop",j),Pe=V("stop",N),Le=V("stop",U),De=V("stop",a=>{k&&a.preventDefault(),D&&D(a)}),Se=V("start",B),ke=V("stop",_),Fe=V("stop",T),$e=V("stop",a=>{xe(a),le.current===!1&&X(!1),h&&h(a)},!1),Ne=H(a=>{z.current||(z.current=a.currentTarget),Me(a),le.current===!0&&(X(!0),I&&I(a)),K&&K(a)}),Q=()=>{const a=z.current;return u&&u!=="button"&&!(a.tagName==="A"&&a.href)},Z=s.useRef(!1),Ie=H(a=>{b&&!Z.current&&k&&M.current&&a.key===" "&&(Z.current=!0,M.current.stop(a,()=>{M.current.start(a)})),a.target===a.currentTarget&&Q()&&a.key===" "&&a.preventDefault(),f&&f(a),a.target===a.currentTarget&&Q()&&a.key==="Enter"&&!p&&(a.preventDefault(),R&&R(a))}),Ue=H(a=>{b&&a.key===" "&&M.current&&k&&!a.defaultPrevented&&(Z.current=!1,M.current.stop(a,()=>{M.current.pulsate(a)})),y&&y(a),R&&a.target===a.currentTarget&&Q()&&a.key===" "&&!a.defaultPrevented&&R(a)});let Y=u;Y==="button"&&(w.href||w.to)&&(Y=C);const O={};Y==="button"?(O.type=S===void 0?"button":S,O.disabled=p):(!w.href&&!w.to&&(O.role="button"),p&&(O["aria-disabled"]=p));const je=de(r,Ce,z),ue=A({},l,{centerRipple:i,component:u,disabled:p,disableRipple:d,disableTouchRipple:g,focusRipple:b,tabIndex:v,focusVisible:k}),Ke=Mt(ue);return $.jsxs(xt,A({as:Y,className:x(Ke.root,c),ownerState:ue,onBlur:$e,onClick:R,onContextMenu:Be,onFocus:Ne,onKeyDown:Ie,onKeyUp:Ue,onMouseDown:Ve,onMouseLeave:De,onMouseUp:Le,onDragLeave:Pe,onTouchEnd:ke,onTouchMove:Fe,onTouchStart:Se,ref:je,tabIndex:p?-1:v,type:S},O,w,{children:[o,we?$.jsx(gt,A({ref:Te,center:i},P)):null]}))}),Vt=Ct;export{Vt as B,st as T,et as _,H as a,Ze as b,Ye as u};

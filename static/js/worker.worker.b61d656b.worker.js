!function(){"use strict";function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(t){var o=function(t,o){if("object"!==e(t)||null===t)return t;var l=t[Symbol.toPrimitive];if(void 0!==l){var n=l.call(t,o||"default");if("object"!==e(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===o?String:Number)(t)}(t,"string");return"symbol"===e(o)?o:String(o)}function o(e,o){for(var l=0;l<o.length;l++){var n=o[l];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,t(n.key),n)}}function l(e,t,l){return t&&o(e.prototype,t),l&&o(e,l),Object.defineProperty(e,"prototype",{writable:!1}),e}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function r(e,t){return r=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},r(e,t)}function c(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&r(e,t)}function i(e){return i=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},i(e)}function a(t){var o=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var l,n=i(t);if(o){var r=i(this).constructor;l=Reflect.construct(n,arguments,r)}else l=n.apply(this,arguments);return function(t,o){if(o&&("object"===e(o)||"function"===typeof o))return o;if(void 0!==o)throw new TypeError("Derived constructors may only return object or undefined");return s(t)}(this,l)}}var w=l((function e(t,o){var l=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];n(this,e),this.isAlive=!0,this.colour=t,this.cell=o,this.moves=l}));w.WHITE=-1,w.BLACK=1;var u=w,h=l((function e(t,o){n(this,e),this.row=t,this.col=o}));function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,l=new Array(t);o<t;o++)l[o]=e[o];return l}function d(e,t){var o="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!o){if(Array.isArray(e)||(o=function(e,t){if(e){if("string"===typeof e)return f(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?f(e,t):void 0}}(e))||t&&e&&"number"===typeof e.length){o&&(e=o);var l=0,n=function(){};return{s:n,n:function(){return l>=e.length?{done:!0}:{done:!1,value:e[l++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,r=!0,c=!1;return{s:function(){o=o.call(e)},n:function(){var e=o.next();return r=e.done,e},e:function(e){c=!0,s=e},f:function(){try{r||null==o.return||o.return()}finally{if(c)throw s}}}}function C(e,t){if(!Object.prototype.hasOwnProperty.call(e,t))throw new TypeError("attempted to use private field on non-instance");return e}var p=0;function g(e){return"__private_"+p+++"_"+e}var v=g("directions"),A=function(e){c(o,e);var t=a(o);function o(e,l,r){var c;return n(this,o),c=t.call(this,e,l,r),Object.defineProperty(s(c),v,{writable:!0,value:[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]]}),c.points=9,c.getMoves=function(e){var t,o=[],l=d(C(s(c),v)[v]);try{for(l.s();!(t=l.n()).done;)for(var n=t.value,r=c.cell.row,i=c.cell.col,a=n[0],w=n[1],u=a+r,f=w+i;e.canMove(u,f)||e.canEat(u,f,c.colour);){var p=new E(c.cell,new h(u,f),s(c));if(e.willCheck(s(c),p)||o.push(p),e.canEat(u,f,c.colour))break;u+=a,f+=w}}catch(g){l.e(g)}finally{l.f()}return o},c.getAttack=function(e){var t,o=[],l=d(C(s(c),v)[v]);try{for(l.s();!(t=l.n()).done;)for(var n=t.value,r=c.cell.row,i=c.cell.col,a=n[0],w=n[1],u=a+r,f=w+i;(e.canMove(u,f)||e.canEatDefend(u,f))&&(o.push(new E(c.cell,new h(u,f),s(c))),!e.canEatDefend(u,f));)u+=a,f+=w}catch(p){l.e(p)}finally{l.f()}return o},c.movePiece=function(e,t){var o=t.getBoard(),l=e.newCell.row,n=e.newCell.col,r=o[l][n];return null!==r&&(e.ate=r),o[l][n]=s(c),o[e.oldCell.row][e.oldCell.col]=null,c.cell=new h(l,n),c.moves.push(e),{row:l,col:n}},c.getString=function(){return(c.colour===u.WHITE?"w":"b")+"q"},e===u.WHITE?c.image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABOUExURUxpcUBAQENDQ0REREREREVFRUREREVFRUVFRUVFRf////j4+PHx8ejo6N7e3tPT08nJyby8vK+vr6CgoJGRkYKCgnBwcGBgYFFRUUZGRknouq0AAAAKdFJOUwAVMlVylLzf7PdB/fgsAAAHtUlEQVR42u1c27akKAxt71qAeBf+/0dngZaSQNVRwbN6ZsxL9+qiZJuE7Gyg+s+fxx577LHHHnvssceiACPCWpzlpZSyyNNPM0dpXkgpyzyLfwtUoiZcrcpcwKJsHyHz5Fdil0tgpT1rWsEh2f3RjBdXjX3bdsO8zIqGLK6ah67t+kn/vbgbV6xySnT09SLKmsnGpb051usI1v8Crkj5amKvdU5CiJ41NSOocLfGCK58mt8KS8VnJMachHUq8XdnxApVbY4gzYyQB3eWyhmAilDegzCqEDZgBKkbIWUZ3essDucknKv8igxnDWgE08hvdFcp5YTmJJy3xqQKOEUjaq7Sq7hvGUopWzQn5XrSd0oXUo5ohII1GA4NX97drlCTVnvyuYArhyY3ppZwzKlTJ9r8yR3A+Z3JlUk5u+ZUNSLeYDE4gqkRXPwqrGXODnirflnuvNdbqoC75oRBbF6WO3lzZ26plOf2nKpwvZd/JWXvGNFvYb6pyPewZmlXiL3M54oGcJA18PK+cppLKagVw8GIkHJohwfo+pDd2JcqasGw1JyFSQSCoRBqerqzeVZ9TQtDpPuDBCyLiYIga3fe2tmolbYHSddv3E2pFmKuTVijvLeBWJ0hJ757Q+DeU3eK8x7kTnfWQatD5O5tpJzbd+5MFgnHWwJSzvul3U9CichV6BV5gr6faFnTv+ftrEnTrbrRJYCyjA8++0dQ2a6pytQhAvttqQmHxJi3II+2HjOfXZ3SakkJdF6B3nZPe6YnrqIPNVd/Wnx9dnk86wyht0jBKvkAi9hRVDGst08HXN5T/OzDFL6utrcUtFZSZBQvpqOYu2NIaqND3Auy8ezp+CrV3+z2lp2p/KhiCKshIH2gIOt3WIqjcd3rDTkwoGd/V6hAUuEqHZuwmI5i6ozhqnkixBJApPTymPpI0fuod56Aq2Ozv6FAYeiJJwIxR1+eTerxWBgL3YKCb+rWJQewauPTEelEs4PoAEkXi/oF/W0jjhCmQ3RxJKhU8jFjaqwT8Wfxd0F3SKwpP8MXomvTmwJdZjoT6sTJfCMASyknYsE6JNYyLZwtGTEbtVwjd78vjCEhsInPrWfrlxYHesTcksX12sjlBiwBBuxRzKAjSY1hDRgWg6/8BdaANxl+gMX2LYZS7TOBVzKjX1jPfjch+QFYk0N0mW+UQRmxFrZ4zboWIjZ1q44EgsWPeUsLegsWSHkLFmtWCZFBCYJhZcjNi7OaI7xoaUH67sbNBTWhV16VIo4hoSCfLWfq5XRIQ0YVejRdlWABVgXK2+XR9rQERqiEfqb1mh/lsa6mQX4egZ9tWHSJoiNIEFYGBEq9Ce4DGlKVnplBd01AR9iwSK1ks3L04PggB13ACAV3K1Ab+c1dCJfuufLIWOdodqrfGfsZwVp2zylQtgrVwUZQKT3RgBxoTDVYoJ0IHaylBcYx1A1C/hlVL44rW/19ObXMrNYGrtIBiy2nKIP171szr8+KZmpWnUWt5UdVxvu0aaYGwYgtNRHvLdbpb/DPsHIzN+pldZ9CpfJr0UwtceFywqqFxFVWu+WtMQAqtpZCKatze4RRpnSTWTXrbsUV2dVJ2SgdsdXNerWuI1Gb7K8CWF440stQUPTpjkyhwtitBT0r6NUxKrbut17aTY1wCq+4YjcsKhwxXHJO63DBQU8yHSxXP+79vc8GM1dq6yj2H2BpOdwAIvTYH0ys3F5wuaNFGue/tus3Wsj9o8f+YGGtLbqsH8mIy13ECdZa0+vxweX9wdTOohUXdSFwYl3Kf+c4jrm8E2c1OeqpeseKHLZaosLBjzcz32oEc+ASx2ExtJ5ZgA3x2FUi6XQGFoGo6LbJ67PHm7s8Q6f5BCwxWuquEZ4b4omTaOh4AtZIrcOWwfv0oLTkhJfxd8J7nlxnH2rnNau340fPw8XI1dtdNbqdAFW+hxoWMXqHMMhxWeJs+jxCGCDh3cR40d5HniLIcVnqbq+uJpYfHX4nRo8QetLhd2K8HsJg58OxWztcC6E3Hf5AjBdRNSLY+bCbGC8lFrgFEOLaVhhUQS9y+RIj21B1Ie/aeBLjllhh6DAQMRqomrC3R3yI0UAViA6DEGNtwBKBb49cJ0YTVR/8nsZVYjRRBaNDX2KkANUN16UuEaOZ7UHp0H2P4BqqRtxwXeo8MTKIKigdXiZGmFah6fAqMWJXBaZD17WsK64KTYcXiNEFKjQdniZGJ6jwdHiKGClzgwpPh67bdSsE3jRt23W9skHZOOo/hr7vu65tmhvpEBEj4203jNMs5BET8zyNQ981N94ejgrpY/kd6zBK8y8uMU18dOTpm5M/H5iZv1ZbAtM2vGZU/erHNqpyv2m7XsXb+GaVhgS23X6cp4HT11mjfJjE+ZuTR3hHyrmvXz5W9+4f6HmhmpqXvy23MrNg5UrfrAxgyw/0QsQxrtT1A/z410HSViPBN9tAt9Tz9U7mC/947LQtz+iChFEJ/dEbkYktSIeTBj0veB98JgFiOJGwNgeIYhVgh9K+GuHb1MeBtr+tOwj+LWkdGBb3b1TTUwfTx4+vE29YIjQs+nfCIv6KMQt1EPUvgCUeWA+s5XZ0H9qCpPwt9t+ElRb32K/8by2PPfbYY4899tj/y/4BGYsA2gPdkaEAAAAASUVORK5CYII=":c.image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAzUExURUxpcSYmJiUlJSUlJSUlJSUlJSUlJSUlJS4uLXd0dGZjY1ZTUk5MS0VCQjw6OiYmJh8fH+/JGhMAAAAJdFJOUwAWOFp1lLzg/a0PANwAAAbDSURBVHja7ZvrlqsqDIC3ipqRW9//ac8CvJAQW6ph1l77mPk3pfCZxFyA/vnzyCOPPPLII4888kgnMEJW+nEC7/08DWcrd2qavfcwqf63oIaw4CowcmDdeIzw06+AdZNHAkMxRAEeMra3Zp9U5YzWxqXlRzIkqQqyEXNrri5S6Z+fn0VrrY1/FVxRm27ZRrjXL3AFKrdBBYHXy/vcjmrj3kbYgD41pRopVdIGHMroA9WCRkQu1dKEwWcQlTY2cI3IhIhKa2tfr5y8ibLImsZGZXSZsmxmwYTl2qprTibUGCtfNICTEdpG8rldcEjOvBAs6w+XnqOyFooFmULlwzuvirAoHM6nyYgAHhTaLNir6PCFsuKi3a7PpVRWdHrV0OOBUVaBVY5oj7WUa77DMu2xQgCn0SH6lt+wgm8tzIiANbR0eUZZAWt7/cF7s5Qj3OvVzuWDLgyniiPMT95DSZW9qy0kZBbGhtnbHxRqC+6grLFhXRoyNefwMyoxDFWWbxm21kWpMjyqbMJrAURZofhpWtnEssWi+E2rqWmtTHMjty0gtiJvXTUuG6pAVHvG+hWyFOBpodiiFVwLdXuehPvdAU2IHa8TqmvqWxu9shUcYtfg8qpmKBS6GzHW1HNfOfdHqKzRA8V85vZXrXj3j9BlkjJJP9aN8KHNPA0EuNGjT3u4fVoY+XN3QKdPZ7ajO5v7k1+jRm84wdKlFVUWuJjw/mnuD1R7oxcTMfpul2GZaMWJteGK5WlAzppIqOfqSaMXuXI7ESz8LvZ5Iki6pHObrMJ14R99bSRfsm8a6zyKmD3OL66I8uTDDs+dt7bahLnnShMaVLGngmrgsQzqMOLCQJrI7s3cmsz9TllAvklWRlgaW7EnSRP3FuXcoeeu2Qoom66U+bKHHhCWKfpEc4bFN3TgK5o1VTRdMbP5rC0ecNVF+0TQZ1iKaegMkyf4NsLRXj1hjfns+HlRi2Hx9kO25lTMnSKM/1wjTrEtLrAgcwCCpTMrjvQjimUZLF+LVfYu77Ci186MDVks3NsW79M5lmMaPcieaCRrm72apzZMWOp07n0LY6zwLWCwcpenWMfi1IbaIKxi7uQhNbtMQznzGiD6U6zdioA6kO2T8XRubWu3TTpfmCgpa2aTcRaqe9KNlVjU9fYWpSL7jKV/xFUVcj9d2mosbUixRtqgrMqq6CG7rIc4KvK8jyixdFRnB/wHE+o+XLkNUNUWjSdcU5dtVZLVYyFQ6JlgZT0R6rcr93Kmo7XBXOdYOljRFzZMXjeVVLmuajvbdFIBlua97fuMrdY6k8Hdd3PiWRHut1MLOdV2GdtpE1CukZby2Ip4P2fHnWm3vYar1+srqr1JzVePoStxcVjRiWjcWLGgoDJpC+BVdnsfG0Ugy+xcHYsVrej4f2/PiXZywt7FfOFIbyRGSVzqBCs2C0azxuWo3NXd1I4+fvIf1bPra8PZMNF2mMqsyrq4izMV6THZkcfSwNgwYWEqfXN/sC9TnFtbdA7Lsv/dvkE26+DG/uBc2GXj4gA0Z8P0huJ3et0Qv7w/qEqANWzqarGUymw2vLwTx+XexPUllrtWzNTGiJ2rHsuQ99neig7MPkf2yn2H5crO4Obx4sRpxgDUY2n8XPa2w5eHEsf7+AWW06yy7p0ezHzsvijGCjj8mdNfFyvh8GxilFHW7UON6atwUEMlclzW82XMdRMKOLyo01srEx1OE+MdE9btsl1LjHeUJXWvRSZGWCsWHd4lxosmFLxtM913+p3Kyp0PD/djhLWi0WHv7kGGSvQi112nP6hEr73dTIwGKUvwjP9WYsyorOztkTtOn1OB8O2R64kxp7LSt0cuJ0ZE5cTvaVx0ekTV4JrntRiBqRpcl7qUGDFVk8unFxIjobItrkt9HyMIlHh0uJQYqapa3Wv+zulLqka3wL+JESWUdDq8kBg5KOl0+LXT81CNHL4yMZoTqDbRgU+MxqwUbhMAF/5WaZoOqdOH+4AOgPzw6VQAImbDXz10s78jTX6C1KnpnUZyOR03SZsxv/0YMJwNTrYs4frZiSzx3ryxLucEJamy/WYlOPsO5RRxu57o/TyI5p1wSHkBCLElNCVJ5e4xrWTgvRcK9vtP6CTEfHPT9FNd6hfizFE+paFFrwPzL2tyW/RWht5xrvfWG58WMWOXfpF4BwjD/TgJdSm5DfDszGwQsCHIYmkQsKLkKcZxfD0LvIdWGMv62/3iIHoUdThXfx9L67/O51UDLP3PYo3y8SFiqQfrwfprsbyTFhmsFvJvYqm5jTT7kfUjjzzyyCOPPPL/lf8AtuykcwsccVwAAAAASUVORK5CYII=",c}return l(o)}(u),m=l((function e(t,o,l){var s=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{isCastle:!1},c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null,i=arguments.length>6&&void 0!==arguments[6]&&arguments[6];n(this,e),this.oldCell=t,this.newCell=o,this.piece=l,this.isEnPassant=s,this.castle=r,this.ate=c,this.isPromotion=i}));m.getMoveString=function(e){return{oldCellRow:e.oldCell.row,oldCellCol:e.oldCell.col,newCellRow:e.newCell.row,newCellCol:e.newCell.col,pieceString:e.piece.getString(),isEnPassant:e.isEnPassant,castle:!1===e.castle.isCastle?{isCastle:!1}:{isCastle:!0,rook:{pieceString:e.castle.rook.piece.getString(),oldCellRow:e.castle.rook.oldCell.row,oldCellCol:e.castle.rook.oldCell.col,newCellRow:e.castle.rook.newCell.row,newCellCol:e.castle.rook.newCell.col}},ate:null!==e.ate?e.ate.getString():null,isPromotion:e.isPromotion}},m.parseMove=function(e,t){var o=new m(new h(t.oldCellRow,t.oldCellCol),new h(t.newCellRow,t.newCellCol),e.board.getPiece(t.oldCellRow,t.oldCellCol),t.isEnPassant,{isCastle:!1},e.board.getPiece(t.newCellRow,t.newCellCol),t.isPromotion);if(t.isPromotion&&e.board.promotePiece(new A(e.board.getPiece(t.oldCellRow,t.oldCellCol).colour,e.board.getPiece(t.oldCellRow,t.oldCellCol).cell)),t.castle.isCastle){var l=t.castle.rook;o.castle.isCastle=!0,o.castle.rook=new m(new h(l.oldCellRow,l.oldCellCol),new h(l.newCellRow,l.newCellCol),e.board.getPiece(l.oldCellRow,l.oldCellCol))}return o};var E=m;let b=0,S=new Map,y=!1;self.addEventListener("message",(async e=>{S=new Map;const t=(e,t,o,l)=>{b++;const s=new c;s.setBoardString(e);const r=performance.now();s.moves=o.map((e=>a.parseMove(s,e))),y=s.isEndGame(),y&&(console.log("endgame"),s.setEndGame()),s.updatePieceValues(),console.log(s.board);const i=n(s,t,-Number.MAX_VALUE,Number.MAX_VALUE,!0,l,l,t),w=performance.now();return console.log(w-r,b),console.log("Score",i[1]),i[0]},o=(e,t)=>e.getScore(t),l=e=>e===w.BLACK?w.WHITE:w.BLACK,n=(e,t,c,i,a,w,u,h)=>{if(0===t){let t;if(w===u)t=r(c,i,e,u,2);else{const l=e.getBoardHash()+w.toString();S.has(l)?t=S.get(l):(t=o(e,w),S.set(l,t))}return[null,t]}const f=e.isGameOver(u);if(f.isGameOver&&u===w)return[null,-Number.MAX_VALUE];if(f.isGameOver&&u!==w)return[null,Number.MAX_VALUE];const d=f.allMoves;d.sort(s);const C=Math.floor(Math.random()*(d.length-1));let p=d.length>0?d[C]:null;if(a){let o=-Number.MAX_VALUE;for(const s of d){e.movePiece(s.piece,s);const r=n(e,t-1,c,i,!1,w,l(u),h)[1];if(e.undoMove(),r>o&&(o=r,p=s),i<=(c=Math.max(c,r)))break}return[p,o]}{let o=Number.MAX_VALUE;for(const s of d){e.movePiece(s.piece,s);const r=n(e,t-1,c,i,!0,w,l(u),h)[1];if(e.undoMove(),r<o&&(o=r,p=s),(i=Math.min(i,r))<=c)break}return[p,o]}},s=(e,t)=>{if(null!==e.ate&&null!==t.ate){return e.piece.points-e.ate.points<t.piece.points-t.ate.points?1:-1}return null!==e.ate?-1:null!==t.ate?1:0},r=(e,t,n,c,i)=>{let a;const w=n.getBoardHash()+c.toString();if(S.has(w)?a=S.get(w):(a=o(n,c),S.set(w,a)),0===i)return a;if(a>=t)return t;e=Math.max(e,a);const u=n.getAllMoves(c);u.sort(s);for(const o of u)if(null!==o.ate&&o.ate.points>o.piece.points){n.movePiece(o.piece,o);let s=-r(-t,-e,n,l(c),i-1);if(n.undoMove(),s>=t)return t;s>e&&(e=s)}return e};class c{board;constructor(){this.board=this.newBoard(),this.moves=[]}newBoard=()=>[[new p(w.BLACK,new i(0,0)),new f(w.BLACK,new i(0,1)),new u(w.BLACK,new i(0,2)),new C(w.BLACK,new i(0,3)),new h(w.BLACK,new i(0,4)),new u(w.BLACK,new i(0,5)),new f(w.BLACK,new i(0,6)),new p(w.BLACK,new i(0,7))],[new d(w.BLACK,new i(1,0)),new d(w.BLACK,new i(1,1)),new d(w.BLACK,new i(1,2)),new d(w.BLACK,new i(1,3)),new d(w.BLACK,new i(1,4)),new d(w.BLACK,new i(1,5)),new d(w.BLACK,new i(1,6)),new d(w.BLACK,new i(1,7))],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[new d(w.WHITE,new i(6,0)),new d(w.WHITE,new i(6,1)),new d(w.WHITE,new i(6,2)),new d(w.WHITE,new i(6,3)),new d(w.WHITE,new i(6,4)),new d(w.WHITE,new i(6,5)),new d(w.WHITE,new i(6,6)),new d(w.WHITE,new i(6,7))],[new p(w.WHITE,new i(7,0)),new f(w.WHITE,new i(7,1)),new u(w.WHITE,new i(7,2)),new C(w.WHITE,new i(7,3)),new h(w.WHITE,new i(7,4)),new u(w.WHITE,new i(7,5)),new f(w.WHITE,new i(7,6)),new p(w.WHITE,new i(7,7))]];setEndGame=()=>{for(let e=0;e<8;e++)for(let t=0;t<8;t++){const o=this.getPiece(e,t);null!==o&&void 0!==o.constructor.whiteScoreEnd&&(o.colour===w.WHITE?o.constructor.whiteScore=o.constructor.whiteScoreEnd:o.constructor.blackScore=o.constructor.blackScoreEnd)}};updatePieceValues=()=>{let e=0,t=0;for(let o=0;o<8;o++)for(let l=0;l<8;l++){const n=this.getPiece(o,l);null!==n&&n instanceof d&&(n.colour===w.WHITE?e++:t++)}for(let o=0;o<8;o++)for(let l=0;l<8;l++){const n=this.getPiece(o,l);if(null!==n&&(n instanceof f&&(n.points-=3*(16-e-t)),n instanceof u&&(n.points+=3*(16-e-t)),n instanceof p&&(n.points+=3*(16-e-t)),n instanceof d)){let e=!0;if(l+1<8)for(let o=0;o<8;o++)this.getPiece(o,l+1)instanceof d&&(e=!1);if(l-1>=0)for(let o=0;o<8;o++)this.getPiece(o,l-1)instanceof d&&(e=!1);e&&(n.points+=30);let t=!1;for(let l=0;l<8;l++)n instanceof d&&l!==o&&(t=!0);t&&(n.points-=10)}}};isEndGame=()=>{let e=0,t=0,o=0,l=0;for(let n=0;n<8;n++)for(let s=0;s<8;s++){const r=this.getPiece(n,s);r instanceof C&&(r.colour===w.WHITE?o++:l++),(r instanceof p||r instanceof u||r instanceof f)&&(r.colour===w.WHITE?e++:t++)}return o<=1&&e<=0||l<=1&&t<=0||e<=2&&o<=0||t<=2&&l<=0};setBoardString=e=>{const t=[];for(let o=0;o<8;o++){const l=[];for(let t=0;t<8;t++){const n=e[o][t];if(null===n)l.push(null);else{const e="w"===n.slice(0,1)?w.WHITE:w.BLACK,s=n.slice(1,2);"b"===s?l.push(new u(e,new i(o,t))):"k"===s?l.push(new h(e,new i(o,t))):"n"===s?l.push(new f(e,new i(o,t))):"p"===s?l.push(new d(e,new i(o,t))):"q"===s?l.push(new C(e,new i(o,t))):"r"===s?l.push(new p(e,new i(o,t))):l.push(null)}}t.push(l)}this.board=t};getBoardHash=()=>{let e="";for(let t=0;t<8;t++)for(let o=0;o<8;o++)this.isEmpty(t,o)?e+=" ":e+=this.getPiece(t,o).getString();return e};clonePiece=e=>e instanceof d?new d(e.colour,new i(e.cell.row,e.cell.col)):e instanceof u?new u(e.colour,new i(e.cell.row,e.cell.col)):e instanceof h?new h(e.colour,new i(e.cell.row,e.cell.col)):e instanceof f?new f(e.colour,new i(e.cell.row,e.cell.col)):e instanceof C?new C(e.colour,new i(e.cell.row,e.cell.col)):e instanceof p?new p(e.colour,new i(e.cell.row,e.cell.col)):null;getBoard=()=>this.board;getPiece=(e,t)=>this.board[e][t];isEmpty=(e,t)=>!this.isOutSide(e,t)&&null===this.board[e][t];isUnderCheck=e=>!1;isOutSide=(e,t)=>e<0||t<0||e>7||t>7;canEat=(e,t,o)=>!this.isOutSide(e,t)&&!this.isEmpty(e,t)&&this.getPiece(e,t).colour!==o;canEatDefend=(e,t)=>!this.isOutSide(e,t)&&!this.isEmpty(e,t);canMove=(e,t)=>!this.isOutSide(e,t)&&this.isEmpty(e,t);canKingMove=(e,t,o)=>{const l=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];for(const n of l){const l=e+n[0],s=t+n[1];if(!this.isOutSide(l,s)&&!this.isEmpty(l,s)&&this.getPiece(l,s).name===w.KING&&this.getPiece(l,s).colour!==o)return!1}return!0};getAttackingSquares=e=>{const t=[];for(let o=0;o<8;o++)for(let l=0;l<8;l++)if(!this.isEmpty(o,l)){const n=this.getPiece(o,l);if(n.colour!==e&&n.name!==w.KING){const e=n.getAttack(this);t.push.apply(t,e)}}return[t,[]]};movePiece=(e,t)=>{const o=this.board[t.oldCell.row][t.oldCell.col].movePiece(t,this);return this.moves.push(t),o};undoMove=()=>{if(this.moves.length>0){const e=this.moves.pop(),t=e.oldCell.row,o=e.oldCell.col,l=this.board[e.newCell.row][e.newCell.col];return this.board[t][o]=l,l.moves.pop(),l.cell.row=t,l.cell.col=o,e.isEnPassant?(this.board[e.ate.cell.row][e.ate.cell.col]=e.ate,this.board[e.newCell.row][e.newCell.col]=null,!0):(e.isPromotion?this.board[t][o]=new d(l.colour,l.cell,l.moves):e.castle.isCastle&&(this.board[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=e.castle.rook.piece,e.castle.rook.piece.cell.row=e.castle.rook.oldCell.row,e.castle.rook.piece.cell.col=e.castle.rook.oldCell.col,this.board[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=null),this.board[e.newCell.row][e.newCell.col]=e.ate,!0)}return!1};kingHasMoved=e=>{for(const t of this.moves)if(t.piece.name===w.KING&&t.piece.colour===e)return!0;return!1};rookHasMoved=(e,t)=>{const o=e===w.BLACK?0:7,l=t===h.KING_SIDE?7:0;if(null===this.getPiece(o,l)||this.getPiece(o,l).name!==w.ROOK)return!0;for(const n of this.moves)if(n.piece.name===w.ROOK&&n.piece.colour===e&&n.oldCell.row===o&&n.oldCell.col===l)return!0;return!1};castlingSquaresIsEmpty=(e,t)=>{const o=e===w.BLACK?0:7,l=t===h.KING_SIDE?[5,6]:[1,2,3];for(const n of l)if(!this.isEmpty(o,n))return!1;return!0};castlingSquaresUnderAttack=(e,t,o)=>{const l=e===w.BLACK?0:7,n=t===h.KING_SIDE?[4,5,6]:[1,2,3,4];for(const s of n)for(const e of o)if(e.newCell.row===l&&e.newCell.col===s)return!0;return!1};canCastle=(e,t,o)=>this.castlingSquaresIsEmpty(e,t)&&!this.castlingSquaresUnderAttack(e,t,o)&&!this.rookHasMoved(e,t)&&!this.kingHasMoved(e);promotePiece=e=>{const t=e.cell.row,o=e.cell.col;this.board[t][o]=e};isCheck=(e,t=null)=>{const o=null===t?this.getAttackingSquares(e)[0]:t;for(const l of o){const t=this.getPiece(l.newCell.row,l.newCell.col);if(null!==t&&t.name===w.KING&&t.colour===e)return!0}return!1};willCheck=(e,t)=>(this.movePiece(e,t),this.isCheck(e.colour)?(this.undoMove(),!0):(this.undoMove(),!1));getAllMoves=e=>{let t=[];for(let o=0;o<8;o++)for(let l=0;l<8;l++){null!==this.board[o][l]&&this.getPiece(o,l).colour===e&&(t=t.concat(this.getPiece(o,l).getMoves(this)))}return t};isRepeatPosition=e=>{const t=e;if(this.moves.length>=t){const e=this.moves.slice(-t);let o=e[0],l=e[1];for(let n=2;n<t;n+=4){const t=e[n],s=e[n+1];if(t.newCell.row!==o.oldCell.row||t.newCell.col!==o.oldCell.col||o.piece!==t.piece)return!1;if(s.newCell.row!==l.oldCell.row||s.newCell.col!==l.oldCell.col||l.piece!==s.piece)return!1}return!0}return!1};isGameOver=e=>{const t=this.getAllMoves(e),o=e===w.BLACK?"White":"Black";return t.length<=0?{isGameOver:!0,message:o+" wins by checkmate",allMoves:t}:{isGameOver:!1,message:"",allMoves:t}};getAllMoves=e=>{let t=[];for(let o=0;o<8;o++)for(let l=0;l<8;l++)if(!this.isEmpty(o,l)&&this.getPiece(o,l).colour===e){const e=this.getPiece(o,l).getMoves(this);t=t.concat(e)}return t};scanSquaresScore=e=>{let t=0,o=0;for(let l=0;l<8;l++)for(let e=0;e<8;e++){const n=this.getPiece(l,e);null!==n&&(n.colour===w.WHITE?o+=n.points:o-=n.points,n.colour===w.WHITE?t+=n.constructor.whiteScore[l][e]:t-=n.constructor.blackScore[l][e])}return t+o};getScore=e=>{e===w.WHITE?w.BLACK:w.WHITE;return this.scanSquaresScore(e)*e*-1};getBoardString=()=>{const e=[];for(let t=0;t<8;t++){const o=[];for(let e=0;e<8;e++){const l=this.getPiece(t,e);null!==l?o.push(l.getString()):o.push(null)}e.push(o)}return e}}class i{constructor(e,t){this.row=e,this.col=t}}class a{oldCell;newCell;constructor(e,t,o,l=!1,n={isCastle:!1},s=null,r=!1){this.oldCell=e,this.newCell=t,this.piece=o,this.isEnPassant=l,this.castle=n,this.ate=s,this.isPromotion=r}getMoveString=()=>({oldCellRow:this.oldCell.row,oldCellCol:this.oldCell.col,newCellRow:this.newCell.row,newCellCol:this.newCell.col,pieceString:this.piece.getString(),isEnPassant:this.isEnPassant,castle:!1===this.castle.isCastle?{isCastle:!1}:{isCastle:!0,rook:{pieceString:this.castle.rook.piece.getString(),oldCellRow:this.castle.rook.oldCell.row,oldCellCol:this.castle.rook.oldCell.col,newCellRow:this.castle.rook.newCell.row,newCellCol:this.castle.rook.newCell.col}},ate:null!==this.ate?this.ate.getString():null,isPromotion:this.isPromotion});static parseMove=(e,t)=>{const o=new a(new i(t.oldCellRow,t.oldCellCol),new i(t.newCellRow,t.newCellCol),w.parsePieceString(t.pieceString),t.isEnPassant,{isCastle:!1},null,t.isPromotion);if(t.castle.isCastle){const l=t.castle.rook;o.castle.isCastle=!0,o.castle.rook=new a(new i(l.oldCellRow,l.oldCellCol),new i(l.newCellRow,l.newCellCol),e.getPiece(l.oldCellRow,l.oldCellCol))}return o}}class w{static WHITE=-1;static BLACK=1;static ROOK="r";static BISHOP="b";static KNIGHT="n";static KING="k";static QUEEN="q";static PAWN="p";isAlive=!0;constructor(e,t,o=[]){this.colour=e,this.cell=t,this.moves=o}static parsePieceString=e=>{const t="w"===e.slice(0,1)?w.WHITE:w.BLACK,o=e.slice(1,2);return"b"===o?new u(t,new i(0,0)):"k"===o?new h(t,new i(0,0)):"n"===o?new f(t,new i(0,0)):"p"===o?new d(t,new i(0,0)):"q"===o?new C(t,new i(0,0)):"r"===o?new p(t,new i(0,0)):null}}class u extends w{directions=[[1,1],[-1,-1],[1,-1],[-1,1]];points=330;name=w.BISHOP;static whiteScore=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];static blackScore=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],[-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];constructor(e,t,o){super(e,t,o)}getMoves=e=>{const t=[];for(const o of this.directions){const l=this.cell.row,n=this.cell.col,s=o[0],r=o[1];let c=s+l,w=r+n;for(;e.canMove(c,w)||e.canEat(c,w,this.colour);){const o=new a(this.cell,new i(c,w),this);if(e.willCheck(this,o)||t.push(o),e.canEat(c,w,this.colour))break;c+=s,w+=r}}return t};getAttack=e=>{const t=[];for(const o of this.directions){const l=this.cell.row,n=this.cell.col,s=o[0],r=o[1];let c=s+l,w=r+n;for(;(e.canMove(c,w)||e.canEatDefend(c,w))&&(t.push(new a(this.cell,new i(c,w),this)),!e.canEatDefend(c,w));)c+=s,w+=r}return t};movePiece=(e,t)=>{const o=t.getBoard(),l=e.newCell.row,n=e.newCell.col,s=o[l][n];return null!==s&&(e.ate=s),o[l][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(l,n),this.moves.push(e),{row:l,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"b"}class h extends w{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];static KING_SIDE="king";static QUEEN_SIDE="queen";name=w.KING;points=2e4;static whiteScore=[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]];static blackScore=[[20,30,10,0,0,10,30,20],[20,20,0,0,0,0,20,20],[-10,-20,-20,-20,-20,-20,-20,-10],[-20,-30,-30,-40,-40,-30,-30,-20],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30]];static whiteScoreEnd=[[-50,-40,-30,-20,-20,-30,-40,-50],[-30,-20,-10,0,0,-10,-20,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-30,0,0,0,0,-30,-30],[-50,-30,-30,-30,-30,-30,-30,-50]];static blackScoreEnd=[[-50,-30,-30,-30,-30,-30,-30,-50],[-30,-30,0,0,0,0,-30,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-20,-10,0,0,-10,-20,-30],[-50,-40,-30,-20,-20,-30,-40,-50]];constructor(e,t,o){super(e,t,o)}getMoves=e=>{const t=[],o=e.getAttackingSquares(this.colour)[0];for(const n of this.directions){const o=n[0],l=n[1],s=o+this.cell.row,r=l+this.cell.col;if((e.canEat(s,r,this.colour)||e.canMove(s,r))&&e.canKingMove(s,r,this.colour)){const o=new a(this.cell,new i(s,r),this);e.willCheck(this,o)||t.push(o)}}const l=t.filter((e=>{for(const t of o)if(e.newCell.row===t.newCell.row&&e.newCell.col===t.newCell.col)return!1;return!0}));if(e.canCastle(this.colour,h.KING_SIDE,o)){const t=this.colour===w.BLACK?0:7,o=6;l.push(new a(this.cell,new i(t,o),this,!1,{isCastle:!0,rook:new a(new i(t,7),new i(t,5),e.getPiece(t,7))}))}if(e.canCastle(this.colour,h.QUEEN_SIDE,o)){const t=this.colour===w.BLACK?0:7,o=2;l.push(new a(this.cell,new i(t,o),this,!1,{isCastle:!0,rook:new a(new i(t,0),new i(t,3),e.getPiece(t,0))}))}return l};getAttack=e=>this.getMoves(e);movePiece=(e,t)=>{const o=t.getBoard(),l=e.newCell.row,n=e.newCell.col;e.castle.isCastle&&(o[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=e.castle.rook.piece,o[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=null,e.castle.rook.piece.cell.row=e.castle.rook.newCell.row,e.castle.rook.piece.cell.col=e.castle.rook.newCell.col);const s=o[l][n];return null!==s&&(e.ate=s),o[l][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(l,n),this.moves.push(e),{row:l,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"k"}class f extends w{directions=[[1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]];points=320;name=w.KNIGHT;static whiteScore=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];static blackScore=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,5,5,0,-20,-40],[-30,5,10,15,15,10,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,10,15,15,10,0,-30],[-40,-20,0,0,0,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];constructor(e,t,o){super(e,t,o)}getMoves=e=>{const t=[];for(const o of this.directions){const l=o[0],n=o[1],s=l+this.cell.row,r=n+this.cell.col;if(e.canEat(s,r,this.colour)||e.canMove(s,r)){const o=new a(this.cell,new i(s,r),this);e.willCheck(this,o)||t.push(o)}}return t};getAttack=e=>{const t=[];for(const o of this.directions){const l=o[0],n=o[1],s=l+this.cell.row,r=n+this.cell.col;(e.canEatDefend(s,r)||e.canMove(s,r))&&t.push(new a(this.cell,new i(s,r),this))}return t};movePiece=(e,t)=>{const o=t.getBoard(),l=e.newCell.row,n=e.newCell.col,s=o[l][n];return null!==s&&(e.ate=s),o[l][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(l,n),this.moves.push(e),{row:l,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"n"}class d extends w{points=100;name=w.PAWN;static whiteScore=[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];static whiteScoreEnd=[[100,100,100,100,100,100,100,100],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];static blackScore=[[0,0,0,0,0,0,0,0],[5,10,10,-40,-40,10,10,5],[5,10,20,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[0,0,0,0,0,0,0,0]];static blackScoreEnd=[[0,0,0,0,0,0,0,0],[5,10,10,-40,-40,10,10,5],[5,10,20,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[100,100,100,100,100,100,100,100]];constructor(e,t,o){super(e,t,o)}getMoves=e=>{const t=[];let o=this.cell.row+1*this.colour,l=this.cell.col;if(e.canMove(o,l)){const n=new a(this.cell,new i(o,l),this,void 0,void 0,void 0,0===o||7===o);if(e.willCheck(this,n)||t.push(n),o=this.cell.row+2*this.colour,e.canMove(o,l)&&this.moves.length<=0)if(this.colour===w.BLACK&&1===this.cell.row){const n=new a(this.cell,new i(o,l),this);e.willCheck(this,n)||t.push(n)}else if(this.colour===w.WHITE&&6===this.cell.row){const n=new a(this.cell,new i(o,l),this);e.willCheck(this,n)||t.push(n)}}if(o=this.cell.row+1*this.colour,l=this.cell.col+1,e.canEat(o,l,this.colour)){const n=new a(this.cell,new i(o,l),this,void 0,void 0,e.getPiece(o,l),0===o||7===o);e.willCheck(this,n)||t.push(n)}if(e.canMove(o,l)&&e.moves.length>0){const n=e.moves.slice(-1)[0];if(n.piece.name===w.PAWN&&n.newCell.row===this.cell.row&&n.newCell.col===this.cell.col+1&&2===Math.abs(n.newCell.row-n.oldCell.row)){const n=new a(this.cell,new i(o,l),this,!0);e.willCheck(this,n)||t.push(n)}}if(o=this.cell.row+1*this.colour,l=this.cell.col-1,e.canEat(o,l,this.colour)){const n=new a(this.cell,new i(o,l),this,void 0,void 0,e.getPiece(o,l),0===o||7===o);e.willCheck(this,n)||t.push(n)}if(e.canMove(o,l)&&e.moves.length>0){const n=e.moves.slice(-1)[0];if(n.piece.name===w.PAWN&&n.newCell.row===this.cell.row&&n.newCell.col===this.cell.col-1&&2===Math.abs(n.newCell.row-n.oldCell.row)){const n=new a(this.cell,new i(o,l),this,!0);e.willCheck(this,n)||t.push(n)}}return t};getAttack=e=>{const t=[];let o=this.cell.row+1*this.colour,l=this.cell.col+1;return(e.canMove(o,l)||e.canEatDefend(o,l))&&t.push(new a(this.cell,new i(o,l),this)),o=this.cell.row+1*this.colour,l=this.cell.col-1,(e.canMove(o,l)||e.canEatDefend(o,l))&&t.push(new a(this.cell,new i(o,l),this)),t};movePiece=(e,t)=>{const o=t.getBoard(),l=e.newCell.row,n=e.newCell.col;if(e.isEnPassant){const l=t.moves.slice(-1)[0],n=o[l.newCell.row][l.newCell.col];null!==n&&(e.ate=n),o[l.newCell.row][l.newCell.col]=null}const s=o[l][n];return null!==s&&(e.ate=s),o[l][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(l,n),e.isPromotion?(o[l][n]=new C(this.colour,this.cell),{promotion:!0,row:l,col:n}):(this.moves.push(e),{row:l,col:n})};getString=()=>(this.colour===w.WHITE?"w":"b")+"p"}class C extends w{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];points=900;name=w.QUEEN;static whiteScore=[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]];static blackScore=[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,5,0,0,0,0,-10],[-10,5,5,5,5,5,0,-10],[0,0,5,5,5,5,0,-5],[-5,0,5,5,5,5,0,-5],[-10,0,5,5,5,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]];constructor(e,t,o){super(e,t,o)}getMoves=e=>{const t=[];for(const o of this.directions){const l=this.cell.row,n=this.cell.col,s=o[0],r=o[1];let c=s+l,w=r+n;for(;e.canMove(c,w)||e.canEat(c,w,this.colour);){const o=new a(this.cell,new i(c,w),this);if(e.willCheck(this,o)||t.push(o),e.canEat(c,w,this.colour))break;c+=s,w+=r}}return t};getAttack=e=>{const t=[];for(const o of this.directions){const l=this.cell.row,n=this.cell.col,s=o[0],r=o[1];let c=s+l,w=r+n;for(;(e.canMove(c,w)||e.canEatDefend(c,w))&&(t.push(new a(this.cell,new i(c,w),this)),!e.canEatDefend(c,w));)c+=s,w+=r}return t};movePiece=(e,t)=>{const o=t.getBoard(),l=e.newCell.row,n=e.newCell.col,s=o[l][n];return null!==s&&(e.ate=s),o[l][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(l,n),this.moves.push(e),{row:l,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"q"}class p extends w{directions=[[0,1],[1,0],[0,-1],[-1,0]];points=500;name=w.ROOK;static whiteScore=[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]];static blackScore=[[0,0,4,5,5,10,0,0],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[5,10,10,10,10,10,10,5],[0,0,0,0,0,0,0,0]];constructor(e,t,o){super(e,t,o)}getMoves=e=>{const t=[];for(const o of this.directions){const l=this.cell.row,n=this.cell.col,s=o[0],r=o[1];let c=s+l,w=r+n;for(;e.canMove(c,w)||e.canEat(c,w,this.colour);){const o=new a(this.cell,new i(c,w),this);if(e.willCheck(this,o)||t.push(o),e.canEat(c,w,this.colour))break;c+=s,w+=r}}return t};getAttack=e=>{const t=[];for(const o of this.directions){const l=this.cell.row,n=this.cell.col,s=o[0],r=o[1];let c=s+l,w=r+n;for(;e.canMove(c,w)||e.canEatDefend(c,w);){const o=new a(this.cell,new i(c,w),this);if(t.push(o),e.canEatDefend(c,w))break;c+=s,w+=r}}return t};movePiece=(e,t)=>{const o=t.getBoard(),l=e.newCell.row,n=e.newCell.col,s=o[l][n];return null!==s&&(e.ate=s),o[l][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(l,n),this.moves.push(e),{row:l,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"r"}try{const o=e.data;if(o.newGame)b=0,S=new Map;else if(o.undo)b--,S=new Map;else{const e=o[0],l=o[1],n=o[2],s=o[3];if(0===b){if(s===w.WHITE){const e=[new a(new i(6,3),new i(4,3),new d(w.WHITE,new i(6,3))),new a(new i(6,4),new i(4,4),new d(w.WHITE,new i(6,4)))],t=Math.round(Math.random()*(e.length-1));postMessage(e[t].getMoveString())}else{const o=n.map((e=>a.parseMove(void 0,e)))[0];if(6===o.oldCell.row&&4===o.oldCell.col&&4===o.newCell.row&&4===o.newCell.col){const e=[new a(new i(1,2),new i(3,2),new d(w.BLACK,new i(1,2))),new a(new i(1,4),new i(3,4),new d(w.BLACK,new i(1,4)))],t=Math.round(Math.random()*(e.length-1));postMessage(e[t].getMoveString())}else{const o=t(e,l,n,s);postMessage(o.getMoveString())}}b++}else{const o=t(e,l,n,s);postMessage(o.getMoveString())}}}catch(g){postMessage({isError:!0,message:"Error: "+g})}}))}();
//# sourceMappingURL=worker.worker.b61d656b.worker.js.map
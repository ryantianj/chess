!function(){let e=0;self.addEventListener("message",(async l=>{const o=new Map;let t=!0,n=!0,s=!0,c=!0;const i=Array.from({length:10},(e=>0)),r=Array.from({length:10},(e=>Array.from({length:10},(e=>0))));let w,a=[];const u=2e4,h=1e5;let f=0,C=0;let p=!1;const d=(l,t,n,s,c)=>{let i;const h=new b;h.setBoardString(l),h.moves=n.map((e=>P.parseMove(h,e)));for(let e=2;e<c.length;e++)r[0][e-2]=P.parseMove(h,c[e]);const d=r[0];a=[...d],p=h.isEndGame(),p&&(console.log("endgame"),h.setEndGame()),h.updatePieceValues(e);for(let e=1;e<t;e++)o.set(e,[null,null,null]);let E;w=performance.now();for(let e=1;e<=t;e++){E=g(h,e,-Number.MAX_VALUE,Number.MAX_VALUE,s,s,o,0);if(performance.now()-w<u){const e=r[0];a=[...e]}i=a[0],console.log(e,"Score",E[1],a[0].newCell)}const S=performance.now(),v=[];for(let e=0;e<t&&0!==a[e];e++)v.push(a[e].getMoveString()),console.log(a[e].getMoveString(),a[e].getMoveString().ate);return console.log(S-w,f,C),[i.getMoveString(),v]},g=(e,l,o,t,n,s,c,a)=>{if(i[a]=a,f%h===0&&performance.now()-w>u)return[null,0];const C=e.getAllMoves(s);let p;if(v(C,l,a),s===n){let w=-9e4,u=0;for(let h=0;h<C.length;h++){const f=C[h];if(e.movePiece(f.piece,f),e.isIllegal(s,f)){e.undoMove();continue}u++,void 0===p&&(p=f);const d=S(e,l-1,o,t,n,-1*s,C,c,a+1,1===u);if(e.undoMove(),d>w){w=d,p=f,r[a][a]=f;for(let e=a+1;e<i[a+1];e++)r[a][e]=r[a+1][e];i[a]=i[a+1]}if(t<=(o=Math.max(o,d)))break}return 0===u?e.isCheck(s)?[null,-9e4]:[null,0]:[p,w]}};let E=!1;const S=(e,l,o,t,n,s,c,a,d,g)=>{if(f%h===0&&performance.now()-w>u)return e.getScore(n,c);let v=0;if(f++,i[d]=d,l<=0){let l;return l=n!==s||E||null===e.moves.slice(-1)[0].ate?e.getScore(n,c):M(o,t,e,s,2,c),l}if(l>=4&&!p&&!E&&!e.isCheck(s)){E=!0;const o=S(e,l-1-2,t-1,t,n,-1*s,c,a,d+1+2,!1);if(E=!1,o>=t)return t}const m=e.getAllMoves(s);if(k(m,a,l,d,g),s===n){let c=-3e4,w=0;for(let u=0;u<m.length;u++){const h=m[u];if(e.movePiece(h.piece,h),e.isIllegal(s,h)){e.undoMove();continue}w++,v++;const f=S(e,l-1,o,t,n,-1*s,m,a,d+1,1===w);if(e.undoMove(),f>c){c=f,r[d][d]=h;for(let e=d+1;e<i[d+1];e++)r[d][e]=r[d+1][e];i[d]=i[d+1]}if(f>o&&(o=f),t<=o){if(null!==h.ate)break;const e=a.get(l);if(e.find((e=>null!==e&&I(e,h))))break;for(let l=0;l>=0;l--)e[l+1]=e[l];e[0]=h;break}}return C=(C+v)/2,0===w?e.isCheck(s)?-3e4*l:0:c}{let w=3e4,u=0;for(let h=0;h<m.length;h++){const f=m[h];if(e.movePiece(f.piece,f),e.isIllegal(s,f)){e.undoMove();continue}u++,v++;const C=S(e,l-1,o,t,n,-1*s,c,a,d+1,1===u);if(e.undoMove(),C<w){w=C,r[d][d]=f;for(let e=d+1;e<i[d+1];e++)r[d][e]=r[d+1][e];i[d]=i[d+1]}if(C<t&&(t=C),t<=o){if(null!==f.ate)break;const e=a.get(l);if(e.find((e=>null!==e&&I(e,f))))break;for(let l=0;l>=0;l--)e[l+1]=e[l];e[0]=f;break}}return C=(C+v)/2,0===u?e.isCheck(s)?3e4*l:0:w}},v=(e,l,o)=>{e.sort(((e,l)=>{const t=a[o];if(0!==t&&I(e,t))return-1;if(0!==t&&I(l,t))return 1;if(e.castle.isCastle)return-1;if(l.castle.isCastle)return 1;if(null!==e.ate&&null!==l.ate){return e.piece.points-e.ate.points<l.piece.points-l.ate.points?-1:1}if(null!==e.ate)return-1;if(null!==l.ate)return 1;return(e.piece.colour===W.WHITE?e.piece.whiteScore[e.newCell.row][e.newCell.col]:e.piece.blackScore[e.newCell.row][e.newCell.col])<(l.piece.colour===W.WHITE?l.piece.whiteScore[l.newCell.row][l.newCell.col]:l.piece.blackScore[l.newCell.row][l.newCell.col])?1:-1}))},k=(e,l,o,t,n)=>{e.sort(((e,s)=>{const c=a[t];if(n&&0!==c){if(I(e,c))return-1;if(I(s,c))return 1}if(e.castle.isCastle)return-1;if(s.castle.isCastle)return 1;if(null!==e.ate&&null!==s.ate){return e.piece.points-e.ate.points<s.piece.points-s.ate.points?-1:1}{if(null!==e.ate)return-1;if(null!==s.ate)return 1;const t=l.get(o);for(let l=0;l<t.length;l++){const o=t[l];if(null!==o&&I(e,o))return-1;if(null!==o&&I(s,o))return 1}return(e.piece.colour===W.WHITE?e.piece.whiteScore[e.newCell.row][e.newCell.col]:e.piece.blackScore[e.newCell.row][e.newCell.col])<(s.piece.colour===W.WHITE?s.piece.whiteScore[s.newCell.row][s.newCell.col]:s.piece.blackScore[s.newCell.row][s.newCell.col])?1:-1}}))},I=(e,l)=>e.newCell.row===l.newCell.row&&e.newCell.col===l.newCell.col&&e.oldCell.row===l.oldCell.row&&e.oldCell.col===l.oldCell.col&&e.piece.constructor===l.piece.constructor&&(null!==e.ate&&null!==l.ate?e.ate.constructor===l.ate.constructor:e.ate===l.ate),m=(e,l)=>{if(null!==e.ate&&null!==l.ate){return e.piece.points-e.ate.points<l.piece.points-l.ate.points?-1:1}if(null!==e.ate)return-1;if(null!==l.ate)return 1;return(e.piece.colour===W.WHITE?e.piece.whiteScore[e.newCell.row][e.newCell.col]:e.piece.blackScore[e.newCell.row][e.newCell.col])<(l.piece.colour===W.WHITE?l.piece.whiteScore[l.newCell.row][l.newCell.col]:l.piece.blackScore[l.newCell.row][l.newCell.col])?1:-1},M=(e,l,o,t,n,s)=>{const c=o.getScore(t,s);if(0===n)return c;if(c>=l)return l;e=Math.max(e,c);const i=o.getAllMoves(t);i.sort(m);for(let r=0;r<i.length;r++){const c=i[r];if(null===c.ate)break;{o.movePiece(c.piece,c);let i=-M(-l,-e,o,-1*t,n-1,s);if(o.undoMove(),i>=l)return l;i>e&&(e=i)}}return e};class b{board;constructor(){this.board=this.newBoard(),this.moves=[]}newBoard=()=>[[new N(W.BLACK,new H(0,0)),new A(W.BLACK,new H(0,1)),new T(W.BLACK,new H(0,2)),new L(W.BLACK,new H(0,3)),new K(W.BLACK,new H(0,4)),new T(W.BLACK,new H(0,5)),new A(W.BLACK,new H(0,6)),new N(W.BLACK,new H(0,7))],[new B(W.BLACK,new H(1,0)),new B(W.BLACK,new H(1,1)),new B(W.BLACK,new H(1,2)),new B(W.BLACK,new H(1,3)),new B(W.BLACK,new H(1,4)),new B(W.BLACK,new H(1,5)),new B(W.BLACK,new H(1,6)),new B(W.BLACK,new H(1,7))],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[new B(W.WHITE,new H(6,0)),new B(W.WHITE,new H(6,1)),new B(W.WHITE,new H(6,2)),new B(W.WHITE,new H(6,3)),new B(W.WHITE,new H(6,4)),new B(W.WHITE,new H(6,5)),new B(W.WHITE,new H(6,6)),new B(W.WHITE,new H(6,7))],[new N(W.WHITE,new H(7,0)),new A(W.WHITE,new H(7,1)),new T(W.WHITE,new H(7,2)),new L(W.WHITE,new H(7,3)),new K(W.WHITE,new H(7,4)),new T(W.WHITE,new H(7,5)),new A(W.WHITE,new H(7,6)),new N(W.WHITE,new H(7,7))]];setEndGame=()=>{for(let e=0;e<8;e++)for(let l=0;l<8;l++){const o=this.getPiece(e,l);null!==o&&void 0!==o.whiteScoreEnd&&(o.colour===W.WHITE?o.whiteScore=o.whiteScoreEnd:o.blackScore=o.blackScoreEnd)}};updatePieceValues=e=>{this.kingHasMoved(W.WHITE)&&(t=!1,n=!1),this.rookHasMoved(W.WHITE,K.KING_SIDE)&&(t=!1),this.rookHasMoved(W.WHITE,K.QUEEN_SIDE)&&(n=!1),this.kingHasMoved(W.BLACK)&&(s=!1,c=!1),this.rookHasMoved(W.BLACK,K.KING_SIDE)&&(s=!1),this.rookHasMoved(W.BLACK,K.QUEEN_SIDE)&&(c=!1);let l=0,o=0;for(let t=0;t<8;t++)for(let e=0;e<8;e++){const n=this.getPiece(t,e);null!==n&&n instanceof B&&(n.colour===W.WHITE?l++:o++)}const i=[];for(let t=0;t<8;t++){let e=!1;for(let l=0;l<8;l++){const o=this.getPiece(l,t);if(null!==o&&o instanceof B){e=!0;break}}e||i.push(t)}for(let t=0;t<8;t++)for(let n=0;n<8;n++){const s=this.getPiece(t,n);if(null!==s){if(s instanceof L&&e<=12&&(s.colour===W.WHITE?s.whiteScore[7][3]+=50:s.blackScore[0][3]+=50),s instanceof A&&(s.points-=3*(16-l-o),e<=12&&(s.colour===W.WHITE?(s.whiteScore[7][1]-=50,s.whiteScore[7][6]-=50):(s.blackScore[0][1]-=50,s.blackScore[0][6]-=50))),s instanceof T&&(s.points+=3*(16-l-o),e<=12&&(s.colour===W.WHITE?(s.whiteScore[7][2]-=50,s.whiteScore[7][5]-=50):(s.blackScore[0][2]-=50,s.blackScore[0][5]-=50))),s instanceof N){s.points+=3*(16-l-o);for(const e of i)for(let l=0;l<8;l++)s.whiteScore[l][e]+=15,s.blackScore[l][e]+=15}if(s instanceof B){let e=!0;if(n+1<8)if(s.colour===W.WHITE)for(let o=t-1;o>=0;o--)this.getPiece(o,n+1)instanceof B&&(e=!1);else for(let o=t+1;o<8;o++)this.getPiece(o,n+1)instanceof B&&(e=!1);if(n<8)if(s.colour===W.WHITE)for(let o=t-1;o>=0;o--)this.getPiece(o,n)instanceof B&&(e=!1);else for(let o=t+1;o<8;o++)this.getPiece(o,n)instanceof B&&(e=!1);if(n-1>=0)if(s.colour===W.WHITE)for(let o=t-1;o>=0;o--)this.getPiece(o,n-1)instanceof B&&(e=!1);else for(let o=t+1;o<8;o++)this.getPiece(o,n-1)instanceof B&&(e=!1);e&&(s.colour===W.WHITE?s.points+=20*(6-t):s.points+=20*(t-1));let l=!1;for(let o=0;o<8;o++)s instanceof B&&o!==t&&(l=!0);l&&(s.points-=10)}}}};isEndGame=()=>{let e=0,l=0,o=0,t=0;for(let n=0;n<8;n++)for(let s=0;s<8;s++){const c=this.getPiece(n,s);c instanceof L&&(c.colour===W.WHITE?o++:t++),(c instanceof N||c instanceof T||c instanceof A)&&(c.colour===W.WHITE?e++:l++)}return o<=1&&e<=1||t<=1&&l<=1||e<=3&&o<=0||l<=3&&t<=0};setBoardString=e=>{const l=[];for(let o=0;o<8;o++){const t=[];for(let l=0;l<8;l++){const n=e[o][l];if(null===n)t.push(null);else{const e="w"===n.slice(0,1)?W.WHITE:W.BLACK,s=n.slice(1,2);"b"===s?t.push(new T(e,new H(o,l))):"k"===s?t.push(new K(e,new H(o,l))):"n"===s?t.push(new A(e,new H(o,l))):"p"===s?t.push(new B(e,new H(o,l))):"q"===s?t.push(new L(e,new H(o,l))):"r"===s?t.push(new N(e,new H(o,l))):t.push(null)}}l.push(t)}this.board=l};getBoard=()=>this.board;getPiece=(e,l)=>this.board[e][l];isEmpty=(e,l)=>!this.isOutSide(e,l)&&null===this.board[e][l];isOutSide=(e,l)=>e<0||l<0||e>7||l>7;canEat=(e,l,o)=>!this.isOutSide(e,l)&&!this.isEmpty(e,l)&&this.getPiece(e,l).colour!==o;canMove=(e,l)=>!this.isOutSide(e,l)&&this.isEmpty(e,l);canKingMove=(e,l,o)=>{const t=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];for(const n of t){const t=e+n[0],s=l+n[1];if(!this.isOutSide(t,s)&&!this.isEmpty(t,s)&&this.getPiece(t,s).name===W.KING&&this.getPiece(t,s).colour!==o)return!1}return!0};movePiece=(e,l)=>{l.piece.movePiece(l,this),this.moves.push(l)};undoMove=()=>{if(this.moves.length>0){const e=this.moves.pop(),l=e.oldCell.row,o=e.oldCell.col,t=this.board[e.newCell.row][e.newCell.col];return this.board[l][o]=t,t.cell.row=l,t.cell.col=o,e.isEnPassant?(this.board[e.ate.cell.row][e.ate.cell.col]=e.ate,this.board[e.newCell.row][e.newCell.col]=null,!0):(e.isPromotion?this.board[l][o]=new B(t.colour,t.cell,t.moves):e.castle.isCastle&&(this.board[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=e.castle.rook.piece,e.castle.rook.piece.cell.row=e.castle.rook.oldCell.row,e.castle.rook.piece.cell.col=e.castle.rook.oldCell.col,this.board[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=null),this.board[e.newCell.row][e.newCell.col]=e.ate,!0)}return!1};kingHasMoved=e=>{for(let l=0;l<this.moves.length;l++){const o=this.moves[l];if(o.piece.name===W.KING&&o.piece.colour===e)return!0}return!1};rookHasMoved=(e,l)=>{const o=e===W.BLACK?0:7,t=l===K.KING_SIDE?7:0;if(null===this.getPiece(o,t)||this.getPiece(o,t).name!==W.ROOK)return!0;for(const n of this.moves)if(n.piece.name===W.ROOK&&n.piece.colour===e&&n.oldCell.row===o&&n.oldCell.col===t)return!0;return!1};castlingSquaresIsEmpty=(e,l)=>{const o=e===W.BLACK?0:7,t=l===K.KING_SIDE?[5,6]:[1,2,3];for(const n of t)if(!this.isEmpty(o,n))return!1;return!0};isIllegal=(e,l)=>{let o,t=0;for(let n=0;n<8;n++)for(let l=0;l<8;l++)if(!this.isEmpty(n,l)){const s=this.getPiece(n,l);s.name===W.KING&&(t++,s.colour===e&&(o=s))}if(t<2)return!0;if(l.castle.isCastle){const o=this.getAllMoves(-1*e),t=l.newCell.row;if(6===l.newCell.col)for(const e of o){const l=e.newCell.row,o=e.newCell.col;if(l===t&&(6===o||5===o||4===o))return!0}else for(const e of o){const l=e.newCell.row,o=e.newCell.col;if(l===t&&(2===o||3===o||4===o))return!0}}for(let n=0;n<8;n++)for(let l=0;l<8;l++)if(!this.isEmpty(n,l)&&this.getPiece(n,l).colour!==e){if(this.getPiece(n,l).isCheck(this,o))return!0}return!1};isCheck=e=>{let l;for(let o=0;o<8;o++)for(let t=0;t<8;t++)if(!this.isEmpty(o,t)){const n=this.getPiece(o,t);n.name===W.KING&&n.colour===e&&(l=n)}for(let o=0;o<8;o++)for(let t=0;t<8;t++)if(!this.isEmpty(o,t)&&this.getPiece(o,t).colour!==e){if(this.getPiece(o,t).isCheck(this,l))return!0}return!1};getAllMoves=e=>{let l=[];for(let o=0;o<8;o++)for(let t=0;t<8;t++)if(!this.isEmpty(o,t)&&this.getPiece(o,t).colour===e){const e=this.getPiece(o,t).getMoves(this);l=l.concat(e)}return l};scanSquaresScore=()=>{let e=0,l=0;for(let o=0;o<8;o++)for(let t=0;t<8;t++){const n=this.getPiece(o,t);null!==n&&(n.colour===W.WHITE?l+=n.points:l-=n.points,n.colour===W.WHITE?e+=n.whiteScore[o][t]:e-=n.blackScore[o][t])}return e+l};getScore=(e,l)=>(this.scanSquaresScore()+3*l.length)*e*-1;getBoardString=()=>{const e=[];for(let l=0;l<8;l++){const o=[];for(let e=0;e<8;e++){const t=this.getPiece(l,e);null!==t?o.push(t.getString()):o.push(null)}e.push(o)}return e}}class H{constructor(e,l){this.row=e,this.col=l}}class P{oldCell;newCell;constructor(e,l,o,t=!1,n={isCastle:!1},s=null,c=!1){this.oldCell=e,this.newCell=l,this.piece=o,this.isEnPassant=t,this.castle=n,this.ate=s,this.isPromotion=c}getMoveString=()=>({oldCellRow:this.oldCell.row,oldCellCol:this.oldCell.col,newCellRow:this.newCell.row,newCellCol:this.newCell.col,pieceString:this.piece.getString(),isEnPassant:this.isEnPassant,castle:!1===this.castle.isCastle?{isCastle:!1}:{isCastle:!0,rook:{pieceString:this.castle.rook.piece.getString(),oldCellRow:this.castle.rook.oldCell.row,oldCellCol:this.castle.rook.oldCell.col,newCellRow:this.castle.rook.newCell.row,newCellCol:this.castle.rook.newCell.col}},ate:null!==this.ate?this.ate.getString():null,isPromotion:this.isPromotion});static parseMove=(e,l)=>{const o=new P(new H(l.oldCellRow,l.oldCellCol),new H(l.newCellRow,l.newCellCol),W.parsePieceString(l.pieceString),l.isEnPassant,{isCastle:!1},null,l.isPromotion);if(l.castle.isCastle){const t=l.castle.rook;o.castle.isCastle=!0,o.castle.rook=new P(new H(t.oldCellRow,t.oldCellCol),new H(t.newCellRow,t.newCellCol),e.getPiece(t.oldCellRow,t.oldCellCol))}return o}}class W{static WHITE=-1;static BLACK=1;static ROOK="r";static BISHOP="b";static KNIGHT="n";static KING="k";static QUEEN="q";static PAWN="p";constructor(e,l){this.colour=e,this.cell=l}static parsePieceString=e=>{const l="w"===e.slice(0,1)?W.WHITE:W.BLACK,o=e.slice(1,2);return"b"===o?new T(l,new H(0,0)):"k"===o?new K(l,new H(0,0)):"n"===o?new A(l,new H(0,0)):"p"===o?new B(l,new H(0,0)):"q"===o?new L(l,new H(0,0)):"r"===o?new N(l,new H(0,0)):null}}class T extends W{directions=[[1,1],[-1,-1],[1,-1],[-1,1]];points=330;name=W.BISHOP;whiteScore=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];blackScore=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],[-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[],o=this.cell.row,t=this.cell.col;for(const n of this.directions){const s=n[0],c=n[1];let i=s+o,r=c+t;for(;e.canMove(i,r)||e.canEat(i,r,this.colour);){const n=new P(new H(o,t),new H(i,r),this);if(l.push(n),e.canEat(i,r,this.colour))break;i+=s,r+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col;if(Math.abs(o-n)!==Math.abs(t-s))return!1;const c=this.cell.row,i=this.cell.col;for(const r of this.directions){const l=r[0],o=r[1];let t=l+c,n=o+i;for(;e.canMove(t,n)||e.canEat(t,n,this.colour);){if(e.canEat(t,n,this.colour)){if(e.getPiece(t,n).name===W.KING)return!0;break}t+=l,n+=o}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new H(t,n)};getString=()=>(this.colour===W.WHITE?"w":"b")+"b"}class K extends W{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];static KING_SIDE=-1;static QUEEN_SIDE=1;name=W.KING;points=1e4;whiteScore=[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]];blackScore=[[20,30,10,0,0,10,30,20],[20,20,0,0,0,0,20,20],[-10,-20,-20,-20,-20,-20,-20,-10],[-20,-30,-30,-40,-40,-30,-30,-20],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30]];whiteScoreEnd=[[-50,-40,-30,-20,-20,-30,-40,-50],[-30,-20,-10,0,0,-10,-20,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-30,0,0,0,0,-30,-30],[-50,-30,-30,-30,-30,-30,-30,-50]];blackScoreEnd=[[-50,-30,-30,-30,-30,-30,-30,-50],[-30,-30,0,0,0,0,-30,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-20,-10,0,0,-10,-20,-30],[-50,-40,-30,-20,-20,-30,-40,-50]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[],o=this.cell.row,i=this.cell.col;for(const t of this.directions){const n=t[0]+o,s=t[1]+i;if((e.canEat(n,s,this.colour)||e.canMove(n,s))&&e.canKingMove(n,s,this.colour)){const e=new P(new H(o,i),new H(n,s),this);l.push(e)}}const r=this.colour===W.WHITE?t:s,w=this.colour===W.WHITE?n:c;if(r&&e.castlingSquaresIsEmpty(this.colour,K.KING_SIDE)&&!e.rookHasMoved(this.colour,K.KING_SIDE)&&!e.kingHasMoved(this.colour)){const t=this.colour===W.BLACK?0:7,n=6;l.push(new P(new H(o,i),new H(t,n),this,!1,{isCastle:!0,rook:new P(new H(t,7),new H(t,5),e.getPiece(t,7))}))}if(w&&e.castlingSquaresIsEmpty(this.colour,K.QUEEN_SIDE)&&!e.rookHasMoved(this.colour,K.QUEEN_SIDE)&&!e.kingHasMoved(this.colour)){const t=this.colour===W.BLACK?0:7,n=2;l.push(new P(new H(o,i),new H(t,n),this,!1,{isCastle:!0,rook:new P(new H(t,0),new H(t,3),e.getPiece(t,0))}))}return l};isCheck=(e,l)=>!1;movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col;e.castle.isCastle&&(o[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=e.castle.rook.piece,o[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=null,e.castle.rook.piece.cell.row=e.castle.rook.newCell.row,e.castle.rook.piece.cell.col=e.castle.rook.newCell.col);const s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new H(t,n)};getString=()=>(this.colour===W.WHITE?"w":"b")+"k"}class A extends W{directions=[[1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]];points=320;name=W.KNIGHT;whiteScore=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];blackScore=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,5,5,0,-20,-40],[-30,5,10,15,15,10,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,10,15,15,10,0,-30],[-40,-20,0,0,0,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=o[0],n=o[1],s=this.cell.row,c=this.cell.col,i=t+s,r=n+c;if(e.canEat(i,r,this.colour)||e.canMove(i,r)){const e=new P(new H(s,c),new H(i,r),this);l.push(e)}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col,c=Math.abs(o-n),i=Math.abs(t-s);return c+i===3&&!(0===c||0===i)};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new H(t,n)};getString=()=>(this.colour===W.WHITE?"w":"b")+"n"}class B extends W{points=100;name=W.PAWN;whiteScore=[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];whiteScoreEnd=[[100,100,100,100,100,100,100,100],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];blackScore=[[0,0,0,0,0,0,0,0],[5,10,10,-40,-40,10,10,5],[5,10,20,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[0,0,0,0,0,0,0,0]];blackScoreEnd=[[0,0,0,0,0,0,0,0],[5,10,10,-40,-40,10,10,5],[5,10,20,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[100,100,100,100,100,100,100,100]];constructor(e,l){super(e,l)}getMoves=e=>{const l=this.cell.row,o=this.cell.col,t=[];let n=this.cell.row+1*this.colour,s=this.cell.col;if(e.canMove(n,s)){const c=new P(new H(l,o),new H(n,s),this,void 0,void 0,void 0,0===n||7===n);if(t.push(c),n=this.cell.row+2*this.colour,e.canMove(n,s)&&(3===n||4===n))if(this.colour===W.BLACK&&1===this.cell.row){const e=new P(new H(l,o),new H(n,s),this);t.push(e)}else if(this.colour===W.WHITE&&6===this.cell.row){const e=new P(new H(l,o),new H(n,s),this);t.push(e)}}if(n=this.cell.row+1*this.colour,s=this.cell.col+1,e.canEat(n,s,this.colour)){const c=new P(new H(l,o),new H(n,s),this,void 0,void 0,e.getPiece(n,s),0===n||7===n);t.push(c)}if(e.canMove(n,s)&&e.moves.length>0){const c=e.moves.slice(-1)[0];if(c.piece.name===W.PAWN&&c.newCell.row===this.cell.row&&c.newCell.col===this.cell.col+1&&2===Math.abs(c.newCell.row-c.oldCell.row)){const e=new P(new H(l,o),new H(n,s),this,!0);t.push(e)}}if(n=this.cell.row+1*this.colour,s=this.cell.col-1,e.canEat(n,s,this.colour)){const c=new P(new H(l,o),new H(n,s),this,void 0,void 0,e.getPiece(n,s),0===n||7===n);t.push(c)}if(e.canMove(n,s)&&e.moves.length>0){const c=e.moves.slice(-1)[0];if(c.piece.name===W.PAWN&&c.newCell.row===this.cell.row&&c.newCell.col===this.cell.col-1&&2===Math.abs(c.newCell.row-c.oldCell.row)){const e=new P(new H(l,o),new H(n,s),this,!0);t.push(e)}}return t};isCheck=(e,l)=>{const o=l.cell.row,t=l.cell.col,n=this.cell.row+1*this.colour,s=this.cell.col+1,c=this.cell.col-1;return n===o&&(s===t||c===t)};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col;if(e.isEnPassant){const t=l.moves.slice(-1)[0],n=o[t.newCell.row][t.newCell.col];null!==n&&(e.ate=n),o[t.newCell.row][t.newCell.col]=null}const s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new H(t,n),e.isPromotion&&(o[t][n]=new L(this.colour,this.cell))};getString=()=>(this.colour===W.WHITE?"w":"b")+"p"}class L extends W{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];points=900;name=W.QUEEN;whiteScore=[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]];blackScore=[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,5,0,0,0,0,-10],[-10,5,5,5,5,5,0,-10],[0,0,5,5,5,5,0,-5],[-5,0,5,5,5,5,0,-5],[-10,0,5,5,5,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=this.cell.row,n=this.cell.col,s=o[0],c=o[1];let i=s+t,r=c+n;for(;e.canMove(i,r)||e.canEat(i,r,this.colour);){const o=new P(new H(t,n),new H(i,r),this);if(l.push(o),e.canEat(i,r,this.colour))break;i+=s,r+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col;if(Math.abs(o-n)!==Math.abs(t-s)&&s!==t&&n!==o)return!1;const c=this.cell.row,i=this.cell.col;for(const r of this.directions){const l=r[0],o=r[1];let t=l+c,n=o+i;for(;e.canMove(t,n)||e.canEat(t,n,this.colour);){if(e.canEat(t,n,this.colour)){if(e.getPiece(t,n).name===W.KING)return!0;break}t+=l,n+=o}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new H(t,n)};getString=()=>(this.colour===W.WHITE?"w":"b")+"q"}class N extends W{directions=[[0,1],[1,0],[0,-1],[-1,0]];points=500;name=W.ROOK;whiteScore=[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]];blackScore=[[0,0,4,5,5,10,0,0],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[5,10,10,10,10,10,10,5],[0,0,0,0,0,0,0,0]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=this.cell.row,n=this.cell.col,s=o[0],c=o[1];let i=s+t,r=c+n;for(;e.canMove(i,r)||e.canEat(i,r,this.colour);){const o=new P(new H(t,n),new H(i,r),this);if(l.push(o),e.canEat(i,r,this.colour))break;i+=s,r+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row;if(l.cell.col!==t&&n!==o)return!1;for(const s of this.directions){const l=this.cell.row,o=this.cell.col,t=s[0],n=s[1];let c=t+l,i=n+o;for(;e.canMove(c,i)||e.canEat(c,i,this.colour);){if(e.canEat(c,i,this.colour)){if(e.getPiece(c,i).name===W.KING)return!0;break}c+=t,i+=n}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new H(t,n)};getString=()=>(this.colour===W.WHITE?"w":"b")+"r"}try{const o=l.data,t=o[0],n=o[1],s=o[2],c=o[3],i=o[4];if(e=s.length,0===e){if(c===W.WHITE){const e=[new P(new H(6,3),new H(4,3),new B(W.WHITE,new H(6,3))),new P(new H(6,4),new H(4,4),new B(W.WHITE,new H(6,4)))],l=Math.round(Math.random()*(e.length-1));postMessage([e[l].getMoveString(),i])}}else if(1===e){const e=s.map((e=>P.parseMove(void 0,e)))[0];if(6===e.oldCell.row&&4===e.oldCell.col&&4===e.newCell.row&&4===e.newCell.col){const e=[new P(new H(1,2),new H(3,2),new B(W.BLACK,new H(1,2))),new P(new H(1,4),new H(3,4),new B(W.BLACK,new H(1,4)))],l=Math.round(Math.random()*(e.length-1));postMessage([e[l].getMoveString(),i])}else{const e=d(t,n,s,c,i);postMessage(e)}}else{const e=d(t,n,s,c,i);postMessage(e)}}catch(G){postMessage([{isError:!0,message:"Error: "+G}])}}))}();
//# sourceMappingURL=worker.worker.44860ca9.worker.js.map
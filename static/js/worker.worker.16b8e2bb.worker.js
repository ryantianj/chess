!function(){let e=0;self.addEventListener("message",(async l=>{const o=new Map;let t=!0,n=!0;const s=Array.from({length:10},(e=>0)),c=Array.from({length:10},(e=>Array.from({length:10},(e=>0))));let i,r=[];const w=1e5;let a=0,h=0;const u=(l,t,n,s,w)=>{const u=new v;u.setBoardString(l),u.moves=n.map((e=>I.parseMove(u,e)));for(let e=2;e<w.length;e++)c[0][e-2]=I.parseMove(u,w[e]);const C=c[0];r=[...C];u.isEndGame()&&(console.log("endgame"),u.setEndGame()),u.updatePieceValues(e);for(let e=1;e<t;e++)o.set(e,[null,null,null]);let d;i=performance.now();for(let e=1;e<=t;e++){d=f(u,e,-Number.MAX_VALUE,Number.MAX_VALUE,s,s,o,0);const l=c[0];r=[...l],console.log(e,"Score",d[1],c[0][0].newCell)}const p=performance.now(),g=[];for(let e=0;e<t&&0!==c[0][e];e++)g.push(c[0][e].getMoveString());return console.log(p-i,a,h),[c[0][0].getMoveString(),g]},f=(e,l,o,t,n,r,h,u)=>{if(a%w===0&&performance.now()-i>2e4)return[c[0][0],-99999];const f=e.getAllMoves(r);let p;if(d(f,l,u),r===n){let i=-9e4,w=0;for(let a=0;a<f.length;a++){const d=f[a];if(e.movePiece(d.piece,d),e.isIllegal(r,d)){e.undoMove();continue}w++,void 0===p&&(p=d);const g=C(e,l-1,o,t,n,-1*r,f,h,u+1,1===w);if(e.undoMove(),g>i){i=g,p=d,c[u][u]=d;for(let e=u+1;e<s[u+1];e++)c[u][e]=c[u+1][e];s[u]=s[u+1]}if(t<=(o=Math.max(o,g)))break}return 0===w?e.isCheck(r)?[null,-9e4]:[null,0]:[p,i]}{let i=9e4,w=0;for(let a=0;a<f.length;a++){const d=f[a];if(e.movePiece(d.piece,d),e.isIllegal(r,d)){e.undoMove();continue}w++,void 0===p&&(p=d);const g=C(e,l-1,o,t,n,-1*r,f,h,u+1,1===w);if(e.undoMove(),g<i){i=g,p=d,c[u][u]=d;for(let e=u+1;e<s[u+1];e++)c[u][e]=c[u+1][e];s[u]=s[u+1]}if((t=Math.min(t,g))<=o)break}return 0===w?e.isCheck(r)?[null,9e4]:[null,0]:[p,i]}},C=(e,l,o,t,n,r,u,f,d,E)=>{if(a%w===0&&performance.now()-i>2e4)return-99999;let v=0;a++;if(s[d]=d,0===l){let l;return l=n===r&&null!==e.moves.slice(-1)[0].ate?S(o,t,e,r,2,u):e.getScore(n,u),l}const k=e.getAllMoves(r);if(p(k,f,l,d,E),r===n){let i=-3e4,w=0;for(let a=0;a<k.length;a++){const h=k[a];if(e.movePiece(h.piece,h),e.isIllegal(r,h)){e.undoMove();continue}w++,v++;const u=C(e,l-1,o,t,n,-1*r,k,f,d+1,1===w);if(e.undoMove(),u>i){i=u,c[d][d]=h;for(let e=d+1;e<s[d+1];e++)c[d][e]=c[d+1][e];s[d]=s[d+1]}if(u>o&&(o=u),t<=o){if(null!==h.ate)break;const e=f.get(l);if(e.find((e=>null!==e&&g(e,h))))break;for(let l=0;l>=0;l--)e[l+1]=e[l];e[0]=h;break}}return h=(h+v)/2,0===w?e.isCheck(r)?-3e4*l:0:i}{let i=3e4,w=0;for(let a=0;a<k.length;a++){const h=k[a];if(e.movePiece(h.piece,h),e.isIllegal(r,h)){e.undoMove();continue}w++,v++;const p=C(e,l-1,o,t,n,-1*r,u,f,d+1,1===w);if(e.undoMove(),p<i){i=p,c[d][d]=h;for(let e=d+1;e<s[d+1];e++)c[d][e]=c[d+1][e];s[d]=s[d+1]}if(p<t&&(t=p),t<=o){if(null!==h.ate)break;const e=f.get(l);if(e.find((e=>null!==e&&g(e,h))))break;for(let l=0;l>=0;l--)e[l+1]=e[l];e[0]=h;break}}return h=(h+v)/2,0===w?e.isCheck(r)?3e4*l:0:i}},d=(e,l,o)=>{e.sort(((e,l)=>{const t=r[o];if(0!==t&&g(e,t))return-1;if(0!==t&&g(l,t))return 1;if(null!==e.ate&&null!==l.ate){return e.piece.points-e.ate.points<l.piece.points-l.ate.points?-1:1}if(null!==e.ate)return-1;if(null!==l.ate)return 1;return(e.piece.colour===m.WHITE?e.piece.whiteScore[e.newCell.row][e.newCell.col]:e.piece.blackScore[e.newCell.row][e.newCell.col])<(l.piece.colour===m.WHITE?l.piece.whiteScore[l.newCell.row][l.newCell.col]:l.piece.blackScore[l.newCell.row][l.newCell.col])?1:-1}))},p=(e,l,o,t,n)=>{e.sort(((e,s)=>{const c=r[t];if(n&&0!==c){if(g(e,c))return-1;if(g(s,c))return 1}if(null!==e.ate&&null!==s.ate){return e.piece.points-e.ate.points<s.piece.points-s.ate.points?-1:1}{if(null!==e.ate)return-1;if(null!==s.ate)return 1;const t=l.get(o);for(let l=0;l<t.length;l++){const o=t[l];if(null!==o&&g(e,o))return-1;if(null!==o&&g(s,o))return 1}return(e.piece.colour===m.WHITE?e.piece.whiteScore[e.newCell.row][e.newCell.col]:e.piece.blackScore[e.newCell.row][e.newCell.col])<(s.piece.colour===m.WHITE?s.piece.whiteScore[s.newCell.row][s.newCell.col]:s.piece.blackScore[s.newCell.row][s.newCell.col])?1:-1}}))},g=(e,l)=>e.newCell.row===l.newCell.row&&e.newCell.col===l.newCell.col&&e.oldCell.row===l.oldCell.row&&e.oldCell.col===l.oldCell.col&&e.piece.constructor===l.piece.constructor&&(null!==e.ate&&null!==l.ate?e.ate.constructor===l.ate.constructor:e.ate===l.ate),E=(e,l)=>{if(null!==e.ate&&null!==l.ate){return e.piece.points-e.ate.points<l.piece.points-l.ate.points?-1:1}if(null!==e.ate)return-1;if(null!==l.ate)return 1;return(e.piece.colour===m.WHITE?e.piece.whiteScore[e.newCell.row][e.newCell.col]:e.piece.blackScore[e.newCell.row][e.newCell.col])<(l.piece.colour===m.WHITE?l.piece.whiteScore[l.newCell.row][l.newCell.col]:l.piece.blackScore[l.newCell.row][l.newCell.col])?1:-1},S=(e,l,o,t,n,s)=>{const c=o.getScore(t,s);if(0===n)return c;if(c>=l)return l;e=Math.max(e,c);const i=o.getAllMoves(t);i.sort(E);for(let r=0;r<i.length;r++){const c=i[r];if(null===c.ate)break;{o.movePiece(c.piece,c);let i=-S(-l,-e,o,-1*t,n-1,s);if(o.undoMove(),i>=l)return l;i>e&&(e=i)}}return e};class v{board;constructor(){this.board=this.newBoard(),this.moves=[]}newBoard=()=>[[new K(m.BLACK,new k(0,0)),new P(m.BLACK,new k(0,1)),new M(m.BLACK,new k(0,2)),new W(m.BLACK,new k(0,3)),new b(m.BLACK,new k(0,4)),new M(m.BLACK,new k(0,5)),new P(m.BLACK,new k(0,6)),new K(m.BLACK,new k(0,7))],[new H(m.BLACK,new k(1,0)),new H(m.BLACK,new k(1,1)),new H(m.BLACK,new k(1,2)),new H(m.BLACK,new k(1,3)),new H(m.BLACK,new k(1,4)),new H(m.BLACK,new k(1,5)),new H(m.BLACK,new k(1,6)),new H(m.BLACK,new k(1,7))],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[new H(m.WHITE,new k(6,0)),new H(m.WHITE,new k(6,1)),new H(m.WHITE,new k(6,2)),new H(m.WHITE,new k(6,3)),new H(m.WHITE,new k(6,4)),new H(m.WHITE,new k(6,5)),new H(m.WHITE,new k(6,6)),new H(m.WHITE,new k(6,7))],[new K(m.WHITE,new k(7,0)),new P(m.WHITE,new k(7,1)),new M(m.WHITE,new k(7,2)),new W(m.WHITE,new k(7,3)),new b(m.WHITE,new k(7,4)),new M(m.WHITE,new k(7,5)),new P(m.WHITE,new k(7,6)),new K(m.WHITE,new k(7,7))]];setEndGame=()=>{for(let e=0;e<8;e++)for(let l=0;l<8;l++){const o=this.getPiece(e,l);null!==o&&void 0!==o.whiteScoreEnd&&(o.colour===m.WHITE?o.whiteScore=o.whiteScoreEnd:o.blackScore=o.blackScoreEnd)}};updatePieceValues=e=>{(this.kingHasMoved(m.WHITE)||this.rookHasMoved(m.WHITE,b.KING_SIDE)||this.rookHasMoved(m.WHITE,b.QUEEN_SIDE))&&(t=!1),(this.kingHasMoved(m.BLACK)||this.rookHasMoved(m.BLACK,b.KING_SIDE)||this.rookHasMoved(m.BLACK,b.QUEEN_SIDE))&&(n=!1);let l=0,o=0;for(let t=0;t<8;t++)for(let e=0;e<8;e++){const n=this.getPiece(t,e);null!==n&&n instanceof H&&(n.colour===m.WHITE?l++:o++)}const s=[];for(let t=0;t<8;t++){let e=!1;for(let l=0;l<8;l++){const o=this.getPiece(l,t);if(null!==o&&o instanceof H){e=!0;break}}e||s.push(t)}for(let t=0;t<8;t++)for(let n=0;n<8;n++){const c=this.getPiece(t,n);if(null!==c){if(c instanceof W&&e<=12&&(c.colour===m.WHITE?c.whiteScore[7][3]+=50:c.blackScore[0][3]+=50),c instanceof P&&(c.points-=3*(16-l-o),e<=12&&(c.colour===m.WHITE?(c.whiteScore[7][1]-=50,c.whiteScore[7][6]-=50):(c.blackScore[0][1]-=50,c.blackScore[0][6]-=50))),c instanceof M&&(c.points+=3*(16-l-o),e<=12&&(c.colour===m.WHITE?(c.whiteScore[7][2]-=50,c.whiteScore[7][5]-=50):(c.blackScore[0][2]-=50,c.blackScore[0][5]-=50))),c instanceof K){c.points+=3*(16-l-o);for(const e of s)for(let l=0;l<8;l++)c.whiteScore[l][e]+=15,c.blackScore[l][e]+=15}if(c instanceof H){let e=!0;if(n+1<8)if(c.colour===m.WHITE)for(let o=t-1;o>=0;o--)this.getPiece(o,n+1)instanceof H&&(e=!1);else for(let o=t+1;o<8;o++)this.getPiece(o,n+1)instanceof H&&(e=!1);if(n<8)if(c.colour===m.WHITE)for(let o=t-1;o>=0;o--)this.getPiece(o,n)instanceof H&&(e=!1);else for(let o=t+1;o<8;o++)this.getPiece(o,n)instanceof H&&(e=!1);if(n-1>=0)if(c.colour===m.WHITE)for(let o=t-1;o>=0;o--)this.getPiece(o,n-1)instanceof H&&(e=!1);else for(let o=t+1;o<8;o++)this.getPiece(o,n-1)instanceof H&&(e=!1);e&&(c.colour===m.WHITE?c.points+=20*(6-t):c.points+=20*(t-1));let l=!1;for(let o=0;o<8;o++)c instanceof H&&o!==t&&(l=!0);l&&(c.points-=10)}}}};isEndGame=()=>{let e=0,l=0,o=0,t=0;for(let n=0;n<8;n++)for(let s=0;s<8;s++){const c=this.getPiece(n,s);c instanceof W&&(c.colour===m.WHITE?o++:t++),(c instanceof K||c instanceof M||c instanceof P)&&(c.colour===m.WHITE?e++:l++)}return o<=1&&e<=1||t<=1&&l<=1||e<=3&&o<=0||l<=3&&t<=0};setBoardString=e=>{const l=[];for(let o=0;o<8;o++){const t=[];for(let l=0;l<8;l++){const n=e[o][l];if(null===n)t.push(null);else{const e="w"===n.slice(0,1)?m.WHITE:m.BLACK,s=n.slice(1,2);"b"===s?t.push(new M(e,new k(o,l))):"k"===s?t.push(new b(e,new k(o,l))):"n"===s?t.push(new P(e,new k(o,l))):"p"===s?t.push(new H(e,new k(o,l))):"q"===s?t.push(new W(e,new k(o,l))):"r"===s?t.push(new K(e,new k(o,l))):t.push(null)}}l.push(t)}this.board=l};getBoardHash=()=>{let e="";for(let l=0;l<8;l++)for(let o=0;o<8;o++)this.isEmpty(l,o)?e+=" ":e+=this.getPiece(l,o).getString();return e};getBoard=()=>this.board;getPiece=(e,l)=>this.board[e][l];isEmpty=(e,l)=>!this.isOutSide(e,l)&&null===this.board[e][l];isUnderCheck=e=>!1;isOutSide=(e,l)=>e<0||l<0||e>7||l>7;canEat=(e,l,o)=>!this.isOutSide(e,l)&&!this.isEmpty(e,l)&&this.getPiece(e,l).colour!==o;canMove=(e,l)=>!this.isOutSide(e,l)&&this.isEmpty(e,l);canKingMove=(e,l,o)=>{const t=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];for(const n of t){const t=e+n[0],s=l+n[1];if(!this.isOutSide(t,s)&&!this.isEmpty(t,s)&&this.getPiece(t,s).name===m.KING&&this.getPiece(t,s).colour!==o)return!1}return!0};movePiece=(e,l)=>{l.piece.movePiece(l,this),this.moves.push(l)};undoMove=()=>{if(this.moves.length>0){const e=this.moves.pop(),l=e.oldCell.row,o=e.oldCell.col,t=this.board[e.newCell.row][e.newCell.col];return null===t&&console.log(this.getBoardString(),e),this.board[l][o]=t,t.cell.row=l,t.cell.col=o,e.isEnPassant?(this.board[e.ate.cell.row][e.ate.cell.col]=e.ate,this.board[e.newCell.row][e.newCell.col]=null,!0):(e.isPromotion?this.board[l][o]=new H(t.colour,t.cell,t.moves):e.castle.isCastle&&(this.board[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=e.castle.rook.piece,e.castle.rook.piece.cell.row=e.castle.rook.oldCell.row,e.castle.rook.piece.cell.col=e.castle.rook.oldCell.col,this.board[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=null),this.board[e.newCell.row][e.newCell.col]=e.ate,!0)}return!1};kingHasMoved=e=>{for(let l=0;l<this.moves.length;l++){const o=this.moves[l];if(o.piece.name===m.KING&&o.piece.colour===e)return!0}return!1};rookHasMoved=(e,l)=>{const o=e===m.BLACK?0:7,t=l===b.KING_SIDE?7:0;if(null===this.getPiece(o,t)||this.getPiece(o,t).name!==m.ROOK)return!0;for(const n of this.moves)if(n.piece.name===m.ROOK&&n.piece.colour===e&&n.oldCell.row===o&&n.oldCell.col===t)return!0;return!1};castlingSquaresIsEmpty=(e,l)=>{const o=e===m.BLACK?0:7,t=l===b.KING_SIDE?[5,6]:[1,2,3];for(const n of t)if(!this.isEmpty(o,n))return!1;return!0};isIllegal=(e,l)=>{let o;for(let t=0;t<8;t++)for(let l=0;l<8;l++)if(!this.isEmpty(t,l)){const n=this.getPiece(t,l);n.name===m.KING&&n.colour===e&&(o=n)}if(l.castle.isCastle){const o=this.getAllMoves(-1*e),t=l.newCell.row;if(6===l.newCell.col)for(const e of o){const l=e.newCell.row,o=e.newCell.col;if(l===t&&(6===o||5===o||4===o))return!0}else for(const e of o){const l=e.newCell.row,o=e.newCell.col;if(l===t&&(1===o||2===o||3===o||4===o))return!0}}for(let t=0;t<8;t++)for(let l=0;l<8;l++)if(!this.isEmpty(t,l)&&this.getPiece(t,l).colour!==e){if(this.getPiece(t,l).isCheck(this,o))return!0}return!1};isCheck=e=>{let l;for(let o=0;o<8;o++)for(let t=0;t<8;t++)if(!this.isEmpty(o,t)){const n=this.getPiece(o,t);n.name===m.KING&&n.colour===e&&(l=n)}for(let o=0;o<8;o++)for(let t=0;t<8;t++)if(!this.isEmpty(o,t)&&this.getPiece(o,t).colour!==e){if(this.getPiece(o,t).isCheck(this,l))return!0}return!1};getAllMoves=e=>{let l=[];for(let o=0;o<8;o++)for(let t=0;t<8;t++)if(!this.isEmpty(o,t)&&this.getPiece(o,t).colour===e){const e=this.getPiece(o,t).getMoves(this);l=l.concat(e)}return l};scanSquaresScore=()=>{let e=0,l=0;for(let o=0;o<8;o++)for(let t=0;t<8;t++){const n=this.getPiece(o,t);null!==n&&(n.colour===m.WHITE?l+=n.points:l-=n.points,n.colour===m.WHITE?e+=n.whiteScore[o][t]:e-=n.blackScore[o][t])}return e+l};getScore=(e,l)=>(this.scanSquaresScore()+5*l.length)*e*-1;getBoardString=()=>{const e=[];for(let l=0;l<8;l++){const o=[];for(let e=0;e<8;e++){const t=this.getPiece(l,e);null!==t?o.push(t.getString()):o.push(null)}e.push(o)}return e}}class k{constructor(e,l){this.row=e,this.col=l}}class I{oldCell;newCell;constructor(e,l,o,t=!1,n={isCastle:!1},s=null,c=!1){this.oldCell=e,this.newCell=l,this.piece=o,this.isEnPassant=t,this.castle=n,this.ate=s,this.isPromotion=c}getMoveString=()=>({oldCellRow:this.oldCell.row,oldCellCol:this.oldCell.col,newCellRow:this.newCell.row,newCellCol:this.newCell.col,pieceString:this.piece.getString(),isEnPassant:this.isEnPassant,castle:!1===this.castle.isCastle?{isCastle:!1}:{isCastle:!0,rook:{pieceString:this.castle.rook.piece.getString(),oldCellRow:this.castle.rook.oldCell.row,oldCellCol:this.castle.rook.oldCell.col,newCellRow:this.castle.rook.newCell.row,newCellCol:this.castle.rook.newCell.col}},ate:null!==this.ate?this.ate.getString():null,isPromotion:this.isPromotion});static parseMove=(e,l)=>{const o=new I(new k(l.oldCellRow,l.oldCellCol),new k(l.newCellRow,l.newCellCol),m.parsePieceString(l.pieceString),l.isEnPassant,{isCastle:!1},null,l.isPromotion);if(l.castle.isCastle){const t=l.castle.rook;o.castle.isCastle=!0,o.castle.rook=new I(new k(t.oldCellRow,t.oldCellCol),new k(t.newCellRow,t.newCellCol),e.getPiece(t.oldCellRow,t.oldCellCol))}return o}}class m{static WHITE=-1;static BLACK=1;static ROOK="r";static BISHOP="b";static KNIGHT="n";static KING="k";static QUEEN="q";static PAWN="p";constructor(e,l){this.colour=e,this.cell=l}static parsePieceString=e=>{const l="w"===e.slice(0,1)?m.WHITE:m.BLACK,o=e.slice(1,2);return"b"===o?new M(l,new k(0,0)):"k"===o?new b(l,new k(0,0)):"n"===o?new P(l,new k(0,0)):"p"===o?new H(l,new k(0,0)):"q"===o?new W(l,new k(0,0)):"r"===o?new K(l,new k(0,0)):null}}class M extends m{directions=[[1,1],[-1,-1],[1,-1],[-1,1]];points=330;name=m.BISHOP;whiteScore=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];blackScore=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],[-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[],o=this.cell.row,t=this.cell.col;for(const n of this.directions){const s=n[0],c=n[1];let i=s+o,r=c+t;for(;e.canMove(i,r)||e.canEat(i,r,this.colour);){const n=new I(new k(o,t),new k(i,r),this);if(l.push(n),e.canEat(i,r,this.colour))break;i+=s,r+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col;if(Math.abs(o-n)!==Math.abs(t-s))return!1;const c=this.cell.row,i=this.cell.col;for(const r of this.directions){const l=r[0],o=r[1];let t=l+c,n=o+i;for(;e.canMove(t,n)||e.canEat(t,n,this.colour);){if(e.canEat(t,n,this.colour)){if(e.getPiece(t,n).name===m.KING)return!0;break}t+=l,n+=o}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new k(t,n)};getString=()=>(this.colour===m.WHITE?"w":"b")+"b"}class b extends m{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];static KING_SIDE=-1;static QUEEN_SIDE=1;name=m.KING;points=1e4;whiteScore=[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]];blackScore=[[20,30,10,0,0,10,30,20],[20,20,0,0,0,0,20,20],[-10,-20,-20,-20,-20,-20,-20,-10],[-20,-30,-30,-40,-40,-30,-30,-20],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30]];whiteScoreEnd=[[-50,-40,-30,-20,-20,-30,-40,-50],[-30,-20,-10,0,0,-10,-20,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-30,0,0,0,0,-30,-30],[-50,-30,-30,-30,-30,-30,-30,-50]];blackScoreEnd=[[-50,-30,-30,-30,-30,-30,-30,-50],[-30,-30,0,0,0,0,-30,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-20,-10,0,0,-10,-20,-30],[-50,-40,-30,-20,-20,-30,-40,-50]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[],o=this.cell.row,s=this.cell.col;for(const t of this.directions){const n=t[0]+o,c=t[1]+s;if((e.canEat(n,c,this.colour)||e.canMove(n,c))&&e.canKingMove(n,c,this.colour)){const e=new I(new k(o,s),new k(n,c),this);l.push(e)}}if(t&&e.castlingSquaresIsEmpty(this.colour,b.KING_SIDE)&&!e.rookHasMoved(this.colour,b.KING_SIDE)&&!e.kingHasMoved(this.colour)){const t=this.colour===m.BLACK?0:7,n=6;l.push(new I(new k(o,s),new k(t,n),this,!1,{isCastle:!0,rook:new I(new k(t,7),new k(t,5),e.getPiece(t,7))}))}if(n&&e.castlingSquaresIsEmpty(this.colour,b.QUEEN_SIDE)&&!e.rookHasMoved(this.colour,b.QUEEN_SIDE)&&!e.kingHasMoved(this.colour)){const t=this.colour===m.BLACK?0:7,n=2;l.push(new I(new k(o,s),new k(t,n),this,!1,{isCastle:!0,rook:new I(new k(t,0),new k(t,3),e.getPiece(t,0))}))}return l};isCheck=(e,l)=>!1;movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col;e.castle.isCastle&&(o[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=e.castle.rook.piece,o[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=null,e.castle.rook.piece.cell.row=e.castle.rook.newCell.row,e.castle.rook.piece.cell.col=e.castle.rook.newCell.col);const s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new k(t,n)};getString=()=>(this.colour===m.WHITE?"w":"b")+"k"}class P extends m{directions=[[1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]];points=320;name=m.KNIGHT;whiteScore=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];blackScore=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,5,5,0,-20,-40],[-30,5,10,15,15,10,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,10,15,15,10,0,-30],[-40,-20,0,0,0,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=o[0],n=o[1],s=this.cell.row,c=this.cell.col,i=t+s,r=n+c;if(e.canEat(i,r,this.colour)||e.canMove(i,r)){const e=new I(new k(s,c),new k(i,r),this);l.push(e)}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col,c=Math.abs(o-n),i=Math.abs(t-s);return c+i===3&&!(0===c||0===i)};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new k(t,n)};getString=()=>(this.colour===m.WHITE?"w":"b")+"n"}class H extends m{points=100;name=m.PAWN;whiteScore=[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];whiteScoreEnd=[[100,100,100,100,100,100,100,100],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];blackScore=[[0,0,0,0,0,0,0,0],[5,10,10,-40,-40,10,10,5],[5,10,20,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[0,0,0,0,0,0,0,0]];blackScoreEnd=[[0,0,0,0,0,0,0,0],[5,10,10,-40,-40,10,10,5],[5,10,20,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[100,100,100,100,100,100,100,100]];constructor(e,l){super(e,l)}getMoves=e=>{const l=this.cell.row,o=this.cell.col,t=[];let n=this.cell.row+1*this.colour,s=this.cell.col;if(e.canMove(n,s)){const c=new I(new k(l,o),new k(n,s),this,void 0,void 0,void 0,0===n||7===n);if(t.push(c),n=this.cell.row+2*this.colour,e.canMove(n,s)&&(3===n||4===n))if(this.colour===m.BLACK&&1===this.cell.row){const e=new I(new k(l,o),new k(n,s),this);t.push(e)}else if(this.colour===m.WHITE&&6===this.cell.row){const e=new I(new k(l,o),new k(n,s),this);t.push(e)}}if(n=this.cell.row+1*this.colour,s=this.cell.col+1,e.canEat(n,s,this.colour)){const c=new I(new k(l,o),new k(n,s),this,void 0,void 0,e.getPiece(n,s),0===n||7===n);t.push(c)}if(e.canMove(n,s)&&e.moves.length>0){const c=e.moves.slice(-1)[0];if(c.piece.name===m.PAWN&&c.newCell.row===this.cell.row&&c.newCell.col===this.cell.col+1&&2===Math.abs(c.newCell.row-c.oldCell.row)){const e=new I(new k(l,o),new k(n,s),this,!0);t.push(e)}}if(n=this.cell.row+1*this.colour,s=this.cell.col-1,e.canEat(n,s,this.colour)){const c=new I(new k(l,o),new k(n,s),this,void 0,void 0,e.getPiece(n,s),0===n||7===n);t.push(c)}if(e.canMove(n,s)&&e.moves.length>0){const c=e.moves.slice(-1)[0];if(c.piece.name===m.PAWN&&c.newCell.row===this.cell.row&&c.newCell.col===this.cell.col-1&&2===Math.abs(c.newCell.row-c.oldCell.row)){const e=new I(new k(l,o),new k(n,s),this,!0);t.push(e)}}return t};isCheck=(e,l)=>{const o=l.cell.row,t=l.cell.col,n=this.cell.row+1*this.colour,s=this.cell.col+1,c=this.cell.col-1;return n===o&&(s===t||c===t)};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col;if(e.isEnPassant){const t=l.moves.slice(-1)[0],n=o[t.newCell.row][t.newCell.col];null!==n&&(e.ate=n),o[t.newCell.row][t.newCell.col]=null}const s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new k(t,n),e.isPromotion&&(o[t][n]=new W(this.colour,this.cell))};getString=()=>(this.colour===m.WHITE?"w":"b")+"p"}class W extends m{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];points=900;name=m.QUEEN;whiteScore=[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]];blackScore=[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,5,0,0,0,0,-10],[-10,5,5,5,5,5,0,-10],[0,0,5,5,5,5,0,-5],[-5,0,5,5,5,5,0,-5],[-10,0,5,5,5,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=this.cell.row,n=this.cell.col,s=o[0],c=o[1];let i=s+t,r=c+n;for(;e.canMove(i,r)||e.canEat(i,r,this.colour);){const o=new I(new k(t,n),new k(i,r),this);if(l.push(o),e.canEat(i,r,this.colour))break;i+=s,r+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col;if(Math.abs(o-n)!==Math.abs(t-s)&&s!==t&&n!==o)return!1;const c=this.cell.row,i=this.cell.col;for(const r of this.directions){const l=r[0],o=r[1];let t=l+c,n=o+i;for(;e.canMove(t,n)||e.canEat(t,n,this.colour);){if(e.canEat(t,n,this.colour)){if(e.getPiece(t,n).name===m.KING)return!0;break}t+=l,n+=o}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new k(t,n)};getString=()=>(this.colour===m.WHITE?"w":"b")+"q"}class K extends m{directions=[[0,1],[1,0],[0,-1],[-1,0]];points=500;name=m.ROOK;whiteScore=[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]];blackScore=[[0,0,4,5,5,10,0,0],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[5,10,10,10,10,10,10,5],[0,0,0,0,0,0,0,0]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=this.cell.row,n=this.cell.col,s=o[0],c=o[1];let i=s+t,r=c+n;for(;e.canMove(i,r)||e.canEat(i,r,this.colour);){const o=new I(new k(t,n),new k(i,r),this);if(l.push(o),e.canEat(i,r,this.colour))break;i+=s,r+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row;if(l.cell.col!==t&&n!==o)return!1;for(const s of this.directions){const l=this.cell.row,o=this.cell.col,t=s[0],n=s[1];let c=t+l,i=n+o;for(;e.canMove(c,i)||e.canEat(c,i,this.colour);){if(e.canEat(c,i,this.colour)){if(e.getPiece(c,i).name===m.KING)return!0;break}c+=t,i+=n}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new k(t,n)};getString=()=>(this.colour===m.WHITE?"w":"b")+"r"}const T=l.data,A=T[0],B=T[1],L=T[2],N=T[3],G=T[4];if(e=L.length,0===e){if(N===m.WHITE){const e=[new I(new k(6,3),new k(4,3),new H(m.WHITE,new k(6,3))),new I(new k(6,4),new k(4,4),new H(m.WHITE,new k(6,4)))],l=Math.round(Math.random()*(e.length-1));postMessage(e[l].getMoveString())}}else if(1===e){const e=L.map((e=>I.parseMove(void 0,e)))[0];if(6===e.oldCell.row&&4===e.oldCell.col&&4===e.newCell.row&&4===e.newCell.col){const e=[new I(new k(1,2),new k(3,2),new H(m.BLACK,new k(1,2))),new I(new k(1,4),new k(3,4),new H(m.BLACK,new k(1,4)))],l=Math.round(Math.random()*(e.length-1));postMessage(e[l].getMoveString())}else{const e=u(A,B,L,N,G);postMessage(e)}}else{const e=u(A,B,L,N,G);postMessage(e)}}))}();
//# sourceMappingURL=worker.worker.16b8e2bb.worker.js.map
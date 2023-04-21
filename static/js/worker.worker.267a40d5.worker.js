!function(){let e=0,l=!1;self.addEventListener("message",(async o=>{const t=(o,t,s,i)=>{const w=new c;w.setBoardString(o),w.moves=s.map((e=>r.parseMove(w,e))),l=w.isEndGame(),l&&(console.log("endgame"),w.setEndGame()),w.updatePieceValues(e);const a=new Map,h=n(w,t,-Number.MAX_VALUE,Number.MAX_VALUE,i,i,t,a);return console.log("Score",h[1]),h[0]},n=(e,l,o,t,c,i,r,a)=>{if(0===l){let l;const o=e.getBoardHash()+c.toString(),t=a.get(o);return void 0!==t?l=t:(l=e.getScore(c),a.set(o,l)),[null,l]}const h=e.getAllMoves(i);let u;if(h.sort(s),i===c){let s=-9e4,C=0;for(const d of h){if(e.movePiece(d.piece,d),e.isIllegal(i,d)){C++,e.undoMove();continue}void 0===u&&(u=d);const h=n(e,l-1,o,t,c,i===w.BLACK?w.WHITE:w.BLACK,r,a)[1];if(e.undoMove(),h>s&&(s=h,u=d),t<=(o=Math.max(o,h)))break}return C===h.length?[null,-9e4]:[u,s]}{let s=9e4,C=0;for(const d of h){if(e.movePiece(d.piece,d),e.isIllegal(i,d)){C++,e.undoMove();continue}void 0===u&&(u=d);const h=n(e,l-1,o,t,c,i===w.BLACK?w.WHITE:w.BLACK,r,a)[1];if(e.undoMove(),h<s&&(s=h,u=d),(t=Math.min(t,h))<=o)break}return C===h.length?[null,9e4]:[u,s]}},s=(e,l)=>{if(null!==e.ate&&null!==l.ate){return e.piece.points-e.ate.points<l.piece.points-l.ate.points?-1:1}if(null!==e.ate)return-1;if(null!==l.ate)return 1;return(e.piece.colour===w.WHITE?e.piece.whiteScore[e.newCell.row][e.newCell.col]:e.piece.blackScore[e.newCell.row][e.newCell.col])<(l.piece.colour===w.WHITE?l.piece.whiteScore[l.newCell.row][l.newCell.col]:l.piece.blackScore[l.newCell.row][l.newCell.col])?1:-1};class c{board;constructor(){this.board=this.newBoard(),this.moves=[]}newBoard=()=>[[new f(w.BLACK,new i(0,0)),new u(w.BLACK,new i(0,1)),new a(w.BLACK,new i(0,2)),new d(w.BLACK,new i(0,3)),new h(w.BLACK,new i(0,4)),new a(w.BLACK,new i(0,5)),new u(w.BLACK,new i(0,6)),new f(w.BLACK,new i(0,7))],[new C(w.BLACK,new i(1,0)),new C(w.BLACK,new i(1,1)),new C(w.BLACK,new i(1,2)),new C(w.BLACK,new i(1,3)),new C(w.BLACK,new i(1,4)),new C(w.BLACK,new i(1,5)),new C(w.BLACK,new i(1,6)),new C(w.BLACK,new i(1,7))],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[new C(w.WHITE,new i(6,0)),new C(w.WHITE,new i(6,1)),new C(w.WHITE,new i(6,2)),new C(w.WHITE,new i(6,3)),new C(w.WHITE,new i(6,4)),new C(w.WHITE,new i(6,5)),new C(w.WHITE,new i(6,6)),new C(w.WHITE,new i(6,7))],[new f(w.WHITE,new i(7,0)),new u(w.WHITE,new i(7,1)),new a(w.WHITE,new i(7,2)),new d(w.WHITE,new i(7,3)),new h(w.WHITE,new i(7,4)),new a(w.WHITE,new i(7,5)),new u(w.WHITE,new i(7,6)),new f(w.WHITE,new i(7,7))]];setEndGame=()=>{for(let e=0;e<8;e++)for(let l=0;l<8;l++){const o=this.getPiece(e,l);null!==o&&void 0!==o.whiteScoreEnd&&(o.colour===w.WHITE?o.whiteScore=o.whiteScoreEnd:o.blackScore=o.blackScoreEnd)}};updatePieceValues=e=>{let l=0,o=0;for(let t=0;t<8;t++)for(let e=0;e<8;e++){const n=this.getPiece(t,e);null!==n&&n instanceof C&&(n.colour===w.WHITE?l++:o++)}for(let t=0;t<8;t++)for(let n=0;n<8;n++){const s=this.getPiece(t,n);if(null!==s&&(s instanceof d&&e<=10&&(s.colour===w.WHITE?s.whiteScore[7][3]+=50:s.blackScore[0][3]+=50),s instanceof u&&(s.points-=3*(16-l-o),e<=10&&(s.colour===w.WHITE?(s.whiteScore[7][1]-=50,s.whiteScore[7][6]-=50):(s.blackScore[0][1]-=50,s.blackScore[0][6]-=50))),s instanceof a&&(s.points+=3*(16-l-o),e<=10&&(s.colour===w.WHITE?(s.whiteScore[7][2]-=50,s.whiteScore[7][5]-=50):(s.blackScore[0][2]-=50,s.blackScore[0][5]-=50))),s instanceof f&&(s.points+=3*(16-l-o)),s instanceof C)){let e=!0;if(n+1<8)for(let o=0;o<8;o++)this.getPiece(o,n+1)instanceof C&&(e=!1);if(n-1>=0)for(let o=0;o<8;o++)this.getPiece(o,n-1)instanceof C&&(e=!1);e&&(s.points+=30);let l=!1;for(let o=0;o<8;o++)s instanceof C&&o!==t&&(l=!0);l&&(s.points-=10)}}};isEndGame=()=>{let e=0,l=0,o=0,t=0;for(let n=0;n<8;n++)for(let s=0;s<8;s++){const c=this.getPiece(n,s);c instanceof d&&(c.colour===w.WHITE?o++:t++),(c instanceof f||c instanceof a||c instanceof u)&&(c.colour===w.WHITE?e++:l++)}return o<=1&&e<=0||t<=1&&l<=0||e<=2&&o<=0||l<=2&&t<=0};setBoardString=e=>{const l=[];for(let o=0;o<8;o++){const t=[];for(let l=0;l<8;l++){const n=e[o][l];if(null===n)t.push(null);else{const e="w"===n.slice(0,1)?w.WHITE:w.BLACK,s=n.slice(1,2);"b"===s?t.push(new a(e,new i(o,l))):"k"===s?t.push(new h(e,new i(o,l))):"n"===s?t.push(new u(e,new i(o,l))):"p"===s?t.push(new C(e,new i(o,l))):"q"===s?t.push(new d(e,new i(o,l))):"r"===s?t.push(new f(e,new i(o,l))):t.push(null)}}l.push(t)}this.board=l};getBoardHash=()=>{let e="";for(let l=0;l<8;l++)for(let o=0;o<8;o++)this.isEmpty(l,o)?e+=" ":e+=this.getPiece(l,o).getString();return e};getBoard=()=>this.board;getPiece=(e,l)=>this.board[e][l];isEmpty=(e,l)=>!this.isOutSide(e,l)&&null===this.board[e][l];isUnderCheck=e=>!1;isOutSide=(e,l)=>e<0||l<0||e>7||l>7;canEat=(e,l,o)=>!this.isOutSide(e,l)&&!this.isEmpty(e,l)&&this.getPiece(e,l).colour!==o;canMove=(e,l)=>!this.isOutSide(e,l)&&this.isEmpty(e,l);canKingMove=(e,l,o)=>{const t=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];for(const n of t){const t=e+n[0],s=l+n[1];if(!this.isOutSide(t,s)&&!this.isEmpty(t,s)&&this.getPiece(t,s).name===w.KING&&this.getPiece(t,s).colour!==o)return!1}return!0};movePiece=(e,l)=>{const o=l.piece.movePiece(l,this);return this.moves.push(l),o};undoMove=()=>{if(this.moves.length>0){const e=this.moves.pop(),l=e.oldCell.row,o=e.oldCell.col,t=this.board[e.newCell.row][e.newCell.col];return null===t&&console.log(this.getBoardString(),e),this.board[l][o]=t,t.cell.row=l,t.cell.col=o,e.isEnPassant?(this.board[e.ate.cell.row][e.ate.cell.col]=e.ate,this.board[e.newCell.row][e.newCell.col]=null,!0):(e.isPromotion?this.board[l][o]=new C(t.colour,t.cell,t.moves):e.castle.isCastle&&(this.board[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=e.castle.rook.piece,e.castle.rook.piece.cell.row=e.castle.rook.oldCell.row,e.castle.rook.piece.cell.col=e.castle.rook.oldCell.col,this.board[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=null),this.board[e.newCell.row][e.newCell.col]=e.ate,!0)}return!1};kingHasMoved=e=>{for(const l of this.moves)if(l.piece.name===w.KING&&l.piece.colour===e)return!0;return!1};rookHasMoved=(e,l)=>{const o=e===w.BLACK?0:7,t=l===h.KING_SIDE?7:0;if(null===this.getPiece(o,t)||this.getPiece(o,t).name!==w.ROOK)return!0;for(const n of this.moves)if(n.piece.name===w.ROOK&&n.piece.colour===e&&n.oldCell.row===o&&n.oldCell.col===t)return!0;return!1};castlingSquaresIsEmpty=(e,l)=>{const o=e===w.BLACK?0:7,t=l===h.KING_SIDE?[5,6]:[1,2,3];for(const n of t)if(!this.isEmpty(o,n))return!1;return!0};isIllegal=(e,l)=>{let o;for(let t=0;t<8;t++)for(let l=0;l<8;l++)if(!this.isEmpty(t,l)){const n=this.getPiece(t,l);n.name===w.KING&&(n.colour===e&&(o=n))}if(l.isCastle){const o=this.getAllMoves(-1*e),t=l.newCell.row;if(6===l.newCell.col)for(const e of o){const l=e.newCell.row,o=e.newCell.col;if(l===t&&(6===o||5===o||4===o))return!0}else for(const e of o){const l=e.newCell.row,o=e.newCell.col;if(l===t&&(2===o||3===o||4===o))return!0}}for(let t=0;t<8;t++)for(let l=0;l<8;l++)if(!this.isEmpty(t,l)&&this.getPiece(t,l).colour!==e){if(this.getPiece(t,l).isCheck(this,o))return!0}return!1};getAllMoves=e=>{let l=[];for(let o=0;o<8;o++)for(let t=0;t<8;t++)if(!this.isEmpty(o,t)&&this.getPiece(o,t).colour===e){const e=this.getPiece(o,t).getMoves(this);l=l.concat(e)}return l};scanSquaresScore=e=>{let l=0,o=0;for(let t=0;t<8;t++)for(let e=0;e<8;e++){const n=this.getPiece(t,e);null!==n&&(n.colour===w.WHITE?o+=n.points:o-=n.points,n.colour===w.WHITE?l+=n.whiteScore[t][e]:l-=n.blackScore[t][e])}return l+o};getScore=e=>this.scanSquaresScore(e)*e*-1;getBoardString=()=>{const e=[];for(let l=0;l<8;l++){const o=[];for(let e=0;e<8;e++){const t=this.getPiece(l,e);null!==t?o.push(t.getString()):o.push(null)}e.push(o)}return e}}class i{constructor(e,l){this.row=e,this.col=l}}class r{oldCell;newCell;constructor(e,l,o,t=!1,n={isCastle:!1},s=null,c=!1){this.oldCell=e,this.newCell=l,this.piece=o,this.isEnPassant=t,this.castle=n,this.ate=s,this.isPromotion=c}getMoveString=()=>({oldCellRow:this.oldCell.row,oldCellCol:this.oldCell.col,newCellRow:this.newCell.row,newCellCol:this.newCell.col,pieceString:this.piece.getString(),isEnPassant:this.isEnPassant,castle:!1===this.castle.isCastle?{isCastle:!1}:{isCastle:!0,rook:{pieceString:this.castle.rook.piece.getString(),oldCellRow:this.castle.rook.oldCell.row,oldCellCol:this.castle.rook.oldCell.col,newCellRow:this.castle.rook.newCell.row,newCellCol:this.castle.rook.newCell.col}},ate:null!==this.ate?this.ate.getString():null,isPromotion:this.isPromotion});static parseMove=(e,l)=>{const o=new r(new i(l.oldCellRow,l.oldCellCol),new i(l.newCellRow,l.newCellCol),w.parsePieceString(l.pieceString),l.isEnPassant,{isCastle:!1},null,l.isPromotion);if(l.castle.isCastle){const t=l.castle.rook;o.castle.isCastle=!0,o.castle.rook=new r(new i(t.oldCellRow,t.oldCellCol),new i(t.newCellRow,t.newCellCol),e.getPiece(t.oldCellRow,t.oldCellCol))}return o}}class w{static WHITE=-1;static BLACK=1;static ROOK="r";static BISHOP="b";static KNIGHT="n";static KING="k";static QUEEN="q";static PAWN="p";constructor(e,l){this.colour=e,this.cell=l}static parsePieceString=e=>{const l="w"===e.slice(0,1)?w.WHITE:w.BLACK,o=e.slice(1,2);return"b"===o?new a(l,new i(0,0)):"k"===o?new h(l,new i(0,0)):"n"===o?new u(l,new i(0,0)):"p"===o?new C(l,new i(0,0)):"q"===o?new d(l,new i(0,0)):"r"===o?new f(l,new i(0,0)):null}}class a extends w{directions=[[1,1],[-1,-1],[1,-1],[-1,1]];points=330;name=w.BISHOP;whiteScore=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];blackScore=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],[-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[],o=this.cell.row,t=this.cell.col;for(const n of this.directions){const s=n[0],c=n[1];let w=s+o,a=c+t;for(;e.canMove(w,a)||e.canEat(w,a,this.colour);){const n=new r(new i(o,t),new i(w,a),this);if(l.push(n),e.canEat(w,a,this.colour))break;w+=s,a+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col;if(Math.abs(o-n)!==Math.abs(t-s))return!1;const c=this.cell.row,i=this.cell.col;for(const r of this.directions){const l=r[0],o=r[1];let t=l+c,n=o+i;for(;e.canMove(t,n)||e.canEat(t,n,this.colour);){if(e.canEat(t,n,this.colour)){if(e.getPiece(t,n).name===w.KING)return!0;break}t+=l,n+=o}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];return null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(t,n),{row:t,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"b"}class h extends w{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];static KING_SIDE=-1;static QUEEN_SIDE=1;name=w.KING;points=90001;whiteScore=[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]];blackScore=[[20,30,10,0,0,10,30,20],[20,20,0,0,0,0,20,20],[-10,-20,-20,-20,-20,-20,-20,-10],[-20,-30,-30,-40,-40,-30,-30,-20],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30]];whiteScoreEnd=[[-50,-40,-30,-20,-20,-30,-40,-50],[-30,-20,-10,0,0,-10,-20,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-30,0,0,0,0,-30,-30],[-50,-30,-30,-30,-30,-30,-30,-50]];blackScoreEnd=[[-50,-30,-30,-30,-30,-30,-30,-50],[-30,-30,0,0,0,0,-30,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,30,40,40,30,-10,-30],[-30,-10,20,30,30,20,-10,-30],[-30,-20,-10,0,0,-10,-20,-30],[-50,-40,-30,-20,-20,-30,-40,-50]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[],o=this.cell.row,t=this.cell.col;for(const n of this.directions){const s=n[0]+o,c=n[1]+t;if((e.canEat(s,c,this.colour)||e.canMove(s,c))&&e.canKingMove(s,c,this.colour)){const e=new r(new i(o,t),new i(s,c),this);l.push(e)}}if(e.castlingSquaresIsEmpty(this.colour,h.KING_SIDE)&&!e.rookHasMoved(this.colour,h.KING_SIDE)&&!e.kingHasMoved(this.colour)){const n=this.colour===w.BLACK?0:7,s=6;l.push(new r(new i(o,t),new i(n,s),this,!1,{isCastle:!0,rook:new r(new i(n,7),new i(n,5),e.getPiece(n,7))}))}if(e.castlingSquaresIsEmpty(this.colour,h.QUEEN_SIDE)&&!e.rookHasMoved(this.colour,h.QUEEN_SIDE)&&!e.kingHasMoved(this.colour)){const n=this.colour===w.BLACK?0:7,s=2;l.push(new r(new i(o,t),new i(n,s),this,!1,{isCastle:!0,rook:new r(new i(n,0),new i(n,3),e.getPiece(n,0))}))}return l};isCheck=(e,l)=>!1;movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col;e.castle.isCastle&&(o[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=e.castle.rook.piece,o[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=null,e.castle.rook.piece.cell.row=e.castle.rook.newCell.row,e.castle.rook.piece.cell.col=e.castle.rook.newCell.col);const s=o[t][n];return null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(t,n),{row:t,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"k"}class u extends w{directions=[[1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]];points=320;name=w.KNIGHT;whiteScore=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];blackScore=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,5,5,0,-20,-40],[-30,5,10,15,15,10,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,10,15,15,10,0,-30],[-40,-20,0,0,0,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=o[0],n=o[1],s=this.cell.row,c=this.cell.col,w=t+s,a=n+c;if(e.canEat(w,a,this.colour)||e.canMove(w,a)){const e=new r(new i(s,c),new i(w,a),this);l.push(e)}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col,c=Math.abs(o-n),i=Math.abs(t-s);return c+i===3&&!(0===c||0===i)};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];return null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(t,n),{row:t,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"n"}class C extends w{points=100;name=w.PAWN;whiteScore=[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];whiteScoreEnd=[[100,100,100,100,100,100,100,100],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];blackScore=[[0,0,0,0,0,0,0,0],[5,10,10,-40,-40,10,10,5],[5,10,20,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[0,0,0,0,0,0,0,0]];blackScoreEnd=[[0,0,0,0,0,0,0,0],[5,10,10,-40,-40,10,10,5],[5,10,20,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[100,100,100,100,100,100,100,100]];constructor(e,l){super(e,l)}getMoves=e=>{const l=this.cell.row,o=this.cell.col,t=[];let n=this.cell.row+1*this.colour,s=this.cell.col;if(e.canMove(n,s)){const c=new r(new i(l,o),new i(n,s),this,void 0,void 0,void 0,0===n||7===n);if(t.push(c),n=this.cell.row+2*this.colour,e.canMove(n,s)&&(3===n||4===n))if(this.colour===w.BLACK&&1===this.cell.row){const e=new r(new i(l,o),new i(n,s),this);t.push(e)}else if(this.colour===w.WHITE&&6===this.cell.row){const e=new r(new i(l,o),new i(n,s),this);t.push(e)}}if(n=this.cell.row+1*this.colour,s=this.cell.col+1,e.canEat(n,s,this.colour)){const c=new r(new i(l,o),new i(n,s),this,void 0,void 0,e.getPiece(n,s),0===n||7===n);t.push(c)}if(e.canMove(n,s)&&e.moves.length>0){const c=e.moves.slice(-1)[0];if(c.piece.name===w.PAWN&&c.newCell.row===this.cell.row&&c.newCell.col===this.cell.col+1&&2===Math.abs(c.newCell.row-c.oldCell.row)){const e=new r(new i(l,o),new i(n,s),this,!0);t.push(e)}}if(n=this.cell.row+1*this.colour,s=this.cell.col-1,e.canEat(n,s,this.colour)){const c=new r(new i(l,o),new i(n,s),this,void 0,void 0,e.getPiece(n,s),0===n||7===n);t.push(c)}if(e.canMove(n,s)&&e.moves.length>0){const c=e.moves.slice(-1)[0];if(c.piece.name===w.PAWN&&c.newCell.row===this.cell.row&&c.newCell.col===this.cell.col-1&&2===Math.abs(c.newCell.row-c.oldCell.row)){const e=new r(new i(l,o),new i(n,s),this,!0);t.push(e)}}return t};isCheck=(e,l)=>{const o=l.cell.row,t=l.cell.col,n=this.cell.row+1*this.colour,s=this.cell.col+1,c=this.cell.col-1;return n===o&&(s===t||c===t)};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col;if(e.isEnPassant){const t=l.moves.slice(-1)[0],n=o[t.newCell.row][t.newCell.col];null!==n&&(e.ate=n),o[t.newCell.row][t.newCell.col]=null}const s=o[t][n];return null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(t,n),e.isPromotion?(o[t][n]=new d(this.colour,this.cell),{promotion:!0,row:t,col:n}):{row:t,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"p"}class d extends w{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];points=900;name=w.QUEEN;whiteScore=[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]];blackScore=[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,5,0,0,0,0,-10],[-10,5,5,5,5,5,0,-10],[0,0,5,5,5,5,0,-5],[-5,0,5,5,5,5,0,-5],[-10,0,5,5,5,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=this.cell.row,n=this.cell.col,s=o[0],c=o[1];let w=s+t,a=c+n;for(;e.canMove(w,a)||e.canEat(w,a,this.colour);){const o=new r(new i(t,n),new i(w,a),this);if(l.push(o),e.canEat(w,a,this.colour))break;w+=s,a+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row,s=l.cell.col;if(Math.abs(o-n)!==Math.abs(t-s)&&s!==t&&n!==o)return!1;const c=this.cell.row,i=this.cell.col;for(const r of this.directions){const l=r[0],o=r[1];let t=l+c,n=o+i;for(;e.canMove(t,n)||e.canEat(t,n,this.colour);){if(e.canEat(t,n,this.colour)){if(e.getPiece(t,n).name===w.KING)return!0;break}t+=l,n+=o}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];return null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(t,n),{row:t,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"q"}class f extends w{directions=[[0,1],[1,0],[0,-1],[-1,0]];points=500;name=w.ROOK;whiteScore=[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]];blackScore=[[0,0,4,5,5,10,0,0],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[5,10,10,10,10,10,10,5],[0,0,0,0,0,0,0,0]];constructor(e,l){super(e,l)}getMoves=e=>{const l=[];for(const o of this.directions){const t=this.cell.row,n=this.cell.col,s=o[0],c=o[1];let w=s+t,a=c+n;for(;e.canMove(w,a)||e.canEat(w,a,this.colour);){const o=new r(new i(t,n),new i(w,a),this);if(l.push(o),e.canEat(w,a,this.colour))break;w+=s,a+=c}}return l};isCheck=(e,l)=>{const o=this.cell.row,t=this.cell.col,n=l.cell.row;if(l.cell.col!==t&&n!==o)return!1;for(const s of this.directions){const l=this.cell.row,o=this.cell.col,t=s[0],n=s[1];let c=t+l,i=n+o;for(;e.canMove(c,i)||e.canEat(c,i,this.colour);){if(e.canEat(c,i,this.colour)){if(e.getPiece(c,i).name===w.KING)return!0;break}c+=t,i+=n}}return!1};movePiece=(e,l)=>{const o=l.getBoard(),t=e.newCell.row,n=e.newCell.col,s=o[t][n];return null!==s&&(e.ate=s),o[t][n]=this,o[e.oldCell.row][e.oldCell.col]=null,this.cell=new i(t,n),{row:t,col:n}};getString=()=>(this.colour===w.WHITE?"w":"b")+"r"}try{const l=o.data,n=l[0],s=l[1],c=l[2],a=l[3];if(e=c.length,0===e){if(a===w.WHITE){const e=[new r(new i(6,3),new i(4,3),new C(w.WHITE,new i(6,3))),new r(new i(6,4),new i(4,4),new C(w.WHITE,new i(6,4)))],l=Math.round(Math.random()*(e.length-1));postMessage(e[l].getMoveString())}}else if(1===e){const e=c.map((e=>r.parseMove(void 0,e)))[0];if(6===e.oldCell.row&&4===e.oldCell.col&&4===e.newCell.row&&4===e.newCell.col){const e=[new r(new i(1,2),new i(3,2),new C(w.BLACK,new i(1,2))),new r(new i(1,4),new i(3,4),new C(w.BLACK,new i(1,4)))],l=Math.round(Math.random()*(e.length-1));postMessage(e[l].getMoveString())}else{const e=t(n,s,c,a);postMessage(e.getMoveString())}}else{const e=t(n,s,c,a);postMessage(e.getMoveString())}}catch(g){postMessage({isError:!0,message:"Error: "+g})}}))}();
//# sourceMappingURL=worker.worker.267a40d5.worker.js.map
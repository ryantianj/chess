self.addEventListener("message",(async e=>{let l=0;const t=(e,l)=>e.getScore(l),o=e=>e===r.BLACK?r.WHITE:r.BLACK,s=(e,l,n,c,i,r,h)=>{if(0===l)return[null,t(e,r)];if(e.isGameOver(h).isGameOver&&h===r)return[null,-Number.MAX_VALUE];if(e.isGameOver(h).isGameOver&&h!==r)return[null,Number.MAX_VALUE];const w=e.getAllMoves(h),a=Math.floor(Math.random()*(w.length-1));let u=w.length>0?w[a]:null;if(i){let t=-Number.MAX_VALUE;for(const i of w){e.movePiece(i.piece,i);const w=s(e,l-1,n,c,!1,r,o(h))[1];if(e.undoMove(),w>t&&(t=w,u=i),c<=(n=Math.max(n,w)))break}return[u,t]}{let t=Number.MAX_VALUE;for(const i of w){e.movePiece(i.piece,i);const w=s(e,l-1,n,c,!0,r,o(h))[1];if(e.undoMove(),w<t&&(t=w,u=i),(c=Math.max(c,w))<=n)break}return[u,t]}};class n{board;constructor(){this.board=this.newBoard(),this.moves=[]}newBoard=()=>[[new f(r.BLACK,new c(0,0)),new a(r.BLACK,new c(0,1)),new h(r.BLACK,new c(0,2)),new C(r.BLACK,new c(0,3)),new w(r.BLACK,new c(0,4)),new h(r.BLACK,new c(0,5)),new a(r.BLACK,new c(0,6)),new f(r.BLACK,new c(0,7))],[new u(r.BLACK,new c(1,0)),new u(r.BLACK,new c(1,1)),new u(r.BLACK,new c(1,2)),new u(r.BLACK,new c(1,3)),new u(r.BLACK,new c(1,4)),new u(r.BLACK,new c(1,5)),new u(r.BLACK,new c(1,6)),new u(r.BLACK,new c(1,7))],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[new u(r.WHITE,new c(6,0)),new u(r.WHITE,new c(6,1)),new u(r.WHITE,new c(6,2)),new u(r.WHITE,new c(6,3)),new u(r.WHITE,new c(6,4)),new u(r.WHITE,new c(6,5)),new u(r.WHITE,new c(6,6)),new u(r.WHITE,new c(6,7))],[new f(r.WHITE,new c(7,0)),new a(r.WHITE,new c(7,1)),new h(r.WHITE,new c(7,2)),new C(r.WHITE,new c(7,3)),new w(r.WHITE,new c(7,4)),new h(r.WHITE,new c(7,5)),new a(r.WHITE,new c(7,6)),new f(r.WHITE,new c(7,7))]];setBoardString=e=>{const l=[];for(let t=0;t<8;t++){const o=[];for(let l=0;l<8;l++){const s=e[t][l];if(null===s)o.push(null);else{const e="w"===s.slice(0,1)?r.WHITE:r.BLACK,n=s.slice(1,2);"b"===n?o.push(new h(e,new c(t,l))):"k"===n?o.push(new w(e,new c(t,l))):"n"===n?o.push(new a(e,new c(t,l))):"p"===n?o.push(new u(e,new c(t,l))):"q"===n?o.push(new C(e,new c(t,l))):"r"===n?o.push(new f(e,new c(t,l))):o.push(null)}}l.push(o)}this.board=l};clonePiece=e=>e instanceof u?new u(e.colour,new c(e.cell.row,e.cell.col)):e instanceof h?new h(e.colour,new c(e.cell.row,e.cell.col)):e instanceof w?new w(e.colour,new c(e.cell.row,e.cell.col)):e instanceof a?new a(e.colour,new c(e.cell.row,e.cell.col)):e instanceof C?new C(e.colour,new c(e.cell.row,e.cell.col)):e instanceof f?new f(e.colour,new c(e.cell.row,e.cell.col)):null;getBoard=()=>this.board;getPiece=(e,l)=>this.board[e][l];isEmpty=(e,l)=>!this.isOutSide(e,l)&&null===this.board[e][l];isUnderCheck=e=>!1;isOutSide=(e,l)=>e<0||l<0||e>7||l>7;canEat=(e,l,t)=>!this.isOutSide(e,l)&&!this.isEmpty(e,l)&&this.getPiece(e,l).colour!==t;canEatDefend=(e,l)=>!this.isOutSide(e,l)&&!this.isEmpty(e,l);canMove=(e,l)=>!this.isOutSide(e,l)&&this.isEmpty(e,l);canKingMove=(e,l,t)=>{const o=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];for(const s of o){const o=e+s[0],n=l+s[1];if(!this.isOutSide(o,n)&&!this.isEmpty(o,n)&&this.getPiece(o,n)instanceof w&&this.getPiece(o,n).colour!==t)return!1}return!0};getAttackingSquares=e=>{const l=[];for(let t=0;t<8;t++)for(let o=0;o<8;o++)if(!this.isEmpty(t,o)){const s=this.getPiece(t,o);if(s.colour!==e&&!(s instanceof w)){const e=s.getAttack(this);l.push.apply(l,e)}}return[l,[]]};movePiece=(e,l)=>{const t=this.board[l.oldCell.row][l.oldCell.col].movePiece(l,this);return this.moves.push(l),t};undoMove=()=>{if(this.moves.length>0){const e=this.moves.pop(),l=e.oldCell.row,t=e.oldCell.col,o=this.board[e.newCell.row][e.newCell.col];return this.board[l][t]=o,o.moves.pop(),o.cell.row=l,o.cell.col=t,e.isEnPassant?(this.board[e.ate.cell.row][e.ate.cell.col]=e.ate,this.board[e.newCell.row][e.newCell.col]=null,!0):(e.isPromotion?this.board[l][t]=new u(o.colour,o.cell,o.moves):e.castle.isCastle&&(this.board[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=e.castle.rook.piece,e.castle.rook.piece.cell.row=e.castle.rook.oldCell.row,e.castle.rook.piece.cell.col=e.castle.rook.oldCell.col,this.board[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=null),this.board[e.newCell.row][e.newCell.col]=e.ate,!0)}return!1};kingHasMoved=e=>{for(const l of this.moves)if(l.piece instanceof w&&l.piece.colour===e)return!0;return!1};rookHasMoved=(e,l)=>{const t=e===r.BLACK?0:7,o=l===w.KING_SIDE?7:0;if(!(this.getPiece(t,o)instanceof f))return!0;for(const s of this.moves)if(s.piece instanceof f&&s.piece.colour===e&&s.oldCell.row===t&&s.oldCell.col===o)return!0;return!1};castlingSquaresIsEmpty=(e,l)=>{const t=e===r.BLACK?0:7,o=l===w.KING_SIDE?[5,6]:[1,2,3];for(const s of o)if(!this.isEmpty(t,s))return!1;return!0};castlingSquaresUnderAttack=(e,l,t)=>{const o=e===r.BLACK?0:7,s=l===w.KING_SIDE?[4,5,6]:[1,2,3,4];for(const n of s)for(const e of t)if(e.newCell.row===o&&e.newCell.col===n)return!0;return!1};canCastle=(e,l,t)=>this.castlingSquaresIsEmpty(e,l)&&!this.castlingSquaresUnderAttack(e,l,t)&&!this.rookHasMoved(e,l)&&!this.kingHasMoved(e);promotePiece=e=>{const l=e.cell.row,t=e.cell.col;this.board[l][t]=e};isCheck=(e,l=null)=>{const t=null===l?this.getAttackingSquares(e)[0]:l;for(const o of t){const l=this.getPiece(o.newCell.row,o.newCell.col);if(l instanceof w&&l.colour===e)return!0}return!1};willCheck=(e,l)=>(this.movePiece(e,l),this.isCheck(e.colour)?(this.undoMove(),!0):(this.undoMove(),!1));getAllMoves=e=>{let l=[];for(let t=0;t<8;t++)for(let o=0;o<8;o++)null!==this.board[t][o]&&this.getPiece(t,o).colour===e&&(l=l.concat(this.getPiece(t,o).getMoves(this)));return l};isRepeatPosition=e=>{const l=e;if(this.moves.length>=l){const e=this.moves.slice(-l);let t=e[0],o=e[1];for(let s=2;s<l;s+=4){const l=e[s],n=e[s+1];if(l.newCell.row!==t.oldCell.row||l.newCell.col!==t.oldCell.col||t.piece!==l.piece)return!1;if(n.newCell.row!==o.oldCell.row||n.newCell.col!==o.oldCell.col||o.piece!==n.piece)return!1}return!0}return!1};isGameOver=e=>{const l=this.getAllMoves(e),t=this.isCheck(e),o=e===r.BLACK?"White":"Black";return t&&l.length<=0?{isGameOver:!0,message:o+" wins by checkmate"}:!t&&l.length<=0?{isGameOver:!1,message:"Draw by stalemate"}:this.isRepeatPosition(8)?{isGameOver:!1,message:"Draw by threefold repetition"}:{isGameOver:!1,message:""}};getAllMoves=e=>{let l=[];for(let t=0;t<8;t++)for(let o=0;o<8;o++)if(!this.isEmpty(t,o)&&this.getPiece(t,o).colour===e){const e=this.getPiece(t,o).getMoves(this);l=l.concat(e)}return l};scanSquaresScore=(e,l,t)=>{const o=e===r.WHITE?r.BLACK:r.WHITE;let s=0;for(let n=0;n<8;n++)for(let t=0;t<8;t++){const c=this.getPiece(n,t);null!==c&&(c instanceof u&&1!==n?s+=3:c instanceof a&&0!==n&&(1!==t||6!==t)?s+=10:c instanceof f&&0!==n&&(0!==t||7!==t)?s+=5:c instanceof h&&0!==n&&(2!==t||5!==t)&&(s+=10),(c instanceof w&&6===t||c instanceof w&&1===t)&&(s+=20),c instanceof u&&c.colour===e?this.getPiece(n+1,t)instanceof u&&c.colour===e&&(s-=2):c instanceof u&&c.colour!==e&&this.getPiece(n-1,t)instanceof u&&c.colour!==e&&(s+=2),c instanceof w&&c.colour===e?this.isCheck(e,l)&&(s-=10):c instanceof w&&c.colour===o&&this.isCheck(o,l)&&(s+=10))}return s};getScore=e=>{let l=0;const t=e===r.WHITE?r.BLACK:r.WHITE;for(let n=0;n<8;n++)for(let t=0;t<8;t++){const o=this.board[n][t];o instanceof r&&o.colour===e&&(l+=o.points),o instanceof r&&o.colour!==e&&(l-=o.points)}const o=this.getAttackingSquares(t),s=o[0].length;return o[1].length,1e3*l+s+this.scanSquaresScore(e,o[0],o[1])};getBoardString=()=>{const e=[];for(let l=0;l<8;l++){const t=[];for(let e=0;e<8;e++){const o=this.getPiece(l,e);null!==o?t.push(o.getString()):t.push(null)}e.push(t)}return e}}class c{constructor(e,l){this.row=e,this.col=l}}class i{oldCell;newCell;constructor(e,l,t,o=!1,s={isCastle:!1},n=null,c=!1){this.oldCell=e,this.newCell=l,this.piece=t,this.isEnPassant=o,this.castle=s,this.ate=n,this.isPromotion=c}getMoveString=()=>({oldCellRow:this.oldCell.row,oldCellCol:this.oldCell.col,newCellRow:this.newCell.row,newCellCol:this.newCell.col,pieceString:this.piece.getString(),isEnPassant:this.isEnPassant,castle:!1===this.castle.isCastle?{isCastle:!1}:{isCastle:!0,rook:{pieceString:this.castle.rook.piece.getString(),oldCellRow:this.castle.rook.oldCell.row,oldCellCol:this.castle.rook.oldCell.col,newCellRow:this.castle.rook.newCell.row,newCellCol:this.castle.rook.newCell.col}},ate:null!==this.ate?this.ate.getString():null,isPromotion:this.isPromotion})}class r{static WHITE=-1;static BLACK=1;isAlive=!0;constructor(e,l,t=[]){this.colour=e,this.cell=l,this.moves=t}}class h extends r{directions=[[1,1],[-1,-1],[1,-1],[-1,1]];points=3;constructor(e,l,t){super(e,l,t)}getMoves=e=>{const l=[];for(const t of this.directions){const o=this.cell.row,s=this.cell.col,n=t[0],r=t[1];let h=n+o,w=r+s;for(;e.canMove(h,w)||e.canEat(h,w,this.colour);){const t=new i(this.cell,new c(h,w),this);if(e.willCheck(this,t)||l.push(t),e.canEat(h,w,this.colour))break;h+=n,w+=r}}return l};getAttack=e=>{const l=[];for(const t of this.directions){const o=this.cell.row,s=this.cell.col,n=t[0],r=t[1];let h=n+o,w=r+s;for(;(e.canMove(h,w)||e.canEatDefend(h,w))&&(l.push(new i(this.cell,new c(h,w),this)),!e.canEatDefend(h,w));)h+=n,w+=r}return l};movePiece=(e,l)=>{const t=l.getBoard(),o=e.newCell.row,s=e.newCell.col,n=t[o][s];return null!==n&&(e.ate=n),t[o][s]=this,t[e.oldCell.row][e.oldCell.col]=null,this.cell=new c(o,s),this.moves.push(e),{row:o,col:s}};getString=()=>(this.colour===r.WHITE?"w":"b")+"b"}class w extends r{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];static KING_SIDE="king";static QUEEN_SIDE="queen";points=9999;constructor(e,l,t){super(e,l,t)}getMoves=e=>{const l=[],t=e.getAttackingSquares(this.colour)[0];for(const s of this.directions){const t=s[0],o=s[1],n=t+this.cell.row,r=o+this.cell.col;if((e.canEat(n,r,this.colour)||e.canMove(n,r))&&e.canKingMove(n,r,this.colour)){const t=new i(this.cell,new c(n,r),this);e.willCheck(this,t)||l.push(t)}}const o=l.filter((e=>{for(const l of t)if(e.newCell.row===l.newCell.row&&e.newCell.col===l.newCell.col)return!1;return!0}));if(e.canCastle(this.colour,w.KING_SIDE,t)){const l=this.colour===r.BLACK?0:7,t=6;o.push(new i(this.cell,new c(l,t),this,!1,{isCastle:!0,rook:new i(new c(l,7),new c(l,5),e.getPiece(l,7))}))}if(e.canCastle(this.colour,w.QUEEN_SIDE,t)){const l=this.colour===r.BLACK?0:7,t=2;o.push(new i(this.cell,new c(l,t),this,!1,{isCastle:!0,rook:new i(new c(l,0),new c(l,3),e.getPiece(l,0))}))}return o};getAttack=e=>this.getMoves(e);movePiece=(e,l)=>{const t=l.getBoard(),o=e.newCell.row,s=e.newCell.col;e.castle.isCastle&&(t[e.castle.rook.newCell.row][e.castle.rook.newCell.col]=e.castle.rook.piece,t[e.castle.rook.oldCell.row][e.castle.rook.oldCell.col]=null,e.castle.rook.piece.cell.row=e.castle.rook.newCell.row,e.castle.rook.piece.cell.col=e.castle.rook.newCell.col);const n=t[o][s];return null!==n&&(e.ate=n),t[o][s]=this,t[e.oldCell.row][e.oldCell.col]=null,this.cell=new c(o,s),this.moves.push(e),{row:o,col:s}};getString=()=>(this.colour===r.WHITE?"w":"b")+"k"}class a extends r{directions=[[1,2],[1,-2],[2,1],[2,-1],[-1,2],[-1,-2],[-2,1],[-2,-1]];points=3;constructor(e,l,t){super(e,l,t)}getMoves=e=>{const l=[];for(const t of this.directions){const o=t[0],s=t[1],n=o+this.cell.row,r=s+this.cell.col;if(e.canEat(n,r,this.colour)||e.canMove(n,r)){const t=new i(this.cell,new c(n,r),this);e.willCheck(this,t)||l.push(t)}}return l};getAttack=e=>{const l=[];for(const t of this.directions){const o=t[0],s=t[1],n=o+this.cell.row,r=s+this.cell.col;(e.canEatDefend(n,r)||e.canMove(n,r))&&l.push(new i(this.cell,new c(n,r),this))}return l};movePiece=(e,l)=>{const t=l.getBoard(),o=e.newCell.row,s=e.newCell.col,n=t[o][s];return null!==n&&(e.ate=n),t[o][s]=this,t[e.oldCell.row][e.oldCell.col]=null,this.cell=new c(o,s),this.moves.push(e),{row:o,col:s}};getString=()=>(this.colour===r.WHITE?"w":"b")+"n"}class u extends r{points=1;constructor(e,l,t){super(e,l,t)}getMoves=e=>{const l=[];let t=this.cell.row+1*this.colour,o=this.cell.col;if(e.canMove(t,o)){const s=new i(this.cell,new c(t,o),this);if(e.willCheck(this,s)||l.push(s),t=this.cell.row+2*this.colour,e.canMove(t,o)&&this.moves.length<=0)if(this.colour===r.BLACK&&1===this.cell.row){const s=new i(this.cell,new c(t,o),this);e.willCheck(this,s)||l.push(s)}else if(this.colour===r.WHITE&&6===this.cell.row){const s=new i(this.cell,new c(t,o),this);e.willCheck(this,s)||l.push(s)}}if(t=this.cell.row+1*this.colour,o=this.cell.col+1,e.canEat(t,o,this.colour)){const s=new i(this.cell,new c(t,o),this);e.willCheck(this,s)||l.push(s)}if(e.canMove(t,o)&&e.moves.length>0){const s=e.moves.slice(-1)[0];if(s.piece instanceof u&&s.newCell.row===this.cell.row&&s.newCell.col===this.cell.col+1&&2===Math.abs(s.newCell.row-s.oldCell.row)){const s=new i(this.cell,new c(t,o),this,!0);e.willCheck(this,s)||l.push(s)}}if(t=this.cell.row+1*this.colour,o=this.cell.col-1,e.canEat(t,o,this.colour)){const s=new i(this.cell,new c(t,o),this);e.willCheck(this,s)||l.push(s)}if(e.canMove(t,o)&&e.moves.length>0){const s=e.moves.slice(-1)[0];if(s.piece instanceof u&&s.newCell.row===this.cell.row&&s.newCell.col===this.cell.col-1&&2===Math.abs(s.newCell.row-s.oldCell.row)){const s=new i(this.cell,new c(t,o),this,!0);e.willCheck(this,s)||l.push(s)}}return l};getAttack=e=>{const l=[];let t=this.cell.row+1*this.colour,o=this.cell.col+1;return(e.canMove(t,o)||e.canEatDefend(t,o))&&l.push(new i(this.cell,new c(t,o),this)),t=this.cell.row+1*this.colour,o=this.cell.col-1,(e.canMove(t,o)||e.canEatDefend(t,o))&&l.push(new i(this.cell,new c(t,o),this)),l};movePiece=(e,l)=>{const t=l.getBoard(),o=e.newCell.row,s=e.newCell.col;if(e.isEnPassant){const o=l.moves.slice(-1)[0],s=t[o.newCell.row][o.newCell.col];null!==s&&(e.ate=s),t[o.newCell.row][o.newCell.col]=null}const n=t[o][s];return null!==n&&(e.ate=n),t[o][s]=this,t[e.oldCell.row][e.oldCell.col]=null,this.cell=new c(o,s),0===o||7===o?(e.isPromotion=!0,this.moves.push(e),{promotion:!0,row:o,col:s}):(this.moves.push(e),{row:o,col:s})};getString=()=>(this.colour===r.WHITE?"w":"b")+"p"}class C extends r{directions=[[1,1],[-1,-1],[1,-1],[-1,1],[0,1],[1,0],[0,-1],[-1,0]];points=9;constructor(e,l,t){super(e,l,t)}getMoves=e=>{const l=[];for(const t of this.directions){const o=this.cell.row,s=this.cell.col,n=t[0],r=t[1];let h=n+o,w=r+s;for(;e.canMove(h,w)||e.canEat(h,w,this.colour);){const t=new i(this.cell,new c(h,w),this);if(e.willCheck(this,t)||l.push(t),e.canEat(h,w,this.colour))break;h+=n,w+=r}}return l};getAttack=e=>{const l=[];for(const t of this.directions){const o=this.cell.row,s=this.cell.col,n=t[0],r=t[1];let h=n+o,w=r+s;for(;(e.canMove(h,w)||e.canEatDefend(h,w))&&(l.push(new i(this.cell,new c(h,w),this)),!e.canEatDefend(h,w));)h+=n,w+=r}return l};movePiece=(e,l)=>{const t=l.getBoard(),o=e.newCell.row,s=e.newCell.col,n=t[o][s];return null!==n&&(e.ate=n),t[o][s]=this,t[e.oldCell.row][e.oldCell.col]=null,this.cell=new c(o,s),this.moves.push(e),{row:o,col:s}};getString=()=>(this.colour===r.WHITE?"w":"b")+"q"}class f extends r{directions=[[0,1],[1,0],[0,-1],[-1,0]];points=5;constructor(e,l,t){super(e,l,t)}getMoves=e=>{const l=[];for(const t of this.directions){const o=this.cell.row,s=this.cell.col,n=t[0],r=t[1];let h=n+o,w=r+s;for(;e.canMove(h,w)||e.canEat(h,w,this.colour);){const t=new i(this.cell,new c(h,w),this);if(e.willCheck(this,t)||l.push(t),e.canEat(h,w,this.colour))break;h+=n,w+=r}}return l};getAttack=e=>{const l=[];for(const t of this.directions){const o=this.cell.row,s=this.cell.col,n=t[0],r=t[1];let h=n+o,w=r+s;for(;e.canMove(h,w)||e.canEatDefend(h,w);){const t=new i(this.cell,new c(h,w),this);if(l.push(t),e.canEatDefend(h,w))break;h+=n,w+=r}}return l};movePiece=(e,l)=>{const t=l.getBoard(),o=e.newCell.row,s=e.newCell.col,n=t[o][s];return null!==n&&(e.ate=n),t[o][s]=this,t[e.oldCell.row][e.oldCell.col]=null,this.cell=new c(o,s),this.moves.push(e),{row:o,col:s}};getString=()=>(this.colour===r.WHITE?"w":"b")+"r"}const d=e.data,g=((e,t)=>{l=0;const o=new n;return o.setBoardString(e),s(o,t,-Number.MAX_VALUE,Number.MAX_VALUE,!0,r.BLACK,r.BLACK)[0]})(d[0],d[1]);postMessage(g.getMoveString())}));
//# sourceMappingURL=worker.worker.5a2fd88e.worker.js.map
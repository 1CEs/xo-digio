# XO Digio - เกม Tic Tac Toe
เกม Tic Tac Toe (XO) แบบ Full-Stack

## เทคโนโลยีที่ใช้

### Frontend
- **Next.js 15** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Zustand** - State Management

### Backend
- **Next.js API Routes** - Server-side API
- **MongoDB** - Database
- **Mongoose** - ODM
- **JOSE** - Authentication
- **bcryptjs** - Password Hashing

## ความต้องการของระบบ

- BunJS 1.2.17+
- MongoDB

## การติดตั้งและเรียกใช้

### 1. Clone Repository
```bash
git clone <repository-url>
cd xo-digio
```

### 2. ติดตั้ง Dependencies
```bash
bun install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` และเพิ่มค่าต่อไปนี้:

```env
MONGODB_URI="mongodb://localhost:27017/xo-digio"
JWT_SECRET="your-super-secret-jwt-key-here"
```

### 4. เรียกใช้ Development Server
```bash
bun run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 5. Build สำหรับ Production
```bash     
bun run build
bun run start
```

## สถาปัตยกรรมและการออกแบบ

### โครงสร้างโปรเจค
```
xo-digio/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoint
│   │   └── history/       # Game history endpoints
│   ├── member/            # Authentication pages
│   ├── play/              # Game page
│   └── /                  # Home page
├── components/            # React Components
│   ├── modals/           # Modal components
│   ├── board.tsx         # Game board
│   ├── profile-card.tsx  # User profile
│   └── ...
├── database/             # Database schemas
├── lib/                  # Utility functions
├── stores/               # Zustand stores
├── types/                # TypeScript definitions
└── validation/           # Zod schemas
```

### การออกแบบ Architecture

#### 1. **Frontend Architecture**
- **Component-Based**: แยก UI เป็น components ที่ใช้ซ้ำได้
- **State Management**: ใช้ Zustand สำหรับ global state
- **Form Handling**: React Hook Form + Zod validation
- **Responsive Design**: Mobile-first approach

#### 2. **Backend Architecture**
- **API Routes**: RESTful API endpoints
- **Middleware**: Authentication และ error handling
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT tokens, password hashing, HTTP-only cookies

#### 3. **Database Design**
```typescript
// User Schema
interface IUser {
  username: string;
  email: string;
  password: string;
  gameHistory: IHistory[];
  createdAt: Date;
}

// Game History Schema
interface IHistory {
  gameSettings: IGameSetting;
  moves: IMove[];
  winner: 'player1' | 'player2' | 'draw' | 'bot' | null;
  gameStatus: 'completed' | 'abandoned' | 'in_progress';
  duration: number;
  createdAt: Date;
}

// Move Schema
interface IMove {
  position: { row: number; col: number };
  playerId: string;
  playerType: 'human' | 'bot';
  timestamp: Date;
  moveNumber: number;
}
```

## Algorithm และ Logic

### 1. **Game Logic Algorithm**

#### การตรวจสอบการชนะ (Win Detection)
```typescript
function checkWinner(board: string[][], size: number): string | null {
  const winLength = Math.min(5, size); // สูงสุด 5 ตัวติดกัน
  
  // ตรวจแนวนอน, แนวตั้ง, แนวทแยง
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col]) {
        // ตรวจ 4 ทิศทาง: →, ↓, ↘, ↙
        const directions = [[0,1], [1,0], [1,1], [1,-1]];
        
        for (let [dx, dy] of directions) {
          let count = 1;
          // ตรวจทิศทางไปข้างหน้า
          for (let i = 1; i < winLength; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (isValidPosition(newRow, newCol, size) && 
                board[newRow][newCol] === board[row][col]) {
              count++;
            } else break;
          }
          if (count >= winLength) return board[row][col];
        }
      }
    }
  }
  return null;
}
```

### 2. **AI Bot Algorithm**

#### Easy Level - Random Move
```typescript
function getRandomMove(board: string[][]): {row: number, col: number} {
  const emptyCells = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (!board[row][col]) {
        emptyCells.push({row, col});
      }
    }
  }
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}
```

#### Medium Level - Defensive Strategy
```typescript
function getMediumMove(board: string[][]): {row: number, col: number} {
  // 1. ตรวจหาตำแหน่งที่ชนะได้ทันที
  const winMove = findWinningMove(board, 'O');
  if (winMove) return winMove;
  
  // 2. ตรวจหาตำแหน่งที่ต้องป้องกันผู้เล่น
  const blockMove = findWinningMove(board, 'X');
  if (blockMove) return blockMove;
  
  // 3. เลือกตำแหน่งกลางหรือมุม
  return getStrategicMove(board);
}
```

#### Hard Level - Minimax Algorithm
```typescript
function minimax(board: string[][], depth: number, isMaximizing: boolean): number {
  const winner = checkWinner(board);
  
  if (winner === 'O') return 10 - depth;  // Bot ชนะ
  if (winner === 'X') return depth - 10;  // ผู้เล่นชนะ
  if (isBoardFull(board)) return 0;       // เสมอ
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let move of getAvailableMoves(board)) {
      board[move.row][move.col] = 'O';
      const eval = minimax(board, depth + 1, false);
      board[move.row][move.col] = '';
      maxEval = Math.max(maxEval, eval);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of getAvailableMoves(board)) {
      board[move.row][move.col] = 'X';
      const eval = minimax(board, depth + 1, true);
      board[move.row][move.col] = '';
      minEval = Math.min(minEval, eval);
    }
    return minEval;
  }
}
```

### 3. **Authentication Flow**

#### JWT Token Management
```typescript
// การสร้าง JWT Token
function createToken(userId: string): string {
  return jwt.sign(
    { userId, iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
}

// การตรวจสอบ Token
function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}
```

### 4. **Game State Management**

#### Zustand Store Pattern
```typescript
interface GameState {
  board: string[][];
  currentPlayer: 'X' | 'O';
  gameStatus: 'playing' | 'finished' | 'draw';
  winner: string | null;
  mode: 'menu' | 'vs-friend' | 'vs-bot';
  
  // Actions
  makeMove: (row: number, col: number) => void;
  resetGame: () => void;
  setMode: (mode: string) => void;
}
```

## วิธีการเล่น

### 1. **เริ่มเกม**
- เข้าสู่ระบบหรือเล่นแบบ Guest
- เลือกโหมด: เล่นกับเพื่อน หรือ Bot
- ปรับแต่งขนาดกระดานและระดับความยาก (ถ้าเล่นกับ Bot)

### 2. **การเล่น**
- คลิกที่ช่องว่างเพื่อวาง X หรือ O
- เป้าหมาย: ให้สัญลักษณ์ของคุณเรียงกัน 3-5 ตัว (ขึ้นอยู่กับขนาดกระดาน)
- ผู้เล่นสลับกันเล่นจนกว่าจะมีผู้ชนะหรือเสมอ

### 3. **ดูประวัติ**
- เข้าไปที่หน้า History เพื่อดูเกมที่เล่นแล้ว
- คลิก Replay เพื่อดูการเล่นย้อนหลัง
- ใช้ปุ่มควบคุมเพื่อเล่น/หยุด/เร็ว/ช้า

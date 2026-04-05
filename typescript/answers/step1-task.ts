// Step 1: Taskクラス — 回答例
//
// 実行方法:
//   npm run answer1
//   ※ package.json の scripts に "answer1": "ts-node answers/step1-task.ts" と定義されているため、
//      npm run answer1 は ts-node answers/step1-task.ts の短縮呼び出しになる
//
// 末尾の `export {}` について:
//   src/step1-task.ts と answers/step1-task.ts は同じ tsconfig.json の対象のため、
//   何もしないと TypeScript が「同じ名前が2つある」とエラーを出す。
//   `export {}` を書くとファイルがモジュール扱いになり、スコープが独立してエラーが消える。
//   実装には影響しないので気にしなくてよい。

class Task {
  title: string;
  dueDate: string;
  completed: boolean;

  // コンストラクタの引数で受け取った値を this に代入することで、
  // インスタンスごとに独立したデータを持てる
  constructor(title: string, dueDate: string) {
    this.title = title;
    this.dueDate = dueDate;
    // 新しく作ったタスクは必ず未完了からスタートするため、引数では受け取らず固定値で初期化する
    this.completed = false;
  }

  // 完了状態への変更だけを担うメソッドにすることで、
  // 「タスクを完了にする」という操作が1箇所に集まり、後から変更しやすくなる
  complete(): void {
    this.completed = true;
  }

  // 表示ロジックをクラスの中に持つことで、
  // 呼び出し側は task.display() と書くだけでよくなる（表示の詳細を知らなくてよい）
  display(): void {
    const status = this.completed ? "完了" : "未完了";
    console.log(`[${status}] ${this.title}（期日: ${this.dueDate}）`);
  }
}

// --- 動作確認 ---
const task1 = new Task("買い物", "2024-12-31");
task1.complete();
task1.display(); // [完了] 買い物（期日: 2024-12-31）

const task2 = new Task("読書", "2024-11-30");
task2.display(); // [未完了] 読書（期日: 2024-11-30）

export {};

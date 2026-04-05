// Step 2: 型とアクセス修飾子を追加する — 回答例
//
// 実行方法:
//   npm run answer2
//   ※ package.json の scripts に "answer2": "ts-node answers/step2-access.ts" と定義されているため、
//      npm run answer2 は ts-node answers/step2-access.ts の短縮呼び出しになる
//
// 末尾の `export {}` について:
//   src/ と answers/ で同じクラス名・変数名が存在するため、モジュール扱いにしてスコープを分離している。
//   実装には影響しないので気にしなくてよい。

class Task {
  // public: クラスの外からも読み書きできる（デフォルトだが明示することで意図が伝わる）
  public title: string;
  public dueDate: string;

  // private: クラスの外から直接アクセスできない
  // Step 1 では completed を外部から自由に書き換えられたが、
  // private にすることで complete() メソッド経由でしか変更できなくなる
  private completed: boolean;

  constructor(title: string, dueDate: string) {
    this.title = title;
    this.dueDate = dueDate;
    this.completed = false;
  }

  complete(): void {
    // private であってもクラスの内部からは変更できる
    // 「完了にする」という操作をメソッドに限定することで、
    // 将来「完了時に通知を送る」などの処理を追加しやすくなる
    this.completed = true;
  }

  display(): void {
    const status = this.completed ? "完了" : "未完了";
    console.log(`[${status}] ${this.title}（期日: ${this.dueDate}）`);
  }
}

// --- 動作確認 ---
const task = new Task("買い物", "2024-12-31");
task.display(); // [未完了] 買い物（期日: 2024-12-31）

task.complete();
task.display(); // [完了] 買い物（期日: 2024-12-31）

// task.completed = false; // → エラー: プロパティ 'completed' はプライベートです

export {};

// Step 7: コードを SOLID で見直す
// 学ぶ概念：SOLID 原則、リファクタリング
//
// 実行方法:
//   npm run step7
//
// このステップでは「問題のあるコード」を読み、SOLID 原則のどれに違反しているかを考え、
// リファクタリングして改善します。
//
// 以下に SOLID 原則に違反したコードを示します。
// 各 TODO のコメントを読み、問題を特定して改善してください。

// -----------------------------------------------------------------------
// 問題 1: 単一責任の原則（SRP）違反
// 1つのクラスが複数の責任を持っている
// -----------------------------------------------------------------------

// TODO: 以下の TaskManager は「タスク管理」「表示」「ファイル保存」を1つのクラスで担っている
//   どこが SRP に違反しているか考え、責任ごとにクラスを分割してリファクタリングしてください

class TaskManagerBad {
  private tasks: { title: string; completed: boolean }[] = [];

  addTask(title: string): void {
    this.tasks.push({ title, completed: false });
  }

  completeTask(title: string): void {
    const task = this.tasks.find((t) => t.title === title);
    if (task) task.completed = true;
  }

  // 表示の責任（本来は別クラスが担うべき）
  printReport(): void {
    console.log("=== タスク一覧 ===");
    this.tasks.forEach((t) => {
      console.log(`[${t.completed ? "完了" : "未完了"}] ${t.title}`);
    });
    console.log(`完了: ${this.tasks.filter((t) => t.completed).length}件`);
  }

  // 保存の責任（本来は別クラスが担うべき）
  saveToFile(): void {
    // 実際のファイル保存は省略
    console.log("タスクをファイルに保存しました（模擬）");
  }
}

// -----------------------------------------------------------------------
// 問題 2: 開放閉鎖の原則（OCP）違反
// 新しい通知方法を追加するたびにクラスを修正しなければならない
// -----------------------------------------------------------------------

// TODO: 以下の Notifier は通知方法が増えるたびに notify() を修正しなければならない
//   Step 6 で学んだ interface を使って OCP に従った設計にリファクタリングしてください

class NotifierBad {
  notify(type: string, message: string): void {
    if (type === "console") {
      console.log(`[通知] ${message}`);
    } else if (type === "email") {
      console.log(`[メール] ${message}`);
    }
    // 新しい通知方法（Slack など）が増えるたびにここを修正しなければならない
  }
}

// -----------------------------------------------------------------------
// 動作確認（リファクタリング後に書き換えてください）
// -----------------------------------------------------------------------

// SRP のリファクタリング確認
const manager = new TaskManagerBad();
manager.addTask("買い物");
manager.addTask("読書");
manager.completeTask("買い物");
manager.printReport();
manager.saveToFile();

// OCP のリファクタリング確認
const notifier = new NotifierBad();
notifier.notify("console", "タスクが完了しました");
notifier.notify("email", "タスクが完了しました");

export {};

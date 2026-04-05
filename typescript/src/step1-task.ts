// Step 1: Taskクラスを実装してください
// 学ぶ概念：クラス、インスタンス、コンストラクタ、メソッド
//
// 実行方法:
//   npm run step1

class Task {
  // TODO: 以下の3つのプロパティを定義する
  //   - title    : タスクのタイトル（文字列）
  //   - dueDate  : 期日（文字列）
  //   - completed: 完了状態（真偽値）

  // TODO: コンストラクタを実装する
  //   - title と dueDate を引数で受け取る
  //   - completed の初期値は false にする
  constructor() {}

  // TODO: タスクを完了にするメソッドを実装する
  complete(): void {}

  // TODO: タスクの内容をコンソールに出力するメソッドを実装する
  //   出力例: [完了] 買い物（期日: 2024-12-31）
  //           [未完了] 読書（期日: 2024-11-30）
  display(): void {}
}

// --- 動作確認 ---
// 以下のコードを変更せずに、上のクラスを実装して期待通りの出力になるか確認してください

const task1 = new Task("買い物", "2024-12-31");
task1.complete();
task1.display(); // 期待: [完了] 買い物（期日: 2024-12-31）

const task2 = new Task("読書", "2024-11-30");
task2.display(); // 期待: [未完了] 読書（期日: 2024-11-30）

export {};

// Step 6: interface で通知機能を作る
// 学ぶ概念：interface、ポリモーフィズム、抽象化
//
// 実行方法:
//   npm run step6

// TODO: Notifiable interface を定義する
//   - notify(message: string): void メソッドを持つ

// TODO: ConsoleNotifier クラスを実装する
//   - Notifiable を implements する
//   - notify() でメッセージをコンソールに出力する
//     出力例: [通知] タスク「買い物」が完了しました

// TODO: EmailNotifier クラスを実装する
//   - Notifiable を implements する
//   - コンストラクタで送信先メールアドレス（emailAddress）を受け取る
//   - notify() でメール送信を模したメッセージをコンソールに出力する
//     出力例: [メール → user@example.com] タスク「買い物」が完了しました

// Task クラスは完成形を提供しています
// Notifiable を受け取り、complete() 時に通知を送れるように拡張されています
class Task {
  public title: string;
  public dueDate: string;
  private _completed: boolean = false;
  // TODO: notifier プロパティを追加する（型は Notifiable）
  //   コンストラクタで受け取れるようにする（省略可能にする: Notifiable | undefined）

  constructor(title: string, dueDate: string) {
    this.title = title;
    this.dueDate = dueDate;
  }

  get completed(): boolean {
    return this._completed;
  }

  // TODO: complete() を修正して、notifier があれば notify() を呼ぶようにする
  complete(): void {
    this._completed = true;
  }

  display(): void {
    const status = this._completed ? "完了" : "未完了";
    console.log(`[${status}] ${this.title}（期日: ${this.dueDate}）`);
  }
}

// --- 動作確認 ---
const consoleNotifier = new ConsoleNotifier();
const emailNotifier = new EmailNotifier("user@example.com");

const task1 = new Task("買い物", "2024-12-31", consoleNotifier);
task1.complete();
// 期待: [通知] タスク「買い物」が完了しました

const task2 = new Task("読書", "2024-11-30", emailNotifier);
task2.complete();
// 期待: [メール → user@example.com] タスク「読書」が完了しました

// notifier なし（通知不要なタスク）
const task3 = new Task("運動", "2024-10-15");
task3.complete(); // 通知なし

// ポリモーフィズムの確認: Notifiable 型の配列に両方入れられる
const notifiers: Notifiable[] = [consoleNotifier, emailNotifier];
notifiers.forEach((n) => n.notify("テスト通知"));
// 期待:
// [通知] テスト通知
// [メール → user@example.com] テスト通知

export {};

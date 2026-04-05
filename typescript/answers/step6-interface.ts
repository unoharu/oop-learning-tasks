// Step 6: interface で通知機能を作る — 回答例
//
// 実行方法:
//   npm run answer6
//   ※ package.json の scripts に "answer6": "ts-node answers/step6-interface.ts" と定義されているため、
//      npm run answer6 は ts-node answers/step6-interface.ts の短縮呼び出しになる
//
// 末尾の `export {}` について:
//   src/ と answers/ で同じクラス名・変数名が存在するため、モジュール扱いにしてスコープを分離している。
//   実装には影響しないので気にしなくてよい。

// interface: 「何ができるか」だけを定義する契約
// 実装の詳細は持たず、implements するクラスに実装を委ねる
// abstract class と違い、複数の interface を同時に implements できる
interface Notifiable {
  notify(message: string): void;
}

// ConsoleNotifier と EmailNotifier は全く異なる実装を持つが、
// どちらも Notifiable を満たすため同じ型として扱える（ポリモーフィズム）
class ConsoleNotifier implements Notifiable {
  notify(message: string): void {
    console.log(`[通知] ${message}`);
  }
}

class EmailNotifier implements Notifiable {
  private emailAddress: string;

  constructor(emailAddress: string) {
    this.emailAddress = emailAddress;
  }

  // 同じ notify() という名前でも、実装はクラスごとに異なる
  // 呼び出し側は「notify() を呼べばいい」とだけ知っていればよく、
  // 内部でメールを送るかコンソールに出すかを意識しなくてよい（抽象化）
  notify(message: string): void {
    console.log(`[メール → ${this.emailAddress}] ${message}`);
  }
}

class Task {
  public title: string;
  public dueDate: string;
  private _completed: boolean = false;
  // Notifiable 型として受け取ることで、ConsoleNotifier / EmailNotifier どちらでも受け入れられる
  // undefined を許容することで「通知なし」のタスクも作れる
  private notifier: Notifiable | undefined;

  constructor(title: string, dueDate: string, notifier?: Notifiable) {
    this.title = title;
    this.dueDate = dueDate;
    this.notifier = notifier;
  }

  get completed(): boolean {
    return this._completed;
  }

  complete(): void {
    this._completed = true;
    // notifier があれば通知を送る。なければ何もしない
    // Task クラスは「どう通知するか」を知らなくてよい。notifier に委ねるだけ（抽象化）
    this.notifier?.notify(`タスク「${this.title}」が完了しました`);
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
task1.complete(); // [通知] タスク「買い物」が完了しました

const task2 = new Task("読書", "2024-11-30", emailNotifier);
task2.complete(); // [メール → user@example.com] タスク「読書」が完了しました

// notifier なし（通知不要なタスク）
const task3 = new Task("運動", "2024-10-15");
task3.complete(); // 通知なし

// ポリモーフィズムの確認: Notifiable 型の配列に両方入れられる
const notifiers: Notifiable[] = [consoleNotifier, emailNotifier];
notifiers.forEach((n) => n.notify("テスト通知"));
// [通知] テスト通知
// [メール → user@example.com] テスト通知

export {};

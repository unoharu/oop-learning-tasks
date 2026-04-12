// Step 7: コードを SOLID で見直す — 回答例
//
// 実行方法:
//   npm run answer7
//   ※ package.json の scripts に "answer7": "ts-node answers/step7-solid.ts" と定義されているため、
//      npm run answer7 は ts-node answers/step7-solid.ts の短縮呼び出しになる
//
// 末尾の `export {}` について:
//   src/ と answers/ で同じクラス名・変数名が存在するため、モジュール扱いにしてスコープを分離している。
//   実装には影響しないので気にしなくてよい。

// -----------------------------------------------------------------------
// 問題 1 の改善: 単一責任の原則（SRP）
// -----------------------------------------------------------------------

// タスクのデータ管理だけを担う
// 「1クラス = 1つの責任」にすることで、変更理由が1つになる
class Task {
  constructor(
    public readonly title: string,
    public completed: boolean = false
  ) {}
}

// タスクの追加・完了・検索だけを担う
// 表示や保存の方法が変わっても、このクラスは変更しなくてよい
class TaskRepository {
  private tasks: Task[] = [];

  add(title: string): void {
    this.tasks.push(new Task(title));
  }

  complete(title: string): void {
    const task = this.tasks.find((t) => t.title === title);
    if (task) task.completed = true;
  }

  getAll(): Task[] {
    return this.tasks;
  }
}

// 表示だけを担う
// 表示フォーマットが変わってもリポジトリは変更しなくてよい
class TaskReporter {
  report(tasks: Task[]): void {
    console.log("=== タスク一覧 ===");
    tasks.forEach((t) => {
      console.log(`[${t.completed ? "完了" : "未完了"}] ${t.title}`);
    });
    console.log(`完了: ${tasks.filter((t) => t.completed).length}件`);
  }
}

// 保存だけを担う
// 保存先が DB に変わってもリポジトリや表示クラスは影響を受けない
class TaskStorage {
  save(tasks: Task[]): void {
    // 実際のファイル保存は省略
    console.log("タスクをファイルに保存しました（模擬）");
  }
}

// -----------------------------------------------------------------------
// 問題 2 の改善: 開放閉鎖の原則（OCP）
// -----------------------------------------------------------------------

// interface を使って「通知できる」という契約だけを定義する
// 新しい通知方法を追加するときは、このクラスを実装するだけでよく
// 既存コードを修正する必要がない（拡張に開いて、修正に閉じている）
interface Notifiable {
  notify(message: string): void;
}

class ConsoleNotifier implements Notifiable {
  notify(message: string): void {
    console.log(`[通知] ${message}`);
  }
}

class EmailNotifier implements Notifiable {
  notify(message: string): void {
    console.log(`[メール] ${message}`);
  }
}

// 新しい通知方法の追加 = 新しいクラスを追加するだけ。既存クラスは変更しない
class SlackNotifier implements Notifiable {
  notify(message: string): void {
    console.log(`[Slack] ${message}`);
  }
}

// -----------------------------------------------------------------------
// 問題 3 の改善: リスコフの置換原則（LSP）
// -----------------------------------------------------------------------

// 「飛べる」という能力を interface に切り出す
// Bird 型として扱う文脈では fly() を呼ばないため、Penguin が Bird を壊さない
interface Flyable {
  fly(): void;
}

class Bird {
  // 飛べるかどうかは Bird の責任ではなく、Flyable という能力の問題
  eat(): void {
    console.log("食事をする");
  }
}

// 飛べる鳥だけが Flyable を implements する
class Sparrow extends Bird implements Flyable {
  fly(): void {
    console.log("羽ばたいて飛ぶ");
  }
}

// Penguin は Flyable を implements しないため fly() を呼ばれる心配がない
// Bird 型として扱っても動作が壊れない（LSP を満たす）
class Penguin extends Bird {
  swim(): void {
    console.log("泳ぐ");
  }
}

// -----------------------------------------------------------------------
// 問題 4 の改善: インターフェース分離の原則（ISP）
// -----------------------------------------------------------------------

// 役割ごとに interface を分割する
// 各クラスは必要な interface だけを implements すればよい
interface TaskMutable {
  add(title: string): void;
  getAll(): Task[];
}

interface TaskReportable {
  report(tasks: Task[]): void;
}

interface TaskPersistable {
  save(tasks: Task[]): void;
}

// TaskRepository は TaskMutable だけを満たす（表示・保存を知らなくてよい）
// TaskReporter は TaskReportable だけを満たす（追加・保存を知らなくてよい）
// TaskStorage は TaskPersistable だけを満たす（追加・表示を知らなくてよい）

// -----------------------------------------------------------------------
// 問題 5 の改善: 依存性逆転の原則（DIP）
// -----------------------------------------------------------------------

// 高レベルモジュール（タスク管理）が低レベルモジュール（通知方法）に依存しない
// Notifiable interface（抽象）に依存させ、具体クラスはコンストラクタで注入する
class NotifyingTaskManager {
  // 具体クラスではなく interface に依存する
  constructor(private notifier: Notifiable) {}

  completeTask(title: string): void {
    console.log(`タスク「${title}」を完了にします`);
    // 通知方法が何であるかを知らなくてよい。notifier に委ねるだけ
    this.notifier.notify(`タスク「${title}」が完了しました`);
  }
}

// -----------------------------------------------------------------------
// 動作確認
// -----------------------------------------------------------------------

// SRP の確認: 責任ごとにクラスが分かれている
const repo = new TaskRepository();
repo.add("買い物");
repo.add("読書");
repo.complete("買い物");

const reporter = new TaskReporter();
reporter.report(repo.getAll());

const storage = new TaskStorage();
storage.save(repo.getAll());

console.log("");

// OCP の確認: 通知方法が増えても既存コードを変更しない
const notifiers: Notifiable[] = [
  new ConsoleNotifier(),
  new EmailNotifier(),
  new SlackNotifier(), // 新しい通知方法を追加しても他のクラスは変更不要
];
notifiers.forEach((n) => n.notify("タスクが完了しました"));

console.log("");

// LSP の確認: Bird 型として扱っても動作が壊れない
const birds: Bird[] = [new Sparrow(), new Penguin()];
birds.forEach((b) => b.eat()); // どちらも eat() は実行できる
const flyingBirds: Flyable[] = [new Sparrow()]; // 飛べる鳥だけが Flyable に入る
flyingBirds.forEach((b) => b.fly());

console.log("");

// DIP の確認: 通知方法をコンストラクタで差し替えられる
const taskManagerWithConsole = new NotifyingTaskManager(new ConsoleNotifier());
taskManagerWithConsole.completeTask("買い物");

const taskManagerWithSlack = new NotifyingTaskManager(new SlackNotifier());
taskManagerWithSlack.completeTask("読書");

export {};

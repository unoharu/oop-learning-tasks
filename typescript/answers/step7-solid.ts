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

export {};

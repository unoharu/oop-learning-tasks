// Step 4: TaskManager クラスを作る — 回答例
//
// 実行方法:
//   npm run answer4
//   ※ package.json の scripts に "answer4": "ts-node answers/step4-task-manager.ts" と定義されているため、
//      npm run answer4 は ts-node answers/step4-task-manager.ts の短縮呼び出しになる
//
// 末尾の `export {}` について:
//   src/ と answers/ で同じクラス名・変数名が存在するため、モジュール扱いにしてスコープを分離している。
//   実装には影響しないので気にしなくてよい。

class Task {
  public title: string;
  public dueDate: string;
  private _completed: boolean;

  constructor(title: string, dueDate: string) {
    this.title = title;
    this.dueDate = dueDate;
    this._completed = false;
  }

  get completed(): boolean {
    return this._completed;
  }

  set completed(value: boolean) {
    if (this._completed && !value) {
      throw new Error("完了済みのタスクを未完了に戻すことはできません");
    }
    this._completed = value;
  }

  complete(): void {
    this._completed = true;
  }

  display(): void {
    const status = this._completed ? "完了" : "未完了";
    console.log(`[${status}] ${this.title}（期日: ${this.dueDate}）`);
  }
}

class TaskManager {
  // Task の配列を private で持つことで、外部から直接配列を操作させない（カプセル化）
  // tasks を追加・削除・検索する操作はすべてこのクラスのメソッド経由に統一する
  private tasks: Task[] = [];

  // Task オブジェクトを受け取って管理下に加える
  // 「TaskManager が Task を持つ」関係 = has-a 関係（コンポジション）
  addTask(task: Task): void {
    this.tasks.push(task);
  }

  // タイトルで絞り込んだ新しい配列で上書きすることで削除を実現する
  // splice で直接削除するより意図が明確になる
  removeTask(title: string): void {
    this.tasks = this.tasks.filter((task) => task.title !== title);
  }

  // 見つからない場合は undefined を返す型にすることで、
  // 呼び出し側が「見つからないケース」を意識して扱えるようになる
  findTask(title: string): Task | undefined {
    return this.tasks.find((task) => task.title === title);
  }

  displayAll(): void {
    this.tasks.forEach((task) => task.display());
  }

  // getter にすることで manager.completedCount と自然に読め、
  // 将来集計ロジックが変わっても呼び出し側のコードは変わらない
  get completedCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  get pendingCount(): number {
    return this.tasks.filter((task) => !task.completed).length;
  }
}

// --- 動作確認 ---
const manager = new TaskManager();

manager.addTask(new Task("買い物", "2024-12-31"));
manager.addTask(new Task("読書", "2024-11-30"));
manager.addTask(new Task("運動", "2024-10-15"));

console.log("--- 全タスク ---");
manager.displayAll();

const found = manager.findTask("読書");
found?.complete();

manager.removeTask("運動");

console.log("\n--- 更新後 ---");
manager.displayAll();

console.log(`完了: ${manager.completedCount}件 / 未完了: ${manager.pendingCount}件`);

export {};

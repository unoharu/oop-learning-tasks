// Step 4: TaskManager クラスを作る
// 学ぶ概念：コンポジション、has-a 関係
//
// 実行方法:
//   npm run step4

// Task クラスは完成形を提供しています
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

// TODO: TaskManager クラスを実装する
//
// TaskManager は複数の Task をまとめて管理するクラスです
//
// プロパティ:
//   - tasks: Task の配列（private）
//
// メソッド:
//   - addTask(task: Task): void
//       tasks に Task を追加する
//
//   - removeTask(title: string): void
//       タイトルが一致する Task を tasks から削除する
//       ヒント: this.tasks = this.tasks.filter(...) で絞り込める
//
//   - findTask(title: string): Task | undefined
//       タイトルが一致する Task を返す。見つからなければ undefined を返す
//       ヒント: find() は filter() と違い「最初の1件だけ」を返す
//              見つからない場合は undefined になるため、戻り値の型が Task | undefined
//
//   - displayAll(): void
//       tasks の全タスクを display() で出力する
//
//   - get completedCount(): number  （getter）
//       完了済みタスクの件数を返す
//       ヒント: Step 3 で使った get キーワードと、filter().length の組み合わせ
//
//   - get pendingCount(): number  （getter）
//       未完了タスクの件数を返す

// --- 動作確認 ---
const manager = new TaskManager();

manager.addTask(new Task("買い物", "2024-12-31"));
manager.addTask(new Task("読書", "2024-11-30"));
manager.addTask(new Task("運動", "2024-10-15"));

console.log("--- 全タスク ---");
manager.displayAll();
// 期待:
// [未完了] 買い物（期日: 2024-12-31）
// [未完了] 読書（期日: 2024-11-30）
// [未完了] 運動（期日: 2024-10-15）

const found = manager.findTask("読書");
found?.complete();

manager.removeTask("運動");

console.log("\n--- 更新後 ---");
manager.displayAll();
// 期待:
// [未完了] 買い物（期日: 2024-12-31）
// [完了] 読書（期日: 2024-11-30）

console.log(`完了: ${manager.completedCount}件 / 未完了: ${manager.pendingCount}件`);
// 期待: 完了: 1件 / 未完了: 1件

export {};

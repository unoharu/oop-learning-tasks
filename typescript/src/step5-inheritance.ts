// Step 5: 継承を使って繰り返しタスクを追加する
// 学ぶ概念：継承、super、is-a 関係、オーバーライド、abstract class と interface の違い
//
// 実行方法:
//   npm run step5

// BaseTask クラスは完成形を提供しています
abstract class BaseTask {
  public dueDate: string;
  private _completed: boolean = false;
  private _title: string;

  constructor(title: string, dueDate: string) {
    this._title = title;
    this.dueDate = dueDate;
  }

  get title(): string {
    return this._title;
  }

  get completed(): boolean {
    return this._completed;
  }

  complete(): void {
    this._completed = true;
  }

  // abstract メソッド: サブクラスで必ず実装しなければならない
  // 「タスクの種別によって表示内容が変わる」ため、親クラスでは実装を強制するだけにしている
  abstract display(): void;
}

// TODO: RegularTask クラスを実装する
//   - BaseTask を継承する（extends を使う）
//   - コンストラクタで title と dueDate を受け取り、super() で親クラスに渡す
//     ヒント: super() はコンストラクタの先頭で必ず呼ぶ必要がある
//             親クラスの constructor(title, dueDate) と同じ引数を渡す
//   - display() を実装する
//     出力例: [未完了] 買い物（期日: 2024-12-31）

// TODO: RecurringTask クラスを実装する
//   - BaseTask を継承する
//   - interval: string 型のプロパティを追加（"毎日" / "毎週" / "毎月" など）
//   - コンストラクタで title / dueDate / interval を受け取る
//   - display() を実装する
//     出力例: [未完了] 運動（期日: 2024-10-15）【繰り返し: 毎日】

// --- 動作確認 ---
const regular = new RegularTask("買い物", "2024-12-31");
regular.display(); // 期待: [未完了] 買い物（期日: 2024-12-31）
regular.complete();
regular.display(); // 期待: [完了] 買い物（期日: 2024-12-31）

const recurring = new RecurringTask("運動", "2024-10-15", "毎日");
recurring.display(); // 期待: [未完了] 運動（期日: 2024-10-15）【繰り返し: 毎日】

// BaseTask 型の配列に両方入れられる（is-a 関係の確認）
const tasks: BaseTask[] = [regular, recurring];
console.log("\n--- 全タスク ---");
tasks.forEach((task) => task.display());

export {};

// Step 5: 継承を使って繰り返しタスクを追加する — 回答例
//
// 実行方法:
//   npm run answer5
//   ※ package.json の scripts に "answer5": "ts-node answers/step5-inheritance.ts" と定義されているため、
//      npm run answer5 は ts-node answers/step5-inheritance.ts の短縮呼び出しになる
//
// 末尾の `export {}` について:
//   src/ と answers/ で同じクラス名・変数名が存在するため、モジュール扱いにしてスコープを分離している。
//   実装には影響しないので気にしなくてよい。

// abstract class: インスタンスを直接作れないクラス
// 「BaseTask として new BaseTask() はできないが、共通の実装を持てる」という使い方をする
// interface との違い: abstract class はプロパティや具体的なメソッドの実装も持てる
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

  // complete() は全サブクラスで同じ動作なので親クラスで実装する
  // サブクラスで同じコードを書かずに済む（継承の利点）
  complete(): void {
    this._completed = true;
  }

  // abstract メソッド: 実装を持たず、サブクラスへの実装を強制する
  // display() の中身はタスク種別によって違うため、親クラスでは定義しない
  abstract display(): void;
}

// extends で BaseTask を継承する（RegularTask is-a BaseTask）
class RegularTask extends BaseTask {
  constructor(title: string, dueDate: string) {
    // super() で親クラスのコンストラクタを呼ぶ。extends を使う場合は必須
    // super() を呼ばないと this にアクセスできずエラーになる
    super(title, dueDate);
  }

  // abstract メソッドをオーバーライドして実装する
  // RegularTask 固有の表示形式をここで定義する
  display(): void {
    const status = this.completed ? "完了" : "未完了";
    console.log(`[${status}] ${this.title}（期日: ${this.dueDate}）`);
  }
}

class RecurringTask extends BaseTask {
  // 親クラスにない追加プロパティを持てるのも継承の特徴
  private interval: string;

  constructor(title: string, dueDate: string, interval: string) {
    super(title, dueDate);
    this.interval = interval;
  }

  // RecurringTask は繰り返し間隔を表示する独自のフォーマットを持つ
  display(): void {
    const status = this.completed ? "完了" : "未完了";
    console.log(`[${status}] ${this.title}（期日: ${this.dueDate}）【繰り返し: ${this.interval}】`);
  }
}

// --- 動作確認 ---
const regular = new RegularTask("買い物", "2024-12-31");
regular.display(); // [未完了] 買い物（期日: 2024-12-31）
regular.complete();
regular.display(); // [完了] 買い物（期日: 2024-12-31）

const recurring = new RecurringTask("運動", "2024-10-15", "毎日");
recurring.display(); // [未完了] 運動（期日: 2024-10-15）【繰り返し: 毎日】

// BaseTask 型の配列に RegularTask / RecurringTask の両方を入れられる
// これが is-a 関係の意味: どちらも「BaseTask である」ため同じ型として扱える
const tasks: BaseTask[] = [regular, recurring];
console.log("\n--- 全タスク ---");
tasks.forEach((task) => task.display());

export {};

// Step 3: getter / setter を実装する
// 学ぶ概念：getter / setter、バリデーション、カプセル化
//
// 実行方法:
//   npm run step3

class Task {
  public title: string;
  public dueDate: string;

  // private プロパティに _ をつけるのは「直接アクセスしないでください」という慣習
  // getter / setter と名前が衝突しないようにするためでもある
  private _completed: boolean;

  constructor(title: string, dueDate: string) {
    this.title = title;
    this.dueDate = dueDate;
    this._completed = false;
  }

  // getter: _completed を外部に公開する読み取り専用の窓口
  // task.completed と書くだけでアクセスでき、呼び出し側はメソッドと意識しなくてよい
  get completed(): boolean {
    return this._completed;
  }

  // setter: 外部からの書き込みをバリデーションで守る
  // 「完了 → 未完了」への変更を禁止することで、タスクの状態が逆戻りしない保証を持てる
  set completed(value: boolean) {
    if (this._completed && !value) {
      throw new Error("完了済みのタスクを未完了に戻すことはできません");
    }
    this._completed = value;
  }

  // getter はプロパティのように見えるが、呼ばれるたびに計算できる
  // 将来タスクにサブタスクが増えても、この getter だけ修正すれば呼び出し側は変わらない
  get completionRate(): number {
    return this._completed ? 100 : 0;
  }

  display(): void {
    const status = this._completed ? "完了" : "未完了";
    console.log(`[${status}] ${this.title}（期日: ${this.dueDate}）完了率: ${this.completionRate}%`);
  }
}

// --- 動作確認 ---
const task = new Task("買い物", "2024-12-31");
task.display(); // 期待: [未完了] 買い物（期日: 2024-12-31）完了率: 0%

task.completed = true;
task.display(); // 期待: [完了] 買い物（期日: 2024-12-31）完了率: 100%

// 以下のコメントを外すと Error がスローされることを確認する
// task.completed = false; // 一度完了したタスクを未完了に戻そうとするとエラー

export {};

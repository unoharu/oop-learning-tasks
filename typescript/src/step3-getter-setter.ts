// Step 3: getter / setter を実装する
// 学ぶ概念：getter / setter、バリデーション、カプセル化
//
// 実行方法:
//   npm run step3

class Task {
  public title: string;
  public dueDate: string;

  // TODO: completed を private にして外部から直接変更できないようにする
  //   慣習として private プロパティ名には _ をつける（例: _completed）
  //   コンストラクタ内の this.completed = false も this._completed = false に変更する
  completed: boolean;

  constructor(title: string, dueDate: string) {
    this.title = title;
    this.dueDate = dueDate;
    this.completed = false;
  }

  // TODO: completed の getter を実装する
  //   - get completed(): boolean { ... } の形で書く
  //   - _completed の値をそのまま返す

  // TODO: completed の setter を実装する
  //   - set completed(value: boolean) { ... } の形で書く
  //   - 「すでに完了済み（_completed が true）なのに false に戻そうとしている」場合はエラーをスローする
  //   - エラー文言: "完了済みのタスクを未完了に戻すことはできません"
  //   - 条件を通過した場合は _completed に value を代入する
  //   ヒント: throw new Error("...") でエラーをスローできる

  // TODO: 完了率を返す getter を実装する
  //   - get completionRate(): number { ... } の形で書く
  //   - 完了していれば 100、未完了なら 0 を返す

  display(): void {
    const status = this.completed ? "完了" : "未完了";
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

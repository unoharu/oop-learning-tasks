// Step 2: 型とアクセス修飾子を追加する
// 学ぶ概念：静的型付け、アクセス修飾子、カプセル化の入口
//
// 実行方法:
//   npm run step2

class Task {
  // TODO: 以下の修飾子と型を付けてプロパティを定義する
  //   - title    : 外部から読み書きできる文字列（public string）
  //   - dueDate  : 外部から読み書きできる文字列（public string）
  //   - completed: 外部から直接変更されたくない真偽値（private boolean）
  //   ヒント: public / private / readonly を使い分ける
  //
  //   ※ readonly にしたくなるかもしれないが、readonly はコンストラクタでの初期化後に
  //      一切の代入を禁止するため、complete() メソッド内で this.completed = true と
  //      書いたときにコンパイルエラーになる。readonly の限界を体験してみてもよい。
  //      解決策は Step 3 で学ぶ getter / setter。

  constructor(title: string, dueDate: string) {
    // TODO: 受け取った引数を this に代入する
  }

  complete(): void {
    // TODO: completed を true にする
    //   ※ readonly にした場合、ここで代入するとエラーになる。その場合はどうすべきか考える
  }

  display(): void {
    // TODO: [完了] または [未完了] とともにタイトルと期日を出力する
  }
}

// --- 動作確認 ---
const task = new Task("買い物", "2024-12-31");
task.display(); // 期待: [未完了] 買い物（期日: 2024-12-31）

task.complete();
task.display(); // 期待: [完了] 買い物（期日: 2024-12-31）

// 以下の行のコメントを外すとエラーになることを確認する（カプセル化の効果）
// task.completed = false;

export {};

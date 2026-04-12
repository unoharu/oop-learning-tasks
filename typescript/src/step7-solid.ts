// Step 7: コードを SOLID で見直す
// 学ぶ概念：SOLID 原則、リファクタリング
//
// 実行方法:
//   npm run step7
//
// このステップでは「問題のあるコード」を読み、SOLID 原則のどれに違反しているかを考え、
// リファクタリングして改善します。
//
// 以下に SOLID 原則に違反したコードを示します。
// 各 TODO のコメントを読み、問題を特定して改善してください。

// -----------------------------------------------------------------------
// 問題 1: 単一責任の原則（SRP）違反
// 1つのクラスが複数の責任を持っている
// -----------------------------------------------------------------------

// TODO: 以下の TaskManager は「タスク管理」「表示」「ファイル保存」を1つのクラスで担っている
//   どこが SRP に違反しているか考え、責任ごとにクラスを分割してリファクタリングしてください
//   視点: 「表示フォーマットが変わったとき」「保存先が変わったとき」「タスクの管理ロジックが変わったとき」
//         それぞれ別のクラスだけ修正すれば済むように分ける（3クラスに分割）

class TaskManagerBad {
  private tasks: { title: string; completed: boolean }[] = [];

  addTask(title: string): void {
    this.tasks.push({ title, completed: false });
  }

  completeTask(title: string): void {
    const task = this.tasks.find((t) => t.title === title);
    if (task) task.completed = true;
  }

  // 表示の責任（本来は別クラスが担うべき）
  printReport(): void {
    console.log("=== タスク一覧 ===");
    this.tasks.forEach((t) => {
      console.log(`[${t.completed ? "完了" : "未完了"}] ${t.title}`);
    });
    console.log(`完了: ${this.tasks.filter((t) => t.completed).length}件`);
  }

  // 保存の責任（本来は別クラスが担うべき）
  saveToFile(): void {
    // 実際のファイル保存は省略
    console.log("タスクをファイルに保存しました（模擬）");
  }
}

// -----------------------------------------------------------------------
// 問題 2: 開放閉鎖の原則（OCP）違反
// 新しい通知方法を追加するたびにクラスを修正しなければならない
// -----------------------------------------------------------------------

// TODO: 以下の Notifier は通知方法が増えるたびに notify() を修正しなければならない
//   Step 6 で Notifiable interface を使って通知を拡張した設計を思い出してください
//   同じ考え方で: 通知方法が増えるたびに既存のクラスを修正しなくて済む構造にする

class NotifierBad {
  notify(type: string, message: string): void {
    if (type === "console") {
      console.log(`[通知] ${message}`);
    } else if (type === "email") {
      console.log(`[メール] ${message}`);
    }
    // 新しい通知方法（Slack など）が増えるたびにここを修正しなければならない
  }
}

// -----------------------------------------------------------------------
// 問題 3: リスコフの置換原則（LSP）違反
// 親クラスの代わりにサブクラスを使うと動作が壊れる
// -----------------------------------------------------------------------

// TODO: 以下の PenguinBad は BirdBad を継承しているが、fly() で例外を投げる
//   これはリスコフの置換原則に違反している
//   BirdBad 型として使おうとすると例外が発生し、呼び出し側が安全に扱えない
//
//   視点: 「BirdBad 型の配列を forEach で fly() してもクラッシュしない」構造にするには？
//   ヒント: fly() を BirdBad から切り出し、飛べる鳥だけが implements する interface にする

class BirdBad {
  fly(): void {
    console.log("羽ばたいて飛ぶ");
  }
}

class PenguinBad extends BirdBad {
  fly(): void {
    throw new Error("ペンギンは飛べません"); // LSP 違反: 親クラスの期待を破っている
  }
}

// -----------------------------------------------------------------------
// 問題 4: インターフェース分離の原則（ISP）違反
// 実装クラスが使わないメソッドへの依存を強制されている
// -----------------------------------------------------------------------

// TODO: 以下の TaskOperationsBad interface は「追加」「取得」「表示」「保存」を1つに詰め込んでいる
//   表示だけを担うクラスが add() や save() も実装しなければならなくなる
//
//   視点: 「必要なメソッドだけを implements できる」interface に分割するには？
//   ヒント: 3つの interface に分割する（追加・取得 / 表示 / 保存）

interface TaskOperationsBad {
  add(title: string): void;
  getAll(): { title: string; completed: boolean }[];
  report(): void; // 表示の責任（別クラスに分けるべき）
  save(): void; // 保存の責任（別クラスに分けるべき）
}

// -----------------------------------------------------------------------
// 問題 5: 依存性逆転の原則（DIP）違反
// 高レベルモジュールが具体クラスに直接依存している
// -----------------------------------------------------------------------

// TODO: 以下の NotifyingTaskManagerBad は ConsoleNotifier に直接依存している
//   通知方法を EmailNotifier に変えたいとき、このクラス自体を修正しなければならない
//
//   視点: 「通知方法が変わってもこのクラスを変更しなくて済む」構造にするには？
//   ヒント: Notifiable interface に依存させ、コンストラクタで外部から notifier を受け取る（依存性の注入）

class ConcreteConsoleNotifier {
  notify(message: string): void {
    console.log(`[通知] ${message}`);
  }
}

class NotifyingTaskManagerBad {
  private notifier = new ConcreteConsoleNotifier(); // 具体クラスへの依存（DIP 違反）

  completeTask(title: string): void {
    console.log(`タスク「${title}」を完了にします`);
    this.notifier.notify(`タスク「${title}」が完了しました`);
  }
}

// -----------------------------------------------------------------------
// 動作確認（リファクタリング後に書き換えてください）
// -----------------------------------------------------------------------

// SRP のリファクタリング確認
const manager = new TaskManagerBad();
manager.addTask("買い物");
manager.addTask("読書");
manager.completeTask("買い物");
manager.printReport();
manager.saveToFile();

// OCP のリファクタリング確認
const notifier = new NotifierBad();
notifier.notify("console", "タスクが完了しました");
notifier.notify("email", "タスクが完了しました");

// LSP のリファクタリング確認
const birds: BirdBad[] = [new BirdBad(), new PenguinBad()];
try {
  birds.forEach((b) => b.fly()); // PenguinBad でクラッシュする
} catch (e) {
  console.log(`LSP 違反: ${(e as Error).message}`);
}

// DIP 違反の確認
const badTaskManager = new NotifyingTaskManagerBad();
badTaskManager.completeTask("買い物");

// ISP の動作確認はリファクタリング後に追加してください

export {};

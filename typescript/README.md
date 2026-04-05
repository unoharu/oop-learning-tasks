# TypeScript で学ぶ OOP

## OOPとは何か・なぜ必要か

OOP（オブジェクト指向プログラミング）とは、データと処理をひとまとめにした「オブジェクト」を中心にコードを組み立てる考え方です。

手続き型で書いたコードは、規模が小さいうちは問題ありません。しかしタスクの種類が増えたり、チームで開発したりするうちに以下の問題が起きてきます。

- 同じような処理があちこちにコピーされ、修正が1箇所では終わらない
- データがどこからでも自由に書き換えられ、バグの原因がわからなくなる
- 新しい機能を追加するたびに、既存のコードを壊してしまう

OOPの4原則はこれらの問題を解決するための考え方です。

| 原則 | 解決する問題 | このコースでの例 |
| --- | --- | --- |
| **カプセル化** | データが外部から自由に書き換えられる | タスクの完了状態を `setter` 経由でしか変更できないようにする |
| **継承** | 似たクラスで同じコードがコピーされる | `BaseTask` の共通処理を `RegularTask` / `RecurringTask` が引き継ぐ |
| **ポリモーフィズム** | 種類ごとに `if` 文で処理を分岐させている | `notify()` を呼ぶだけでメール通知・コンソール通知を切り替えられる |
| **抽象化** | 利用側が内部の詳細を知らないといけない | `interface` で「何ができるか」だけを公開し、実装の詳細を隠す |

このコースではタスク管理アプリを少しずつ作りながら、4原則が「なぜ必要になるか」を順番に体験していきます。最初から完璧な設計を目指すのではなく、**不便さを感じてから解決策を学ぶ**流れになっています。

---

## 環境構築

Node.js（v18以上）が必要です。

```bash
node --version   # v18.0.0 以上であることを確認
```

```bash
cd typescript
npm install
```

実行方法：

```bash
# package.json に定義されたスクリプトで実行
npm run step1    # src/step1-task.ts を実行
npm run answer1  # answers/step1-task.ts を実行（実装後に確認）

# または ts-node で直接ファイルを指定して実行
npx ts-node src/step1-task.ts
npx ts-node answers/step1-task.ts
```

---

## Step 1　Taskクラスを作る

### 学ぶ概念

- **クラス** — データ（プロパティ）と処理（メソッド）をひとまとめにした設計図
- **インスタンス** — クラスから `new` で作った実体
- **コンストラクタ** — インスタンス生成時に自動で呼ばれる初期化処理
- **メソッド** — クラスが持つ関数

---

### 手続き型との比較

まずOOPなしで「タスク」を表現するとどうなるか見てみましょう。

```typescript
// 手続き型：タスクをオブジェクトリテラルで表現
const task = {
  title: "買い物",
  dueDate: "2024-12-31",
  completed: false,
};

// タスクを完了にする関数
function completeTask(task: { title: string; dueDate: string; completed: boolean }) {
  task.completed = true;
}

// タスクを表示する関数
function displayTask(task: { title: string; dueDate: string; completed: boolean }) {
  const status = task.completed ? "完了" : "未完了";
  console.log(`[${status}] ${task.title}（期日: ${task.dueDate}）`);
}

completeTask(task);
displayTask(task); // [完了] 買い物（期日: 2024-12-31）
```

タスクが増えるたびに `completeTask(task1)` `completeTask(task2)` と関数を呼び出す必要があり、
データと処理がバラバラで管理しにくくなります。

---

### クラスで書き直す

同じ処理をクラスで表現します。

```typescript
class Task {
  title: string;
  dueDate: string;
  completed: boolean;

  // コンストラクタ：new Task(...) したときに呼ばれる
  constructor(title: string, dueDate: string) {
    this.title = title;
    this.dueDate = dueDate;
    this.completed = false; // 初期値は未完了
  }

  // メソッド：タスクを完了にする
  complete(): void {
    this.completed = true;
  }

  // メソッド：タスクの内容を表示する
  display(): void {
    const status = this.completed ? "完了" : "未完了";
    console.log(`[${status}] ${this.title}（期日: ${this.dueDate}）`);
  }
}

// インスタンスを作る
const task = new Task("買い物", "2024-12-31");
task.complete();
task.display(); // [完了] 買い物（期日: 2024-12-31）
```

データ（`title` / `dueDate` / `completed`）と処理（`complete()` / `display()`）が
`Task` クラスの中にまとまり、`task.complete()` と自然に呼び出せます。

---

### 構文リファレンス

#### クラス定義

```typescript
class クラス名 {
  // プロパティ（データ）
  プロパティ名: 型;

  // コンストラクタ
  constructor(引数: 型) {
    this.プロパティ名 = 引数;
  }

  // メソッド（処理）
  メソッド名(): 戻り値の型 {
    // 処理
  }
}
```

#### インスタンスの作成

```typescript
const 変数名 = new クラス名(引数);
```

#### `this` とは

クラスの中で「自分自身のインスタンス」を指すキーワードです。
`this.title` で「このインスタンスの `title`」にアクセスできます。

#### 戻り値なしのメソッドには `void`

```typescript
complete(): void {
  // 値を返さないメソッドには void を指定する
  this.completed = true;
}
```

---

### 問題

`src/step1-task.ts` を開いて、TODOコメントに従って `Task` クラスを実装してください。

実装できたら実行して動作を確認しましょう。

```bash
npm run step1
```

---

### 答え合わせ

実装後に `answers/step1-task.ts` と比較してください。
コメントには「なぜそう書いたか」の設計意図が書いてあります。

```bash
npm run answer1
```

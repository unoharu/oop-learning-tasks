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

### Step 1 学ぶ概念

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

### Step 1 構文リファレンス

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

### Step 1 問題

`src/step1-task.ts` を開いて、TODOコメントに従って `Task` クラスを実装してください。

実装できたら実行して動作を確認しましょう。

```bash
npm run step1
```

---

### Step 1 答え合わせ

実装後に `answers/step1-task.ts` と比較してください。
コメントには「なぜそう書いたか」の設計意図が書いてあります。

```bash
npm run answer1
```

---

## Step 2　型とアクセス修飾子を使う

### Step 2 学ぶ概念

- **アクセス修飾子** — プロパティやメソッドへのアクセス範囲を制限するキーワード
- **カプセル化** — データを外部から守り、決まった方法でしか操作できないようにする設計

---

### なぜアクセス修飾子が必要か

Step 1の `Task` クラスはプロパティが外部から自由に書き換えられます。

```typescript
const task = new Task("買い物", "2024-12-31");
task.completed = true;  // 直接書き換えられてしまう
task.completed = false; // 完了したはずのタスクを未完了に戻せてしまう
```

これは意図しない状態変化を招きます。アクセス修飾子でプロパティの公開範囲を制限することで、「完了状態は `complete()` メソッドでしか変えられない」というルールをコードで表現できます。

---

### アクセス修飾子の種類

| 修飾子 | アクセスできる範囲 | 使いどころ |
| --- | --- | --- |
| `public` | どこからでもアクセス可能（デフォルト） | 外部に公開してよいプロパティ・メソッド |
| `private` | クラスの内部からのみアクセス可能 | 外部から直接変更させたくないプロパティ |
| `readonly` | 初期化後は変更不可（読み取り専用） | 作成後に変わらない値（IDなど） |

```typescript
class Task {
  public title: string;       // 外部から読み書きできる
  private completed: boolean; // 外部から直接変更できない
  readonly id: number;        // 初期化後は変更できない

  constructor(title: string, id: number) {
    this.title = title;
    this.completed = false;
    this.id = id;
  }

  complete(): void {
    this.completed = true; // クラス内部からは変更できる
  }
}

const task = new Task("買い物", 1);
task.title = "読書";      // OK: public なので変更できる
task.complete();          // OK: メソッド経由で completed を変更できる
// task.completed = true; // エラー: private なので直接変更できない
// task.id = 2;           // エラー: readonly なので変更できない
```

---

### Step 2 構文リファレンス

#### TypeScript のショートハンド構文

コンストラクタの引数に修飾子を付けると、プロパティの宣言と代入を1行で書けます。

```typescript
// 通常の書き方
class Task {
  public title: string;
  private completed: boolean;

  constructor(title: string) {
    this.title = title;
    this.completed = false;
  }
}

// ショートハンド（同じ意味）
class Task {
  private completed: boolean = false;

  constructor(public title: string) {}
}
```

---

### Step 2 問題

`src/step2-access.ts` を開いて、TODOコメントに従って型とアクセス修飾子を追加してください。

実装できたら実行して動作を確認しましょう。

```bash
npm run step2
```

---

### Step 2 答え合わせ

実装後に `answers/step2-access.ts` と比較してください。

```bash
npm run answer2
```

---

## Step 3　getter / setter を実装する

### Step 3 学ぶ概念

- **getter** — プロパティのように見えるが、呼ばれるたびに値を計算して返せる読み取り専用の窓口
- **setter** — プロパティへの書き込みにバリデーションを挟める書き込み口
- **バリデーション** — 不正な値・状態変化を事前に弾く処理

---

### なぜ getter / setter が必要か

Step 2で `completed` を `private` にしましたが、このままでは外部から値を読めません。かといって `public` に戻すと自由に書き換えられてしまいます。

getter / setter を使うと「読めるが、書き込みは制御する」という細かい制御が可能になります。

```typescript
// private だと外部から読めない
const task = new Task("買い物", "2024-12-31");
console.log(task.completed); // エラー: プロパティ 'completed' はプライベートです

// getter を使うと読み取り専用で公開できる
get completed(): boolean {
  return this._completed;
}
console.log(task.completed); // OK: 読めるようになる
task.completed = false;      // setter がなければ書き込みはエラーになる
```

---

### getter / setter の構文

```typescript
class Task {
  private _completed: boolean = false;
  // private プロパティに _ をつけるのは getter / setter と名前が衝突しないようにするため

  // getter: task.completed と書くだけで呼び出せる
  get completed(): boolean {
    return this._completed;
  }

  // setter: task.completed = true と書くと呼び出される
  set completed(value: boolean) {
    // ここでバリデーションを挟める
    this._completed = value;
  }
}

const task = new Task();
console.log(task.completed); // getter が呼ばれる
task.completed = true;       // setter が呼ばれる
```

#### バリデーションの追加

setter の中で条件をチェックし、不正な場合は `Error` をスローします。

```typescript
set completed(value: boolean) {
  if (this._completed && !value) {
    throw new Error("完了済みのタスクを未完了に戻すことはできません");
  }
  this._completed = value;
}
```

呼び出し側では `try / catch` でエラーを受け取れます。

```typescript
try {
  task.completed = false;
} catch (e) {
  console.log((e as Error).message);
}
```

---

### Step 3 問題

`src/step3-getter-setter.ts` を開いて、TODOコメントに従って getter / setter を実装してください。

```bash
npm run step3
```

---

### Step 3 答え合わせ

```bash
npm run answer3
```

---

## Step 4　TaskManagerクラスを作る

### Step 4 学ぶ概念

- **コンポジション** — あるクラスが別のクラスのインスタンスをプロパティとして持つ関係
- **has-a 関係** — 「TaskManager は Task を持つ」という関係。継承の「is-a 関係」と対になる概念

---

### なぜ TaskManager が必要か

Step 3までの `Task` クラスは1つのタスクを管理できますが、複数のタスクを扱おうとするとすぐ限界が来ます。

```typescript
const task1 = new Task("買い物", "2024-12-31");
const task2 = new Task("読書", "2024-11-30");
const task3 = new Task("運動", "2024-10-15");

// 全タスクを表示したいだけでこうなる
task1.display();
task2.display();
task3.display();

// 完了済みの件数を数えるのも手動
let count = 0;
if (task1.completed) count++;
if (task2.completed) count++;
if (task3.completed) count++;
```

`TaskManager` クラスを作ることで、複数タスクへの操作を1箇所に集約できます。

```typescript
const manager = new TaskManager();
manager.addTask(new Task("買い物", "2024-12-31"));
manager.addTask(new Task("読書", "2024-11-30"));

manager.displayAll();                        // 全タスクを表示
console.log(manager.completedCount);         // 完了済み件数
```

---

### コンポジションの構文

クラスのプロパティに別クラスのインスタンスの配列を持たせます。

```typescript
class TaskManager {
  private tasks: Task[] = []; // Task の配列を持つ（コンポジション）

  addTask(task: Task): void {
    this.tasks.push(task);
  }
}

const manager = new TaskManager();
manager.addTask(new Task("買い物", "2024-12-31"));
```

#### 配列操作のメソッド

| メソッド | 用途 | 例 |
| --- | --- | --- |
| `push(item)` | 末尾に追加 | `this.tasks.push(task)` |
| `filter(fn)` | 条件に合う要素だけの新しい配列を返す | `this.tasks.filter(t => !t.completed)` |
| `find(fn)` | 条件に合う最初の要素を返す（なければ `undefined`） | `this.tasks.find(t => t.title === title)` |
| `forEach(fn)` | 各要素に処理を実行する | `this.tasks.forEach(t => t.display())` |

#### オプショナルチェーン `?.`

`find()` は要素が見つからない場合に `undefined` を返します。`?.` を使うと `undefined` のときメソッド呼び出しをスキップできます。

```typescript
const found = manager.findTask("読書"); // Task | undefined
found?.complete(); // found が undefined でもエラーにならない
```

---

### Step 4 問題

`src/step4-task-manager.ts` を開いて、TODOコメントに従って `TaskManager` クラスを実装してください。

```bash
npm run step4
```

---

### Step 4 答え合わせ

```bash
npm run answer4
```

---

## Step 5　継承：共通部分を親クラスへ

### Step 5 学ぶ概念

- **継承** — 既存のクラスの機能を引き継いで新しいクラスを作る仕組み
- **is-a 関係** — `RegularTask` は `BaseTask` である、という親子関係
- **super** — 親クラスのコンストラクタやメソッドを呼び出すキーワード
- **オーバーライド** — 親クラスのメソッドをサブクラスで上書きすること
- **abstract class** — インスタンスを直接作れない抽象クラス

---

### なぜ継承が必要か

新しいタスク種別（繰り返しタスク）を追加するとき、継承なしだとこうなります。

```typescript
class RegularTask {
  title: string;
  dueDate: string;
  private _completed: boolean = false;
  // ...complete() / getter など Step 3 と全く同じコードが並ぶ
}

class RecurringTask {
  title: string;
  dueDate: string;
  private _completed: boolean = false;
  interval: string;
  // ...complete() / getter なども同じコードが並ぶ
}
```

`complete()` やプロパティ管理など共通の処理がコピーされます。修正が必要になったとき全クラスを直す必要があり、修正漏れのリスクが生まれます。

継承を使うと共通部分を親クラス（`BaseTask`）に集約できます。

```typescript
abstract class BaseTask {
  // 共通のプロパティとメソッドをここに集める
}

class RegularTask extends BaseTask {
  // RegularTask 固有の部分だけを書く
}

class RecurringTask extends BaseTask {
  private interval: string; // RecurringTask だけが持つプロパティ
}
```

---

### 継承の構文

#### extends

```typescript
class 子クラス extends 親クラス {
  constructor(引数) {
    super(親クラスに渡す引数); // 必ず最初に呼ぶ
  }
}
```

#### abstract class と abstract メソッド

```typescript
abstract class BaseTask {
  // 具体的な実装を持つメソッド（全サブクラスで共通）
  complete(): void {
    this._completed = true;
  }

  // abstract メソッド: 実装を持たず、サブクラスへの実装を強制する
  abstract display(): void;
}
```

`abstract class` は `new BaseTask()` で直接インスタンスを作れません。
必ずサブクラスを経由して使います。

#### abstract class と interface の違い

| | abstract class | interface |
| --- | --- | --- |
| インスタンス化 | できない | できない |
| 実装を持てるか | 持てる（共通処理を書ける） | 持てない（定義のみ） |
| プロパティ | 持てる | 持てない（型定義のみ） |
| 継承・実装 | `extends`（1つだけ） | `implements`（複数可） |
| 使いどころ | 共通の実装を持つ基底クラス | 「何ができるか」の契約（Step 6で登場） |

#### is-a 関係の確認

`RegularTask extends BaseTask` であれば、`RegularTask` は `BaseTask` 型の変数に代入できます。

```typescript
const tasks: BaseTask[] = [
  new RegularTask("買い物", "2024-12-31"),
  new RecurringTask("運動", "2024-10-15", "毎日"),
];
tasks.forEach((task) => task.display()); // どちらも display() を呼べる
```

---

### Step 5 問題

`src/step5-inheritance.ts` を開いて、TODOコメントに従って `RegularTask` と `RecurringTask` を実装してください。

```bash
npm run step5
```

---

### Step 5 答え合わせ

```bash
npm run answer5
```

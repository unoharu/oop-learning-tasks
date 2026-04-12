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

> **補足**: ここで使っている `{ ... }` は **オブジェクトリテラル**と呼ばれるJavaScriptのデータ構造です。OOPで「オブジェクト」というときは「クラスから `new` で作った実体（インスタンス）」を指します。同じ「オブジェクト」という言葉が2つの意味で使われているので注意してください。

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

### Step 2 から Step 3 へ — なぜ getter / setter が必要になるのか

Step 2 で `completed` を `private` にしたことで、外部からの不正な書き換えを防げるようになりました。しかし同時に、外部から値を「読む」こともできなくなりました（`task.completed` がコンパイルエラーになる）。

「では `readonly` にすれば読み取れるのでは？」と思うかもしれません。試してみると、今度は `complete()` メソッドの中で `this.completed = true` と書いた瞬間にコンパイルエラーになります。`readonly` は「コンストラクタでの初期化後は誰も変更できない」という意味だからです — クラス内部からの変更も禁止されます。

この問題を解決するのが **getter / setter** と `_` プレフィックスの組み合わせです。「外部からは読み取り専用で公開しつつ、クラス内部からは制御した書き込みができる」状態を実現します。

---

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

実装できたら実行して動作を確認しましょう。

```bash
npm run step3
```

期待される出力：

```text
[未完了] 買い物（期日: 2024-12-31）完了率: 0%
[完了] 買い物（期日: 2024-12-31）完了率: 100%
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

**`filter` と `find` の違い**：`filter` は条件に合う要素すべてを新しい配列として返します。`removeTask` では「削除したいタスク**以外**」で配列を作り直すことで削除を実現します（`this.tasks = this.tasks.filter(...)`）。一方 `find` は最初に一致した要素を1件だけ返します。見つからなければ `undefined` を返すため、戻り値の型が `Task | undefined` になります。

#### オプショナルチェーン `?.`

`find()` は要素が見つからない場合に `undefined` を返します。`?.` を使うと `undefined` のときメソッド呼び出しをスキップできます。

```typescript
const found = manager.findTask("読書"); // Task | undefined
found?.complete(); // found が undefined でもエラーにならない
```

---

### Step 4 クラス関係図

```
TaskManager
└── tasks: Task[]   ← has-a 関係（コンポジション）
         │
         └─ addTask() / removeTask() / findTask() / displayAll()
```

TaskManager は Task を「持つ」。`new TaskManager()` → 内部に `Task[]` を保持。

---

### Step 4 よくある間違い

**配列に直接アクセスする**

```typescript
// NG: tasks を public にして外部から操作する
manager.tasks.push(task);
manager.tasks = [];
```

`tasks` を `private` にして操作をメソッド経由に限定することで、「どんな状態でも TaskManager の内部が一貫している」という保証が得られます。

**removeTask が splice でインデックス操作になる**

```typescript
// NG: インデックスを手動で管理する（バグになりやすい）
const index = this.tasks.findIndex(t => t.title === title);
this.tasks.splice(index, 1); // index が -1 のとき最後の要素を消す
```

`filter` で「削除したい要素以外」の配列を作り直す方が安全で意図が明確です。

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

**なぜ通常のクラスではなく `abstract class` を使うのか**：通常のクラスでも継承はできますが、`new BaseTask()` と書くと実装の不完全な親クラスを直接インスタンス化できてしまいます。`abstract class` にすると直接のインスタンス化を禁止できます。また `abstract display()` と書くことで、サブクラスが `display()` を実装していない場合にコンパイルエラーになります。「実装の強制」をコードで表現できます。

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

### Step 5 クラス関係図

```
        BaseTask (abstract)
       /                   \
RegularTask           RecurringTask
  display()             interval: string
                        display()
```

`extends` で矢印の方向に「is-a 関係」が生まれる。
`BaseTask` 型の変数に `RegularTask` も `RecurringTask` も代入できる。

---

### Step 5 よくある間違い

**コードの再利用だけを目的に継承を使う**

```typescript
// NG: EmailNotifier と ConsoleNotifier に共通コードがあるからといって継承する
class EmailNotifier extends ConsoleNotifier {
  // ...
}
```

「is-a 関係か？」を問いかけてください。`EmailNotifier` は `ConsoleNotifier` **ではありません**。
共通コードを再利用したいだけなら、継承ではなく関数やコンポジションを使います。

**abstract でないクラスを基底クラスにする**

`abstract class` にすれば `new BaseTask()` を TypeScript が禁止します。
普通のクラスでは直接インスタンス化できてしまうため、意図が伝わりにくくなります。

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

---

## Step 6　interfaceで通知機能を作る

### Step 6 学ぶ概念

- **interface** — 「何ができるか」だけを定義する契約。実装は持たない
- **ポリモーフィズム** — 同じメソッド名で、クラスごとに異なる動作をさせること
- **抽象化** — 呼び出し側が内部の詳細を知らなくてよい状態にすること

---

### なぜ interface が必要か

通知方法が増えるたびに `Task` クラスを修正するのは壊れやすい設計です。

```typescript
// interface なし: 通知方法ごとに Task を修正しなければならない
complete(): void {
  this._completed = true;
  if (notifyType === "console") {
    console.log(`[通知] ${this.title}が完了しました`);
  } else if (notifyType === "email") {
    console.log(`[メール] ${this.title}が完了しました`);
  }
  // 通知方法が増えるたびにここを修正する必要がある
}
```

`Notifiable` interface を定義し、通知の実装を外に出すことで `Task` クラスは通知方法を知らなくてよくなります。

```typescript
interface Notifiable {
  notify(message: string): void;
}

// Task は「Notifiable なら何でも受け取れる」
class Task {
  constructor(title: string, dueDate: string, notifier?: Notifiable) {}

  complete(): void {
    this._completed = true;
    this.notifier?.notify(`タスク「${this.title}」が完了しました`);
    // 通知方法が増えても Task クラスは一切変更しなくてよい
  }
}
```

---

### interface の構文

```typescript
// 定義: メソッドのシグネチャ（名前・引数・戻り値の型）だけを書く
interface Notifiable {
  notify(message: string): void;
}

// 実装: implements キーワードで契約を宣言する
class ConsoleNotifier implements Notifiable {
  notify(message: string): void {
    console.log(`[通知] ${message}`); // 実装はクラスごとに異なってよい
  }
}

class EmailNotifier implements Notifiable {
  constructor(private emailAddress: string) {}

  notify(message: string): void {
    console.log(`[メール → ${this.emailAddress}] ${message}`);
  }
}
```

#### ポリモーフィズムの確認

`Notifiable` 型の変数にはどの実装クラスでも代入できます。

```typescript
const notifiers: Notifiable[] = [
  new ConsoleNotifier(),
  new EmailNotifier("user@example.com"),
];

// 呼び出し側は実装の詳細を知らなくてよい
notifiers.forEach((n) => n.notify("テスト通知"));
// [通知] テスト通知
// [メール → user@example.com] テスト通知
```

#### オプショナル引数 `?`

コンストラクタの引数に `?` をつけると省略可能になります。

```typescript
constructor(title: string, dueDate: string, notifier?: Notifiable) {
  this.notifier = notifier; // 省略された場合は undefined
}

// notifier あり
new Task("買い物", "2024-12-31", new ConsoleNotifier());

// notifier なし（通知不要なタスク）
new Task("運動", "2024-10-15");
```

---

### Step 6 クラス関係図

```
«interface» Notifiable
    notify(message): void
          ↑               ↑
ConsoleNotifier     EmailNotifier
(implements)        (implements)

Task ──uses──→ Notifiable
```

`Task` は `Notifiable` に依存しているが、`ConsoleNotifier` や `EmailNotifier` を直接知らない。
新しい通知方法を追加しても `Task` クラスを変更する必要がない。

---

### Step 6 よくある間違い

**1回しか実装しない interface を定義する**

```typescript
// NG: ConsoleNotifier しか実装しないのに interface を作る
interface Logger {
  log(message: string): void;
}
class ConsoleLogger implements Logger { ... }
```

interface は「複数の実装が存在する、または将来追加される」ときに価値を持ちます。
1つしか実装しないなら、最初はクラスだけで十分です。

**Step 5 との混乱: extends vs implements**

- `extends`（継承）: 親クラスのコードを引き継ぐ。is-a 関係。
- `implements`（interface の実装）: 契約を宣言するだけ。コードは引き継がない。

`ConsoleNotifier extends EmailNotifier` ではなく `implements Notifiable` を使うことで、「通知できる」という能力だけを宣言します。

---

### Step 6 問題

このステップでは、以下の3つの作業をします：

1. `Notifiable` interface を定義する
2. `ConsoleNotifier` と `EmailNotifier` の2クラスを実装する
3. 既存の `Task` クラスに `notifier` プロパティを追加し、`complete()` 内で通知を呼び出す

この3つが揃って初めて「通知方法を知らずに通知を送れる」ポリモーフィズムが動きます。

`src/step6-interface.ts` を開いて、TODOコメントに従って実装してください。

```bash
npm run step6
```

---

### Step 6 答え合わせ

```bash
npm run answer6
```

---

## Step 7　コードをSOLIDで見直す

### Step 7 学ぶ概念

- **SOLID原則** — 保守しやすいオブジェクト指向設計のための5つの原則
- **リファクタリング** — 動作を変えずにコードの構造を改善すること

---

### SOLID 原則とは

| 原則 | 正式名称 | 一言で言うと |
| --- | --- | --- |
| **S** | 単一責任の原則（SRP） | 1クラスの変更理由は1つだけ |
| **O** | 開放閉鎖の原則（OCP） | 拡張に開いて、修正に閉じる |
| **L** | リスコフの置換原則（LSP） | 親クラスの代わりにサブクラスを使っても動作が壊れない |
| **I** | インターフェース分離の原則（ISP） | 使わないメソッドへの依存を強制しない |
| **D** | 依存性逆転の原則（DIP） | 具体的な実装ではなく抽象（interface）に依存する |

このステップでは S・O をコードで体験し、L・I・D も演習として実装します。

---

### S：単一責任の原則（SRP）

1つのクラスが持つ「変更理由」は1つであるべきという原則です。

```typescript
// 違反: TaskManager が「管理」「表示」「保存」の3つの責任を持っている
class TaskManagerBad {
  addTask() { ... }      // タスク管理
  printReport() { ... }  // 表示
  saveToFile() { ... }   // 保存
}
```

表示の仕様が変わったとき、タスク管理のコードも入っている `TaskManagerBad` を修正するのは危険です。

```typescript
// 改善: 責任ごとにクラスを分ける
class TaskRepository { ... } // タスク管理だけ
class TaskReporter { ... }   // 表示だけ
class TaskStorage { ... }    // 保存だけ
```

---

### O：開放閉鎖の原則（OCP）

既存のコードを修正せずに機能を拡張できる設計にする原則です。

```typescript
// 違反: 通知方法が増えるたびに notify() を修正しなければならない
class NotifierBad {
  notify(type: string, message: string): void {
    if (type === "console") { ... }
    else if (type === "email") { ... }
    // Slack を追加するにはここを修正する必要がある
  }
}
```

```typescript
// 改善: interface で契約を定義し、新しい通知方法はクラスを追加するだけ
interface Notifiable {
  notify(message: string): void;
}
class SlackNotifier implements Notifiable { ... } // 既存コードを変更しない
```

---

### L：リスコフの置換原則（LSP）

親クラスの代わりにサブクラスを使っても動作が壊れないという原則です。

```typescript
// 違反: Penguin は Bird のサブクラスだが fly() で例外を投げる
class BirdBad {
  fly(): void { console.log("羽ばたく") }
}
class PenguinBad extends BirdBad {
  fly(): void { throw new Error("飛べません") } // Bird 型として扱うとクラッシュ
}

// 改善: 「飛べる」という能力を interface に切り出す
interface Flyable { fly(): void }
class Bird { eat(): void { ... } }
class Sparrow extends Bird implements Flyable { fly(): void { ... } }
class Penguin extends Bird { swim(): void { ... } } // Flyable を持たない
```

---

### I：インターフェース分離の原則（ISP）

使わないメソッドへの依存を強制しない原則です。

```typescript
// 違反: 表示クラスが add() や save() も実装しなければならない
interface TaskOperationsBad {
  add(title: string): void;
  getAll(): Task[];
  report(): void; // ← 表示クラス専用なのに全クラスが実装を強制される
  save(): void;   // ← 保存クラス専用
}

// 改善: 役割ごとに interface を分割する
interface TaskMutable   { add(title: string): void; getAll(): Task[]; }
interface TaskReportable { report(tasks: Task[]): void; }
interface TaskPersistable { save(tasks: Task[]): void; }
```

---

### D：依存性逆転の原則（DIP）

高レベルモジュールが低レベルの具体クラスに依存しない原則です。

```typescript
// 違反: TaskManager が ConsoleNotifier に直接依存している
class NotifyingTaskManagerBad {
  private notifier = new ConsoleNotifier(); // ← 具体クラスへの依存
}

// 改善: interface に依存させ、具体クラスは外から注入する（依存性の注入）
class NotifyingTaskManager {
  constructor(private notifier: Notifiable) {} // ← interface への依存
}

// 使う側が通知方法を選べる
new NotifyingTaskManager(new ConsoleNotifier());
new NotifyingTaskManager(new SlackNotifier()); // TaskManager は変更不要
```

---

### Step 7 クラス関係図

SRP 改善後：

```text
TaskRepository   TaskReporter   TaskStorage
(管理のみ)        (表示のみ)      (保存のみ)
```

OCP + DIP 改善後：

```text
«interface» Notifiable
    ├── ConsoleNotifier
    ├── EmailNotifier
    └── SlackNotifier  ← 追加しても既存コードは変わらない

NotifyingTaskManager --> Notifiable（interface に依存）
                      （具体クラスである ConsoleNotifier に直接依存しない）
```

---

### Step 7 よくある間違い

#### 責任を細かく分けすぎる

SRP は「1クラス1責任」ですが、「1クラス1メソッド」ではありません。
変更理由が同じなら同じクラスに置いて構いません。過度な分割は逆に複雑さを増します。

#### SOLID をすべて同時に適用しようとする

実際の開発では「まず動くコードを書き、不便を感じた箇所だけ適用する」のが現実的です。
SOLID は設計のガイドラインであり、最初から完璧な設計を目指す必要はありません。

---

### Step 7 問題

`src/step7-solid.ts` を開いて、問題のあるコードを特定し、全5原則（S・O・L・I・D）に従ってリファクタリングしてください。

```bash
npm run step7
```

---

### Step 7 答え合わせ

```bash
npm run answer7
```

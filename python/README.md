# Python で学ぶ OOP

## OOPとは何か・なぜ必要か

OOP（オブジェクト指向プログラミング）とは、データと処理をひとまとめにした「オブジェクト」を中心にコードを組み立てる考え方です。

手続き型で書いたコードは、規模が小さいうちは問題ありません。しかしタスクの種類が増えたり、チームで開発したりするうちに以下の問題が起きてきます。

- 同じような処理があちこちにコピーされ、修正が1箇所では終わらない
- データがどこからでも自由に書き換えられ、バグの原因がわからなくなる
- 新しい機能を追加するたびに、既存のコードを壊してしまう

OOPの4原則はこれらの問題を解決するための考え方です。

| 原則 | 解決する問題 | このコースでの例 |
| --- | --- | --- |
| **カプセル化** | データが外部から自由に書き換えられる | タスクの完了状態を `@property` 経由でしか変更できないようにする |
| **継承** | 似たクラスで同じコードがコピーされる | `BaseTask` の共通処理を `RegularTask` / `RecurringTask` が引き継ぐ |
| **ポリモーフィズム** | 種類ごとに `if` 文で処理を分岐させている | `notify()` を呼ぶだけでメール通知・コンソール通知を切り替えられる |
| **抽象化** | 利用側が内部の詳細を知らないといけない | `Protocol` で「何ができるか」だけを公開し、実装の詳細を隠す |

このコースではタスク管理アプリを少しずつ作りながら、4原則が「なぜ必要になるか」を順番に体験していきます。

---

## 環境構築

Python 3.9以上が必要です。外部ライブラリは不要です。

```bash
python3 --version   # 3.9.0 以上であることを確認
```

実行方法：

```bash
# 各ステップの問題を実行
python3 src/step1_task.py

# 答え合わせ（実装後に確認）
python3 answers/step1_task.py
```

---

## Step 1　Taskクラスを作る

### Step 1 学ぶ概念

- **クラス** — データ（プロパティ）と処理（メソッド）をひとまとめにした設計図
- **インスタンス** — クラスから作った実体
- **`__init__`** — インスタンス生成時に自動で呼ばれる初期化処理（コンストラクタ）
- **メソッド** — クラスが持つ関数
- **`self`** — クラスの中で「自分自身のインスタンス」を指すキーワード

---

### 手続き型との比較

まずOOPなしで「タスク」を表現するとどうなるか見てみましょう。

```python
# 手続き型：タスクを辞書で表現
task = {
    "title": "買い物",
    "due_date": "2024-12-31",
    "completed": False,
}

# タスクを完了にする関数
def complete_task(task):
    task["completed"] = True

# タスクを表示する関数
def display_task(task):
    status = "完了" if task["completed"] else "未完了"
    print(f"[{status}] {task['title']}（期日: {task['due_date']}）")

complete_task(task)
display_task(task)  # [完了] 買い物（期日: 2024-12-31）
```

タスクが増えるたびに `complete_task(task1)` `complete_task(task2)` と関数を呼び出す必要があり、データと処理がバラバラで管理しにくくなります。

---

### クラスで書き直す

同じ処理をクラスで表現します。

```python
class Task:
    def __init__(self, title: str, due_date: str) -> None:
        self.title = title
        self.due_date = due_date
        self.completed = False

    def complete(self) -> None:
        self.completed = True

    def display(self) -> None:
        status = "完了" if self.completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）")

task = Task("買い物", "2024-12-31")
task.complete()
task.display()  # [完了] 買い物（期日: 2024-12-31）
```

データ（`title` / `due_date` / `completed`）と処理（`complete()` / `display()`）が `Task` クラスの中にまとまり、`task.complete()` と自然に呼び出せます。

---

### Step 1 構文リファレンス

#### クラス定義

```python
class クラス名:
    def __init__(self, 引数: 型) -> None:
        self.プロパティ名 = 引数

    def メソッド名(self) -> 戻り値の型:
        # 処理
        pass
```

#### `self` とは

クラスの中で「自分自身のインスタンス」を指すキーワードです。常にメソッドの第1引数として書きますが、呼び出し時は渡す必要はありません。

```python
task = Task("買い物", "2024-12-31")
task.complete()  # self は自動的に task になる
```

#### 型ヒント

Python は型ヒントを書かなくても動きますが、書くことでコードの意図が伝わりやすくなります。

```python
def __init__(self, title: str, due_date: str) -> None:
    # str: 文字列型   bool: 真偽値型   None: 戻り値なし
```

---

### Step 1 問題

`src/step1_task.py` を開いて、TODOコメントに従って `Task` クラスを実装してください。

```bash
python3 src/step1_task.py
```

---

### Step 1 答え合わせ

実装後に `answers/step1_task.py` と比較してください。コメントには「なぜそう書いたか」の設計意図が書いてあります。

```bash
python3 answers/step1_task.py
```

---

## Step 2　アクセス制御を追加する

### Step 2 学ぶ概念

- **アクセス制御** — プロパティへのアクセスを制限する仕組み
- **名前マングリング** — `__` プレフィックスによりクラス外からの直接アクセスを制限する仕組み
- **カプセル化** — データを外部から守り、決まった方法でしか操作できないようにする設計

---

### なぜアクセス制御が必要か

Step 1の `Task` クラスはプロパティが外部から自由に書き換えられます。

```python
task = Task("買い物", "2024-12-31")
task.completed = True   # 直接書き換えられてしまう
task.completed = False  # 完了したはずのタスクを未完了に戻せてしまう
```

これは意図しない状態変化を招きます。

---

### TypeScript との比較（重要な差分）

TypeScript には `private` キーワードがありますが、Python には同等のキーワードがありません。

| | TypeScript | Python |
| --- | --- | --- |
| 記法 | `private completed: boolean` | `self.__completed: bool` |
| 強制力 | コンパイラが完全に強制する | 名前マングリングで「制限」はできるが完全ではない |
| 外部からのアクセス | コンパイルエラーになる | `task._Task__completed` でアクセスできてしまう |
| 慣習 | `private` を使えば意図が明確 | `__` を見たら「直接触れない」という合意 |

Python は「完全な強制」ではなく「慣習による合意」でカプセル化する言語です。`__` プレフィックスは「このプロパティに外部から直接触れないでください」というシグナルです。

```python
class Task:
    def __init__(self, title: str, due_date: str) -> None:
        self.title = title      # 外部から読み書きできる（プレフィックスなし）
        self.__completed = False  # 外部から直接変更されたくない（__ プレフィックス）

task = Task("買い物", "2024-12-31")
task.title = "読書"         # OK: プレフィックスなしは自由に変更できる
# task.__completed = True  # AttributeError: '__completed' はこの名前で存在しない
# task._Task__completed = True  # これは動いてしまう（Python の限界）
```

---

### Step 2 構文リファレンス

#### `__` プレフィックス（名前マングリング）

`__` から始まるプロパティ名は、クラス内部では `self.__completed` として扱えますが、クラス外からは `_クラス名__completed` という名前に変換されます。これを名前マングリングと呼びます。

```python
class Task:
    def __init__(self) -> None:
        self.__completed = False  # 実際は _Task__completed として保存される

task = Task()
# task.__completed       # AttributeError
# task._Task__completed  # これはアクセスできる（マングリング後の実際の名前）
```

---

### Step 2 問題

`src/step2_access.py` を開いて、TODOコメントに従って `__` プレフィックスを追加してください。

```bash
python3 src/step2_access.py
```

---

### Step 2 答え合わせ

```bash
python3 answers/step2_access.py
```

---

## Step 3　@property / @setter を実装する

### Step 2 から Step 3 へ — なぜ @property が必要になるのか

Step 2で `__completed` を追加しましたが、このままでは外部から値を「読む」こともできません（`task.__completed` が AttributeError になる）。かといって `_completed`（シングルアンダースコア）に戻すと自由に書き換えられてしまいます。

この問題を解決するのが `@property` デコレータです。「外部からは読み取り専用で公開しつつ、書き込みはバリデーションで守る」状態を実現します。

---

### Step 3 学ぶ概念

- **`@property`** — プロパティのように見えるが、呼ばれるたびに値を計算して返せる読み取り専用の窓口
- **`@プロパティ名.setter`** — プロパティへの書き込みにバリデーションを挟める書き込み口
- **バリデーション** — 不正な値・状態変化を事前に弾く処理

---

### TypeScript との比較

| TypeScript | Python |
| --- | --- |
| `get completed(): boolean { ... }` | `@property` + `def completed(self) -> bool:` |
| `set completed(value: boolean) { ... }` | `@completed.setter` + `def completed(self, value: bool):` |
| setter がない getter = readonly | setter を定義しなければ読み取り専用 |
| `throw new Error("...")` | `raise ValueError("...")` |

---

### Step 3 構文リファレンス

#### @property と @setter

```python
class Task:
    def __init__(self) -> None:
        self._completed = False  # バッキングストアには _ をつける慣習

    @property
    def completed(self) -> bool:
        # task.completed と書くだけで呼び出せる（メソッドに見えない）
        return self._completed

    @completed.setter
    def completed(self, value: bool) -> None:
        # task.completed = True と書いたときにここが呼ばれる
        if self._completed and not value:
            raise ValueError("完了済みのタスクを未完了に戻すことはできません")
        self._completed = value

task = Task()
print(task.completed)  # @property が呼ばれる
task.completed = True  # @completed.setter が呼ばれる
```

#### 読み取り専用プロパティ

setter を定義しなければ読み取り専用になります。

```python
@property
def completion_rate(self) -> int:
    return 100 if self._completed else 0

# task.completion_rate        # OK: 読める
# task.completion_rate = 50   # AttributeError: setter がない
```

---

### Step 3 問題

`src/step3_getter_setter.py` を開いて、TODOコメントに従って `@property` / `@setter` を実装してください。

```bash
python3 src/step3_getter_setter.py
```

---

### Step 3 答え合わせ

```bash
python3 answers/step3_getter_setter.py
```

---

## Step 4　TaskManagerクラスを作る

### Step 4 学ぶ概念

- **コンポジション（has-a 関係）** — あるクラスが別のクラスのインスタンスを「持つ」関係
- **リスト内包表記** — Python らしいリストの生成・フィルタリング方法

---

### コンポジションとは

`TaskManager` は `Task` を「持つ」関係です。「is-a（〜である）」ではなく「has-a（〜を持つ）」の関係を、プロパティにインスタンスを持たせることで表現します。

```python
class TaskManager:
    def __init__(self) -> None:
        self.__tasks: list[Task] = []  # TaskManager は Task を持つ（has-a）
```

---

### Step 4 構文リファレンス

#### リスト内包表記

TypeScript の `filter()` / `find()` に相当するPythonのパターンです。

```python
# TypeScript: this.tasks.filter(task => task.title !== title)
self.__tasks = [t for t in self.__tasks if t.title != title]

# TypeScript: this.tasks.find(task => task.title === title)
result = next((t for t in self.__tasks if t.title == title), None)
# 見つからない場合は None を返す（TypeScript の undefined に相当）
```

---

### Step 4 問題

`src/step4_task_manager.py` を開いて、`TaskManager` クラスを実装してください。

```bash
python3 src/step4_task_manager.py
```

---

### Step 4 答え合わせ

```bash
python3 answers/step4_task_manager.py
```

---

## Step 5　継承を使って繰り返しタスクを追加する

### Step 5 学ぶ概念

- **継承** — 既存のクラスの機能を引き継いで新しいクラスを作る仕組み
- **`super()`** — 親クラスのコンストラクタやメソッドを呼ぶ
- **is-a 関係** — 「RegularTask は BaseTask である」という関係
- **`ABC`** — 直接インスタンス化できない抽象基底クラス（abstract class）
- **`@abstractmethod`** — サブクラスで必ず実装しなければならないメソッド

---

### TypeScript との比較

| TypeScript | Python |
| --- | --- |
| `abstract class BaseTask` | `from abc import ABC, abstractmethod` + `class BaseTask(ABC):` |
| `abstract display(): void` | `@abstractmethod` + `def display(self) -> None: ...` |
| `class RegularTask extends BaseTask` | `class RegularTask(BaseTask):` |
| `super(title, dueDate)` | `super().__init__(title, due_date)` |

---

### Step 5 構文リファレンス

#### 抽象基底クラス（ABC）

```python
from abc import ABC, abstractmethod

class BaseTask(ABC):
    def __init__(self, title: str, due_date: str) -> None:
        self.__title = title
        self.due_date = due_date

    @property
    def title(self) -> str:
        return self.__title

    # 全サブクラスで共通の実装を持てる（TypeScript の interface との違い）
    def complete(self) -> None:
        self._completed = True

    # サブクラスで必ず実装しなければならないメソッド
    @abstractmethod
    def display(self) -> None:
        ...

# BaseTask() は直接インスタンス化できない
# base = BaseTask("test", "2024-01-01")  # TypeError
```

#### 継承

```python
class RegularTask(BaseTask):
    def __init__(self, title: str, due_date: str) -> None:
        super().__init__(title, due_date)  # 親クラスの __init__ を呼ぶ（必須）

    def display(self) -> None:  # @abstractmethod を実装する
        status = "完了" if self.completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）")
```

---

### Step 5 問題

`src/step5_inheritance.py` を開いて、`RegularTask` と `RecurringTask` を実装してください。

```bash
python3 src/step5_inheritance.py
```

---

### Step 5 答え合わせ

```bash
python3 answers/step5_inheritance.py
```

---

## Step 6　Protocolで通知機能を作る

### Step 6 学ぶ概念

- **`Protocol`** — TypeScript の `interface` に相当する仕組み
- **ポリモーフィズム** — 同じメソッド名でクラスごとに異なる動作をさせる
- **依存性の注入** — 依存するオブジェクトを外から渡す設計パターン

---

### TypeScript との比較（最重要な差分）

TypeScript の `interface` に最も近いのは `typing.Protocol` です。

| 特徴 | TypeScript interface | Python Protocol | Python ABC |
| --- | --- | --- | --- |
| 継承の強制 | `implements` で明示（必要） | 不要（メソッドを持つだけで満たせる） | 必要（継承必須） |
| 型チェック | コンパイル時 | 型チェッカー（mypy等）のみ | 実行時（ABCが強制） |
| ダックタイピング | 不可 | 可（構造的部分型） | 不可 |
| 実装の共有 | 不可 | 不可 | 可（ABCにメソッド実装可） |

**なぜ Protocol を選ぶか**: TypeScript の interface に最も近い「構造的型付け」を実現できるからです。`notify()` を持っていれば自動的に `Notifiable` として扱われます（`implements` 不要）。

```python
from typing import Protocol

class Notifiable(Protocol):
    def notify(self, message: str) -> None: ...

class ConsoleNotifier:
    # implements を書かなくてよい
    # notify() を持っているだけで Notifiable として扱われる
    def notify(self, message: str) -> None:
        print(f"[通知] {message}")
```

---

### Step 6 構文リファレンス

#### Optional 型

TypeScript の `Notifiable | undefined` に相当します。

```python
from typing import Protocol, Optional

def __init__(self, notifier: Optional[Notifiable] = None) -> None:
    self.__notifier = notifier

def complete(self) -> None:
    if self.__notifier is not None:
        self.__notifier.notify(f"タスク「{self.title}」が完了しました")
    # TypeScript の self.notifier?.notify(...) に相当
```

---

### Step 6 問題

`src/step6_protocol.py` を開いて、`Notifiable` Protocol と `ConsoleNotifier` / `EmailNotifier` を実装してください。

```bash
python3 src/step6_protocol.py
```

---

### Step 6 答え合わせ

```bash
python3 answers/step6_protocol.py
```

---

## Step 7　SOLIDで見直す

### Step 7 学ぶ概念

SOLID原則とは、保守しやすいオブジェクト指向設計のための5つの原則です。

| 原則 | 略称 | 意味 |
| --- | --- | --- |
| 単一責任の原則 | SRP | 1つのクラスは1つのことだけを担う |
| 開放閉鎖の原則 | OCP | 拡張に開いて、修正に閉じる |
| リスコフの置換原則 | LSP | サブクラスは親クラスの代わりに使えなければならない |
| インターフェース分離の原則 | ISP | クライアントが使わないメソッドへの依存を強制しない |
| 依存性逆転の原則 | DIP | 抽象に依存させ、具体クラスに依存させない |

---

### Step 7 問題

`src/step7_solid.py` には5つの「問題のあるコード」があります。各クラスがどの原則に違反しているかを考え、リファクタリングしてください。

```bash
python3 src/step7_solid.py
```

---

### Step 7 答え合わせ

```bash
python3 answers/step7_solid.py
```

# Step 7: コードを SOLID で見直す — 回答例
#
# 実行方法:
#   python answers/step7_solid.py

from typing import Protocol


# -----------------------------------------------------------------------
# 問題 1 の改善: 単一責任の原則（SRP）
# -----------------------------------------------------------------------

# タスクのデータだけを持つ
# 「1クラス = 1つの責任」にすることで、変更理由が1つになる
class Task:
    def __init__(self, title: str, completed: bool = False) -> None:
        self.title = title
        self.completed = completed


# タスクの追加・完了・検索だけを担う
# 表示や保存の方法が変わっても、このクラスは変更しなくてよい
class TaskRepository:
    def __init__(self) -> None:
        self.__tasks: list[Task] = []

    def add(self, title: str) -> None:
        self.__tasks.append(Task(title))

    def complete(self, title: str) -> None:
        for task in self.__tasks:
            if task.title == title:
                task.completed = True

    def get_all(self) -> list[Task]:
        return self.__tasks


# 表示だけを担う
# 表示フォーマットが変わってもリポジトリは変更しなくてよい
class TaskReporter:
    def report(self, tasks: list[Task]) -> None:
        print("=== タスク一覧 ===")
        for t in tasks:
            status = "完了" if t.completed else "未完了"
            print(f"[{status}] {t.title}")
        print(f"完了: {sum(1 for t in tasks if t.completed)}件")


# 保存だけを担う
# 保存先が DB に変わってもリポジトリや表示クラスは影響を受けない
class TaskStorage:
    def save(self, tasks: list[Task]) -> None:
        print("タスクをファイルに保存しました（模擬）")


# -----------------------------------------------------------------------
# 問題 2 の改善: 開放閉鎖の原則（OCP）
# -----------------------------------------------------------------------

# Protocol を使って「通知できる」という契約だけを定義する
# 新しい通知方法を追加するときは新しいクラスを追加するだけでよく、
# 既存コードを修正する必要がない（拡張に開いて、修正に閉じている）
class Notifiable(Protocol):
    def notify(self, message: str) -> None: ...


class ConsoleNotifier:
    def notify(self, message: str) -> None:
        print(f"[通知] {message}")


class EmailNotifier:
    def notify(self, message: str) -> None:
        print(f"[メール] {message}")


# 新しい通知方法の追加 = 新しいクラスを追加するだけ。既存クラスは変更しない
class SlackNotifier:
    def notify(self, message: str) -> None:
        print(f"[Slack] {message}")


# -----------------------------------------------------------------------
# 問題 3 の改善: リスコフの置換原則（LSP）
# -----------------------------------------------------------------------

# 「飛べる」という能力を Protocol に切り出す
# Bird 型として扱う文脈では fly() を呼ばないため、Penguin が Bird を壊さない
class Flyable(Protocol):
    def fly(self) -> None: ...


class Bird:
    # 飛べるかどうかは Bird の責任ではなく、Flyable という能力の問題
    def eat(self) -> None:
        print("食事をする")


# 飛べる鳥だけが Flyable を満たす
class Sparrow(Bird):
    def fly(self) -> None:
        print("羽ばたいて飛ぶ")


# Penguin は Flyable を満たさないため fly() を呼ばれる心配がない
# Bird 型として扱っても動作が壊れない（LSP を満たす）
class Penguin(Bird):
    def swim(self) -> None:
        print("泳ぐ")


# -----------------------------------------------------------------------
# 問題 4 の改善: インターフェース分離の原則（ISP）
# -----------------------------------------------------------------------

# 役割ごとに Protocol を分割する
# 各クラスは必要な Protocol だけを満たせばよい
class TaskMutable(Protocol):
    def add(self, title: str) -> None: ...
    def get_all(self) -> list[Task]: ...


class TaskReportable(Protocol):
    def report(self, tasks: list[Task]) -> None: ...


class TaskPersistable(Protocol):
    def save(self, tasks: list[Task]) -> None: ...

# TaskRepository は TaskMutable だけを満たす（表示・保存を知らなくてよい）
# TaskReporter は TaskReportable だけを満たす（追加・保存を知らなくてよい）
# TaskStorage は TaskPersistable だけを満たす（追加・表示を知らなくてよい）


# -----------------------------------------------------------------------
# 問題 5 の改善: 依存性逆転の原則（DIP）
# -----------------------------------------------------------------------

# 高レベルモジュール（タスク管理）が低レベルモジュール（通知方法）に依存しない
# Notifiable Protocol（抽象）に依存させ、具体クラスはコンストラクタで注入する
class NotifyingTaskManager:
    # 具体クラスではなく Protocol に依存する（依存性の注入）
    def __init__(self, notifier: Notifiable) -> None:
        self.__notifier = notifier

    def complete_task(self, title: str) -> None:
        print(f"タスク「{title}」を完了にします")
        # 通知方法が何であるかを知らなくてよい。notifier に委ねるだけ
        self.__notifier.notify(f"タスク「{title}」が完了しました")


# -----------------------------------------------------------------------
# 動作確認
# -----------------------------------------------------------------------

# SRP の確認: 責任ごとにクラスが分かれている
repo = TaskRepository()
repo.add("買い物")
repo.add("読書")
repo.complete("買い物")

reporter = TaskReporter()
reporter.report(repo.get_all())

storage = TaskStorage()
storage.save(repo.get_all())

print("")

# OCP の確認: 通知方法が増えても既存コードを変更しない
notifiers: list[Notifiable] = [
    ConsoleNotifier(),
    EmailNotifier(),
    SlackNotifier(),  # 新しい通知方法を追加しても他のクラスは変更不要
]
for n in notifiers:
    n.notify("タスクが完了しました")

print("")

# LSP の確認: Bird 型として扱っても動作が壊れない
birds: list[Bird] = [Sparrow(), Penguin()]
for b in birds:
    b.eat()  # どちらも eat() は実行できる

flying_birds: list[Flyable] = [Sparrow()]  # 飛べる鳥だけが Flyable に入る
for b in flying_birds:
    b.fly()

print("")

# DIP の確認: 通知方法をコンストラクタで差し替えられる
task_manager_with_console = NotifyingTaskManager(ConsoleNotifier())
task_manager_with_console.complete_task("買い物")

task_manager_with_slack = NotifyingTaskManager(SlackNotifier())
task_manager_with_slack.complete_task("読書")

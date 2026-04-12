# Step 7: コードを SOLID で見直す
# 学ぶ概念：SOLID 原則、リファクタリング
#
# 実行方法:
#   python src/step7_solid.py
#
# このステップでは「問題のあるコード」を読み、SOLID 原則のどれに違反しているかを考え、
# リファクタリングして改善します。
#
# 以下に SOLID 原則に違反したコードを示します。
# 各 TODO のコメントを読み、問題を特定して改善してください。

from typing import Protocol


# -----------------------------------------------------------------------
# 問題 1: 単一責任の原則（SRP）違反
# 1つのクラスが複数の責任を持っている
# -----------------------------------------------------------------------

# TODO: 以下の TaskManagerBad は「タスク管理」「表示」「ファイル保存」を1つのクラスで担っている
#   どこが SRP に違反しているか考え、責任ごとにクラスを分割してリファクタリングしてください
#   視点: 「表示フォーマットが変わったとき」「保存先が変わったとき」「タスクの管理ロジックが変わったとき」
#         それぞれ別のクラスだけ修正すれば済むように分ける（3クラスに分割）

class TaskManagerBad:
    def __init__(self) -> None:
        self.__tasks: list[dict] = []

    def add_task(self, title: str) -> None:
        self.__tasks.append({"title": title, "completed": False})

    def complete_task(self, title: str) -> None:
        for task in self.__tasks:
            if task["title"] == title:
                task["completed"] = True

    # 表示の責任（本来は別クラスが担うべき）
    def print_report(self) -> None:
        print("=== タスク一覧 ===")
        for t in self.__tasks:
            status = "完了" if t["completed"] else "未完了"
            print(f"[{status}] {t['title']}")
        print(f"完了: {sum(1 for t in self.__tasks if t['completed'])}件")

    # 保存の責任（本来は別クラスが担うべき）
    def save_to_file(self) -> None:
        print("タスクをファイルに保存しました（模擬）")


# -----------------------------------------------------------------------
# 問題 2: 開放閉鎖の原則（OCP）違反
# 新しい通知方法を追加するたびにクラスを修正しなければならない
# -----------------------------------------------------------------------

# TODO: 以下の NotifierBad は通知方法が増えるたびに notify() を修正しなければならない
#   Step 6 で Protocol を使って通知を拡張した設計を思い出してください
#   同じ考え方で: 通知方法が増えるたびに既存のクラスを修正しなくて済む構造にする

class NotifierBad:
    def notify(self, type_: str, message: str) -> None:
        if type_ == "console":
            print(f"[通知] {message}")
        elif type_ == "email":
            print(f"[メール] {message}")
        # 新しい通知方法（Slack など）が増えるたびにここを修正しなければならない


# -----------------------------------------------------------------------
# 問題 3: リスコフの置換原則（LSP）違反
# 親クラスの代わりにサブクラスを使うと動作が壊れる
# -----------------------------------------------------------------------

# TODO: 以下の PenguinBad は BirdBad を継承しているが、fly() で例外を投げる
#   これはリスコフの置換原則に違反している
#   BirdBad 型として使おうとすると例外が発生し、呼び出し側が安全に扱えない
#
#   視点: 「BirdBad 型のリストを for ループで fly() してもクラッシュしない」構造にするには？
#   ヒント: fly() を BirdBad から切り出し、飛べる鳥だけが implements する Protocol にする

class BirdBad:
    def fly(self) -> None:
        print("羽ばたいて飛ぶ")

class PenguinBad(BirdBad):
    def fly(self) -> None:
        raise NotImplementedError("ペンギンは飛べません")  # LSP 違反: 親クラスの期待を破っている


# -----------------------------------------------------------------------
# 問題 4: インターフェース分離の原則（ISP）違反
# 実装クラスが使わないメソッドへの依存を強制されている
# -----------------------------------------------------------------------

# TODO: 以下の TaskOperationsBad Protocol は「追加」「取得」「表示」「保存」を1つに詰め込んでいる
#   表示だけを担うクラスが add() や save() も実装しなければならなくなる
#
#   視点: 「必要なメソッドだけを実装できる」Protocol に分割するには？
#   ヒント: 3つの Protocol に分割する（追加・取得 / 表示 / 保存）

class TaskOperationsBad(Protocol):
    def add(self, title: str) -> None: ...
    def get_all(self) -> list[dict]: ...
    def report(self) -> None: ...  # 表示の責任（別 Protocol に分けるべき）
    def save(self) -> None: ...    # 保存の責任（別 Protocol に分けるべき）


# -----------------------------------------------------------------------
# 問題 5: 依存性逆転の原則（DIP）違反
# 高レベルモジュールが具体クラスに直接依存している
# -----------------------------------------------------------------------

# TODO: 以下の NotifyingTaskManagerBad は ConcreteConsoleNotifier に直接依存している
#   通知方法を EmailNotifier に変えたいとき、このクラス自体を修正しなければならない
#
#   視点: 「通知方法が変わってもこのクラスを変更しなくて済む」構造にするには？
#   ヒント: Notifiable Protocol に依存させ、コンストラクタで外部から notifier を受け取る（依存性の注入）

class ConcreteConsoleNotifier:
    def notify(self, message: str) -> None:
        print(f"[通知] {message}")

class NotifyingTaskManagerBad:
    def __init__(self) -> None:
        self.__notifier = ConcreteConsoleNotifier()  # 具体クラスへの依存（DIP 違反）

    def complete_task(self, title: str) -> None:
        print(f"タスク「{title}」を完了にします")
        self.__notifier.notify(f"タスク「{title}」が完了しました")


# -----------------------------------------------------------------------
# 動作確認（リファクタリング後に書き換えてください）
# -----------------------------------------------------------------------

# SRP のリファクタリング確認
manager = TaskManagerBad()
manager.add_task("買い物")
manager.add_task("読書")
manager.complete_task("買い物")
manager.print_report()
manager.save_to_file()

# OCP のリファクタリング確認
notifier = NotifierBad()
notifier.notify("console", "タスクが完了しました")
notifier.notify("email", "タスクが完了しました")

# LSP のリファクタリング確認
birds: list[BirdBad] = [BirdBad(), PenguinBad()]
try:
    for b in birds:
        b.fly()  # PenguinBad でクラッシュする
except NotImplementedError as e:
    print(f"LSP 違反: {e}")

# DIP 違反の確認
bad_task_manager = NotifyingTaskManagerBad()
bad_task_manager.complete_task("買い物")

# ISP の動作確認はリファクタリング後に追加してください

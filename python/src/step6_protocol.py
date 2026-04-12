# Step 6: Protocol で通知機能を作る
# 学ぶ概念：Protocol（interface の Python 版）、ポリモーフィズム、抽象化
#
# 実行方法:
#   python src/step6_protocol.py
#
# ※ Python には TypeScript の interface キーワードはありません。
#   代わりに typing.Protocol を使うと「このメソッドを持つクラスなら何でも受け入れる」
#   という TypeScript の interface に近い表現ができます。
#
#   TypeScript の interface との違い:
#   - TypeScript: implements キーワードで「この interface を実装する」と明示する必要がある
#   - Python Protocol: notify() を持っていれば自動的に Notifiable として扱われる（継承不要）
#     これを「構造的部分型」と呼ぶ。ダックタイピングの型安全版。

from typing import Protocol, Optional


# TODO: Notifiable Protocol を定義する
#   TypeScript の interface Notifiable に相当する
#   class Notifiable(Protocol): の形で書く
#   notify(self, message: str) -> None メソッドを持つ
#   ヒント: メソッドのボディには ... を書く（「実装なし」を意味する）

# TODO: ConsoleNotifier クラスを実装する
#   - TypeScript と違い class ConsoleNotifier: とだけ書けばよい（継承・implements は不要）
#     Notifiable の notify() を実装していれば自動的に Protocol を満たす
#   - notify() でメッセージをコンソールに出力する
#     出力例: [通知] タスク「買い物」が完了しました

# TODO: EmailNotifier クラスを実装する
#   - コンストラクタで email_address: str を受け取る
#   - notify() でメール送信を模したメッセージをコンソールに出力する
#     出力例: [メール → user@example.com] タスク「買い物」が完了しました


# Task クラスは完成形を提供しています
class Task:
    def __init__(self, title: str, due_date: str, notifier: Optional[Notifiable] = None) -> None:
        self.title = title
        self.due_date = due_date
        self._completed: bool = False
        # TODO: notifier を受け取って self.__notifier に保存する

    @property
    def completed(self) -> bool:
        return self._completed

    def complete(self) -> None:
        self._completed = True
        # TODO: self.__notifier が None でなければ notify() を呼ぶ
        #   ヒント: if self.__notifier is not None:
        #             self.__notifier.notify(f"タスク「{self.title}」が完了しました")

    def display(self) -> None:
        status = "完了" if self._completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）")


# --- 動作確認 ---
console_notifier = ConsoleNotifier()
email_notifier = EmailNotifier("user@example.com")

task1 = Task("買い物", "2024-12-31", console_notifier)
task1.complete()
# 期待: [通知] タスク「買い物」が完了しました

task2 = Task("読書", "2024-11-30", email_notifier)
task2.complete()
# 期待: [メール → user@example.com] タスク「読書」が完了しました

# notifier なし（通知不要なタスク）
task3 = Task("運動", "2024-10-15")
task3.complete()  # 通知なし

# ポリモーフィズムの確認: Notifiable を満たすオブジェクトをリストにまとめて同じ notify() を呼ぶ
notifiers: list[Notifiable] = [console_notifier, email_notifier]
for n in notifiers:
    n.notify("テスト通知")
# 期待:
# [通知] テスト通知
# [メール → user@example.com] テスト通知

# Step 6: Protocol で通知機能を作る — 回答例
#
# 実行方法:
#   python answers/step6_protocol.py

from typing import Protocol, Optional


# Protocol: 「何ができるか」だけを定義する契約
# TypeScript の interface と同等の役割を果たす
#
# TypeScript との違い:
#   TypeScript: implements を書いて明示的に契約を宣言する
#   Python Protocol: notify() を持っていれば自動的に Notifiable として扱われる（継承不要）
#
# ABC との違い:
#   ABC: class ConsoleNotifier(Notifiable): のように継承が必要（名義的型付け）
#   Protocol: 継承なしでメソッドを持つだけで満たせる（構造的型付け）
#   → Protocol はダックタイピングの型安全版であり、TypeScript の interface に最も近い
class Notifiable(Protocol):
    def notify(self, message: str) -> None:
        ...


# implements は不要。notify() を実装しているだけで Notifiable を満たす
# ConsoleNotifier と EmailNotifier は全く異なる実装を持つが、
# どちらも Notifiable を満たすため同じ型として扱える（ポリモーフィズム）
class ConsoleNotifier:
    def notify(self, message: str) -> None:
        print(f"[通知] {message}")


class EmailNotifier:
    def __init__(self, email_address: str) -> None:
        self.__email_address = email_address

    # 同じ notify() という名前でも、実装はクラスごとに異なる
    # 呼び出し側は「notify() を呼べばいい」とだけ知っていればよく、
    # 内部でメールを送るかコンソールに出すかを意識しなくてよい（抽象化）
    def notify(self, message: str) -> None:
        print(f"[メール → {self.__email_address}] {message}")


class Task:
    def __init__(self, title: str, due_date: str, notifier: Optional[Notifiable] = None) -> None:
        self.title = title
        self.due_date = due_date
        self._completed: bool = False
        # Notifiable 型として受け取ることで、ConsoleNotifier / EmailNotifier どちらでも受け入れられる
        # None を許容することで「通知なし」のタスクも作れる
        self.__notifier = notifier

    @property
    def completed(self) -> bool:
        return self._completed

    def complete(self) -> None:
        self._completed = True
        # notifier があれば通知を送る。なければ何もしない
        # Task クラスは「どう通知するか」を知らなくてよい。notifier に委ねるだけ（抽象化）
        if self.__notifier is not None:
            self.__notifier.notify(f"タスク「{self.title}」が完了しました")

    def display(self) -> None:
        status = "完了" if self._completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）")


# --- 動作確認 ---
console_notifier = ConsoleNotifier()
email_notifier = EmailNotifier("user@example.com")

task1 = Task("買い物", "2024-12-31", console_notifier)
task1.complete()  # [通知] タスク「買い物」が完了しました

task2 = Task("読書", "2024-11-30", email_notifier)
task2.complete()  # [メール → user@example.com] タスク「読書」が完了しました

# notifier なし（通知不要なタスク）
task3 = Task("運動", "2024-10-15")
task3.complete()  # 通知なし

# ポリモーフィズムの確認: Notifiable を満たすオブジェクトをリストにまとめられる
notifiers: list[Notifiable] = [console_notifier, email_notifier]
for n in notifiers:
    n.notify("テスト通知")
# [通知] テスト通知
# [メール → user@example.com] テスト通知

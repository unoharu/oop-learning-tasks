# Step 5: 継承を使って繰り返しタスクを追加する — 回答例
#
# 実行方法:
#   python answers/step5_inheritance.py

from abc import ABC, abstractmethod


# ABC（Abstract Base Class）は TypeScript の abstract class に相当する
# ABC を継承すると「直接 BaseTask() でインスタンス化できないクラス」になる
#
# なぜ ABC を使うか:
#   complete() など「全サブクラスで共通の実装」をここに持たせたいため。
#   TypeScript の interface は実装を持てないが、ABC はメソッドの実装を持てる。
#   Python の Protocol も実装を持てないので、共通実装が必要な場合は ABC を選ぶ。
class BaseTask(ABC):
    def __init__(self, title: str, due_date: str) -> None:
        # __ プレフィックスで名前マングリングを行う
        # サブクラスから self.__title ではアクセスできない（self._BaseTask__title になる）
        # サブクラスは self.title という @property 経由でアクセスする
        self.__title = title
        self.due_date = due_date
        self.__completed: bool = False

    @property
    def title(self) -> str:
        return self.__title

    @property
    def completed(self) -> bool:
        return self.__completed

    # complete() は全サブクラスで同じ動作なので親クラスで実装する
    # サブクラスで同じコードを書かずに済む（継承の利点）
    def complete(self) -> None:
        self.__completed = True

    # @abstractmethod: 実装を持たず、サブクラスへの実装を強制する
    # display() の中身はタスク種別によって違うため、親クラスでは定義しない
    # TypeScript の abstract display(): void と同等
    @abstractmethod
    def display(self) -> None:
        ...


# class RegularTask(BaseTask): で BaseTask を継承する（RegularTask is-a BaseTask）
# TypeScript の class RegularTask extends BaseTask と同等
class RegularTask(BaseTask):
    def __init__(self, title: str, due_date: str) -> None:
        # super().__init__() で親クラスのコンストラクタを呼ぶ
        # TypeScript の super(title, dueDate) と同等
        # 親クラスを初期化しないと __title / __completed が設定されない
        super().__init__(title, due_date)

    # @abstractmethod をオーバーライドして実装する
    # RegularTask 固有の表示形式をここで定義する
    def display(self) -> None:
        status = "完了" if self.completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）")


class RecurringTask(BaseTask):
    def __init__(self, title: str, due_date: str, interval: str) -> None:
        super().__init__(title, due_date)
        # 親クラスにない追加プロパティを持てるのも継承の特徴
        self.interval = interval

    # RecurringTask は繰り返し間隔を表示する独自のフォーマットを持つ
    def display(self) -> None:
        status = "完了" if self.completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）【繰り返し: {self.interval}】")


# --- 動作確認 ---
regular = RegularTask("買い物", "2024-12-31")
regular.display()  # [未完了] 買い物（期日: 2024-12-31）
regular.complete()
regular.display()  # [完了] 買い物（期日: 2024-12-31）

recurring = RecurringTask("運動", "2024-10-15", "毎日")
recurring.display()  # [未完了] 運動（期日: 2024-10-15）【繰り返し: 毎日】

# BaseTask 型のリストに RegularTask / RecurringTask の両方を入れられる
# これが is-a 関係の意味: どちらも「BaseTask である」ため同じ型として扱える
tasks: list[BaseTask] = [regular, recurring]
print("\n--- 全タスク ---")
for task in tasks:
    task.display()

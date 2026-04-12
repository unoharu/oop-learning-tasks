# Step 5: 継承を使って繰り返しタスクを追加する
# 学ぶ概念：継承、super()、is-a 関係、オーバーライド、ABC（抽象基底クラス）
#
# 実行方法:
#   python src/step5_inheritance.py

from abc import ABC, abstractmethod


# BaseTask クラスは完成形を提供しています
# ABC は TypeScript の abstract class に相当する
# ABC を継承することで「直接インスタンス化できないクラス」になる
class BaseTask(ABC):
    def __init__(self, title: str, due_date: str) -> None:
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

    # @abstractmethod: サブクラスで必ず実装しなければならないメソッド
    # TypeScript の abstract display(): void に相当する
    # display() の中身はタスク種別によって違うため、親クラスでは定義しない
    @abstractmethod
    def display(self) -> None:
        ...


# TODO: RegularTask クラスを実装する
#   - BaseTask を継承する（class RegularTask(BaseTask): の形で書く）
#   - __init__ で title と due_date を受け取り、super().__init__(title, due_date) で親クラスを初期化する
#     ヒント: super().__init__() は TypeScript の super() に相当する
#             extends を使う場合と同様、親クラスを初期化するために必須
#   - display() を実装する
#     出力例: [未完了] 買い物（期日: 2024-12-31）

# TODO: RecurringTask クラスを実装する
#   - BaseTask を継承する
#   - interval: str 型のプロパティを追加（"毎日" / "毎週" / "毎月" など）
#   - __init__ で title / due_date / interval を受け取る
#     super().__init__(title, due_date) で親クラスを初期化し、self.interval = interval を設定する
#   - display() を実装する
#     出力例: [未完了] 運動（期日: 2024-10-15）【繰り返し: 毎日】


# --- 動作確認 ---
regular = RegularTask("買い物", "2024-12-31")
regular.display()  # 期待: [未完了] 買い物（期日: 2024-12-31）
regular.complete()
regular.display()  # 期待: [完了] 買い物（期日: 2024-12-31）

recurring = RecurringTask("運動", "2024-10-15", "毎日")
recurring.display()  # 期待: [未完了] 運動（期日: 2024-10-15）【繰り返し: 毎日】

# BaseTask 型のリストに両方入れられる（is-a 関係の確認）
tasks: list[BaseTask] = [regular, recurring]
print("\n--- 全タスク ---")
for task in tasks:
    task.display()

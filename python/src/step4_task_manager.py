# Step 4: TaskManager クラスを作る
# 学ぶ概念：コンポジション、has-a 関係
#
# 実行方法:
#   python src/step4_task_manager.py

from __future__ import annotations

# Task クラスは完成形を提供しています
class Task:
    def __init__(self, title: str, due_date: str) -> None:
        self.title = title
        self.due_date = due_date
        self._completed: bool = False

    @property
    def completed(self) -> bool:
        return self._completed

    @completed.setter
    def completed(self, value: bool) -> None:
        if self._completed and not value:
            raise ValueError("完了済みのタスクを未完了に戻すことはできません")
        self._completed = value

    def complete(self) -> None:
        self._completed = True

    def display(self) -> None:
        status = "完了" if self._completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）")


# TODO: TaskManager クラスを実装する
#
# TaskManager は複数の Task をまとめて管理するクラスです
#
# プロパティ:
#   - __tasks: Task のリスト（private）、初期値は空リスト
#
# メソッド:
#   - add_task(task: Task) -> None
#       __tasks に Task を追加する
#
#   - remove_task(title: str) -> None
#       タイトルが一致する Task を __tasks から削除する
#       ヒント: リスト内包表記で新しいリストを作り直す
#              self.__tasks = [t for t in self.__tasks if t.title != title]
#
#   - find_task(title: str) -> Task | None
#       タイトルが一致する Task を返す。見つからなければ None を返す
#       ヒント: next((t for t in self.__tasks if t.title == title), None)
#              TypeScript の find() に相当する（見つからない場合は None = undefined と同等）
#
#   - display_all() -> None
#       __tasks の全タスクを display() で出力する
#
#   @property
#   - completed_count -> int（getter）
#       完了済みタスクの件数を返す
#
#   @property
#   - pending_count -> int（getter）
#       未完了タスクの件数を返す


# --- 動作確認 ---
manager = TaskManager()

manager.add_task(Task("買い物", "2024-12-31"))
manager.add_task(Task("読書", "2024-11-30"))
manager.add_task(Task("運動", "2024-10-15"))

print("--- 全タスク ---")
manager.display_all()
# 期待:
# [未完了] 買い物（期日: 2024-12-31）
# [未完了] 読書（期日: 2024-11-30）
# [未完了] 運動（期日: 2024-10-15）

found = manager.find_task("読書")
if found:
    found.complete()

manager.remove_task("運動")

print("\n--- 更新後 ---")
manager.display_all()
# 期待:
# [未完了] 買い物（期日: 2024-12-31）
# [完了] 読書（期日: 2024-11-30）

print(f"完了: {manager.completed_count}件 / 未完了: {manager.pending_count}件")
# 期待: 完了: 1件 / 未完了: 1件

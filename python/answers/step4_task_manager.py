# Step 4: TaskManager クラスを作る — 回答例
#
# 実行方法:
#   python answers/step4_task_manager.py

from __future__ import annotations

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


class TaskManager:
    # Task のリストを private で持つことで、外部から直接リストを操作させない（カプセル化）
    # tasks を追加・削除・検索する操作はすべてこのクラスのメソッド経由に統一する
    def __init__(self) -> None:
        self.__tasks: list[Task] = []

    # Task オブジェクトを受け取って管理下に加える
    # 「TaskManager が Task を持つ」関係 = has-a 関係（コンポジション）
    def add_task(self, task: Task) -> None:
        self.__tasks.append(task)

    # タイトルで絞り込んだ新しいリストで上書きすることで削除を実現する
    # TypeScript の filter() と同様の考え方: 意図が明確になる
    def remove_task(self, title: str) -> None:
        self.__tasks = [t for t in self.__tasks if t.title != title]

    # 見つからない場合は None を返す型にすることで、
    # 呼び出し側が「見つからないケース」を意識して扱えるようになる
    # TypeScript の Task | undefined に相当する Task | None
    def find_task(self, title: str) -> Task | None:
        return next((t for t in self.__tasks if t.title == title), None)

    def display_all(self) -> None:
        for task in self.__tasks:
            task.display()

    # @property にすることで manager.completed_count と自然に読め、
    # 将来集計ロジックが変わっても呼び出し側のコードは変わらない
    @property
    def completed_count(self) -> int:
        return sum(1 for t in self.__tasks if t.completed)

    @property
    def pending_count(self) -> int:
        return sum(1 for t in self.__tasks if not t.completed)


# --- 動作確認 ---
manager = TaskManager()

manager.add_task(Task("買い物", "2024-12-31"))
manager.add_task(Task("読書", "2024-11-30"))
manager.add_task(Task("運動", "2024-10-15"))

print("--- 全タスク ---")
manager.display_all()

found = manager.find_task("読書")
if found:
    found.complete()

manager.remove_task("運動")

print("\n--- 更新後 ---")
manager.display_all()

print(f"完了: {manager.completed_count}件 / 未完了: {manager.pending_count}件")

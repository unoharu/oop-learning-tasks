# Step 1: Taskクラス — 回答例
#
# 実行方法:
#   python answers/step1_task.py

class Task:
    # __init__ は TypeScript の constructor に相当する
    # self は TypeScript の this に相当し、常に第1引数として書く（呼び出し時は不要）
    def __init__(self, title: str, due_date: str) -> None:
        self.title = title
        self.due_date = due_date
        # 新しく作ったタスクは必ず未完了からスタートするため、引数では受け取らず固定値で初期化する
        self.completed = False

    # 完了状態への変更だけを担うメソッドにすることで、
    # 「タスクを完了にする」という操作が1箇所に集まり、後から変更しやすくなる
    def complete(self) -> None:
        self.completed = True

    # 表示ロジックをクラスの中に持つことで、
    # 呼び出し側は task.display() と書くだけでよくなる（表示の詳細を知らなくてよい）
    def display(self) -> None:
        status = "完了" if self.completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）")


# --- 動作確認 ---
task1 = Task("買い物", "2024-12-31")
task1.complete()
task1.display()  # [完了] 買い物（期日: 2024-12-31）

task2 = Task("読書", "2024-11-30")
task2.display()  # [未完了] 読書（期日: 2024-11-30）

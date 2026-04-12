# Step 2: アクセス制御を追加する — 回答例
#
# 実行方法:
#   python answers/step2_access.py

class Task:
    def __init__(self, title: str, due_date: str) -> None:
        self.title = title
        self.due_date = due_date
        # __ プレフィックス（名前マングリング）により、クラス外から
        # task.__completed ではアクセスできなくなる（AttributeError になる）。
        #
        # TypeScript の private との違い:
        #   TypeScript: コンパイラが完全に強制する。task.completed = false と書くとコンパイルエラー
        #   Python: task._Task__completed = False と書くと通ってしまう（名前マングリングの実態）
        #
        # Python は「完全な強制」ではなく「慣習による合意」でカプセル化する言語。
        # __ を見たら「このプロパティに直接触れないでください」というシグナルとして受け取る。
        self.__completed: bool = False

    def complete(self) -> None:
        # クラス内部からは self.__completed で正常にアクセスできる
        # 「完了にする」という操作をメソッドに限定することで、
        # 将来「完了時に通知を送る」などの処理を追加しやすくなる
        self.__completed = True

    def display(self) -> None:
        status = "完了" if self.__completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）")


# --- 動作確認 ---
task = Task("買い物", "2024-12-31")
task.display()  # [未完了] 買い物（期日: 2024-12-31）

task.complete()
task.display()  # [完了] 買い物（期日: 2024-12-31）

# task.__completed = False         # AttributeError: 'Task' object has no attribute '__completed'
# task._Task__completed = False    # これは動く（Python の名前マングリングの実態）

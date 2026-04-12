# Step 3: @property / @setter を実装する — 回答例
#
# 実行方法:
#   python answers/step3_getter_setter.py

class Task:
    def __init__(self, title: str, due_date: str) -> None:
        self.title = title
        self.due_date = due_date
        # @property のバッキングストアには慣習的に _ をつける
        # getter / setter と名前が衝突しないようにするためでもある
        self._completed: bool = False

    @property
    def completed(self) -> bool:
        # TypeScript の get completed(): boolean と同等
        # task.completed と書くだけで呼び出せる（メソッドに見えない）
        return self._completed

    @completed.setter
    def completed(self, value: bool) -> None:
        # TypeScript の set completed(value: boolean) と同等
        # setter があることで task.completed = True と書ける
        # setter を定義しなければ読み取り専用になる（TypeScript の readonly に相当）
        #
        # setter でバリデーションを挟むことで不正な状態遷移を防ぐ
        # 「完了 → 未完了」への変更を禁止することで、タスクの状態が逆戻りしない保証を持てる
        if self._completed and not value:
            raise ValueError("完了済みのタスクを未完了に戻すことはできません")
        self._completed = value

    @property
    def completion_rate(self) -> int:
        # setter を定義しないため、外部からは読み取り専用になる
        # TypeScript の readonly getter に相当
        # @property はプロパティのように見えるが、呼ばれるたびに計算できる
        # 将来タスクにサブタスクが増えても、この getter だけ修正すれば呼び出し側は変わらない
        return 100 if self._completed else 0

    def display(self) -> None:
        status = "完了" if self._completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）完了率: {self.completion_rate}%")


# --- 動作確認 ---
task = Task("買い物", "2024-12-31")
task.display()  # [未完了] 買い物（期日: 2024-12-31）完了率: 0%

task.completed = True
task.display()  # [完了] 買い物（期日: 2024-12-31）完了率: 100%

# setter のバリデーション確認
try:
    task.completed = False  # 完了済みを未完了に戻そうとするとエラー
except ValueError as e:
    print(e)  # 完了済みのタスクを未完了に戻すことはできません

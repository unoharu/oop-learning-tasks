# Step 3: @property / @setter を実装する
# 学ぶ概念：@property デコレータ、バリデーション、カプセル化
#
# 実行方法:
#   python src/step3_getter_setter.py

class Task:
    def __init__(self, title: str, due_date: str) -> None:
        self.title = title
        self.due_date = due_date
        # TODO: _completed を private プロパティとして定義する
        #   慣習として @property のバッキングストアには _ をつける（例: _completed）
        #   getter / setter と名前が衝突しないようにするためでもある
        #   self._completed = False と初期化する
        self._completed = False  # ← ここは提供済み

    # TODO: completed の getter を実装する
    #   @property デコレータを使う
    #   TypeScript の get completed(): boolean に相当する
    #   呼び出し方は task.completed（メソッドに見えない）
    #
    #   @property
    #   def completed(self) -> bool:
    #       return self._completed

    # TODO: completed の setter を実装する
    #   @completed.setter デコレータを使う
    #   TypeScript の set completed(value: boolean) に相当する
    #   「すでに完了済み（_completed が True）なのに False に戻そうとしている」場合はエラーをスローする
    #   エラー文言: "完了済みのタスクを未完了に戻すことはできません"
    #   ヒント: raise ValueError("...") でエラーをスローできる（TypeScript の throw new Error に相当）

    # TODO: completion_rate の getter を実装する（setter なし = 読み取り専用）
    #   完了していれば 100、未完了なら 0 を返す
    #   setter を定義しなければ読み取り専用になる（TypeScript の readonly getter に相当）

    def display(self) -> None:
        status = "完了" if self.completed else "未完了"
        print(f"[{status}] {self.title}（期日: {self.due_date}）完了率: {self.completion_rate}%")


# --- 動作確認 ---
task = Task("買い物", "2024-12-31")
task.display()  # 期待: [未完了] 買い物（期日: 2024-12-31）完了率: 0%

task.completed = True
task.display()  # 期待: [完了] 買い物（期日: 2024-12-31）完了率: 100%

# 以下のコメントを外すと ValueError がスローされることを確認する
# task.completed = False  # 一度完了したタスクを未完了に戻そうとするとエラー

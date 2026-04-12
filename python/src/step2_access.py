# Step 2: アクセス制御を追加する
# 学ぶ概念：アクセス制御の慣習、カプセル化の入口
#
# 実行方法:
#   python src/step2_access.py
#
# ※ Python には TypeScript のような完全な private 修飾子はありません。
#   代わりに「__ (ダブルアンダースコア) プレフィックス」を使った名前マングリングで
#   外部からの直接アクセスを制限します。
#   TypeScript の private とは違い「完全な強制」ではなく「慣習による合意」ですが、
#   このステップでその違いを体験します。

class Task:
    # TODO: __init__ を実装する
    #   - title: str — 外部から読み書きできる（プレフィックスなし）
    #   - due_date: str — 外部から読み書きできる（プレフィックスなし）
    #   - completed: bool — 外部から直接変更させたくない
    #     __ プレフィックス（名前マングリング）を使う: self.__completed = False
    def __init__(self, title: str, due_date: str) -> None:
        pass

    def complete(self) -> None:
        # TODO: self.__completed を True にする
        pass

    def display(self) -> None:
        # TODO: [完了] または [未完了] とともにタイトルと期日を出力する
        pass


# --- 動作確認 ---
task = Task("買い物", "2024-12-31")
task.display()  # 期待: [未完了] 買い物（期日: 2024-12-31）

task.complete()
task.display()  # 期待: [完了] 買い物（期日: 2024-12-31）

# 以下の行のコメントを外してどうなるか試してみよう（TypeScript との違いを確認）
# task.__completed = False      # AttributeError: '__completed' はこの名前で存在しない（名前マングリングの効果）
# task._Task__completed = False # ←これは動いてしまう（Python の限界 — TypeScript の private との差）

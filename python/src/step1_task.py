# Step 1: Taskクラスを実装してください
# 学ぶ概念：クラス、インスタンス、コンストラクタ（__init__）、メソッド
#
# 実行方法:
#   python src/step1_task.py

class Task:
    # TODO: __init__ メソッドを実装する
    #   - title と due_date を引数で受け取る
    #   - completed の初期値は False にする
    #   ヒント: def __init__(self, title: str, due_date: str) -> None:
    def __init__(self):
        pass

    # TODO: タスクを完了にするメソッドを実装する
    def complete(self) -> None:
        pass

    # TODO: タスクの内容をコンソールに出力するメソッドを実装する
    #   completed の値によって "[完了]" / "[未完了]" を切り替える
    #   出力例（完了時）:  [完了] 買い物（期日: 2024-12-31）
    #   出力例（未完了時）: [未完了] 読書（期日: 2024-11-30）
    #   ヒント: f文字列（f"..."）を使う
    def display(self) -> None:
        pass


# --- 動作確認 ---
# 以下のコードを変更せずに、上のクラスを実装して期待通りの出力になるか確認してください

task1 = Task("買い物", "2024-12-31")
task1.complete()
task1.display()  # 期待: [完了] 買い物（期日: 2024-12-31）

task2 = Task("読書", "2024-11-30")
task2.display()  # 期待: [未完了] 読書（期日: 2024-11-30）

// 将来的に /chat/[sessionId] への直接アクセスをサポートする場合の拡張ポイント
// 現在は LP の useChat フックから起動するため未使用

import { redirect } from "next/navigation";

export default function ChatPage() {
  redirect("/");
}

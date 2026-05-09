const CRISIS_KEYWORDS = [
  "死にたい",
  "消えたい",
  "自殺",
  "自傷",
  "リスカ",
  "首を吊",
  "飛び降り",
  "もう生きていたくない",
  "終わりにしたい",
  "死んでしまいたい",
  "生きていたくない",
  "消えてしまいたい",
  "死ぬ",
  "死にそう",
  "消えたほうがいい",
  "消えた方がいい",
  "いなくなりたい",
  "自分を傷つけたい",
  "もう無理",
  "全部終わらせたい",
];

export function detectCrisis(text: string): boolean {
  const normalized = text.normalize("NFKC").trim().toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function getCrisisResponse(): string {
  return `今、とても苦しい状態なんですね。
ここで話してくれてありがとうございます。

もし、ひとりでは抱えきれないほど苦しい時は、
近くの人や地域の相談窓口につながる選択肢もあります。

ここでは、あなたの気持ちを否定せずに受け止めます。`;
}

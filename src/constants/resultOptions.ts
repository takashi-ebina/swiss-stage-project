import { Result } from "@/models/result";

export const resultOptions: Result[] = [
  new Result("", -1),
  new Result("勝", 1),
  new Result("負", 0),
  new Result("ジゴ", 0.5)
];
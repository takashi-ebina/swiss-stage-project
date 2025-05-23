import { Result } from "@/models/result";

export const resultOptions: Result[] = [
  new Result("", -1),
  new Result("○", 1),
  new Result("×", 0),
  new Result("△", 0.5)
];
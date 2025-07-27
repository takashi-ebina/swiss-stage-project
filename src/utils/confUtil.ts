import { ConfInfo } from "@/models/confInfo";

const getValue = (confInfo: ConfInfo[], key: string): string => {
  const conf = confInfo.find(item => item.key === key);
  return conf ? conf.value : "";
}

export const confUtil = {
  getValue
}
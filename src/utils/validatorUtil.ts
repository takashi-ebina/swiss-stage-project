import { Profile } from "@/models/profile";

const checkLength = (maxLength: number) => {
    return (value: string) => value.length <= maxLength || `最大 ${maxLength} 文字です`;
};

/**
 * 登録するプレイヤーの入力値をチェックする
 * @returns {boolean} 入力値に問題ない場合はtrue、それ以外の場合はfalseを返却する
 */
const validateProfiles = (profiles: Profile[]): boolean => {
    for (const profile of profiles) {
      const hasName = profile.name.trim() !== "";
      const hasRank = profile.rank.name.trim() !== "";
  
      if ((hasName && !hasRank) || (!hasName && hasRank)) {
        return false;
      }
    }
    return true;
  };

export const validatorUtil = {
    checkOrganizationLength: checkLength(30),
    checkNameLength: checkLength(20),
    checkTitleLength: checkLength(30),
    validateProfiles: validateProfiles
};


const MissionUtils = require('@woowacourse/mission-utils');
const Coach = require('./Coach');
const { PRINT_STRING, PRINT_ERROR_STRING } = require('./constants');
const SAMPLE = {
  일식: '규동, 우동, 미소시루, 스시, 가츠동, 오니기리, 하이라이스, 라멘, 오코노미야끼',
  한식: '김밥, 김치찌개, 쌈밥, 된장찌개, 비빔밥, 칼국수, 불고기, 떡볶이, 제육볶음',
  중식: '깐풍기, 볶음면, 동파육, 짜장면, 짬뽕, 마파두부, 탕수육, 토마토 달걀볶음, 고추잡채',
  아시안:
    '팟타이, 카오 팟, 나시고렝, 파인애플 볶음밥, 쌀국수, 똠얌꿍, 반미, 월남쌈, 분짜',
  양식: '라자냐, 그라탱, 뇨끼, 끼슈, 프렌치 토스트, 바게트, 스파게티, 피자, 파니니',
};

class App {
  #coaches;
  #currentBanCoachIndex;
  constructor() {
    this.namesCallback = this.namesCallback.bind(this);
    this.categories = [];
  }

  printRecommendedStart() {
    MissionUtils.Console.print(PRINT_STRING.OUTPUT_GAME_START);
  }

  readCoachName(callback) {
    MissionUtils.Console.readLine(PRINT_STRING.INPUT_COACH_NAME, callback);
  }

  readBanMenus(coachName, callback) {
    MissionUtils.Console.readLine(
      PRINT_STRING.INPUT_NOT_FOOD(coachName),
      callback
    );
  }

  namesCallback(coachName) {
    const coachArray = coachName.split(',');
    try {
      this.validateNames(coachArray);
      this.handleNames(coachArray);
    } catch (error) {
      MissionUtils.Console.print(error.message);
      this.readCoachName(this.namesCallback);
    }
  }

  handleNames(coachArray) {
    this.#coaches = [];
    for (let i = 0; i < coachArray.length; i++) {
      this.#coaches.push(new Coach(coachArray[i]));
    }
    this.#currentBanCoachIndex = 0;
    this.readBanMenus(
      this.#coaches[this.#currentBanCoachIndex].getName(),
      this.banMenusCallback
    );
  }

  banMenusCallback(banMenus) {
    const banMenusArray = banMenus.split(',');
    try {
      this.validateBanMenus(banMenusArray);
      this.handleBanMenus(banMenusArray);
    } catch {
      this.readBanMenus(
        this.#coaches[this.#currentBanCoachIndex].getName(),
        this.banMenusCallback
      );
    }
  }

  handleBanMenus(banMenusArray) {
    this.#coaches[this.#currentBanCoachIndex].addBanMenus(banMenusArray);
    if (this.currentBanCoachIndex < this.#coaches.length - 1) {
      this.currentBanCoachIndex += 1;
      this.readBanMenus(
        this.#coaches[this.#currentBanCoachIndex].getName(),
        this.banMenusCallback
      );
    } else {
      this.decideCategories();
    }
  }

  validateNames(coachArray) {
    for (let i = 0; i < coachArray.length; i++) {
      if (!(coachArray[i].length > 1 && coachArray[i].length < 5)) {
        throw Error(PRINT_ERROR_STRING.COACH_NAME_LENGTH);
      }
    }

    let setCoachArray = new Set(coachArray);
    if (setCoachArray.size !== coachArray.length)
      throw Error(PRINT_ERROR_STRING.COACH_NAME_DUPLE);

    if (!(coachArray.length >= 2 && coachArray.length <= 5))
      throw Error(PRINT_ERROR_STRING.COACH_NAME_NUMBER);
  }

  validateBanMenus(notFoodArray) {}

  play() {
    this.printRecommendedStart();
    this.readCoachName(this.namesCallback);
  }
}

module.exports = App;

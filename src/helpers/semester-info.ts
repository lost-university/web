const isSpringSemester = (date: Date) => {
  const month = date.getMonth();
  return month > 1 && month < 8;
}

export class SemesterInfo {
  readonly isSpringSemester: boolean;
  readonly year: number;

  constructor(springSemester: boolean, year: number) {
    this.isSpringSemester = springSemester;
    this.year = year;
  }

  static now() {
    const now = new Date();
    return new SemesterInfo(isSpringSemester(now), now.getFullYear());
  }

  static lastSpringSemester() {
    const currentSemester = SemesterInfo.now();

    if (currentSemester.isSpringSemester) {
      return currentSemester;
    }

    return currentSemester.minus(1);
  }

  static lastAutumnSemester() {
    const currentSemester = SemesterInfo.now();

    if (!currentSemester.isSpringSemester) {
      return currentSemester;
    }

    return currentSemester.minus(1);
  }

  static parse(text: string) {
    if (text.length !== 4) return null;

    const prefix = text.substring(0, 2);
    const suffix = text.substring(2);

    const parsedSuffix = parseInt(suffix);
    if (isNaN(parsedSuffix)) return null;

    const year = parsedSuffix + 2000;

    switch (prefix) {
      case "FS":
        return new SemesterInfo(true, year);
      case "HS":
        return new SemesterInfo(false, year);
      default:
        return null;
    }
  }

  toString() {
    const prefix = this.isSpringSemester ? "FS" : "HS";
    const suffix = this.year.toString().substring(2);

    return prefix + suffix;
  }

  plus(count: number) {
    const years = Math.floor(count / 2);

    if (count % 2 === 0) {
      return new SemesterInfo(this.isSpringSemester, this.year + years);
    } else if (this.isSpringSemester) {
      return new SemesterInfo(false, this.year + years);
    } else {
      return new SemesterInfo(true, this.year + years + 1);
    }
  }

  minus(count: number) {
    const years = Math.floor(count / 2);

    if (count % 2 === 0) {
      return new SemesterInfo(this.isSpringSemester, this.year - years);
    } else if (this.isSpringSemester) {
      return new SemesterInfo(false, this.year - years - 1);
    } else {
      return new SemesterInfo(true, this.year - years);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equals(other: any) {
    if (other === undefined) return false;

    if (other instanceof SemesterInfo) {
      return this.isSpringSemester === other.isSpringSemester && this.year === other.year;
    }

    return false;
  }

  difference(other: SemesterInfo) {
    const years = this.year - other.year;

    if (this.isSpringSemester == other.isSpringSemester) {
      return years * 2;
    } else if (this.isSpringSemester && !other.isSpringSemester) {
      return years * 2 - 1;
    } else {
      return years * 2 + 1;
    }
  }
}

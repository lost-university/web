const isSpringSemester = (date: Date) => {
  const month = date.getMonth();
  return month > 1 && month < 8;
}

export class SemesterInfo {
  readonly springSemester: boolean;
  readonly year: number;

  constructor(springSemester: boolean, year: number) {
    this.springSemester = springSemester;
    this.year = year;
  }

  static now() {
    const now = new Date();
    return new SemesterInfo(isSpringSemester(now), now.getFullYear());
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
    const prefix = this.springSemester ? "FS" : "HS";
    const suffix = this.year.toString().substring(2);

    return prefix + suffix;
  }

  addSemesters(count: number) {
    const years = Math.floor(count / 2);

    if (count % 2 === 0) {
      return new SemesterInfo(this.springSemester, this.year + years);
    } else if (this.springSemester) {
      return new SemesterInfo(false, this.year + years);
    } else {
      return new SemesterInfo(true, this.year + years + 1);
    }
  }

  removeSemesters(count: number) {
    const years = Math.floor(count / 2);

    if (count % 2 === 0) {
      return new SemesterInfo(this.springSemester, this.year - years);
    } else if (this.springSemester) {
      return new SemesterInfo(false, this.year - years - 1);
    } else {
      return new SemesterInfo(true, this.year - years);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equals(other: any) {
    if (other === undefined) return false;

    if (other instanceof SemesterInfo) {
      return this.springSemester === other.springSemester && this.year === other.year;
    }

    return false;
  }

  difference(other: SemesterInfo) {
    const years = this.year - other.year;

    if (this.springSemester && other.springSemester) {
      return years * 2;
    } else if (this.springSemester && !other.springSemester) {
      return years * 2 - 1;
    } else {
      return years * 2 + 1;
    }
  }
}

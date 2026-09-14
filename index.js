import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const [startDateArg, endDateArg, commitCountArg] = process.argv.slice(2);
const startDate = startDateArg
  ? moment.utc(startDateArg, "YYYY-MM-DD", true).startOf("day")
  : moment().subtract(1, "y").add(1, "d").startOf("day");
const endDate = endDateArg
  ? moment.utc(endDateArg, "YYYY-MM-DD", true).endOf("day")
  : moment().endOf("day");
const commitCount = commitCountArg ? Number(commitCountArg) : 100;

if (!startDate.isValid() || !endDate.isValid() || endDate.isBefore(startDate)) {
  throw new Error("Use a valid date range: YYYY-MM-DD YYYY-MM-DD");
}

if (!Number.isInteger(commitCount) || commitCount < 0) {
  throw new Error("Commit count must be a non-negative integer");
}

const makeCommits = (n) => {
  if(n===0) return simpleGit().push();
  const daysInRange = endDate.diff(startDate, "days");
  const date = startDate.clone().add(random.int(0, daysInRange), "days").format();

  const data = {
    date: date,
  };
  console.log(date);
  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date },makeCommits.bind(this,--n));
  });
};

makeCommits(commitCount);

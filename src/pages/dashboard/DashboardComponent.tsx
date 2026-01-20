// Barrel file: re-export all dashboard components from a single entry point.
// This file imports the components (written as .jsx files) and exports them
// as named exports so other parts of the app can do:
// import { TotalIncome, JarList } from './pages/dashboard/DashboardComponent'

import { IncomeOutcomeBar } from "./IncomeOutcomeBar";
import { JarDistributionPie } from "./JarDistributionPie";
import { JarList } from "./JarList";
import { TotalBalance } from "./TotalBalance";
import { TotalIncome } from "./TotalIncome";
import { TotalOutcome } from "./TotalOutcome";

export {
  IncomeOutcomeBar,
  JarDistributionPie,
  JarList,
  TotalIncome,
  TotalBalance,
  TotalOutcome,
};

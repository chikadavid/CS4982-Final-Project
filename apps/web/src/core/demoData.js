/**
 * Demo Datasets for Algorithm Testing
 *
 * Six carefully designed scenarios ranging from simple to complex:
 * 1-3: Research scenarios (simple)
 * 4-6: Complex real-world scenarios (for demonstrations)
 */

/**
 * Scenario 1: Feasible Case
 * Both baseline and cash-aware schedulers should complete successfully
 * Initial cash: $100
 */
export const feasibleCase = {
  name: "Feasible Case (Both Work)",
  initialCash: 100,
  tasks: [
    {
      id: "Materials",
      cost: 40,
      revenue: 0,
      deps: [],
    },
    {
      id: "Production",
      cost: 30,
      revenue: 0,
      deps: ["Materials"],
    },
    {
      id: "Marketing",
      cost: 20,
      revenue: 0,
      deps: [],
    },
    {
      id: "Sales",
      cost: 10,
      revenue: 200,
      deps: ["Production", "Marketing"],
    },
  ],
};

/**
 * Scenario 2: Cash Problem
 * Baseline scheduler will go negative, but cash-aware will succeed
 * by reordering tasks to build capital first
 * Initial cash: $100
 *
 * Key insight: Task A is expensive ($120) but profitable.
 * Baseline might schedule it first, causing negative cash.
 * Cash-aware will do B first to build capital.
 */
export const cashProblem = {
  name: "Cash Problem (Baseline Fails, Cash-Aware Succeeds)",
  initialCash: 100,
  tasks: [
    {
      id: "A",
      cost: 120,
      revenue: 200,
      deps: [],
    },
    {
      id: "B",
      cost: 30,
      revenue: 80,
      deps: [],
    },
    {
      id: "C",
      cost: 40,
      revenue: 100,
      deps: ["A", "B"],
    },
  ],
};

/**
 * Scenario 3: Deadlock Case
 * Insufficient initial capital - both schedulers will fail
 * Initial cash: $30
 *
 * All available tasks cost more than initial cash.
 * Demonstrates deadlock detection.
 */
export const deadlockCase = {
  name: "Deadlock (Insufficient Capital)",
  initialCash: 30,
  tasks: [
    {
      id: "X",
      cost: 50,
      revenue: 100,
      deps: [],
    },
    {
      id: "Y",
      cost: 60,
      revenue: 120,
      deps: [],
    },
    {
      id: "Z",
      cost: 40,
      revenue: 80,
      deps: ["X"],
    },
  ],
};

/**
 * Scenario 4: Software Product Launch (Complex - 15 tasks)
 */
export const softwareLaunchCase = {
  name: "🚀 SaaS Product Launch (15 tasks)",
  initialCash: 5000,
  tasks: [
    { id: "MarketResearch", cost: 800, revenue: 0, deps: [] },
    { id: "TechSetup", cost: 1200, revenue: 0, deps: [] },
    { id: "HireDesigner", cost: 2000, revenue: 0, deps: [] },
    { id: "CoreDev", cost: 3500, revenue: 0, deps: ["TechSetup"] },
    {
      id: "UIDesign",
      cost: 1500,
      revenue: 0,
      deps: ["MarketResearch", "HireDesigner"],
    },
    {
      id: "FrontendDev",
      cost: 2800,
      revenue: 0,
      deps: ["UIDesign", "CoreDev"],
    },
    { id: "BetaTesting", cost: 600, revenue: 500, deps: ["CoreDev"] },
    { id: "ContentCreation", cost: 900, revenue: 0, deps: ["MarketResearch"] },
    { id: "BrandingPackage", cost: 1100, revenue: 0, deps: ["UIDesign"] },
    {
      id: "SEOCampaign",
      cost: 700,
      revenue: 1200,
      deps: ["ContentCreation", "BrandingPackage"],
    },
    {
      id: "SocialMediaAds",
      cost: 1500,
      revenue: 2800,
      deps: ["BrandingPackage"],
    },
    {
      id: "QualityAssurance",
      cost: 800,
      revenue: 0,
      deps: ["FrontendDev", "BetaTesting"],
    },
    {
      id: "LaunchEvent",
      cost: 2000,
      revenue: 5000,
      deps: ["QualityAssurance", "SEOCampaign", "SocialMediaAds"],
    },
    {
      id: "CustomerOnboarding",
      cost: 600,
      revenue: 3500,
      deps: ["LaunchEvent"],
    },
    {
      id: "PartnerIntegrations",
      cost: 1200,
      revenue: 4000,
      deps: ["LaunchEvent"],
    },
  ],
};

/**
 * Scenario 5: Construction Project (Complex - 18 tasks)
 */
export const constructionCase = {
  name: "🏗️ Building Construction (18 tasks)",
  initialCash: 50000,
  tasks: [
    { id: "LandSurvey", cost: 5000, revenue: 0, deps: [] },
    { id: "ArchitectPlans", cost: 12000, revenue: 0, deps: [] },
    {
      id: "BuildingPermit",
      cost: 8000,
      revenue: 0,
      deps: ["LandSurvey", "ArchitectPlans"],
    },
    { id: "SiteClearing", cost: 15000, revenue: 0, deps: ["BuildingPermit"] },
    {
      id: "UtilityConnections",
      cost: 18000,
      revenue: 0,
      deps: ["BuildingPermit"],
    },
    {
      id: "Foundation",
      cost: 35000,
      revenue: 0,
      deps: ["SiteClearing", "UtilityConnections"],
    },
    {
      id: "FoundationInspection",
      cost: 2000,
      revenue: 0,
      deps: ["Foundation"],
    },
    { id: "Framing", cost: 45000, revenue: 0, deps: ["FoundationInspection"] },
    { id: "HVAC", cost: 28000, revenue: 0, deps: ["Framing"] },
    { id: "Electrical", cost: 22000, revenue: 0, deps: ["Framing"] },
    { id: "Plumbing", cost: 19000, revenue: 0, deps: ["Framing"] },
    {
      id: "Insulation",
      cost: 12000,
      revenue: 0,
      deps: ["HVAC", "Electrical", "Plumbing"],
    },
    { id: "Drywall", cost: 16000, revenue: 0, deps: ["Insulation"] },
    { id: "Flooring", cost: 20000, revenue: 0, deps: ["Drywall"] },
    { id: "Painting", cost: 8000, revenue: 0, deps: ["Drywall"] },
    { id: "Landscaping", cost: 10000, revenue: 0, deps: ["Painting"] },
    {
      id: "FinalInspection",
      cost: 3000,
      revenue: 0,
      deps: ["Flooring", "Painting", "Landscaping"],
    },
    {
      id: "BuildingSale",
      cost: 5000,
      revenue: 400000,
      deps: ["FinalInspection"],
    },
  ],
};

/**
 * Scenario 6: Supply Chain Management (Complex - 16 tasks)
 */
export const supplyChainCase = {
  name: "📦 Supply Chain (16 tasks)",
  initialCash: 8000,
  tasks: [
    { id: "NegotiateSteel", cost: 500, revenue: 0, deps: [] },
    { id: "NegotiatePlastics", cost: 400, revenue: 0, deps: [] },
    { id: "NegotiateElectronics", cost: 600, revenue: 0, deps: [] },
    { id: "OrderSteel", cost: 5000, revenue: 0, deps: ["NegotiateSteel"] },
    {
      id: "OrderPlastics",
      cost: 2000,
      revenue: 0,
      deps: ["NegotiatePlastics"],
    },
    {
      id: "OrderElectronics",
      cost: 3500,
      revenue: 0,
      deps: ["NegotiateElectronics"],
    },
    { id: "WarehouseSetup", cost: 4000, revenue: 0, deps: [] },
    {
      id: "SteelFabrication",
      cost: 2500,
      revenue: 0,
      deps: ["OrderSteel", "WarehouseSetup"],
    },
    {
      id: "PlasticMolding",
      cost: 1800,
      revenue: 0,
      deps: ["OrderPlastics", "WarehouseSetup"],
    },
    {
      id: "ElectronicsAssembly",
      cost: 2200,
      revenue: 0,
      deps: ["OrderElectronics", "WarehouseSetup"],
    },
    {
      id: "FinalAssembly",
      cost: 3000,
      revenue: 0,
      deps: ["SteelFabrication", "PlasticMolding", "ElectronicsAssembly"],
    },
    { id: "QualityControl", cost: 1200, revenue: 0, deps: ["FinalAssembly"] },
    { id: "Packaging", cost: 800, revenue: 0, deps: ["QualityControl"] },
    { id: "RetailerSales", cost: 1000, revenue: 18000, deps: ["Packaging"] },
    { id: "DirectSales", cost: 1500, revenue: 12000, deps: ["Packaging"] },
    {
      id: "InternationalExport",
      cost: 2500,
      revenue: 15000,
      deps: ["Packaging"],
    },
  ],
};

/**
 * All demo datasets
 */
export const allDatasets = [
  feasibleCase,
  cashProblem,
  deadlockCase,
  softwareLaunchCase,
  constructionCase,
  supplyChainCase,
];

/**
 * Get dataset by name
 * @param {"feasible" | "cashProblem" | "deadlock" | "softwareLaunch" | "construction" | "supplyChain"} name
 */
export function getDataset(name) {
  switch (name) {
    case "feasible":
      return feasibleCase;
    case "cashProblem":
      return cashProblem;
    case "deadlock":
      return deadlockCase;
    case "softwareLaunch":
      return softwareLaunchCase;
    case "construction":
      return constructionCase;
    case "supplyChain":
      return supplyChainCase;
    default:
      return feasibleCase;
  }
}

export const legalMatters: Record<string, LegalMatter> = {
  general: {
    scenarios: [
      "Criminal and traffic charges in the Magistrates' Court of Victoria",
      "Centrelink matters",
      "Infringements",
      "Motor vehicle accidents (where the client is uninsured)",
      "Intervention orders - Family Violence and Personal Safety",
      "Rental disputes (where the client is a renter)"
    ],
    vocabulary: [
      "defendant", "plaintiff", "charge", "offence", "plea", "bail", "remand",
      "infringement", "fine", "penalty", "appeal", "hearing", "magistrate",
      "intervention order", "applicant", "respondent", "lease", "tenant", "landlord"
    ]
  },
  family: {
    scenarios: [
      "Divorce",
      "Family violence intervention orders",
      "Parenting dispute matters",
      "Property (including superannuation splits), spousal maintenance and adult child maintenance matters",
      "Contravention applications",
      "Location orders",
      "Enforcement orders",
      "Change of name",
      "Child's passport and/or travel applications",
      "Applications for parental responsibility where a child's primary carer has died",
      "Applications by a non-biological parent for parental responsibility"
    ],
    vocabulary: [
      "divorce", "separation", "custody", "visitation", "child support",
      "alimony", "property settlement", "mediation", "family court",
      "parenting plan", "consent orders", "domestic violence", "intervention order"
    ]
  },
  tax: {
    scenarios: [
      "Tax debts, including advice about payment plans and applying for a reduction of interest and/or penalties",
      "Dealing with correspondence from the Australian Taxation Office",
      "Disagreements with an assessment of tax issued by the Australian Taxation Office",
      "Director Penalty Notices issued by the Australian Taxation Office",
      "Determining assessable income and allowable deductions",
      "Tax obligations (including advice about registering for an ABN, GST, PAYG withholding, income tax returns and Business Activity Statements)"
    ],
    vocabulary: [
      "tax return", "assessment", "audit", "deduction", "income", "GST",
      "ABN", "BAS", "PAYG", "tax debt", "payment plan", "penalty", "interest",
      "lodgment", "tax agent", "financial year", "taxable income"
    ]
  }
}
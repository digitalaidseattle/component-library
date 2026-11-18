const ProjectHelpUtils = {
  title: "Venture Evaluation Debriefs",
  dictionary: {
    "default": "Tracking venture evaluations, Fill this out at the close of every venture evaluation. Target: 30–45 minutes to complete. Keep it skimmable, not exhaustive.",
    "Info": "Change the description for easier tracking in the application.  A rating change can aid in selecting better projects.  Tags can help categorize projects.",
    "Contexts": "Information about your organization and project that will be included in the project conext.",
    "Template": "This template is filled with text and combined with the output parameters.",
    "Prompt": "This prompt template is filled with text using the input and output parameters.",
    "Outputs": "Guidance for output constraints.",
    "Tags": `
## Tags
Free-text supplement to the controlled fields above. New tag proposals go to the 3 Magi for monthly review.
### Domain
Fintech · Healthtech · Edtech · Climate/Energy · Consumer · Enterprise SaaS · Marketplace · Hardware/IoT · Other

### Capability area
Data/Analytics · AI/ML · Payments · Logistics/Supply Chain · Identity/Auth · Content/Media · Comms/Messaging · Other

### Tech stack (multi-select)
Web · Mobile (iOS/Android) · Cloud infra (AWS/GCP/Azure) · LLM/GenAI · Blockchain · Embedded/IoT · No-code/Low-code · Other

### Solution type
Build in-house · Buy/Vendor · Partner · Acquire · Open-source integration

### Outcome
Go · No-go · Pivot · Deferred
`,
  },
  DRAWER_WIDTH: 300
}

export { ProjectHelpUtils }
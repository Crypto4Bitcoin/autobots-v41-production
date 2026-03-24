export interface ResourceMetric {
  resourceId: string
  type: "compute" | "energy" | "storage"
  usage: number
  capacity: number
  intensity: number // e.g. CO2/kWh or efficiency
}

export class GlobalResourceSteward {
  private metrics = new Map<string, ResourceMetric>()

  async track(metric: ResourceMetric): Promise<void> {
    this.metrics.set(metric.resourceId, metric)
  }

  async getGlobalUsage(): Promise<number> {
    let total = 0
    this.metrics.forEach(m => total += m.usage)
    return total
  }

  async getEfficiencyScore(): Promise<number> {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    let totalUsage = 0
    let totalIntensity = 0
    this.metrics.forEach(m => {
      totalUsage += m.usage
      totalIntensity += m.intensity
    })
    return this.metrics.size > 0 ? totalIntensity / this.metrics.size : 1.0
  }
}
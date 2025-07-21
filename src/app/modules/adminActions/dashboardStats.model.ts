import { model, Schema } from 'mongoose';

const dashboardStatsSchema = new Schema({
  stats: {
    type: Object,
    required: true,
  },
  lastUpdatedAt: {
    type: Date,
    required: true,
  },
});

export const DashboardStats = model('DashboardStats', dashboardStatsSchema);

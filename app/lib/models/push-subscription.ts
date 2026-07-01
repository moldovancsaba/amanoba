/**
 * PushSubscription Model (#20)
 *
 * What: Stores a browser Web Push subscription for a player.
 * Why: Enables server-sent push notifications (the SW already handles 'push').
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPushSubscription extends Document {
  playerId: mongoose.Types.ObjectId;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    userAgent: { type: String },
  },
  { timestamps: true, strict: true, collection: 'push_subscriptions' }
);

const PushSubscription: Model<IPushSubscription> =
  mongoose.models.PushSubscription ||
  mongoose.model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);

export default PushSubscription;

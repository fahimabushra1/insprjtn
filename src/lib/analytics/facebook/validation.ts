import { z } from "zod";

export const MetaUserDataSchema = z.object({
  em: z.array(z.string()).optional(),
  ph: z.array(z.string()).optional(),
  fn: z.array(z.string()).optional(),
  ln: z.array(z.string()).optional(),
  client_ip_address: z.string().optional(),
  client_user_agent: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
}).passthrough();

export const MetaCustomDataSchema = z.object({
  value: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  content_name: z.string().optional(),
  content_category: z.string().optional(),
  content_ids: z.array(z.string()).optional(),
  content_type: z.string().optional(),
  contents: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().positive(),
      item_price: z.number().nonnegative().optional(),
    })
  ).optional(),
  num_items: z.number().int().nonnegative().optional(),
  search_string: z.string().optional(),
}).passthrough();

export const MetaEventPayloadSchema = z.object({
  event_name: z.string().min(1),
  event_time: z.number().int().positive(),
  event_id: z.string().min(1),
  event_source_url: z.string().url(),
  action_source: z.enum(["website", "app", "physical_store", "system_generated", "other"]),
  user_data: MetaUserDataSchema,
  custom_data: MetaCustomDataSchema.optional(),
  opt_out: z.boolean().optional(),
});

/**
 * Validates outgoing Meta CAPI event payloads.
 * 
 * @param payload The raw event payload to validate.
 */
export function validateMetaEvent(payload: unknown) {
  return MetaEventPayloadSchema.safeParse(payload);
}

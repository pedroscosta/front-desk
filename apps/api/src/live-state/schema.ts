import {
  boolean,
  createRelations,
  createSchema,
  id,
  object,
  reference,
  string,
  timestamp,
} from "@repo/live-state";

const organization = object("organization", {
  id: id(),
  name: string(),
  slug: string(),
  createdAt: timestamp(),
});

const organizationUser = object("organizationUser", {
  id: id(),
  organizationId: reference("organization.id"),
  userId: reference("user.id"),
  enabled: boolean().default(true),
});

const organizationRelations = createRelations(organization, ({ many }) => ({
  organizationUsers: many(organizationUser, "organizationId"),
}));

const organizationUserRelations = createRelations(
  organizationUser,
  ({ one }) => ({
    organization: one(organization, "organizationId"),
  })
);

export const schema = createSchema({
  organization,
  organizationUser,
  organizationUserRelations,
  organizationRelations,
});
